# Fase 1: Estabilidad e Indexación SEO - Implementation Plan

## Task 1: Corregir vercel.json para servir HTML estático antes que SPA
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Modificar `vercel.json` para que URLs con archivos HTML estáticos reales (categorías, pautantes, paginas-pautantes, SEO internacional es/en/fr/de) se sirvan directamente
  - Mantener `cleanUrls: true` activo
  - Último rewrite de fallback para rutas no mapeadas al SPA
  - Estrategia: remover el rewrite catch-all universal y reemplazarlo por rewrites condicionales, o bien usar approach "primero archivos estáticos, luego fallback"
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-1.1: vercel.json parsea como JSON válido. `cleanUrls === true`. Rewrites no empiezan por `/(.*)` como primera regla.
  - `rule` TR-1.2: Existe al menos una regla de fallback al final de rewrites con destination `/index.html` o no existe catch-all (dado que cleanUrls + archivos estáticos se sirven automáticamente por Vercel).
- **Notes**: Preferible opción de no tener catch-all si cleanUrls ya sirve archivos HTML; pero si hay URLs dinámicas dentro de React, mantener un catch-all solo para rutas que NO empiecen por directorios estáticos conocidos.

## Task 2: Completar sitemap.xml con todas las páginas programáticas
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Leer páginas reales en public/ (8 categorías, 22 pautantes sin contar pautante.html genérico, 22 carpetas paginas-pautantes, 16 SEO internacional)
  - Añadir todas las URLs faltantes a `public/sitemap.xml` manteniendo formato existente
  - Actualizar `<lastmod>` a fecha actual 2026-09-02 en todas las URLs nuevas y en home
  - Prioridades: home 1.0 / categorias + paginas-pautantes + SEO internacional top: 0.9 / pautantes fichas cortas: 0.8
  - Mantener `xhtml:link hreflang` en URLs que tienen variante de idioma (solo home y páginas es/en/fr/de)
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-2.1: Conteo de `<loc>` en sitemap.xml >= 75 (XML válido).
  - `rule` TR-2.2: Grep `/categorias/` al menos 8 matches; `/pautantes/` >= 22; `/paginas-pautantes/` >= 22.
  - `rule` TR-2.3: Todas las URLs nuevas tienen `<lastmod>2026-09-02</lastmod>`.

