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
  pt: {
    language: 'pt-BR', title: 'Salento, Colômbia Guia de Viagem | Salento a la Mano',
    description: 'Guia local de Salento, Colômbia: hospedagem, gastronomia, coffee tours e contato direto com negócios locais.',
    intro: 'Encontre hospedagem, gastronomia, experiências e serviços locais em Salento, Colômbia.',
    cta: 'Explorar o mapa',
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
      ['Día 2: naturaleza', 'Organiza una salida al Valle de Cocora o una experiencia cercana según clima, tiempo y dificultad.'],
      ['Día 3: café y compras', 'Visita una finca cafetera, conoce artesanías y contacta directamente los negocios que quieras visitar.'],
    ],
  },
  {
    slug: 'mejores-coffee-tours-salento',
    esTitle: 'Los mejores coffee tours en Salento: comparativa honesta',
    enTitle: 'Best Coffee Tours in Salento: An Honest Comparison',
    ptTitle: 'Melhores coffee tours em Salento: comparativo honesto',
    esIntro: 'Comparamos las fincas cafeteras verificadas de Salento con datos reales: duración, idiomas, precios de referencia y contacto directo sin intermediarios.',
    enIntro: 'We compare verified coffee farms in Salento with real data: duration, languages, reference prices and direct contact with no middlemen.',
    ptIntro: 'Comparamos as fazendas de café verificadas de Salento com dados reais: duração, idiomas, preços de referência e contato direto, sem intermediários.',
    sections: {
      es: [
        ['Cómo comparar un coffee tour', 'Revisa duración, idiomas, punto de encuentro, qué incluye y si el precio es por persona. Todas las fincas verificadas permiten contacto directo por WhatsApp, sin intermediarios ni comisiones.'],
        ['Fincas verificadas en Salento', 'Finca Don Eduardo (3 horas, tours en inglés y español, a 8 minutos caminando de la plaza principal, rango $$$ con tour en inglés de $100.000 COP por persona) · Finca Cafetera Don Elías (rango $$, consultar tarifas actuales) · El Recuerdo Coffee Tour (rango $$, reserva previa por WhatsApp).'],
        ['Antes de reservar', 'Confirma disponibilidad, tarifa vigente, idioma del tour, punto de encuentro y política de cancelación directamente con la finca.'],
      ],
      en: [
        ['How to compare a coffee tour', 'Check duration, languages, meeting point, what is included and whether the price is per person. Every verified farm offers direct WhatsApp contact with no middlemen or commissions.'],
        ['Verified farms in Salento', 'Finca Don Eduardo (3 hours, tours in English and Spanish, an 8-minute walk from the main square, $$$ range with the English tour at $100,000 COP per person) · Finca Cafetera Don Elías ($$ range, ask for current rates) · El Recuerdo Coffee Tour ($$ range, advance booking via WhatsApp).'],
        ['Before booking', 'Confirm availability, current rates, tour language, meeting point and cancellation policy directly with the farm.'],
      ],
      pt: [
        ['Como comparar um coffee tour', 'Verifique duração, idiomas, ponto de encontro, o que está incluído e se o preço é por pessoa. Todas as fazendas verificadas oferecem contato direto por WhatsApp, sem intermediários nem comissões.'],
        ['Fazendas verificadas em Salento', 'Finca Don Eduardo (3 horas, tours em inglês e espanhol, a 8 minutos a pé da praça principal, faixa $$$ com tour em inglês por $100.000 COP por pessoa) · Finca Cafetera Don Elías (faixa $$, consulte os preços atuais) · El Recuerdo Coffee Tour (faixa $$, reserva antecipada por WhatsApp).'],
        ['Antes de reservar', 'Confirme disponibilidade, preços vigentes, idioma do tour, ponto de encontro e política de cancelamento diretamente com a fazenda.'],
      ],
    },
  },
  {
    slug: 'experiencia-salento-llegada-a-salida',
    esTitle: 'Salento de llegada a salida: tu experiencia completa',
    enTitle: 'Salento from Arrival to Departure: Your Complete Experience',
    ptTitle: 'Salento da chegada à partida: sua experiência completa',
    esIntro: 'Del terminal a la despedida: cómo vivir Salento con transporte, hospedaje, Cocora, café y gastronomía verificados, en trato directo.',
    enIntro: 'From the bus terminal to farewell: how to experience Salento with verified transport, stays, Cocora, coffee and food, booked direct.',
    ptIntro: 'Da rodoviária à despedida: como viver Salento com transporte, hospedagem, Cocora, café e gastronomia verificados, em contato direto.',
    sections: {
      es: [
        ['La llegada', 'Llega al Terminal de Transporte de Salento y ubica la plaza principal: allí está el Terminal de Transporte Público Jeep Willys, punto de partida al Valle de Cocora.'],
        ['El check-in', 'Hoteles verificados como Hotel Camino Nacional y Hotel La Floresta (desde $124.000 COP/noche) reciben con contacto directo por WhatsApp.'],
        ['Los días: Cocora y café', 'Dedica un día al Valle de Cocora con Cootracocora (salidas diarias 6:00 AM – 9:00 PM, tarifa de referencia desde $3.600 COP) y otro a un coffee tour verificado como Finca Don Eduardo (3 horas, en inglés y español). Cierra con trucha en Fonda Boquía (11 preparaciones, $28.000–$46.000).'],
        ['La despedida', 'Coordina tu regreso desde la plaza con la cooperativa y confirma horarios de salida directamente por WhatsApp. Tu dinero se queda en Salento.'],
      ],
      en: [
        ['Arrival', 'Arrive at the Salento Transport Terminal and head to the main square: the Willys Jeep Public Transport Terminal, gateway to Cocora Valley, is there.'],
        ['Check-in', 'Verified hotels such as Hotel Camino Nacional and Hotel La Floresta (from $124,000 COP/night) welcome you with direct WhatsApp contact.'],
        ['The days: Cocora and coffee', 'Spend one day in Cocora Valley with Cootracocora (daily departures 6:00 AM – 9:00 PM, reference fare from $3,600 COP) and another on a verified coffee tour like Finca Don Eduardo (3 hours, in English and Spanish). Finish with trout at Fonda Boquía (11 preparations, $28,000–$46,000).'],
        ['Farewell', 'Arrange your return from the square with the cooperative and confirm departure times directly via WhatsApp. Your money stays in Salento.'],
      ],
      pt: [
        ['A chegada', 'Chegue à Rodoviária de Salento e vá até a praça principal: lá fica o Terminal de Transporte Público Jeep Willys, porta de entrada do Vale do Cocora.'],
        ['O check-in', 'Hotéis verificados como Hotel Camino Nacional e Hotel La Floresta (desde $124.000 COP/noite), recebem com contato direto por WhatsApp.'],
        ['Os dias: Cocora e café', 'Dedique um dia ao Vale do Cocora com a Cootracocora (saídas diárias 6:00 – 21:00, tarifa de referência desde $3.600 COP) e outro a um coffee tour verificado como a Finca Don Eduardo (3 horas, em inglês e espanhol). Feche com truta na Fonda Boquía (11 preparos, $28.000–$46.000).'],
        ['A despedida', 'Combine seu retorno desde a praça com a cooperativa e confirme os horários diretamente por WhatsApp. Seu dinheiro fica em Salento.'],
      ],
    },
  },
  {
    slug: 'como-llegar-valle-cocora-sin-tour',
    esTitle: 'Cómo llegar al Valle de Cocora sin tour: guía por tu cuenta',
    enTitle: 'How to Get to Cocora Valley Without a Tour: Independent Guide',
    ptTitle: 'Como chegar ao Vale do Cocora sem excursão: guia por conta própria',
    esIntro: 'Llega al Valle de Cocora por tu cuenta en jeep Willys compartido desde la plaza de Salento, con tarifa de referencia, horarios y punto de encuentro verificados.',
    enIntro: 'Reach Cocora Valley on your own by shared Willys jeep from Salento main square, with verified reference fares, schedules and meeting point.',
    ptIntro: 'Chegue ao Vale do Cocora por conta própria de jipe Willys compartilhado desde a praça de Salento, com tarifa de referência, horários e ponto de encontro verificados.',
    sections: {
      es: [
        ['El transporte público al Cocora', 'La cooperativa Cootracocora opera jeeps Willys tradicionales Salento – Valle de Cocora con salidas diarias de 6:00 AM a 9:00 PM desde la plaza principal. Tarifa de referencia desde $3.600 COP por trayecto; confirma la tarifa vigente por WhatsApp.'],
        ['Cómo funciona el cupo', 'Las salidas son al completar cupo desde el Terminal de Transporte Público Jeep Willys en la plaza principal. Llega con anticipación en temporada alta.'],
        ['El regreso', 'Los jeeps regresan del Valle a Salento en la misma modalidad. Coordina el horario de vuelta directamente con la cooperativa, sin intermediarios.'],
      ],
      en: [
        ['Public transport to Cocora', 'The Cootracocora cooperative runs traditional Willys jeeps Salento – Cocora Valley with daily departures from 6:00 AM to 9:00 PM from the main square. Reference fare from $3,600 COP per ride; confirm the current fare via WhatsApp.'],
        ['How seating works', 'Jeeps leave once full from the Willys Jeep Public Transport Terminal on the main square. Arrive early in high season.'],
        ['The way back', 'Jeeps return from the Valley to Salento the same way. Arrange your return time directly with the cooperative, with no middlemen.'],
      ],
      pt: [
        ['Transporte público para o Cocora', 'A cooperativa Cootracocora opera jipes Willys tradicionais Salento – Vale do Cocora com saídas diárias das 6:00 às 21:00 desde a praça principal. Tarifa de referência a partir de $3.600 COP por trecho; confirme a tarifa vigente por WhatsApp.'],
        ['Como funciona a lotação', 'Os jipes saem ao completar a lotação no Terminal de Transporte Público Jeep Willys, na praça principal. Chegue com antecedência na alta temporada.'],
        ['A volta', 'Os jipes retornam do Vale para Salento no mesmo esquema. Combine o horário de volta diretamente com a cooperativa, sem intermediários.'],
      ],
    },
  },
]

