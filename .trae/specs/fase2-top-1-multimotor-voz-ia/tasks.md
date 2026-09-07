# Fase 2: Campaña TOP 1 Multimotor + Voz + IA (Salento, Quindío) - Implementation Plan

## Task 1: Tipos semánticos extendidos en types.ts para 100+ lugares
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None (bloquea Task 2)
- **Description**:
  - Añadir campos opcionales `Place.aggregateRating?` (ratingValue, reviewCount), `Place.actionTarget?` (ReserveAction/OrderAction targets), `Place.speakable?` (cssSelector string array).
  - Añadir `GuidePage` type para hub de guías con `travelDuration, bestSeason, difficulty, itineraryItems[]`.
  - Añadir `FAQ` type con `question, answer, speakableCSS, category, keywords[]`.
  - Añadir `I18nLocale` = ES | EN | DE | FR | PT | IT | ZH | JA | KO | TH | VI | ID | MS; exportar constante LOCALES_14 con metadatos (lang code, country code, hreflang code, inLanguage, google site verif meta opcional).
  - **Cero campos obligatorios nuevos**: todos los nuevos campos en Place deben mantener `?` para no romper 22 lugares existentes.
- **Acceptance Criteria Addressed**: AC-1, AC-6, AC-10, AC-11
- **Test Requirements**:
  - `rule` TR-1.1: `npm run type-check` exit code = 0; 0 `any` cast nuevo introducido por tipos (se permite mantener casts existentes).
  - `rule` TR-1.2: `Object.values(LOCALES_14).length === 14` y cada uno tiene `hreflang` válido (dos o cuatro letras formato xx-YY con guion), y `inLanguage = ISO 639-1`.
  - `rubric` TR-1.3: Cohesión del sistema de tipos; scale 1-5; anchors 1 = 0 tipos nuevos; 3 = tipos con sueltos sin docs; 5 = 4 tipos nuevos, todos documentados inline, 0 campos sin marcar `?` opcional; threshold >= 4; evidence = diff lectura types.ts.

## Task 2: Ampliar places.json de 22 a 100+ lugares
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Distribución objetivo final por categoría: Alojamientos ≥ 15, Restaurantes ≥ 15, Cafés ≥ 10, Artesanías ≥ 8, Tiendas ≥ 10, Experiencias ≥ 22 (7 actuales + 15 nuevas), Servicios ≥ 20 (3 actuales + 17 nuevas). Total ≥ 100.
  - Fuentes seed: (a) 22 pautantes ya existentes en `public/pautantes/*.html`, (b) `pautas/*.md` (cada md conviértelo en place si no existe), (c) listado público negocios Salento/Quindío verificables con nombre + teléfono público (ej: 3 nuevas fincas cafeteras, 3 nuevas cascadas/miradores, 5 restaurantes de Calle Real, 5 fondas/bares, 6 alojamientos rurales, 4 artesanías, 6 tiendas/ropa/cuero, 10 servicios: taxis, alquiler motos, cambio divisas, tour operadores, SPA, lavanderías, info turística, alquiler caballos, bicicletas, jeeps extras no registrados).
  - Cada place NUEVO debe tener: `tags >= 10` (mezcla de categoría + KW long tail: "restaurante barato", "centro", "calle real", "en familia", "con niños", "pet friendly", "24 horas", "WhatsApp", "vista valle"), `contact.phone` + `whatsapp`, `location.lat/lng` (coordenadas dentro del bounding box Salento: lat 4.52–4.72, lng -75.35–75.70), `operatingHours` al menos notes, `verified = true`, `active = true`, `accommodationDetails/foodServiceDetails/.../tourismDetails` donde aplique.
  - NO inventar nombres imposibles. Si falta un dato concreto se pone `"address": "Salento, Quindío, Colombia"` mínimo, pero `lat/lng` reales obligatorios.
- **Acceptance Criteria Addressed**: AC-1, AC-5, AC-8
- **Test Requirements**:
  - `rule` TR-2.1: `JSON.parse(fs.readFileSync('public/data/places.json')).places.length >= 100`.
  - `rule` TR-2.2: Categoría counts: Alojamientos>=15, Restaurantes>=15, Cafes>=10, Artesanias>=8, Tiendas>=10, Experiencias>=22, Servicios>=20. (Grep counts por type).
  - `rule` TR-2.3: Ningún place nuevo con `"name": ""` ni `"location": undefined`. Build exit 0.
  - `rubric` TR-2.4: Profundidad semántica por place nuevo; scale 1-5; anchors 1 = solo campos obligatorios; 3 = 50% tienen details types; 5 = todo place con details type, tags >= 10, operating hours, photos[] array con 2 URLs salentoalamano o placeholder de Unsplash licenciado; threshold >= 4; evidence = grep sample 10 places.

