#!/usr/bin/env python3
"""
Middleware de Filtrado HTTP Inteligente (Portero de Seguridad)
Protege contra scraping masivo y bots maliciosos sin afectar el SEO.

Este middleware implementa:
- Lista blanca de crawlers legítimos (SEO, redes sociales)
- Detección de patrones de scraping automatizado
- Rate limiting básico por IP
- Logging de peticiones bloqueadas
- Compatible con ASGI/WSGI frameworks
"""

import re
import logging
import time
from collections import defaultdict
from typing import Dict, Set, Optional, Tuple
from urllib.parse import urlparse
import ipaddress

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('security_middleware.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class SecurityMiddleware:
    """
    Middleware de seguridad que filtra peticiones HTTP basándose en:
    - User-Agent validation
    - IP rate limiting
    - Pattern detection
    - Whitelist de crawlers legítimos
    """
    
    # Lista blanca de User-Agents legítimos (SEO y redes sociales)
    WHITELISTED_USER_AGENTS = {
        # Motores de búsqueda principales
        'googlebot', 'googlebot-image', 'googlebot-news', 'googlebot-video',
        'mediapartners-google', 'adsbot-google', 'bingbot', 'slurp',
        'duckduckbot', 'baiduspider', 'yandexbot', 'yandeximages',
        'sogou', 'exabot', 'facebot', 'ia_archiver',
        
        # Redes sociales y vistas previas de enlaces
        'facebookexternalhit', 'twitterbot', 'linkedinbot', 'pinterest',
        'whatsapp', 'telegrambot', 'skypeuripreview', 'viber',
        
        # Herramientas de SEO legítimas
        'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
        
        # Monitoreo y verificación
        'uptimerobot', 'pingdom', 'statuscake', 'newrelicpingsynth',
        
        # Agregadores de contenido
        'feedfetcher-google', 'feedburner', 'netvibes',
    }
    
    # Patrones de User-Agents sospechosos (scrapers, bots genéricos)
    SUSPICIOUS_PATTERNS = [
        r'^python-',                    # Scripts Python genéricos
        r'^php/',                       # Scripts PHP genéricos
        r'^java/',                      # Scripts Java genéricos
        r'^curl/',                      # curl directo sin UA personalizado
        r'^wget/',                      # wget directo sin UA personalizado
        r'^libwww-perl',                # Perl scripts genéricos
        r'^lwp::simple',                # Perl scripts genéricos
        r'^go-http-client',             # Go clients genéricos
        r'^okhttp',                     # Android/Java clients genéricos
        r'^node/',                      # Node.js clients genéricos
        r'^axios/',                     # Axios clients genéricos
        r'^requests/',                  # Python requests genéricos
        r'^scrapy/',                    # Scrapy framework explícito
        r'^beautifulsoup',              # BeautifulSoup explícito
        r'^selenium',                   # Selenium explícito
        r'^headlesschrome',             # Headless Chrome explícito
        r'^phantomjs',                  # PhantomJS explícito
        r'^casperjs',                   # CasperJS explícito
        r'^mechanize',                  # Mechanize explícito
        r'^httpclient',                 # Generic HTTP clients
        r'^apachelucene',               # Apache Lucene (posible scraper)
        r'^jakarta',                    # Jakarta HTTP (posible scraper)
        r'^test/',                      # User agents de testing
        r'^bot$',                       # "bot" demasiado genérico
        r'^crawler$',                   # "crawler" demasiado genérico
        r'^spider$',                    # "spider" demasiado genérico
        r'^scraper$',                   # "scraper" explícito
        r'^harvest',                    # Harvesting tools
        r'^extract',                    # Extraction tools
        r'^grab',                       # Grabbing tools
        r'^monitor',                    # Generic monitoring
        r'^check',                      # Generic checking
        r'^scan',                       # Scanning tools
        r'^scan',                       # Scanning tools
    ]
    
    # Rutas sensibles que requieren protección extra
    SENSITIVE_PATHS = {
        '/admin', '/api/', '/login', '/checkout', '/payment',
        '/register', '/account', '/profile', '/settings'
    }
    
    # Límites de rate limiting
    RATE_LIMITS = {
        'default': 100,          # 100 peticiones por minuto por defecto
        'sensitive': 20,         # 20 peticiones por minuto para rutas sensibles
        'strict': 5,             # 5 peticiones por minuto para estricto
    }
    
    def __init__(self):
        # Rate limiting storage: {ip: [(timestamp, path), ...]}
        self.request_history: Dict[str, list] = defaultdict(list)
        self.request_counter: Dict[str, int] = defaultdict(int)
        self.window_start = time.time()
        
        # Compile regex patterns for performance
        self.suspicious_regex = [re.compile(pattern, re.IGNORECASE) 
                                for pattern in self.SUSPICIOUS_PATTERNS]
        
        logger.info("SecurityMiddleware inicializado correctamente")
    
    def is_whitelisted_user_agent(self, user_agent: str) -> bool:
        """
        Verifica si el User-Agent está en la lista blanca de crawlers legítimos.
        """
        if not user_agent:
            return False
        
        user_agent_lower = user_agent.lower()
        
        # Verificar coincidencia exacta o parcial con la lista blanca
        for whitelisted in self.WHITELISTED_USER_AGENTS:
            if whitelisted in user_agent_lower:
                logger.debug(f"User-Agent permitido (whitelist): {user_agent}")
                return True
        
        return False
    
    def is_suspicious_user_agent(self, user_agent: str) -> bool:
        """
        Detecta User-Agents sospechosos que podrían ser scrapers o bots maliciosos.
        """
        if not user_agent:
            return True  # Sin User-Agent es sospechoso
        
        user_agent_lower = user_agent.lower()
        
        # Verificar patrones sospechosos
        for pattern in self.suspicious_regex:
            if pattern.search(user_agent_lower):
                logger.debug(f"User-Agent sospechoso detectado: {user_agent}")
                return True
        
        return False
    
    def check_rate_limit(self, ip: str, path: str) -> Tuple[bool, str]:
        """
        Implementa rate limiting básico por IP.
        Retorna (permitido, motivo) donde motivo es la razón del bloqueo.
        """
        current_time = time.time()
        
        # Limpiar historial antiguo (más de 1 minuto)
        self.request_history[ip] = [
            (ts, p) for ts, p in self.request_history[ip] 
            if current_time - ts < 60
        ]
        
        # Determinar límite basado en la ruta
        limit = self.RATE_LIMITS['default']
        for sensitive_path in self.SENSITIVE_PATHS:
            if sensitive_path in path:
                limit = self.RATE_LIMITS['sensitive']
                break
        
        # Verificar límite
        if len(self.request_history[ip]) >= limit:
            return False, f"Rate limit excedido ({limit} req/min)"
        
        # Registrar esta petición
        self.request_history[ip].append((current_time, path))
        
        return True, ""
    
    def is_suspicious_request(self, user_agent: str, path: str, 
                             referer: Optional[str]) -> Tuple[bool, str]:
        """
        Análisis combinado de la petición para detectar comportamiento sospechoso.
        Retorna (es_sospechoso, motivo)
        """
        # 1. Verificar User-Agent
        if self.is_whitelisted_user_agent(user_agent):
            return False, "User-Agent en whitelist"
        
        if self.is_suspicious_user_agent(user_agent):
            return True, "User-Agent sospechoso"
        
        # 2. Verificar patrones de scraping en las rutas
        scraping_paths = [
            '/sitemap.xml', '/robots.txt', '/feed', '/rss',
            '/api/products', '/api/posts', '/api/users'
        ]
        
        # Si está accediendo a rutas de datos estructurados sin referer
        if any(sp in path for sp in scraping_paths):
            if not referer or urlparse(referer).netloc != 'salentoalamano.com':
                return True, "Acceso a datos estructurados sin referer válido"
        
        # 3. Verificar User-Agent vacío (generalmente bots)
        if not user_agent or user_agent.strip() == '':
            return True, "User-Agent vacío"
        
        # 4. Verificar User-Agent demasiado corto (posible bot genérico)
        if len(user_agent) < 10:
            return True, "User-Agent demasiado corto"
        
        return False, ""
    
    def should_block_request(self, ip: str, user_agent: str, 
                            path: str, referer: Optional[str] = None) -> Tuple[bool, str]:
        """
        Función principal de decisión: debe bloquear esta petición?
        Retorna (bloquear, motivo)
        """
        # 1. Primero verificar whitelist (prioridad máxima)
        if self.is_whitelisted_user_agent(user_agent):
            return False, "User-Agent en whitelist (SEO/Social)"
        
        # 2. Verificar rate limiting
        rate_allowed, rate_reason = self.check_rate_limit(ip, path)
        if not rate_allowed:
            logger.warning(f"BLOCKED by rate limit - IP: {ip}, Path: {path}, Reason: {rate_reason}")
            return True, rate_reason
        
        # 3. Verificar patrón sospechoso
        is_suspicious, suspicious_reason = self.is_suspicious_request(
            user_agent, path, referer
        )
        if is_suspicious:
            logger.warning(f"BLOCKED - IP: {ip}, UA: {user_agent}, Path: {path}, Reason: {suspicious_reason}")
            return True, suspicious_reason
        
        # 4. Petición parece legítima
        logger.debug(f"ALLOWED - IP: {ip}, UA: {user_agent[:50]}, Path: {path}")
        return False, "Request válido"
    
    def log_blocked_request(self, ip: str, user_agent: str, 
                           path: str, reason: str):
        """
        Registra peticiones bloqueadas para análisis posterior.
        """
        log_entry = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'ip': ip,
            'user_agent': user_agent[:100],  # Limitar longitud
            'path': path,
            'reason': reason
        }
        logger.warning(f"BLOCKED_REQUEST: {log_entry}")


