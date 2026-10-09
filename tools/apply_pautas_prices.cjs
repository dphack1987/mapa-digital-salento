// Aplica precios reales de public/pautas/*.md a los initMenu de paginas-pautantes.
// También convierte "precio":0 de ítems a "consultar" en precio:null (sin comillas: null).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'paginas-pautantes');

function readPage(slug) {
  const f = path.join(ROOT, slug, 'index.html');
  return { file: f, html: fs.readFileSync(f, 'utf8') };
}
function writePage(file, html) {
  fs.writeFileSync(file, html, 'utf8');
}
function patchMenu(html, fn) {
  const m = html.match(/PautanteCommon\.initMenu\(([\s\S]*?)\);/);
  if (!m) throw new Error('initMenu no encontrado');
  const cfg = JSON.parse(m[1]);
  fn(cfg);
  return html.replace(/PautanteCommon\.initMenu\([\s\S]*?\);/, 'PautanteCommon.initMenu(' + JSON.stringify(cfg) + ');');
}
function item(cfg, id) {
  const it = cfg.items.find(x => x.id === id);
  if (!it) throw new Error('item ' + id + ' no existe');
  return it;
}

// 1) Parque Mirador La Vida es Bella — entrada $20.000 (fuente .md)
{
  const { file, html } = readPage('parque-mirador-la-vida-es-bella');
  const out = patchMenu(html, cfg => {
    const it = item(cfg, 1);
    it.nombre = 'Entrada al mirador';
    it.precio = 20000;
    it.desc = 'Entrada y atracciones · casa al revés, nidos gigantes, exhibición de Willys, 26+ escenarios fotográficos';
  });
  writePage(file, out);
  console.log('OK la-vida-bella');
}

// 2) Mirador Manos de Cocora — catálogo real (fuente .md)
{
  const { file, html } = readPage('mirador-manos-de-cocora');
  const out = patchMenu(html, cfg => {
    const IMG = '/pautas/mirador-manos-de-cocora/imagenes/';
    cfg.items = [
      { id: 1, cat: 'planes', nombre: 'Entrada al mirador', precio: 20000, desc: 'Acceso a los miradores del Valle de Cocora', img: IMG + '4. ubicacion-manos-de-cocora-7.webp' },
      { id: 2, cat: 'planes', nombre: 'Deslizadora arcoíris', precio: 10000, desc: 'Atracción adicional · costo adicional a la entrada', img: IMG + '7.-deslizadora-tricolor-nueva-manos-de-cocora-2.webp' },
      { id: 3, cat: 'planes', nombre: 'Entrada + deslizadora', precio: 30000, desc: 'Precio combinado (entrada $20.000 + deslizadora $10.000)', img: IMG + '14. colores-manos-de-cocora-1.webp' },
      { id: 4, cat: 'planes', nombre: 'Fotografías digitales', precio: 16000, desc: 'Envías por WhatsApp · tomadas por el equipo del mirador', img: IMG + '9.-san-pedro-manos-de-cocora-2.webp' },
      { id: 5, cat: 'planes', nombre: 'Fotografía impresa con marco', precio: 25000, desc: 'Recuerdo físico con marco', img: IMG + '7.-deslizadora-tricolor-nueva-manos-de-cocora-2.webp' }
    ];
    cfg.categories = [
      { id: 'todas', label: 'Todas' },
      { id: 'planes', label: 'Planes' }
    ];
    cfg.precioLabel = 'por persona';
  });
  writePage(file, out);
  console.log('OK manos-de-cocora');
}

// 3) Cabalgatas — corta $110.000, media/larga a consultar (rango .md)
{
  const { file, html } = readPage('cabalgatas-cocora-magica');
  const out = patchMenu(html, cfg => {
    const corta = item(cfg, 2);
    corta.precio = 110000;
    corta.desc = 'Recorrido corto a caballo · precio de referencia';
    const media = item(cfg, 3);
    media.precio = null;
    media.desc = 'Recorrido medio a caballo · consultar precio con el operador';
    const larga = item(cfg, 4);
    larga.precio = null;
    larga.desc = 'Recorrido largo o personalizado · consultar precio con el operador';
  });
  writePage(file, out);
  console.log('OK cabalgatas');
}

