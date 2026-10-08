const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'landing', 'cafe-premium-salento', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const D = '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/';
const O = '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/';
const R = '/pautas/el_recuerdo_coffee_tour/imagenes/';

const WA_DE = '573156061113';
const WA_OC = '573134253669';
const WA_RE = '573103764672';

const products = [
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Tradicional (molido o grano)', desc: 'El café de siempre de la finca, disponible molido o en grano. Ideal para el día a día.', price: '$40.000', unit: 'Bolsa', img: D + '658126044_18063985268670095_3075015024937128905_n.webp', alt: 'Café Tradicional de Finca Don Elías en Salento', wa: WA_DE, text: 'Caf%C3%A9%20Tradicional%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'El Ocaso', cls: 'tag-ocaso', name: 'Café Salento 250 g', desc: 'Tostado en la finca hotel El Ocaso. Consulta disponibilidad antes de pedir.', price: '$28.000', unit: '250 g', img: O + '494003217_1143514637789918_206663534016497371_n.webp', alt: 'Café tostado en Finca El Ocaso, Salento', wa: WA_OC, text: 'café%20Salento%20250%20g%20de%20El%20Ocaso', cta: 'Consultar' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Grano Premium', desc: 'Grano entero de especialidad, tostado en la finca. Recomendado para moler en casa.', price: '$50.000', unit: 'Bolsa', img: D + 'cafe-don-elias.webp', alt: 'Café Grano Premium de Finca Don Elías en Salento', wa: WA_DE, text: 'Caf%C3%A9%20Grano%20Premium%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'El Recuerdo', cls: 'tag-recuerdo', name: 'Café de la finca El Recuerdo', desc: 'Grano o molido de finca familiar en la Vereda Palestina. Solo en la finca: precio y disponibilidad por WhatsApp.', price: 'Consultar', unit: 'Solo en finca', img: R + 'recuerdocafetal1.webp', alt: 'Cafetal de El Recuerdo Coffee Tour en Salento', wa: WA_RE, text: 'disponibilidad%20del%20café%20de%20El%20Recuerdo', cta: 'Consultar' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Molido Premium', desc: 'Molienda fina de especialidad lista para preparar. Frescura de finca.', price: '$50.000', unit: 'Bolsa', img: D + '724493520_18074799854670095_3547519742275705982_n.webp', alt: 'Café Molido Premium de Finca Don Elías en Salento', wa: WA_DE, text: 'Caf%C3%A9%20Molido%20Premium%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'El Ocaso', cls: 'tag-ocaso', name: 'Café Salento 500 g', desc: 'Tostado en la finca hotel El Ocaso. Consulta disponibilidad antes de pedir.', price: '$47.000', unit: '500 g', img: O + '70745761_1531879180294837_6850314778028539904_n.webp', alt: 'Café Salento 500 g de Finca El Ocaso', wa: WA_OC, text: 'café%20Salento%20500%20g%20de%20El%20Ocaso', cta: 'Consultar' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Taza Colombia', desc: 'Presentación económica para llevar el sabor de Salento en tu taza.', price: '$18.000', unit: 'Bolsa', img: D + '692728292_18069951644670095_2829106976592801887_n.webp', alt: 'Taza Colombia de Finca Don Elías en Salento', wa: WA_DE, text: 'Taza%20Colombia%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'El Ocaso', cls: 'tag-ocaso', name: 'Colección especial (8 × 100 g)', desc: 'Ocho cafés especiales de la finca en bolsas de 100 g. Edición especial, consulta disponibilidad.', price: '$180.000', unit: '8 × 100 g', img: O + '481534166_4078810902268306_2545503502227403231_n.webp', alt: 'Colección de cafés especiales de Finca El Ocaso, Salento', wa: WA_OC, text: 'colección%20de%20cafés%20de%20El%20Ocaso', cta: 'Consultar' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Honey (pre-orden)', desc: 'Proceso honey: dulzor y cuerpo. Se pide con anticipación.', price: '$43.000', unit: 'Pre-orden', img: D + '658126044_18063985268670095_3075015024937128905_n.webp', alt: 'Café Honey de Finca Don Elías en Salento', wa: WA_DE, text: 'pre-ordenar%20Caf%C3%A9%20Honey%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'El Ocaso', cls: 'tag-ocaso', name: 'Bourbon Rosado Honey Lactic 125 g', desc: 'Micro-lote de la finca hotel El Ocaso. Consulta disponibilidad.', price: '$40.000', unit: '125 g', img: O + '70767370_1531879373628151_6694873185667514368_n.webp', alt: 'Café Bourbon Rosado de Finca El Ocaso, Salento', wa: WA_OC, text: 'Bourbon%20Rosado%20de%20El%20Ocaso', cta: 'Consultar' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Honey Premium (pre-orden)', desc: 'Selección premium del proceso honey. Cosecha limitada.', price: '$52.500', unit: 'Pre-orden', img: D + 'cafe-don-elias.webp', alt: 'Café Honey Premium de Finca Don Elías en Salento', wa: WA_DE, text: 'pre-ordenar%20Caf%C3%A9%20Honey%20Premium%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Natural (pre-orden)', desc: 'Proceso natural: fruta y aroma intensos. Se pide con anticipación.', price: '$64.000', unit: 'Pre-orden', img: D + '692728292_18069951644670095_2829106976592801887_n.webp', alt: 'Café Natural de Finca Don Elías en Salento', wa: WA_DE, text: 'pre-ordenar%20Caf%C3%A9%20Natural%20de%20Don%20El%C3%ADas', cta: 'Pedir' },
  { brand: 'Don Elías', cls: 'tag-don-elias', name: 'Café Natural Premium (pre-orden)', desc: 'La selección premium del proceso natural de la finca.', price: '$75.000', unit: 'Pre-orden', img: D + '681426934_18068473622670095_8170870217327481165_n.webp', alt: 'Café Natural Premium de Finca Don Elías en Salento', wa: WA_DE, text: 'pre-ordenar%20Caf%C3%A9%20Natural%20Premium%20de%20Don%20El%C3%ADas', cta: 'Pedir' }
];

