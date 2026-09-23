import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const dataPath = path.join(publicDir, 'data', 'places.json');
const categoryDir = path.join(publicDir, 'categorias');
const providerDir = path.join(publicDir, 'pautantes');
const providerLandingDir = path.join(publicDir, 'paginas-pautantes');

fs.mkdirSync(categoryDir, { recursive: true });
fs.mkdirSync(providerDir, { recursive: true });
fs.mkdirSync(providerLandingDir, { recursive: true });

const catalog = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const providers = Array.isArray(catalog.places) ? catalog.places : [];

const categoryMeta = {
  Alojamientos: { title: 'Alojamientos', description: 'Hoteles, fincas y hospedajes para descansar en Salento', image: '/imagenes-salento/pueblo.webp' },
  Restaurantes: { title: 'Restaurantes', description: 'Sabor local, cafés y rincones para comer bien en Salento', image: '/imagenes-salento/Trucha-con-camarones-Salento-Quindio-1024x768.jpeg.webp' },
  'Cafés': { title: 'Cafés', description: 'Espacios para tomar café, brunch y momentos tranquilos', image: '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/cafe-don-elias.webp' },
  Artesanías: { title: 'Artesanías', description: 'Productos locales, regalos y cultura hecha a mano', image: '/imagenes-salento/calle.webp' },
  Tiendas: { title: 'Tiendas', description: 'Comercios locales, souvenirs y compras directas', image: '/imagenes-salento/calle.webp' },
  Experiencias: { title: 'Experiencias', description: 'Tour, miradores, senderismo y actividades para vivir Salento', image: '/imagenes-salento/destinos-75.webp' },
  Servicios: { title: 'Servicios', description: 'Transporte, movilidad y ayuda rápida para tu visita', image: '/pautas/cootracocora_ltda/willys.webp' },
};

const categoryNames = Object.keys(categoryMeta);

