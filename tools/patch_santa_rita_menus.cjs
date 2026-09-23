const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'paginas-pautantes');

const MENU_CAT_LABELS = {
  truchas: 'Truchas',
  carnes: 'Carnes',
  adicionales: 'Adicionales',
  desayunos: 'Desayunos y bebidas',
  bebidas: 'Bebidas',
  especialidades: 'Especialidades',
  carta: 'En la carta',
  habitaciones: 'Habitaciones',
  servicios: 'Servicios',
  planes: 'Planes',
  plan: 'Plan',
  rutas: 'Rutas',
  productos: 'Productos',
  experiencia: 'Experiencia',
  incluye: 'Incluye',
  tours: 'Tours',
  ambiente: 'Ambiente',
  cotizar: 'Cotizar',
  atracciones: 'Atracciones',
  requisitos: 'Requisitos',
};

const IMG_POOL = [
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita3.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cascada2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cueva1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/puente-cpolgante1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-2.webp',
];

const SANTA_RITA_ITEMS = [
  { cat: 'planes', nombre: 'Pasadía', precio: 11000, desc: 'Acceso a senderos, piscina natural, cascadas y miradores' },
  { cat: 'planes', nombre: 'Camping por noche', precio: 28000, desc: 'Incluye caminata, piscina, cascadas, cavernas y túnel. Traer implementos; se vende madera y carbón' },
  { cat: 'habitaciones', nombre: 'Habitación (pareja)', precio: 140000, desc: 'Incluye desayuno y acceso a senderos, piscina, cascadas, cavernas y túnel. Mascota: $15.000' },
  { cat: 'servicios', nombre: 'Desayuno', precio: 12000 },
  { cat: 'servicios', nombre: 'Calentado', precio: 15000 },
  { cat: 'servicios', nombre: 'Almuerzo', precio: 18000 },
  { cat: 'servicios', nombre: 'Trucha', precio: 28000 },
  { cat: 'servicios', nombre: 'Parqueadero', precio: 0, desc: 'Gratis para moto y carro' },
];

const PAGES = [
  {
    file: path.join(ROOT, 'camping-cascadas-de-santa-rita', 'index.html'),
    heading: 'Habitaciones, camping y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por persona',
    businessName: 'Camping Cascadas de Santa Rita',
    whatsapp: '573145083065',
    items: SANTA_RITA_ITEMS,
  },
  {
    file: path.join(ROOT, 'reserva-natural-cascadas-de-santa-rita', 'index.html'),
    heading: 'Entrada y servicios',
    intro: 'Elige el plan o lo que quieras incluir y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    businessName: 'Reserva Natural Cascadas de Santa Rita',
    whatsapp: '573145083065',
    items: SANTA_RITA_ITEMS,
  },
];

function findSection(html, startRegex) {
  const m = html.match(startRegex);
  if (!m) throw new Error('start not found: ' + startRegex);
  const start = m.index;
  // find matching </section> (no nested <section> in these mapa blocks)
  const endIdx = html.indexOf('</section>', start);
  if (endIdx < 0) throw new Error('end not found');
  const end = endIdx + '</section>'.length;
  return { start, end, block: html.slice(start, end) };
}

