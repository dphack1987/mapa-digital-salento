# 🎯 PLAN MAESTRO WSA — Selección Global 15/11/2026

**Actualizado:** 09/11/2026
**Hito duro:** Selección global WSA — **viernes 15/11/2026**
**Regla:** este archivo es la fuente de verdad de fechas. Los demás MD son referencia histórica/técnica.

---

## ✅ Estado al 09/11/2026

### Hecho
- [x] Nominación oficial verificada (correo `awards@wsa-global.org` 31/10, Yezid Donoso)
- [x] Sitio en producción: GitHub Pages (`https://dphack1987.github.io/mapa-digital-salento/`), deploy automático en push a `master` (último deploy 06/11)
- [x] GA4 `G-1Z70BRW660` + GTM `GTM-WP8WJ7C3` recolectando desde 06/11
- [x] Visitas del jurado internacional confirmadas (09/11)
- [x] Sección WSA presente en el HTML estático (prerender) — corregido 09/11
- [x] Evento GA4 `wsa_nomination_view` — implementado 09/11 (evidencia de que el jurado ve la sección)
- [x] SEO/Schema/OG/idiomas (ver `RESUMEN_EJECUTIVO_WSA.md`)
- [x] 27 pautas activas + 102 páginas pautantes
- [x] Blindaje fase 0 completado (commit `43f6041`): ErrorBoundary global + vitest 16 tests + type-check/build ✅

### ⛔ Pendiente antes del 15/11
- [ ] **Deck de presentación** 15-20 slides (ES + EN) — Mié 11
- [ ] **Documento de impacto** con métricas GA4 de la semana — Mié 11
- [ ] **Aplicación WSA** completada (formulario, enlace por Yezid Donoso) — Jue 12
- [ ] **Landing para jurado** (hub con métricas y documentos) — Vie 13
- [ ] **Exportar métricas GA4** a `docs/wsa/analytics/` (carpeta aún no creada) — Vie 13
- [ ] Revisión final de materiales y confirmación de envío — Sáb 14 / Dom 15

> **Decisión estratégica (post-análisis, 09/11):** sin video demo ni fotos. La experiencia online (PWA offline-first + SEO multi-idioma + multi-dispositivo) es la propia demo. Si la aplicación WSA exige video, se sustituye por demo ligera del sitio.

---

## 📅 Cronograma 09 → 15 de noviembre

| Día | Tarea | Entregable |
|-----|-------|------------|
| **Lun 09** | Guion + grabación video; iniciar deck | Guion aprobado |
| **Mar 10** | Edición video + subtítulos EN; deck ES | Video draft + deck ES |
| **Mié 11** | Deck EN; documento de impacto con GA4 (exportar datos) | Deck ES+EN + impacto |
| **Jue 12** | Aplicación WSA completa (respuestas estratégicas + adjuntos) | Aplicación enviada |
| **Vie 13** | Landing para jurado; export GA4 final; checklist de materiales | Landing live + datos |
| **Sáb 14** | Revisión cruzada (todo el material contra los criterios WSA) | Checklist final ✅ |
| **Dom 15** | **SELECCIÓN GLOBAL** — confirmar recepción con Yezid Donoso | Confirmación |

**Referencia de contenido:** guiones de video/deck/aplicación en `DIAGNOSTICO_WSA_GLOBAL.md` (Gaps #4, #5, #6), tips en `PLAN_ACCION_WSA_4_SEMANAS.md`, criterios en `ANALISIS_WSA_NOMINACION.md`.

---

## 📊 Métricas GA4 a llevar al jurado

Exportar (GA4 → `docs/wsa/analytics/`):

- **`wsa_nomination_view`** — visitantes que vieron la sección de nominación (nuevo 09/11)
- `page_view` — total, sesiones, tiempo promedio, países/distribución geográfica
- `place_view`, `whatsapp_click`, `don_chucho_query`, `language_change`
- `search`, `category_filter` — engagement con el directorio
- Comparación semana 06-13/11 vs días previos (solo hay datos desde 06/11)

Cómo exportar: `GA4_SETUP.md` (sección "Métricas clave para WSA").

---

## 📚 Mapa de los demás MD

| Archivo | Para qué sirve | Estado |
|---|---|---|
| `DIAGNOSTICO_WSA_GLOBAL.md` | Gaps vs ganadores globales, guiones de materiales | ✅ Actualizado 09/11 |
| `RESUMEN_EJECUTIVO_WSA.md` | Mejoras técnicas ya hechas (GA4/SEO/perf) | Vigente (desactualizado en pendientes) |
| `ANALISIS_WSA_NOMINACION.md` | Criterios de evaluación y narrativa | Vigente |
| `ANALISIS_UX_JURADO_WSA.md` | 5 mejoras UX propuestas (26 h) | Propuestas — evaluar post-15/11 |
| `GA4_SETUP.md` | Configuración y exportación de GA4 | Vigente |
| `VERIFICACION_COMPLETA_Y_PENDIENTES.md` | Checklist técnico histórico | Parcial (deploy ya hecho) |
| `PLAN_ACCION_WSA_4_SEMANAS.md` | Tips, URLs, contacto Yezid Donoso | ⚠️ **Fechas obsoletas** (ponía aplicación ~25/11, posterior al hito) |
