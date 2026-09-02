import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const domain = 'https://salentoalamano.com'

const locales = {
  es: {
    language: 'es-CO', title: 'Salento a la Mano | Guía turística de Salento, Quindío',
    description: 'Guía local de Salento, Quindío: alojamientos, restaurantes, cafés, experiencias y servicios con contacto directo.',
    intro: 'Encuentra alojamientos, sabores, experiencias y servicios locales en Salento, Quindío.',
    cta: 'Explorar el mapa',
  },
  en: {
    language: 'en', title: 'Salento, Colombia Travel Guide | Salento a la Mano',
    description: 'A practical local guide to Salento, Colombia with accommodation, food, coffee tours and direct contact with local businesses.',
    intro: 'Find places to stay, eat, explore and connect with local businesses in Salento, Colombia.',
    cta: 'Explore the map',
  },
  de: {
    language: 'de', title: 'Salento Kolumbien Reiseführer | Salento a la Mano',
    description: 'Lokaler Reiseführer für Salento in Kolumbien mit Unterkünften, Gastronomie, Kaffeetouren und direktem Kontakt.',
    intro: 'Entdecke Unterkünfte, regionale Küche, Naturerlebnisse und lokale Anbieter in Salento.',
    cta: 'Karte öffnen',
  },
  fr: {
    language: 'fr', title: 'Guide de voyage Salento Colombie | Salento a la Mano',
    description: 'Guide local de Salento en Colombie : hébergements, restaurants, café, expériences et contact direct.',
    intro: 'Trouvez où dormir, manger et découvrir Salento avec des informations locales et un contact direct.',
    cta: 'Ouvrir la carte',
  },
}

const guides = [
  {
    slug: 'guia-valle-del-cocora',
    esTitle: 'Guía para visitar el Valle del Cocora',
    enTitle: 'A Practical Guide to Visiting Cocora Valley',
    esIntro: 'Planifica una visita responsable al Valle del Cocora con información de acceso, transporte, clima y experiencias locales.',
    enIntro: 'Plan a responsible visit to Cocora Valley with practical information about access, transport, weather and local experiences.',
    sections: [
      ['Antes de salir', 'Consulta el clima, confirma horarios y lleva ropa cómoda, impermeable, agua y calzado apropiado.'],
      ['Cómo organizar el día', 'Define primero el transporte y el tiempo disponible. Contacta directamente al operador de la experiencia antes de reservar.'],
      ['Conexión local', 'Consulta las fichas de transporte, guías, restaurantes y alojamientos de Salento para organizar el recorrido.'],
    ],
  },
  {
    slug: '10-tours-cafe-salento',
    esTitle: 'Tours de café en Salento: cómo elegir',
    enTitle: 'Coffee Tours in Salento: How to Choose',
    esIntro: 'Una guía para comparar experiencias cafeteras, duración, punto de encuentro, servicios y contacto directo.',
    enIntro: 'A guide to comparing coffee experiences, duration, meeting points, services and direct contact.',
    sections: [
      ['Busca una experiencia clara', 'Revisa qué incluye el recorrido, cuánto dura y dónde comienza.'],
      ['Pregunta antes de reservar', 'Confirma disponibilidad, tarifa, idioma, transporte y condiciones de cancelación con el operador.'],
      ['Conoce el origen', 'Las fichas locales ayudan a descubrir fincas cafeteras y negocios que explican el proceso del café.'],
    ],
  },
  {
    slug: 'que-hacer-en-salento-3-dias',
    esTitle: 'Qué hacer en Salento: itinerario de 3 días',
    enTitle: 'What to Do in Salento: A 3-Day Itinerary',
    esIntro: 'Una base flexible para combinar pueblo, café, naturaleza, gastronomía y compras locales.',
    enIntro: 'A flexible plan combining the town, coffee, nature, food and local shopping.',
    sections: [
      ['Día 1: pueblo y gastronomía', 'Recorre el centro, consulta restaurantes y cafés, y reserva tiempo para conocer productos locales.'],
      ['Día 2: naturaleza', 'Organiza una salida al Valle del Cocora o una experiencia cercana según clima, tiempo y dificultad.'],
      ['Día 3: café y compras', 'Visita una finca cafetera, conoce artesanías y contacta directamente los negocios que quieras visitar.'],
    ],
  },
]

