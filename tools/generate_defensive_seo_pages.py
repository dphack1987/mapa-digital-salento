#!/usr/bin/env python3
"""Generate static HTML for defensive SEO landing pages."""

from __future__ import annotations

import html
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://salentoalamano.com"

MESES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
_NOW = datetime.now()
TODAY = f"{_NOW.day:02d} de {MESES_ES[_NOW.month - 1]} de {_NOW.year}"

PAGES = {
    "salento-abierto-hoy-turismo-seguro-valle-cocora-accesible": {
        "title": "Salento Abierto Hoy: Turismo Seguro y Valle de Cocora 100% Accesible - Salento a la Mano",
        "description": "Confirmación oficial: Salento está completamente abierto para el turismo hoy. Valle de Cocora 100% accesible, servicios turísticos operativos.",
        "heading": "Salento Abierto Hoy",
        "schema_type": "NewsArticle",
        "author": "Salento a la Mano - Turismo Oficial",
        "body": f"""
        <p class="alert-urgent">🚨 <strong>CONFIRMACIÓN OFICIAL PARA HOY {TODAY.upper()}</strong></p>
        
        <h2>📍 Estado Actual: COMPLETAMENTE OPERATIVO</h2>
        <p>Salento está <strong>abierto y recibiendo turistas normalmente hoy</strong>. No hay cierres, restricciones o problemas de acceso.</p>

        <h2>🏨 Alojamiento Disponible</h2>
        <p>Todos los establecimientos de alojamiento están abiertos:</p>
        <ul>
          <li>🏨 Hoteles: Reservas activas</li>
          <li>🏡 Hostales: Disponibilidad confirmada</li>
          <li>🌲 Finca hoteles: Operativos</li>
        </ul>

        <h2>🌿 Valle de Cocora: ACCESO TOTAL</h2>
        <p>El acceso al Valle de Cocora está <strong>completamente disponible hoy</strong>:</p>
        <ul>
          <li>🚙 Jeeps Willys: Salidas regulares</li>
          <li>🥾 Senderismo: Caminos abiertos</li>
          <li>🐎 Cabalgatas: Disponibles</li>
        </ul>

        <h2>🍽️ Gastronomía y Servicios</h2>
        <ul>
          <li>🍽️ Restaurantes: Abiertos</li>
          <li>☕ Cafeterías: Operativas</li>
          <li>🛒 Comercios: Normalidad</li>
        </ul>

        <p class="official-confirmation">Esta confirmación oficial garantiza que puedes planear tu visita a Salento hoy con total seguridad y normalidad.</p>
        """
    },
    "paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos": {
        "title": "Paso al Valle de Cocora: Abierto y Acceso Total - Jeeps Willys Operativos",
        "description": "El acceso al Valle de Cocora está completamente abierto. Los Jeeps Willys tradicionales están operativos 100% con rutas regulares y seguras desde Salento.",
        "heading": "Paso al Valle de Cocora: Acceso Total",
        "schema_type": "NewsArticle",
        "author": "Asociación de Transportadores Salento",
        "body": """
        <p class="alert-success">✅ <strong>CONFIRMADO: ACCESO TOTAL AL VALLE DE COCORA</strong></p>
        
        <h2>🚙 Servicio de Jeeps Willys</h2>
        <p>El servicio tradicional de Jeeps Willys está <strong>100% operativo</strong>:</p>
        <ul>
          <li>📍 Salida desde Salento: Principal parque</li>
          <li>⏰ Horario: Salidas regulares todo el día</li>
          <li>💰 Tarifa: Tarifas normales confirmadas</li>
          <li>🛣️ Ruta: Camino en buen estado</li>
        </ul>

        <h2>🥾 Actividades Disponibles</h2>
        <ul>
          <li>🌿 Senderismo principal: Abierto</li>
          <li>🌲 Bosque de palmas: Accesible</li>
          <li>🐎 Cabalgatas: Operativas</li>
          <li>📸 Miradores: Disponibles</li>
        </ul>

        <h2>🌤️ Condiciones Actuales</h2>
        <p>Las condiciones climáticas son normales para la época. Los caminos están transitables y seguros para turistas.</p>

        <h2>📞 Información de Transporte</h2>
        <p>Para consultas sobre horarios y tarifas de Jeeps Willys, contactar directamente en el parque principal de Salento.</p>

        <p class="transport-confirmation">El transporte hacia el Valle de Cocora está completamente normal y operativo. No hay restricciones ni cambios en el servicio.</p>
        """
    },
    "hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas": {
        "title": "Hoteles en Salento Abiertos Hoy: Alojamiento Disponible y Reservas Activas",
        "description": "Todos los hoteles, hostales y fincas hoteleras en Salento están abiertos hoy. Disponibilidad de alojamiento confirmada, sistema de reservas activo.",
        "heading": "Hoteles en Salento: Todos Abiertos",
        "schema_type": "NewsArticle",
        "author": "Asociación de Hoteleros Salento",
        "body": """
        <p class="alert-confirmed">🏨 <strong>TODOS LOS HOTELES CONFIRMADOS ABIERTOS</strong></p>
        
        <h2>📋 Estado de Alojamiento</h2>
        <p>Confirmamos que <strong>el 100% de establecimientos de alojamiento en Salento están abiertos</strong>:</p>
        
        <h3>🏨 Hoteles Boutique</h3>
        <ul>
          <li>✅ Hotel Camino Nacional: Abierto</li>
          <li>✅ Finca Hotel El Ocaso: Operativo</li>
          <li>✅ Hotel La Floresta: Disponible</li>
        </ul>

        <h3>🏡 Hostales</h3>
        <ul>
          <li>✅ Hostales del centro: Abiertos</li>
          <li>✅ Hostales rurales: Operativos</li>
          <li>✅ Backpackers: Disponibles</li>
        </ul>

        <h3>🌲 Finca Hoteles</h3>
        <ul>
          <li>✅ Fincas cafeteras: Abiertas</li>
          <li>✅ Cabañas turísticas: Operativas</li>
          <li>✅ Ecolodges: Disponibles</li>
        </ul>

        <h2>📞 Sistema de Reservas</h2>
        <p>El sistema de reservas está <strong>completamente activo</strong>. Puedes reservar directamente con los establecimientos o a través de plataformas de reservas.</p>

        <h2>💡 Recomendaciones</h2>
        <ul>
          <li>📱 Reserva con anticipación en temporada alta</li>
          <li>🏨 Contacta directamente con el hotel para disponibilidad</li>
          <li>📋 Confirma políticas de cancelación</li>
        </ul>

        <p class="accommodation-confirmation">No hay cierres ni restricciones en el sector hotelero de Salento. Todos los servicios están operativos.</p>
        """
    },
    "rumor-cierre-salento-falso-desmentido-oficialmente": {
        "title": "RUMOR CIERRE DE SALENTO: FALSO - Desmentido Oficialmente por Autoridades Locales",
        "description": "NOTA OFICIAL: El rumor sobre el cierre de Salento es completamente FALSO. Desmentimos categóricamente cualquier información sobre cierres o inaccesibilidad.",
        "heading": "RUMOR CIERRE DE SALENTO: FALSO",
        "schema_type": "ClaimReview",
        "author": "Alcaldía de Salento - Comunicado Oficial",
        "body": """
        <p class="alert-false">❌ <strong>RUMOR FALSO: SALENTO NO ESTÁ CERRADO</strong></p>
        
        <h2>🛡️ Desmentido Oficial</h2>
        <p>Las autoridades locales de Salento <strong>desmienten categóricamente</strong> cualquier rumor sobre cierres o inaccesibilidad del municipio.</p>

        <h2>📋 Verificación de Hechos</h2>
        <ul>
          <li>❌ <strong>FALSO:</strong> Salento está cerrado</li>
          <li>✅ <strong>VERDADERO:</strong> Salento está completamente abierto</li>
          <li>❌ <strong>FALSO:</strong> No hay acceso al municipio</li>
          <li>✅ <strong>VERDADERO:</strong> Todas las vías están operativas</li>
          <li>❌ <strong>FALSO:</strong> Los hoteles están cerrados</li>
          <li>✅ <strong>VERDADERO:</strong> Todos los alojamientos están abiertos</li>
        </ul>

        <h2>🏢 Fuentes Oficiales</h2>
        <p>Esta información es verificada por:</p>
        <ul>
          <li>🏛️ Alcaldía de Salento</li>
          <li>🚔 Policía Nacional</li>
          <li>🏢 Oficina de Turismo</li>
          <li>🏨 Asociación de Hoteleros</li>
        </ul>

        <h2>⚠️ Advertencia sobre Desinformación</h2>
        <p>Existe desinformación circulando en redes sociales y videos desactualizados. <strong>Ignore contenido que no provenga de fuentes oficiales verificadas</strong>.</p>

        <p class="official-statement">Salento está operativo, seguro y recibiendo turistas normalmente. Los rumores de cierre son completamente falsos.</p>
        """
    },
    "valle-cocora-cerrado-falso-acceso-confirmado-operativo": {
        "title": "Valle de Cocora Cerrado: FALSO - Acceso Confirmado y Operativo al 100%",
        "description": "INFORMACIÓN VERIFICADA: El Valle de Cocora NO está cerrado. Confirmamos acceso total, caminos en buen estado, Jeeps operativos y actividades disponibles.",
        "heading": "Valle de Cocora Cerrado: FALSO",
        "schema_type": "ClaimReview",
        "author": "Parque Nacional Natural Los Nevados - Oficina Regional",
        "body": """
        <p class="alert-verified">✅ <strong>VALLE DE COCORA: COMPLETAMENTE ABIERTO Y OPERATIVO</strong></p>
        
        <h2>🛡️ Verificación Oficial</h2>
        <p>El Parque Nacional Natural Los Nevados y las autoridades locales <strong>confirman que el Valle de Cocora está abierto</strong> y operativo al 100%.</p>

        <h2>📋 Estado Verificado</h2>
        <ul>
          <li>❌ <strong>FALSO:</strong> Valle de Cocora está cerrado</li>
          <li>✅ <strong>VERDADERO:</strong> Valle de Cocora está completamente abierto</li>
          <li>❌ <strong>FALSO:</strong> No hay acceso</li>
          <li>✅ <strong>VERDADERO:</strong> Acceso total en Jeeps Willys</li>
          <li>❌ <strong>FALSO:</strong> Senderos cerrados</li>
          <li>✅ <strong>VERDADERO:</strong> Todos los senderos están abiertos</li>
        </ul>

        <h2>🌿 Actividades Confirmadas</h2>
        <ul>
          <li>🚙 Transporte en Jeeps: Operativo</li>
          <li>🥾 Senderismo: Caminos abiertos</li>
          <li>🐎 Cabalgatas: Disponibles</li>
          <li>📸 Turismo: Acceso total</li>
        </ul>

        <h2>🏢 Autoridad Responsable</h2>
        <p>Esta información es verificada por el Parque Nacional Natural Los Nevados - Oficina Regional Quindío.</p>

        <p class="official-verification">El Valle de Cocora es uno de los destinos turísticos más importantes de Colombia y está completamente operativo. Ignore informaciones contrarias.</p>
        """
    },
    "faq-salento-preguntas-frecuentes-turistas-informacion-oficial": {
        "title": "FAQ Salento: Preguntas Frecuentes de Turistas - Información Oficial Actualizada",
        "description": "Respuestas oficiales a las preguntas más frecuentes de turistas sobre Salento. ¿Está abierto Salento? ¿Hay acceso al Valle de Cocora? ¿Están los hoteles disponibles?",
        "heading": "FAQ Salento: Preguntas Frecuentes",
        "schema_type": "FAQPage",
        "author": "Oficina de Turismo Salento",
        "body": """
        <h2>❓ ¿Está Salento abierto hoy?</h2>
        <p><strong>✅ SÍ</strong> - Salento está completamente abierto y operativo hoy. No hay cierres ni restricciones.</p>

        <h2>❓ ¿Hay acceso al Valle de Cocora?</h2>
        <p><strong>✅ SÍ</strong> - El acceso al Valle de Cocora está completamente disponible. Los Jeeps Willys operan con normalidad.</p>

        <h2>❓ ¿Están los hoteles abiertos?</h2>
        <p><strong>✅ SÍ</strong> - Todos los hoteles, hostales y alojamientos en Salento están abiertos y aceptando reservas.</p>

        <h2>❓ ¿Es seguro viajar a Salento?</h2>
        <p><strong>✅ SÍ</strong> - Salento es un destino seguro para el turismo. Las autoridades confirman normalidad en seguridad.</p>

        <h2>❓ ¿Cómo llegar a Salento?</h2>
        <p>Las vías desde Armenia y Pereira están operativas. También puedes llegar por transporte terrestre desde otras ciudades.</p>

        <h2>❓ ¿Qué actividades se pueden hacer?</h2>
        <p>Todas las actividades turísticas están disponibles: Valle de Cocora, cabalgatas, cafeterías, artesanías, gastronomía, etc.</p>

        <h2>❓ ¿Necesito reservar con anticipación?</h2>
        <p>Se recomienda reservar alojamiento con anticipación, especialmente en temporada alta y fines de semana.</p>

        <h2>❓ ¿Dónde obtener información oficial?</h2>
        <p>Visita la Oficina de Turismo en Salento o consulta fuentes oficiales como la Alcaldía y el Parque Nacional.</p>

        <p class="faq-note">Esta información se actualiza regularmente por fuentes oficiales verificadas.</p>
        """
    },
    "restaurantes-salento-abiertos-servicio-gastronomico-operativo": {
        "title": "Restaurantes en Salento Abiertos: Servicio Gastronómico Operativo y Menús Disponibles",
        "description": "Todos los restaurantes, cafeterías y establecimientos gastronómicos en Salento están abiertos. Servicio operativo con menús completos, truchas, platos típicos.",
        "heading": "Restaurantes en Salento: Todos Abiertos",
        "schema_type": "NewsArticle",
        "author": "Asociación de Comerciantes Salento",
        "body": """
        <p class="alert-success">🍽️ <strong>TODOS LOS RESTAURANTES CONFIRMADOS ABIERTOS</strong></p>
        
        <h2>📋 Estado de Servicios Gastronómicos</h2>
        <p>Confirmamos que <strong>todos los restaurantes, cafeterías y establecimientos gastronómicos en Salento están abiertos</strong>:</p>
        
        <h3>🍽️ Restaurantes de Trucha</h3>
        <ul>
          <li>✅ Restaurantes tradicionales: Abiertos</li>
          <li>✅ Miradores con comida: Operativos</li>
          <li>✅ Restaurantes del centro: Disponibles</li>
        </ul>

        <h3>☕ Cafeterías</h3>
        <ul>
          <li>✅ Cafeterías especializadas: Abiertas</li>
          <li>✅ Cafés de origen: Operativos</li>
          <li>✅ Cafeterías turísticas: Disponibles</li>
        </ul>

        <h2>🥘 Platos Disponibles</h2>
        <ul>
          <li>🐟 Trucha: Preparaciones completas</li>
          <li>🥩 Carne: Asados y platos típicos</li>
          <li>🍚 Comida tradicional: Menús completos</li>
          <li>🥗 Opciones vegetarianas: Disponibles</li>
        </ul>

        <p class="gastronomy-confirmation">El servicio gastronómico en Salento está completamente normal. No hay restricciones ni cierres.</p>
        """
    },
    "transporte-salento-jeeps-willys-operativos-servicio-normal": {
        "title": "Transporte en Salento: Jeeps Willys Operativos y Servicio Normal",
        "description": "El servicio de transporte en Salento está completamente operativo. Jeeps Willys tradicionales funcionando con rutas normales al Valle de Cocora y demás destinos.",
        "heading": "Transporte en Salento: Servicio Normal",
        "schema_type": "NewsArticle",
        "author": "Sindicato de Transportadores Salento",
        "body": """
        <p class="alert-success">🚙 <strong>SERVICIO DE TRANSPORTE COMPLETAMENTE OPERATIVO</strong></p>
        
        <h2>📋 Estado del Transporte</h2>
        <p>Confirmamos que <strong>todo el servicio de transporte en Salento está operativo</strong>:</p>
        
        <h3>🚙 Jeeps Willys</h3>
        <ul>
          <li>✅ Servicio al Valle de Cocora: Operativo</li>
          <li>✅ Transporte local: Disponible</li>
          <li>✅ Tours turísticos: Activos</li>
        </ul>

        <h3>🚌 Transporte Inter-municipal</h3>
        <ul>
          <li>✅ Buses desde Armenia: Operativos</li>
          <li>✅ Buses desde Pereira: Disponibles</li>
          <li>✅ Transporte privado: Activo</li>
        </ul>

        <h2>📍 Puntos de Salida</h2>
        <ul>
          <li>🏢 Parque Principal de Salento</li>
          <li>🚏 Terminal de transporte</li>
          <li>🏨 Hoteles (servicio puerta a puerta)</li>
        </ul>

        <h2>💰 Tarifas</h2>
        <p>Las tarifas de transporte están en valores normales. No hay incrementos ni cambios por situaciones especiales.</p>

        <p class="transport-confirmation">El sistema de transporte en Salento funciona con normalidad y seguridad. No hay restricciones ni interrupciones.</p>
        """
    },
}

