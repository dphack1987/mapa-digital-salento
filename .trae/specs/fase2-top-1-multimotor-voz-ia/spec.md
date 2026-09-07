# Fase 2: Campaña TOP 1 Multimotor + Voz + IA (Salento, Quindío) - Product Requirements Document

## Overview
- **Summary**: Conjunto de 10 iniciativas de SEO técnico + programático + de datos + de autoridad para posicionar `salentoalamano.com` como resultado **#1** en Google, Bing, Baidu y Yandex para TODA la intención de búsqueda relacionada con Salento, Quindío (head, torso, long-tail, semántica, geolocal, FAQs, comparativas, fechas/clima, guías N días). Paralelamente, activar señales de **IA generativa (SGE / ChatGPT Search / Perplexity)** y **búsqueda POR VOZ** (Asistente Google, Siri, Alexa, Bixby) mediante Speakable, FAQPage/QAPage, HowTo, respuestas de 1-2 oraciones, Action/Reservation y ContactPoint. Cerrar con un plan accionable de linkbuilding local + aliados que el usuario ejecutará manualmente.
- **Purpose**: Salento a la Mano debe ser la fuente de verdad "por defecto" para cualquier motor, asistente o modelo de IA cuando busque "Salento", "Valle de Cocora", "qué hacer en Salento", "hoteles Salento", "restaurantes Salento", "café Salento" y toda variante semántica/geolocal/transaccional — en español, inglés, alemán, francés y hasta 14 locales internacionales (PT, IT, ZH, JA, KO, TH, VI, ID, MS, DE, FR, EN, ES base + x-default).
- **Target Users**: Crawlers Googlebot/Bingbot/Baiduspider/Yandexbot; asistentes de voz y modelos LLM/IA (SGE, ChatGPT Search, Perplexity); turistas locales (CO) e internacionales (US/GB/DE/FR/PT/IT/ZH/JA/KO/TH/VI/ID/MS); propietarios de negocios pautantes; aliados backlinks; equipo mantenedor del repo.

## Goals
1. Dominar **posición #1 orgánica** en Google para el top 50 de mayor volumen KW "Salento Quindío" (head + torso transaccional/informativa).
2. Ampliar hub programático de guías de 3 a **30+ guías locales**, hub de FAQs con **100+ preguntas respondidas en formato FAQPage/QAPage/HowTo + Speakable** y **14 locales internacionales** (actualmente 4).
3. Ampliar el catalogo places.json de 22 a **100+ lugares** con campos semánticos enriquecidos y regenerar todas las landings/páginas-ficha/colecciones — objetivo **300+ URLs indexables** en sitemap.xml (actualmente 78).
4. Convertirse en **respuesta de voz / SGE / IA generativa** mediante schemas de "respuesta corta": Speakable, FAQPage, HowTo, QAPage, Action (ReserveAction/OrderAction/ViewAction), ContactPoint telefónico + WhatsApp + horarios.
5. Activar plan de **autoridad**: defensivo (Internal Links, Silos, Breadcrumbs) + externo accionable (directorios locales, cámaras turismo, aliados backlinks, prensa, municipios).
6. Mantener 0 errores en `npm run build` / `npm run type-check` y core web vitals LCP < 2.5s, CLS < 0.10, INP < 200ms.

## Non-Goals
- No conectar APIs externas reales (no booking.com, no pasarelas pago, no CRM real).
- No refactorizar App.tsx en submódulos (Fase 3).
- No borrar código existente — solo añadir, enriquecer, extender.
- No cambiar URLs canónicas ya indexadas (no 301s sin aprobación).
- No tocar `places.json` / `hotels.json` / `products.json` manualmente en esta Fase 2 (sí **extender** y **añadir N entradas** nuevas).
- No crear backlinks por medio automatizados ("grey hat"). El plan linkbuilding externo se entrega como checklist; ejecución es manual por el usuario.

