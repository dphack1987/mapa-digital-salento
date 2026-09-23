const fs = require('fs');
const path = require('path');

const audit = JSON.parse(fs.readFileSync('tools/seo_technical_audit.json', 'utf8'));
const missingTitle = (audit.issues || []).filter(i => i.code === 'missing-title');

function slugTitle(filePath, canon) {
  if (canon) {
    try {
      const u = new URL(canon);
      let p = u.pathname.replace(/\/$/, '');
      const base = path.posix.basename(p);
      if (base && base !== 'index') {
        const name = base.replace(/\.html$/, '').replace(/-/g, ' ').trim();
        return name.replace(/\b\w/g, c => c.toUpperCase());
      }
      if (p === '' || p === '/') return 'Salento a la Mano';
    } catch (_) {}
  }
  const base = path.basename(filePath).replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return base.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getCanon(t) {
  const m =
    t.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    t.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1] : '';
}

let fixed = 0;
for (const issue of missingTitle) {
  const file = issue.path;
  let t = fs.readFileSync(file, 'utf8');
  if (/<title>[\s\S]*?<\/title>/i.test(t)) {
    console.log('SKIP already has title', file);
    continue;
  }
  const canon = getCanon(t);
  const title = `${slugTitle(file, canon)} | Salento a la Mano`;
  // insert after charset/viewport or after <head>
  if (/<\/head>/i.test(t)) {
    t = t.replace(/<\/head>/i, `  <title>${title}</title>\n  </head>`);
    fs.writeFileSync(file, t, 'utf8');
    fixed++;
    console.log('FIXED', file, '->', title);
  } else {
    console.log('NO HEAD', file);
  }
}
console.log('total fixed', fixed);

// 404 canonical
const f404 = 'public/404.html';
let t404 = fs.readFileSync(f404, 'utf8');
if (!/rel=["']canonical["']/i.test(t404)) {
  t404 = t404.replace(
    /(<meta name="robots"[^>]*\/>)/i,
    '$1\n    <link rel="canonical" href="https://www.salentoalamano.com/" />'
  );
  fs.writeFileSync(f404, t404, 'utf8');
  console.log('FIXED 404 canonical');
}
