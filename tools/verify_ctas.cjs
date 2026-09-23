const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const OLD = /^(Ver ficha|Ver p&aacute;gina|Ver página|Ver pagina|Ver ficha completa|Ver ficha del|Ver página oficial)$/i;
const NEW = /^(Ver menú|Ver menu|Reservar ya|Ver información|Ver informacion)$/i;
const primaryRe = /class=["'][^"']*\b(?:btn primary|button primary|primary)\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;

const files = walk('public');
const rows = [];
let oldCount = 0;
let newCount = 0;
const labelTotals = {};

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const labels = [];
  let m;
  primaryRe.lastIndex = 0;
  while ((m = primaryRe.exec(html)) !== null) {
    const label = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (label) labels.push(label);
  }
  const uniq = [...new Set(labels)];
  const olds = uniq.filter(l => OLD.test(l));
  const news = uniq.filter(l => NEW.test(l));
  for (const l of labels) labelTotals[l] = (labelTotals[l] || 0) + 1;
  if (olds.length) oldCount++;
  if (news.length) newCount++;
  if (olds.length || news.length || /categorias\/|hoteles-abiertos|vias-salento|paginas-pautantes|pautantes\//.test(f.replace(/\\/g, '/'))) {
    rows.push({ f: f.replace(/\\/g, '/'), olds, news, uniq });
  }
}

console.log('TOTAL HTML files:', files.length);
console.log('Files with OLD CTA buttons:', oldCount);
console.log('Files with NEW CTA buttons:', newCount);
console.log('\n=== Label totals (primary buttons) ===');
for (const [k, v] of Object.entries(labelTotals).sort((a, b) => b[1] - a[1])) {
  console.log(String(v).padStart(4), JSON.stringify(k));
}

console.log('\n=== Per-file (categorias + pautantes + key roots) ===');
for (const r of rows) {
  const flag = r.olds.length ? ' [OLD!]' : '';
  console.log(r.f + flag);
  if (r.olds.length) console.log('   OLD:', r.olds.join(' | '));
  if (r.news.length) console.log('   NEW:', r.news.join(' | '));
}

if (oldCount === 0) console.log('\nOK: no old CTA button labels anywhere.');
else console.log('\nFAIL: old CTA labels remain in', oldCount, 'files.');

// Check no regenerated extra pages / duplicates
const cat = fs.readdirSync('public/categorias').filter(f => f.endsWith('.html'));
console.log('\ncategorias HTML count:', cat.length, cat.join(', '));

const paginas = fs.readdirSync('public/paginas-pautantes');
console.log('paginas-pautantes folders:', paginas.length);

const pautantesHtml = fs.readdirSync('public/pautantes').filter(f => f.endsWith('.html'));
console.log('pautantes HTML:', pautantesHtml.length);

// Verify featuredPautantes has no slice(0,4)
const app = fs.readFileSync('src/App.tsx', 'utf8');
const hasSlice = /featuredPautantes[\s\S]{0,400}?slice\(\s*0\s*,\s*4\s*\)/.test(app);
console.log('\nfeaturedPautantes still slice(0,4)?', hasSlice ? 'YES (BAD)' : 'NO (OK - shows all)');

// Verify placeCta usage count
const uses = (app.match(/placeCtaLabel|markerCtaLabel/g) || []).length;
console.log('App.tsx placeCta/markerCta references:', uses);

// FeaturedHomeMenus
const fhm = fs.readFileSync('src/components/FeaturedHomeMenus.tsx', 'utf8');
console.log('FeaturedHomeMenus uses placeCtaLabel:', fhm.includes('placeCtaLabel'));
console.log('FeaturedHomeMenus includes Fonda:', fhm.includes('Fonda Boquía'));

// translation keys
const tr = fs.readFileSync('src/services/translationService.ts', 'utf8');
console.log('translation map.viewMenu:', tr.includes("'map.viewMenu'"));
console.log('translation map.viewReserve:', tr.includes("'map.viewReserve'"));
console.log('translation map.viewInfo:', tr.includes("'map.viewInfo'"));
