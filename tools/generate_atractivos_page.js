import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public/data/places.json'), 'utf8'));
const places = catalog.places || [];

const CAT_ORDER = ['destacados', 'actividades', 'naturaleza', 'miradores', 'historia'];
const SUBCATS = {
  destacados: '⭐ Destacados',
  actividades: 'Cabalgatas y motos',
  naturaleza: 'Naturaleza y senderos',
  miradores: 'Miradores',
  historia: 'Historia y centro',
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hasPautas(p) {
  return (p.photos || []).some((src) => String(src).startsWith('/pautas/'));
}

function shortDesc(p, n = 90) {
  const d = String(p.description || '').trim();
  return d.length > n ? d.slice(0, n).trim() + '…' : d;
}

function whatsapp(p) {
  const n = String(p.contact?.whatsapp || '').replace(/\D/g, '');
  return /^\d{8,15}$/.test(n) ? `https://wa.me/${n}` : '';
}

function cardImage(p) {
  const photos = (p.photos || []).filter((src) => !/menu-carta/i.test(src));
  if (photos[0]) return encodeURI(photos[0]);
  return '/imagenes-salento/valle-cocora-palmas-2.webp';
}

function mapUrl(p) {
  const label = p.location?.address || `${p.name} Salento`;
  return `https://www.google.com/maps/search/${encodeURIComponent(label)}`;
}

// Hand-maintained extras that appear on the atractivos page but not as type Atractivos
const EXTRA_IDS = [19, 20]; // Moto Aventura, Cabalgatas

// Subcategoria fija por id o name
function subcat(p) {
  const id = p.id;
  const name = String(p.name || '');
  const tags = (p.tags || []).join(' ').toLowerCase();
  const type = String(p.type || '');

  if (id === 19 || id === 20 || type === 'Experiencias' || type === 'Servicios') return 'actividades';
  if (id === 113 || id === 112) return 'actividades'; // jeeps, terminal
  if (id === 102 || id === 105 || id === 14 || id === 33 || /mirador/i.test(name)) return 'miradores';
  if (id === 101 || id === 103 || id === 110 || id === 100 || id === 111) return 'historia';
  if (/cascada|cocora|sendero|puente|palmas|ecolog/i.test(name) || /cascada|sendero|cocora/.test(tags)) return 'naturaleza';
  if (id === 108 || id === 109 || id === 104) return 'naturaleza';
  // caminata handcrafted
  if (/caminata/i.test(name)) return 'naturaleza';
  if (/parque principal/i.test(name)) return 'historia';
  return 'naturaleza';
}

const HANDCRAFTED = [
  {
    id: 'hand-caminata',
    name: 'Caminata Ecológica Calle Real — Alto de la Cruz',
    description: 'Sendero ecológico que conecta la Calle Real con el Mirador Alto de la Cruz. Vistas progresivas del municipio.',
    rating: '4.8',
    priceRange: 'Gratis',
    timeInfo: 'Acceso libre durante el día',
    slug: 'caminata-ecologica-calle-real-alto-de-la-cruz',
    photo: '/imagenes-salento/images (2).webp',
    map: 'Calle Real Alto de la Cruz Salento',
    sub: 'naturaleza',
    pautante: true,
    wa: '',
  },
  {
    id: 'hand-parque',
    name: 'Parque Principal de Salento',
    description: 'Parque principal del municipio, espacio de recreación y encuentro comunitario con zonas verdes.',
    rating: '4.7',
    priceRange: 'Gratis',
    timeInfo: 'Acceso libre 24 horas',
    slug: '',
    photo: '/imagenes-salento/patacon.webp',
    map: 'Parque Principal Salento',
    sub: 'historia',
    pautante: false,
    wa: '',
  },
];

// Base atractivos (type) + extras 19/20
const base = places
  .filter((p) => p.type === 'Atractivos Turísticos' || EXTRA_IDS.includes(p.id))
  .map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    rating: p.rating || '4.8',
    priceRange: p.priceRange || '$',
    timeInfo: p.timeInfo || 'Reserva previa',
    slug: slugify(p.name),
    photo: cardImage(p),
    map: p.location?.address || p.name,
    sub: subcat(p),
    pautante: Boolean(p.isPautante) || hasPautas(p),
    pautas: hasPautas(p),
    wa: whatsapp(p),
    tags: p.tags || [],
    type: p.type,
  }));