# Versión ASGI (para FastAPI, Django async, etc.)
class ASGISecurityMiddleware:
    """
    Implementación ASGI del middleware de seguridad.
    Compatible con FastAPI, Starlette, Django async, etc.
    """
    
    def __init__(self, app):
        self.app = app
        self.security = SecurityMiddleware()
    
    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            await self.app(scope, receive, send)
            return
        
        # Extraer información de la petición
        headers = dict(scope.get('headers', []))
        user_agent = headers.get(b'user-agent', b'').decode('utf-8', errors='ignore')
        referer = headers.get(b'referer', b'').decode('utf-8', errors='ignore')
        ip = self._get_client_ip(scope)
        path = scope.get('path', '')
        
        # Verificar seguridad
        should_block, reason = self.security.should_block_request(
            ip, user_agent, path, referer if referer else None
        )
        
        if should_block:
            # Respuesta 429 Too Many Requests o 403 Forbidden
            await send({
                'type': 'http.response.start',
                'status': 429,
                'headers': [
                    [b'content-type', b'text/plain'],
                    [b'retry-after', b'60'],
                ],
            })
            await send({
                'type': 'http.response.body',
                'body': b'Too many requests. Please try again later.',
            })
            self.security.log_blocked_request(ip, user_agent, path, reason)
            return
        
        # Petición permitida, continuar con la aplicación
        await self.app(scope, receive, send)
    
    def _get_client_ip(self, scope) -> str:
        """Extraer IP del cliente de la conexión ASGI"""
        headers = dict(scope.get('headers', []))
        
        # Verificar headers de proxy
        forwarded_for = headers.get(b'x-forwarded-for', b'').decode('utf-8', errors='ignore')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
        
        real_ip = headers.get(b'x-real-ip', b'').decode('utf-8', errors='ignore')
        if real_ip:
            return real_ip
        
        # IP de la conexión directa
        client = scope.get('client', [None, None])
        return client[0] if client[0] else 'unknown'


