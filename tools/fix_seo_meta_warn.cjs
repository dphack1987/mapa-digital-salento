const fs = require('fs');

const fixes = [
  {
    file: 'public/coffee-tour-salento.html',
    from: 'content="Coffee tours en Salento: precios, duración, qué incluye y cómo reservar el mejor tour de café en Salento, Quindío con contacto directo a fincas cafeteras locales. Información verificada para planear tu experiencia sin intermediarios."',
    to: 'content="Coffee tours en Salento: precios, duración y reservas directas en fincas cafeteras de Quindío, sin intermediarios."'
  },
  {
    file: 'public/fin-de-semana-salento.html',
    from: null, // will use regex
    to: null
  },
  {
    file: 'public/hotel-barato-salento.html',
    from: null,
    to: null
  },
  {
    file: 'public/mejor-trucha-salento.html',
    from: null,
    to: null
  },
  {
    file: 'public/valle-de-cocora-salento.html',
    from: null,
    to: null
  },
  {
    file: 'public/agenda-eventos-salento.html',
    from: null,
    to: null
  },
  {
    file: 'public/categorias/coffee-tours.html',
    from: null,
    to: null
  },
  {
    file: 'public/categorias/eventos.html',
    from: null,
    to: null
  },
  {
    file: 'public/categorias/restaurante-bar.html',
    from: null,
    to: null
  },
  {
    file: 'public/estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100.html',
    from: null,
    to: null
  },
  {
    file: 'public/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html',
    from: null,
    to: null
  },
  {
    file: 'public/restaurantes-salento-abiertos-servicio-gastronomico-operativo.html',
    from: null,
    to: null
  },
  {
    file: 'public/landing/mejor-trucha-salento/index.html',
    from: null,
    to: null
  },
  {
    file: 'public/paginas-pautantes/camping-cascadas-de-santa-rita/index.html',
    from: null,
    to: null
  },
  {
    file: 'public/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/index.html',
    from: null,
    to: null
  }
];

// Short replacement descriptions by slug-ish keywords
const descMap = {
  'coffee-tour-salento.html': 'Coffee tours en Salento: precios, duración y reservas directas en fincas cafeteras de Quindío, sin intermediarios.',
  'fin-de-semana-salento.html': 'Plan de fin de semana en Salento: qué hacer, dónde dormir, restaurantes y Valle de Cocora en un itinerario de 2 días.',
  'hotel-barato-salento.html': 'Hoteles baratos en Salento con alojamiento económico, ubicación y contacto directo para reservar sin intermediarios.',
  'mejor-trucha-salento.html': 'Mejor trucha en Salento: restaurantes con trucha frita y a la plancha, precios y reservas directas.',
  'valle-de-cocora-salento.html': 'Guía del Valle de Cocora: acceso desde Salento, senderos, palmas de cera, clima y consejos para tu visita.',
  'agenda-eventos-salento.html': 'Agenda de eventos en Salento: fiestas, ferias y actividades culturales actualizadas para turistas.',
  'coffee-tours.html': 'Coffee tours en Salento: fincas cafeteras, precios y reservas directas con operadores locales verificados.',
  'eventos.html': 'Eventos en Salento: agenda cultural, ferias y celebraciones para planear tu visita al Eje Cafetero.',
  'restaurante-bar.html': 'Restaurantes y bares en Salento: menús, especialidades como trucha arcoíris y contacto directo para reservar.',
  'estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100.html': 'Estado actual de Salento: hoteles abiertos, vías libres y Valle de Cocora operando al 100% con información oficial.',
  'faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html': 'FAQ Salento: respuestas oficiales sobre acceso, hoteles, Valle de Cocora y seguridad para turistas.',
  'restaurantes-salento-abiertos-servicio-gastronomico-operativo.html': 'Restaurantes abiertos en Salento con servicio gastronómico operativo, menús y reservas directas.'
};

const titleMap = {
  'faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html': 'FAQ Salento: preguntas frecuentes de turistas',
  'estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100.html': 'Estado actual Salento 2026: hoteles, vías y Cocora',
  'landing-estado-actual-salento-2026.html': 'Estado actual Salento 2026 | Salento a la Mano',
  'rumor-cierre-salento-falso-desmentido-oficialmente.html': 'Rumor cierre Salento: falso, desmentido oficial',
  'transporte-salento-jeeps-willys-operativos-servicio-normal.html': 'Transporte Salento: jeeps Willys operativos con normalidad',
  'restaurantes-salento-abiertos-servicio-gastronomico-operativo.html': 'Restaurantes abiertos en Salento: servicio operativo'
};

function setMetaDesc(t, desc) {
  if (/name=["']description["'][^>]*content=["'][^"']*["']/i.test(t)) {
    return t.replace(/name=["']description["'][^>]*content=["'][^"']*["']/i, `name="description" content="${desc}"`);
  }
  if (/content=["'][^"']*["'][^>]*name=["']description["']/i.test(t)) {
    return t.replace(/content=["'][^"']*["'][^>]*name=["']description["']/i, `content="${desc}" name="description"`);
  }
  return t;
}

function setTitle(t, title) {
  if (/<title[^>]*>[\s\S]*?<\/title>/i.test(t)) {
    return t.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  }
  return t;
}

let changed = 0;
for (const f of fs.readdirSync('public', { recursive: true })) {
  const full = 'public/' + f;
  if (typeof f !== 'string' || !f.endsWith('.html')) continue;
  if (!fs.statSync(full).isFile()) continue;
  const base = f.split(/[\\/]/).pop();
  let t = fs.readFileSync(full, 'utf8');
  const orig = t;
  if (descMap[base]) t = setMetaDesc(t, descMap[base]);
  if (titleMap[base]) t = setTitle(t, titleMap[base]);
  // landing mejor-trucha under landing/
  if (full.replace(/\\/g, '/').includes('landing/mejor-trucha-salento') && !descMap[base]) {
    t = setMetaDesc(t, 'Mejor trucha en Salento: restaurantes con trucha frita y a la plancha, precios y reservas directas.');
  }
  if (full.replace(/\\/g, '/').includes('paginas-pautantes/camping-cascadas-de-santa-rita') ) {
    t = setMetaDesc(t, 'Camping Cascadas de Santa Rita en Salento: alojamiento natural, cascadas y contacto directo.');
  }
  if (full.replace(/\\/g, '/').includes('paginas-pautantes/reserva-natural-cascadas-de-santa-rita')) {
    t = setMetaDesc(t, 'Reserva Natural Cascadas de Santa Rita: senderos, cascadas y tours ecológicos en Salento.');
  }
  if (t !== orig) {
    fs.writeFileSync(full, t, 'utf8');
    changed++;
    console.log('updated', full);
  }
}
console.log('files changed', changed);
