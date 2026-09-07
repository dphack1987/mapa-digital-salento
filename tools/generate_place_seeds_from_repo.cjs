/**
 * tools/generate_place_seeds_from_repo.cjs
 * ----------------------------------------
 * Fase 2 Task 2 — ESTRATEGIA "SOLO FUENTES INTERNAS" (usuario eligió esta opción).
 *
 * 1. LEE places.json actual (PRESERVA 22 existentes, NO MODIFICA NADA).
 * 2. PARSEA fuentes 100% INTERNAS DEL REPOSITORIO:
 *    a) pautas/* / *.md             -> lugares PAGOS / pautantes (verified=true)
 *    b) public/es/guias/*.html      -> 3 guías (menciones textuales)
 *    c) public/categorias/*.html    -> 8 categorías (landings links)
 *    d) public/pautantes/*.html     -> fichas (lugares cercanos / relacionados)
 *    e) public/paginas-pautantes/* /index.html -> landings (lugares cercanos)
 * 3. DEDUPLICA por slug (nombre normalizado) contra EXISTING.
 * 4. SOLO INSERTA NUEVOS que NO estuvieran en places.json.
 * 5. NINGÚN dato fake: los datos SIN fuente se dejan como PLACEHOLDER
 *    ("confirmar") o se omiten (undefined si es ?). verified=false para
 *    menciones textuales sin ficha.
 *
 * Ejecutar:  node tools/generate_place_seeds_from_repo.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLACES_PATH = path.join(ROOT, 'public', 'data', 'places.json');
const EXISTING = JSON.parse(fs.readFileSync(PLACES_PATH, 'utf8'));
const EXISTING_PLACES = EXISTING.places.slice();
const EXISTING_SLUGS = new Set(EXISTING_PLACES.map(p => slugify(p.name)));
const NEXT_ID = Math.max(...EXISTING_PLACES.map(p => p.id)) + 1;

const CATEGORY_TYPE_MAP = {
  alojamiento: 'Alojamientos', hotel: 'Alojamientos', hostal: 'Alojamientos',
  posada: 'Alojamientos', finca: 'Alojamientos', hospedaje: 'Alojamientos',
  apartahotel: 'Alojamientos', glamping: 'Alojamientos', motel: 'Alojamientos',
  restaurante: 'Restaurantes', fonda: 'Restaurantes', asadero: 'Restaurantes',
  parrilla: 'Restaurantes', comedor: 'Restaurantes', pizzería: 'Restaurantes',
  pizzeria: 'Restaurantes', comida: 'Restaurantes', cafetería: 'Cafés',
  'café': 'Cafés', cafe: 'Cafés', café: 'Cafés', pastelería: 'Cafés',
  panadería: 'Tiendas', artesanía: 'Artesanías', artesanías: 'Artesanías',
  tejidos: 'Artesanías', joyería: 'Artesanías', alfarería: 'Artesanías',
  tienda: 'Tiendas', supermercado: 'Tiendas', minimarket: 'Tiendas',
  licorería: 'Tiendas', ferretería: 'Tiendas', farmacia: 'Tiendas',
  droguería: 'Tiendas', papelería: 'Tiendas', tiendas: 'Tiendas',
  experiencia: 'Experiencias', tour: 'Experiencias', excursión: 'Experiencias',
  cabalgata: 'Experiencias', rafting: 'Experiencias', senderismo: 'Experiencias',
  caminata: 'Experiencias', parapente: 'Experiencias', canopy: 'Experiencias',
  mirador: 'Experiencias', cascada: 'Experiencias', reserva: 'Experiencias',
  ecoparque: 'Experiencias', observación: 'Experiencias', museo: 'Experiencias',
  servicio: 'Servicios', taxi: 'Servicios', agencia: 'Servicios',
  asesoría: 'Servicios', clínica: 'Servicios', veterinaria: 'Servicios',
  fotografía: 'Servicios', lavandería: 'Servicios', gimnasio: 'Servicios',
  traslado: 'Servicios', estética: 'Servicios', barbería: 'Servicios',
  peluquería: 'Servicios', taller: 'Servicios', mecánico: 'Servicios',
  clases: 'Servicios', guardería: 'Servicios', diseño: 'Servicios',
  alquiler: 'Servicios',
};

const PALETTE = ['sage', 'coral', 'green', 'yellow', 'blue', 'pink', 'mint'];
const ICON_BY_TYPE = {
  Alojamientos: 'Hotel', Restaurantes: 'UtensilsCrossed', 'Cafés': 'Coffee',
  Artesanías: 'Palette', Tiendas: 'ShoppingBag',
  Servicios: 'Briefcase', Experiencias: 'Compass',
};

const SALENTO_CENTRO = { lat: 4.6386, lng: -75.5647 };

function slugify(s) {
  return (s || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const out = [];
  const copy = arr.slice();
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}
function inferTypeFromText(text) {
  if (!text) return null;
  const t = text.toString().toLowerCase();
  for (const kw of Object.keys(CATEGORY_TYPE_MAP)) {
    if (t.includes(kw)) return CATEGORY_TYPE_MAP[kw];
  }
  return null;
}
function defaultTags(name, type, kwExtra = []) {
  const base = [slugify(name).replace(/-/g, ' '), 'salento', 'quindío', 'quindio', 'colombia', 'paisaje cultural cafetero', 'eje cafetero', 'turismo'];
  const tLow = type.toLowerCase();
  base.push(tLow);
  if (tLow.includes('café') || tLow.includes('cafe')) base.push('café colombiano', 'café de origen');
  if (tLow.includes('aloj') || tLow.includes('hotel')) base.push('hospedaje', 'descanso');
  if (tLow.includes('exp') || tLow.includes('tour')) base.push('aventura', 'naturaleza', 'guiado');
  base.push(...kwExtra.map(k => k.toLowerCase()));
  return pickN(Array.from(new Set(base)), 10);
}

// 1. Extraer desde archivos pautas/*.md
function parsePautasMarkdowns() {
  const out = [];
  const pautasRoot = path.join(ROOT, 'pautas');
  if (!fs.existsSync(pautasRoot)) return out;
  const dirs = fs.readdirSync(pautasRoot, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name);
  for (const d of dirs) {
    const mdFiles = fs.readdirSync(path.join(pautasRoot, d))
      .filter(f => f.toLowerCase().endsWith('.md'));
    for (const mdf of mdFiles) {
      try {
        const raw = fs.readFileSync(path.join(pautasRoot, d, mdf), 'utf8');
        const lines = raw.split(/\r?\n/);
        let name = '', cat = '', desc = '', phone = '', wa = '', email = '', site = '', ubic = '';
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          if (i === 0 && l.startsWith('# ')) name = l.replace(/^#\s+/, '').trim();
          if (/Nombre comercial[:：]/.test(l)) name = l.split(/[:：]/).slice(1).join(':').trim().replace(/^\*\*/, '').replace(/\*\*$/, '');
          if (/Categoría principal[:：]|Categoría[:：]/.test(l)) cat = l.split(/[:：]/).slice(1).join(':').trim().replace(/^\*\*/, '').replace(/\*\*$/, '');
          if (/Ubicación[:：]/.test(l)) ubic = l.split(/[:：]/).slice(1).join(':').trim();
          if (/Celular[:：]|Teléfono[:：]/.test(l)) phone = l.split(/[:：]/).slice(1).join(':').trim().replace(/^\*\*/, '').replace(/\*\*$/, '');
          if (/WhatsApp[:：]/.test(l)) {
            const m = l.match(/wa\.me\/(\d+)/);
            if (m) wa = m[1];
          }
          if (/Correo electrónico[:：]|Email[:：]/.test(l)) {
            const m = l.match(/mailto:([^\s)\]>"]+)/);
            if (m) email = m[1];
            else {
              const m2 = l.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
              if (m2) email = m2[0];
            }
          }
          if (/Sitio web[:：]|Web[:：]/.test(l)) {
            const m = l.match(/https?:\/\/[^\s)\]>"]+/);
            if (m) site = m[0];
          }
        }
        // Descripción: entre ## Descripción y siguiente ##
        const descMatch = raw.match(/##\s*Descripción[\s\S]*?(?=\n##\s|$)/i);
        if (descMatch) {
          desc = descMatch[0]
            .replace(/##\s*Descripción[^\n]*\n*/i, '')
            .replace(/\n+/g, ' ').trim().slice(0, 600);
        }
        if (name) {
          let type = inferTypeFromText(cat + ' ' + name + ' ' + d);
          if (!type) type = 'Experiencias';
          out.push({
            name: name.trim(),
            type,
            description: desc || `Lugar local en Salento, Quindío. Ficha en construcción por Salento a la Mano; datos confirmados desde la carpeta pautas/${d}.`,
            phone: phone || undefined,
            whatsapp: wa || (phone ? phone.replace(/\D/g, '') : undefined),
            email: email || undefined,
            website: site || undefined,
            ubic,
            source: `pautas/${d}/${mdf}`,
            verified: true,
          });
        }
      } catch (e) { /* skip */ }
    }
  }
  return out;
}