## Task 3: Fix robots.txt (desbloquear /data/ y resolver sitemap defensivo)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Eliminar `Disallow: /*.json$` o precederlo por `Allow: /data/` para permitir crawleo de places.json/mapMarkers.json/hotels.json
  - Revisar referencias `Sitemap:` en robots.txt
  - Si `salentoalamano-defensive-sitemap.xml` no existe, crear una versión básica clonando las 10 primeras URLs de sitemap.xml (o todo el sitemap) y meterla en `public/` para que no haya referencias rotas
  - Mantener reglas específicas por bot (Baidu, Yandex, Yeti, Slurp, sociales) sin cambios
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `rule` TR-3.1: Grep robots.txt `Disallow: /*\.json\$` retorna 0 matches, o existe `Allow: /data/` ANTES de cualquier Disallow general.
  - `rule` TR-3.2: Grep robots.txt `^Sitemap:` muestra N URLs; todas las N referencian archivos presentes en `public/` (LS public/*sitemap* confirma existencia).
  - `rule` TR-3.3: `public/salentoalamano-defensive-sitemap.xml` existe y contiene >= 10 URLs `<loc>`.

## Task 4: Optimizar carga de Google Fonts (preconnect + links en HTML)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - En `index.html` `<head>`, añadir 3 links: (1) `<link rel="dns-prefetch" href="https://fonts.googleapis.com">`, (2) `<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>`, (3) `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, y finalmente (4) `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` con exactamente las mismas familias y pesos que actualmente hay en @import en styles.css
  - Extraer URL exacta de Google Fonts desde `@import url(...)` actual de styles.css (Fraunces 400..900 + DMSans 400..700 + DMMono 300..500 + display=swap)
  - En `src/styles.css`, eliminar la línea `@import url('https://fonts.googleapis.com/css2?...');` completa
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-4.1: Grep `@import` en `src/styles.css` retorna 0 matches (o al menos 0 matches con fonts.googleapis).
  - `rule` TR-4.2: index.html contiene exactamente 1 `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` con display=swap y las 3 familias (Fraunces|DM Sans|DM Mono).
  - `rule` TR-4.3: index.html contiene >= 2 preconnect o dns-prefetch a dominios Google Fonts.

## Task 5: Completar iconMap en App.tsx para evitar fallbacks incorrectos
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Ampliar `iconMap: Record<string, any>` = { ... } con TODOS los iconos que actualmente están importados desde 'lucide-react' y faltan en el map (al menos 12 nuevos: Mountain, MapPin, Sparkles, Heart, Star, Home, Menu, X, Search, Bell, Phone, Share2, Link, Building2, ChevronDown, ChevronRight, ArrowDown, ArrowUp, ArrowRight, LifeBuoy, Mail, MessageCircle, MessageSquare, Minus, Plus, Send, Shield, Globe, Eye, ShoppingBag)
  - Mantener fallback a Coffee (no borrarlo por si hay iconos JSON no contemplados)
  - No modificar imports existentes; solo añadir entradas a iconMap
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-5.1: `Object.keys(iconMap).length >= 20` (verificado por lectura directa del bloque iconMap).
  - `rule` TR-5.2: Todos los nombres del set {Mountain, MapPin, Sparkles, Compass, Utensils, Hotel, Coffee, ShoppingBasket, Bike, Store, Zap, Heart, Star, Home, Menu, X, Search, Bell, Phone, Share2} existen como keys en iconMap.

## Task 6: Extender types.ts con 3 nuevos tipos Details y campos Place opcionales
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Añadir `TransportDetails` con campos tipo: transportType ('Jeep Willys'|'Moto Aventura'|'Taxi Local'|'Shuttle'), routes, vehicleCount, languages, capacity, meetingPoint, pricingNotes, included, notIncluded
  - Añadir `HorsebackRidingDetails` con campos tipo: trails, horseBreeds, guidesCount, difficulty, minAge, maxWeightKg, safetyGearIncluded, routeDuration, departureTimes
  - Añadir `TourismDetails` con campos tipo: attractions, languages, guidedAvailable, bestVisitTime, tips, accessibilityInfo, tourDuration, includesGuide
  - Extender `export type Place` con 3 campos opcionales: `transportDetails?: TransportDetails`, `horsebackRidingDetails?: HorsebackRidingDetails`, `tourismDetails?: TourismDetails`
  - NO modificar otros tipos existentes; NO cambiar places.json
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-6.1: types.ts exporta 3 nombres de type nuevos (grep `export type TransportDetails`, `HorsebackRidingDetails`, `TourismDetails` retorna 3 matches).
  - `rule` TR-6.2: Place type incluye 3 campos opcionales con ? para los 3 tipos nuevos (grep Place bloque).
  - `rule` TR-6.3: `npm run type-check` (tsc --noEmit) termina exit code 0.

## Task 7: Inyectar Schema.org JSON-LD en generate_category_pages.js
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Añadir función helper `buildSchemaJsonLd(place)` que retorne un bloque `<script type="application/ld+json">...` con tipo Schema específico:
    - Alojamientos → `Hotel` (schema.org/Hotel) con address, geo, aggregateRating con ratingValue del place, priceRange, telephone, url, image
    - Restaurantes/Cafés → `Restaurant` o `CafeOrCoffeeShop` según type
    - Experiencias → `TouristAttraction` o `LocalBusiness` tipo TourOperator
    - Artesanías/Tiendas → `Store` o `LocalBusiness` tipo CraftShop
    - Servicios → `LocalBusiness`
  - Añadir función helper `buildBreadcrumbListSchema(breadcrumbItems)` con 3 niveles: Inicio > Categoría > Proveedor
  - Inyectar ambos bloques Schema antes de `</head>` en `renderProviderLandingPage()`
  - Inyectar BreadcrumbList en `renderCategoryPage()` con 2 niveles: Inicio > Categoría
  - Todo inyectado como strings HTML (mantenemos 0 runtime JS)
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-7.1: Grep `generate_category_pages.js` `application/ld\+json` retorna >= 2 matches (funciones buildSchema + inyecciones).
  - `rule` TR-7.2: Renderizando 1 muestra (ej. renderProviderLandingPage con place type Alojamientos) produce un string que contiene `"@type": "Hotel"` y `"@type": "BreadcrumbList"` (o confirmar por lectura estática del template literals).
  - `rubric` TR-7.3: Tipificación Schema; scale 1-5; anchors 1=ninguno 3=solo LocalBusiness genérico 5=Schema tipo-específico por categoría + BreadcrumbList; threshold >= 4; evidence lectura del switch/case o condicionales en buildSchemaJsonLd.

## Task 8: Activar react-helmet-async dinámico en App.tsx (title/description)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - Importar `{ Helmet }` (o subcomponente default export si Helmet no está named) desde 'react-helmet-async'
  - Calcular `helmetTitle` y `helmetDescription` usando useMemo basado en:
    - Si `selectedPlace` está abierto → `"{selectedPlace.name} | Salento a la Mano 2026 - {Categoría} directo en Salento, Quindío"`
    - Si `selectedCategory !== 'Todo'` → `"{selectedCategory} en Salento, Quindío 2026 | Salento a la Mano"`
    - Default (home) → title y description iguales al index.html base
  - Renderizar `<Helmet><title>{helmetTitle}</title><meta name="description" content={helmetDescription} /></Helmet>` en el return de App (dentro del Fragment principal, previamente al markup de header)
  - No modificar main.tsx (HelmetProvider ya existe)
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-8.1: Grep App.tsx `from 'react-helmet-async'` retorna 1 match importando Helmet.
  - `rule` TR-8.2: Grep App.tsx `<Helmet>` retorna >= 1 match, y dentro del bloque se encuentra `<title>` + `<meta name="description"`.
  - `rule` TR-8.3: El title/description tienen lógica condicional (lectura de selectedPlace o selectedCategory) demostrada por lectura del useMemo/computed.

## Task 9: Verificación global (build + type-check)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8
- **Description**:
  - Ejecutar `npm run type-check`
  - Ejecutar `npm run build`
  - Confirmar que no hay regresiones
  - Registrar evidencia de ambos comandos
- **Acceptance Criteria Addressed**: AC-6 (type-check), NFR-1, NFR-2
- **Test Requirements**:
  - `rule` TR-9.1: `npm run type-check` exit code === 0.
  - `rule` TR-9.2: `npm run build` exit code === 0 (con warnings permitidos).
  - `rubric` TR-9.3: Crecimiento de bundle gzip; scale 1-5; anchors 1=+30KB+ 3=+10~30KB 5=<+10KB; threshold >= 4; evidence revisando tamaño dist/assets/*.js.gz (o output del build si reporta tamaño).
