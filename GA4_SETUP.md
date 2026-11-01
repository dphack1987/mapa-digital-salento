# 📊 CONFIGURACIÓN DE GOOGLE ANALYTICS 4 - WSA 2026

## 🎯 Propósito

Google Analytics 4 ha sido integrado en el proyecto para documentar el impacto de "Salento a la Mano" para la nominación WSA 2026. El tracking permite recolectar métricas reales de usuarios, conversiones y comportamiento que son críticas para demostrar impacto al jurado del WSA.

## 📋 Estado Actual

- ✅ **Servicio GA4 creado:** `src/services/ga4Service.ts`
- ✅ **Integración en App.tsx:** Tracking de page views, categorías, búsquedas
- ✅ **Inicialización automática:** En `initializeAllServicesSafely()`
- ⚠️ **Measurement ID placeholder:** `G-XXXXXXXXXX` (requiere configuración)

## 🔧 PASOS PARA ACTIVAR GA4

### Paso 1: Crear Propiedad GA4 en Google Analytics

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Iniciar sesión con cuenta de Google
3. Crear una nueva cuenta o usar existente
4. Crear una nueva propiedad GA4:
   - Nombre: "Salento a la Mano"
   - Zona horaria: Colombia (GMT-5)
   - Moneda: Peso colombiano (COP)
5. Copiar el **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Paso 2: Configurar Measurement ID en el Proyecto

**✅ YA CONFIGURADO:** Measurement ID real G-1Z70BRW660

**Configuración actual:**
- Archivo: `src/services/ga4Service.ts` línea 403
- ID: `G-1Z70BRW660`
- Estado: ✅ Activo y listo para producción
- index.html: Script de respaldo agregado (comentado, listo para activar)

### Paso 3: Verificar Configuración

1. Crear archivo `.env.local` en la raíz del proyecto:
```bash
VITE_GA4_MEASUREMENT_ID=G-A1B2C3D4E5
```

2. Modificar `src/services/ga4Service.ts`:
```typescript
const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX'
const ga4Service = new GA4Service(measurementId)
```

### Paso 3: Verificar Configuración

1. Ejecutar el proyecto en desarrollo:
```bash
npm run dev
```

2. Abrir la consola del navegador (F12)
3. Buscar logs de `[GA4]`:
   - `[GA4] Inicializado con ID: G-A1B2C3D4E5`
   - `[GA4] Page view: /`
   - `[GA4] Event: category_filter`

4. Si ves `[GA4] Measurement ID es placeholder`, el ID no está configurado correctamente

### Paso 4: Verificar en Google Analytics

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Seleccionar la propiedad "Salento a la Mano"
3. Ir a **Reports** → **Realtime**
4. Abrir el sitio en navegador
5. Deberías ver **1 active user** en tiempo real

## 📊 EVENTOS TRACKING IMPLEMENTADOS

### Eventos de Navegación

- **`page_view`** - Vista de página
  - `page_path`: Ruta de la página
  - `page_title`: Título de la página
  - `page_location`: URL completa

- **`category_filter`** - Filtro de categoría
  - `category`: Categoría seleccionada (Todo, Restaurantes, Hoteles, etc.)

- **`search_query`** - Búsqueda en mapa
  - `search_query`: Término de búsqueda
  - `results_count`: Número de resultados
  - `category`: Categoría filtrada

### Eventos de Interacción con Lugares

- **`place_view`** - Vista de lugar
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar
  - `category`: Categoría del lugar
  - `is_pautante`: Si es pautante

- **`whatsapp_click`** - Clic a WhatsApp
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar
  - `category`: Categoría del lugar

- **`phone_click`** - Clic a teléfono
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar

- **`email_click`** - Clic a email
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar

- **`website_click`** - Clic a website
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar

### Eventos de Conversión

- **`order_submit`** - Pedido enviado
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar
  - `order_value`: Valor del pedido (COP)
  - `currency`: Moneda del pedido

- **`review_submit`** - Reseña enviada
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar
  - `rating`: Calificación (1-5)

### Eventos de Don Chucho

- **`don_chucho_query`** - Pregunta a Don Chucho
  - `query`: Pregunta del usuario (limitada a 100 caracteres)
  - `answer_type`: Tipo de respuesta (knowledge_base, ai, fallback)

### Eventos de Configuración

- **`language_change`** - Cambio de idioma
  - `language`: Idioma seleccionado
  - `previous_language`: Idioma anterior

- **`currency_change`** - Cambio de moneda
  - `currency`: Moneda seleccionada
  - `previous_currency`: Moneda anterior

### Eventos de Funcionalidades Especiales

- **`qr_generated`** - QR generado
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar

- **`qr_scanned`** - QR escaneado
  - `place_id`: ID del lugar
  - `place_name`: Nombre del lugar

- **`horseback_riding_booking`** - Reserva de cabalgata
  - `provider`: Proveedor de cabalgata
  - `participants`: Número de participantes

- **`voice_input`** - Uso de voz
  - `success`: Si fue exitoso
  - `duration_seconds`: Duración en segundos

- **`ally_registration`** - Registro de aliado
  - `business_type`: Tipo de negocio

- **`ally_verification`** - Verificación de aliado
  - `success`: Si fue exitoso

## 🎯 MÉTRICAS CLAVE PARA WSA

### Métricas de Adopción

Para el jurado WSA, estas métricas son críticas:

1. **Visitantes Únicos (30 días)**
   - Google Analytics: `Reports` → `Acquisition` → `Traffic acquisition`
   - KPI objetivo: 500-1,000 visitantes únicos