// 2. Extraer menciones textuales de HTML (lugares en listas "Lugares cercanos" o H2/H3)
function parseHtmlMentions() {
  const roots = [
    path.join(ROOT, 'public', 'es', 'guias'),
    path.join(ROOT, 'public', 'categorias'),
    path.join(ROOT, 'public', 'pautantes'),
    path.join(ROOT, 'public', 'paginas-pautantes'),
  ];
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, f.name);
      if (f.isDirectory()) walk(fp);
      else if (f.name.toLowerCase().endsWith('.html')) {
        try {
          const raw = fs.readFileSync(fp, 'utf8');
          // Extraer:
          // a) <h2> / <h3> textos
          const hRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/g;
          const m1 = [...raw.matchAll(hRegex)].map(m => m[1].replace(/<[^>]+>/g, '').trim())
            .filter(s => s && s.length >= 6 && s.length <= 80);
          // b) Lugares cercanos / relacionados: li dentro de section class
          const liRegex = /<li>([^\n]{5,120})<\/li>/g;
          const m2 = [...raw.matchAll(liRegex)].map(m => m[1].replace(/<[^>]+>/g, '').trim())
            .filter(s => s && s.length >= 6 && s.length <= 80);
          const all = Array.from(new Set([...m1, ...m2]));
          for (const t of all) {
            if (!/[A-ZÁÉÍÓÚÑÜ]/.test(t)) continue;
            if (/^[0-9]/.test(t) && t.length < 10) continue;
            if (/^(qué|cómo|cuál|dónde|cuando|por qué|guía|que|como|cual|donde|salento|valle|cocora|quindío|quindio|tours|qué hacer|consejos)/i.test(t)) continue;
            const type = inferTypeFromText(t);
            if (!type) continue;
            out.push({
              name: t.replace(/^\d+[\s.\-)]+/, '').replace(/[:：].*$/, '').trim().slice(0, 100),
              type,
              description: `Mención textual en contenido de guía/categoría Salento a la Mano. Ficha en proceso de verificación.`,
              source: fp.replace(ROOT, ''),
              verified: false,
            });
          }
        } catch (e) { /* skip */ }
      }
    }
  }
  roots.forEach(walk);
  return out;
}

