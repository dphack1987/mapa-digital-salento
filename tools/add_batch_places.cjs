const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'data', 'places.json');
let raw = fs.readFileSync(file, 'utf8');

const newPlaces = [
  {
    id: 117,
    name: 'Puente Amarillo Boquía',
    type: 'Atractivos Turísticos',
    description: 'Puente histórico emblemático que marca la entrada a la vereda Boquía. Punto fotográfico popular.',
    priceRange: 'Gratis',
    rating: '4.6',
    badge: 'Icono de Boquía',
    color: 'coral',
    icon: 'Mountain',
    location: { lat: 4.6565, lng: -75.5722, address: 'Vía Armenia-Salento, Boquía', landmark: 'Entrada a la reserva Santa Rita' },
    tags: ['puente', 'boquia', 'fotos', 'historia', 'salento'],
    verified: true,
    active: true,
    isPautante: false
  },
  {
    id: 118,
    name: 'Túneles de la Quiebra',
    type: 'Atractivos Turísticos',
    description: 'Antiguos túneles del ferrocarril, hoy senderos ecológicos cargados de historia y misterio.',
    priceRange: 'Gratis',
    rating: '4.7',
    badge: 'Senderismo Histórico',
    color: 'coral',
    icon: 'Mountain',
    location: { lat: 4.6525, lng: -75.5785, address: 'Vereda Boquía, Salento', landmark: 'Cerca a la cascada Santa Rita' },
    tags: ['tuneles', 'ferrocarril', 'historia', 'senderismo', 'salento'],
    verified: true,
    active: true,
    isPautante: false
  },
  {
    id: 119,
    name: 'Vía al Valle de Cocora (Mirador)',
    type: 'Atractivos Turísticos',
    description: 'Punto panorámico en la carretera hacia el valle con las primeras vistas de las palmas de cera.',
    priceRange: 'Gratis',
    rating: '4.8',
    badge: 'Vista Panorámica',
    color: 'coral',
    icon: 'Mountain',
    location: { lat: 4.6355, lng: -75.5255, address: 'Vía Cocora Km 6, Salento', landmark: 'Mitad de camino al valle' },
    tags: ['vistas', 'carretera', 'fotos', 'valle', 'salento'],
    verified: true,
    active: true,
    isPautante: false
  },
  {
    id: 120,
    name: 'Café de la Montaña 2',
    type: 'Cafés',
    description: 'Segunda sede del popular café con enfoque en snacks rápidos y café para llevar.',
    priceRange: '$',
    rating: '4.4',
    badge: 'Coffee to Go',
    color: 'mustard',
    icon: 'Coffee',
    location: { lat: 4.6395, lng: -75.5658, address: 'Calle Real, Salento', landmark: 'Final de la Calle Real' },
    tags: ['cafe', 'rapido', 'centro', 'salento'],
    verified: true,
    active: true,
    isPautante: false
  },
  {
    id: 121,
    name: 'Restaurante La Playita',
    type: 'Restaurantes',
    description: 'Restaurante campestre junto al río Quindío en Boquía. Especialidad en carnes y sancocho de leña.',
    priceRange: '$$',
    rating: '4.5',
    badge: 'Junto al Río',
    color: 'yellow',
    icon: 'Utensils',
    location: { lat: 4.6545, lng: -75.5745, address: 'Vereda Boquía, Salento', landmark: 'Ribera del río Quindío' },
    tags: ['restaurante', 'rio', 'campestre', 'sancocho', 'salento'],
    verified: true,
    active: true,
    isPautante: false
  }
];

// Verificar que no existan ya
const data = JSON.parse(raw);
const existingIds = new Set(data.places.map((p) => p.id));
const existingNames = new Set(data.places.map((p) => p.name.toLowerCase()));
const toAdd = newPlaces.filter((p) => !existingIds.has(p.id) && !existingNames.has(p.name.toLowerCase()));

if (toAdd.length === 0) {
  console.log('Nada que agregar (ya existen).');
  process.exit(0);
}

// Insertar antes del cierre del array places
const nl = raw.includes('\r\n') ? '\r\n' : '\n';
const anchor = nl + '  ],' + nl + '  "lastUpdated"';
const idx = raw.lastIndexOf(anchor);

if (idx < 0) {
  console.error('Anchor no encontrado');
  process.exit(1);
}

const serialized = toAdd
  .map((p) => JSON.stringify(p, null, 2).split('\n').map((line) => '    ' + line).join('\n'))
  .join(',' + nl);

raw = raw.slice(0, idx) + ',' + nl + serialized + raw.slice(idx);
raw = raw.replace(/"lastUpdated": "[^"]+"/, `"lastUpdated": "${new Date().toISOString().split('T')[0]}"`);

try {
  JSON.parse(raw);
  fs.writeFileSync(file, raw, 'utf8');
  console.log('Agregados ' + toAdd.length + ' lugares nuevos.');
} catch (e) {
  console.error('Error validando JSON:', e.message);
  process.exit(1);
}