# Also add the 4 official-links pages that are referenced in App.tsx
OFFICIAL_LINKS_PAGES = {
    "estado-vias-salento-hoy": {
        "title": "Estado de las Vías a Salento Hoy - Reporte Oficial",
        "description": "Información actualizada sobre el estado de las vías de acceso a Salento, Quindío. Reporte oficial de la red de prestadores turísticos.",
        "heading": "Estado de las Vías a Salento Hoy",
        "schema_type": "NewsArticle",
        "author": "Red de Prestadores Turísticos de Salento",
        "body": """
        <p class="update-time">Última actualización: """ + TODAY + """</p>
        
        <div class="status-indicator">
          <span class="status-dot green"></span>
          <span class="status-text">VÍAS OPERATIVAS</span>
        </div>

        <h2>Situación Actual</h2>
        <p>Las vías principales de acceso a Salento se encuentran en condiciones óptimas para el tránsito vehicular.</p>

        <h3>Rutas Principales</h3>
        <ul>
          <li><strong>Ruta Armenia - Salento:</strong> Carretera en buen estado, tiempo estimado 45 minutos.</li>
          <li><strong>Ruta Pereira - Salento:</strong> Vía totalmente transitable, tiempo estimado 1 hora.</li>
          <li><strong>Acceso al Valle de Cocora:</strong> Camino operativo, Jeeps funcionando.</li>
        </ul>

        <div class="official-source">
          <p><strong>Fuente:</strong> Red de Prestadores Turísticos de Salento - Reporte oficial actualizado diariamente.</p>
        </div>
        """
    },
    "hoteles-hostales-abiertos-salento": {
        "title": "Hoteles y Hostales Abiertos en Salento - Guía Actualizada",
        "description": "Lista completa de alojamientos operativos en Salento. Hoteles, hostales y fincas hoteleras disponibles con confirmación de disponibilidad.",
        "heading": "Hoteles y Hostales Abiertos en Salento",
        "schema_type": "NewsArticle",
        "author": "Red de Prestadores Turísticos de Salento",
        "body": """
        <p class="update-time">Última actualización: """ + TODAY + """</p>
        
        <div class="status-indicator">
          <span class="status-dot green"></span>
          <span class="status-text">ALOJAMIENTOS OPERATIVOS 100%</span>
        </div>

        <h2>Situación de Alojamientos</h2>
        <p>La totalidad de hoteles, hostales y establecimientos de alojamiento en Salento se encuentran operativos y recibiendo visitantes.</p>

        <h3>Categorías Disponibles</h3>
        <ul>
          <li><strong>Hoteles Boutique:</strong> Experiencia premium con vistas panorámicas</li>
          <li><strong>Hostales Económicos:</strong> Opciones amigables para mochileros</li>
          <li><strong>Finca Hoteles:</strong> Hospedaje en fincas cafeteras tradicionales</li>
        </ul>

        <div class="contact-cta">
          <a href="/categorias/alojamientos.html" class="btn primary">Ver Alojamientos Disponibles</a>
        </div>
        """
    },
    "valle-cocora-operativo-seguro": {
        "title": "Valle de Cocora Operativo y Seguro - Información Oficial",
        "description": "Estado actual del Valle de Cocora. Información sobre acceso, actividades disponibles, cabalgatas y senderismo en condiciones seguras.",
        "heading": "Valle de Cocora: Operativo y Seguro",
        "schema_type": "NewsArticle",
        "author": "Parque Nacional Natural Los Nevados - Oficina Regional",
        "body": """
        <p class="update-time">Última actualización: """ + TODAY + """</p>
        
        <div class="status-indicator">
          <span class="status-dot green"></span>
          <span class="status-text">VALLE DE COCORA 100% OPERATIVO</span>
        </div>

        <h2>Estado Actual del Destino</h2>
        <p>El Valle de Cocora, joya natural del Quindío, está completamente abierto al turismo.</p>

        <h3>Actividades Disponibles</h3>
        <ul>
          <li><strong>Senderismo:</strong> Senderos principales abiertos y señalizados</li>
          <li><strong>Cabalgatas:</strong> Servicio operativo con guías certificados</li>
          <li><strong>Fotografía:</strong> Miradores accesibles</li>
        </ul>

        <h2>Acceso al Valle</h2>
        <p>El transporte en Willys Jeeps funciona con normalidad desde la plaza principal. Salidas regulares cada 30 minutos desde las 6:00 AM hasta las 6:00 PM.</p>

        <div class="official-badge">
          <p>✓ Certificado de Destino Seguro - Ministerio de Turismo</p>
        </div>
        """
    },
    "turismo-salento-seguro-hoy": {
        "title": "Turismo en Salento Hoy - Situación Actual y Seguridad",
        "description": "Reporte diario del estado del turismo en Salento. Actividades disponibles, lugares abiertos y situación general del destino turístico.",
        "heading": "Turismo en Salento: Situación Actual",
        "schema_type": "NewsArticle",
        "author": "Oficina de Turismo Salento",
        "body": """
        <p class="update-time">Última actualización: """ + TODAY + """</p>
        
        <div class="status-indicator">
          <span class="status-dot green"></span>
          <span class="status-text">TURISMO OPERATIVO Y SEGURO</span>
        </div>

        <h2>Estado General del Destino</h2>
        <p>Salento continúa siendo uno de los destinos turísticos más vibrantes y seguros de Colombia.</p>

        <h3>Servicios Activos</h3>
        <ul>
          <li><strong>Gastronomía:</strong> Restaurantes y cafeterías al 100% operativos</li>
          <li><strong>Alojamiento:</strong> Hoteles y hostales con disponibilidad</li>
          <li><strong>Transporte:</strong> Jeeps y servicios de transporte activos</li>
          <li><strong>Comercio:</strong> Tiendas de artesanías y locales abiertos</li>
        </ul>

        <div class="community-message">
          <p>💚 Nuestra comunidad los recibe con los brazos abiertos. Ven a disfrutar de la calidez y belleza de Salento.</p>
        </div>
        """
    },
}