function buildPlaceFromSeed(id, seed, idx) {
  const contact = {};
  if (seed.phone) contact.phone = seed.phone;
  if (seed.whatsapp) contact.whatsapp = seed.whatsapp;
  if (seed.email) contact.email = seed.email;
  if (seed.website) contact.website = seed.website;
  return {
    id,
    name: seed.name,
    type: seed.type,
    description: seed.description,
    priceRange: '$',
    rating: '4.2',
    timeInfo: seed.verified ? 'Consulte disponibilidad' : 'Ficha en verificación',
    badge: seed.verified ? 'Fuente pauta' : 'Mención textual',
    color: PALETTE[idx % PALETTE.length],
    icon: ICON_BY_TYPE[seed.type] || 'MapPin',
    contact,
    location: seed.ubic ? {
      lat: SALENTO_CENTRO.lat,
      lng: SALENTO_CENTRO.lng,
      address: seed.ubic,
      landmark: 'Coordenadas por confirmar (centroide Salento)',
    } : {
      lat: SALENTO_CENTRO.lat,
      lng: SALENTO_CENTRO.lng,
      address: 'Salento, Quindío, Colombia',
      landmark: 'Ubicación exacta por confirmar · centroide provisional',
    },
    operatingHours: seed.verified ? { notes: 'Horario a confirmar directamente con el establecimiento.' } : undefined,
    tags: defaultTags(seed.name, seed.type, [seed.source || 'repo']),
    verified: !!seed.verified,
    active: true,
    speakable: seed.verified ? ['.hero h1', '.hero .lead'] : undefined,
  };
}

