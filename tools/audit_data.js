import fs from 'fs';

// Audit places.json
console.log('=== AUDIT DE PLACES.JSON ===');
const placesData = JSON.parse(fs.readFileSync('./public/data/places.json', 'utf8'));
const places = placesData.places;

console.log(`Total places: ${places.length}`);
console.log(`Active places: ${places.filter(p => p.active).length}`);
console.log(`Verified places: ${places.filter(p => p.verified).length}`);

// Check for missing required fields
const issues = [];
places.forEach((p, i) => {
  if (!p.id) issues.push(`Place ${i}: missing id`);
  if (!p.name) issues.push(`Place ${i}: missing name`);
  if (!p.type) issues.push(`Place ${i}: missing type`);
  if (!p.contact) issues.push(`Place ${i}: missing contact`);
  if (!p.location) issues.push(`Place ${i}: missing location`);
  if (!p.description) issues.push(`Place ${i}: missing description`);
});

if (issues.length > 0) {
  console.log('❌ ISSUES FOUND:');
  issues.forEach(i => console.log(i));
} else {
  console.log('✓ All places have required fields');
}

// Check for types distribution
const typeDistribution = {};
places.forEach(p => {
  typeDistribution[p.type] = (typeDistribution[p.type] || 0) + 1;
});
console.log('Type distribution:', typeDistribution);

// Audit hotels.json
console.log('\n=== AUDIT DE HOTELS.JSON ===');
const hotelsData = JSON.parse(fs.readFileSync('./public/data/hotels.json', 'utf8'));
console.log(`Total hotels: ${hotelsData.hotels.length}`);
console.log(`Partner hotels: ${hotelsData.hotels.filter(h => h.isPartner).length}`);

// Audit mapMarkers.json
console.log('\n=== AUDIT DE MAPMARKERS.JSON ===');
const markersData = JSON.parse(fs.readFileSync('./public/data/mapMarkers.json', 'utf8'));
console.log(`Total markers: ${markersData.markers.length}`);
const markerTypes = [...new Set(markersData.markers.map(m => m.type))];
console.log('Marker types:', markerTypes.join(', '));

// Check consistency between datasets
console.log('\n=== CONSISTENCY CHECK ===');
const placeIds = new Set(places.map(p => p.id));
const hotelPlaceIds = new Set(hotelsData.hotels.map(h => h.placeId));
const markerPlaceIds = new Set(markersData.markers.map(m => m.placeId));

console.log('Place IDs in places.json:', placeIds.size);
console.log('Place IDs referenced in hotels.json:', hotelPlaceIds.size);
console.log('Place IDs referenced in mapMarkers.json:', markerPlaceIds.size);

// Check for orphaned references
const orphanedHotels = hotelsData.hotels.filter(h => !placeIds.has(h.placeId));
if (orphanedHotels.length > 0) {
  console.log('❌ Orphaned hotel references:', orphanedHotels.map(h => h.name));
} else {
  console.log('✓ All hotel references are valid');
}

const orphanedMarkers = markersData.markers.filter(m => !placeIds.has(m.placeId));
if (orphanedMarkers.length > 0) {
  console.log('❌ Orphaned marker references:', orphanedMarkers.map(m => m.label));
} else {
  console.log('✓ All marker references are valid');
}

console.log('\n=== AUDIT COMPLETADO ===');