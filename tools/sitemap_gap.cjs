const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function isRedirect(t) {
  return /http-equiv=["']?refresh/i.test(t) || /location\.replace\s*\(/.test(t);
}

function hasNoindex(t) {
  return /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(t);
}

const sm = fs.readFileSync('public/sitemap.xml', 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const smSet = new Set(locs.map(u => u.replace('https://www.salentoalamano.com', '')));

const files = walk('public');
const candidates = [];
for (const f of files) {
  const norm = f.replace(/\\/g, '/');
  if (norm.startsWith('public/google')) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (isRedirect(t) || hasNoindex(t)) continue;
  let url = norm.replace(/^public/, '');
  if (url.endsWith('/index.html')) url = url.slice(0, -'index.html'.length) || '/';
  const alts = [url, url.replace(/\/$/, ''), url + '/', url.replace(/\.html$/, '/'), url.replace(/\.html$/, '')];
  const inSm = alts.some(a => smSet.has(a));
  if (!inSm) candidates.push({ file: norm, url });
}

console.log('sitemap count:', locs.length);
console.log('indexable not in sitemap:', candidates.length);
candidates.forEach(c => console.log('  ', c.url));
