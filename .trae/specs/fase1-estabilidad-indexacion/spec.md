# Fase 1: Estabilidad e Indexación SEO - Product Requirements Document

## Overview
- **Summary**: Conjunto de 8 mejoras de alta prioridad para corregir fallos críticos de despliegue, completar la indexación de páginas programáticas, optimizar carga de fuentes, completar tipado TypeScript, enriquecer Schema.org y activar gestión dinámica de metadatos.
- **Purpose**: Garantizar que las ~69 páginas HTML estáticas generadas programáticamente sean correctamente servidas, indexadas y rastreadas por Google/Bing/Baidu/Yandex; eliminar fuentes bloqueantes; reducir casts `any` y enriquecer datos estructurados. Todo SIN borrar código existente, únicamente enriqueciendo.
- **Target Users**: Crawlers de motores de búsqueda, turistas internacionales, desarrolladores mantenedores, propietarios de negocios pautantes.

## Goals
1. Corregir el rewrite de Vercel para que las páginas HTML estáticas generadas programáticamente (categorías, pautantes, landing pages, SEO internacional) tengan prioridad sobre el catch-all del SPA.
2. Completar el sitemap.xml con todas las URLs actualmente generadas (~54 URLs faltantes).
3. Desbloquear el acceso de crawlers a `/data/*.json` (o permitir explícitamente el directorio) y resolver la referencia al sitemap defensivo.
4. Eliminar el `@import` bloqueante de Google Fonts de `styles.css` y sustituirlo por `<link rel="preconnect">` + `<link rel="stylesheet">` en `index.html`.
5. Completar el `iconMap` de App.tsx con TODOS los iconos importados de Lucide para evitar fallbacks inconsistentes.
6. Añadir 3 tipos detallados faltantes en `types.ts` (`TransportDetails`, `HorsebackRidingDetails`, `TourismDetails`) y extender el `Place` type, eliminando parte de los casts `(place as any)`.
7. Enriquecer `generate_category_pages.js` para inyectar Schema.org JSON-LD específico (LocalBusiness/Hotel/Restaurant/TouristAttraction + BreadcrumbList) en cada landing de pautante y categoría.
8. Activar `react-helmet-async` en el home SPA con title/description dinámicos que respondan a la selección de categoría/detalle de lugar.

## Non-Goals
- No refactorizar App.tsx en submódulos (dejar para Fase 2).
- No cambiar estilos visuales ni layout.
- No conectar servicios SEO a APIs externas reales.
- No eliminar o renombrar servicios duplicados (notificationService vs notifications.service) - dejar para fase posterior.
- No cambiar estructura de datos places.json/hotels.json existente (solo extender types).

## Background & Context
Análisis previo del proyecto detectó 6 fallos 🔴 críticos + 7 altos. Esta fase aborda los 4 críticos y 4 de los altos con ROI más alto. Archivos afectados: `vercel.json`, `sitemap.xml`, `robots.txt`, `index.html`, `styles.css`, `src/App.tsx`, `src/types.ts`, `tools/generate_category_pages.js`. Archivos existentes no se tocan salvo aditivos.

## Functional Requirements
- **FR-1**: Al acceder a `/categorias/restaurantes`, `/pautantes/fonda-boquia.html`, `/paginas-pautantes/hotel-camino-nacional-salento/`, `/es/guias/guia-valle-del-cocora.html` en Vercel, el servidor devuelve el archivo `.html` estático correspondiente (no el SPA index.html de React).
- **FR-2**: `sitemap.xml` contiene al menos 80 URLs (raíz + estado/seguro/vias/valle/hoteles + 8 categorías + 22 pautantes + 22 paginas-pautantes + 16 SEO internacional), con `xhtml:link hreflang` para URLs que tienen variantes de idioma y lastmod coherente.
- **FR-3**: `robots.txt` no bloquea `/data/*.json` y su Sitmap: principal apunta a archivos existentes.
- **FR-4**: Google Fonts se carga mediante 2-3 `<link>` tags en `<head>` (preconnect + dns-prefetch opcional + stylesheet), no mediante `@import` en CSS.
- **FR-5**: `getIconComponent(X)` para cualquier X incluido en el set de iconos places.json retorna el icono Lucide correcto y nunca cae en fallback `Coffee` por un icono existente.
- **FR-6**: `Place` type incluye 3 campos adicionales opcionales (`transportDetails?`, `horsebackRidingDetails?`, `tourismDetails?`) con sus respectivos tipos tipados.
- **FR-7**: Cada template landing generado por `renderProviderLandingPage()` y `renderCategoryPage()` incluye un `<script type="application/ld+json">` en el `<head>` con Schema.org específico.
- **FR-8**: En el SPA (`/`), el `<title>` y `<meta name="description">` se actualizan dinámicamente al seleccionar una categoría o abrir el detalle de un lugar.

