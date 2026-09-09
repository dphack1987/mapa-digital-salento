#!/usr/bin/env python3
"""
Yandex Metrica Integration Script
Genera el código de seguimiento de Yandex Metrica para tu sitio web.

Yandex Metrica es el equivalente ruso de Google Analytics, esencial para SEO en Rusia.
Este script genera el código de seguimiento que debes agregar a tu sitio.

Instrucciones:
1. Regístrate en https://metrica.yandex.com/
2. Crea un nuevo contador para tu sitio
3. Copia el ID del contador (formato: XXXXXXXX)
4. Usa este script para generar el código de integración
"""

def generate_yandex_metrica_code(counter_id, enable_webvisor=True, enable_ecommerce=False):
    """
    Genera el código de seguimiento de Yandex Metrica.
    
    Args:
        counter_id (str): ID del contador de Yandex Metrica
        enable_webvisor (bool): Habilitar Webvisor (grabación de sesiones)
        enable_ecommerce (bool): Habilitar seguimiento de e-commerce
    
    Returns:
        str: Código HTML/JavaScript para integrar en el sitio
    """
    
    webvisor_param = 'true' if enable_webvisor else 'false'
    ecommerce_param = 'true' if enable_ecommerce else 'false'
    
    metrica_code = f'''<!-- Yandex Metrica Counter -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){{{
      m[i]=m[i]||function(){{(m[i].a=m[i].a||[]).push(arguments)}};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {{
         if (document.scripts[j].src === r) {{ return; }}
      }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
   }})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym({counter_id}, "init", {{
        clickmap:{webvisor_param},
        trackLinks:{webvisor_param},
        accurateTrackBounce:{webvisor_param},
        webvisor:{webvisor_param},
        ecommerce:{ecommerce_param},
        trackHash:{webvisor_param}
   }});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/{counter_id}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex Metrica Counter -->'''

    return metrica_code

def generate_metrica_comment_instructions():
    """Genera instrucciones comentadas para la integración."""
    return '''
<!-- 
INSTRUCCIONES PARA INTEGRAR YANDEX METRICA:

1. Regístrate en https://metrica.yandex.com/
2. Crea un nuevo contador para salentoalamano.com
3. Copia el ID del contador (ejemplo: 12345678)
4. Reemplaza {COUNTER_ID} en el código de abajo con tu ID real
5. Pega este código antes de cerrar el tag </head> en todas tus páginas

CONFIGURACIÓN RECOMENDADA PARA SEO:
- clickmap: true (Mapa de clics para análisis de comportamiento)
- trackLinks: true (Seguimiento de enlaces salientes)
- accurateTrackBounce: true (Detección precisa de rebote)
- webvisor: true (Grabación de sesiones - opcional, pero útil)
- trackHash: true (Seguimiento de cambios en URL hash)

PARA MÚLTIPLES IDIOMAS:
- Crea contadores separados para cada idioma si deseas análisis granular
- O usa un solo contador con segmentos por idioma

PARA SEO YANDEX:
- El contador debe estar activo para que Yandex indexe correctamente
- Webmaster Tools de Yandex requiere datos de Metrica para análisis
- Activa el seguimiento de objetivos para medir conversiones
-->
'''

def create_integration_file():
    """Crea un archivo con el código de integración listo para usar."""
    
    # Código base con placeholder para el ID
    placeholder_code = generate_yandex_metrica_code("{COUNTER_ID}")
    instructions = generate_metrica_comment_instructions()
    
    full_code = instructions + "\n\n" + placeholder_code
    
    # Guardar en archivo
    output_path = "yandex_metrica_integration.html"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_code)
    
    print(f"Archivo de integración creado: {output_path}")
    print("\nCONTENIDO GENERADO:")
    print("=" * 60)
    print(full_code)
    print("=" * 60)
    
    return output_path

def create_metrica_tracking_script():
    """Crea un script de Python para automatizar el seguimiento."""
    
    script_content = '''#!/usr/bin/env python3
"""
Yandex Metrica Event Tracking Script
Funciones para enviar eventos personalizados a Yandex Metrica.
"""

class YandexMetricaTracker:
    """Clase para rastrear eventos personalizados en Yandex Metrica."""
    
    def __init__(self, counter_id):
        self.counter_id = counter_id
        self.base_url = f"https://mc.yandex.ru/watch/{counter_id}"
    
    def track_pageview(self, page_url, title=None, referrer=None):
        """
        Rastrear vista de página manualmente.
        Útil para SPA (Single Page Applications).
        """
        print(f"Tracking pageview: {page_url}")
        # En producción, esto se hace vía JavaScript
        # ym(self.counter_id, 'hit', page_url, {
        #     title: title,
        #     referer: referrer
        # })
    
    def track_event(self, category, action, label=None, value=None):
        """
        Rastrear evento personalizado.
        
        Args:
            category (str): Categoría del evento (ej: 'booking', 'contact')
            action (str): Acción específica (ej: 'click', 'submit')
            label (str): Etiqueta opcional (ej: 'whatsapp_button')
            value (int): Valor numérico opcional
        """
        print(f"Tracking event: {category} - {action}")
        if label:
            print(f"  Label: {label}")
        if value:
            print(f"  Value: {value}")
        
        # En producción:
        # ym(self.counter_id, 'reachGoal', 'TARGET_NAME', params)
    
    def track_goal(self, goal_id, params=None):
        """
        Rastrear objetivo predefinido en Yandex Metrica.
        
        Args:
            goal_id (str): ID del objetivo configurado en Metrica
            params (dict): Parámetros adicionales
        """
        print(f"Tracking goal: {goal_id}")
        if params:
            print(f"  Params: {params}")
        
        # En producción:
        # ym(self.counter_id, 'reachGoal', goal_id, params)

# Ejemplos de uso para turismo:
if __name__ == "__main__":
    tracker = YandexMetricaTracker("{COUNTER_ID}")
    
    # Ejemplo: Seguimiento de clic en WhatsApp
    tracker.track_event("contact", "whatsapp_click", "hotel_button")
    
    # Ejemplo: Seguimiento de reserva
    tracker.track_event("booking", "initiate", "hotel_form", 150000)
    
    # Ejemplo: Seguimiento de búsqueda
    tracker.track_event("search", "submit", "hotel_search")
    
    # Ejemplo: Objetivo de conversión
    tracker.track_goal("booking_completed", {"hotel": "Hotel Camino Nacional", "value": 180000})
'''
    
    script_path = "tools/yandex_metrica_tracker.py"
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(script_content)
    
    print(f"Script de tracking creado: {script_path}")
    return script_path

if __name__ == "__main__":
    print("GENERADOR DE INTEGRACIÓN YANDEX METRICA")
    print("=" * 50)
    print()
    
    # Crear archivos de integración
    integration_file = create_integration_file()
    tracker_script = create_metrica_tracking_script()
    
    print()
    print("PASOS SIGUIENTES:")
    print("1. Ve a https://metrica.yandex.com/")
    print("2. Regístrate y crea un contador para salentoalamano.com")
    print("3. Copia el ID del contador")
    print("4. Reemplaza {COUNTER_ID} en los archivos generados")
    print("5. Integra el código en tu sitio web")
    print()
    print("Para SEO Yandex, es crucial tener el contador activo y configurado correctamente.")