// Aplica verificación final: precios CocoraTours (cabalgatas), refs OTA (hoteles), limpieza.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'public', 'paginas-pautantes');

function patch(slug, fn) {
  const file = path.join(ROOT, slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const m = html.match(/PautanteCommon\.initMenu\(([\s\S]*?)\);/);
  if (!m) throw new Error(slug + ': sin initMenu');
  const cfg = JSON.parse(m[1]);
  fn(cfg);
  html = html.replace(/PautanteCommon\.initMenu\([\s\S]*?\);/, 'PautanteCommon.initMenu(' + JSON.stringify(cfg) + ');');
  fs.writeFileSync(file, html, 'utf8');
  console.log('OK', slug);
}

// 1) Cabalgatas — tarifas oficiales CocoraTours 2026 (web, 5/10/2026)
patch('cabalgatas-cocora-magica', cfg => {
  const i1 = cfg.items.find(x => x.id === 1);
  i1.nombre = 'Cabalgata fincas cafeteras + tour del café';
  i1.precio = 145000;
  i1.desc = '3.5 horas · la más recomendada · salida oficina Calle 2 #6-09';
  const i2 = cfg.items.find(x => x.id === 2);
  i2.nombre = 'Cabalgata corta · río Boquerón';
  i2.precio = 110000;
  i2.desc = '2 horas · recorrido por el río Boquerón';
  const i3 = cfg.items.find(x => x.id === 3);
  i3.nombre = 'Cabalgata media · Mirador Sestillal';
  i3.precio = 130000;
  i3.desc = '2.5 horas · mirador Sestillal';
  const i4 = cfg.items.find(x => x.id === 4);
  i4.nombre = 'Cabalgata larga · Bosques Mágicos y Cascada Santa Rita';
  i4.precio = 190000;
  i4.desc = '3–4 horas · bosques y cascada Santa Rita';
  if (!cfg.items.find(x => x.id === 5)) {
    cfg.items.push({
      id: 5, cat: 'planes',
      nombre: 'Cabalgata completa · fincas, bosque y río Boquerón',
      precio: 200000,
      desc: '4.5 horas · fincas cafeteras activas, bosque nativo y baño en el río Boquerón',
      img: '/pautas/cabalgatas_cocora_magica/imagenes/cabalgata-rio.jpeg'
    });
  }
});

// 2) Don Elías — tour privado: tarifa no publicada (verificado 5/10/2026)
patch('finca-cafetera-don-elias', cfg => {
  const priv = cfg.items.find(x => x.id === 4);
  priv.precio = null;
  priv.desc = '90 min · salidas 9:30 · 11:30 · 13:30 · 15:30 · tarifa no publicada, consultar por WhatsApp';
});

// 3) Hoteles — precio null (reserva directa), desc con referencia OTA verificada
const hotelRefs = {
  'hotel-salento-real': 'Consultar tarifa directa · referencia OTA ~US$59–72/noche (Agoda/Kayak)',
  'mahalo-hostel-salento': 'Consultar tarifa directa · referencia OTA: suites desde ~€33 · camas compartidas desde ~US$9',
  'hotel-la-tia-emiss': 'Consultar tarifa directa · referencia OTA desde ~US$62/noche',
  'boki-mall-hotel-el-mirador-de-boquia': 'Consultar tarifa directa · referencia OTA desde ~US$83/noche',
  'hotel-camino-nacional-salento': 'Consultar tarifa directa · hotel central Cra 6 #3-46 · sin tarifa pública'
};
for (const [slug, ref] of Object.entries(hotelRefs)) {
  patch(slug, cfg => {
    const r = cfg.items.find(x => x.cat === 'habitaciones');
    if (r) r.desc = ref;
  });
}
// Floresta suite
patch('hotel-la-floresta-salento', cfg => {
  const suite = cfg.items.find(x => x.id === 2);
  if (suite) suite.desc = 'Suite con jacuzzi (queen/king) · tarifa superior · consultar con el hotel';
});

// 4) Limpieza precioLabel huérfano
for (const slug of ['boki-mall-eventos', 'downhill-bike-salento']) {
  patch(slug, cfg => { cfg.precioLabel = ''; });
}

console.log('\nAplicación completa.');
