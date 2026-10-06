/**
 * Inserta Open Graph / Twitter Cards y absolutiza URLs en JSON-LD
 * de las landings estáticas, sin regenerar el contenido.
 * Uso: node tools/add-og-meta.cjs
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.salentoalamano.com';
const ROOTS = [
  path.join(__dirname, '..', 'public', 'paginas-pautantes'),
];

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function absolute(u) {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  return SITE + (u.startsWith('/') ? u : '/' + u);
}

function processFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  if (html.includes('http-equiv="refresh"') || html.includes('name="robots" content="noindex')) {
    return false;
  }

  // --- 1. URLs relativas -> absolutas dentro de JSON-LD ---
  html = html.replace(/"(url|item|image)":"\/(?!\/)/g, (m, key) => `"${key}":"${SITE}/`);

  // --- 2. Insertar OG/Twitter si faltan ---
  if (!html.includes('property="og:title"')) {
    const titleM = html.match(/<title>([^<]+)<\/title>/);
    if (!titleM) return console.log('SKIP (sin title): ' + file);
    const title = titleM[1].trim();

    const descM = html.match(/<meta name="description" content="([^"]*)"/);
    const desc = descM ? descM[1] : '';

    const canonM = html.match(/<link rel="canonical" href="([^"]+)"/);
    const url = canonM ? absolute(canonM[1]) : null;

    // imagen: JSON-LD image > primer <img src> > url() del hero
    let image = null;
    const ldImg = html.match(/"image":"([^"]+)"/);
    if (ldImg) image = absolute(ldImg[1].replace(/\\"/g, '"'));
    if (!image) {
      const imgM = html.match(/<img src="([^"]+)"/);
      if (imgM) image = absolute(imgM[1]);
    }
    if (!image) {
      const cssM = html.match(/url\('([^']+)'\)/);
      if (cssM) image = absolute(cssM[1]);
    }
    if (!image || !/\.(webp|jpe?g|png|avif|gif|svg)(\?|#|$)/i.test(image)) {
      image = SITE + '/logo_salento2026.webp';
    }

    const lines = [
      '    <meta property="og:type" content="website" />',
      '    <meta property="og:site_name" content="Salento a la Mano" />',
      `    <meta property="og:title" content="${escapeAttr(title)}" />`,
      desc ? `    <meta property="og:description" content="${escapeAttr(desc)}" />` : null,
      url ? `    <meta property="og:url" content="${escapeAttr(url)}" />` : null,
      `    <meta property="og:image" content="${escapeAttr(image)}" />`,
      '    <meta property="og:locale" content="es_CO" />',
      '    <meta name="twitter:card" content="summary_large_image" />',
      `    <meta name="twitter:title" content="${escapeAttr(title)}" />`,
      desc ? `    <meta name="twitter:description" content="${escapeAttr(desc)}" />` : null,
      `    <meta name="twitter:image" content="${escapeAttr(image)}" />`,
    ].filter(Boolean).join('\n');

    const anchor = html.match(/<link rel="canonical" href="[^"]+" ?\/?>\n?/);
    if (anchor) {
      html = html.replace(anchor[0], anchor[0] + lines + '\n');
    } else {
      const titleAnchor = html.match(/<title>[^<]+<\/title>\n?/);
      if (!titleAnchor) return console.log('SKIP (sin ancla): ' + file);
      html = html.replace(titleAnchor[0], titleAnchor[0] + lines + '\n');
    }
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

let total = 0;
for (const root of ROOTS.filter(Boolean)) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root)) {
    const idx = path.join(root, entry, 'index.html');
    if (fs.existsSync(idx) && processFile(idx)) total++;
  }
}
console.log('Archivos actualizados: ' + total);