## Non-Functional Requirements
- **NFR-1**: Build (`npm run build`) y type-check (`npm run type-check`) pasan sin errores.
- **NFR-2**: Tamaño del bundle no aumenta >+10KB gzip respecto a antes (medido con `reportCompressedSize` de Vite).
- **NFR-3**: Campos recién añadidos son todos opcionales (`?`) para no romper places.json actual.
- **NFR-4**: Páginas HTML generadas siguen siendo 100% estáticas (no requieren JS runtime para mostrar Schema o meta tags).
- **NFR-5**: Todas las URLs generadas en el sitemap deben responder HTTP 200 cuando existe el archivo en `public/`.

## Constraints
- **Technical**: No borrar ni renombrar código existente (solo añadir/editar strings sin reemplazar comportamiento). React Helmet Async ya instalado en `package.json`. TypeScript estricto activado.
- **Business**: URLs de páginas generadas no cambian (evitar pérdida de indexación). Datos de places.json son canónicos y no se editan en esta fase.
- **Dependencies**: Ninguna dependencia nueva. Solo usar dependencias ya instaladas (leaflet, lucide, helmet-async, terser).

## Assumptions
- Vercel respeta el orden de `rewrites` en `vercel.json` (primero coincidencia gana). Alternativa: usar `cleanUrls: true` sin rewrites catch-all (ya activo).
- Los 22 pautantes listados en `/public/pautantes/` (excluyendo `pautante.html` genérico) corresponden biyectivamente a las 22 carpetas de `/public/paginas-pautantes/`.
- Google Fonts `Fraunces`, `DM Sans`, `DM Mono` permanecen iguales (solo cambia método de carga).
- `icon` field en places.json usa strings compatibles con nombres de iconos Lucide importados actualmente.

## Acceptance Criteria

### AC-1: Vercel sirve HTML estático antes que SPA
- **Type**: `rule`
- **Given**: `public/categorias/restaurantes.html` existe en el repo
- **When**: Configuración `vercel.json` es aplicada
- **Then**: Reglas antes del catch-all sirven archivos HTML existentes (categorías, pautantes, paginas-pautantes, es/en/fr/de), y solo rutas no existentes caen al SPA `/index.html`
- **Pass Condition**: En `vercel.json`, existen reglas `rewrites` con rutas específicas (o ningun catch-all) de forma que URLs con archivo HTML real no son capturadas por el fallback; `cleanUrls: true` permanece activo
- **Evidence**: Lectura de vercel.json; validación sintáctica JSON

### AC-2: Sitemap completo con todas las páginas
- **Type**: `rule`
- **Given**: Número de páginas HTML en public/: 8 categorías + 22 pautantes + 22 pautantes-landing + 16 SEO internacional = 68 + home + 5 landings temáticas (estado actual, seguros, vias, valle, hoteles)
- **When**: Se lee `public/sitemap.xml`
- **Then**: El sitemap contiene >= 75 URLs `<loc>` válidas, incluye URLs de /categorias/*, /pautantes/*, /paginas-pautantes/*/index (formateadas clean), y lastmod actualizado
- **Pass Condition**: Conteo manual de URLs en sitemap >= 75, al menos 8 URLs que empiecen por `/categorias/`, al menos 22 por `/pautantes/`, al menos 22 por `/paginas-pautantes/`
- **Evidence**: Grep sobre sitemap.xml con conteo por categoría

### AC-3: robots.txt desbloquea /data/ y apunta a sitemaps reales
- **Type**: `rule`
- **Given**: Estado actual: `Disallow: /*.json$` y Sitemap secundario inexistente
- **When**: Se lee `public/robots.txt`
- **Then**: No hay regla que bloquee `/data/*.json` (o bien Allow antes de Disallow). Solo existen líneas `Sitemap:` a archivos presentes en `public/`
- **Pass Condition**: `Disallow: /*.json$` eliminado o precedido por `Allow: /data/`; referencias a sitemaps defensivos eliminadas si el archivo no existe, o se crea el archivo
- **Evidence**: Lectura línea a línea de robots.txt + verificación existencia de archivos sitemap