const keywords = {
  es: ['mejores fincas cafeteras con trato directo en Salento', 'hotel familiar cerca de la plaza de Salento', 'restaurantes con comida local en Salento Quindío', 'transporte al Valle de Cocora desde Salento', 'qué hacer en Salento en tres días'],
  en: ['best coffee farms with direct booking in Salento Colombia', 'family-friendly hotel near Salento main square', 'best local restaurants in Salento Quindio', 'how to get to Cocora Valley from Salento', 'things to do in Salento Colombia in 3 days'],
  de: ['beste Kaffeefincas mit direkter Buchung in Salento Kolumbien', 'familienfreundliches Hotel nahe dem Hauptplatz von Salento', 'regionale Restaurants in Salento Quindío Kolumbien', 'Anreise zum Cocora-Tal ab Salento Kolumbien', 'Salento Kolumbien in drei Tagen erleben'],
  fr: ['meilleures fincas de café avec réservation directe à Salento', 'hôtel familial près de la place principale de Salento', 'restaurants locaux à Salento Quindío Colombie', 'comment aller de Salento à la vallée de Cocora', 'que faire à Salento Colombie en trois jours'],
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function hreflang(pathname) {
  return Object.entries(locales).map(([locale, data]) => `<link rel="alternate" hreflang="${data.language}" href="${domain}/${locale}/${pathname}" />`).join('\n    ')
}

function shell(locale, pathname, title, description, content) {
  const data = locales[locale]
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${domain}/${locale}/${pathname}">${hreflang(pathname)}<link rel="alternate" hreflang="x-default" href="${domain}/es/${pathname}"><link rel="stylesheet" href="/page-theme.css"><style>main{max-width:1184px;margin:auto;padding:28px 20px 80px}.site-head{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:55px}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:700}.brand-logo{width:42px;height:42px}.locale-nav{display:flex;gap:8px;flex-wrap:wrap}.locale-nav a{padding:9px 11px;border:1px solid var(--line);border-radius:4px;font:11px 'DM Mono'}.hero{max-width:760px;border-left:3px solid var(--coral);padding-left:24px}.eyebrow{font:11px 'DM Mono';text-transform:uppercase;color:var(--coral);letter-spacing:.1em}.hero h1{font-size:clamp(2.5rem,6vw,5rem);line-height:.98;margin:14px 0}.hero p{color:#697568;line-height:1.7}.section{margin-top:55px;padding-top:28px;border-top:1px solid var(--line)}.section h2{font-size:2rem}.guide-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.guide-card{border:1px solid var(--line);padding:18px;background:#fff}.guide-card h3{margin-top:0}.guide-card p{color:#697568;line-height:1.55;font-size:13px}@media(max-width:700px){main{padding:20px 16px 55px}.site-head{align-items:flex-start;flex-direction:column;margin-bottom:35px}.guide-grid{grid-template-columns:1fr}.hero{padding-left:16px}}</style></head><body><main><header class="site-head"><a class="brand" href="/${locale}/"><img class="brand-logo" src="/logo_salento2026.png" alt="Salento a la Mano"><span>Salento a la Mano</span></a><nav class="locale-nav">${Object.keys(locales).map(item => `<a href="/${item}/${pathname}">${item.toUpperCase()}</a>`).join('')}</nav></header>${content}</main></body></html>`
}

for (const [locale, data] of Object.entries(locales)) {
  const dir = path.join(publicDir, locale)
  fs.mkdirSync(dir, { recursive: true })
  const guideCards = guides.map(guide => `<article class="guide-card"><h3>${escapeHtml(locale === 'es' ? guide.esTitle : guide.enTitle)}</h3><p>${escapeHtml(locale === 'es' ? guide.esIntro : guide.enIntro)}</p><a class="btn primary" href="/${locale}/guias/${guide.slug}.html">${data.cta}</a></article>`).join('')
  const keywordsList = keywords[locale].map(keyword => `<li>${escapeHtml(keyword)}</li>`).join('')
  const content = `<section class="hero"><span class="eyebrow">Salento, Quindío, Colombia</span><h1>${escapeHtml(data.title.split(' | ')[0])}</h1><p>${escapeHtml(data.intro)}</p><a class="btn primary" href="/">${data.cta}</a></section><section class="section"><h2>${locale === 'es' ? 'Guías para planificar tu visita' : 'Guides to plan your visit'}</h2><div class="guide-grid">${guideCards}</div></section><section class="section"><h2>${locale === 'es' ? 'Búsquedas útiles' : 'Useful searches'}</h2><ul>${keywordsList}</ul></section>`
  fs.writeFileSync(path.join(dir, 'index.html'), shell(locale, '', data.title, data.description, content), 'utf8')
  const guideDir = path.join(dir, 'guias')
  fs.mkdirSync(guideDir, { recursive: true })
  for (const guide of guides) {
    const guideTitle = locale === 'es' ? guide.esTitle : guide.enTitle
    const guideIntro = locale === 'es' ? guide.esIntro : guide.enIntro
    const sectionHtml = guide.sections.map(([heading, text]) => `<div class="section"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></div>`).join('')
    const guideContent = `<section class="hero"><span class="eyebrow">${locale === 'es' ? 'Guía local' : 'Local guide'}</span><h1>${escapeHtml(guideTitle)}</h1><p>${escapeHtml(guideIntro)}</p></section>${sectionHtml}<section class="section"><h2>${locale === 'es' ? 'Explora negocios locales' : 'Explore local businesses'}</h2><p>${locale === 'es' ? 'Consulta el directorio y contacta directamente a los establecimientos registrados.' : 'Browse the directory and contact registered businesses directly.'}</p><a class="btn primary" href="/categorias/index.html">${data.cta}</a></section>`
    fs.writeFileSync(path.join(guideDir, `${guide.slug}.html`), shell(locale, `guias/${guide.slug}.html`, guideTitle, guideIntro, guideContent), 'utf8')
  }
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath, 'utf8')
const urls = []
for (const locale of Object.keys(locales)) {
  urls.push(`/${locale}/`)
  guides.forEach(guide => urls.push(`/${locale}/guias/${guide.slug}.html`))
}
const entries = urls.filter(url => !sitemap.includes(`${domain}${url}`)).map(url => `  <url><loc>${domain}${url}</loc><lastmod>2026-09-02</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')
if (entries) sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`)
fs.writeFileSync(sitemapPath, sitemap, 'utf8')
console.log(`Generadas ${Object.keys(locales).length} entradas de idioma y ${guides.length * 2} guías editoriales.`)
console.log(`Keywords long-tail nativas registradas: ${Object.values(keywords).flat().length}.`)
