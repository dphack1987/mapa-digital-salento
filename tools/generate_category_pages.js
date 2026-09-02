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
  Alojamientos: { title: 'Alojamientos', description: 'Hoteles, fincas y hospedajes para descansar en Salento', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80' },
  Restaurantes: { title: 'Restaurantes', description: 'Sabor local, cafés y rincones para comer bien en Salento', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80' },
  'Cafés': { title: 'Cafés', description: 'Espacios para tomar café, brunch y momentos tranquilos', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=1200&q=80' },
  Artesanías: { title: 'Artesanías', description: 'Productos locales, regalos y cultura hecha a mano', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80' },
  Tiendas: { title: 'Tiendas', description: 'Comercios locales, souvenirs y compras directas', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
  Experiencias: { title: 'Experiencias', description: 'Tour, miradores, senderismo y actividades para vivir Salento', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80' },
  Servicios: { title: 'Servicios', description: 'Transporte, movilidad y ayuda rápida para tu visita', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80' },
};

const categoryNames = Object.keys(categoryMeta);

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
  const mark = `<img src="/logo_salento2026.png" alt="Salento a la Mano" class="brand-logo"/><span>Salento a la Mano</span>`;
  return link ? `<a class="brand" href="/index.html">${mark}</a>` : `<div class="brand">${mark}</div>`;
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

function galleryFor(provider) {
  const fallback = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80'
  ];

  const gallery = [];
  for (let i = 0; i < 3; i += 1) {
    const url = provider.images?.[i] || fallback[i] || fallback[0];
    gallery.push(`<img src="${url}" alt="${escapeHtml(provider.name)} foto ${i + 1}" loading="lazy"/>`);
  }
  return gallery.join('');
}

function categoryLabelFor(type) {
  return categoryMeta[type]?.title || type;
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
  const image = provider.images?.[0] || 'https://salentoalamano.com/logo_salento2026.png';
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(ratingValue) || 4.8,
      ratingCount: 12,
      bestRating: 5,
      worstRating: 1,
    },
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
      <article class="provider-card">
        <div class="card-image" style="background-image:url('${categoryMeta[category]?.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'}')"></div>
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
          <div class="card-actions">
            <a class="btn primary" href="/pautantes/${itemSlug}.html">Ver ficha</a>
            <a class="btn" href="/paginas-pautantes/${itemSlug}/">Conocer</a>
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
        display: grid; grid-template-columns: 1.3fr .7fr; gap: 20px; align-items: stretch; margin-bottom: 28px;
      }
      .hero-copy, .hero-visual {
        background: var(--white); border: 1px solid var(--line); border-radius: 22px; overflow: hidden;
      }
      .hero-copy { padding: 30px 28px; }
      .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: var(--coral); font-weight: 700; }
      h1 { font-size: clamp(2rem, 4vw, 4rem); margin: 12px 0 12px; }
      .sub { color: #536057; font-size: 1.05rem; line-height: 1.6; }
      .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 20px; }
      .stat { background: #f1eadb; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; }
      .hero-visual {
        background-image: linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.3)), url('${categoryMeta[category]?.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'}');
        background-size: cover; background-position: center; min-height: 260px;
      }
      .provider-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 24px;
      }
      .empty-category { display: flex; align-items: center; gap: 18px; margin-top: 24px; padding: 24px; border: 1px dashed var(--coral); background: rgba(255,255,255,.7); }
      .empty-category-mark { display: grid; place-items: center; width: 42px; height: 42px; flex: 0 0 42px; border: 1px solid var(--coral); border-radius: 50%; color: var(--coral); font-size: 25px; }
      .empty-category h2 { margin: 0 0 6px; font: 600 22px Fraunces, serif; }
      .empty-category p { margin: 0; color: #59665f; line-height: 1.5; }
      .provider-card {
        background: var(--white); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; 
      }
      .card-image {
        height: 150px; background-size: cover; background-position: center; width: 100%;
      }
      .card-body { padding: 18px; }
      .card-header-row, .meta-row, .card-actions { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
      .card-header-row { margin-bottom: 10px; }
      .pill { background: #f3ead6; border-radius: 999px; padding: 6px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
      .rating { font-size: 12px; font-weight: 700; }
      h3 { margin: 8px 0 10px; font-size: 1.35rem; }
      .card-body p { margin: 0 0 14px; color: #59665f; line-height: 1.5; font-size: 0.96rem; }
      .meta-row { color: #4d5a51; font-size: 12px; margin-bottom: 16px; }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); font-weight: 700; font-size: 12px;
      }
      .btn.primary { background: var(--ink); color: var(--white); border-color: var(--ink); }
      .btn.whatsapp { background: #25d366; border-color: #25d366; color: #fff; }
      @media (max-width: 760px) {
        .hero { grid-template-columns: 1fr; }
        .topbar { flex-direction: column; align-items: flex-start; }
      }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
    ${buildBreadcrumbListSchema([
      { name: 'Inicio', url: 'https://salentoalamano.com/' },
      { name: 'Categorías', url: 'https://salentoalamano.com/categorias/' },
      { name: categoryMeta[category]?.title || category },
    ])}
  </head>
  <body>
    <div class="container">
      <div class="topbar">
        ${brandMark()}
        <nav class="top-actions"><a class="nav-link" href="/">Inicio</a><a class="nav-link" href="/index.html">Volver al inicio</a></nav>
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
    <title>${escapeHtml(provider.name)} | Salento a la Mano</title>
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
      <div class="breadcrumb"><a href="/index.html">Inicio</a> / <a href="${hrefBack}">${escapeHtml(categoryLabelFor(category))}</a> / ${escapeHtml(provider.name)}</div>
      <div class="topbar">
        ${brandMark()}
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
    </div>
  </body>
</html>`;
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
  const details = provider.experienceDetails || provider.accommodationDetails || provider.foodServiceDetails || {};
  const contactAction = whatsapp || phone || hrefFicha;
  const listItems = (items = []) => items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="muted">Consultar directamente con el pautante.</p>';
  const serviceSection = provider.accommodationDetails ? `
      <section class="section service-section"><h2>Hospedaje y reservas</h2><div class="service-grid"><div><strong>Tipos de habitación</strong>${listItems(provider.accommodationDetails.roomTypes)}<strong>Comodidades</strong>${listItems(provider.accommodationDetails.amenities || provider.accommodationDetails.roomFeatures)}</div><div><strong>Check-in</strong><p>${escapeHtml(provider.accommodationDetails.checkIn || 'Por confirmar')}</p><strong>Check-out</strong><p>${escapeHtml(provider.accommodationDetails.checkOut || 'Por confirmar')}</p><strong>Servicios incluidos</strong>${listItems(provider.accommodationDetails.services)}</div></div><div class="actions"><a class="button primary" href="${contactAction}">${whatsapp ? 'Consultar disponibilidad' : 'Contactar para reservar'}</a></div></section>` : provider.foodServiceDetails ? `
      <section class="section service-section"><h2>Carta, precios y pedidos</h2><div class="service-grid"><div><strong>Especialidades</strong>${listItems(provider.foodServiceDetails.specialties)}<strong>En la carta</strong>${listItems(provider.foodServiceDetails.menuHighlights)}</div><div><strong>Precio promedio</strong><p>${escapeHtml(provider.foodServiceDetails.averagePrice || provider.priceRange || 'Consultar')}</p><strong>Tipo de cocina</strong>${listItems(provider.foodServiceDetails.cuisineType)}${provider.foodServiceDetails.deliveryInfo?.available ? `<strong>Domicilio</strong><p>Disponible en ${escapeHtml(provider.foodServiceDetails.deliveryInfo.areas.join(', '))}. ${escapeHtml(provider.foodServiceDetails.deliveryInfo.deliveryTime || '')}</p>` : '<p class="muted">Confirma si hay domicilio o recogida.</p>'}</div></div><div class="actions"><a class="button primary" href="${whatsapp || `tel:${escapeHtml(phone)}`}">${provider.foodServiceDetails.deliveryInfo?.available ? 'Ordenar por WhatsApp' : 'Consultar carta y reservar'}</a></div></section>` : (provider.experienceDetails || provider.horsebackRidingDetails || provider.tourismDetails) ? `
      <section class="section service-section"><h2>Plan de la experiencia</h2><div class="service-grid"><div><strong>Incluye</strong>${listItems(details.included)}<strong>Qué llevar</strong>${listItems(details.requirements)}</div><div><strong>Duración</strong><p>${escapeHtml(details.duration || 'Por confirmar')}</p><strong>Dificultad</strong><p>${escapeHtml(details.difficulty || 'Por confirmar')}</p><strong>Punto de encuentro</strong><p>${escapeHtml(details.meetingPoint || provider.location?.address || 'Por confirmar')}</p><strong>Idiomas</strong><p>${escapeHtml((details.languages || []).join(', ') || 'Español')}</p></div></div><div class="actions"><a class="button primary" href="${contactAction}">Reservar experiencia</a></div></section>` : provider.commerceDetails ? `
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
      .hero-image { min-height:360px; background:linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.25)),url('${provider.images?.[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'}') center/cover; }
      .highlights { display:flex; flex-wrap:wrap; gap:8px; margin:22px 0; } .highlight,.tag { padding:8px 11px; border:1px solid var(--line); border-radius:999px; background:#f3ead6; font-size:12px; font-weight:700; }
      .section { padding:26px; margin-top:24px; } h2 { margin:0 0 16px; font-size:1.5rem; } .two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
      .gallery { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; } .gallery img { width:100%; height:190px; object-fit:cover; border-radius:16px; border:1px solid var(--line); }
      .facts { display:grid; gap:0; } .fact { padding:13px 0; border-bottom:1px solid var(--line); } .fact strong { display:block; color:var(--muted); font-size:11px; text-transform:uppercase; margin-bottom:5px; }
      .service-section strong { display:block; color:var(--muted); font-size:11px; text-transform:uppercase; margin:14px 0 6px; } .service-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; } .service-section ul { margin:6px 0 18px; padding-left:20px; color:var(--muted); line-height:1.8; } .service-section p { color:var(--muted); line-height:1.6; } .muted { color:var(--muted); }
      .tags { display:flex; flex-wrap:wrap; gap:8px; } .trust { color:var(--muted); line-height:1.6; } .verified { color:#39734b; font-weight:700; }
      @media (max-width:800px) { .hero,.two-col { grid-template-columns:1fr; } .hero-image { min-height:260px; order:-1; } .topbar { align-items:flex-start; flex-direction:column; } .gallery { grid-template-columns:1fr; } }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <main class="container">
      <header class="topbar">${brandMark()}<nav class="top-actions"><a class="button" href="/">Inicio</a><a class="button" href="${hrefBack}">Ver categoría</a><a class="button" href="${hrefFicha}">Ficha completa</a></nav></header>
      <section class="hero">
        <div class="hero-copy"><div class="eyebrow">${escapeHtml(category)} · contacto directo</div><h1>${escapeHtml(provider.name)}</h1><p class="lead">${escapeHtml(provider.description || 'Una experiencia local para descubrir Salento con información clara y contacto directo.')}</p>
          <div class="highlights">${highlights.map((item) => `<span class="highlight">${escapeHtml(item)}</span>`).join('')}</div>
          <div class="actions">${whatsapp ? `<a class="button primary" href="${whatsapp}" target="_blank" rel="noreferrer">Reservar por WhatsApp</a>` : ''}${phone ? `<a class="button dark" href="tel:${escapeHtml(phone)}">Llamar ahora</a>` : ''}<a class="button" href="${mapUrl}" target="_blank" rel="noreferrer">Cómo llegar</a>${website ? `<a class="button" href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Sitio oficial</a>` : ''}</div>
        </div><div class="hero-image" aria-label="${escapeHtml(provider.name)}"></div>
      </section>
      <section class="section"><h2>Conoce la experiencia</h2><div class="two-col"><div><p class="trust">${escapeHtml(provider.description || 'Información del servicio local.')}</p><p class="verified">${provider.verified ? '✓ Información verificada en el catálogo local' : 'Información disponible para confirmar directamente con el local'}</p></div><div class="facts"><div class="fact"><strong>Ubicación</strong>${escapeHtml(provider.location?.address || 'Salento, Quindío')}</div><div class="fact"><strong>Referencia</strong>${escapeHtml(provider.location?.landmark || 'Consulta la ruta con el local')}</div><div class="fact"><strong>Horario</strong>${escapeHtml(provider.operatingHours?.notes || provider.operatingHours?.monday || provider.timeInfo || 'Horario por confirmar')}</div></div></div></section>
      <section class="section"><h2>Galería de imágenes</h2><div class="gallery">${gallery}</div></section>
      ${serviceSection}
      ${transportSection}
      <section class="section"><h2>Lo que puedes encontrar</h2><div class="tags">${(provider.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || '<span class="tag">Servicio local</span>'}</div></section>
    </main>
  </body>
</html>`;
  return html.replaceAll('href="tel:"', `href="${hrefFicha}"`).replaceAll('href="tel:tel:', 'href="tel:');
}

for (const category of categoryNames) {
  const items = providers.filter((item) => item.type === category);
  const categoryPath = path.join(categoryDir, `${slugify(category)}.html`);
  fs.writeFileSync(categoryPath, renderCategoryPage(category, items));
}

for (const provider of providers) {
  const providerPath = path.join(providerDir, `${slugify(provider.name)}.html`);
  fs.writeFileSync(providerPath, renderProviderPage(provider));
  const landingPath = path.join(providerLandingDir, slugify(provider.name), 'index.html');
  fs.mkdirSync(path.dirname(landingPath), { recursive: true });
  fs.writeFileSync(landingPath, renderProviderLandingPage(provider));
}

const indexPath = path.join(publicDir, 'categorias', 'index.html');
const indexHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Categorías | Salento a la Mano</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
      body { margin: 0; background: #f5f1e8; color: #1f2d26; font-family: 'DM Sans', sans-serif; }
      .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; } .brand-logo { width: 42px; height: 42px; object-fit: contain; border-radius: 50%; }
      .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px 80px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
      .card { background: white; border: 1px solid #d9d0bf; border-radius: 20px; overflow: hidden; }
      .image { height: 160px; background-size: cover; background-position: center; }
      .content { padding: 18px; }
      h1 { margin: 0 0 18px; font-size: clamp(2.2rem, 4vw, 3rem); }
      h3 { margin: 0 0 10px; }
      p { margin: 0; color: #59665f; line-height: 1.5; }
      a { text-decoration: none; color: inherit; }
      .btn { display: inline-block; margin-top: 16px; background: #1f2d26; color: white; border-radius: 999px; padding: 10px 14px; font-weight: 700; }
    </style>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <div class="container">
          <header class="topbar"><a class="brand" href="/index.html"><img src="/logo_salento2026.png" alt="Salento a la Mano" class="brand-logo"/><span>Salento a la Mano</span></a><a href="/index.html">Volver al inicio</a></header>
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
      </div>
    </div>
  </body>
</html>`;
fs.writeFileSync(indexPath, indexHtml);

console.log(`Se generaron ${categoryNames.length} páginas de categoría y ${providers.length} fichas de pautantes.`);
