const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('public/paginas-pautantes', { withFileTypes: true }).filter(e => e.isDirectory());
const results = [];

for (const d of dirs) {
  const p = path.join('public/paginas-pautantes', d.name, 'index.html');
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  const noindex = /noindex/i.test(t);

  const heroMatch = t.match(/\.hero-image\s*\{[^}]*url\((['"]?)([^)'"]+)\1\)/);
  const heroUrl = heroMatch ? heroMatch[2] : null;
  let heroOk = false;
  let heroExists = false;
  if (heroUrl) {
    if (heroUrl.startsWith('data:')) {
      heroOk = true;
      heroExists = true;
    } else if (heroUrl.startsWith('/')) {
      const disk = path.join('public', decodeURI(heroUrl.slice(1)));
      heroExists = fs.existsSync(disk);
      heroOk = heroExists;
    } else {
      const disk = path.join('public/paginas-pautantes', d.name, decodeURI(heroUrl));
      heroExists = fs.existsSync(disk);
      heroOk = heroExists;
    }
  }

  const galBlock = (t.match(/<div class="gallery">([\s\S]*?)<\/div>/) || [])[1] || '';
  const galleryCount = (galBlock.match(/<img /g) || []).length;
  const hasGallery = t.includes('class="gallery"');

  results.push({ dir: d.name, noindex, heroUrl, heroOk, heroExists, galleryCount, hasGallery });
}

console.log('LIVE hero missing/broken:');
for (const r of results.filter(r => !r.noindex && (!r.heroUrl || !r.heroOk))) {
  console.log(JSON.stringify(r));
}

console.log('--- LIVE gallery < 4:');
for (const r of results.filter(r => !r.noindex && r.galleryCount < 4)) {
  console.log(r.dir, 'gallery=' + r.galleryCount, 'hasGallery=' + r.hasGallery, 'hero=' + r.heroUrl);
}

console.log('TOTAL', results.length, 'live', results.filter(r => !r.noindex).length, 'stubs', results.filter(r => r.noindex).length);

// count photos available per pautas folder
const pautasRoot = 'public/pautas';
if (fs.existsSync(pautasRoot)) {
  for (const e of fs.readdirSync(pautasRoot, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const imgDir = path.join(pautasRoot, e.name, 'imagenes');
    if (!fs.existsSync(imgDir)) continue;
    const n = fs.readdirSync(imgDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f) && !/logo/i.test(f)).length;
    if (n > 0) console.log('PAUTA_IMGS', e.name, n);
  }
}