## Task 3: Sincronizar mapMarkers.json (≥100) + hotels.json (≥30)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Iterar sobre places.json y emitir un `MapMarker` por place nuevo: `id` secuencial, `label = place.name.slice(0, 30)`, `type` = Turístico si Experiencias; Gastronómico si Restaurantes/Cafés; Comercial si resto. `tone`: coral si Alojamientos, green si Experiencias/Cafés/Artesanías/Tiendas, yellow si Restaurantes/Servicios. `placeId = place.id`.
  - hotels.json: ampliar a 30+ entradas tomando todo `place.type === 'Alojamientos'` y convertir a Hotel: `id = slugify(name)`, `name`, `address = place.location.address`, `phone = place.contact.phone`, `isPartner = place.verified` (por defecto). Si Alojamientos < 30, añadir al menos 15 alojamientos rurales nuevos ("Finca X", "Hostal Y", etc.) con tags coherentes.
- **Acceptance Criteria Addressed**: AC-1, AC-10
- **Test Requirements**:
  - `rule` TR-3.1: mapMarkers.length >= 100; every marker.placeId corresponde a un place.id existente.
  - `rule` TR-3.2: hotels.length >= 30; sin placeholder "Otro hospedaje" como entrada principal (se puede mantener 1 entrada default).
  - `rule` TR-3.3: build + type-check 0 errores; Leaflet mapa renderiza sin errores console.

## Task 4: Crear herramienta de generación de guías/FAQs en 14 idiomas
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Crear `tools/generate_guides_faqs_14locales.js` (script Node.js standalone, sin imports npm nuevos, usa fs + path + LOCALES_14 exportado desde `src/types.ts` si se puede, o duplicar el array dentro del script).
  - Exponer 2 funciones: `renderGuidePage(guideSlug, locale)` y `renderFAQHubPage(locale)` y `renderGuideIndexPage(locale)` y `renderLocaleHomePage(locale)` (si es necesario; locales 10 nuevos necesitan index.html).
  - Plantilla común por página HTML: `<!doctype html><html lang=""><head>` con:
    * `meta charset, viewport, theme-color`
    * `title` dinámico por locale + guide
    * `meta description` dinámico 140-160 chars
    * `meta robots = index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
    * `canonical` absoluta
    * 14 hreflang alternates (todos locales) + x-default
    * Open Graph + Twitter Card (template con logo Salento)
    * `link rel=preconnect crossorigin fonts.googleapis`
    * `link rel=preconnect crossorigin fonts.gstatic.com`
    * `link stylesheet Google Fonts CSS display=swap`
    * `link rel=stylesheet /page-theme.css`
    * `<body>` con:
      * `<nav class="sitewide-links">` footer-like nav arriba o abajo con ≥10 enlaces internos
      * breadcrumbs HTML (`<ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">`)
      * `<main>` con `<section class="hero"><h1>` + `.lead` speakable
      * sección H2/H3 semánticos
      * mini-FAQ (para guías)
      * "También te puede interesar": 3 landings pautantes relacionadas + 2 categorías
      * `<footer>` con sitewide links
  - Regenerar también los 4 locales actuales (es/en/fr/de) con la misma plantilla uniforme, manteniendo slugs originales.
- **Acceptance Criteria Addressed**: AC-2, AC-4, AC-7, AC-10
- **Test Requirements**:
  - `rule` TR-4.1: `node tools/generate_guides_faqs_14locales.js` run exit 0.
  - `rule` TR-4.2: Cada HTML generado contiene 15 `hreflang` alternates (14 locales + x-default) + canonical + title + description.
  - `rubric` TR-4.3: Uniformidad estructura HTML; scale 1-5; anchors 1 = cada template diferente; 3 = algunos campos faltan; 5 = todos HTML siguen misma estructura con 0 variaciones no deseadas; threshold >= 4; evidence = diff sample 5 HTML.