## Background & Context
**Estado actual (02/09/2026, post Fase1):**
- `places.json`: 22 lugares (5 Alojamientos, 4 Restaurantes, 1 Café, 1 Artesanía, 1 Tienda, 3 Servicios, 7 Experiencias) — cobertura insuficiente para 1k+ KW.
- `hotels.json`: 5 hoteles (4 partners, 1 placeholder).
- `mapMarkers.json`: Mapa base 22 puntos (pendiente ampliar).
- Páginas HTML: 69 archivos (8 categorías + 22 pautantes + 22 paginas-pautantes + 16 SEO internacional (4 idiomas × 3 guías + 4 index) + home SPA + 5 landings temáticas React).
- `sitemap.xml`: 78 URLs, lastmod 2026-09-01/02, hreflang en home.
- Fase1 cerrada 100%: rewrites, sitemap, robots, google fonts link, iconMap, tipos extendidos, schemas AC-7 ya inyectados en renderCategoryPage y renderProviderLandingPage.
- Build: pasa 0 errores; type-check pasa 0 errores; Bundle size ≈ 129 KB gzip app + 89 KB leaflet.
- Activos usuario confirmados: **GSC activo y con datos, Bing/Baidu/Yandex verificados, Google Business Profile creado, perfiles sociales/listados listos**.

**Usuario no confirmó pero asumimos (recomendación adoptada, revertible en aprobación spec):**
- Alcance KW: **Dominio total (1k+ KW hub semántico completo)**.
- Trabajo: **híbrido** (técnico repo = nosotros; GSC/motores + contenido humano long-form + backlinks externos = usuario).
- SEO internacional: 14 locales (ES-CO, EN-US, EN-GB, DE-DE, FR-FR, PT-BR, IT-IT, ZH-CN, JA-JP, KO-KR, TH-TH, VI-VN, ID-ID, MS-MY + x-default).

## Functional Requirements
- **FR-1**: Ampliar `places.json` de 22 a 100+ lugares distribuidos equitativamente por las 7 categorías (Alojamientos, Restaurantes, Cafés, Artesanías, Tiendas, Experiencias, Servicios), cada uno con: `type`, `contact` (phone/whatsapp/email/website/instagram/facebook), `location` (lat/lng/address/landmark), `operatingHours`, `photos[]`, `tags[]` (>=10 tags por lugar, long tail + geolocal), `verified=true`, `active=true`, y los 7 details types (`accommodationDetails` / `foodServiceDetails` / `experienceDetails` / `commerceDetails` / `transportDetails` / `horsebackRidingDetails` / `tourismDetails`) enriquecidos donde aplique.
- **FR-2**: Extender `mapMarkers.json` a 100+ marcadores biyectivos con cada place (`placeId` presente), manteniendo taxonomías de tipo y tone.
- **FR-3**: Ampliar `hotels.json` de 5 a 30+ hoteles/fincas/fonda/hostales con `isPartner` opcional, campos de dirección, teléfono, url canónica a landing pautante cuando exista.
- **FR-4**: Hub de guías locales programáticas: 30+ guías nuevas (no solo las 3 actuales) con: `1 día Salento`, `2 días Salento`, `3 días Salento`, `5 días Salento`, `fin de semana`, `con niños`, `económico`, `lujo`, `cafetero`, `aventura`, `boda/luna miel`, `accesible`, `solo presupuesto`, `senderismo`, `cascadas`, `miradores`, `café 10 tours avanzado`, `Cómo llegar a Salento desde Bogotá/Medellín/Cali/Cartagena/Armenia`, `Mejor época para visitar Salento`, `Clima Salento mes por mes 2026`, `Qué llevar Salento`, `Mochila básica Valle Cocora`, `Circuito pueblos cafeteros Salento Filandia Circasia Montenegro Armenia`, `Dónde comer barato Salento`, `Dónde tomar café Salento`, `Souvenirs y artesanías Salento`. Cada guía HTML estática con `<h1>`, H2/H3 semánticos, contenido long-form estructurado, FAQ sección, HowTo cuando aplique, speakable, breadcrumbs, canónica, hreflang por idioma.
- **FR-5**: Hub de FAQs programático + página `preguntas-frecuentes-salento-quindio-2026.html` con **100 preguntas y respuestas** agrupadas por categoría (General, Alojamiento, Transporte, Clima, Gastronomía, Experiencias, Presupuesto, Accesibilidad, Voz) — cada una con respuesta de 1-2 oraciones, JSON-LD `FAQPage`, QAPage adicional, y Speakable CSS selector sobre la respuesta.
- **FR-6**: SEO internacional ampliado a **14 locales**: 10 nuevos (PT-BR, IT-IT, ZH-CN, JA-JP, KO-KR, TH-TH, VI-VN, ID-ID, MS-MY, ES-CO base, EN-US, EN-GB, DE-DE, FR-FR) × (4 index locales + 30 guías + 1 hub FAQs + landings temáticas si aplican) + cada `<link alternate hreflang>` correcto + x-default.
- **FR-7**: Schemas avanzados para voz/IA en **cada guía, landing pautante, categoría y hub FAQs**:
  - Speakable schema con CSS paths a `section.hero h1`, `.lead`, `.faq-answer`, `.howto-step p`.
  - HowTo schema en guías tipo "paso a paso" (cómo llegar, mochila, itinerario N días).
  - FAQPage / QAPage en guías (sección mini-FAQ) y hub FAQs principal.
  - Action schema (ReserveAction, OrderAction, ViewAction) + ContactPoint (telephone, WhatsApp URL, email, availableLanguage, hoursAvailable) en TODO landing pautante y ficha pautante.
  - AggregateRating schema con ratingValue=4.8 basado en reviews.length + reviewCount si existen.