// Páginas de categoría especiales (fuera de categoryMeta / places.type)
const EXTRA_CATEGORY_CARDS = [
  {
    slug: 'atractivos-turisticos',
    title: 'Atractivos Turísticos',
    description: 'Miradores, cascadas, cabalgatas, motos y el Valle de Cocora',
    image: '/imagenes-salento/destinos-75.webp',
  },
  {
    slug: 'coffee-tours',
    title: 'Coffee Tours',
    description: 'Recorridos por fincas cafeteras y catas del Eje Cafetero',
    image: '/pautas/coffee-tour-finca-don-eduardo/Plantation.webp',
  },
  {
    slug: 'eventos',
    title: 'Eventos',
    description: 'Festivales, celebraciones y agenda cultural de Salento',
    image: '/imagenes-salento/631032744.webp',
  },
  {
    slug: 'restaurante-bar',
    title: 'Restaurantes Bar',
    description: 'Café-bar, coctelería y ambiente nocturno',
    image: '/pautas/boki_mall/hotel-mirador-boquia/images (1).webp',
  },
  {
    slug: 'camping',
    title: 'Camping y Glamping',
    description: 'Aire libre en el Valle de Cocora y cascadas',
    image: '/imagenes-salento/destinos-75.webp',
  },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function brandMark(link = true) {
  const mark = `<img src="/logo_salento2026.webp" alt="Salento a la Mano" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%"/><span>Salento a la Mano</span>`;
  return link ? `<a class="brand" href="/">${mark}</a>` : `<div class="brand">${mark}</div>`;
}

const PAUTANTE_LOGOS = {
  'boki-mall-hotel-el-mirador-de-boquia': '/pautas/boki_mall/hotel-mirador-boquia/logo-hotel-mirador-de-boquia.webp',
  'boki-mall-restaurante-terra': '/pautas/boki_mall/restaurante-terra/terra-restaurante-logo.webp',
  'boki-mall-barcinales-cafe-bar': '/pautas/boki_mall/barcinales-cafe-bar/barcinales-cafe-bar-logo.webp',
  'boki-mall-eventos': '/pautas/boki_mall/boki_mall_logo.webp',
  'moto-aventura-110': '/pautas/moto_aventura_110/imagenes/logo-moto-aventura-110.webp',
  'reserva-natural-cascadas-de-santa-rita': '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.webp',
  'camping-cascadas-de-santa-rita': '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.webp',
  'camping-cascadas-santa-rita': '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.webp',
  'finca-hotel-el-ocaso': '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso.webp',
  'coffee-tour-alojamiento-finca-hotel-el-ocaso': '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso.webp',
  'finca-don-eduardo-coffee-tour': '/pautas/coffee-tour-finca-don-eduardo/logo-finca-don-eduardo.webp',
  'coffee-tour-finca-don-eduardo': '/pautas/coffee-tour-finca-don-eduardo/logo-finca-don-eduardo.webp',
  'coffee-tour-finca-cafetera-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'cootracocora-ltda': '/pautas/cootracocora_ltda/logo-cootracocora.webp',
  'el-recuerdo-coffee-tour': '/pautas/el_recuerdo_coffee_tour/logo-recuerdo-tour.webp',
  'cabalgatas-cocora-magica': '/pautas/cabalgatas_cocora_magica/imagenes/logo-cocora-magica.webp',
  'mahalo-hostel-salento': '/pautas/mahalo_hostel/imagenes/logo-mahalo.webp',
  'mirador-las-manos-de-dios': '/pautas/mirador_mano_de_dios/imagenes/logo-mirador-dios.webp',
  'parque-mirador-la-vida-es-bella': '/pautas/parque-mirador-la-vida-bella/Logolavidabella.webp',
  'hotel-la-floresta-salento': '/pautas/hotel_la_floresta_salento/imagenes/images.webp',
  'hotel-camino-nacional-salento': '/pautas/hotel_camino_nacional/imagenes/631033284.webp',
  'hotel-la-tia-emiss': '/pautas/hotel_tia_emiss/emmis1.jpg',
  'restaurante-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'finca-cafetera-don-elias': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias.webp',
  'fonda-boquia': '/pautas/restaurante_bar_fonda_boquia/imagenes/480508481_1169835038167384_4932382570318530100_n.webp',
  'punto-de-encuentro-jeeps-willys-plaza': '/pautas/cootracocora_ltda/willys.webp',
  'terminal-de-transporte-de-salento-acceso-peatonal': '/pautas/cootracocora_ltda/willys.webp',
  'calle-real-de-salento': '/imagenes-salento/calle.webp',
  'plaza-de-bolivar-de-salento': '/imagenes-salento/pueblo.webp',
  'iglesia-de-nuestra-senora-del-carmen-de-salento': '/imagenes-salento/pueblo.webp',
  'oficina-de-informacion-turistica-de-salento': '/imagenes-salento/pueblo.webp',
  'valle-de-cocora-sendero-de-entrada-libre': '/imagenes-salento/destinos-75.webp',
  'sendero-de-las-palmas-entrada-libre-valle': '/imagenes-salento/destinos-75.webp',
  'puente-de-boquia-sendero-cercano': '/imagenes-salento/destinos-75.webp',
  'mirador-alto-de-la-cruz': '/imagenes-salento/destinos-75.webp',
  'mirador-del-condor-salento': '/imagenes-salento/destinos-75.webp',
  'caminata-ecologica-calle-real-alto-de-la-cruz': '/imagenes-salento/destinos-75.webp',
  'recorrido-cultural-casco-historico': '/imagenes-salento/pueblo.webp',
};

function brandMarkFor(slug) {
  const logo = PAUTANTE_LOGOS[slug];
  if (!logo) return brandMark(true);
  return `<a class="brand" href="/"><img src="/logo_salento2026.webp" alt="Salento a la Mano" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%"/><span>Salento a la Mano</span><span aria-hidden="true" style="opacity:.4">×</span><img src="${logo}" alt="Logo pautante" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%;border:1px solid var(--line)" /></a>`;
}

function bottomNav() {
  return `<nav class="bottom-nav" aria-label="Volver" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:28px"><a class="button primary" href="/">Volver al inicio</a><a class="button dark" href="/">Ir a página principal</a><a class="button" href="/categorias/">Ver categorías</a></nav>`;
}

function whatsappUrl(value) {
  const number = String(value ?? '').replace(/\D/g, '');
  return /^\d{8,15}$/.test(number) ? `https://wa.me/${number}` : '';
}

function phoneUrl(value) {
  const number = String(value ?? '').replace(/[^+\d]/g, '');
  return /^\+?\d{8,15}$/.test(number) ? `tel:${number}` : '';
}

function logoFor(provider) {
  const initials = provider.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `
    <div class="provider-logo" aria-label="Logo de ${escapeHtml(provider.name)}">${escapeHtml(initials || 'S')}</div>
  `;
}

function photoPending(provider, index) {
  return `<div class="photo-pending" aria-label="Foto verificada pendiente para ${escapeHtml(provider.name)}"><span>📷</span><strong>${escapeHtml(provider.name)}</strong><small>Foto verificada pendiente ${index + 1}/3</small></div>`;
}

function providerPhotos(provider) {
  const raw = Array.isArray(provider.photos) && provider.photos.length > 0
    ? provider.photos
    : (Array.isArray(provider.images) && provider.images.length > 0 ? provider.images : []);
  // Política editorial: las fotos de carta/menú son material de extracción, no se publican
  return raw.filter((src) => !/menu-carta/i.test(String(src || '')));
}

// Imagen destacada por pautante en tarjetas de categoría (logo oficial del aliado)
const CARD_IMAGE_OVERRIDES = {
  'cootracocora-ltda': '/pautas/cootracocora_ltda/logo-cootracocora.webp',
};

function cardImageFor(item, category) {
  if (CARD_IMAGE_OVERRIDES[slugify(item.name)]) return CARD_IMAGE_OVERRIDES[slugify(item.name)];
  const photos = providerPhotos(item);
  if (photos[0]) return photos[0].startsWith('http') ? photos[0] : encodeURI(photos[0]);
  return categoryMeta[category]?.image || '/imagenes-salento/destinos-75.webp';
}

function galleryFor(provider) {
  const imgs = providerPhotos(provider);
  const gallery = [];
  for (let i = 0; i < 3; i += 1) {
    const raw = imgs[i];
    if (raw) {
      const url = raw.startsWith('http') ? raw : encodeURI(raw);
      gallery.push(`<img src="${url}" alt="${escapeHtml(provider.name)} foto ${i + 1}" loading="lazy"/>`);
    } else {
      gallery.push(photoPending(provider, i));
    }
  }
  return gallery.join('');
}

function categoryLabelFor(type) {
  return categoryMeta[type]?.title || type;
}

function canonicalTag(pathname) {
  return `<link rel="canonical" href="https://www.salentoalamano.com${pathname}" />`;
}

const FONTS_LINK = `
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" />
`;

function buildBreadcrumbListSchema(items) {
  const list = items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url || undefined,
  }));
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  })}</script>`;
}

function buildSchemaJsonLd(provider) {
  const name = provider.name || 'Servicio local';
  const category = provider.type || 'Servicios';
  const description = provider.description || `Servicio local en Salento, Quindío.`;
  const rawImage = providerPhotos(provider)[0];
  const image = rawImage ? (rawImage.startsWith('http') ? rawImage : encodeURI(rawImage)) : 'https://www.salentoalamano.com/logo_salento2026.webp';
  const url = `/paginas-pautantes/${slugify(name)}/`;
  const telephone = provider.contact?.phone || undefined;
  const whatsapp = provider.contact?.whatsapp ? `+57${String(provider.contact.whatsapp).replace(/\D/g, '')}` : undefined;
  const email = provider.contact?.email || undefined;
  const priceRange = provider.priceRange || '$$';
  const ratingValue = provider.rating ? String(provider.rating).replace(/[^\d.]/g, '') : '4.8';
  const address = {
    '@type': 'PostalAddress',
    addressLocality: 'Salento',
    addressRegion: 'Quindío',
    addressCountry: 'CO',
    streetAddress: provider.location?.address || undefined,
  };
  const geo = provider.location?.lat && provider.location?.lng ? {
    '@type': 'GeoCoordinates',
    latitude: provider.location.lat,
    longitude: provider.location.lng,
  } : { '@type': 'GeoCoordinates', latitude: 4.6371, longitude: -75.5706 };

  let schemaType = 'LocalBusiness';
  let extraFields = {};

  if (category === 'Alojamientos') {
    schemaType = 'Hotel';
    extraFields = {
      starRating: provider.accommodationDetails?.stars
        ? { '@type': 'Rating', ratingValue: provider.accommodationDetails.stars }
        : undefined,
      numberOfRooms: provider.accommodationDetails?.roomTypes?.length || undefined,
      amenityFeature: provider.accommodationDetails?.amenities || provider.accommodationDetails?.services || undefined,
      petsAllowed: undefined,
    };
  } else if (category === 'Restaurantes') {
    schemaType = 'Restaurant';
    extraFields = {
      servesCuisine: provider.foodServiceDetails?.cuisineType || ['Colombiana', 'Local'],
      menu: provider.contact?.website || undefined,
      acceptsReservations: provider.foodServiceDetails?.reservationRequired !== undefined ? provider.foodServiceDetails.reservationRequired : undefined,
    };
  } else if (category === 'Cafés') {
    schemaType = 'CafeOrCoffeeShop';
    extraFields = {
      servesCuisine: ['Café', 'Brunch', 'Local'],
    };
  } else if (category === 'Experiencias') {
    schemaType = 'TouristAttraction';
    extraFields = {
      touristType: ['Local', 'Internacional'],
      duration: provider.experienceDetails?.duration || undefined,
      availableLanguage: provider.experienceDetails?.languages || ['Español'],
    };
  } else if (category === 'Artesanías') {
    schemaType = 'Store';
    extraFields = { additionalType: 'https://schema.org/CraftStore' };
  } else if (category === 'Tiendas') {
    schemaType = 'Store';
  } else if (category === 'Servicios') {
    schemaType = 'LocalBusiness';
    extraFields = { additionalType: 'TourOperator' };
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    description,
    url,
    image,
    address,
    geo,
    telephone: telephone || whatsapp || undefined,
    email,
    priceRange,
    areaServed: {
      '@type': 'City',
      name: 'Salento',
      containedIn: { '@type': 'State', name: 'Quindío' },
    },
    // aggregateRating solo si hay rating REAL (regla Google)
    ...(ratingValue && parseFloat(ratingValue) > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(ratingValue),
        reviewCount: provider.reviewCount || provider.reviews || 1,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    openingHoursSpecification: provider.verified ? {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    } : undefined,
    ...extraFields,
  };

  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderCategoryPage(category, items) {
  const pageTitle = `${categoryMeta[category]?.title || category} | Salento a la Mano`;
  const categorySlug = slugify(category);
  const cards = items.map((item) => {
    const itemSlug = slugify(item.name);
    const whatsapp = whatsappUrl(item.contact?.whatsapp);
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(item.location?.address || `${item.name} Salento`)}`;
    return `
      <article class="provider-card" onclick="window.location.href='/paginas-pautantes/${itemSlug}/'" role="link" tabindex="0" onkeydown="if(event.key==='Enter'){window.location.href='/paginas-pautantes/${itemSlug}/'}" style="cursor:pointer" aria-label="Abrir página de ${escapeHtml(item.name)}">
        <div class="card-image" style="background-image:url('${cardImageFor(item, category)}')"></div>
        <div class="card-body">
          <div class="card-header-row">
            <span class="pill">${escapeHtml(item.type || category)}</span>
            <span class="rating">⭐ ${escapeHtml(item.rating || '4.8')}</span>
          </div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description || 'Servicio de Salento')}</p>
          <div class="meta-row">
            <span>${escapeHtml(item.priceRange || '$$')}</span>
            <span>${escapeHtml(item.timeInfo || 'Reservas directas')}</span>
          </div>
          <div class="card-actions" onclick="event.stopPropagation()">
            <a class="btn primary" href="/paginas-pautantes/${itemSlug}/">Ver página</a>
            <a class="btn" href="${mapUrl}" target="_blank" rel="noreferrer">Cómo llegar</a>
            ${whatsapp ? `<a class="btn whatsapp" href="${whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
  const emptyState = items.length === 0 ? `
      <section class="empty-category" aria-live="polite">
        <span class="empty-category-mark">+</span>
        <div><h2>Próximamente en ${escapeHtml(categoryMeta[category]?.title || category)}</h2><p>Esta categoría ya está lista para recibir pautantes locales. Estamos preparando la información, fotos, horarios y contactos verificados.</p></div>
        <a class="btn primary" href="/index.html#pautas">Publicar mi servicio</a>
      </section>` : '';

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(categoryMeta[category]?.description || pageTitle)}" />
    <title>${pageTitle}</title>
    ${canonicalTag(`/categorias/${categorySlug}.html`)}
    ${FONTS_LINK}
    <style>
      :root {
        --paper: #f5f1e8;
        --ink: #1f2d26;
        --line: #d9d0bf;
        --coral: #dd7f5d;
        --green: #5a7d63;
        --yellow: #e7c77b;
        --white: #fff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0; font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink);
      }
      a { color: inherit; text-decoration: none; }
      .container { max-width: 1100px; margin: 0 auto; padding: 32px 20px 80px; }
      .topbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; }
      .brand { font-size: 20px; font-weight: 700; }
      .brand { display: inline-flex; align-items: center; gap: 10px; }
      .brand-logo { width: 42px; height: 42px; object-fit: contain; border-radius: 50%; }
      .nav-link { background: var(--white); border: 1px solid var(--line); padding: 10px 14px; border-radius: 999px; }
      .hero {
        display: grid; grid-template-columns: 1.25fr .75fr; gap: 0; align-items: stretch; margin-bottom: 28px;
        background: var(--white); border: 1px solid var(--line); border-radius: 24px; overflow: hidden;
        box-shadow: 0 18px 40px rgba(39,54,43,.1);
      }
      .hero-copy { padding: 36px 32px; display: flex; flex-direction: column; justify-content: center; }
      .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: var(--coral); font-weight: 700; }
      h1 { font-size: clamp(2rem, 4vw, 4rem); margin: 12px 0 12px; line-height: .98; }
      .sub { color: #536057; font-size: 1.05rem; line-height: 1.6; }
      .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 20px; }
      .stat { background: #f1eadb; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; }
      .hero-visual {
        background-image: linear-gradient(rgba(15,28,18,.18), rgba(15,28,18,.42)), url('${categoryMeta[category]?.image || '/imagenes-salento/destinos-75.webp'}');
        background-size: cover; background-position: center; min-height: 280px;
      }
      .provider-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; margin-top: 24px;
      }
      .empty-category { display: flex; align-items: center; gap: 18px; margin-top: 24px; padding: 24px; border: 1px dashed var(--coral); background: rgba(255,255,255,.7); }
      .empty-category-mark { display: grid; place-items: center; width: 42px; height: 42px; flex: 0 0 42px; border: 1px solid var(--coral); border-radius: 50%; color: var(--coral); font-size: 25px; }
      .empty-category h2 { margin: 0 0 6px; font: 600 22px Fraunces, serif; }
      .empty-category p { margin: 0; color: #59665f; line-height: 1.5; }
      .provider-card {
        background: var(--white); border: 1px solid var(--line); border-radius: 20px; overflow: hidden;
        box-shadow: 0 8px 24px rgba(39,54,43,.06); transition: transform .2s, box-shadow .2s, border-color .2s;
        display: flex; flex-direction: column;
      }
      .provider-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(39,54,43,.12); border-color: var(--coral); }
      .card-image {
        height: 170px; background-size: cover; background-position: center; width: 100%;
        transition: transform .35s ease;
      }
      .provider-card:hover .card-image { transform: scale(1.04); }
      .card-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
      .card-header-row, .meta-row, .card-actions { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
      .card-header-row { margin-bottom: 10px; }
      .pill { background: #f3ead6; border-radius: 999px; padding: 6px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
      .rating { font-size: 12px; font-weight: 700; }
      h3 { margin: 8px 0 10px; font-size: 1.35rem; }
      .card-body p { margin: 0 0 14px; color: #59665f; line-height: 1.5; font-size: 0.96rem; flex: 1; }
      .meta-row { color: #4d5a51; font-size: 12px; margin-bottom: 16px; }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); font-weight: 700; font-size: 12px;
      }
      .btn.primary { background: var(--ink); color: var(--white); border-color: var(--ink); }
      .btn.whatsapp { background: #25d366; border-color: #25d366; color: #fff; }
      @media (max-width: 760px) {
        .hero { grid-template-columns: 1fr; }
        .hero-visual { min-height: 180px; order: -1; }
        .hero-copy { padding: 24px 20px 28px; }
        .topbar { flex-direction: column; align-items: flex-start; }
        .provider-grid { grid-template-columns: 1fr; }
      }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
    ${buildBreadcrumbListSchema([
      { name: 'Inicio', url: 'https://www.salentoalamano.com/' },
      { name: 'Categorías', url: 'https://www.salentoalamano.com/categorias/' },
      { name: categoryMeta[category]?.title || category },
    ])}
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${categoryMeta[category]?.title || category} | Salento a la Mano`,
      description: categoryMeta[category]?.description || 'Directorio de servicios locales en Salento, Quindío.',
      url: `https://www.salentoalamano.com/categorias/${slugify(category)}.html`,
      inLanguage: 'es',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: items.map((it, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: it.name,
          url: `https://www.salentoalamano.com/paginas-pautantes/${slugify(it.name)}/`
        }))
      }
    })}</script>
  </head>
  <body>
    <div class="container">
      <div class="topbar">
        ${brandMark()}
        <nav class="top-actions"><a class="nav-link" href="/">Inicio</a><a class="nav-link" href="/">Volver al inicio</a></nav>
      </div>

      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">Categoría</div>
          <h1>${escapeHtml(categoryMeta[category]?.title || category)}</h1>
          <div class="sub">${escapeHtml(categoryMeta[category]?.description || 'Servicios de Salento')}</div>
          <div class="stats">
            <div class="stat"><strong>${items.length}</strong> pautantes</div>
            <div class="stat"><strong>Directo</strong> con locales</div>
            <div class="stat"><strong>WhatsApp</strong> en cada ficha</div>
          </div>
        </div>
        <div class="hero-visual" aria-label="${escapeHtml(category)}"></div>
      </section>

      <div class="provider-grid">
        ${cards}
        ${emptyState}
      </div>
    </div>
  </body>
