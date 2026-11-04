/**
 * Enriquece de forma ADITIVA el JSON-LD de las páginas de categorías y landings.
 *
 * - categorías: nodo CollectionPage  -> speakable (h1, .sub) + inLanguage es-CO
 * - landings:   nodo WebPage         -> speakable (h1, .lead) + inLanguage es-CO
 * - Idempotente: si la propiedad ya existe/coincide, no la duplica ni la reescribe.
 * - No modifica HTML visible, CSS, textos ni el bloque BreadcrumbList/FAQPage.
 *
 * Uso:
 *   node tools/enrich_category_landing_structured_data.cjs           (dry-run)
 *   node tools/enrich_category_landing_structured_data.cjs --apply   (aplica)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const apply = process.argv.includes('--apply');
const BLOCK_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

// Definición de frentes a enriquecer
const CATEGORIAS = {
  dir: path.join(ROOT, 'public', 'categorias'),
  type: 'CollectionPage',
  cssSelector: ['h1', '.sub'],
  files: () =>
    fs
      .readdirSync(path.join(ROOT, 'public', 'categorias'))
      .filter((f) => f.toLowerCase().endsWith('.html'))
      .map((f) => path.join(ROOT, 'public', 'categorias', f)),
};

const LANDINGS = {
  dir: path.join(ROOT, 'public', 'landing'),
  type: 'WebPage',
  cssSelector: ['h1', '.lead'],
  files: () =>
    fs
      .readdirSync(path.join(ROOT, 'public', 'landing'))
      .map((d) => path.join(ROOT, 'public', 'landing', d, 'index.html'))
      .filter((f) => fs.existsSync(f)),
};

let files = 0;
let totalAdded = 0;

function processFile(file, cfg) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  const report = [];

  const out = text.replace(BLOCK_RE, (full, inner) => {
    let node;
    try {
      node = JSON.parse(inner);
    } catch (err) {
      return full;
    }
    if (!node || node['@type'] !== cfg.type) return full;

    const added = [];
    if (!node.speakable) {
      node.speakable = { '@type': 'SpeakableSpecification', cssSelector: cfg.cssSelector };
      added.push('speakable');
    }
    if (node.inLanguage !== 'es-CO') {
      node.inLanguage = 'es-CO';
      added.push('inLanguage=es-CO');
    }
    if (!added.length) return full;

    report.push(...added);
    totalAdded += added.length;
    return `<script type="application/ld+json">${JSON.stringify(node)}</script>`;
  });

  if (!report.length) return;
  files += 1;
  if (apply) fs.writeFileSync(file, out, 'utf8');
  console.log(`${apply ? 'UPDATED      ' : 'WOULD_UPDATE '}${rel}  (+${report.join(', +')})`);
}

// Hub /categorias/index.html: no tiene JSON-LD propio -> se crea (aditivo, idempotente)
// a partir de las tarjetas ya presentes en la página (href + <h3>).
function enrichCategoriasHub() {
  const file = path.join(ROOT, 'public', 'categorias', 'index.html');
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');

  const hasCollection = /"@type":"CollectionPage"/.test(text);
  if (hasCollection) return; // ya enriquecido

  const cardRe = /<a href="(\/categorias\/[^"]+\.html)"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/g;
  const items = [];
  let m;
  while ((m = cardRe.exec(text)) !== null) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: m[2].trim(),
      url: `https://www.salentoalamano.com${m[1]}`,
    });
  }
  if (!items.length) return;

  const breadcrumb = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.salentoalamano.com/' },
      { '@type': 'ListItem', position: 2, name: 'Categorías' },
    ],
  })}</script>`;
  const collection = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Categorías | Salento a la Mano',
    description:
      'Explora categorías de alojamientos, gastronomía, experiencias y servicios locales en Salento, Quindío.',
    url: 'https://www.salentoalamano.com/categorias/',
    inLanguage: 'es-CO',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1'] },
    mainEntity: { '@type': 'ItemList', itemListElement: items },
  })}</script>`;

  const out = text.replace(/<\/head>/i, `    ${breadcrumb}\n    ${collection}\n  </head>`);
  if (out === text) return;
  files += 1;
  totalAdded += 2 + items.length;
  if (apply) fs.writeFileSync(file, out, 'utf8');
  console.log(
    `${apply ? 'UPDATED      ' : 'WOULD_UPDATE '}public\\categorias\\index.html  (+BreadcrumbList, +CollectionPage, ${items.length} items)`
  );
}

enrichCategoriasHub();
for (const file of CATEGORIAS.files().sort()) processFile(file, CATEGORIAS);
for (const file of LANDINGS.files().sort()) processFile(file, LANDINGS);

console.log(`${apply ? 'Archivos actualizados' : 'Archivos a actualizar'}: ${files} | propiedades: ${totalAdded}`);
