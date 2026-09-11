const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|ts)$/.test(e.name)) out.push(p);
  }
  return out;
}

// 1. Claves usadas: t('x'), tr('x', ...), translate('x', ...)
const used = new Set();
for (const f of walk(srcDir)) {
  const t = fs.readFileSync(f, 'utf8');
  const re = /(?:\bt|\btr|translate)\(\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(t))) used.add(m[1]);
}

// 2. Claves definidas por idioma
const svc = fs.readFileSync(path.join(srcDir, 'services', 'translationService.ts'), 'utf8');
const defined = {};
const blocks = svc.split(/^    '(\w+)': \{$/m);
for (let i = 1; i < blocks.length; i += 2) {
  const lang = blocks[i];
  const body = blocks[i + 1].split(/\n    \},?\n/)[0];
  defined[lang] = new Set([...body.matchAll(/^\s*'([^']+)'\s*:/gm)].map((x) => x[1]));
}

const langs = Object.keys(defined);
console.log('idiomas:', langs.join(', '));
console.log('claves usadas en codigo:', used.size);
for (const lang of langs) {
  const missing = [...used].filter((k) => !defined[lang].has(k));
  console.log(`\n[${lang}] definidas: ${defined[lang].size} | usadas-no-definidas: ${missing.length}`);
  missing.slice(0, 30).forEach((k) => console.log('   FALTA: ' + k));
}
const allDefined = new Set(langs.flatMap((l) => [...defined[l]]));
const unused = [...allDefined].filter((k) => !used.has(k));
console.log(`\ndefinidas-pero-no-usadas: ${unused.length}`);
unused.slice(0, 20).forEach((k) => console.log('   SIN USO: ' + k));
