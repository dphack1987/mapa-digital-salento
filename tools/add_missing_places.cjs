const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'data', 'places.json');
let raw = fs.readFileSync(file, 'utf8');

const newPlaces = [
  {
    id: 39,
    name: 'Cootracocora LTDA',
    type: 'Servicios',
    description: 'Transporte público en jeeps Willys de Salento al Valle de Cocora. Salidas desde la plaza de 6:00 a.m. a 9:00 p.m., desde $3.600 COP por persona.',
    priceRange: '$',
    rating: '',
    timeInfo: 'Lun-dom 6:00 a.m. - 9:00 p.m.',
    badge: 'Jeeps Willys',
    color: 'green',
    icon: 'Compass',
    contact: { phone: '+57 310 437 2944', whatsapp: '573104372944' },
    location: { lat: 4.6386, lng: -75.5647, address: 'Plaza principal de Salento - Terminal de Transporte Público Jeep Willys', landmark: 'Plaza de Bolívar, Salento' },
    operatingHours: { notes: 'Lunes a domingo 6:00 a.m. - 9:00 p.m.' },
    tags: ['transporte', 'jeeps willys', 'valle de cocora', 'terminal', 'salento', 'movilidad'],
    verified: true,
    active: true,
    photos: [
      '/pautas/cootracocora_ltda/imagenes/willys.webp',
      '/pautas/cootracocora_ltda/imagenes/info-transcocora.webp',
      '/pautas/cootracocora_ltda/cootracocora-arte-publicitario.webp'
    ],
    actionTarget: {
      viewUrl: 'https://www.salentoalamano.com/paginas-pautantes/cootracocora-ltda/',
      reserveUrl: 'https://wa.me/573104372944'
    },
    isPautante: true
  },
  {
    id: 40,
    name: 'Los Barranqueros Hotel',
    type: 'Alojamientos',
    description: 'Hotel familiar a 250 m de la Plaza de Bolívar y 7 minutos de la Calle Real. Parqueadero, admite mascotas y reserva directa por WhatsApp.',
    priceRange: 'Consultar',
    rating: '',
    timeInfo: 'Check-in 14:00 - 22:00 · Check-out hasta 11:00',
    badge: 'A 250 m de la Plaza',
    color: 'mustard',
    icon: 'Hotel',
    contact: { phone: '+57 302 443 3793', whatsapp: '573024433793' },
    location: { lat: 4.635789, lng: -75.571056, address: 'Calle 7 # 8-1, Salento, Quindío', landmark: 'A 250 m de la Plaza de Bolívar' },
    operatingHours: { notes: 'Check-in 14:00-22:00 · Check-out hasta 11:00' },
    tags: ['hotel', 'alojamiento', 'centro', 'mascotas', 'parqueadero', 'salento'],
    verified: true,
    active: true,
    photos: [
      '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-1.webp',
      '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-2.webp',
      '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-3.webp',
      '/pautas/hotel-barranqueros/image-salento-los-barranqueros-hotel-4.webp'
    ],
    actionTarget: {
      viewUrl: 'https://www.salentoalamano.com/paginas-pautantes/los-barranqueros-hotel/',
      reserveUrl: 'https://wa.me/573024433793'
    },
    isPautante: true
  },
  {
    id: 41,
    name: 'Hotel Green House Salento',
    type: 'Alojamientos',
    description: 'Hotel en Cra. 4 #3-13 a 5 minutos del centro de Salento: 15 habitaciones, WiFi, jacuzzi, terraza y admite mascotas.',
    priceRange: '$$',
    rating: '',
    timeInfo: 'Reserva directa por WhatsApp',
    badge: '5 min del centro',
    color: 'green',
    icon: 'Hotel',
    contact: { phone: '+57 312 867 4073', whatsapp: '573128674073' },
    location: { lat: 4.641124, lng: -75.570782, address: 'Cra. 4 #3-13, Salento, Quindío', landmark: '5 min a pie del centro · Mirador Ecopark · Alto de la Cruz' },
    operatingHours: { notes: 'Recepción y reservas directas por WhatsApp' },
    tags: ['hotel', 'wifi', 'jacuzzi', 'mascotas', 'terraza', 'salento'],
    verified: true,
    active: true,
    photos: [
      '/pautas/hotel-green-house/imagenes/green-house-banner.webp',
      '/pautas/hotel-green-house/imagenes/green-house-hab-1.webp',
      '/pautas/hotel-green-house/imagenes/green-house-hab-2.webp',
      '/pautas/hotel-green-house/imagenes/green-house-hab-3.webp'
    ],
    actionTarget: {
      viewUrl: 'https://www.salentoalamano.com/paginas-pautantes/hotel-green-house-salento/',
      reserveUrl: 'https://wa.me/573128674073'
    },
    isPautante: true
  },
  {
    id: 42,
    name: 'Mirador Manos de Cocora',
    type: 'Atractivos Turísticos',
    description: 'Mirador con 18 puntos fotográficos, deslizadora tricolor y vistas panorámicas al Valle de Cocora. Experiencia fotográfica única en Salento.',
    priceRange: '$$',
    rating: '4.6',
    timeInfo: 'Entrada $20.000 · deslizadora $10.000',
    badge: '18 puntos fotográficos',
    color: 'coral',
    icon: 'Mountain',
    contact: { phone: '+57 321 545 2739', whatsapp: '573215452739' },
    location: { lat: 4.638998, lng: -75.484789, address: 'Valle del Cocora, Salento, Quindío', landmark: 'Valle de Cocora · segundo mirador independiente' },
    operatingHours: { notes: 'Acceso durante el día · confirmar condiciones por WhatsApp' },
    tags: ['mirador', 'valle de cocora', 'fotos', 'deslizadora tricolor', 'paisaje'],
    verified: true,
    active: true,
    photos: [
      '/pautas/mirador-manos-de-cocora/imagenes/7.-deslizadora-tricolor-nueva-manos-de-cocora-2.webp',
      '/pautas/mirador-manos-de-cocora/imagenes/4. ubicacion-manos-de-cocora-7.webp',
      '/pautas/mirador-manos-de-cocora/imagenes/9.-san-pedro-manos-de-cocora-2.webp',
      '/pautas/mirador-manos-de-cocora/imagenes/14. colores-manos-de-cocora-1.webp'
    ],
    actionTarget: {
      viewUrl: 'https://www.salentoalamano.com/paginas-pautantes/mirador-manos-de-cocora/',
      reserveUrl: 'https://wa.me/573215452739'
    },
    isPautante: true
  },
  {
    id: 43,
    name: 'Shalem Restaurante Bar',
    type: 'Restaurante Bar',
    description: 'Restaurante y bar en la Calle 6 #4-44: comida típica colombiana, trucha, tilapia y bandeja paisa, con local climatizado y salón de eventos.',
    priceRange: '$',
    rating: '4.2',
    timeInfo: 'Lun-vie 8:00 a.m. - 12:00 p.m. · sáb-dom 8:00 a.m. - 2:00 a.m.',
    badge: 'Local climatizado',
    color: 'yellow',
    icon: 'Utensils',
    contact: { phone: '+57 323 466 1964', whatsapp: '573234661964' },
    location: { lat: 4.638204, lng: -75.570928, address: 'Calle 6 # 4-44, Salento, Quindío', landmark: 'Calle Real, centro de Salento' },
    operatingHours: { notes: 'Lun-vie 8:00 a.m. - 12:00 p.m. · sáb-dom 8:00 a.m. - 2:00 a.m.' },
    tags: ['restaurante', 'bar', 'trucha', 'bandeja paisa', 'salón de eventos', 'climatizado'],
    verified: true,
    active: true,
    photos: [
      '/pautas/restaurante-bar-shalem/imagenes/shalem-home-banner.webp',
      '/pautas/restaurante-bar-shalem/imagenes/shalem-restaurante-1.webp',
      '/pautas/restaurante-bar-shalem/imagenes/shalem-restaurante-2.webp',
      '/pautas/restaurante-bar-shalem/imagenes/shalem-bar-1.webp'
    ],
    actionTarget: {
      viewUrl: 'https://www.salentoalamano.com/paginas-pautantes/shalem-restaurante-bar/',
      reserveUrl: 'https://wa.me/573234661964'
    },
    isPautante: true
  }
];

