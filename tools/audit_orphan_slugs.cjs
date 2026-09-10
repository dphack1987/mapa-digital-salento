const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'places.json'), 'utf8'));
const providers = Array.isArray(catalog.places) ? catalog.places : [];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const expected = new Set(providers.map((p) => slugify(p.name)));
console.log('places:', providers.length, 'slugs esperados:', expected.size);

const landingDir = path.join(root, 'public', 'paginas-pautantes');
const actualDirs = fs.readdirSync(landingDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const stubDir = path.join(root, 'public', 'pautantes');
const actualStubs = fs.readdirSync(stubDir).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''));

const BROKEN_RE = /-a-|ela-as|bola-var|informacia|ecola-gica|tura-stica/;

console.log('\n== DIRS huerfanos (no corresponden a ningun place actual) ==');
for (const d of actualDirs.sort()) {
  if (!expected.has(d)) {
    const hasGoodCounterpart = [...expected].some((s) => s.replace(/-/g, '') === d.replace(/-a-/g, '').replace(/-/g, ''));
    console.log((BROKEN_RE.test(d) ? '[ROTO] ' : '[?] ') + d + (hasGoodCounterpart ? '  (contraparte OK existe)' : '  (SIN contraparte)'));
  }
}
console.log('\n== STUBS huerfanos ==');
for (const s of actualStubs.sort()) {
  if (!expected.has(s)) {
    console.log((BROKEN_RE.test(s) ? '[ROTO] ' : '[?] ') + s + '.html');
  }
}
console.log('\n== PLACES sin directorio (faltan por generar) ==');
for (const s of [...expected].sort()) {
  if (!actualDirs.includes(s)) console.log('[FALTA] ' + s);
}
