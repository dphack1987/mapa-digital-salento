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
- `public/data/` - **Fuente única de verdad** — archivos JSON de lugares, hoteles, marcadores y productos
- `dist/` - Directorio de build (generado por Vite, no commitear)

### Dependencias Principales

- React 18.3.1
- Vite 5.4.0
- React Leaflet 4.2.1
- Lucide React 0.344.0

## 🌐 Funcionalidades Principales

### Usuario Final
- ✅ Mapa interactivo con Leaflet
- ✅ Directorio de servicios locales
- ✅ Pedidos directos por WhatsApp
- ✅ Sistema de reseñas y calificaciones
- ✅ Asistente virtual Don Chucho (con imágenes personalizadas)
- ✅ Modo offline para Valle de Cocora
- ✅ Multi-idioma (ES, EN, FR, DE, PT, IT)
- ✅ Multi-moneda (COP, USD, EUR)
- ✅ Notificaciones inteligentes
- ✅ Sistema de cabalgatas
- ✅ Centro de soporte
- ✅ Landing pages dinámicas SEO
- ✅ Sistema QR para hoteles

### Servicios Backend
- ✅ `currencyService` - Conversión de monedas
- ✅ `weatherService` - Información del clima
- ✅ `eventsService` - Eventos locales
- ✅ `donationService` - Sistema de donaciones
- ✅ `gamificationService` - Gamificación
- ✅ `horsebackRidingService` - Reservas de cabalgatas
- ✅ `reviewsService` - Sistema de reseñas
- ✅ `analyticsService` - Analíticas y tracking
- ✅ `supportService` - Centro de soporte
- ✅ `seoLandingService` - Páginas de aterrizaje SEO
- ✅ `hotelQRService` - Sistema QR para hoteles
- ✅ `notificationService` - Sistema de notificaciones
- ✅ `offlineStorage` - Almacenamiento offline
- ✅ `orderSyncService` - Sincronización de pedidos
- ✅ `donChuchoKnowledge` - Asistente virtual Don Chucho

### Componentes UI Activos
- ✅ `NotificationsPanel` - Panel de notificaciones
- ✅ `HorsebackRiding` - Reservas de cabalgatas
- ✅ `Reviews` - Sistema de reseñas
- ✅ `SupportCenter` - Centro de soporte
- ✅ `DynamicLandingPage` - Páginas de aterrizaje dinámicas
- ✅ `HotelInfoModal` - Modal de información de hotel
- ✅ `DonChucho` - Asistente virtual con imágenes personalizadas

### Componentes Adicionales (No integrados actualmente)
- ⏸️ `AnalyticsDashboard` - Panel de analíticas para negocios
- ⏸️ `BusinessAdmin` - Panel de administración para comercios
- ⏸️ `BusinessLogin` - Sistema de login para negocios
- ⏸️ `BacklinkManager` - Gestión de backlinks SEO
- ⏸️ `QRScanner` - Escáner QR avanzado

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

# Type checking
npm run type-check
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

## 🎨 Recursos Gráficos

- ✅ Logo principal: `logo_salento2026.png`
- ✅ Avatar Don Chucho: `avatar-don-chucho.png`
- ✅ Botón Don Chucho: `don-chucho-boton.png`
- ✅ Imágenes de Salento en carpeta `public/salento/`
- ✅ Imágenes de pautas en carpeta `public/pautas/`

## 📝 Estado del Proyecto

**Última actualización:** 31/08/2026
**Versión:** 0.1.0
**Estado:** ✅ Listo para despliegue en Vercel

**Cambios recientes:**
- Optimización de configuración para Vercel
- Integración de imágenes personalizadas de Don Chucho
- Verificación de todos los servicios funcionales
- Build exitoso sin errores de TypeScript