- **FR-8**: Defensa y amplificación de autoridad on-site: silos por categoría, **internal links contextuales** entre guías ↔ categorías ↔ landings pautantes ↔ FAQs; `nav.sitewide-links` en el footer estático de todos los HTML (excepto SPA) enlazando: Home, Estado Actual, Seguro, Vías, Valle Cocora, Hoteles, FAQs, Categorías, Internacional, Contacto. `BreadcrumbList schema` en TODO HTML generado.
- **FR-9**: Entregar como artefacto **`plan-linkbuilding-salentoalamano-2026.md`** (solo checklist, no ejecución) con: (a) 40+ directorios locales Colombia/cámaras turismo/ayuntamientos/municipios/SEO local; (b) 20+ sitios de aliados candidatos basados en los pautantes + guías turísticas colombianas/revistas; (c) plantillas anchor text por cluster semántico (hotel, restaurante, experiencia, información general); (d) plan gradual 8 semanas con volúmenes semanales; (e) checklist GSC/Bing/Baidu/Yandex de inspección manual por cada URL nueva que debas "forzar" a indexar.
- **FR-10**: Sitemap defensivo `sitemap.xml` con **300+ URLs** al final de campaña, cada grupo de URLs con lastmod 2026-09-X futuro, prioridad 0.6–1.0, `xhtml:link hreflang` en home, FAQs, guías top y landings temáticas principales. Regenerar `public/salentoalamano-defensive-sitemap.xml` con copia defensiva.

## Non-Functional Requirements
- **NFR-1**: `npm run build` y `npm run type-check` pasan sin errores en todo momento.
- **NFR-2**: Tamaño bundle gzip <= 160 KB JS app (no aumentar > +30 KB respecto a 129 KB actual); hojas de estilo estáticas HTML deben seguir cargando Google Fonts con `preconnect/stylesheet` y nunca `@import` bloqueante.
- **NFR-3**: Core Web Vitals meta. En todo HTML generado se incluyen hints: `<link rel="preconnect" crossorigin>` a Google Fonts; imágenes con loading="lazy" y width/height atributos para evitar CLS; `<link rel="sitemap">` y canonical; `robots meta=index,follow`.
- **NFR-4**: Páginas HTML generadas son 100% estáticas y renderizan contenido sin JS runtime requerido (SSR-friendly / IA-friendly — crawlers y modelos leen HTML plano sin hidratar).
- **NFR-5**: URLs antiguas existentes no cambian de path (ningún rename/301 sin aprobación explícita), salvo limpieza de `.html` por cleanUrls de Vercel.
- **NFR-6**: Campos añadidos en types.ts son todos `?` opcionales para no romper datasets actuales. casts `any` existentes en App.tsx pueden reducirse pero no se requiere 0 any en esta fase.