## Task 5: Extender generate_category_pages.js (Action, ContactPoint, Speakable, AggregateRating, footer sitewide, breadcrumb HTML)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1, Task 2
- **Description**:
  - Modificar `renderProviderLandingPage` y `renderProviderPage`:
    * Añadir schema `AggregateRating` (si rating existe: ratingValue = place.rating, ratingCount = 50 por defecto a menos que se indique)
    * Añadir schema `ReserveAction` / `OrderAction` / `ViewAction` según categoría: target = `https://wa.me/<whatsapp>` o `tel:<phone>` o `website`.
    * Añadir schema `ContactPoint`: telephone, email, contactOption = WhatsApp/Call/TollFree, availableLanguage = ["Español", "Inglés"... si existe], hoursAvailable = string array o schema `OpeningHoursSpecification` usando `operatingHours`.
    * Añadir schema `SpeakableSpecification` con cssSelector = ["section.hero h1", ".lead", ".provider-name h1", ".facts"]; inLanguage para cada locale (por ahora en ES).
    * Añadir `<nav class="sitewide-links">` con al menos 10 enlaces internos (home, estado, seguro, vías, valle, hoteles, FAQs, categorías, internacional, contacto).
    * Añadir breadcrumb HTML visible con microdata.
    * Añadir sección "Te puede interesar" con 2 guías + 2 landings relacionados.
  - Modificar `renderCategoryPage`:
    * Añadir Speakable + mini-FAQ 5 preguntas + "Ver también" 5 guías relacionadas por categoría
    * Mantener CollectionPage + ItemList
  - **0 deletes**: solo inserts en el template; ningún cambio de URL o de nombre de clase CSS existente.
- **Acceptance Criteria Addressed**: AC-5, AC-6, AC-7, AC-11
- **Test Requirements**:
  - `rule` TR-5.1: Grep por landing pautante: `ReserveAction`, `ContactPoint`, `SpeakableSpecification`, `AggregateRating`, `BreadcrumbList` = todos > 0 por archivo.
  - `rule` TR-5.2: `sitewide-links` clase aparece >=1 por cada categoría y cada landing.
  - `rule` TR-5.3: `npm run seo:generate` sin warnings. Build exit 0.

## Task 6: Generar hub de 30+ guías locales (ES) con HowTo + mini-FAQs
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4, Task 5
- **Description**:
  - Crear array `const GUIDES_30` en el generator con slugs + metadata por guía (los 30 slugs del FR-4).
  - Para cada guía:
    * title, description, heroLead, secciones H2 (Antes de ir / Itinerario / Cómo llegar / Presupuesto / Consejos / Dónde dormir / Dónde comer / FAQs).
    * Si la guía es tipo "procedimiento" / "itinerario" / "cómo llegar" / "mochila" / "qué llevar" -> emitir HowTo schema con >= 3 HowToStep, name, text, image url.
    * Mini-FAQ: 5 preguntas/respuestas por guía (obligatorio).
    * "Te puede interesar": enlaza 3 landings pautantes relacionados con la temática (ej guía Valle Cocora -> Cabalgatas Cocora Mágica, Guías del Cocora, Jeeps Willys Salento) y 2 categorías (Experiencias + Alojamientos).
    * Placeholder `<!-- TODO: contenido long-form humano autor -->` justo después de cada H2 para posterior reemplazo.
- **Acceptance Criteria Addressed**: AC-2, AC-6, AC-7, AC-11
- **Test Requirements**:
  - `rule` TR-6.1: GUIDES_30.length >= 30; `public/es/guias/*.html` count >= 33 (3 antiguas + 30 nuevas; ojo no eliminar las 3 ya existentes).
  - `rule` TR-6.2: HowTo schema count >= 20 en las guías tipo procedimiento.
  - `rule` TR-6.3: Cada guía tiene mini-FAQ con >= 5 preguntas; grep mainEntity FAQPage >=5 por cada guía ES.
  - `rubric` TR-6.4: Cobertura semántica de intenciones; scale 1-5; anchors 1 = 3 guías igual que antes; 3 = 15 guías, 2 categorías de intención; 5 = 30+ guías cubriendo: itinerario N días, cómo llegar desde 5 ciudades, clima/mes, presupuesto, gastronomía, alojamiento, experiencia, aventura, accesible, niños, lujo, económico, souvenirs, pueblos cercanos, fin de semana, temporada, boda, café; threshold >= 4; evidence = lista slugs GUIDES_30.

