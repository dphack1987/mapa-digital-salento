const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'public', 'paginas-pautantes');

const LOGOS = {
  'cabalgatas-cocora-magica': '/pautas/cabalgatas_cocora_magica/imagenes/logo-cocora-magica.webp',
  'calle-real-de-salento': '/imagenes-salento/calle.webp',
  'caminata-ecologica-calle-real-alto-de-la-cruz': '/imagenes-salento/destinos-75.webp',
  'camping-cascadas-santa-rita': '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.webp',
  'coffee-tour-alojamiento-finca-hotel-el-ocaso': '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso.webp',
  'coffee-tour-finca-cafetera-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'coffee-tour-finca-don-eduardo': '/pautas/coffee-tour-finca-don-eduardo/logo-finca-don-eduardo.webp',
  'cootracocora-ltda': '/pautas/cootracocora_ltda/logo-cootracocora.webp',
  'finca-cafetera-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'fonda-boquia': '/pautas/restaurante_bar_fonda_boquia/imagenes/480508481_1169835038167384_4932382570318530100_n.webp',
  'hotel-camino-nacional-salento': '/pautas/hotel_camino_nacional/imagenes/631033284.webp',
  'hotel-la-floresta-salento': '/pautas/hotel_la_floresta_salento/imagenes/images.webp',
  'hotel-la-tia-emiss': '/pautas/hotel_tia_emiss/emmis1.jpg',
  'iglesia-de-nuestra-senora-del-carmen-de-salento': '/imagenes-salento/pueblo.webp',
  'mahalo-hostel-salento': '/pautas/mahalo_hostel/imagenes/logo-mahalo.webp',
  'mirador-alto-de-la-cruz': '/imagenes-salento/destinos-75.webp',
  'mirador-del-condor-salento': '/imagenes-salento/destinos-75.webp',
  'mirador-las-manos-de-dios': '/pautas/mirador_mano_de_dios/imagenes/logo-mirador-dios.webp',
  'oficina-de-informacion-turistica-de-salento': '/imagenes-salento/pueblo.webp',
  'parque-mirador-la-vida-es-bella': '/pautas/parque-mirador-la-vida-bella/Logolavidabella.webp',
  'plaza-de-bolivar-de-salento': '/imagenes-salento/pueblo.webp',
  'puente-de-boquia-sendero-cercano': '/imagenes-salento/destinos-75.webp',
  'punto-de-encuentro-jeeps-willys-plaza': '/pautas/cootracocora_ltda/willys.webp',
  'recorrido-cultural-casco-historico': '/imagenes-salento/pueblo.webp',
  'restaurante-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'sendero-de-las-palmas-entrada-libre-valle': '/imagenes-salento/destinos-75.webp',
  'terminal-de-transporte-de-salento-acceso-peatonal': '/pautas/cootracocora_ltda/willys.webp',
  'valle-de-cocora-sendero-de-entrada-libre': '/imagenes-salento/destinos-75.webp',
};

function logoImg(src) {
  return `<span aria-hidden="true" style="opacity:.4">×</span><img src="${src}" alt="Logo pautante" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%;border:1px solid var(--line)" />`;
}

const patched = [];
const skipped = [];
const issues = [];

for (const slug of Object.keys(LOGOS)) {
  const file = path.join(dir, slug, 'index.html');
  if (!fs.existsSync(file)) {
    issues.push('NO PAGE: ' + slug);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('Logo pautante')) {
    skipped.push(slug);
    continue;
  }
  const asset = path.join(root, 'public', LOGOS[slug].replace(/^\//, ''));
  if (!fs.existsSync(asset)) {
    issues.push('NO ASSET: ' + slug + ' -> ' + LOGOS[slug]);
    continue;
  }
  const brandRe = /(<a class="brand" href="\/">[\s\S]*?<\/span>)(<\/a>)/;
  if (!brandRe.test(html)) {
    issues.push('NO BRAND: ' + slug);
    continue;
  }
  html = html.replace(brandRe, '$1' + logoImg(LOGOS[slug]) + '$2');
  fs.writeFileSync(file, html);
  patched.push(slug);
}

const withoutLogo = [];
for (const entry of fs.readdirSync(dir)) {
  const file = path.join(dir, entry, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('Logo pautante') && !patched.includes(entry)) {
    withoutLogo.push(entry);
  }
}

console.log('PATCHED:', patched.length);
patched.forEach((s) => console.log('  +', s));
console.log('ALREADY_OK:', skipped.length);
console.log('STILL_WITHOUT_LOGO:', withoutLogo.length);
withoutLogo.forEach((s) => console.log('  -', s));
console.log('ISSUES:', issues.length);
issues.forEach((s) => console.log('  !', s));