### AC-4: Google Fonts carga no-bloqueante mediante links en HTML
- **Type**: `rule`
- **Given**: `@import url('https://fonts.googleapis.com/css2?...');` actualmente en styles.css
- **When**: Se revisan `index.html` head y primeras líneas de styles.css
- **Then**: styles.css NO contiene `@import url(` para Google Fonts. index.html `<head>` contiene `<link rel="preconnect">` a fonts.gstatic.com y fonts.googleapis.com, y `<link rel="stylesheet">` a Google Fonts CSS con `display=swap`.
- **Pass Condition**: Grep @import en styles.css retorna 0 matches; index.html contiene al menos 2 link tags de fonts
- **Evidence**: Grep sobre ambos archivos

### AC-5: iconMap cubre todos los iconos importados para no fallar
- **Type**: `rule`
- **Given**: App.tsx importa N iconos de lucide-react (conteo actual: 44 icon names en imports)
- **When**: Se evalúa `iconMap` y `Object.keys(iconMap).length`
- **Then**: `iconMap` incluye al menos 20 entradas (>= 2x estado actual) cubriendo todos los iconos de categorías principales y aquellos presentes en places.json: Mountain, MapPin, Sparkles, Compass, Utensils, Hotel, Coffee, ShoppingBasket, Bike, Store, Zap, Heart, Star, Home, Menu, X, Search, Bell, Phone, Share2
- **Pass Condition**: `Object.keys(iconMap).length >= 20`; cada iconName del set anterior está presente en keys
- **Evidence**: Conteo keys de iconMap + verificación nombre a nombre

### AC-6: Tipos Place extendidos con 3 nuevos details types sin romper build
- **Type**: `rule`
- **Given**: types.ts actual define 4 tipos de *Details. npm run type-check pasa
- **When**: Añadidos `TransportDetails`, `HorsebackRidingDetails`, `TourismDetails` y 3 campos opcionales al type `Place`
- **Then**: `npm run type-check` retorna exit code 0; campos nuevos son `?` opcionales; no hay TS2322 en places (debido a opcionalidad)
- **Pass Condition**: Ejecución `npm run type-check` (tsc --noEmit) pasa
- **Evidence**: Salida del comando type-check

### AC-7: Schema.org JSON-LD específico inyectado en generators de páginas
- **Type**: `rubric`
- **Dimension**: Completitud de datos estructurados en páginas programáticas
- **Scale**: 1-5
- **Anchors**: 1 = Ningún cambio en generators; 3 = Añadido 1 tipo de Schema (LocalBusiness) a todas las landings; 5 = Añadidos Schema tipo-específicos (Hotel/Restaurant/Cafe/TouristAttraction/LocalBusiness según type) + BreadcrumbList en todas las páginas
- **Pass Threshold**: >= 4
- **Evidence**: Lectura de `generate_category_pages.js` (bloques donde escribe `<script type="application/ld+json">`) y revisión de 1 página generada como muestra que contiene el `<script>`

### AC-8: react-helmet-async actualiza title/description dinámicamente en el SPA
- **Type**: `rule`
- **Given**: main.tsx ya envuelve app en `<HelmetProvider>`; `react-helmet-async` en package.json
- **When**: Se navega por el SPA (cambio de categoría o apertura de detalle de lugar)
- **Then**: App.tsx renderiza un `<Helmet>` que sobreescribe `<title>` y `<meta name="description">` con contenido alineado al estado actual
- **Pass Condition**: App.tsx importa Helmet/Helmet provider subcomponente; existe al menos 1 bloque `<Helmet>` con title y description condicionales por estado
- **Evidence**: Grep de `<Helmet` en App.tsx + lectura del contenido del Helmet block

## Open Questions
- [ ] ¿Crear el archivo de sitemap defensivo (`salentoalamano-defensive-sitemap.xml`) aunque sea un clone vacío/minimal de sitemap.xml, para no romper la referencia en robots.txt, o eliminar esa línea completamente? — *Decisión en el implementador: mantener consistencia y crear el archivo con las mismas URLs del sitemap principal.*