// Verificar que no existan ya
const data = JSON.parse(raw);
const existingIds = new Set(data.places.map((p) => p.id));
const existingNames = new Set(data.places.map((p) => p.name));
const toAdd = newPlaces.filter((p) => !existingIds.has(p.id) && !existingNames.has(p.name));
if (toAdd.length === 0) {
  console.log('Nada que agregar (ya existen).');
  process.exit(0);
}

// Insertar antes del cierre del array places (justo antes de "lastUpdated")
const nl = raw.includes('\r\n') ? '\r\n' : '\n';
const anchor = nl + '  ],' + nl + '  "lastUpdated"';
const idx = raw.lastIndexOf(anchor);
if (idx < 0) { console.error('Anchor no encontrado'); process.exit(1); }

const serialized = toAdd
  .map((p) => JSON.stringify(p, null, 2).split('\n').map((line) => '    ' + line).join('\n'))
  .join(',\n')
  .replace(/\n/g, nl);

raw = raw.slice(0, idx) + ',' + nl + serialized + raw.slice(idx);
raw = raw.replace(/"lastUpdated": "[^"]+"/, '"lastUpdated": "2026-10-08"');

JSON.parse(raw); // validar
fs.writeFileSync(file, raw, 'utf8');
console.log('Agregados:', toAdd.map((p) => `${p.id} ${p.name} [${p.type}]`).join(' | '));
console.log('Total lugares:', JSON.parse(raw).places.length);
