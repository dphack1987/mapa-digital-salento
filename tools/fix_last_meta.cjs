const fs = require('fs');
const path = require('path');

const titleFixes = {
  'public/pautantes/iglesia-de-nuestra-senora-del-carmen-de-salento.html': 'Iglesia del Carmen de Salento | Salento a la Mano',
  'public/pautantes/terminal-de-transporte-de-salento-acceso-peatonal.html': 'Terminal de Transporte de Salento | Salento a la Mano',
};

for (const [f, title] of Object.entries(titleFixes)) {
  let t = fs.readFileSync(f, 'utf8');
  if (/<title[^>]*>[\s\S]*?<\/title>/i.test(t)) {
    t = t.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    fs.writeFileSync(f, t, 'utf8');
    console.log('fixed title', f, '->', title, title.length);
  }
}

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

function getDesc(t) {
  const m =
    t.match(/name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    t.match(/content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return m ? m[1] : '';
}

function getTitle(t) {
  const m = t.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : '';
}

let longT = 0;
let noDesc = 0;
for (const f of walk('public')) {
  const norm = f.replace(/\\/g, '/');
  if (norm.includes('google')) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (isRedirect(t)) continue;
  const title = getTitle(t);
  const desc = getDesc(t);
  if (title.length > 65) { longT++; console.log('LONG', title.length, norm, '|', title); }
  if (!desc) {
    noDesc++;
    console.log('NODESC', norm, '| title:', title);
    // add description from title if missing
    const base = title.split('|')[0].trim() || path.basename(f);
    const d = `${base} en Salento, Quindío. Información verificada y contacto directo.`.slice(0, 160);
    let nt = t;
    if (/name=["']description["']/.test(nt)) {
      nt = nt.replace(/name=["']description["'][^>]*content=["'][^"']*["']/i, `name="description" content="${d}"`);
    } else {
      nt = nt.replace(/<\/head>/i, `  <meta name="description" content="${d}" />\n  </head>`);
    }
    fs.writeFileSync(f, nt, 'utf8');
    console.log('  added desc:', d);
  }
}
console.log('after: long', longT, 'nodesc', noDesc);

// also check pautantes redirects titles (should have titles but can be long - optional)
for (const f of walk('public/pautantes')) {
  const t = fs.readFileSync(f, 'utf8');
  const title = getTitle(t);
  if (title.length > 65) console.log('REDIR LONG (ok-ish)', title.length, f.replace(/\\/g, '/'), '|', title);
}