## Task 7: Generar hub FAQs 100+ preguntas + 14 locales
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - Crear `FAQS_100` array con 100+ entradas categorizadas en: General (20), Alojamiento (15), Transporte (15), Clima/Época (10), Gastronomía (10), Experiencias (15), Presupuesto (5), Accesibilidad (5), Voz/Asistentes (5). Cada entry: `id, category, keywords[], question, answer (1-2 oraciones max 300 chars), speakable: true`.
  - Para el hub ES: título "Preguntas frecuentes sobre Salento, Quindío en 2026 — Respuestas rápidas y contacto directo"; URL slug `preguntas-frecuentes-salento-quindio-2026.html`.
  - Cada pregunta con: (a) bloque FAQ visible HTML con CSS clases `.faq-q` / `.faq-a`, (b) FAQPage schema (mainEntity array), (c) QAPage entry por pregunta con answerCount = 1, (d) Speakable con cssSelectors a las clases.
  - Repetir estructura por cada 1 de los 13 locales adicionales: placeholder inglés/traducción corta manteniendo estructura.
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-11
- **Test Requirements**:
  - `rule` TR-7.1: ES FAQPage mainEntity count >= 100.
  - `rule` TR-7.2: 14 páginas FAQs (`public/<locale>/preguntas-frecuentes-...html` o su equivalente slug localizado con `index.html` si hace falta).
  - `rule` TR-7.3: Speakable presente en cada FAQ hub con cssSelectors `.faq-q`, `.faq-a`, `.hero h1`, `.lead`.
  - `rubric` TR-7.4: Calidad respuesta para voz; scale 1-5; anchors 1 = respuestas largas 500 chars; 3 = 250 chars promedio; 5 = <= 160 chars promedio, respuesta directa, verbo al inicio, sin párrafos complejos, apta para TTS; threshold >= 4; evidence = grep 20 FAQs sample length <= 250 chars promedio.

## Task 8: SEO internacional 14 locales: index + guías + FAQs
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6, Task 7
- **Description**:
  - Nuevas carpetas locales: `public/pt/`, `public/it/`, `public/zh/`, `public/ja/`, `public/ko/`, `public/th/`, `public/vi/`, `public/id/`, `public/ms/`, `public/en-gb/` (10 nuevas + 4 actuales + EN/GB separado = 14).
  - Cada carpeta tiene: `index.html` con título/descripción localizado, `guias/` con >= 33 archivos, `preguntas-frecuentes...html` (FAQ hub).
  - Mantén hreflang correcto: PT = pt-BR, IT = it-IT, ZH = zh-CN, JA = ja-JP, KO = ko-KR, TH = th-TH, VI = vi-VN, ID = id-ID, MS = ms-MY, EN-GB = en-GB. ES = es-CO. EN base = en-US. DE = de-DE. FR = fr-FR. x-default = es-CO.
  - Inyecta metas internacionales en el head: `og:locale`, `twitter:locale`, `meta http-equiv=Content-Language`, meta `inLanguage` en schema WebSite.
- **Acceptance Criteria Addressed**: AC-4, AC-8
- **Test Requirements**:
  - `rule` TR-8.1: 14 carpetas locales existen con index.html; `guias/` cada una >= 33 HTMLs.
  - `rule` TR-8.2: Cada guía/FAQ en cada locale tiene 15 `<link alternate hreflang>` (14 locales + x-default).
  - `rule` TR-8.3: Todos los hreflang son biyectivos (si A -> B, B -> A). Se valida con grep de los 14 locales sobre 1 guía.
  - `rubric` TR-8.4: Cobertura global; scale 1-5; anchors 1 = 4 locales; 3 = 9 locales; 5 = 14 locales hreflang biyectivos x-default ES canonical; threshold >= 4; evidence = ls carpetas + grep hreflang 1 guía.

## Task 9: Internal links silo, sitewide nav, breadcrumbs HTML en TODO HTML estático
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 5, Task 6, Task 7, Task 8
- **Description**:
  - Estandarizar plantilla común `const sitewideNavHtml` (10+ enlaces internos) + `const breadcrumbHtml(items)` + `const relatedHtml(guideSlug, category)` para reusar en TODO generator.
  - En cada guía: "También te puede interesar" -> 3 landings pautantes relacionadas (slug match) + 2 categorías relacionadas (tags match).
  - En cada categoría: "Explora también" -> 5 guías relacionadas + 5 FAQs relacionadas.
  - En cada landing pautante: "Otras opciones" -> 3 landings de misma categoría + 2 guías donde aparece el servicio.
  - En cada FAQ hub: "Sigue explorando" -> 5 guías + 5 categorías + 5 landings destacadas.