const keywords = {
  es: ['mejores fincas cafeteras con trato directo en Salento', 'hotel familiar cerca de la plaza de Salento', 'restaurantes con comida local en Salento Quindío', 'transporte al Valle de Cocora desde Salento', 'qué hacer en Salento en tres días', 'mejores coffee tours en Salento con reserva directa', 'cómo llegar al Valle de Cocora sin tour desde Salento'],
  en: ['best coffee farms with direct booking in Salento Colombia', 'family-friendly hotel near Salento main square', 'best local restaurants in Salento Quindio', 'how to get to Cocora Valley from Salento', 'things to do in Salento Colombia in 3 days', 'best coffee tours in Salento Colombia with direct booking', 'how to get to Cocora Valley from Salento without a tour'],
  de: ['beste Kaffeefincas mit direkter Buchung in Salento Kolumbien', 'familienfreundliches Hotel nahe dem Hauptplatz von Salento', 'regionale Restaurants in Salento Quindío Kolumbien', 'Anreise zum Cocora-Tal ab Salento Kolumbien', 'Salento Kolumbien in drei Tagen erleben'],
  fr: ['meilleures fincas de café avec réservation directe à Salento', 'hôtel familial près de la place principale de Salento', 'restaurants locaux à Salento Quindío Colombie', 'comment aller de Salento à la vallée de Cocora', 'que faire à Salento Colombie en trois jours'],
  pt: ['melhores coffee tours em Salento Colômbia', 'como chegar ao Vale do Cocora saindo de Salento', 'onde ficar em Salento perto da praça principal', 'o que fazer em Salento em 3 dias', 'restaurantes com comida típica em Salento Quindío'],
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

const UI = {
  es: { guides: 'Guías para planificar tu visita', searches: 'Búsquedas útiles', localGuide: 'Guía local', explore: 'Explora negocios locales', exploreText: 'Consulta el directorio y contacta directamente a los establecimientos registrados.' },
  en: { guides: 'Guides to plan your visit', searches: 'Useful searches', localGuide: 'Local guide', explore: 'Explore local businesses', exploreText: 'Browse the directory and contact registered businesses directly.' },
  de: { guides: 'Guides to plan your visit', searches: 'Useful searches', localGuide: 'Local guide', explore: 'Explore local businesses', exploreText: 'Browse the directory and contact registered businesses directly.' },
  fr: { guides: 'Guides to plan your visit', searches: 'Useful searches', localGuide: 'Local guide', explore: 'Explore local businesses', exploreText: 'Browse the directory and contact registered businesses directly.' },
  pt: { guides: 'Guias para planejar sua visita', searches: 'Buscas úteis', localGuide: 'Guia local', explore: 'Explore negócios locais', exploreText: 'Consulte o diretório e fale diretamente com os estabelecimentos registrados.' },
}

function pickTitle(guide, locale) {
  return guide[`${locale}Title`] || guide.enTitle
}

function pickIntro(guide, locale) {
  return guide[`${locale}Intro`] || guide.enIntro
}

function pickSections(guide, locale) {
  if (guide.sections && !Array.isArray(guide.sections)) {
    return guide.sections[locale] || guide.sections.en || []
  }
  return guide.sections || []
}

for (const [locale, data] of Object.entries(locales)) {
  const ui = UI[locale] || UI.en
  const dir = path.join(publicDir, locale)
  fs.mkdirSync(dir, { recursive: true })
  const guideCards = guides.map(guide => `<article class="guide-card"><h3>${escapeHtml(pickTitle(guide, locale))}</h3><p>${escapeHtml(pickIntro(guide, locale))}</p><a class="btn primary" href="/${locale}/guias/${guide.slug}.html">${data.cta}</a></article>`).join('')
  const keywordsList = keywords[locale].map(keyword => `<li>${escapeHtml(keyword)}</li>`).join('')
  const content = `<section class="hero"><span class="eyebrow">Salento, Quindío, Colombia</span><h1>${escapeHtml(data.title.split(' | ')[0])}</h1><p>${escapeHtml(data.intro)}</p><a class="btn primary" href="/">${data.cta}</a></section><section class="section"><h2>${ui.guides}</h2><div class="guide-grid">${guideCards}</div></section><section class="section"><h2>${ui.searches}</h2><ul>${keywordsList}</ul></section>`
  fs.writeFileSync(path.join(dir, 'index.html'), shell(locale, '', data.title, data.description, content), 'utf8')
  const guideDir = path.join(dir, 'guias')
  fs.mkdirSync(guideDir, { recursive: true })
  for (const guide of guides) {
    const guideTitle = pickTitle(guide, locale)
    const guideSeoTitle = `${guideTitle} | ${locale.toUpperCase()}`
    const guideIntro = pickIntro(guide, locale)
    const sectionHtml = pickSections(guide, locale).map(([heading, text]) => `<div class="section"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></div>`).join('')
    const guideContent = `<section class="hero"><span class="eyebrow">${ui.localGuide}</span><h1>${escapeHtml(guideTitle)}</h1><p>${escapeHtml(guideIntro)}</p></section>${sectionHtml}<section class="section"><h2>${ui.explore}</h2><p>${ui.exploreText}</p><a class="btn primary" href="/categorias/index.html">${data.cta}</a></section>`
    fs.writeFileSync(path.join(guideDir, `${guide.slug}.html`), shell(locale, `guias/${guide.slug}.html`, guideSeoTitle, guideIntro, guideContent), 'utf8')
  }
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath, 'utf8')
const urls = []
for (const locale of Object.keys(locales)) {
  urls.push(`/${locale}/`)
  guides.forEach(guide => urls.push(`/${locale}/guias/${guide.slug}.html`))
}
const entries = urls.filter(url => !sitemap.includes(`${domain}${url}`)).map(url => `  <url><loc>${domain}${url}</loc><lastmod>2026-09-10</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')
if (entries) sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`)
fs.writeFileSync(sitemapPath, sitemap, 'utf8')
console.log(`Generadas ${Object.keys(locales).length} entradas de idioma y ${guides.length * Object.keys(locales).length} guías editoriales.`)
console.log(`Keywords long-tail nativas registradas: ${Object.values(keywords).flat().length}.`)
