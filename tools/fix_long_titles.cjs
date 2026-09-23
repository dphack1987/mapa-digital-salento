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

function getTitle(t) {
  const m = t.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : '';
}

function setTitle(t, title) {
  return t.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
}

function getDesc(t) {
  const m =
    t.match(/name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    t.match(/content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return m ? m[1] : '';
}

function setDesc(t, desc) {
  if (/name=["']description["'][^>]*content=["'][^"']*["']/i.test(t)) {
    return t.replace(/name=["']description["'][^>]*content=["'][^"']*["']/i, `name="description" content="${desc}"`);
  }
  if (/content=["'][^"']*["'][^>]*name=["']description["']/i.test(t)) {
    return t.replace(/content=["'][^"']*["'][^>]*name=["']description["']/i, `content="${desc}" name="description"`);
  }
  return t;
}

// Short titles keyed by file path fragment (relative, forward slashes)
const titleFixes = [
  ['hotel-barato-salento.html', 'Hoteles baratos en Salento | Salento a la Mano'],
  ['paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia', 'Hotel El Mirador de Boquía | Salento a la Mano'],
  ['paginas-pautantes/reserva-natural-cascadas-de-santa-rita', 'Cascadas de Santa Rita | Salento a la Mano'],
  ['paginas-pautantes/oficina-de-informacion-turistica-de-salento', 'Oficina de Turismo de Salento | Salento a la Mano'],
  ['paginas-pautantes/sendero-de-las-palmas-entrada-libre-valle', 'Sendero de las Palmas | Salento a la Mano'],
  ['terminal-de-transporte-de-salento-acceso-peatonal', 'Terminal de Transporte de Salento | Salento a la Mano'],
  ['paginas-pautantes/terminal-de-transporte-de-salento-acceso-peatonal', 'Terminal de Transporte de Salento | Salento a la Mano'],
  ['iglesia-de-nuestra-senora-del-carmen-de-salento', 'Iglesia del Carmen de Salento | Salento a la Mano'],
  ['paginas-pautantes/iglesia-de-nuestra-senora-del-carmen-de-salento', 'Iglesia del Carmen de Salento | Salento a la Mano'],
  ['paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre', 'Valle de Cocora entrada libre | Salento a la Mano'],
  ['como-llegar-valle-cocora-sin-tour.html', 'Cómo llegar al Valle de Cocora sin tour | Salento'],
  ['experiencia-salento-llegada-a-salida.html', 'Experiencia Salento de llegada a salida | Salento'],
  ['mejores-coffee-tours-salento.html', 'Mejores coffee tours en Salento | Salento a la Mano'],
  ['conservacion-salento.html', 'Conservación en Salento | Salento a la Mano'],
];

// Short descriptions for missing-desc / long-desc content pages
const descFixes = [
  ['fr/guias/como-llegar-valle-cocora-sin-tour.html', "Comment se rendre à la Vallée de Cocora sans tour : transport, tarifs et conseils pratiques pour Salento."],
];

const files = walk('public');
let titleFixed = 0;
let descFixed = 0;

for (const f of files) {
  const norm = f.replace(/\\/g, '/');
  if (norm.startsWith('public/google')) continue;
  let t = fs.readFileSync(f, 'utf8');
  if (isRedirect(t)) continue;
  const orig = t;
  const title = getTitle(t);
  const desc = getDesc(t);

  if (title.length > 65) {
    for (const [frag, short] of titleFixes) {
      if (norm.includes(frag)) {
        t = setTitle(t, short);
        console.log('title', title.length, '->', short.length, '|', norm);
        titleFixed++;
        break;
      }
    }
  }

  if (!desc) {
    // add a sensible short description from title
    const base = path.basename(f).replace(/\.html$/, '').replace(/-/g, ' ');
    const fallback = `${title.split('|')[0].trim()} en Salento, Quindío. Información, fotos y contacto directo.`;
    if (/name=["']description["']/i.test(t) || /<\/head>/i.test(t)) {
      if (/name=["']description["']/.test(t)) {
        t = setDesc(t, fallback.slice(0, 160));
      } else {
        t = t.replace(/<\/head>/i, `  <meta name="description" content="${fallback.slice(0, 160)}" />\n  </head>`);
      }
      console.log('added desc |', norm);
      descFixed++;
    }
  } else if (desc.length > 170) {
    for (const [frag, short] of descFixes) {
      if (norm.includes(frag)) {
        t = setDesc(t, short);
        console.log('desc', desc.length, '->', short.length, '|', norm);
        descFixed++;
        break;
      }
    }
    // generic trim: cut at last sentence boundary under 165
    if (t === orig && desc.length > 170) {
      let cut = desc.slice(0, 165);
      const lastDot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
      if (lastDot > 80) cut = cut.slice(0, lastDot + 1);
      else cut = cut.replace(/\s+\S*$/, '') + '.';
      t = setDesc(t, cut);
      console.log('trimmed desc', desc.length, '->', cut.length, '|', norm);
      descFixed++;
    }
  }

  if (t !== orig) {
    fs.writeFileSync(f, t, 'utf8');
  }
}

console.log('titles fixed', titleFixed, 'descs fixed', descFixed);

// report remaining
let stillLong = 0;
let stillNoDesc = 0;
for (const f of files) {
  const norm = f.replace(/\\/g, '/');
  if (norm.startsWith('public/google')) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (isRedirect(t)) continue;
  const title = getTitle(t);
  const desc = getDesc(t);
  if (title.length > 65) { stillLong++; console.log('STILL LONG', title.length, norm, '|', title); }
  if (!desc) { stillNoDesc++; console.log('STILL NO DESC', norm); }
}
console.log('remaining long titles', stillLong, 'missing desc', stillNoDesc);
