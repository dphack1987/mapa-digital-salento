const fs = require('fs');
const path = require('path');

const placesFile = path.join(__dirname, '..', 'public', 'data', 'places.json');
const markersFile = path.join(__dirname, '..', 'public', 'data', 'mapMarkers.json');

const placesData = JSON.parse(fs.readFileSync(placesFile, 'utf8'));
const markersData = JSON.parse(fs.readFileSync(markersFile, 'utf8'));

const existingPlaceIds = new Set(markersData.markers.map(m => m.placeId));
const newMarkers = [];

const typeToTone = {
  'Cafés': 'warning',
  'Restaurantes': 'warning',
  'Alojamientos': 'primary',
  'Experiencias': 'success',
  'Servicios': 'info',
  'Atractivos Turísticos': 'success',
  'Tiendas': 'warning',
  'Artesanías': 'warning',
  'Restaurante Bar': 'warning',
  'Postres y Dulces Típicos': 'warning'
};

const typeToMarkerType = {
  'Cafés': 'Gastronómico',
  'Restaurantes': 'Gastronómico',
  'Alojamientos': 'Turístico',
  'Experiencias': 'Turístico',
  'Servicios': 'Comercial',
  'Atractivos Turísticos': 'Turístico',
  'Tiendas': 'Comercial',
  'Artesanías': 'Comercial',
  'Restaurante Bar': 'Gastronómico',
  'Postres y Dulces Típicos': 'Gastronómico'
};

placesData.places.forEach(place => {
  if (place.id >= 47 && !existingPlaceIds.has(place.id)) {
    newMarkers.push({
      id: 200 + place.id, // Offset for marker IDs to avoid conflict
      label: place.name,
      type: typeToMarkerType[place.type] || 'Turístico',
      placeId: place.id,
      coord: [place.location.lat, place.location.lng],
      tone: typeToTone[place.type] || 'success',
      note: place.badge || place.description.substring(0, 50) + '...'
    });
  }
});

if (newMarkers.length === 0) {
  console.log('Nada que agregar (marcadores ya existen).');
  process.exit(0);
}

markersData.markers.push(...newMarkers);
markersData.lastUpdated = new Date().toISOString();

fs.writeFileSync(markersFile, JSON.stringify(markersData, null, 2), 'utf8');
console.log('Agregados ' + newMarkers.length + ' marcadores nuevos.');
