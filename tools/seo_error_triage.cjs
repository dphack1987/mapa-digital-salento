const fs = require('fs');
const path = require('path');

const audit = JSON.parse(fs.readFileSync('tools/seo_technical_audit.json', 'utf8'));
const issues = audit.issues || [];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function isRedirectHtml(t) {
  return /http-equiv=["']?refresh/i.test(t) || /location\.replace\s*\(/.test(t);
}

function hasNoindex(t) {
  return /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(t);
}

function getCanon(t) {
  const m =
    t.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    t.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1] : '';
}

console.log('=== MISSING TITLE pages ===');
const missingTitle = issues.filter(i => i.code === 'missing-title');
for (const i of missingTitle) {
  const t = fs.readFileSync(i.path, 'utf8');
  const redir = isRedirectHtml(t);
  const noix = hasNoindex(t);
  const canon = getCanon(t);
  const title = (t.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  console.log(`${redir ? 'REDIR' : 'CONTENT'} noindex=${noix} title="${title}" canon=${canon} | ${i.path}`);
}

console.log('\n=== NOINDEX classify ===');
const noindex = issues.filter(i => i.code === 'noindex');
let redirCount = 0;
const contentNoindex = [];
for (const i of noindex) {
  let t;
  try { t = fs.readFileSync(i.path, 'utf8'); } catch { contentNoindex.push(i.path + ' UNREADABLE'); continue; }
  if (isRedirectHtml(t)) redirCount++;
  else contentNoindex.push(i.path);
}
console.log(`total noindex=${noindex.length} redirects=${redirCount} content=${contentNoindex.length}`);
contentNoindex.forEach(x => console.log('  CONTENT_NOINDEX', x));

console.log('\n=== ROOT index.html ===');
const root = fs.readFileSync('index.html', 'utf8');
const descM = root.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
  root.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i);
console.log('desc len:', descM ? descM[1].length : 'NONE');
if (descM) console.log('desc:', descM[1]);
console.log('title:', (root.match(/<title>([^<]*)<\/title>/i) || [])[1]);
console.log('static h1 count:', (root.match(/<h1[\s>]/gi) || []).length);
const h1m = root.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('static h1:', h1m ? h1m[1].slice(0, 140) : 'NONE');

console.log('\n=== SITEMAP vs indexable ===');
const sm = fs.readFileSync('public/sitemap.xml', 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const smPaths = new Set(locs.map(u => u.replace('https://www.salentoalamano.com', '')));
console.log('sitemap count:', locs.length);

const files = walk('public');
const missingFromSm = [];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  if (isRedirectHtml(t) || hasNoindex(t)) continue;
  let url = f.replace(/\\/g, '/').replace(/^public/, '');
  if (url.endsWith('/index.html')) url = url.slice(0, -'index.html'.length) || '/';
  const candidates = [url, url.replace(/\/$/, ''), url + '/', url.replace(/\.html$/, '/'), url.replace(/\.html$/, '')];
  const inSm = candidates.some(c => smPaths.has(c));
  if (!inSm) missingFromSm.push({ file: f, url, title: (t.match(/<title>([^<]*)<\/title>/i) || [])[1] || '' });
}
console.log('indexable files missing from sitemap:', missingFromSm.length);
missingFromSm.forEach(m => console.log('  MISSING_SM', m.url, '|', m.title.slice(0, 70)));

console.log('\n=== PLACEHOLDER PHONES in public HTML (content, not redirect) ===');
const phoneRe = /\+57\s?3\d{2}\s?0{3}\s?\d{4}|\+57300\d{7}|555-\d{4}|\+1\s\d{3}/;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  if (isRedirectHtml(t)) continue;
  const m = t.match(phoneRe);
  if (m) console.log('  PHONE', f, '->', m[0]);
}

console.log('\n=== 404 page ===');
const t404 = fs.readFileSync('public/404.html', 'utf8');
console.log('noindex:', hasNoindex(t404), 'canon:', getCanon(t404), 'title:', (t404.match(/<title>([^<]*)<\/title>/i) || [])[1]);

console.log('\n=== naver file ===');
const naver = fs.readFileSync('public/naver1820d4dce5511b63defe80c50a86ab77.html', 'utf8');
console.log(naver.slice(0, 400));
