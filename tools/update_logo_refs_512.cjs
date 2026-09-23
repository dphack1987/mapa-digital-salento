const fs = require('fs');
const path = require('path');

const logos = [
  'barcinales-cafe-bar-logo.webp',
  'boki_mall_logo.webp',
  'logo boki.webp',
  'logo-hotel-mirador-de-boquia.webp',
  'terra-restaurante-logo.webp',
  'logo-cocora-magica.webp',
  'logo_ocaso.webp',
  'logo-coffe-tour-don-elias.webp',
  'logo-finca-don-eduardo.webp',
  'logo-cootracocora.webp',
  'logo-recuerdo-tour.webp',
  'logo-mahalo.webp',
  'logo-mirador-dios.webp',
  'logo-moto-aventura-110.webp',
  'Logolavidabella.webp',
  'logo_cascadas_de_santa_rita.webp',
];

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|json|js|ts|tsx|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk('public').concat(walk('src'));
let changed = 0;

for (const f of files) {
  let t = fs.readFileSync(f, 'utf8');
  const orig = t;
  for (const name of logos) {
    const ext = path.extname(name);
    const stem = name.slice(0, -ext.length);
    const stem512 = stem + '-512';
    let idx = 0;
    let result = '';
    while (true) {
      const i = t.indexOf(name, idx);
      if (i < 0) {
        result += t.slice(idx);
        break;
      }
      const before = t.slice(Math.max(0, i - 5), i);
      if (before.endsWith('-512')) {
        result += t.slice(idx, i + name.length);
        idx = i + name.length;
        continue;
      }
      result += t.slice(idx, i) + stem512 + ext;
      idx = i + name.length;
    }
    t = result;
  }
  if (t !== orig) {
    fs.writeFileSync(f, t);
    changed++;
    console.log('UPDATED', f);
  }
}
console.log('FILES_CHANGED', changed);

const re = /\/pautas\/[^"'\s)]+-512\.(?:webp|jpg|png)/g;
let miss = 0;
let ok = 0;
for (const f of walk('public').concat(walk('src'))) {
  const t = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(t))) {
    const disk = path.join('public', decodeURI(m[0].replace(/^\//, '')));
    if (fs.existsSync(disk)) ok++;
    else {
      miss++;
      console.log('MISSING', m[0], 'in', f);
    }
  }
}
console.log('REFS_512_OK', ok, 'MISSING', miss);