# Versión WSGI (para Flask, Django sync, etc.)
class WSGISecurityMiddleware:
    """
    Implementación WSGI del middleware de seguridad.
    Compatible con Flask, Django tradicional, etc.
    """
    
    def __init__(self, app):
        self.app = app
        self.security = SecurityMiddleware()
    
    def __call__(self, environ, start_response):
        # Extraer información de la petición WSGI
        user_agent = environ.get('HTTP_USER_AGENT', '')
        referer = environ.get('HTTP_REFERER', '')
        ip = self._get_client_ip(environ)
        path = environ.get('PATH_INFO', '')
        
        # Verificar seguridad
        should_block, reason = self.security.should_block_request(
            ip, user_agent, path, referer if referer else None
        )
        
        if should_block:
            # Respuesta 429 Too Many Requests
            status = '429 Too Many Requests'
            response_headers = [
                ('Content-Type', 'text/plain'),
                ('Retry-After', '60'),
            ]
            start_response(status, response_headers)
            self.security.log_blocked_request(ip, user_agent, path, reason)
            return [b'Too many requests. Please try again later.']
        
        # Petición permitida, continuar con la aplicación
        return self.app(environ, start_response)
    
    def _get_client_ip(self, environ) -> str:
        """Extraer IP del cliente del entorno WSGI"""
        # Verificar headers de proxy
        forwarded_for = environ.get('HTTP_X_FORWARDED_FOR', '')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
        
        real_ip = environ.get('HTTP_X_REAL_IP', '')
        if real_ip:
            return real_ip
        
        # IP de la conexión directa
        return environ.get('REMOTE_ADDR', 'unknown')


