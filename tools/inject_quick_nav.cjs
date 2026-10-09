// Inyecta el script de navegación rápida (/quick-nav.js) en las páginas HTML estáticas de public/.
// Idempotente: omite archivos que ya lo incluyan o que no tengan </body>.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const TAG = '<script src="/quick-nav.js" defer></script>';
const SKIP = /^(google|naver|bing|yandex)[0-9_-]*\.html$/i;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && /\.html$/i.test(entry.name)) out.push(full);
  }
  return out;
}

let injected = 0;
let skipped = 0;
let failed = 0;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (SKIP.test(path.basename(file))) { skipped++; continue; }
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error('No se pudo leer', rel, e.message);
    failed++;
    continue;
  }
  if (html.includes('quick-nav.js')) { skipped++; continue; }
  if (!/<\/body>/i.test(html)) {
    console.log('Sin </body>, se omite:', rel);
    skipped++;
    continue;
  }
  const updated = html.replace(/<\/body>/i, `  ${TAG}\n</body>`);
  try {
    fs.writeFileSync(file, updated, 'utf8');
    injected++;
  } catch (e) {
    console.error('No se pudo escribir', rel, e.message);
    failed++;
  }
}

console.log(`\nquick-nav: ${injected} inyectadas, ${skipped} omitidas, ${failed} fallidas.`);
