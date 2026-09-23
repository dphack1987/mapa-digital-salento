const fs = require('fs');
const path = require('path');

function walk(d, a = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, a);
    else a.push(p);
  }
  return a;
}

const missing512 = [];
const pages = fs.readdirSync('public/paginas-pautantes', { withFileTypes: true }).filter(e => e.isDirectory());
let thin = 0;
let broken = 0;
let logoHero = 0;

for (const d of pages) {
  const p = path.join('public/paginas-pautantes', d.name, 'index.html');
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  if (/noindex/i.test(t)) continue;

  const heroMatch = t.match(/\.hero-image\s*\{[^}]*url\((['"]?)([^)'"]+)\1\)/);
  if (heroMatch) {
    const u = heroMatch[2];
    if (/logo/i.test(u)) {
      logoHero++;
      console.log('LOGO_HERO', d.name, u);
    }
    let ok = false;
    if (u.startsWith('data:')) ok = true;
    else if (u.startsWith('/')) ok = fs.existsSync(path.join('public', decodeURI(u.slice(1))));
    else ok = fs.existsSync(path.join('public/paginas-pautantes', d.name, decodeURI(u)));
    if (!ok) {
      broken++;
      console.log('BROKEN_HERO', d.name, u);
    }
  } else {
    console.log('NO_HERO', d.name);
  }

  const gal = (t.match(/<div class="gallery">([\s\S]*?)<\/div>/) || [])[1] || '';
  const n = (gal.match(/<img /g) || []).length;
  if (n < 4) {
    thin++;
    console.log('THIN', d.name, n);
  }
}

for (const f of walk('public')) {
  if (!/\.(html|json|js|shims|webmanifest)$/i.test(f) && !f.endsWith('.html')) continue;
  let t;
  try { t = fs.readFileSync(f, 'utf8'); } catch { continue; }
  const re = /\/pautas\/[^"')\s]+-512\.webp/g;
  let m;
  while ((m = re.exec(t))) {
    const u = m[0];
    const d = path.join('public', decodeURI(u.slice(1)));
    if (!fs.existsSync(d)) missing512.push(u + ' <- ' + f);
  }
}

console.log('LOGO_HEROS', logoHero, 'BROKEN', broken, 'THIN', thin, 'MISSING_512', missing512.length);
missing512.slice(0, 30).forEach(x => console.log('  M512', x));

// Check no deleted: compare git for deletions
console.log('DONE');