## Constraints
- **Technical**: Stack React 18 + Vite + TS + Leaflet + Lucide + react-helmet-async + service worker + IndexedDB offline. Sin nuevas librerías: TODO lo necesario existe en el repo o se implementa con JS/TS vanilla. No tocar servicios a nivel módulo (todo en `useEffect` con `try/catch`). Vercel v2 con `rewrites` y `outputDirectory = dist`.
- **Business**: Salentoalamano.com es el dominio único. Contenido nuevo debe alinearse con promesa de marca: "contacto directo con locales, sin intermediarios". No se incluyen precios de terceros ni comisiones.
- **Dependencies**: Ninguna dependencia nueva. Reutilizar `tools/generate_international_seo_pages.js`, `tools/generate_category_pages.js`; extenderlos o crear `tools/generate_guides_faqs_100_14locales.js` si es necesario.

## Assumptions
- **A-1 (KW Alcance)**: El usuario confirmó "recomendación" → asumimos **Dominio total (1k+ KW, clo semantic hub completo 300+ URLs)**.
- **A-2 (Trabajo manual usuario)**: Usuario asumirá ejecución GSC/Bing/Baidu/Yandex inspección manual + contenido humano long-form (reemplazo placeholders de texto en guías y FAQs cuando lo decida) + linkbuilding externo del plan.
- **A-3 (Relleno inicial guías)**: Antes de tener textos humanos oficiales, las guías se publican con contenido estructurado placeholder legal/correcto (ej: "Itinerario 3 días Salento: Día 1 - centro y Calle Real; Día 2 - Valle Cocora; Día 3 - finca cafetera + cascadas") — marcado con `<!-- TODO: contenido long-form humano -->` para reemplazo posterior.
- **A-4 (Datos places.json nuevos)**: Los 78 lugares nuevos (22 → 100) se generan basados en la lista de pautantes de `/pautantes/*.html`, negocios del Quindío verificables públicamente y categorías faltantes (ej: 15 Restaurantes, 10 Cafés, 10 Alojamientos adicionales, 8 Artesanías, 10 Tiendas, 15 Servicios, 15 Experiencias nuevas). Nombres y direcciones no inventados se basan en `pautas/*.md` + listados públicos conocidos.
- **A-5 (Traducciones SEO internacional)**: Los 10 locales nuevos se generan con plantilla adaptada y `inLanguage` correcto; textos cortos se traducen con placeholders bilingües hasta que el usuario sustituya con traducción certificada.
- **A-6 (Links aliados)**: AllyBacklinksDashboard existente en el repo se conecta al nuevo plan y usa aliados registrados.

## Acceptance Criteria

### AC-1: places.json ≥ 100 lugares biyectivos con mapMarkers + hotels ≥ 30
- **Type**: `rule`
- **Given**: `public/data/places.json`, `public/data/mapMarkers.json`, `public/data/hotels.json` existen y parsean.
- **When**: Se cuentan `places.length`, `mapMarkers.length`, `hotels.length`.
- **Then**: places ≥ 100, mapMarkers ≥ 100 y cada `mapMarkers[i].placeId` referencia un `places[i].id` existente; hotels ≥ 30.
- **Pass Condition**: Conteo JSON via `jq` o grep `\"id\":` ≥ 100 (places), ≥ 100 (mapMarkers), ≥ 30 (hotels) — sin placeholders `[por confirmar]` por defecto.
- **Evidence**: Grep counts + `npm run build` exit 0.

### AC-2: Hub guías locales ≥ 30 URLs (es base) + 14 locales → ≥ 420 guías
- **Type**: `rule`
- **Given**: Carpetas `public/*/guias/` para cada uno de 14 locales.
- **When**: Se listan todos los `.html` en `public/<locale>/guias/`.
- **Then**: ES-base ≥ 33 guías (3 actuales + 30 nuevas); cada uno de los otros 13 locales ≥ 33 guías → total guías ≥ 14×33 = 462.
- **Pass Condition**: Glob `public/*/guias/*.html` count ≥ 462; cada uno contiene `<h1>`, canonical, hreflang alternates a los 14 idiomas y x-default.
- **Evidence**: Glob count + grep canonical y hreflang en un sample.