</html>`;
}

function renderRedirectStub(provider) {
  const slug = slugify(provider.name);
  const target = `/paginas-pautantes/${slug}/`;
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(provider.name)} en Salento, Quindío. Ver página oficial con fotos, precios y contacto directo." />
    <title>${escapeHtml(provider.name)} | Salento a la Mano</title>
    ${canonicalTag(target)}
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>window.location.replace(${JSON.stringify(target)});</script>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <div class="container" style="max-width:1184px;margin:0 auto;padding:28px 20px 80px">
      <header class="topbar">${brandMarkFor(slug)}<nav class="top-actions"><a class="button" href="/">Inicio</a><a class="button dark" href="/">Volver al inicio</a></nav></header>
      <main>
        <section class="hero-copy">
          <div class="eyebrow">Página unificada</div>
          <h1>${escapeHtml(provider.name)}</h1>
          <p>Esta ficha ahora vive en la página oficial con toda la información, fotos, precios y contacto directo.</p>
          <div class="actions">
            <a class="button primary" href="${target}">Ir a la página oficial</a>
            <a class="button dark" href="/">Volver al inicio</a>
            <a class="button" href="/categorias/">Ver categorías</a>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>`;
}

function renderProviderPage(provider) {
  const category = provider.type || 'Servicios';
  const categorySlug = slugify(category);
  const hrefBack = `/categorias/${slugify(category)}.html`;
  const whatsapp = whatsappUrl(provider.contact?.whatsapp);
  const phone = phoneUrl(provider.contact?.phone);
  const email = provider.contact?.email || '';
  const website = provider.contact?.website || '';
  const gallery = galleryFor(provider);

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(provider.description || `Conoce ${provider.name} y contacta directamente en Salento, Quindío.`)}" />
    <title>${escapeHtml(provider.name)} | Salento a la Mano</title>
    ${canonicalTag(`/pautantes/${slugify(provider.name)}.html`)}
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
      :root { --paper: #f5f1e8; --ink: #1f2d26; --line: #d9d0bf; --coral: #dd7f5d; --green: #5a7d63; --yellow: #e7c77b; --white: #fff; }
      body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'DM Sans', sans-serif; }
      a { color: inherit; text-decoration: none; }
      .container { max-width: 1200px; margin: 0 auto; padding: 28px 20px 80px; }
      .breadcrumb { color: #59665f; margin-bottom: 20px; }
      .topbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 30px; }
      .brand { font-size: 20px; font-weight: 700; }
      .brand { display: inline-flex; align-items: center; gap: 10px; }
      .brand-logo { width: 42px; height: 42px; object-fit: contain; border-radius: 50%; }
      .back-btn, .pill, .action-btn { border-radius: 999px; }
      .back-btn { background: var(--white); border: 1px solid var(--line); padding: 10px 14px; }
      .hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; align-items: start; }
      .main-panel, .side-panel { background: var(--white); border: 1px solid var(--line); border-radius: 24px; padding: 24px; }
      .provider-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
      .provider-logo { width: 72px; height: 72px; border-radius: 18px; background: linear-gradient(135deg, var(--coral), var(--yellow)); display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 1.5rem; }
      .provider-name { margin: 0; font-size: clamp(2rem, 4vw, 3rem); }
      .meta { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
      .pill { display: inline-flex; background: #f3ead6; border: 1px solid var(--line); padding: 7px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
      .description { color: #535f55; line-height: 1.7; font-size: 1rem; }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
      .action-btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 16px; font-weight: 700; border: 1px solid var(--line); }
      .action-btn.primary { background: #25d366; color: #fff; border-color: #25d366; }
      .action-btn.secondary { background: var(--ink); color: var(--white); border-color: var(--ink); }
      .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
      .gallery img { width: 100%; height: 170px; object-fit: cover; border-radius: 16px; border: 1px solid var(--line); }
      .info-list { display: grid; gap: 12px; margin-top: 18px; }
      .info-item { padding: 12px 0; border-bottom: 1px solid var(--line); }
      .info-item strong { display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; color: #5e695f; }
      .info-item span, .info-item a { color: var(--ink); }
      .tags { display: flex; flex-wrap: wrap; gap: 8px; }
      .tag { background: #f3ead6; border: 1px solid var(--line); border-radius: 999px; padding: 7px 10px; font-size: 11px; }
      @media (max-width: 800px) { .hero { grid-template-columns: 1fr; } .gallery { grid-template-columns: 1fr; } }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <div class="container">
      <div class="breadcrumb"><a href="/">Inicio</a> / <a href="${hrefBack}">${escapeHtml(categoryLabelFor(category))}</a> / ${escapeHtml(provider.name)}</div>
      <div class="topbar">
        ${brandMarkFor(slugify(provider.name))}
        <div class="topbar-actions">
          <a class="back-btn" href="/">Inicio</a>
          <a class="back-btn" href="/paginas-pautantes/${slugify(provider.name)}/">Página del pautante</a>
          <a class="back-btn" href="${hrefBack}">← Volver a ${escapeHtml(categoryLabelFor(category))}</a>
        </div>
      </div>

      <div class="hero">
        <section class="main-panel">
          <div class="provider-row">
            ${logoFor(provider)}
            <div>
              <div class="meta">
                <span class="pill">${escapeHtml(categoryLabelFor(category))}</span>
                <span class="pill">⭐ ${escapeHtml(provider.rating || '4.8')}</span>
              </div>
              <h1 class="provider-name">${escapeHtml(provider.name)}</h1>
            </div>
          </div>

          <p class="description">${escapeHtml(provider.description || 'Servicio destacado en Salento.')}</p>

          <div class="actions">
            ${whatsapp ? `<a class="action-btn primary" href="${whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>` : '<span class="muted">WhatsApp por confirmar</span>'}
            ${phone ? `<a class="action-btn secondary" href="${phone}">Llamar</a>` : ''}
            ${website ? `<a class="action-btn secondary" href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Web</a>` : ''}
          </div>

          <div class="gallery">
            ${gallery}
          </div>
        </section>

        <aside class="side-panel">
          <div class="info-list">
            <div class="info-item"><strong>Dirección</strong><span>${escapeHtml(provider.location?.address || 'Sin dirección registrada')}</span></div>
            <div class="info-item"><strong>Referencia</strong><span>${escapeHtml(provider.location?.landmark || 'Sin referencia')}</span></div>
            <div class="info-item"><strong>Horario</strong><span>${escapeHtml(provider.operatingHours?.notes || provider.operatingHours?.monday || 'Horario por confirmar')}</span></div>
            <div class="info-item"><strong>Precio</strong><span>${escapeHtml(provider.priceRange || '$$')}</span></div>
            <div class="info-item"><strong>Contacto</strong>
              ${phone ? `<div><a href="${phone}">${escapeHtml(provider.contact?.phone)}</a></div>` : ''}
              ${email ? `<div><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>` : ''}
              ${whatsapp ? `<div><a href="${whatsapp}" target="_blank" rel="noreferrer">WhatsApp directo</a></div>` : ''}
            </div>
          </div>
        </aside>
      </div>

      <section class="main-panel" style="margin-top: 24px;">
        <h2>Información y servicios</h2>
        <div class="tags">
          ${(provider.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || '<span class="tag">Servicio local</span>'}
        </div>

        <div class="info-list">
          <div class="info-item"><strong>Descripcion</strong><span>${escapeHtml(provider.description || 'No hay descripción adicional.')}</span></div>
          <div class="info-item"><strong>Experiencia</strong><span>${escapeHtml(provider.experienceDetails?.duration || provider.foodServiceDetails?.averagePrice || provider.accommodationDetails?.categoryLabel || 'Información disponible con el local')}</span></div>
          <div class="info-item"><strong>Cómo llegar</strong><span><a href="https://www.google.com/maps/search/${encodeURIComponent(provider.location?.address || provider.name + ' Salento')}" target="_blank" rel="noreferrer">Abrir en Google Maps</a></span></div>
        </div>
      </section>
      ${bottomNav()}
    </div>
  </body>
</html>`;
}

const MENU_CAT_LABELS = {
  truchas: 'Truchas',
  carnes: 'Carnes',
  acomponamientos: 'Acompañamientos',
  acompanamientos: 'Acompañamientos',
  adicionales: 'Adicionales',
  desayuno: 'Desayunos',
  desayunos: 'Desayunos y bebidas',
  bebidas: 'Bebidas',
  especialidades: 'Especialidades',
  carta: 'En la carta',
  habitaciones: 'Habitaciones',
  servicios: 'Servicios',
  planes: 'Planes',
  plan: 'Plan',
  rutas: 'Rutas',
  productos: 'Productos',
  experiencia: 'Experiencia',
  incluye: 'Incluye',
  tours: 'Tours',
  ambiente: 'Ambiente',
  cotizar: 'Cotizar',
  mudas: 'Opciones',
  atracciones: 'Atracciones',
  requisitos: 'Requisitos',
};

const FONDA_DISH_IMGS = {
  'fonda-01': '/pautas/restaurante_bar_fonda_boquia/imagenes/481970368_1182179880266233_2620181488091833302_n.webp',
  'fonda-02': '/pautas/restaurante_bar_fonda_boquia/imagenes/481917729_1182180286932859_1362131829553801165_n.webp',
  'fonda-03': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-04': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-05': '/pautas/restaurante_bar_fonda_boquia/imagenes/487330322_1197294652088089_7040377348548028698_n.webp',
  'fonda-06': '/pautas/restaurante_bar_fonda_boquia/imagenes/481917729_1182180286932859_1362131829553801165_n.webp',
  'fonda-07': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-08': '/pautas/restaurante_bar_fonda_boquia/imagenes/487330322_1197294652088089_7040377348548028698_n.webp',
  'fonda-09': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-10': '/pautas/restaurante_bar_fonda_boquia/imagenes/487330322_1197294652088089_7040377348548028698_n.webp',
  'fonda-11': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-12': '/pautas/restaurante_bar_fonda_boquia/imagenes/65375183_1331615080320675_8125305373516103680_n.webp',
  'fonda-13': '/pautas/restaurante_bar_fonda_boquia/imagenes/481961056_1182180233599531_8927232009685756092_n.webp',
  'fonda-14': '/pautas/restaurante_bar_fonda_boquia/imagenes/481961056_1182180233599531_8927232009685756092_n.webp',
  'fonda-15': '/pautas/restaurante_bar_fonda_boquia/imagenes/481961056_1182180233599531_8927232009685756092_n.webp',
  'fonda-16': '/pautas/restaurante_bar_fonda_boquia/imagenes/481970368_1182179880266233_2620181488091833302_n.webp',
  'fonda-17': '/pautas/restaurante_bar_fonda_boquia/imagenes/480508481_1169835038167384_4932382570318530100_n.webp',
  'fonda-18': '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  'fonda-19': '/pautas/restaurante_bar_fonda_boquia/imagenes/30411747_1017613001720886_1046791999434260480_n.webp',
  'fonda-21': '/pautas/restaurante_bar_fonda_boquia/imagenes/29389126_1005353112946875_6049563033867386880_n.webp',
  'fonda-23': '/pautas/restaurante_bar_fonda_boquia/imagenes/30411747_1017613001720886_1046791999434260480_n.webp',
};

function parsePriceText(text) {
  const m = String(text || '').match(/\$\s*([\d.,]+)/);
  if (!m) return 0;
  const n = Number(m[1].replace(/\./g, '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function stripPriceText(text) {
  return String(text || '')
    .replace(/\s*\$\s*[\d.,]+(\s*(COP|cop))?/g, '')
    .replace(/\s+por\s+(persona|noche|pareja|hora|día|dia)\b.*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function menuImgPool(provider) {
  return providerPhotos(provider).filter((src) => !/logo/i.test(String(src || '')));
}

const VERIFIED_MENUS = {
  'fonda-boquia': {
    heading: 'Nuestra carta',
    intro: 'Toca los platos para armar tu pedido. Al final, envíalo por WhatsApp. Sin app ni pasarela de pago.',
    precioLabel: 'c/u',
    items: [
      { cat: 'especialidades', nombre: 'Trucha frita', precio: 28000, id: 'fonda-01' },
      { cat: 'especialidades', nombre: 'Trucha a la plancha', precio: 28000, id: 'fonda-02' },
      { cat: 'especialidades', nombre: 'Trucha finas hierbas', precio: 30000, id: 'fonda-03' },
      { cat: 'especialidades', nombre: 'Trucha al ajillo', precio: 32000, id: 'fonda-04' },
      { cat: 'especialidades', nombre: 'Trucha hawaiana', precio: 30000, id: 'fonda-05' },
      { cat: 'especialidades', nombre: 'Trucha criolla', precio: 30000, id: 'fonda-06' },
      { cat: 'especialidades', nombre: 'Trucha con champiñones', precio: 36000, id: 'fonda-07' },
      { cat: 'especialidades', nombre: 'Trucha gratinada', precio: 36000, id: 'fonda-08' },
      { cat: 'especialidades', nombre: 'Trucha al ajillo más champiñones', precio: 40000, id: 'fonda-09' },
      { cat: 'especialidades', nombre: 'Trucha mixta', precio: 46000, id: 'fonda-10' },
      { cat: 'especialidades', nombre: 'Trucha marinera', precio: 45000, id: 'fonda-11' },
      { cat: 'especialidades', nombre: 'Mojarra', precio: 38000, id: 'fonda-12' },
      { cat: 'carnes', nombre: 'Chorizo', precio: 15000, id: 'fonda-13' },
      { cat: 'carnes', nombre: 'Carne de res', precio: 45000, id: 'fonda-13' },
      { cat: 'carnes', nombre: 'Filete de pollo', precio: 35000, id: 'fonda-14' },
      { cat: 'carnes', nombre: 'Lomo de cerdo', precio: 36000, id: 'fonda-15' },
      { cat: 'carnes', nombre: 'Filete de pollo BBQ', precio: 37000, id: 'fonda-14' },
      { cat: 'carnes', nombre: 'Lomo de cerdo BBQ', precio: 38000, id: 'fonda-15' },
      { cat: 'carnes', nombre: 'Lomo de cerdo hawaiano', precio: 38000, id: 'fonda-15' },
      { cat: 'adicionales', nombre: 'Porción de arroz', precio: 4000, id: 'fonda-16' },
      { cat: 'adicionales', nombre: 'Porción de ensalada', precio: 5000, id: 'fonda-18' },
      { cat: 'adicionales', nombre: 'Papas a la francesa', precio: 8000, id: 'fonda-19' },
      { cat: 'adicionales', nombre: 'Empanada', precio: 3000, id: 'fonda-17' },
      { cat: 'adicionales', nombre: 'Patacón', precio: 8000, id: 'fonda-16' },
      { cat: 'adicionales', nombre: 'Crema de trucha', precio: 10000, id: 'fonda-18' },
      { cat: 'adicionales', nombre: 'Salchipapa', precio: 18000, id: 'fonda-19' },
      { cat: 'adicionales', nombre: 'Patacón con hogao', precio: 16000, id: 'fonda-16' },
      { cat: 'adicionales', nombre: 'Patacón con queso', precio: 18000, id: 'fonda-16' },
      { cat: 'adicionales', nombre: 'Nuggets', precio: 18000, id: 'fonda-20' },
      { cat: 'adicionales', nombre: 'Porción de queso', precio: 5000, id: 'fonda-18' },
      { cat: 'desayunos', nombre: 'Huevos al gusto', precio: 14000, id: 'fonda-20' },
      { cat: 'desayunos', nombre: 'Caldo', precio: 16000, id: 'fonda-18' },
      { cat: 'desayunos', nombre: 'Chorizo en desayuno', precio: 18000, id: 'fonda-13' },
      { cat: 'desayunos', nombre: 'Adición de calentado', precio: 6000, id: 'fonda-20' },
      { cat: 'bebidas', nombre: 'Limonada (vaso)', precio: 5000, id: 'fonda-23' },
      { cat: 'bebidas', nombre: 'Jugo natural en agua', precio: 8000, id: 'fonda-21' },
      { cat: 'bebidas', nombre: 'Jugo natural en leche', precio: 10000, id: 'fonda-22' },
      { cat: 'bebidas', nombre: 'Milo frío', precio: 12000, id: 'fonda-23' },
      { cat: 'bebidas', nombre: 'Limonada de coco', precio: 12000, id: 'fonda-23' },
      { cat: 'bebidas', nombre: 'Media jarra de limonada', precio: 8000, id: 'fonda-23' },
      { cat: 'bebidas', nombre: 'Jarra de limonada', precio: 15000, id: 'fonda-23' },
    ],
  },
  'camping-cascadas-de-santa-rita': {
    heading: 'Habitaciones, camping y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'planes', nombre: 'Pasadía', precio: 11000, desc: 'Acceso a senderos, piscina natural, cascadas y miradores' },
      { cat: 'planes', nombre: 'Camping por noche', precio: 28000, desc: 'Incluye caminata, piscina, cascadas, cavernas y túnel. Traer implementos; se vende madera y carbón' },
      { cat: 'habitaciones', nombre: 'Habitación (pareja)', precio: 140000, desc: 'Incluye desayuno y acceso a senderos, piscina, cascadas, cavernas y túnel. Mascota: $15.000' },
      { cat: 'servicios', nombre: 'Desayuno', precio: 12000 },
      { cat: 'servicios', nombre: 'Calentado', precio: 15000 },
      { cat: 'servicios', nombre: 'Almuerzo', precio: 18000 },
      { cat: 'servicios', nombre: 'Trucha', precio: 28000 },
      { cat: 'servicios', nombre: 'Parqueadero', precio: 0, desc: 'Gratis para moto y carro' },
    ],
  },
  'reserva-natural-cascadas-de-santa-rita': {
    heading: 'Entrada y servicios',
    intro: 'Elige el plan o lo que quieras incluir y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'planes', nombre: 'Pasadía', precio: 11000, desc: 'Senderismo, piscina natural, cascadas y segunda cascada/mirador' },
      { cat: 'planes', nombre: 'Camping por noche', precio: 28000, desc: 'Incluye senderos, piscina, cascadas, cavernas y túnel' },
      { cat: 'habitaciones', nombre: 'Habitación (pareja)', precio: 140000, desc: 'Incluye desayuno. Mascota: $15.000' },
      { cat: 'servicios', nombre: 'Desayuno', precio: 12000 },
      { cat: 'servicios', nombre: 'Calentado', precio: 15000 },
      { cat: 'servicios', nombre: 'Almuerzo', precio: 18000 },
      { cat: 'servicios', nombre: 'Trucha', precio: 28000 },
      { cat: 'servicios', nombre: 'Parqueadero', precio: 0, desc: 'Gratis para moto y carro' },
    ],
  },
  'moto-aventura-110': {
    heading: 'Tiempos y tarifas',
    intro: 'Selecciona el tiempo de pista y coordina tu visita por WhatsApp.',
    precioLabel: 'por sesión',
    items: [
      { cat: 'planes', nombre: '10 minutos en pista', precio: 15000, desc: 'Minimoto 110cc. Incluye casco, protecciones y póliza' },
      { cat: 'planes', nombre: '15 minutos en pista', precio: 20000, desc: 'Minimoto 110cc. Incluye casco, protecciones y póliza' },
      { cat: 'planes', nombre: '20 minutos en pista', precio: 25000, desc: 'Minimoto 110cc. Incluye casco, protecciones y póliza' },
      { cat: 'incluye', nombre: 'Casco', precio: 0 },
      { cat: 'incluye', nombre: 'Protecciones', precio: 0 },
      { cat: 'incluye', nombre: 'Póliza de seguro', precio: 0 },
      { cat: 'requisitos', nombre: 'Estatura mínima 130 cm', precio: 0 },
      { cat: 'requisitos', nombre: 'Saber manejar bicicleta', precio: 0 },
    ],
  },
  'finca-don-eduardo-coffee-tour': {
    heading: 'Tours y experiencias',
    intro: 'Elige el tour y envía tu solicitud por WhatsApp. Pago con tarjeta +6%.',
    precioLabel: 'por persona',
    items: [
      { cat: 'tours', nombre: 'English Coffee Tour', precio: 100000, desc: '3 horas · Lun–sáb 9:30 AM y 2:30 PM' },
      { cat: 'tours', nombre: 'Recorrido en Español', precio: 100000, desc: '3 horas · Lun–sáb 10:40 AM · mín. 2 personas' },
      { cat: 'cotizar', nombre: 'Private Tour personalizado', precio: 0, desc: 'Cotización directa · pago con tarjeta +6%' },
      { cat: 'incluye', nombre: 'Historia y proceso del café', precio: 0 },
      { cat: 'incluye', nombre: 'Visita a plantación', precio: 0 },
      { cat: 'incluye', nombre: 'Tostión y molienda del propio café', precio: 0 },
      { cat: 'incluye', nombre: 'Degustación de café especial', precio: 0 },
    ],
  },
  'coffee-tour-finca-don-eduardo': {
    heading: 'Tours y experiencias',
    intro: 'Elige el tour y envía tu solicitud por WhatsApp. Pago con tarjeta +6%.',
    precioLabel: 'por persona',
    items: [
      { cat: 'tours', nombre: 'English Coffee Tour', precio: 100000, desc: '3 horas · Lun–sáb 9:30 AM y 2:30 PM' },
      { cat: 'tours', nombre: 'Recorrido en Español', precio: 100000, desc: '3 horas · Lun–sáb 10:40 AM · mín. 2 personas' },
      { cat: 'cotizar', nombre: 'Private Tour personalizado', precio: 0, desc: 'Cotización directa · pago con tarjeta +6%' },
      { cat: 'incluye', nombre: 'Historia y proceso del café', precio: 0 },
      { cat: 'incluye', nombre: 'Visita a plantación', precio: 0 },
      { cat: 'incluye', nombre: 'Tostión y molienda del propio café', precio: 0 },
      { cat: 'incluye', nombre: 'Degustación de café especial', precio: 0 },
    ],
  },
  'finca-cafetera-don-elias': {
    heading: 'Tours y productos',
    intro: 'Elige el tour o el café para llevar y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'tours', nombre: 'Coffee Tour compartido (ES/EN)', precio: 75000, desc: '1h 15min · ~$18 USD/pax · salidas cada hora 9:00–16:00' },
      { cat: 'tours', nombre: 'Private Tour inglés', precio: 80000, desc: '1h 30min · ~$20 USD/pax' },
      { cat: 'tours', nombre: 'Private Tour francés', precio: 84000, desc: '1h 30min · ~$21 USD/pax' },
      { cat: 'tours', nombre: 'Niños menores de 12 años', precio: 0, desc: 'Gratis' },
      { cat: 'productos', nombre: 'Café Tradicional (molido o grano)', precio: 40000 },
      { cat: 'productos', nombre: 'Café Grano Premium', precio: 50000 },
      { cat: 'productos', nombre: 'Café Molido Premium', precio: 50000 },
      { cat: 'productos', nombre: 'Taza Colombia', precio: 18000 },
      { cat: 'productos', nombre: 'Café Natural Premium (pre-orden)', precio: 75000 },
      { cat: 'productos', nombre: 'Café Honey (pre-orden)', precio: 43000 },
      { cat: 'productos', nombre: 'Café Honey Premium (pre-orden)', precio: 52500 },
      { cat: 'incluye', nombre: 'Caminata guiada y degustación', precio: 0 },
      { cat: 'incluye', nombre: 'Cascada de la Abuela y Río Quindío', precio: 0 },
    ],
  },
  'coffee-tour-finca-cafetera-don-elias': {
    heading: 'Tours y productos',
    intro: 'Elige el tour o el café para llevar y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'tours', nombre: 'Coffee Tour compartido (ES/EN)', precio: 75000, desc: '1h 15min · ~$18 USD/pax · salidas cada hora 9:00–16:00' },
      { cat: 'tours', nombre: 'Private Tour inglés', precio: 80000, desc: '1h 30min · ~$20 USD/pax' },
      { cat: 'tours', nombre: 'Private Tour francés', precio: 84000, desc: '1h 30min · ~$21 USD/pax' },
      { cat: 'tours', nombre: 'Niños menores de 12 años', precio: 0, desc: 'Gratis' },
      { cat: 'productos', nombre: 'Café Tradicional (molido o grano)', precio: 40000 },
      { cat: 'productos', nombre: 'Café Grano Premium', precio: 50000 },
      { cat: 'productos', nombre: 'Café Molido Premium', precio: 50000 },
      { cat: 'productos', nombre: 'Taza Colombia', precio: 18000 },
      { cat: 'productos', nombre: 'Café Natural Premium (pre-orden)', precio: 75000 },
      { cat: 'productos', nombre: 'Café Honey (pre-orden)', precio: 43000 },
      { cat: 'productos', nombre: 'Café Honey Premium (pre-orden)', precio: 52500 },
      { cat: 'incluye', nombre: 'Caminata guiada y degustación', precio: 0 },
      { cat: 'incluye', nombre: 'Cascada de la Abuela y Río Quindío', precio: 0 },
    ],
  },
  'finca-hotel-el-ocaso': {
    heading: 'Habitaciones, tours y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Habitación Tabi (Queen)', precio: 315000, desc: '1–2 pax · ~$280k–$350k/noche según temporada' },
      { cat: 'habitaciones', nombre: 'Habitación Arábiga (Doble)', precio: 315000, desc: '1–2 pax · ~$280k–$350k/noche según temporada' },
      { cat: 'habitaciones', nombre: 'Habitación Borbón (Doble)', precio: 315000, desc: '1–2 pax · ~$280k–$350k/noche según temporada' },
      { cat: 'habitaciones', nombre: 'Habitación Caturra', precio: 315000, desc: '3–5 pax · doble + 2 twin' },
      { cat: 'habitaciones', nombre: 'Casa completa', precio: 315000, desc: 'Hasta 10 pax · toda la finca' },
      { cat: 'tours', nombre: 'Coffee Tour Tradicional', precio: 40000, desc: '1.5 hrs · no requiere reserva · ES 10am/3pm' },
      { cat: 'tours', nombre: 'Coffee Tour Premium', precio: 100000, desc: '3 hrs · requiere reserva · ES 9am / EN 2pm' },
      { cat: 'planes', nombre: 'Avistamiento de aves privado', precio: 200000, desc: 'Desde $200.000' },
      { cat: 'servicios', nombre: 'Coffee Tour Tradicional incluido', precio: 0 },
      { cat: 'servicios', nombre: 'Desayuno tradicional', precio: 0 },
      { cat: 'servicios', nombre: 'Wi-Fi, caja de seguridad, parqueadero', precio: 0 },
      { cat: 'servicios', nombre: 'Cocina equipada y salón con chimenea', precio: 0 },
      { cat: 'servicios', nombre: 'Kiosko con parrilla y hamacas', precio: 0 },
    ],
  },
  'hotel-la-floresta-salento': {
    heading: 'Habitaciones y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Habitación estándar / doble / triple / cuádruple / familiar', precio: 131500, desc: 'Desde $124.000–$139.000/noche' },
      { cat: 'habitaciones', nombre: 'Suite con jacuzzi (queen/king)', precio: 0, desc: 'Tarifa superior · consultar' },
      { cat: 'habitaciones', nombre: 'Paquete parejas con masajes', precio: 0, desc: 'Por confirmar con el hotel' },
      { cat: 'servicios', nombre: 'Coffee Spa', precio: 0, desc: 'Masajes, faciales, aromaterapia, body wraps' },
      { cat: 'servicios', nombre: 'Desayuno con vista (7:00–10:00)', precio: 0 },
      { cat: 'servicios', nombre: 'Gimnasio y zona de hamacas', precio: 0 },
      { cat: 'servicios', nombre: 'Coworking con internet', precio: 0 },
      { cat: 'servicios', nombre: 'Parqueadero, Wi-Fi, recepción 24h', precio: 0 },
      { cat: 'servicios', nombre: 'Talleres de cocina y avistamiento de aves', precio: 0 },
    ],
  },
  'mirador-las-manos-de-dios': {
    heading: 'Entrada y atracciones',
    intro: 'Elige tu visita y pide información o guía por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'planes', nombre: 'Entrada general', precio: 12000, desc: 'Referencia Cocoratours; puede variar $15.000–$20.000 según sección' },
      { cat: 'atracciones', nombre: 'Escultura Las Manos de Dios', precio: 0, desc: 'Vista a Armenia, Circasia y Filandia' },
      { cat: 'atracciones', nombre: 'Réplica de cóndor andino', precio: 0 },
      { cat: 'atracciones', nombre: 'Réplica del Poporo Quimbayo', precio: 0 },
      { cat: 'atracciones', nombre: 'Espoto para foto con Willys jeep', precio: 0 },
      { cat: 'atracciones', nombre: 'Estación de café', precio: 0 },
    ],
  },
  'cootracocora-ltda': {
    heading: 'Rutas y tarifas',
    intro: 'Selecciona la ruta y coordina el transporte directo por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'rutas', nombre: 'Salento → Valle de Cocora → Salento (compartido)', precio: 3600, desc: 'Jeep Willys · desde $3.600 · tarifa exacta según ruta y temporada' },
      { cat: 'servicios', nombre: 'Salidas al completar cupo', precio: 0, desc: 'Lun–dom 6:00 AM–9:00 PM · Plaza / Terminal Jeep Willys' },
    ],
  },
  'cabalgatas-cocora-magica': {
    heading: 'Cabalgatas y tours',
    intro: 'Elige el plan o lo que quieras incluir y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'planes', nombre: 'Tour Valle del Cocora a caballo', precio: 120000, desc: 'Rango zona $110.000–$480.000 según tour · confirmar operador' },
      { cat: 'planes', nombre: 'Cabalgata corta', precio: 0, desc: 'Por confirmar con operador' },
      { cat: 'planes', nombre: 'Cabalgata media', precio: 0, desc: 'Por confirmar con operador' },
      { cat: 'planes', nombre: 'Cabalgata larga o personalizada', precio: 0, desc: 'Por confirmar con operador' },
      { cat: 'incluye', nombre: 'Guía u operador', precio: 0 },
      { cat: 'incluye', nombre: 'Ruta en caballo y seguridad básica', precio: 0 },
      { cat: 'incluye', nombre: 'Cascos y protección', precio: 0 },
    ],
  },
  'hotel-camino-nacional-salento': {
    heading: 'Habitaciones y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Doble estándar (24 m²)', precio: 0, desc: 'Desde ~$29 USD/noche · rango OTA $60–$81 USD · consultar COP' },
      { cat: 'habitaciones', nombre: 'Doble con balcón (12 m²)', precio: 0, desc: 'Consultar tarifa' },
      { cat: 'habitaciones', nombre: 'Superior Queen (15 m², balcón)', precio: 0, desc: 'Consultar tarifa' },
      { cat: 'habitaciones', nombre: 'Familiar', precio: 0, desc: 'Consultar tarifa · cuna disponible' },
      { cat: 'servicios', nombre: 'Wi-Fi gratis', precio: 0 },
      { cat: 'servicios', nombre: 'Seguridad y recepción 24 horas', precio: 0 },
      { cat: 'servicios', nombre: 'Cambio de divisas y consigna', precio: 0 },
      { cat: 'servicios', nombre: 'Traslado al aeropuerto (pago adicional)', precio: 0 },
      { cat: 'servicios', nombre: 'Desayuno en habitación disponible', precio: 0 },
    ],
  },
  'hotel-la-tia-emiss': {
    heading: 'Habitaciones y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Doble matrimonial (2 pax)', precio: 0, desc: 'Desde ~$61 USD · confirmar tarifa directo' },
      { cat: 'habitaciones', nombre: 'Twin (4 pax)', precio: 0, desc: 'Confirmar tarifa directo' },
      { cat: 'habitaciones', nombre: 'Triple (6 pax)', precio: 0, desc: 'Confirmar tarifa directo' },
      { cat: 'habitaciones', nombre: 'Dúplex familiar (8 pax)', precio: 0, desc: 'Confirmar tarifa directo' },
      { cat: 'servicios', nombre: 'Wi-Fi gratis', precio: 0 },
      { cat: 'servicios', nombre: 'Desayuno destacado', precio: 0 },
      { cat: 'servicios', nombre: 'Jardín y terraza', precio: 0 },
      { cat: 'servicios', nombre: 'Mascotas permitidas', precio: 0 },
    ],
  },
  'restaurante-don-elias': {
    heading: 'Nuestra carta',
    intro: 'Toca los platos para armar tu pedido. Al final, envíalo por WhatsApp. Sin app ni pasarela de pago.',
    precioLabel: 'c/u',
    items: [
      { cat: 'carta', nombre: 'Platos de la casa', precio: 0, desc: 'Precio por confirmar con el restaurante' },
      { cat: 'carta', nombre: 'Menú local o típico', precio: 0, desc: 'Precio por confirmar con el restaurante' },
      { cat: 'carta', nombre: 'Bebidas y acompañamientos', precio: 0, desc: 'Precio por confirmar con el restaurante' },
      { cat: 'servicios', nombre: 'Reserva o pedido por WhatsApp', precio: 0 },
    ],
  },
  'boki-mall-restaurante-terra': {
    heading: 'Restaurante Terra',
    intro: 'Toca las opciones para armar tu consulta o reserva. Al final, envíalo por WhatsApp.',
    precioLabel: 'c/u',
    items: [
      { cat: 'carta', nombre: 'Platos vegetarianos', precio: 0, desc: 'Consultar disponibilidad y precio' },
      { cat: 'carta', nombre: 'Platos veganos', precio: 0, desc: 'Consultar disponibilidad y precio' },
      { cat: 'carta', nombre: 'Opciones libres de gluten', precio: 0, desc: 'Consultar disponibilidad y precio' },
      { cat: 'carta', nombre: 'Menú especial para niños', precio: 0, desc: 'Consultar disponibilidad y precio' },
      { cat: 'servicios', nombre: 'Reserva recomendada (fines de semana)', precio: 0, desc: 'Horario 7:00 AM–9:00 PM' },
    ],
  },
  'boki-mall-barcinales-cafe-bar': {
    heading: 'Café y bar',
    intro: 'Toca las opciones para armar tu consulta. Al final, envíalo por WhatsApp.',
    precioLabel: 'c/u',
    items: [
      { cat: 'bebidas', nombre: 'Café de especialidad', precio: 0, desc: 'Consultar carta en sitio' },
      { cat: 'bebidas', nombre: 'Cócteles', precio: 0, desc: 'Consultar carta en sitio' },
      { cat: 'servicios', nombre: 'Zona de eventos y celebraciones privadas', precio: 0 },
    ],
  },
  'boki-mall-eventos': {
    heading: 'Eventos y celebraciones',
    intro: 'Selecciona lo que necesites y envía tu solicitud por WhatsApp.',
    precioLabel: 'consultar',
    items: [
      { cat: 'planes', nombre: 'Celebraciones privadas', precio: 0, desc: 'Cotizar con Boki Mall' },
      { cat: 'planes', nombre: 'Eventos corporativos', precio: 0, desc: 'Cotizar con Boki Mall' },
      { cat: 'servicios', nombre: 'Espacio con ambiente cafetero', precio: 0 },
    ],
  },
  'boki-mall-hotel-el-mirador-de-boquia': {
    heading: 'Habitaciones y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Habitación (9 opciones con nombre)', precio: 0, desc: 'Check-in 15:00 · check-out 12:00 · consultar tarifa' },
      { cat: 'servicios', nombre: 'Desayuno incluido en algunas tarifas', precio: 0 },
      { cat: 'servicios', nombre: 'Parqueadero privado gratuito', precio: 0 },
      { cat: 'servicios', nombre: 'Wi-Fi, agua caliente, TV por cable', precio: 0 },
      { cat: 'servicios', nombre: 'Pet Friendly y room service', precio: 0 },
      { cat: 'servicios', nombre: 'Estación de café gratuita', precio: 0 },
      { cat: 'servicios', nombre: 'Traslado al aeropuerto (costo adicional)', precio: 0 },
    ],
  },
  'el-recuerdo-coffee-tour': {
    heading: 'Tours y experiencias',
    intro: 'Elige el plan y envía tu solicitud por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'tours', nombre: 'Coffee Tour', precio: 0, desc: 'Tarifas por confirmar directo con la finca' },
      { cat: 'incluye', nombre: 'Recorrido por plantación de café', precio: 0 },
      { cat: 'incluye', nombre: 'Degustación', precio: 0 },
    ],
  },
  'mahalo-hostel-salento': {
    heading: 'Habitaciones y servicios',
    intro: 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.',
    precioLabel: 'por noche',
    items: [
      { cat: 'habitaciones', nombre: 'Habitación compartida / privada', precio: 0, desc: 'Consultar tarifa directo' },
      { cat: 'servicios', nombre: 'Áreas comunes y cocina', precio: 0 },
      { cat: 'servicios', nombre: 'Wi-Fi', precio: 0 },
    ],
  },
  'parque-mirador-la-vida-es-bella': {
    heading: 'Entrada y atracciones',
    intro: 'Elige tu visita y pide información o guía por WhatsApp.',
    precioLabel: 'por persona',
    items: [
      { cat: 'planes', nombre: 'Entrada al mirador', precio: 0, desc: 'Consultar tarifa en sitio' },
      { cat: 'atracciones', nombre: 'Miradores y escenarios fotográficos', precio: 0 },
    ],
  },
};

function verifiedMenuFor(slug) {
  return VERIFIED_MENUS[slug] || null;
}

function buildMenuItems(provider) {
  const slug = slugify(provider.name);
  const verified = verifiedMenuFor(slug);
  if (verified?.items?.length) {
    return verified.items.map((it, i) => ({
      id: i + 1,
      cat: String(it.cat || 'planes'),
      nombre: String(it.nombre || '').trim(),
      precio: Number(it.precio) || 0,
      desc: String(it.desc || '').slice(0, 160),
      img: it.img || (FONDA_DISH_IMGS[it.id] || (menuImgPool(provider).length ? menuImgPool(provider)[i % menuImgPool(provider).length] : '')),
    })).filter((it) => it.nombre);
  }
  const pool = menuImgPool(provider);
  const items = [];
  let seq = 1;
  const push = (cat, nombre, precio, desc, img) => {
    const name = String(nombre || '').trim();
    if (!name) return;
    items.push({
      id: seq++,
      cat: String(cat || 'planes'),
      nombre: name,
      precio: Number(precio) || 0,
      desc: String(desc || '').slice(0, 160),
      img: img || (pool.length ? pool[items.length % pool.length] : ''),
    });
  };

  const food = provider.foodServiceDetails;
  if (food?.menuItems?.length) {
    for (const mi of food.menuItems) {
      const dishImg = slug === 'fonda-boquia' ? FONDA_DISH_IMGS[mi.id] : (mi.img || '');
      push(mi.category || 'carta', mi.name, mi.price, mi.description, dishImg);
    }
    return items;
  }
  if (food?.menuHighlights?.length) {
    for (const line of food.menuHighlights) {
      push('carta', stripPriceText(line) || line, parsePriceText(line), '', '');
    }
    return items;
  }
  if (food?.specialties?.length) {
    for (const s of food.specialties) {
      push('especialidades', s, 0, (food.cuisineType || []).join(', '), '');
    }
    if (food.ambience) push('ambiente', food.ambience, 0, food.seating || '', '');
    if (!items.length) push('especialidades', provider.name, 0, provider.description || '', '');
    return items;
  }

  const acc = provider.accommodationDetails;
  if (acc) {
    for (const r of acc.roomTypes || []) {
      push('habitaciones', r, 0, acc.bookingNotes || acc.categoryLabel || acc.checkIn || '', '');
    }
    for (const s of (acc.services || []).slice(0, 14)) {
      push('servicios', s, 0, '', '');
    }
    if (!items.length) push('habitaciones', provider.name, 0, provider.description || '', '');
    return items;
  }

  const exp = provider.experienceDetails || provider.horsebackRidingDetails || provider.tourismDetails;
  if (exp) {
    const tariff = exp.tariff || exp.pricingNotes || '';
    const named = [...String(tariff).matchAll(/([A-Za-zÁÉÍÓÚáéíóúñÑ][^:.\n]{2,50}):\s*\$\s*([\d.,]+)/g)];
    if (named.length) {
      for (const m of named) {
        push('planes', m[1].trim(), parsePriceText(`$${m[2]}`), exp.duration ? `Duración: ${exp.duration}` : '', '');
      }
    } else if (tariff && !/consultar|cotizaci|variable|seg[uú]n/i.test(tariff)) {
      push('planes', provider.name, parsePriceText(tariff), stripPriceText(tariff) || tariff, '');
    } else if (tariff) {
      push('cotizar', stripPriceText(tariff) || 'Cotización', 0, tariff, '');
    }
    const included = exp.included || exp.services || exp.attractions || [];
    for (const s of included.slice(0, 14)) {
      push(named.length || items.length ? 'incluye' : 'experiencia', s, 0, '', '');
    }
    if (!items.length && exp.services?.length) {
      for (const s of exp.services.slice(0, 12)) push('planes', s, 0, '', '');
    }
    if (!items.length) push('planes', provider.name, 0, provider.description || '', '');
    return items;
  }

  if (provider.horsebackRidingDetails) {
    const h = provider.horsebackRidingDetails;
    for (const [k, v] of Object.entries(h)) {
      if (typeof v === 'string' && v.length < 80) push('planes', k, parsePriceText(v), v, '');
      else if (Array.isArray(v)) for (const x of v) if (typeof x === 'string') push('planes', x, 0, '', '');
    }
    if (!items.length) push('planes', provider.name, 0, provider.description || '', '');
    return items;
  }

  const tr = provider.transportDetails;
  if (tr) {
    for (const r of tr.routes || []) {
      push('rutas', r, parsePriceText(tr.pricingNotes || tr.tariff || ''), tr.transportType || tr.capacity || '', '');
    }
    if (!items.length) push('rutas', tr.transportType || provider.name, 0, tr.pricingNotes || '', '');
    return items;
  }

  const commerce = provider.commerceDetails;
  if (commerce) {
    for (const p of commerce.mainProducts || commerce.productTypes || []) {
      push('productos', p, 0, '', '');
    }
    if (!items.length) push('productos', provider.name, 0, provider.description || '', '');
    return items;
  }

  for (const t of provider.tags || []) {
    push('plan', t, 0, provider.location?.landmark || provider.description || '', '');
  }
  if (!items.length && provider.name) push('plan', provider.name, 0, provider.description || '', '');
  return items;
}

function menuHeading(provider) {
  const verified = verifiedMenuFor(slugify(provider.name));
  if (verified?.heading) return verified.heading;
  const t = provider.type || '';
  if (/Restaurante|Caf[eé]|Food|Comida/i.test(t) || provider.foodServiceDetails) return 'Nuestra carta';
  if (/Alojamiento|Camping/i.test(t) || provider.accommodationDetails) return 'Habitaciones y servicios';
  if (/Coffee|Experiencia|Evento/i.test(t) || provider.experienceDetails) return 'Planes y experiencias';
  if (provider.transportDetails) return 'Rutas y servicios';
  if (/Atractivo/i.test(t)) return 'Qué puedes vivir aquí';
  return 'Menú de servicios';
}

function menuIntro(provider) {
  const verified = verifiedMenuFor(slugify(provider.name));
  if (verified?.intro) return verified.intro;
  const t = provider.type || '';
  if (provider.foodServiceDetails) return 'Toca los platos para armar tu pedido. Al final, envíalo por WhatsApp. Sin app ni pasarela de pago.';
  if (provider.accommodationDetails) return 'Revisa opciones y servicios. Agrega lo que necesites y consulta disponibilidad por WhatsApp.';
  if (provider.experienceDetails || provider.horsebackRidingDetails) return 'Elige el plan o lo que quieras incluir y envía tu solicitud por WhatsApp.';
  if (provider.transportDetails) return 'Selecciona la ruta y coordina el transporte directo por WhatsApp.';
  if (/Atractivo/i.test(t)) return 'Explora lo que puedes vivir aquí y pide información o guía por WhatsApp.';
  return 'Selecciona lo que necesites y envía tu solicitud por WhatsApp.';
}

function menuPrecioLabel(provider) {
  const verified = verifiedMenuFor(slugify(provider.name));
  if (verified?.precioLabel) return verified.precioLabel;
  if (provider.foodServiceDetails) return 'c/u';
  if (provider.accommodationDetails) return 'consultar';
  if (provider.experienceDetails || provider.horsebackRidingDetails) return 'por persona';
  if (provider.transportDetails) return 'consultar';
  return 'consultar';
}

function renderInteractiveMenu(provider) {
  const items = buildMenuItems(provider);
  if (!items.length) return { section: '', assets: '' };

  const cats = [{ id: 'todas', label: 'Todas' }];
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.cat)) continue;
    seen.add(it.cat);
    const label = MENU_CAT_LABELS[it.cat] || it.cat.charAt(0).toUpperCase() + it.cat.slice(1);
    cats.push({ id: it.cat, label });
  }

  const whatsapp = String(provider.contact?.whatsapp || '').replace(/\D/g, '');
  const showCurrency = items.some((it) => it.precio > 0);
  const config = {
    containerId: 'menuGrid',
    items,
    categories: cats,
    whatsapp,
    businessName: provider.name,
    currency: 'COP',
    showSearch: true,
    showCurrency,
    precioLabel: menuPrecioLabel(provider),
  };

  const section = `
      <section class="section" id="menu-interactivo">
        <h2>${escapeHtml(menuHeading(provider))}</h2>
        <p class="muted" style="margin-top:-8px;margin-bottom:20px">${escapeHtml(menuIntro(provider))}</p>
        <div class="menu-header">
          <div class="menu-search"><input type="text" id="menuSearch" placeholder="Buscar opción..." /></div>
          ${showCurrency ? `<div class="currency-switch" role="group" aria-label="Moneda">
            <button data-cur="COP" class="active">COP</button>
            <button data-cur="USD">USD</button>
            <button data-cur="EUR">EUR</button>
          </div>` : ''}
        </div>
        <div class="menu-tabs" id="menuTabs"></div>
        <div class="menu-grid" id="menuGrid"></div>
        <div class="menu-empty" id="menuEmpty" style="display:none"><span>🔍</span>No encontramos opciones con ese nombre.</div>
      </section>
      <div class="cart-float" id="cartFloat" role="button" tabindex="0" aria-label="Ver selección">
        <span class="badge" id="cartBadge">0</span>
        <span class="total" id="cartTotal">$0</span>
        <span>Ver pedido →</span>
      </div>
      <div class="cart-modal" id="cartModal" role="dialog" aria-modal="true">
        <div class="cart-panel">
          <h2>Tu pedido</h2>
          <div id="cartItems"></div>
          <div class="cart-total"><span>Total</span><span id="cartModalTotal">$0</span></div>
          <div class="cart-actions">
            <button class="send" id="sendWhatsApp">Enviar por WhatsApp</button>
            <button class="clear" id="clearCart">Vaciar</button>
            <button class="close" id="closeCart">Seguir explorando</button>
          </div>
        </div>
      </div>`;

  const assets = `
    <script src="/pautante-common.js"></script>
    <script>PautanteCommon.initMenu(${JSON.stringify(config).replace(/</g, '\\u003c')});</script>`;

  return { section, assets };
}

function renderConfirmBlock(provider, mapUrl) {
  const hours = provider.operatingHours?.notes || provider.operatingHours?.monday || provider.timeInfo || 'Horario por confirmar con el local';
  const tariff = provider.experienceDetails?.tariff
    || provider.foodServiceDetails?.averagePrice
    || provider.accommodationDetails?.bookingNotes
    || provider.transportDetails?.pricingNotes
    || null;
  const meeting = provider.experienceDetails?.meetingPoint
    || provider.transportDetails?.meetingPoint
    || provider.location?.landmark
    || provider.location?.address
    || 'Por confirmar con el local';
  return `<section class="section"><h2>Antes de confirmar tu visita</h2><div class="two-col"><div><p class="trust">¿Cuál es el horario de ${escapeHtml(provider.name)}? ${escapeHtml(hours)}</p><p class="trust">¿Cuánto cuesta? ${tariff ? escapeHtml(tariff) : `Rango ${escapeHtml(provider.priceRange || '$$')}. Confirma la tarifa final con el local.`}</p><p class="trust">¿Cómo reservo? Contacto directo por WhatsApp, sin intermediarios ni comisiones.</p></div><div class="facts"><div class="fact"><strong>Punto de encuentro</strong>${escapeHtml(meeting)}</div><div class="fact"><strong>Cómo llegar</strong><a href="${mapUrl}" target="_blank" rel="noreferrer">Abrir en Google Maps</a></div><div class="fact"><strong>Reseñas</strong>Las reseñas se publican en la ficha interactiva del directorio</div></div></div></section>`;
}

function renderProviderLandingPage(provider) {
  const category = provider.type || 'Servicios';
  const slug = slugify(provider.name);
  const hrefFicha = `/pautantes/${slug}.html`;
  const hrefBack = `/categorias/${slugify(category)}.html`;
  const whatsapp = whatsappUrl(provider.contact?.whatsapp);
  const phone = phoneUrl(provider.contact?.phone);
  const website = provider.contact?.website || '';
  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(provider.location?.address || provider.name + ' Salento')}`;
  const gallery = galleryFor(provider);
  const interactiveMenu = renderInteractiveMenu(provider);
  const details = provider.experienceDetails || provider.accommodationDetails || provider.foodServiceDetails || {};
  const contactAction = whatsapp || phone || hrefFicha;
  const listItems = (items = []) => items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="muted">Consultar directamente con el pautante.</p>';
  const tariffLine = details.tariff ? `<strong>Tarifas verificadas</strong><p>${escapeHtml(details.tariff)}</p>` : '';
  const bookingLine = provider.accommodationDetails?.bookingNotes ? `<strong>Tarifas verificadas</strong><p>${escapeHtml(provider.accommodationDetails.bookingNotes)}</p>` : '';
  const serviceSection = provider.accommodationDetails ? `
      <section class="section service-section"><h2>Hospedaje y reservas</h2><div class="service-grid"><div><strong>Tipos de habitación</strong>${listItems(provider.accommodationDetails.roomTypes)}<strong>Comodidades</strong>${listItems(provider.accommodationDetails.amenities || provider.accommodationDetails.roomFeatures)}</div><div><strong>Check-in</strong><p>${escapeHtml(provider.accommodationDetails.checkIn || 'Por confirmar')}</p><strong>Check-out</strong><p>${escapeHtml(provider.accommodationDetails.checkOut || 'Por confirmar')}</p><strong>Servicios incluidos</strong>${listItems(provider.accommodationDetails.services)}${bookingLine}${provider.sustainability && provider.sustainability.length ? `<strong>Sostenibilidad verificada</strong>${listItems(provider.sustainability)}` : ''}</div></div><div class="actions"><a class="button primary" href="${contactAction}">${whatsapp ? 'Consultar disponibilidad' : 'Contactar para reservar'}</a></div></section>` : provider.foodServiceDetails ? `
      <section class="section service-section"><h2>Carta, precios y pedidos</h2><div class="service-grid"><div><strong>Especialidades</strong>${listItems(provider.foodServiceDetails.specialties)}<strong>En la carta</strong>${listItems(provider.foodServiceDetails.menuHighlights)}</div><div><strong>Precio promedio</strong><p>${escapeHtml(provider.foodServiceDetails.averagePrice || provider.priceRange || 'Consultar')}</p><strong>Tipo de cocina</strong>${listItems(provider.foodServiceDetails.cuisineType)}${provider.foodServiceDetails.deliveryInfo?.available ? `<strong>Domicilio</strong><p>Disponible en ${escapeHtml(provider.foodServiceDetails.deliveryInfo.areas.join(', '))}. ${escapeHtml(provider.foodServiceDetails.deliveryInfo.deliveryTime || '')}</p>` : '<p class="muted">Confirma si hay domicilio o recogida.</p>'}</div></div><div class="actions"><a class="button primary" href="${whatsapp || `tel:${escapeHtml(phone)}`}">${provider.foodServiceDetails.deliveryInfo?.available ? 'Ordenar por WhatsApp' : 'Consultar carta y reservar'}</a></div></section>` : (provider.experienceDetails || provider.horsebackRidingDetails || provider.tourismDetails) ? `
      <section class="section service-section"><h2>Plan de la experiencia</h2><div class="service-grid"><div><strong>Incluye</strong>${listItems(details.included)}<strong>Qué llevar</strong>${listItems(details.requirements)}</div><div><strong>Duración</strong><p>${escapeHtml(details.duration || 'Por confirmar')}</p><strong>Dificultad</strong><p>${escapeHtml(details.difficulty || 'Por confirmar')}</p><strong>Punto de encuentro</strong><p>${escapeHtml(details.meetingPoint || provider.location?.address || 'Por confirmar')}</p><strong>Idiomas</strong><p>${escapeHtml((details.languages || []).join(', ') || 'Español')}</p>${tariffLine}</div></div><div class="actions"><a class="button primary" href="${contactAction}">Reservar experiencia</a></div></section>` : provider.commerceDetails ? `
      <section class="section service-section"><h2>Productos y compra local</h2><div class="service-grid"><div><strong>Productos principales</strong>${listItems(provider.commerceDetails.mainProducts)}<strong>Tipos de producto</strong>${listItems(provider.commerceDetails.productTypes)}</div><div><strong>Medios de pago</strong>${listItems(provider.commerceDetails.paymentMethods)}${provider.commerceDetails.deliveryInfo?.available ? `<strong>Entrega</strong><p>Disponible en ${escapeHtml(provider.commerceDetails.deliveryInfo.areas.join(', '))}. ${escapeHtml(provider.commerceDetails.deliveryInfo.deliveryTime || '')}</p>` : '<p class="muted">Compra directa en el establecimiento.</p>'}</div></div><div class="actions"><a class="button primary" href="${whatsapp || `tel:${escapeHtml(phone)}`}">Consultar productos y comprar</a></div></section>` : '';
  const transportSection = provider.transportDetails ? `
      <section class="section service-section"><h2>Transporte y rutas</h2><div class="service-grid"><div><strong>Vehículos</strong>${listItems(provider.transportDetails.vehicles)}<strong>Rutas</strong>${listItems(provider.transportDetails.routes)}</div><div><strong>Capacidad</strong><p>${escapeHtml(provider.transportDetails.capacity || 'Por confirmar')}</p><strong>Tarifa</strong><p>${escapeHtml(provider.transportDetails.tariff || provider.priceRange || 'Consultar')}</p><strong>Reserva</strong><p>${provider.transportDetails.reservationRequired ? 'Requerida' : 'No requerida, confirma disponibilidad'}</p></div></div><div class="actions"><a class="button primary" href="${whatsapp || `tel:${escapeHtml(phone)}`}">Coordinar transporte</a></div></section>` : '';
  const highlights = [
    details.duration && `Duración: ${details.duration}`,
    details.categoryLabel,
    provider.priceRange && `Rango: ${provider.priceRange}`,
    provider.timeInfo
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(provider.description || `Conoce ${provider.name} y contacta directamente.`)}" />
    <title>${escapeHtml(provider.name)} | Vive Salento directamente</title>
    ${canonicalTag(`/paginas-pautantes/${slug}/`)}
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
      :root { --paper:#f5f1e8; --ink:#1f2d26; --muted:#59665f; --line:#d9d0bf; --coral:#dd7f5d; --yellow:#e7c77b; --white:#fff; }
      * { box-sizing:border-box; } body { margin:0; background:var(--paper); color:var(--ink); font-family:'DM Sans',sans-serif; }
      a { color:inherit; text-decoration:none; } .container { max-width:1180px; margin:0 auto; padding:24px 20px 72px; }
      .topbar { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:28px; } .brand { display:inline-flex; align-items:center; gap:10px; font-weight:700; font-size:20px; } .brand-logo { width:42px; height:42px; object-fit:contain; border-radius:50%; }
      .top-actions,.actions { display:flex; flex-wrap:wrap; gap:10px; } .button { display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--line); border-radius:999px; padding:11px 15px; font-weight:700; font-size:13px; background:var(--white); }
      .button.primary { background:#25d366; border-color:#25d366; color:#fff; } .button.dark { background:var(--ink); border-color:var(--ink); color:#fff; }
      .hero { display:grid; grid-template-columns:1.1fr .9fr; gap:24px; align-items:stretch; } .hero-copy,.hero-image,.section { background:var(--white); border:1px solid var(--line); border-radius:24px; }
      .hero-copy { padding:34px; } .eyebrow { color:var(--coral); text-transform:uppercase; letter-spacing:.12em; font-size:11px; font-weight:700; }
      h1 { font-size:clamp(2.3rem,5vw,4.8rem); line-height:1.02; margin:14px 0; } .lead { color:var(--muted); line-height:1.7; font-size:1.08rem; max-width:650px; }
      .hero-image { min-height:360px; background:${providerPhotos(provider)[0] ?
           `linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.25)),url('${encodeURI(providerPhotos(provider)[0])}') center/cover` :
           'linear-gradient(135deg,var(--coral),var(--yellow))'}; }
      .highlights { display:flex; flex-wrap:wrap; gap:8px; margin:22px 0; } .highlight,.tag { padding:8px 11px; border:1px solid var(--line); border-radius:999px; background:#f3ead6; font-size:12px; font-weight:700; }
      .section { padding:26px; margin-top:24px; } h2 { margin:0 0 16px; font-size:1.5rem; } .two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
      .gallery { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; } .gallery img { width:100%; height:190px; object-fit:cover; border-radius:16px; border:1px solid var(--line); }
      .facts { display:grid; gap:0; } .fact { padding:13px 0; border-bottom:1px solid var(--line); } .fact strong { display:block; color:var(--muted); font-size:11px; text-transform:uppercase; margin-bottom:5px; }
      .service-section strong { display:block; color:var(--muted); font-size:11px; text-transform:uppercase; margin:14px 0 6px; } .service-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; } .service-section ul { margin:6px 0 18px; padding-left:20px; color:var(--muted); line-height:1.8; } .service-section p { color:var(--muted); line-height:1.6; } .muted { color:var(--muted); }
      .tags { display:flex; flex-wrap:wrap; gap:8px; } .trust { color:var(--muted); line-height:1.6; } .verified { color:#39734b; font-weight:700; }
      @media (max-width:800px) { .hero,.two-col { grid-template-columns:1fr; } .hero-image { min-height:260px; order:-1; } .topbar { align-items:flex-start; flex-direction:column; } .gallery { grid-template-columns:1fr; } }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
    <link rel="stylesheet" href="/pautante-theme.css" />
    ${buildBreadcrumbListSchema([
      { name: 'Inicio', url: 'https://www.salentoalamano.com/' },
      { name: categoryLabelFor(category), url: hrefBack },
      { name: provider.name }
    ])}
    ${buildSchemaJsonLd(provider)}
  </head>
  <body>
    <main class="container">
      <header class="topbar">${brandMarkFor(slug)}<nav class="top-actions"><a class="button" href="/">Inicio</a><a class="button" href="${hrefBack}">Ver categoría</a></nav></header>
      <section class="hero">
        <div class="hero-copy"><div class="eyebrow">${escapeHtml(category)} · contacto directo</div><h1>${escapeHtml(provider.name)}</h1><p class="lead">${escapeHtml(provider.description || 'Una experiencia local para descubrir Salento con información clara y contacto directo.')}</p>
          <div class="highlights">${highlights.map((item) => `<span class="highlight">${escapeHtml(item)}</span>`).join('')}</div>
          <div class="actions">${whatsapp ? `<a class="button primary" href="${whatsapp}" target="_blank" rel="noreferrer">Reservar por WhatsApp</a>` : ''}${phone ? `<a class="button dark" href="tel:${escapeHtml(phone)}">Llamar ahora</a>` : ''}<a class="button" href="${mapUrl}" target="_blank" rel="noreferrer">Cómo llegar</a>${website ? `<a class="button" href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Sitio oficial</a>` : ''}</div>
        </div><div class="hero-image" aria-label="${escapeHtml(provider.name)}"></div>
      </section>
      ${serviceSection}
      ${transportSection}
      <section class="section"><h2>Conoce la experiencia</h2><div class="two-col"><div><p class="trust">${escapeHtml(provider.description || 'Información del servicio local.')}</p><p class="verified">${provider.verified ? '✓ Información verificada en el catálogo local' : 'Información disponible para confirmar directamente con el local'}</p></div><div class="facts"><div class="fact"><strong>Ubicación</strong>${escapeHtml(provider.location?.address || 'Salento, Quindío')}</div><div class="fact"><strong>Referencia</strong>${escapeHtml(provider.location?.landmark || 'Consulta la ruta con el local')}</div><div class="fact"><strong>Horario</strong>${escapeHtml(provider.operatingHours?.notes || provider.operatingHours?.monday || provider.timeInfo || 'Horario por confirmar')}</div></div></div></section>
      <section class="section"><h2>Galería de imágenes</h2><div class="gallery">${gallery}</div></section>
      ${interactiveMenu.section}
      ${renderConfirmBlock(provider, mapUrl)}
      <section class="section"><h2>Lo que puedes encontrar</h2><div class="tags">${(provider.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || '<span class="tag">Servicio local</span>'}</div></section>
      ${bottomNav()}
    </main>
    ${interactiveMenu.assets}
  </body>
</html>`;
  return html.replaceAll('href="tel:"', `href="${hrefFicha}"`).replaceAll('href="tel:tel:', 'href="tel:');
}

const onlyFilter = new Set(
  (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean)
);

for (const category of categoryNames) {
  if (onlyFilter.size > 0 && ![...onlyFilter].some((f) => f === slugify(category) || f === `cat:${slugify(category)}`)) continue;
  const items = providers.filter((item) => item.type === category);
  const categoryPath = path.join(categoryDir, `${slugify(category)}.html`);
  fs.writeFileSync(categoryPath, renderCategoryPage(category, items));
}

// Páginas artesanales que el generador nunca debe sobrescribir (mapa offline a medida)
// El mapa offline SOLO existe en Camping y Reserva Natural Cascadas de Santa Rita.
const PROTECT = new Set([
  'camping-cascadas-de-santa-rita',
  'reserva-natural-cascadas-de-santa-rita',
]);

for (const provider of providers) {
  if (PROTECT.has(slugify(provider.name))) continue;
  if (onlyFilter.size > 0 && !onlyFilter.has(slugify(provider.name))) continue;
  const providerPath = path.join(providerDir, `${slugify(provider.name)}.html`);
  fs.writeFileSync(providerPath, renderRedirectStub(provider));
  const landingPath = path.join(providerLandingDir, slugify(provider.name), 'index.html');
  fs.mkdirSync(path.dirname(landingPath), { recursive: true });
  fs.writeFileSync(landingPath, renderProviderLandingPage(provider));
}

if (onlyFilter.size === 0) {
const indexPath = path.join(publicDir, 'categorias', 'index.html');
const indexHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Explora categorías de alojamientos, gastronomía, experiencias y servicios locales en Salento, Quindío." />
    <title>Categorías | Salento a la Mano</title>
    ${canonicalTag('/categorias/')}
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
      body { margin: 0; background: #f5f1e8; color: #1f2d26; font-family: 'DM Sans', sans-serif; }
      .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; } .brand-logo { width: 42px; height: 42px; object-fit: contain; border-radius: 50%; }
      .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px 80px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
      .card { background: white; border: 1px solid #d9d0bf; border-radius: 22px; overflow: hidden; box-shadow: 0 8px 24px rgba(39,54,43,.06); transition: transform .2s, box-shadow .2s; }
      .card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(39,54,43,.12); }
      .image { height: 180px; background-size: cover; background-position: center; transition: transform .35s ease; }
      .card:hover .image { transform: scale(1.04); }
      .content { padding: 18px; }
      h1 { margin: 0 0 18px; font-size: clamp(2.2rem, 4vw, 3rem); }
      h3 { margin: 0 0 10px; }
      p { margin: 0; color: #59665f; line-height: 1.5; }
      a { text-decoration: none; color: inherit; }
      .btn { display: inline-block; margin-top: 16px; background: #1f2d26; color: white; border-radius: 999px; padding: 10px 14px; font-weight: 700; }
      .card { display: flex; flex-direction: column; }
      .image { overflow: hidden; }
      .card > .image { overflow: hidden; }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <div class="container">
          <header class="topbar"><a class="brand" href="/"><img src="/logo_salento2026.webp" alt="Salento a la Mano" class="brand-logo"/><span>Salento a la Mano</span></a><a href="/">Volver al inicio</a></header>
          <h1>Categorías de Salento</h1>
      <div class="grid">
        ${categoryNames.map((category) => `
          <a href="/categorias/${slugify(category)}.html" class="card">
            <div class="image" style="background-image:url('${categoryMeta[category].image}')"></div>
            <div class="content">
              <h3>${escapeHtml(categoryMeta[category].title)}</h3>
              <p>${escapeHtml(categoryMeta[category].description)}</p>
              <span class="btn">Ver categoría</span>
            </div>
          </a>
        `).join('')}
        ${EXTRA_CATEGORY_CARDS.map((cat) => `
          <a href="/categorias/${cat.slug}.html" class="card">
            <div class="image" style="background-image:url('${cat.image}')"></div>
            <div class="content">
              <h3>${escapeHtml(cat.title)}</h3>
              <p>${escapeHtml(cat.description)}</p>
              <span class="btn">Ver categoría</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  </body>
</html>`;
fs.writeFileSync(indexPath, indexHtml);
} // end if onlyFilter empty (categorias index solo en regeneración completa)

console.log(`Se generaron páginas de categoría y fichas de pautantes${onlyFilter.size > 0 ? ` (filtro: ${[...onlyFilter].join(', ')})` : ''}.`);