2. **Tiempo Promedio en Sitio**
   - Google Analytics: `Reports` → `Engagement` → `Pages and screens`
   - KPI objetivo: >2 minutos

3. **Tasa de Rebote**
   - Google Analytics: `Reports` → `Engagement` → `Pages and screens`
   - KPI objetivo: <60%

### Métricas de Conversión

1. **Tasa de Conversión (pedidos / visitas)**
   - Fórmula: `event_count(order_submit) / page_view_count`
   - KPI objetivo: 2-5%

2. **Interacción con Lugares (clics / vistas)**
   - Fórmula: `(whatsapp_click + phone_click) / place_view`
   - KPI objetivo: >20%

### Métricas de Geografía

1. **Distribución por País**
   - Google Analytics: `Reports` → `Demographics` → `User attributes` → `Location`
   - Importante para demostrar impacto internacional

2. **Distribución por Idioma**
   - Fórmula: Contar eventos `language_change` por idioma
   - Importante para demostrar multi-idioma efectivo

### Métricas de Funcionalidades

1. **Uso de Don Chucho**
   - Google Analytics: `Reports` → `Events` → `don_chucho_query`
   - KPI objetivo: >100 queries/semana

2. **Uso de Búsqueda**
   - Google Analytics: `Reports` → `Events` → `search_query`
   - KPI objetivo: >50 searches/semana

3. **Cambios de Idioma**
   - Google Analytics: `Reports` → `Events` → `language_change`
   - Importante para demostrar necesidad de multi-idioma

## 📈 CÓMO EXPORTAR DATOS PARA WSA

### Exportación desde Google Analytics

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Seleccionar la propiedad "Salento a la Mano"
3. Para cada métrica clave:
   - Configurar el reporte (filtro por fecha, segmento)
   - Click en **Export** → **Google Sheets** o **CSV**
   - Guardar en carpeta `docs/wsa/analytics/`

### Métricas a Exportar (30 días)

1. **Visitantes Únicos** - `Reports` → `Audience` → `Overview`
2. **Tiempo en Sitio** - `Reports` → `Engagement` → `Pages and screens`
3. **Tasa de Rebote** - `Reports` → `Engagement` → `Pages and screens`
4. **Distribución por País** - `Reports` → `Demographics` → `Location`
5. **Eventos - place_view** - `Reports` → `Events` → `place_view`
6. **Eventos - whatsapp_click** - `Reports` → `Events` → `whatsapp_click`
7. **Eventos - order_submit** - `Reports` → `Events` → `order_submit`
8. **Eventos - don_chucho_query** - `Reports` → `Events` → `don_chucho_query`
9. **Eventos - language_change** - `Reports` → `Events` → `language_change`
10. **Eventos - search_query** - `Reports` → `Events` → `search_query`

### Crear Dashboard de Impactos

Usar los datos exportados para crear un dashboard visual:

1. **Visuales a crear:**
   - Gráfico de visitantes únicos (30 días)
   - Gráfico de tiempo en sitio (promedio)
   - Mapa de distribución geográfica
   - Gráfico de eventos por tipo
   - Tabla de top 5 lugares más visitados

2. **Herramientas recomendadas:**
   - Google Data Studio (gratis)
   - Tableau Public (gratis)
   - Excel/Google Sheets (básico)

## 🔒 PRIVACIDAD Y CUMPLIMIENTO

### Configuración de Privacidad

El servicio GA4 está configurado con:

- ✅ **Anonymize IP:** Habilitado (IPs anonimizadas)
- ✅ **No tracking de datos personales:** No se recopilan nombres, emails, teléfonos
- ✅ **Cookies con samesite=none:** Configuración segura

### Opción de Opt-out

Para deshabilitar tracking para un usuario:

```typescript
ga4Service.disableTracking()
```

Para reactivar:

```typescript
ga4Service.enableTracking()
```

### Compliance GDPR/CCPA

- El tracking es completamente anónimo
- No se recopilan datos personales
- IP anonimizada por defecto
- Cookies seguras configuradas

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: No veo datos en Google Analytics

**Soluciones:**
1. Verificar que el Measurement ID está configurado correctamente
2. Revisar consola del navegador para logs `[GA4]`
3. Esperar 24-48 horas para que GA4 procese datos
4. Verificar que no hay bloqueador de anuncios habilitado

### Problema: Eventos no se registran

**Soluciones:**
1. Verificar que `ga4Service.initialize()` se llama en `initializeAllServicesSafely()`
2. Revisar consola para errores de JavaScript
3. Verificar que el evento se llama con parámetros correctos

### Problema: Measurement ID placeholder

**Solución:**
1. Configurar el ID real siguiendo "Paso 2" arriba
2. Verificar que el ID tiene formato `G-XXXXXXXXXX`
3. Recargar la página

## 📞 SOPORTE

### Documentación Google Analytics

- [Google Analytics 4 Help](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Tracking](https://support.google.com/analytics/answer/9216061)
- [GA4 BigQuery Export](https://support.google.com/analytics/answer/9358801)

### Contacto Interno

Para preguntas sobre la implementación de GA4 en este proyecto:
- Revisar `src/services/ga4Service.ts`
- Revisar integración en `src/App.tsx`
- Documentación: `GA4_SETUP.md` (este archivo)

---

**Última actualización:** 31/10/2026  
**Versión:** 1.0.0  
**Propósito:** Documentación de impacto WSA 2026