function card(p) {
  return `          <article class="menu-card">
            <img class="menu-card-img" src="${p.img}" alt="${p.alt}" loading="lazy" width="640" height="400" />
            <div class="menu-card-body">
              <span class="cat-tag ${p.cls}">${p.brand}</span>
              <h3>${p.name}</h3>
              <p class="desc">${p.desc}</p>
              <div class="footer">
                <span class="price">${p.price}<small>${p.unit}</small></span>
                <a class="button primary" href="https://wa.me/${p.wa}?text=Hola%2C%20quiero%20pedir%20${p.text}" target="_blank" rel="noreferrer">${p.cta}</a>
              </div>
            </div>
          </article>`;
}

const section = `      <section class="section">
        <h2>Catálogo de Café de Salento — Todas las Fincas</h2>
        <p class="muted" style="margin-top:-8px;margin-bottom:20px">Todas las fincas de Salento que venden café, en un solo catálogo: Don Elías, El Ocaso y El Recuerdo. Precios oficiales donde la finca los publica; con El Recuerdo se coordina en la finca. Pedido directo por WhatsApp, sin intermediarios.</p>
        <div class="menu-grid catalogo-grid">
${products.map(card).join('\n')}
        </div>
        <p class="verified" style="margin-top:16px">✓ Datos verificados en sitios oficiales de cada finca · sin intermediarios ni comisiones</p>
      </section>

`;

const startRe = /      <section class="section">\s*<h2>Café de Finca Don Elías — Catálogo Oficial<\/h2>[\s\S]*?(?=      <section class="section">\s*<h2>Cómo Pedir<\/h2>)/;
if (!startRe.test(html)) { console.error('Bloque de catálogo no encontrado'); process.exit(1); }
html = html.replace(startRe, section);

const brandOf = (b) => (b === 'Don Elías' ? 'Finca Cafetera Don Elías' : b === 'El Ocaso' ? 'Finca Hotel El Ocaso' : 'El Recuerdo Coffee Tour');
const items = products.map((p, i) => {
  const offer = p.price.startsWith('$')
    ? `,"offers":{"@type":"Offer","price":"${p.price.replace(/[$.]/g, '')}","priceCurrency":"COP","availability":"https://schema.org/${p.unit === 'Pre-orden' ? 'PreOrder' : 'InStock'}"}`
    : '';
  return `{"@type":"ListItem","position":${i + 1},"item":{"@type":"Product","name":"${p.name}","brand":{"@type":"Brand","name":"${brandOf(p.brand)}"}${offer}}}`;
}).join(',');

const ldRe = /<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org","@type":"ItemList"[\s\S]*?<\/script>/;
if (!ldRe.test(html)) { console.error('JSON-LD ItemList no encontrado'); process.exit(1); }
html = html.replace(ldRe, `<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"Café premium de Salento a la venta","itemListElement":[${items}]}</script>`);

JSON.stringify(html.length);
fs.writeFileSync(file, html, 'utf8');
console.log('Landing café reconstruida:', products.length, 'productos intercalados');