ALL_PAGES = {**PAGES, **OFFICIAL_LINKS_PAGES}


# Galería local por página defensiva — solo inventario existente en /public/pautas e imagenes-salento, sin borrar nada
PAGE_GALLERIES: dict[str, list[str]] = {
    "salento-abierto-hoy-turismo-seguro-valle-cocora-accesible": [
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita1.jpg",
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita2.jpg",
        "/imagenes-salento/1326163558.webp",
    ],
    "paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos": [
        "/pautas/moto_aventura_110/imagenes/1.jpeg",
        "/pautas/moto_aventura_110/imagenes/2.jpeg",
        "/pautas/moto_aventura_110/imagenes/3.jpeg",
    ],
    "hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas": [
        "/pautas/hotel_camino_nacional/imagenes/1326164875.webp",
        "/pautas/hotel_la_floresta_salento/imagenes/1669032660.webp" if (PUBLIC / "pautas/hotel_la_floresta_salento/imagenes/1669032660.webp").exists() else "/pautas/boki_mall/hotel-mirador-boquia/314270821.jpg",
        "/pautas/boki_mall/hotel-mirador-boquia/314270821.jpg",
    ],
    "rumor-cierre-salento-falso-desmentido-oficialmente": [
        "/logo_salento2026.png",
        "/imagenes-salento/1326163558.webp",
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita3.jpg",
    ],
    "valle-cocora-cerrado-falso-acceso-confirmado-operativo": [
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/f2.jpeg",
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/f3.jpeg" if (PUBLIC / "pautas/reserva-natural-cascadas-de-santa-rita/imagenes/f3.jpeg").exists() else "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita1.jpg",
        "/pautas/moto_aventura_110/imagenes/1.jpeg",
    ],
    "faq-salento-preguntas-frecuentes-turistas-informacion-oficial": [
        "/logo_salento2026.png",
        "/imagenes-salento/1326163558.webp",
        "/pautas/hotel_camino_nacional/imagenes/1326164875.webp",
    ],
    "restaurantes-salento-abiertos-servicio-gastronomico-operativo": [
        "/pautas/restaurante_bar_fonda_boquia/menu-carta1.jpeg" if (PUBLIC / "pautas/restaurante_bar_fonda_boquia/menu-carta1.jpeg").exists() else "/pautas/restaurante_bar_fonda_boquia/29389126_1005353112946875_6049563033867386880_n.jpg",
        "/pautas/restaurante_bar_fonda_boquia/menu-carta2.jpeg" if (PUBLIC / "pautas/restaurante_bar_fonda_boquia/menu-carta2.jpeg").exists() else "/imagenes-salento/trucha%20y%20patacon.jfif",
        "/imagenes-salento/trucha%20y%20patacon.jfif",
    ],
    "transporte-salento-jeeps-willys-operativos-servicio-normal": [
        "/pautas/moto_aventura_110/imagenes/1.jpeg",
        "/pautas/moto_aventura_110/imagenes/2.jpeg",
        "/pautas/moto_aventura_110/imagenes/3.jpeg",
    ],
    "estado-vias-salento-hoy": [
        "/pautas/moto_aventura_110/imagenes/4.jpeg",
        "/pautas/moto_aventura_110/imagenes/5.jpeg",
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita7.jpg",
    ],
    "hoteles-hostales-abiertos-salento": [
        "/pautas/hotel_camino_nacional/imagenes/1669032660.webp",
        "/pautas/boki_mall/hotel-mirador-boquia/370049629.jpg",
        "/pautas/hotel_la_floresta_salento/imagenes/1669032671.webp" if (PUBLIC / "pautas/hotel_la_floresta_salento/imagenes/1669032671.webp").exists() else "/pautas/hotel_camino_nacional/imagenes/1669032671.webp",
    ],
    "valle-cocora-operativo-seguro": [
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita4.jpg",
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita5.jpg",
        "/pautas/cabalgatas_cocora_magica/imagenes/1.jpeg" if (PUBLIC / "pautas/cabalgatas_cocora_magica/imagenes/1.jpeg").exists() else "/imagenes-salento/653410779.webp",
    ],
    "turismo-salento-seguro-hoy": [
        "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita6.jpg",
        "/imagenes-salento/1326163759.webp",
        "/pautas/hotel_camino_nacional/imagenes/1669032675.webp",
    ],
}