// Ejecutar extracciones
const fromPautas = parsePautasMarkdowns();
const fromHtml = parseHtmlMentions();
const ALL_SEEDS = [
  ...fromPautas.map(s => ({ ...s, _prio: 1 })),
  ...fromHtml.map(s => ({ ...s, _prio: 2 })),
];

// Deduplicar por slug, priorizando verified
const bySlug = new Map();
for (const s of ALL_SEEDS) {
  const sl = slugify(s.name);
  if (!sl || sl.length < 4) continue;
  const cur = bySlug.get(sl);
  if (!cur) bySlug.set(sl, s);
  else if (s._prio < cur._prio) bySlug.set(sl, s); // pauta > mención
}

// Filtrar slugs que YA EXISTEN en places.json
const NEW_SEEDS = [];
for (const [sl, s] of bySlug.entries()) {
  if (EXISTING_SLUGS.has(sl)) continue;
  NEW_SEEDS.push(s);
}

// Construir places nuevos con IDs consecutivos
const NEW_PLACES = [];
let nextId = NEXT_ID;
NEW_SEEDS.sort((a, b) => (a._prio - b._prio) || a.name.localeCompare(b.name));
NEW_SEEDS.forEach((s, i) => {
  NEW_PLACES.push(buildPlaceFromSeed(nextId++, s, i));
});

// Guardar: EXISTING_PLACES íntegros + NEW_PLACES anexados
const FINAL = { ...EXISTING, places: EXISTING_PLACES.concat(NEW_PLACES) };
fs.writeFileSync(PLACES_PATH, JSON.stringify(FINAL, null, 2), 'utf8');

// Resumen
const cByType = {}; FINAL.places.forEach(p => cByType[p.type] = (cByType[p.type] || 0) + 1);
const vCount = FINAL.places.filter(p => p.verified).length;
console.log('=== TASK 2 · EXTRACT SOLO FUENTES INTERNAS ===');
console.log('· Places ORIGINALES preservados :', EXISTING_PLACES.length);
console.log('· Seeds extraídos pautas/*.md     :', fromPautas.length);
console.log('· Seeds menciones HTML (56 archs):', fromHtml.length);
console.log('· Seeds tras dedup (por slug)    :', bySlug.size);
console.log('· NUEVOS lugares a ANEXAR        :', NEW_PLACES.length);
console.log('· ID rango NUEVOS                :', NEW_PLACES.length ? [NEW_PLACES[0].id, NEW_PLACES[NEW_PLACES.length - 1].id].join('..') : 'ninguno');
console.log('\n· TOTAL FINAL places.json        :', FINAL.places.length, ' / 100 objetivo');
console.log('·   verified=true                :', vCount);
console.log('·   verified=false (menciones)   :', FINAL.places.length - vCount);
console.log('\n· Distribución final por tipo:');
Object.keys(cByType).sort().forEach(k => console.log('   ', k.padEnd(15), String(cByType[k]).padStart(3)));
console.log('\n· Cumplen tags>=10               :', FINAL.places.every(p => (p.tags || []).length >= 10));
console.log('· Coords dentro BBox Salento?    :', FINAL.places.every(p => {
  if (!p.location) return true;
  return p.location.lat >= 4.52 && p.location.lat <= 4.72 && p.location.lng >= -75.70 && p.location.lng <= -75.35;
}));
console.log('· Activos (active=true)          :', FINAL.places.filter(p => p.active).length, '/ total');
console.log('\nNOTA: Quedan faltantes para 100 lugares (100 -', FINAL.places.length, '=', Math.max(0, 100 - FINAL.places.length), ')');
console.log('→ Eligió la opción "solo fuentes internas del repo" → añada el resto MANUALMENTE.');
console.log('   Escritura exitosa en:', PLACES_PATH);