// 4) Don Elías — tarifas ya correctas en página (50/60/70k); tour privado a consultar
{
  const { file, html } = readPage('finca-cafetera-don-elias');
  const out = patchMenu(html, cfg => {
    const es = item(cfg, 1);
    es.desc = '90 min · español e inglés simultáneo · salidas cada hora 9:00–16:00';
    const solo = item(cfg, 2);
    solo.desc = '90 min · solo español o solo inglés · requiere reserva previa';
    const fr = item(cfg, 3);
    fr.desc = '90 min · francés (muy buen nivel) · requiere reserva previa';
    const priv = item(cfg, 4);
    priv.precio = null;
    priv.desc = '90 min · salidas fijas 9:30 · 11:30 · 13:30 · 15:30 · consultar tarifa';
  });
  writePage(file, out);
  console.log('OK don-elias');
}

// 5) El Recuerdo — precios correctos (50/65k), completar descripciones
{
  const { file, html } = readPage('el-recuerdo-coffee-tour');
  const out = patchMenu(html, cfg => {
    const es = item(cfg, 1);
    es.precio = 50000;
    es.desc = 'Español o inglés · 1.5 horas · dificultad fácil (finca plana) · con reserva previa';
    const fr = item(cfg, 2);
    fr.precio = 65000;
    fr.desc = 'Francés · 1.5 horas · dificultad fácil (finca plana) · solo con reserva previa';
    const cafe = item(cfg, 3);
    cafe.precio = null;
  });
  writePage(file, out);
  console.log('OK el-recuerdo');
}

// 6) Don Eduardo — mantener 100.000, añadir nota de temporada
{
  const { file, html } = readPage('finca-don-eduardo-coffee-tour');
  const out = patchMenu(html, cfg => {
    cfg.items.forEach(it => {
      if (it.cat === 'tours') it.desc = 'Duración ~3 horas · finca a 8 min caminando de la plaza · en octubre puede haber incremento por temporada alta';
    });
  });
  writePage(file, out);
  console.log('OK don-eduardo');
}

// 7) Hotel La Floresta — desde $124.000 (web oficial)
{
  const { file, html } = readPage('hotel-la-floresta-salento');
  const out = patchMenu(html, cfg => {
    const hab = item(cfg, 1);
    hab.precio = 124000;
    hab.desc = 'Estándar / doble / triple / cuádruple / familiar · desde $124.000 COP por noche (temporada puede variar)';
    item(cfg, 2).precio = null; // suite jacuzzi
    item(cfg, 3).precio = null; // paquete parejas
  });
  writePage(file, out);
  console.log('OK la-floresta');
}

// 8) Hoteles sin tarifa pública → null (Consultar) en habitaciones y planes "consultar"
const consultPages = {
  'hotel-salento-real': { rooms: [1,2,3,4,5,6,7], serviciosKeepZero: [8,9,10,11,12] },
  'mahalo-hostel-salento': { rooms: [1,2,3,4,5,6,7,8,9,10,11], serviciosKeepZero: [12,13,14,15,16,17,18,19] },
  'hotel-la-tia-emiss': { rooms: [1,2,3,4], serviciosKeepZero: [5,6,7,8] },
  'hotel-camino-nacional-salento': { rooms: [1,2,3,4], serviciosKeepZero: [5,6,7,8,9] },
  'boki-mall-hotel-el-mirador-de-boquia': { rooms: [1], serviciosKeepZero: [2,3,4,5,6,7] },
  'downhill-bike-salento': { rooms: [1,2,3,4,5], serviciosKeepZero: [6] },
  'boki-mall-barcinales-cafe-bar': { rooms: [1,2], serviciosKeepZero: [3] },
  'boki-mall-eventos': { rooms: [1,2], serviciosKeepZero: [3] },
  'boki-mall-restaurante-terra': { rooms: [1,2,3,4], serviciosKeepZero: [5] }
};
for (const [slug, spec] of Object.entries(consultPages)) {
  const { file, html } = readPage(slug);
  const out = patchMenu(html, cfg => {
    spec.rooms.forEach(id => {
      const it = cfg.items.find(x => x.id === id);
      if (!it) return;
      if (it.precio === 0) it.precio = null;
      if (!it.desc) it.desc = 'Consultar disponibilidad y tarifa directo con el negocio';
    });
  });
  writePage(file, out);
  console.log('OK consult', slug);
}

