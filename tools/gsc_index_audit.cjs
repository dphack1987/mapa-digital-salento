const fs = require('fs');
const path = require('path');

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function resolveHref(href) {
  if (!href) return null;
  if (/^(https?:|mailto:|tel:|javascript:|#|data:)/i.test(href)) return null;
  let p = href.split('?')[0].split('#')[0];
  if (!p) return null;
  if (p.startsWith('/')) p = p.slice(1);
  else return null;
  if (!p || p === '/' ) p = 'index';
  const cands = [
    path.join('public', p + '.html'),
    path.join('public', p, 'index.html'),
    path.join('public', p),
    // Vite root shell lives at project root, not public/
    path.join(p + '.html'),
    path.join(p, 'index.html'),
    path.join(p),
  ];
  for (const c of cands) {
    try {
      if (fs.statSync(c).isFile()) return null;
    } catch (_) {}
  }
  return p;
}

const files = walk('public');
const noindex = [];
const canonicalMap = new Map();
const broken = new Map();

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const isRedirect = /http-equiv=["']refresh["']|location\.replace/.test(h);
  // Prefer robots meta content=noindex; also catch legacy name=noindex
  const robotsMeta =
    h.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    h.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i) ||
    h.match(/<meta[^>]+name=["']noindex["'][^>]*>/i);
  const robotsContent = robotsMeta && robotsMeta[1] ? robotsMeta[1] : '';
  const isNoindex =
    /(^|[,;\s])noindex([,;\s]|$)/i.test(robotsContent) ||
    /name=["']noindex["']/i.test(h);
  if (isNoindex) {
    noindex.push({ f, isRedirect, robotsContent: robotsContent || '(name=noindex)' });
  }
  const cm =
    h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    h.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (cm) {
    const c = cm[1];
    if (!canonicalMap.has(c)) canonicalMap.set(c, []);
    canonicalMap.get(c).push({ f, isRedirect });
  }
  for (const m of h.matchAll(/href=["']([^"']+)["']/g)) {
    const r = resolveHref(m[1]);
    if (r) {
      if (!broken.has(r)) broken.set(r, new Set());
      broken.get(r).add(f);
    }
  }
}

console.log('=== NOINDEX ===');
console.log('total', noindex.length);
const nonRedirect = noindex.filter((x) => !x.isRedirect);
const redirects = noindex.filter((x) => x.isRedirect);
console.log('redirects (OK)', redirects.length);
console.log('non-redirect', nonRedirect.length);
nonRedirect.forEach((x) => console.log('  ', x.f, '|', x.robotsContent));

console.log('\n=== CANONICAL SHARED BY >1 ===');
for (const [c, list] of canonicalMap) {
  if (list.length > 1) {
    console.log(c, '<=');
    list.forEach((x) => console.log('   ', x.f, x.isRedirect ? '[redirect]' : '[page]'));
  }
}

// .html vs extensionless self-canonical mismatch
console.log('\n=== SELF-CANONICAL .html vs extensionless ===');
let canonMismatch = 0;
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const cm =
    h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    h.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (!cm) continue;
  const c = cm[1].replace('https://www.salentoalamano.com', '');
  const isRedir = /http-equiv=["']refresh["']|location\.replace/.test(h);
  if (isRedir) continue;
  // page path relative to public/
  const rel = f
    .replace(/^public[\\/]/, '')
    .replace(/\\/g, '/')
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '/');
  const normCanon = c.startsWith('/') ? c : '/' + c;
  const normPage = rel.startsWith('/') ? rel : '/' + rel;
  const a = normCanon.replace(/\.html$/, '/').replace(/\/+$/, '/');
  const b = normPage.replace(/\/+$/, '/');
  if (a !== b) {
    canonMismatch++;
    console.log('  MISMATCH', f, '=> canonical', c, '| page path', normPage);
  }
}
console.log('self-canonical mismatches', canonMismatch);

console.log('\n=== BROKEN INTERNAL LINKS ===');
console.log('count', broken.size);
for (const [k, v] of broken) {
  console.log(' ', k, '<=', [...v].slice(0, 3).join(' | '));
}

// sitemap noindex
const sm = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace('https://www.salentoalamano.com', '').replace(/^\/+|\/+$/g, '')
);
console.log('\n=== SITEMAP ===');
console.log('urls', urls.length);
let smNoindex = 0;
let smMissing = 0;
for (const u of urls) {
  const p = u || 'index';
  const cands = [
    path.join('public', p + '.html'),
    path.join('public', p, 'index.html'),
    path.join('public', p),
    path.join(p + '.html'),
    path.join(p, 'index.html'),
  ];
  let found = null;
  for (const c of cands) {
    try {
      if (fs.statSync(c).isFile()) {
        found = c;
        break;
      }
    } catch (_) {}
  }
  if (!found) {
    if (u !== '') {
      smMissing++;
      console.log('  MISSING', u || '(home)');
    }
    continue;
  }
  const h = fs.readFileSync(found, 'utf8');
  const smRobots =
    h.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    h.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i);
  const smContent = smRobots && smRobots[1] ? smRobots[1] : '';
  if (/(^|[,;\s])noindex([,;\s]|$)/i.test(smContent) || /name=["']noindex["']/i.test(h)) {
    smNoindex++;
    console.log('  NOINDEX IN SM', u, '|', smContent || '(name=noindex)');
  }
}
console.log('sitemap noindex', smNoindex, 'missing', smMissing);

// robots.txt Allow vs HTML noindex conflict
const robotsTxt = fs.readFileSync('public/robots.txt', 'utf8');
const allows = [...robotsTxt.matchAll(/^Allow:\s*(\/\S*)\s*$/gmi)].map((m) => m[1]);
console.log('\n=== ROBOTS.TXT Allow vs META NOINDEX ===');
for (const a of allows) {
  if (a === '/' || a.startsWith('/data') || a.startsWith('/categorias')) continue;
  const rel = a.replace(/^\//, '').replace(/\/$/, '');
  const cands = [
    path.join('public', rel + '.html'),
    path.join('public', rel, 'index.html'),
    path.join('public', rel),
    path.join(rel + '.html'),
    path.join(rel, 'index.html'),
  ];
  let found = null;
  for (const c of cands) {
    try {
      if (fs.statSync(c).isFile()) { found = c; break; }
    } catch (_) {}
  }
  if (!found) {
    console.log('  ALLOW-MISSING', a, '(robots allows path that has no file)');
    continue;
  }
  const h = fs.readFileSync(found, 'utf8');
  const rm =
    h.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    h.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i);
  const rc = rm && rm[1] ? rm[1] : '';
  const noidx = /(^|[,;\s])noindex([,;\s]|$)/i.test(rc) || /name=["']noindex["']/i.test(h);
  const isRedir = /http-equiv=["']refresh["']|location\.replace/.test(h);
  if (noidx) {
    console.log('  CONFLICT Allow+' + (isRedir ? 'redirect ' : '') + 'noindex:', a, '=>', found, '|', rc || '(name=noindex)');
  } else {
    console.log('  allow-indexable OK:', a, '=>', found);
  }
}
