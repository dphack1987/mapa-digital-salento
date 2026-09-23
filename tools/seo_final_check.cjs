const fs = require('fs');

// Revert google verification file to plain token (required by Google)
const g = 'public/googleac76b27847921d06.html';
const plain = 'google-site-verification: googleac76b27847921d06.html\n';
if (fs.existsSync(g)) {
  const cur = fs.readFileSync(g, 'utf8');
  if (cur.trim() !== plain.trim()) {
    fs.writeFileSync(g, plain, 'utf8');
    console.log('reverted google verification file to plain token');
  } else {
    console.log('google verification file already plain token');
  }
}

// Final checks
const root = fs.readFileSync('index.html', 'utf8');
const dm = root.match(/name="description" content="([^"]+)"/);
console.log('home desc len:', dm ? dm[1].length : 'NONE');
console.log('naver real:', root.includes('932c1bd7459fb55347b5f347de3831588dfc7c4c'));
console.log('naver placeholder gone:', !root.includes('NAVER_VERIFICATION_CODE'));
console.log('home phone placeholder gone:', !root.includes('+57 300 1234567'));

const es = fs.readFileSync('public/es/index.html', 'utf8');
console.log('es canonical->root:', es.includes('rel="canonical" href="https://www.salentoalamano.com/"'));
console.log('es es-CO->root:', es.includes('hreflang="es-CO" href="https://www.salentoalamano.com/"'));
console.log('es x-default->root:', es.includes('hreflang="x-default" href="https://www.salentoalamano.com/"'));

const dist = fs.readFileSync('dist/index.html', 'utf8');
console.log('dist h1:', (dist.match(/<h1/gi) || []).length);
console.log('dist naver:', dist.includes('932c1bd7459fb55347b5f347de3831588dfc7c4c'));
console.log('dist placeholder phone:', /573001234567|57 300 1234567/.test(dist));

// Count remaining real missing titles (exclude google verification token files)
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
let miss = 0;
for (const f of walk('public')) {
  const base = f.split('/').pop();
  if (base.startsWith('google') && base.endsWith('.html')) continue; // verification token
  const t = fs.readFileSync(f, 'utf8');
  if (!/<title[^>]*>[^<]+<\/title>/i.test(t)) {
    console.log('no title:', f);
    miss++;
  }
}
console.log('missing titles (excl google token):', miss);

// noindex content pages excluding 404 and naver and google
let contentNoindex = 0;
for (const f of walk('public')) {
  const t = fs.readFileSync(f, 'utf8');
  const redir = /http-equiv=["']?refresh/i.test(t) || /location\.replace\s*\(/.test(t);
  const noix = /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(t);
  if (noix && !redir && !f.includes('404') && !f.includes('naver') && !f.split('/').pop().startsWith('google')) {
    console.log('unexpected content noindex:', f);
    contentNoindex++;
  }
}
console.log('unexpected content noindex count:', contentNoindex);