// Orden: pautas assets > isPautante > resto; luego rating desc
function priority(a, b) {
  const pa = (a.pautas ? 3 : 0) + (a.pautante ? 1 : 0);
  const pb = (b.pautas ? 3 : 0) + (b.pautante ? 1 : 0);
  if (pa !== pb) return pb - pa;
  return parseFloat(b.rating) - parseFloat(a.rating);
}

const extras = HANDCRAFTED.map((h) => ({ ...h, pautas: false, tags: [], type: 'Atractivos Turísticos' }));
let items = [...base, ...extras].sort(priority);

// Destacados = top pautas/pautante first subset (tag only for filter chip)
const featuredIds = new Set(
  items.filter((i) => i.pautas || i.pautante).slice(0, 8).map((i) => i.id),
);

items = items.map((i) => ({
  ...i,
  cats: [
    'todos',
    featuredIds.has(i.id) ? 'destacados' : null,
    i.sub,
  ].filter(Boolean),
}));

const count = items.length;

function renderCard(item, index) {
  const href = item.slug ? `/paginas-pautantes/${item.slug}/` : `https://www.google.com/maps/search/${encodeURIComponent(item.map)}`;
  const wa = item.wa
    ? `<a class="btn whatsapp" href="${item.wa}" target="_blank" rel="noreferrer">WhatsApp</a>`
    : '';
  const badge = item.pautas
    ? '<span class="badge badge-hot">Pautante</span>'
    : item.pautante
      ? '<span class="badge">Destacado</span>'
      : '';
  const cats = item.cats.join(' ');
  return `
      <article class="provider-card" data-cats="${esc(cats)}" style="--d:${index}" onclick="window.location.href='${esc(href)}'" role="link" tabindex="0" onkeydown="if(event.key==='Enter'){window.location.href='${esc(href)}'}" aria-label="Abrir ${esc(item.name)}">
        <div class="card-image" style="background-image:url('${esc(item.photo)}')">
          ${badge}
        </div>
        <div class="card-body">
          <div class="card-header-row"><span class="pill">${esc(item.sub === 'actividades' ? 'Experiencia' : item.sub === 'historia' ? 'Historia' : item.sub === 'miradores' ? 'Mirador' : 'Atractivos')}</span><span class="rating">⭐ ${esc(item.rating)}</span></div>
          <h3>${esc(item.name)}</h3>
          <p>${esc(shortDesc(item))}</p>
          <div class="card-actions" onclick="event.stopPropagation()">
            <a class="btn primary" href="${esc(href)}">Ver ficha</a>
            <a class="btn" href="${esc(mapUrl({ name: item.name, location: { address: item.map } }))}" target="_blank" rel="noreferrer">Mapa</a>
            ${wa}
          </div>
        </div>
      </article>`;
}

const cards = items.map(renderCard).join('');

const schemaItems = items.map((it, idx) => ({
  '@type': 'ListItem',
  position: idx + 1,
  name: it.name,
  url: it.slug ? `https://www.salentoalamano.com/paginas-pautantes/${it.slug}/` : undefined,
})).filter((x) => x.url);

