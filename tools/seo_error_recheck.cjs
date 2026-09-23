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

function getCanon(t) {
  const m =
    t.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    t.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1] : '';
}

function getTitle(t) {
  const m = t.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

function getDesc(t) {
  const m =
    t.match(/name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    t.match(/content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return m ? m[1] : '';
}

const files = walk('public');
const errors = [];
const warnings = [];

for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const redir = isRedirect(t);
  const noix = hasNoindex(t);
  const title = getTitle(t);
  const desc = getDesc(t);
  const canon = getCanon(t);
  const h1 = (t.match(/<h1\b/gi) || []).length;

  // Mirror audit rules but treat redirects intentionally
  if (!title) errors.push(['missing-title', f]);
  else if (title.length > 65) warnings.push(['long-title:' + title.length, f]);
  if (!desc && !redir) warnings.push(['missing-desc', f]);
  else if (desc.length > 170) warnings.push(['long-desc:' + desc.length, f]);
  if (!canon && !redir && !noix) errors.push(['missing-canonical', f]);
  if (noix && !redir && f !== 'public/404.html' && !f.includes('naver')) {
    errors.push(['content-noindex', f]);
  }
  if (h1 !== 1 && !redir && !noix) warnings.push(['h1:' + h1, f]);
}

// root index.html special (react shell skips h1)
const root = fs.readFileSync('index.html', 'utf8');
const rootDesc = getDesc(root);
const rootTitle = getTitle(root);
if (!rootTitle) errors.push(['missing-title', 'index.html']);
else if (rootTitle.length > 65) warnings.push(['long-title:' + rootTitle.length, 'index.html']);
if (rootDesc.length > 170) warnings.push(['long-desc:' + rootDesc.length, 'index.html']);
if (!getCanon(root)) errors.push(['missing-canonical', 'index.html']);

// group
function group(list) {
  const g = {};
  for (const [k, f] of list) g[k] = (g[k] || []).concat([f]);
  return g;
}

console.log('=== REMAINING ERRORS ===');
const ge = group(errors);
for (const [k, files] of Object.entries(ge).sort((a, b) => b[1].length - a[1].length)) {
  console.log(k, files.length);
  files.slice(0, 5).forEach(f => console.log('  ', f));
}
console.log('total errors', errors.length);

console.log('\n=== WARNINGS (non-redirect) ===');
const gw = group(warnings);
for (const [k, files] of Object.entries(gw).sort((a, b) => b[1].length - a[1].length)) {
  console.log(k, files.length);
  if (k.startsWith('long-') || k.startsWith('h1:')) files.slice(0, 8).forEach(f => console.log('  ', f));
}
console.log('total warnings', warnings.length);

// placeholders remaining
console.log('\n=== PLACEHOLDER CHECK ===');
const phoneRe = /\+57[\s-]?300[\s-]?123[\s-]?4567|\+573001234567|\+573009876543|NAVER_VERIFICATION_CODE|555-\d{4}/;
for (const f of walk('public').concat(['index.html', 'src/App.tsx', 'src/services/seoLandingService.ts', 'src/services/horsebackRidingService.ts'])) {
  if (!fs.existsSync(f)) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (phoneRe.test(t)) console.log('HIT', f);
}
console.log('done');