### AC-3: Hub FAQs 100+ preguntas con FAQPage + QAPage + Speakable
- **Type**: `rule`
- **Given**: Existe `public/es/preguntas-frecuentes-salento-quindio-2026.html` y sus 13 variantes de idioma.
- **When**: Se valida JSON-LD de FAQPage.
- **Then**: ES-base contiene ≥ 100 entries en `mainEntity` de FAQPage (acceptedAnswer text); cada pregunta+respuesta está repetida como QAPage con `answerCount: 1`; Speakable schema apunta a CSS selectores `.faq-q`, `.faq-a`, `.hero h1`, `.lead`.
- **Pass Condition**: Grep `"mainEntity"` → count ≥ 100; Grep `\"@type\":\"FAQPage\"` y `\"@type\":\"QAPage\"` ambos > 0; Grep Speakable ≥ 1.
- **Evidence**: Grep counts + sample lectura de head HTML.

### AC-4: SEO internacional 14 locales con index + guías + FAQs + hreflang correctos
- **Type**: `rule`
- **Given**: Carpetas `public/es|en|de|fr|pt|it|zh|ja|ko|th|vi|id|ms|en-gb` con `index.html` + `guias/*.html` + `preguntas-frecuentes...html`.
- **When**: Se lee el bloque hreflang de cualquier guía principal.
- **Then**: 15 alternates (14 locales + x-default) con URLs absolutas canónicas correctas; inLanguage del `<html lang>` coincide; canonical no se cruza.
- **Pass Condition**: Cada index y FAQ contiene ≥ 15 `<link rel="alternate" hreflang>` y 1 canonical.
- **Evidence**: Grep count de hreflang por archivo.

### AC-5: Landing pautantes y fichas pautantes con Action + ContactPoint + Speakable
- **Type**: `rule`
- **Given**: 22 `public/pautantes/*.html` y 22 `public/paginas-pautantes/<slug>/index.html` (al final ≥ 100 places → ≥ 100 landing pairs).
- **When**: Se valida un sample aleatorio de 5 landings.
- **Then**: Cada `<head>` contiene al menos: (a) BreadcrumbList, (b) schema específico (Hotel/Restaurant/CafeOrCoffeeShop/Store/LocalBusiness/TouristAttraction), (c) Action schema con `@type`: `ReserveAction` target a WhatsApp, (d) ContactPoint con telephone, whatsapp URL opcional, email, availableLanguage, hoursAvailable, (e) Speakable a `h1` + `.lead`.
- **Pass Condition**: Grep `\"@type\":\"ReserveAction\"`, `\"@type\":\"ContactPoint\"`, `\"@type\":\"SpeakableSpecification\"` → todo > 0 por landing.
- **Evidence**: Grep sample + 0 errores build.

### AC-6: Categorías y guías HowTo + Speakable en itinerarios paso a paso
- **Type**: `rule`
- **Given**: 8 categorías HTML + 30+ guías HTML.
- **When**: Se revisan categorías y 5 guías tipo "itinerario".
- **Then**: Categorías → Breadcrumb + CollectionPage + ItemList; guías tipo itinerario o procedimiento → HowTo schema con ≥ 3 steps, Speakable apuntando a `howto-step-description`; cada guía tiene mini-FAQ (5+) con FAQPage.
- **Pass Condition**: Grep HowTo count ≥ 20 (cobertura 2/3 de guías); mini-FAQ count ≥ 5 por guía; Speakable ≥ 1.
- **Evidence**: Grep counts por tipo.

### AC-7: Internal links silo + sitewide footer + breadcrumbs en TODO HTML generado
- **Type**: `rule`
- **Given**: Todo HTML estático (categorias, pautantes, paginas-pautantes, guías, FAQs, internacionales).
- **When**: Se abre un HTML de cada tipo y se inspecciona `<footer>`.
- **Then**: (a) `<nav class="sitewide-links">` con ≥ 10 enlaces internos (home, estado, seguro, vías, valle cocora, hoteles, FAQs, categorías, internacional, contacto); (b) breadcrumbs HTML visibles + schema BreadcrumbList en head; (c) cada guía enlaza en sección "También te puede interesar" a al menos 3 landings pautantes relacionados y 2 categorías.
- **Pass Condition**: Grep `sitewide-links` ≥ 1 por archivo HTML fuera SPA; grep BreadcrumbList ≥ 1 por archivo; "te-interesa" links ≥ 3 por guía.
- **Evidence**: Grep por clase y schema.