function buildMenu(cfg) {
  const items = cfg.items.map((it, i) => ({
    id: i + 1,
    cat: String(it.cat || 'planes'),
    nombre: String(it.nombre || '').trim(),
    precio: Number(it.precio) || 0,
    desc: String(it.desc || '').slice(0, 160),
    img: IMG_POOL[i % IMG_POOL.length],
  })).filter((it) => it.nombre);

  const cats = [{ id: 'todas', label: 'Todas' }];
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.cat)) continue;
    seen.add(it.cat);
    const label = MENU_CAT_LABELS[it.cat] || it.cat.charAt(0).toUpperCase() + it.cat.slice(1);
    cats.push({ id: it.cat, label });
  }

  const showCurrency = items.some((it) => it.precio > 0);
  const config = {
    containerId: 'menuGrid',
    items,
    categories: cats,
    whatsapp: cfg.whatsapp,
    businessName: cfg.businessName,
    currency: 'COP',
    showSearch: true,
    showCurrency,
    precioLabel: cfg.precioLabel,
  };

  const section = `
      <section class="section" id="menu-interactivo">
        <h2>${cfg.heading}</h2>
        <p class="muted" style="margin-top:-8px;margin-bottom:20px">${cfg.intro}</p>
        <div class="menu-header">
          <div class="menu-search"><input type="text" id="menuSearch" placeholder="Buscar opción..." /></div>
          ${showCurrency ? `<div class="currency-switch" role="group" aria-label="Moneda">
            <button data-cur="COP" class="active">COP</button>
            <button data-cur="USD">USD</button>
            <button data-cur="EUR">EUR</button>
          </div>` : ''}
        </div>
        <div class="menu-tabs" id="menuTabs"></div>
        <div class="menu-grid" id="menuGrid"></div>
        <div class="menu-empty" id="menuEmpty" style="display:none"><span>🔍</span>No encontramos opciones con ese nombre.</div>
      </section>
      <div class="cart-float" id="cartFloat" role="button" tabindex="0" aria-label="Ver selección">
        <span class="badge" id="cartBadge">0</span>
        <span class="total" id="cartTotal">$0</span>
        <span>Ver pedido →</span>
      </div>
      <div class="cart-modal" id="cartModal" role="dialog" aria-modal="true">
        <div class="cart-panel">
          <h2>Tu pedido</h2>
          <div id="cartItems"></div>
          <div class="cart-total"><span>Total</span><span id="cartModalTotal">$0</span></div>
          <div class="cart-actions">
            <button class="send" id="sendWhatsApp">Enviar por WhatsApp</button>
            <button class="clear" id="clearCart">Vaciar</button>
            <button class="close" id="closeCart">Seguir explorando</button>
          </div>
        </div>
      </div>`;

  const assets = `
    <script src="/pautante-common.js"></script>
    <script>PautanteCommon.initMenu(${JSON.stringify(config).replace(/</g, '\\u003c')});</script>`;

  return { section, assets, itemCount: items.length };
}

function patchPage(cfg) {
  let html = fs.readFileSync(cfg.file, 'utf8');

  if (html.includes('id="menu-interactivo"')) {
    console.log('SKIP (already has menu):', path.basename(path.dirname(cfg.file)));
    return;
  }

  // Extract mapa-offline section
  const mapa = findSection(html, /<section[^>]*\bid="mapa-offline"[\s\S]*?>/);
  html = mapa.start === 0 ? html.slice(mapa.end) : html.slice(0, mapa.start) + html.slice(mapa.end);

  // Find gallery section end
  const gal = findSection(html, /<section class="section"><h2>Galería de imágenes<\/h2>/);
  const menu = buildMenu(cfg);

  const insert =
    gal.block +
    '\n\n' +
    menu.section +
    '\n\n' +
    // restore original indentation for mapa
    mapa.block.replace(/^<section/, '      <section');

  html = html.slice(0, gal.start) + insert + html.slice(gal.end);

  // Inject assets before </body>
  if (!html.includes('pautante-common.js')) {
    if (!html.includes('</body>')) throw new Error('no </body> in ' + cfg.file);
    html = html.replace(/(\s*)<\/body>/, (m, ws) => ws + menu.assets + ws + '</body>');
  }

  fs.writeFileSync(cfg.file, html, 'utf8');

  const mapaCount = (html.match(/\bid="mapa-offline"/g) || []).length;
  const hasMenu = html.includes('id="menu-interactivo"') && html.includes('pautante-common.js');
  console.log(
    'OK',
    path.basename(path.dirname(cfg.file)),
    '| items=' + menu.itemCount,
    '| mapa-offline=' + mapaCount,
    '| menu=' + hasMenu
  );
}

for (const cfg of PAGES) {
  if (!fs.existsSync(cfg.file)) {
    console.error('MISSING', cfg.file);
    process.exitCode = 1;
    continue;
  }
  patchPage(cfg);
}
