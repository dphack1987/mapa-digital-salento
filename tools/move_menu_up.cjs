// Mueve <section id="menu-interactivo"> (+ bloques cart-float/cart-modal) justo después del hero
// e inyecta CTA "Ver precios y reservar" en .actions del hero. Idempotente.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'paginas-pautantes');
const CTA = '<a class="button buy" href="#menu-interactivo">Ver precios y reservar</a>';

const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let moved = 0, ctas = 0, skipped = 0;

for (const slug of dirs) {
  const file = path.join(ROOT, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="menu-interactivo"')) continue;

  const orig = html;

  // 1) CTA en el hero (si falta)
  if (!html.includes('href="#menu-interactivo"')) {
    const heroStart = html.indexOf('<section class="hero">');
    if (heroStart !== -1) {
      const heroEnd = html.indexOf('</section>', heroStart);
      const hero = html.slice(heroStart, heroEnd);
      const actionsIdx = hero.indexOf('<div class="actions">');
      if (actionsIdx !== -1) {
        const insertAt = heroStart + actionsIdx + '<div class="actions">'.length;
        html = html.slice(0, insertAt) + CTA + html.slice(insertAt);
        ctas++;
      } else {
        console.warn('WARN', slug, 'sin .actions en hero');
      }
    } else {
      console.warn('WARN', slug, 'sin hero');
    }
  }

  // 2) Mover sección de menú + carrito justo después del hero (si no está ya)
  const menuIdIdx = html.indexOf('id="menu-interactivo"');
  const menuStart = html.lastIndexOf('<section', menuIdIdx);
  const heroStart2 = html.indexOf('<section class="hero">');
  const heroEnd2 = html.indexOf('</section>', heroStart2) + '</section>'.length;
  const firstSecAfterHero = html.indexOf('<section', heroEnd2);

  if (firstSecAfterHero !== menuStart) {
    // fin del bloque: siguiente <section> tras el menú (o fin de archivo)
    let blockEnd = html.indexOf('<section', menuStart + 10);
    if (blockEnd === -1) blockEnd = html.length;
    const block = html.slice(menuStart, blockEnd);
    const rest = html.slice(0, menuStart) + html.slice(blockEnd);
    // reinsertar tras hero (posiciones pueden haber cambiado solo si CTA se inyectó antes del hero — no aplica)
    const heroEnd3 = rest.indexOf('</section>', rest.indexOf('<section class="hero">')) + '</section>'.length;
    html = rest.slice(0, heroEnd3) + '\n      ' + block.trimEnd() + html.slice(heroEnd3);
    moved++;
  } else {
    skipped++;
  }

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('OK', slug);
  }
}

console.log(`\nMenús movidos: ${moved} · ya arriba: ${skipped} · CTAs inyectados: ${ctas}`);
