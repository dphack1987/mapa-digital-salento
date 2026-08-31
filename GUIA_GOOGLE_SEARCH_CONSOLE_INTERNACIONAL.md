# 🔍 GUÍA DE CONFIGURACIÓN GOOGLE SEARCH CONSOLE INTERNACIONAL

**Fecha:** 31/08/2026  
**Objetivo:** Indexación global inmediata para mercado europeo  
**Versión:** 1.0

---

## 🎯 OBJETIVO DE LA GUÍA

Configurar Google Search Console para indexación internacional inmediata, permitiendo que los buscadores globales (Google, Bing, etc.) indexen nuestro contenido anti-desinformación en múltiples idiomas.

---

## 📋 PASO 1: REGISTRO EN GOOGLE SEARCH CONSOLE

### 1.1 Crear Propiedad de Búsqueda
1. Acceder a [Google Search Console](https://search.google.com/search-console)
2. Hacer clic en "Agregar propiedad"
3. Seleccionar "Prefijo de URL"
4. Ingresar: `https://mapa-salento.com/`
5. Verificar propiedad (archivo HTML o DNS)

### 1.2 Configurar Propiedad Dominio (Opcional pero Recomendado)
1. Agregar propiedad "Dominio"
2. Ingresar: `mapa-salento.com`
3. Verificar mediante registro DNS

---

## 🌍 PASO 2: CONFIGURACIÓN INTERNACIONAL

### 2.1 Configurar Idiomas y Regiones

#### Configuración de Idioma
1. En Search Console, ir a "Configuración" → "Idioma"
2. Seleccionar "Todos los idiomas" (para contenido multi-idioma)
3. O especificar idiomas principales: Español, Inglés, Alemán, Francés, Italiano

#### Configuración de Región (Geotargeting)
1. Ir a "Configuración" → "Audiencia internacional"
2. Para la propiedad principal: Dejar sin especificar (global)
3. Para propiedades específicas por idioma (si se crean):
   - `/es/` → Colombia o sin especificar
   - `/en/` → Reino Unido o sin especificar
   - `/de/` → Alemania
   - `/fr/` → Francia
   - `/it/` → Italia

### 2.2 Verificar HREFLANG Tags
1. Ir a "Herramientas" → "Marcadores internacionales"
2. Verificar que Google detecte correctamente los tags hreflang
3. Corregir errores si existen

---

## 📊 PASO 3: ENVÍO DE SITEMAP

### 3.1 Enviar Sitemap Principal
1. Ir a "Sitemaps" en el menú izquierdo
2. Ingresar URL del sitemap: `sitemap.xml`
3. Hacer clic en "Enviar"
4. Verificar estado de procesamiento

### 3.2 Verificar Sitemap
1. Después del envío, verificar que Google procese el sitemap
2. Revisar número de URLs descubiertas
3. Verificar que no haya errores de indexación

### 3.3 Monitorear Indexación
1. Ir a "Índice" → "Cobertura"
2. Verificar URLs indexadas
3. Revisar errores de indexación
4. Corregir problemas encontrados

---

## 🔍 PASO 4: VERIFICACIÓN DE SCHEMA.ORG

### 4.1 Verificar Datos Estructurados
1. Ir a "Mejoras" → "Datos estructurados"
2. Verificar que Google detecte Schema.org NewsArticle
3. Verificar Schema.org Place y LocalBusiness
4. Corregir errores de sintaxis si existen

### 4.2 Prueba de Resultados Enriquecidos
1. Usar [Herramienta de prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
2. Ingresar URL principal: `https://mapa-salento.com/`
3. Verificar que NewsArticle y Place sean detectados
4. Corregir errores antes de indexación

---

## 📱 PASO 5: CONFIGURACIÓN OPEN GRAPH

### 5.1 Verificar Previsualización Social
1. Usar [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Ingresar URL principal
3. Verificar previsualización de Open Graph
4. Corregir meta tags si la previsualización es incorrecta

### 5.2 Verificar Twitter Cards
1. Usar [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Ingresar URL principal
3. Verificar previsualización de Twitter Card
4. Corregir meta tags si necesario

---

## 🌐 PASO 6: CONFIGURACIÓN BING WEBMASTER TOOLS

### 6.1 Registro en Bing Webmaster Tools
1. Acceder a [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Agregar sitio: `https://mapa-salento.com/`
3. Verificar propiedad (método meta tag o archivo)
4. Configurar sitemap: `sitemap.xml`

### 6.2 Configuración Internacional Bing
1. Ir a "Configuración" → "Configuración del sitio"
2. Configurar idioma principal: Español
3. Habilitar "Detección automática de idioma"
4. Configurar región principal: Colombia

---

## 📊 PASO 7: MONITOREO Y OPTIMIZACIÓN

### 7.1 Monitoreo de Búsqueda
1. **Rendimiento de búsqueda:** Monitorear clicks, impresiones, CTR
2. **Consultas de búsqueda:** Identificar keywords que generan tráfico
3. **Páginas:** Verificar qué páginas se indexan mejor
4. **Países:** Monitorear tráfico por país

### 7.2 Optimización Continua
1. **Mejorar CTR:** Optimizar títulos y descripciones
2. **Expandir keywords:** Añadir nuevas keywords estratégicas
3. **Mejorar contenido:** Actualizar contenido basado en rendimiento
4. **Corregir errores:** Resolver problemas de indexación inmediatamente

---

## 🎯 PASO 8: ESTRATEGIA DE INDEXACIÓN ACELERADA

### 8.1 Indexación Manual de URLs Críticas
1. Usar "Inspección de URL" en Search Console
2. Ingresar URLs críticas manualmente:
   - `https://mapa-salento.com/`
   - `https://mapa-salento.com/estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100`
   - `https://mapa-salento.com/de/salento-sicherheit-2026`
   - `https://mapa-salento.com/fr/salento-securite-2026`
3. Solicitar indexación para cada URL
4. Monitorear estado de indexación

### 8.2 Crear Backlinks de Alta Autoridad
1. Contactar sitios de autoridad turística
2. Solicitar enlaces a nuestra página oficial
3. Crear contenido en otros sitios que enlace a nosotros
4. Usar directorios de turismo internacional

### 8.3 Generar Tráfico Inicial
1. Compartir en redes sociales internacionales
2. Contactar blogs de viaje europeos
3. Publicar en foros de turismo especializados
4. Generar tráfico orgánico para acelerar indexación

---

## 📈 PASO 9: MÉTRICAS DE ÉXITO

### KPIs de Indexación Internacional
- **URLs indexadas:** 15 URLs principales en 48 horas
- **Keywords posicionadas:** Top 10 para keywords principales en 7 días
- **Tráfico internacional:** 1,000+ visitas desde Europa en primera semana
- **CTR global:** > 5% en resultados de búsqueda
- **Impresiones:** 10,000+ impresiones en primera semana

### Métricas por Mercado
- **Alemania:** Top 5 para "Salento Sicherheit" en 7 días
- **Francia:** Top 5 para "Salento Sécurité" en 7 días
- **Reino Unido:** Top 5 para "Salento Safety" en 7 días
- **España:** Top 5 para "Salento Seguridad" en 7 días
- **Italia:** Top 5 para "Salento Sicurezza" en 7 días

---

## 🚨 PASO 10: RESOLUCIÓN DE PROBLEMAS COMUNES

### Problema: HREFLANG Errors
**Solución:** Verificar que las URLs en hreflang sean accesibles y retornen código 200

### Problema: Schema.org No Detectado
**Solución:** Verificar sintaxis JSON-LD, usar herramienta de prueba de Google

### Problema: URLs No Indexadas
**Solución:** Usar "Inspección de URL" para solicitar indexación manual

### Problema: Tráfico Bajo desde Europa
**Solución:** Añadir backlinks de sitios europeos, optimizar keywords específicas

### Problema: CTR Bajo
**Solución:** Optimizar títulos y descripciones, añadir llamadas a la acción

---

## 🎯 CHECKLIST FINAL DE CONFIGURACIÓN

### Antes del LanZamiento
- [ ] Propiedad Google Search Console verificada
- [ ] Sitemap enviado y procesado
- [ ] HREFLANG tags configurados correctamente
- [ ] Schema.org verificado sin errores
- [ ] Open Graph y Twitter Cards funcionando
- [ ] Bing Webmaster Tools configurado
- [ ] URLs críticas enviadas para indexación manual
- [ ] Monitoreo de rendimiento configurado

### Después del LanZamiento (48 horas)
- [ ] Verificar URLs indexadas (mínimo 10 URLs principales)
- [ ] Monitorear keywords posicionadas
- [ ] Revisar tráfico por país
- [ ] Analizar CTR por mercado
- [ ] Corregir errores de indexación
- [ ] Optimizar contenido basado en datos iniciales

---

## 📞 SOPORTE Y RECURSOS

### Recursos de Google
- [Documentación Search Console](https://support.google.com/webmasters/)
- [Documentación HREFLANG](https://support.google.com/webmasters/answer/189077)
- [Documentación Schema.org](https://developers.google.com/search/docs/guides/intro-structured-data)

### Herramientas de Testing
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool)

---

**Estado de Configuración:** ✅ LISTO PARA EJECUCIÓN  
**Tiempo Estimado:** 2-4 horas para configuración completa  
**Impacto Esperado:** Indexación global en 48-72 horas