# Función de prueba para verificar el middleware
def test_security_middleware():
    """
    Prueba básica del middleware con diferentes escenarios.
    """
    print("Testing SecurityMiddleware...")
    middleware = SecurityMiddleware()
    
    test_cases = [
        # (ip, user_agent, path, referer, esperado_bloqueado)
        ('192.168.1.1', 'Mozilla/5.0 (compatible; Googlebot/2.1)', '/', 'https://salentoalamano.com', False),
        ('192.168.1.2', 'python-requests/2.28.0', '/api/products', None, True),
        ('192.168.1.3', 'curl/7.68.0', '/sitemap.xml', None, True),
        ('192.168.1.4', 'Mozilla/5.0 (Windows NT 10.0)', '/', 'https://salentoalamano.com', False),
        ('192.168.1.5', 'facebookexternalhit/1.1', '/', None, False),
        ('192.168.1.6', 'scrapy/2.5.0', '/api/posts', None, True),
        ('192.168.1.7', '', '/', None, True),
        ('192.168.1.8', 'bot', '/', None, True),
        ('192.168.1.9', 'WhatsApp/2.21', '/', None, False),
        ('192.168.1.10', 'Mozilla/5.0 (compatible; Bingbot/2.0)', '/robots.txt', None, False),
    ]
    
    print("\nTest Results:")
    print("-" * 80)
    
    passed = 0
    failed = 0
    
    for ip, user_agent, path, referer, expected_blocked in test_cases:
        should_block, reason = middleware.should_block_request(
            ip, user_agent, path, referer
        )
        
        status = "PASS" if should_block == expected_blocked else "FAIL"
        if should_block == expected_blocked:
            passed += 1
        else:
            failed += 1
        
        print(f"{status} | IP: {ip:15} | UA: {user_agent[:30]:30} | "
              f"Path: {path:20} | Blocked: {should_block:5} | Expected: {expected_blocked:5}")
        if should_block:
            print(f"       Reason: {reason}")
    
    print("-" * 80)
    print(f"Results: {passed} passed, {failed} failed out of {len(test_cases)} tests")
    
    return failed == 0


if __name__ == '__main__':
    # Ejecutar pruebas
    success = test_security_middleware()
    
    if success:
        print("\nSecurityMiddleware test completed successfully!")
        print("\nPara usar en tu aplicación:")
        print("  # ASGI (FastAPI):")
        print("  from security_middleware import ASGISecurityMiddleware")
        print("  app = ASGISecurityMiddleware(app)")
        print("\n  # WSGI (Flask):")
        print("  from security_middleware import WSGISecurityMiddleware")
        print("  app.wsgi_app = WSGISecurityMiddleware(app.wsgi_app)")
    else:
        print("\nSome tests failed. Please review the implementation.")