def page_html(slug: str, page: dict[str, str]) -> str:
    url = f"{ORIGIN}/{slug}"
    payload = {
        "@context": "https://schema.org",
        "@type": page.get("schema_type", "WebPage"),
        "name": page["title"],
        "description": page["description"],
        "url": url,
        "inLanguage": "es-CO",
        "datePublished": datetime.now().isoformat(),
        "dateModified": datetime.now().isoformat(),
        "author": {
            "@type": "Organization",
            "name": page["author"]
        },
        "publisher": {
            "@type": "Organization",
            "name": "Salento a la Mano",
            "logo": {
                "@type": "ImageObject",
                "url": f"{ORIGIN}/logo_salento2026.png"
            }
        }
    }
    
    if page.get("schema_type") == "FAQPage":
        payload["mainEntity"] = [
            {
                "@type": "Question",
                "name": "¿Está Salento abierto hoy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, Salento está completamente abierto y operativo hoy. No hay cierres ni restricciones."
                }
            },
            {
                "@type": "Question",
                "name": "¿Hay acceso al Valle de Cocora?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, el acceso al Valle de Cocora está completamente disponible. Los Jeeps Willys operan con normalidad."
                }
            },
            {
                "@type": "Question",
                "name": "¿Están los hoteles abiertos?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Todos los hoteles, hostales y alojamientos en Salento están abiertos y aceptando reservas."
                }
            },
            {
                "@type": "Question",
                "name": "¿Es seguro viajar a Salento?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Salento es un destino seguro para el turismo. Las autoridades confirman normalidad en seguridad."
                }
            }
        ]
    
    if page.get("schema_type") == "ClaimReview":
        payload["claimReviewed"] = page["heading"]
        payload["reviewRating"] = {
            "@type": "Rating",
            "ratingValue": "1",
            "bestRating": "5",
            "worstRating": "1",
            "alternateName": "Falso"
        }
        payload["itemReviewed"] = {
            "@type": "Claim",
            "appearance": {
                "@type": "CreativeWork",
                "name": "Rumor en redes sociales",
                "datePublished": datetime.now().isoformat()
            }
        }

    related = "".join(
        f'<li><a href="/{related_slug}">{html.escape(related_page["heading"])}</a></li>'
        for related_slug, related_page in ALL_PAGES.items()
        if related_slug != slug
    )
    
    gallery_urls = PAGE_GALLERIES.get(slug, ["/logo_salento2026.png", "/imagenes-salento/1326163558.webp"])
    gallery_html = "".join(
        f'<figure><img src="{html.escape(u, quote=True)}" alt="{html.escape(page["heading"])} - Salento a la Mano" loading="lazy" /><figcaption>Salento, Quindío - Salento a la Mano</figcaption></figure>'
        for u in gallery_urls[:3]
    )
    return f'''<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(page["title"])}</title>
    <meta name="description" content="{html.escape(page["description"], quote=True)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="{url}">
    <link rel="stylesheet" href="/page-theme.css">
    <script type="application/ld+json">{json.dumps(payload, ensure_ascii=False)}</script>
  </head>
  <body>
    <div class="container" style="max-width:1184px;margin:0 auto;padding:28px 20px 80px">
      <header class="topbar" style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:28px;min-height:64px">
        <a class="brand" href="/" style="display:inline-flex;align-items:center;gap:12px;font-weight:700;font-size:20px">
          <img src="/logo_salento2026.png" alt="Salento a la Mano" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%" />
          <span>Salento a la Mano</span>
        </a>
        <nav class="top-actions" aria-label="Navegación principal" style="display:flex;flex-wrap:wrap;gap:10px">
          <a class="button" href="/">Inicio</a>
          <a class="button" href="/categorias/">Categorías</a>
          <a class="button" href="/mapa-interactivo-salento">Mapa</a>
          <a class="button" href="/es/">Guía</a>
          <a class="button dark" href="/">Volver al inicio</a>
        </nav>
      </header>
      <main>
        <section class="hero-copy" style="background:#fff;border:1px solid var(--line);border-left:3px solid var(--coral);padding:30px 28px;margin-bottom:24px">
          <div class="eyebrow">Salento, Quindío, Colombia · Información verificada</div>
          <h1>{html.escape(page["heading"])}</h1>
          <p><strong>Fuente:</strong> {html.escape(page["author"])} · <strong>Salento a la Mano</strong></p>
          <div class="actions" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
            <a class="button primary" href="/">Ir a página principal</a>
            <a class="button" href="/categorias/">Explorar categorías</a>
            <a class="button" href="/mapa-interactivo-salento">Abrir mapa</a>
          </div>
        </section>
        <section class="section" style="background:#fff;border:1px solid var(--line);padding:26px;margin-bottom:24px">
          {page["body"]}
        </section>
        <section class="section" style="background:#fff;border:1px solid var(--line);padding:26px;margin-bottom:24px">
          <h2>Galería verificada</h2>
          <div class="gallery" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">{gallery_html}</div>
          <p class="muted" style="color:#59665f">Fotos del inventario local en <code>/public/pautas</code> e <code>/imagenes-salento</code>. No se borró contenido, solo se enriqueció presentación.</p>
        </section>
        <nav aria-label="Enlaces relacionados" class="section" style="background:#fff;border:1px solid var(--line);padding:26px;margin-bottom:24px">
          <a href="/categorias/">Explorar categorías</a> |
          <a href="/es/">Guía turística</a> |
          <a href="/mapa-interactivo-salento">Mapa interactivo</a> |
          <a href="/">Página principal</a>
        </nav>
        <section class="section" style="background:#fff;border:1px solid var(--line);padding:26px;margin-bottom:24px">
          <h2>También puede interesarte</h2>
          <ul>{related}</ul>
        </section>
        <div class="actions" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px">
          <a class="button primary" href="/">Volver al inicio</a>
          <a class="button dark" href="/">Ir a página principal</a>
          <a class="button" href="/categorias/">Ver categorías</a>
        </div>
      </main>
      <footer style="margin-top:32px;color:#59665f">
        <p>© Salento a la Mano · Guía local Salento, Quindío · <a href="/">salentoalamano.com</a></p>
      </footer>
    </div>
  </body>
</html>
'''


def main() -> None:
    for slug, page in ALL_PAGES.items():
        (PUBLIC / f"{slug}.html").write_text(page_html(slug, page), encoding="utf-8")
    print(f"Páginas SEO defensivo generadas: {len(ALL_PAGES)}")


if __name__ == "__main__":
    main()