# Salento a la Mano - Mapa Digital Turístico

Aplicación móvil-first para turismo y comercio local en Salento, Quindío.

## 🚀 Despliegue en Vercel

Este proyecto se despliega automáticamente desde GitHub a Vercel.

### Configuración de Vercel

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Install Command**: `npm install`

### Estructura del Proyecto

- `src/` - Código fuente React
- `public/` - Archivos estáticos y service worker
- `dist/` - Directorio de build (generado por Vite)
- `data/` - Datos JSON de lugares y servicios

### Dependencias Principales

- React 18.3.1
- Vite 5.4.0
- React Leaflet 4.2.1
- Lucide React 0.344.0

## 🌐 Funcionalidades

- Mapa interactivo con Leaflet
- Directorio de servicios locales
- Pedidos directos por WhatsApp
- Sistema de reseñas
- Modo offline para Valle de Cocora
- Multi-idioma (ES, EN, FR, DE, PT, IT)
- Multi-moneda (COP, USD, EUR)

## 📱 Modo Offline

El sistema está optimizado para turistas que caminan al Valle de Cocora:

- Service Worker con caché de datos críticos
- IndexedDB para almacenamiento local
- Sincronización automática de pedidos
- Indicador de estado de conexión

## 🔧 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 📊 SEO Defensivo

Sistema de SEO defensivo para contrarrestar información alarmista:

- Landing pages dinámicas para búsquedas turísticas
- Schema.org JSON-LD para datos estructurados
- Don Chucho con respuestas defensivas
- Información oficial actualizada

## 🛡️ Seguridad

- Headers de seguridad configurados
- Service Worker solo en HTTPS
- Validación de inputs
- Sin exposición de datos sensibles