const chips = CAT_ORDER.map((key, i) =>
  `<button type="button" class="chip${i === 0 || key === 'todos' ? ' active' : ''}" data-filter="${key}">${SUBCATS[key] || 'Todos'}</button>`
).join('').replace('class="chip active"', 'class="chip active"'); // destacados default? show todos first
// Default filter: todos
const chipsHtml = [
  `<button type="button" class="chip active" data-filter="todos">Todos (${count})</button>`,
  ...CAT_ORDER.map((key) => {
    const n = items.filter((i) => i.cats.includes(key)).length;
    return `<button type="button" class="chip" data-filter="${key}">${SUBCATS[key]} (${n})</button>`;
  }),
].join('');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="theme-color" content="#f5f1e8" />
  <title>Atractivos Turísticos de Salento, Quindío | Salento a la Mano</title>
  <meta name="description" content="Los ${count} atractivos de Salento: cabalgatas, alquiler de motos, miradores, senderos, Valle de Cocora e historia. Pautantes prioritarios con información verificada." />
  <meta property="og:title" content="Atractivos Turísticos de Salento | Salento a la Mano" />
  <meta property="og:description" content="Cabalgatas, motos, miradores, senderos e historia de Salento. Subcategorías y pautantes destacados." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.salentoalamano.com/categorias/atractivos-turisticos.html" />
  <meta property="og:image" content="https://www.salentoalamano.com/imagenes-salento/destinos-75.webp" />
  <meta property="og:site_name" content="Salento a la Mano" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://www.salentoalamano.com/categorias/atractivos-turisticos.html" />
  <link rel="alternate" hreflang="es-CO" href="https://www.salentoalamano.com/categorias/atractivos-turisticos.html" />
  <link rel="alternate" hreflang="x-default" href="https://www.salentoalamano.com/categorias/atractivos-turisticos.html" />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" />
  <style>
    :root { --paper:#f5f1e8;--ink:#1f2d26;--line:#d9d0bf;--coral:#dd7f5d;--green:#5a7d63;--yellow:#e7c77b; }
    *{box-sizing:border-box}
    body{margin:0;font-family:'DM Sans',sans-serif;background:var(--paper);color:var(--ink)}
    a{color:inherit;text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:24px 16px 72px}
    .topbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}
    .brand{display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:700}
    .brand-logo{width:38px;height:38px;object-fit:contain;border-radius:50%}
    .nav-link{background:#fff;border:1px solid var(--line);padding:9px 13px;border-radius:999px;font-size:14px;font-weight:600}
    .hero{display:grid;grid-template-columns:1.35fr .65fr;gap:14px;align-items:stretch;margin-bottom:16px}
    .hero-copy,.hero-visual{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden}
    .hero-copy{padding:22px 20px}
    .eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:10px;color:var(--coral);font-weight:700}
    h1{font-size:clamp(1.7rem,3.5vw,2.6rem);margin:8px 0 8px;line-height:1.05}
    .sub{color:#536057;font-size:.95rem;line-height:1.5;margin:0}
    .stats{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
    .stat{background:#f1eadb;border:1px solid var(--line);border-radius:12px;padding:9px 11px;font-size:13px}
    .stat strong{display:block;font-size:15px}
    .hero-visual{background-image:linear-gradient(rgba(15,28,18,.18), rgba(15,28,18,.42)),url('/imagenes-salento/destinos-75.webp');background-size:cover;background-position:center;min-height:220px}
    .subcats{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px;position:sticky;top:0;z-index:5;padding:10px 0;background:linear-gradient(var(--paper) 70%,transparent)}
    .chip{appearance:none;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:999px;padding:8px 13px;font:700 12px/1 'DM Sans',sans-serif;cursor:pointer;transition:.15s;box-shadow:0 1px 0 rgba(31,45,38,.04)}
    .chip:hover{border-color:var(--coral);transform:translateY(-1px)}
    .chip.active{background:var(--ink);color:#fff;border-color:var(--ink)}
    .provider-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
    .provider-card{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;transition:transform .18s,box-shadow .18s,border-color .18s;display:flex;flex-direction:column;animation:pop .35s ease both;animation-delay:calc(var(--d,0)*40ms)}
    .provider-card:hover{transform:translateY(-3px);box-shadow:0 10px 22px rgba(31,45,38,.1);border-color:rgba(221,127,93,.55)}
    .provider-card.is-hidden{display:none}
    @keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .card-image{position:relative;height:110px;background-size:cover;background-position:center;border-bottom:1px solid var(--line)}
    .badge{position:absolute;top:8px;left:8px;padding:3px 7px;border-radius:999px;font:700 9px/1.2 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.04em;background:#fff;border:1px solid var(--line);color:var(--ink)}
    .badge-hot{background:var(--coral);border-color:var(--coral);color:#fff}
    .card-body{padding:12px;display:flex;flex-direction:column;flex:1}
    .card-header-row{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px}
    .pill{background:#f1eadb;border:1px solid var(--line);border-radius:999px;padding:3px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
    .rating{font-size:12px;font-weight:700;color:#b8860b}
    .card-body h3{margin:0 0 6px;font:600 15px/1.2 Fraunces,serif;color:var(--ink)}
    .card-body p{margin:0 0 10px;font-size:12px;line-height:1.4;color:#536057;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex:1}
    .card-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border-radius:9px;font-size:11px;font-weight:700;border:1px solid var(--line);background:#fff;transition:.15s}
    .btn:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
    .btn.primary{background:var(--ink);color:#fff;border-color:var(--ink)}
    .btn.whatsapp{background:#25d366;color:#fff;border-color:#25d366}
    .btn.whatsapp:hover{background:#1da851}
    .empty{display:none;grid-column:1/-1;padding:28px;text-align:center;background:#fff;border:1px dashed var(--line);border-radius:16px;color:#536057}
    @media(max-width:768px){.hero{grid-template-columns:1fr}.hero-visual{min-height:140px}}
    @media(max-width:520px){.provider-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card-image{height:96px}.card-body{padding:10px}.card-body h3{font-size:13.5px}.btn{padding:6px 8px;font-size:10.5px}}
    @media(max-width:360px){.provider-grid{grid-template-columns:1fr}}
  </style>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Atractivos Turísticos de Salento',
    description: `${count} atractivos turísticos de Salento, Quindío, con pautantes destacados`,
    url: 'https://www.salentoalamano.com/categorias/atractivos-turisticos.html',
    mainEntity: { '@type': 'ItemList', itemListElement: schemaItems },
  })}</script>
</head>
<body>
  <div class="container">
    <div class="topbar">
      <a href="/" class="brand">
        <img src="/logo_salento2026.webp" alt="Salento a la Mano" class="brand-logo" />
        <span>Salento a la Mano</span>
      </a>
      <a href="/" class="nav-link">Volver al inicio</a>
    </div>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Categoría · con subcategorías</p>
        <h1>Atractivos Turísticos</h1>
        <p class="sub">Cabalgatas, alquiler de motos, miradores, senderos e historia — pautantes con ficha propia primero.</p>
        <div class="stats">
          <div class="stat"><strong>${count}</strong> atractivos</div>
          <div class="stat"><strong>${items.filter((i) => i.pautas || i.pautante).length}</strong> pautantes</div>
          <div class="stat"><strong>${Object.keys(SUBCATS).length}</strong> subcategorías</div>
        </div>
      </div>
      <div class="hero-visual" aria-label="Cabalgatas y atractivos de Salento"></div>
    </section>

    <div class="subcats" role="tablist" aria-label="Subcategorías de atractivos" id="subcats">
      ${chipsHtml}
    </div>

    <div class="provider-grid" id="grid">
      ${cards}
      <div class="empty" id="empty">No hay atractivos en esta subcategoría.</div>
    </div>
  </div>
  <script>
    (function () {
      var root = document.getElementById('subcats');
      var grid = document.getElementById('grid');
      var empty = document.getElementById('empty');
      if (!root || !grid) return;
      root.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn) return;
        var filter = btn.getAttribute('data-filter');
        root.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('active', c === btn); });
        var visible = 0;
        grid.querySelectorAll('.provider-card').forEach(function (card) {
          var cats = (card.getAttribute('data-cats') || '').split(/\\s+/);
          var show = filter === 'todos' || cats.indexOf(filter) !== -1;
          card.classList.toggle('is-hidden', !show);
          if (show) visible += 1;
        });
        if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
      });
    })();
  </script>
</body>
</html>
`;

const out = path.join(root, 'public/categorias/atractivos-turisticos.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', out, 'items=', count);
console.log('by sub:', CAT_ORDER.map((k) => k + '=' + items.filter((i) => i.cats.includes(k)).length).join(' '));
console.log('top5:', items.slice(0, 5).map((i) => i.name).join(' | '));