// 9) Green House y Los Barranqueros — reemplazar ítems-basura por catálogo real de habitaciones
{
  const { file, html } = readPage('hotel-green-house-salento');
  const out = patchMenu(html, cfg => {
    cfg.items = [
      { id: 1, cat: 'habitaciones', nombre: 'Habitación doble', precio: null, desc: 'Consultar tarifa · 5 min a pie del centro · cerca de Mirador Ecopark y Alto de la Cruz', img: '/pautas/hotel-green-house/imagenes/green-house-hab-1.webp' },
      { id: 2, cat: 'habitaciones', nombre: 'Habitación triple', precio: null, desc: 'Consultar tarifa · 5 min a pie del centro', img: '/pautas/hotel-green-house/imagenes/green-house-hab-2.webp' },
      { id: 3, cat: 'habitaciones', nombre: 'Habitación familiar', precio: null, desc: 'Consultar tarifa · ideal para familias', img: '/pautas/hotel-green-house/imagenes/green-house-hab-3.webp' },
      { id: 4, cat: 'servicios', nombre: 'Wi-Fi', precio: 0, desc: '', img: '/pautas/hotel-green-house/imagenes/green-house-hab-1.webp' },
      { id: 5, cat: 'servicios', nombre: 'Jacuzzi', precio: 0, desc: '', img: '/pautas/hotel-green-house/imagenes/green-house-jacuzzi.webp' },
      { id: 6, cat: 'servicios', nombre: 'Mascotas permitidas', precio: 0, desc: '', img: '/pautas/hotel-green-house/imagenes/green-house-hab-3.webp' },
      { id: 7, cat: 'servicios', nombre: 'Terraza', precio: 0, desc: '', img: '/pautas/hotel-green-house/imagenes/green-house-terraza.webp' }
    ];
    cfg.categories = [
      { id: 'todas', label: 'Todas' },
      { id: 'habitaciones', label: 'Habitaciones' },
      { id: 'servicios', label: 'Servicios' }
    ];
    cfg.precioLabel = 'por noche';
  });
  writePage(file, out);
  console.log('OK green-house');
}
{
  const { file, html } = readPage('los-barranqueros-hotel');
  const out = patchMenu(html, cfg => {
    cfg.items = [
      { id: 1, cat: 'habitaciones', nombre: 'Habitación doble', precio: null, desc: 'Consultar tarifa · a 250 m de la Plaza de Bolívar', img: '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-1.webp' },
      { id: 2, cat: 'habitaciones', nombre: 'Habitación triple', precio: null, desc: 'Consultar tarifa · a 250 m de la Plaza de Bolívar', img: '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-2.webp' },
      { id: 3, cat: 'habitaciones', nombre: 'Habitación familiar', precio: null, desc: 'Consultar tarifa · a 250 m de la Plaza de Bolívar', img: '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-3.webp' },
      { id: 4, cat: 'servicios', nombre: 'Mascotas permitidas', precio: 0, desc: '', img: '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-4.webp' },
      { id: 5, cat: 'servicios', nombre: 'Parqueadero', precio: 0, desc: '', img: '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-1.webp' }
    ];
    cfg.categories = [
      { id: 'todas', label: 'Todas' },
      { id: 'habitaciones', label: 'Habitaciones' },
      { id: 'servicios', label: 'Servicios' }
    ];
    cfg.precioLabel = 'por noche';
  });
  writePage(file, out);
  console.log('OK barranqueros');
}

// 10) Restaurante Don Elías — comida tradicional a consultar
{
  const { file, html } = readPage('restaurante-don-elias');
  const out = patchMenu(html, cfg => {
    const it = cfg.items.find(x => x.precio === 0);
    if (it) { it.precio = null; it.desc = 'Platos caseros con productos de la finca · consultar precio'; }
  });
  writePage(file, out);
  console.log('OK restaurante-don-elias');
}

console.log('\nPrecios actualizados.');