- **Acceptance Criteria Addressed**: AC-7, AC-11
- **Test Requirements**:
  - `rule` TR-9.1: Cada HTML estático (fuera SPA home) tiene al menos 20 internal links únicos a otras páginas internas del dominio.
  - `rule` TR-9.2: Breadcrumb HTML visible con microdata y schema BreadcrumbList JSON-LD están ambos presentes >= 1 por HTML.
  - `rubric` TR-9.3: Silos semánticos; scale 1-5; anchors 1 = 0 links contextuales; 3 = links nav solo; 5 = links contextuales por categoría, guías relacionadas, FAQs cruzados entre todo el dominio, sin links "huérfanos"; threshold >= 4; evidence = grep 1 HTML links internos.

## Task 10: AllyBacklinksDashboard seed data y estructura aliados
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - Crear `public/data/ally-sites.json` con 50+ aliados basados en (a) los pautantes que tienen website, (b) pautas/*.md con sitio oficial, (c) directorios locales y turísticos colombianos. Cada aliado: `id, name, domain, backlinkUrl (página donde queremos que enlacen), status = pending | approved | live, anchorTextSuggestions[], category, contact email/whatsapp, sinceDate`.
  - Actualizar `services/allyRegistration.service.ts` si hace falta para leer `ally-sites.json` sin romper el registro nuevo de aliados.
  - Actualizar componente `AllyBacklinksDashboard.tsx` para mostrar 20 aliados nuevos por defecto (sin conexión backend, lectura de JSON en useEffect + try/catch).
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-10.1: `public/data/ally-sites.json` parsea OK y allies.length >= 50.
  - `rule` TR-10.2: `AllyBacklinksDashboard` carga >= 20 aliados desde JSON sin throw.
  - `rubric` TR-10.3: Calidad seed aliados; scale 1-5; anchors 1 = 5 aliados placeholders; 3 = 25 reales; 5 = 50+ entries de dominios colombianos/turísticos + pautantes reales con website, anchorText por cluster (hotel, restaurante, experiencia); threshold >= 4; evidence = lectura JSON.

## Task 11: Escribir plan-linkbuilding-salentoalamano-2026.md (checklist accionable)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 10
- **Description**:
  - Secciones: (1) Objetivo (dominar #1 300 URLs, 1k KW); (2) Cluster semántico y anchor text (12 clusters: Hoteles, Restaurantes, Cafés, Artesanías, Tiendas, Experiencias, Servicios, Valle Cocora, Calle Real, Estado Actual, Clima, FAQs); cada cluster con >= 8 variantes anchor text (exact match, parcial, marca, genérica, pregunta, sinónimos, contexto ciudad, contexto país); (3) Directorios locales Colombia (>= 40: cámaras turismo, cámaras comerciales Armenia/Quindío, ayuntamiento Salento, guías oficiales Colombia Travel, Turismo Colombia, municipios Quindío, Booking/TripAdvisor/Google Maps, directorios amarillos Colombia, Hoteles.com, Expedia, Despegar, etc.); (4) 20+ aliados pautantes + prensa + revistas viajes colombianas; (5) Calendario 8 semanas: semana 1 = 5 directorios + 3 aliados; semana 2 = 5 + 4; semana 3 = 5 + 4; semana 4 = 5 + 4; semana 5 = 6 + 5; semana 6 = 6 + 5; semana 7 = 6 + 5; semana 8 = 6 + 5; total 44 + 35 = 79 enlaces graduales; (6) Checklist GSC: 300 URLs inspección URL "pedir indexación" + Bing Webmaster submit URLs + Baidu Ziyuan + Yandex Webmaster; (7) Riesgos: no comprar enlaces, no anchor text sobre-optimizado >= 20% exact match, variar naturalmente, dominios .co / .com.co prioritarios.
  - Guardar en `c:\Users\user\Documents\mapa-salento-2026\salento-mapa-turistico\plan-linkbuilding-salentoalamano-2026.md` (nivel raíz).
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-11.1: Archivo existe, markdown válido, >= 6 secciones, >= 40 directorios listados con nombre + URL.
  - `rubric` TR-11.2: Accionabilidad del plan; scale 1-5; anchors 1 = 1 página lista; 3 = lista genérica; 5 = clusters + calendario 8 semanas + checklist GSC/motores por cada URL + métricas riesgo anchor 20% max exact match; threshold >= 4; evidence = lectura MD.

## Task 12: Regenerar sitemap.xml ≥ 300 URLs + defensive-sitemap sincronizado + hreflang
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6, Task 7, Task 8
- **Description**:
  - Escribir `tools/regenerate_sitemap.js` que recorra `public/**/*.html` excluyendo SPA root para no duplicar, ordene por prioridad (home 1.0, estado 1.0, FAQs 0.9, guías top 0.9, categorías 0.85, landings pautantes 0.8, fichas pautantes 0.7, resto 0.6).
  - Añadir `<xhtml:link hreflang>` a home, FAQs hub y top 5 guías (Valle Cocora, 3 días, cómo llegar, clima, café tours) — 14 locales + x-default.
  - `lastmod` = fechas 2026-09-03, 2026-09-04, 2026-09-05 distribuidas por grupo para frescura futura.
  - Escribir ambos archivos: `public/sitemap.xml` y `public/salentoalamano-defensive-sitemap.xml` (mismo contenido byte-identico o al menos estructura 1:1 same locs).
  - Actualizar `public/robots.txt`: `Sitemap: https://salentoalamano.com/sitemap.xml` (ya está) y comentar que defensive-sitemap es copia backup.
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-12.1: grep `<loc>` count >= 300 en sitemap.xml.
  - `rule` TR-12.2: sitemap.xml y defensive-sitemap tienen mismo count `<loc>` y mismo lastmod set (validar diff).
  - `rule` TR-12.3: Home + FAQs hub + 5 guías top contienen 15 xhtml:link entries (14 hreflang + x-default).

