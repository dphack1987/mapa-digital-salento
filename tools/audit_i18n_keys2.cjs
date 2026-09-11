const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p);
  }
  return out;
}

// Claves usadas en t('') / tr('') / translate('')
const used = new Set();
const usedRe = /(?:[^a-zA-Z0-9_.]t|[^a-zA-Z0-9_.]tr|translate)\(\s*['"]([^'"]+)['"]/g;
for (const f of walk(srcDir)) {
  const t = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = usedRe.exec(t))) used.add(m[1]);
}

// Bloques por idioma: 'xx': { ... } a 4 espacios, cierre 4 espacios + } + coma opcional
const svc = fs.readFileSync(path.join(srcDir, 'services', 'translationService.ts'), 'utf8');
const defined = {};
const langRe = /^    '([a-z]{2})': \{$/gm;
const starts = [...svc.matchAll(langRe)];
starts.forEach((s, i) => {
  const lang = s[1];
  const bodyStart = s.index + s[0].length;
  const bodyEnd = i + 1 < starts.length ? starts[i + 1].index : svc.length;
  const body = svc.slice(bodyStart, bodyEnd);
  const found = new Set();
  for (const m of body.matchAll(/'([^']+)'\s*:/g)) found.add(m[1]);
  for (const m of body.matchAll(/^\s*([a-z]+)\s*:\s*'/gm)) found.add(m[1]);
  defined[lang] = found;
});

const langs = Object.keys(defined);
console.log('idiomas:', langs.join(', '));
console.log('claves usadas en codigo:', used.size);
let totalMissing = 0;
for (const lang of langs) {
  const missing = [...used].filter((k) => !defined[lang].has(k));
  totalMissing += missing.length;
  console.log(`[${lang}] definidas: ${defined[lang].size} | usadas-no-definidas: ${missing.length}`);
  missing.slice(0, 25).forEach((k) => console.log('   FALTA: ' + k));
}
console.log('TOTAL faltantes (todas las lenguas):', totalMissing);