### AC-8: sitemap.xml ≥ 300 URLs + defensive-sitemap sincronizado + hreflang
- **Type**: `rule`
- **Given**: `public/sitemap.xml` y `public/salentoalamano-defensive-sitemap.xml`.
- **When**: Se cuenta `<loc>`.
- **Then**: sitemap.xml ≥ 300 `<loc>` válidas; defensive-sitemap copia identica; home, FAQs top y guías top contienen `<xhtml:link hreflang>` a 14 locales + x-default; `lastmod` con fechas 2026-09-03 en adelante.
- **Pass Condition**: grep `<loc>` count ≥ 300; diff sitemap.xml vs defensive-sitemap sin diferencias estructurales.
- **Evidence**: Grep + diff.

### AC-9: Checklist plan linkbuilding entregado y Ally dashboard conectado
- **Type**: `rubric`
- **Dimension**: Profundidad y accionabilidad del plan linkbuilding + cobertura de clusters
- **Scale**: 1-5
- **Anchors**: 1 = lista vacía; 3 = ≥ 20 sitios en 2 clusters; 5 = 40+ directorios locales + 20+ aliados pautantes + 20 anchor text variantes por cluster semántico + calendario 8 semanas + checklist GSC/motores por URL.
- **Pass Threshold**: ≥ 4
- **Evidence**: Lectura del nuevo `plan-linkbuilding-salentoalamano-2026.md`. Dashboard AllyBacklinksDashboard al menos muestra enlaces aliados de places.json que tienen website.

### AC-10: Build + Type-Check 0 errores + CWV hints meta en cada HTML
- **Type**: `rule`
- **Given**: Repo en estado final.
- **When**: `npm run build && npm run type-check`.
- **Then**: Ambos exit 0; cada HTML estático contiene: `<meta name="viewport">`, `<meta name="description">`, canonical, robots=index/follow, `<link rel="preconnect" crossorigin href="https://fonts.gstatic.com">` y `<link rel="stylesheet">` fonts con display=swap, 0 `@import url(` bloqueantes.
- **Pass Condition**: exit codes 0 + grep 0 `@import` en styles.css y grep 3 link fonts por HTML head.
- **Evidence**: CLI output + grep.

### AC-11: Señales IA/SGE listas (cobertura semántica global 0-5)
- **Type**: `rubric`
- **Dimension**: Capacidad de ser citado/respuesta por modelos LLM y SGE.
- **Scale**: 1-5
- **Anchors**: 1 = sin schemas ni estructura; 3 = algunos FAQ y JSON-LD básico; 5 = Speakable en home/FAQs/guías/hero landings, FAQPage ≥ 100 preguntas, HowTo ≥ 20 guías, Action + ContactPoint en todo pautante, hreflang 14 idiomas, 300+ URLs internas con contenido HTML plano estático sin JS requerido.
- **Pass Threshold**: ≥ 4
- **Evidence**: Grep Speakable, FAQPage, HowTo, ReserveAction, ContactPoint, QAPage; validación de 10 archivos random renderizados sin JS (curl HTML).

## Open Questions (sujetos a aprobación spec)
- [ ] A-1 Confirmar: ¿Dominio total 300+ URLs / 1k+ KW correcto, o prefieres un alcance menor primero?
- [ ] A-2 Confirmar: ¿Contamos con listado real de ~78 negocios nuevos a añadir al places.json? Si no, yo los generaré basados en `pautas/*.md` + listados conocidos públicos con nombres verificables (sin inventar).
- [ ] A-3 Confirmar: ¿Traducciones 14 idiomas las aceptamos inicialmente como placeholders bilingües? Podrás reemplazarlas luego con traducción profesional.
- [ ] A-4 Confirmar: ¿Plan linkbuilding externo se entrega solo como checklist en `.md` (no ejecutamos links automatizados) OK?
