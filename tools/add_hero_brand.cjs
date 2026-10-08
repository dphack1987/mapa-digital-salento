const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public', 'paginas-pautantes');
let ok = 0;
const skipped = [];

for (const dir of fs.readdirSync(root)) {
  const file = path.join(root, dir, 'index.html');
  if (!fs.existsSync(file)) continue;
  const buf = fs.readFileSync(file);
  const t = buf.toString('utf8');
  const label = (extra) => skipped.push(extra ? `${dir} (${extra})` : dir);

  if (!Buffer.from(t, 'utf8').equals(buf)) return console.log('ENC_SKIP', dir);
  if (!t.includes('class="hero-image"')) { label('sin hero'); continue; }
  if (t.includes('hero-brand')) { label('ya tiene'); continue; }

  const top = t.match(/<header class="topbar">[\s\S]*?<\/header>/);
  if (!top) { label('sin topbar'); continue; }
  const brand = [...top[0].matchAll(/<img src="([^"]+)"[^>]*>/g)]
    .map((m) => m[1])
    .find((s) => !s.includes('logo_salento'));
  if (!brand) { label('sin logo de marca'); continue; }

  const disk = path.join(__dirname, '..', 'public', brand.replace(/^\//, ''));
  if (!fs.existsSync(disk)) { label(`logo no existe: ${brand}`); continue; }

  const h1 = (t.match(/<h1>([^<]*)<\/h1>/) || [, ''])[1].trim();
  const alt = `Logo ${h1 || dir}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const re = /(<div class="hero-image"[^>]*>)/;
  if (!re.test(t)) { label('sin div hero-image'); continue; }

  const out = t.replace(re, `$1<img class="hero-brand" src="${brand}" alt="${alt}" />`);
  fs.writeFileSync(file, out, 'utf8');
  ok++;
  console.log('OK', dir, '->', brand);
}

console.log(`\nInyectados: ${ok}`);
console.log(`Omitidos (${skipped.length}):`);
for (const s of skipped) console.log(' -', s);
