const fs = require('fs');

// es/index.html hreflang: es-CO and x-default -> root (match index.html)
let es = fs.readFileSync('public/es/index.html', 'utf8');
const before = es;
es = es.replace(
  'href="https://www.salentoalamano.com/es/"><link rel="alternate" hreflang="es-CO" href="https://www.salentoalamano.com/es/" />',
  'href="https://www.salentoalamano.com/"><link rel="alternate" hreflang="es-CO" href="https://www.salentoalamano.com/" />'
);
es = es.replace(
  'hreflang="x-default" href="https://www.salentoalamano.com/es/">',
  'hreflang="x-default" href="https://www.salentoalamano.com/">'
);
if (es !== before) {
  fs.writeFileSync('public/es/index.html', es, 'utf8');
  console.log('es/index.html hreflang fixed');
} else {
  console.log('es/index.html no change needed or pattern miss');
}

// google verification file: add title + canonical so audit is clean
const g = 'public/googleac76b27847921d06.html';
if (fs.existsSync(g)) {
  let gt = fs.readFileSync(g, 'utf8');
  if (!/<title/i.test(gt)) {
    if (/<head[^>]*>/i.test(gt)) {
      gt = gt.replace(/<head[^>]*>/i, (m) => m + '\n<title>Google Site Verification</title>');
    } else {
      gt = gt.replace(/<html[^>]*>/i, (m) => m + '\n<head><title>Google Site Verification</title></head>');
    }
    fs.writeFileSync(g, gt, 'utf8');
    console.log('google verification title added');
  }
}

// Find placeholder hit in index.html
const idx = fs.readFileSync('index.html', 'utf8');
const phoneRe = /\+57[\s-]?300[\s-]?123[\s-]?4567|\+573001234567|\+573009876543|NAVER_VERIFICATION_CODE|555-\d{4}/;
const m = idx.match(phoneRe);
console.log('index.html placeholder match:', m && m[0]);
if (m) {
  const i = idx.indexOf(m[0]);
  console.log('context:', JSON.stringify(idx.slice(Math.max(0, i - 80), i + 80)));
}