## Task 13: Build + Type-Check + Validación final + npm run seo:generate
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1-12 (bloqueado por todos anteriores)
- **Description**:
  - Ejecutar `npm run build`, `npm run type-check`, `npm run seo:generate` en secuencia.
  - Verificar 0 warnings no deseados, 0 errores.
  - Asegurarse que no se rompan los service workers ni el manifest (nada de cambios en sw.js ni manifest).
  - Regenerar una última vez sitemap por si alguna página nueva apareció.
- **Acceptance Criteria Addressed**: AC-10, AC-1, AC-2, AC-3, AC-4, AC-8
- **Test Requirements**:
  - `rule` TR-13.1: `npm run build` exit 0; `npm run type-check` exit 0; `npm run seo:generate` exit 0.
  - `rule` TR-13.2: Bundle gzip <= 160 KB (antes era ~129 KB, margen +30 KB por AC-11 nuevos imports que no debe haber).
  - `rule` TR-13.3: 0 `@import url(` bloqueante en styles.css y grep de 3 link fonts en cada HTML head.

## Task 14: Smoke test manual checklist evidencia (ejecutar validaciones finales AC)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 13
- **Description**:
  - Ejecutar greps de cada AC y anotar resultados en la sección Completion Evidence de cada Task.
  - Confirmar: places ≥ 100, mapMarkers ≥ 100, hotels ≥ 30, guías ES ≥ 33, FAQs ES ≥ 100, locales 14, sitemap ≥ 300, hreflang biyectivos, landings pautantes con ReserveAction + ContactPoint + Speakable + BreadcrumbList + AggregateRating, 20 HowTo schemas en guías, internal links sitewide en TODO HTML.
  - Correr 10 comandos curl o file read para validar que los HTML renderizan sin JS.
- **Acceptance Criteria Addressed**: TODO 11 ACs
- **Test Requirements**:
  - `rule` TR-14.1: Cada AC rule del spec tiene al menos 1 evidencia de pass concreta (grep count, path archivo, CLI output).
  - `rule` TR-14.2: Cada AC rubric del spec tiene score >= threshold (>=4) con rationale.
  - `rubric` TR-14.3: Exhaustividad evidencia; scale 1-5; anchors 1 = 2 capturas; 3 = evidencia parcial; 5 = para cada AC screenshots counts + 10 HTML samples; threshold >= 4; evidence = archivos de comandos ejecutados.
