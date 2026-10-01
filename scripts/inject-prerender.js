import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(distPath, 'utf8');

const prerender = `    <div id="prerender" style="font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px">
      <h1>Salento a la Mano - Guía Turística Oficial de Salento, Quindío 2026</h1>
      <p>Descubre hoteles abiertos, restaurantes auténticos, coffee tours, Valle de Cocora, palmas de cera y experiencias únicas con el mapa turístico digital más completo de Salento, Quindío.</p>
      <h2>Categorías</h2>
      <ul>
        <li><a href="/categorias/restaurantes.html">Restaurantes en Salento</a></li>
        <li><a href="/categorias/cafes.html">Cafés en Salento</a></li>
        <li><a href="/categorias/alojamientos.html">Alojamientos en Salento</a></li>
        <li><a href="/categorias/coffee-tours.html">Coffee Tours en Salento</a></li>
        <li><a href="/categorias/atractivos-turisticos.html">Atractivos Turísticos en Salento</a></li>
        <li><a href="/categorias/experiencias.html">Experiencias en Salento</a></li>
        <li><a href="/categorias/servicios.html">Servicios en Salento</a></li>
        <li><a href="/categorias/tiendas.html">Tiendas en Salento</a></li>
        <li><a href="/categorias/camping.html">Camping en Salento</a></li>
        <li><a href="/categorias/artesanias.html">Artesanías en Salento</a></li>
        <li><a href="/categorias/eventos.html">Eventos en Salento</a></li>
      </ul>
      <h2>Pautantes destacados en Salento</h2>
      <ul>
        <li><a href="/paginas-pautantes/fonda-boquia/index.html">Fonda Boquía - Restaurante tradicional en Salento</a></li>
        <li><a href="/paginas-pautantes/restaurante-don-elias/index.html">Restaurante Don Elías en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-restaurante-terra/index.html">Restaurante Terra en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-barcinales-cafe-bar/index.html">Barcinales Cafe Bar en Salento</a></li>
        <li><a href="/paginas-pautantes/finca-cafetera-don-elias/index.html">Finca Cafetera Don Elías - Coffee Tour en Salento</a></li>
        <li><a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/index.html">Finca Don Eduardo - Coffee Tour en Salento</a></li>
        <li><a href="/paginas-pautantes/hotel-la-floresta-salento/index.html">Hotel La Floresta en Salento</a></li>
        <li><a href="/paginas-pautantes/hotel-camino-nacional-salento/index.html">Hotel Camino Nacional en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/index.html">Hotel El Mirador de Boquía en Salento</a></li>
        <li><a href="/paginas-pautantes/camping-cascadas-de-santa-rita/index.html">Camping Cascadas de Santa Rita en Salento</a></li>
      </ul>
      <h2>Guías turísticas de Salento</h2>
      <ul>
        <li><a href="/landing/mejor-trucha-salento/">Mejor trucha en Salento</a></li>
        <li><a href="/landing/hotel-barato-salento/">Hotel barato en Salento</a></li>
        <li><a href="/landing/coffee-tour-salento-precio/">Coffee tour en Salento</a></li>
        <li><a href="/landing/valle-de-cocora-guia/">Valle de Cocora - Guía completa</a></li>
        <li><a href="/landing/que-hacer-salento-fin-de-semana/">Fin de semana en Salento</a></li>
        <li><a href="/landing/cafe-premium-salento/">Café premium de Salento</a></li>
        <li><a href="/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html">Preguntas frecuentes sobre Salento</a></li>
        <li><a href="/seguridad-salento-emergencias.html">Seguridad y emergencias en Salento</a></li>
      </ul>
      <h2>Mapa interactivo de Salento</h2>
      <p><a href="/mapa-interactivo-salento.html">Explora el mapa turístico interactivo de Salento con hoteles, restaurantes, coffee tours y atractivos turísticos</a></p>
      <p><a href="https://www.mapaturisticodelquindio.com">Mapa Turístico del Quindío - Sitio aliado con 70+ negocios</a></p>
      <h2>Salento, Quindío: guía completa para planear tu visita</h2>
      <p>Salento es un pueblo paisa a 1.895 metros en el Quindío, corazón del Eje Cafetero. Su casco urbano conserva calles empedradas, balcones de guadua y casas de bahareque de colores. Desde la Plaza de Bolívar y el mirador del Alto de la Cruz se entiende por qué miles de viajeros llegan cada año en busca de naturaleza, café de origen y experiencias auténticas con la comunidad. El gran reclamo es el Valle de Cocora, a pocos minutos en jeep, atravesado por el río Quindío y flanqueado por palmas de cera de más de 60 metros. En el pueblo, los jeeps Willys parten desde la plaza hacia fincas, senderos y miradores. Muchos visitantes combinan el Alto de la Cruz al atardecer, una mañana de siembra y cata en finca, y una tarde lenta por la Calle Real, donde las tiendas de artesanía conviven con heladerías y cafés de especialidad. El clima de altura suaviza las jornadas: mañanas frescas, tardes templadas y noches ideales para cenar con vistas al valle. Esta guía reúne cómo llegar, qué hacer y cuándo ir, con enlaces a pautantes y guías extendidas para armar un itinerario claro y sin vueltas.</p>
      <h2>Cómo llegar a Salento</h2>
      <h3>Desde Armenia en bus o transporte local</h3>
      <p>Desde el terminal de Armenia el trayecto dura entre 30 y 45 minutos. Hay buses y combis frecuentes; el último regreso conviene confirmarlo en temporada alta. Enlace: <a href="/landing/hotel-barato-salento/">hoteles económicos en Salento</a>.</p>
      <h3>Desde Pereira y el aeropuerto Matecaña</h3>
      <p>Desde Pereira se toma bus hacia Armenia y conexión a Salento, o traslado directo de 2 a 2,5 horas. El aeropuerto Matecaña (PEI) es una de las entradas más cómodas. Estado de vías: <a href="/vias-salento-libres-acceso.html">vías libres de acceso</a>.</p>
      <h3>En jeep Willys desde la plaza</h3>
      <p>Los jeeps Willys son el sistema público hacia el Valle de Cocora, Filadelfia y veredas cercanas. Salen desde la Plaza de Bolívar cuando llenan cupo. Punto de referencia: <a href="/paginas-pautantes/punto-de-encuentro-jeeps-willys-plaza/">jeeps Willys en la plaza</a>.</p>
      <h3>Desde Bogotá o Medellín</h3>
      <p>La opción más práctica es volar a Armenia (AXM) o Pereira (PEI) y continuar por tierra. Alojamiento con anticipación: <a href="/hoteles-abiertos-salento.html">hoteles abiertos en Salento</a>.</p>
      <h2>Qué hacer en Salento</h2>
      <h3>Valle de Cocora y las palmas de cera</h3>
      <p>El sendero clásico rodea el río Quindío, cruza puentes colgantes y asciende entre niebla hasta el bosque de los Robles. Completa la vuelta en 4 a 6 horas con calzado con agarre y agua. Más información: <a href="/paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre/">Valle de Cocora entrada libre</a> y <a href="/landing/valle-de-cocora-guia/">guía del Valle de Cocora</a>.</p>
      <h3>Coffee tours en fincas cafeteras</h3>
      <p>Un coffee tour de media mañana enseña siembra, cosecha y cata en fincas familiares. Reserva directa: <a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/">Finca Don Eduardo</a> y <a href="/landing/coffee-tour-salento-precio/">guía de coffee tours</a>.</p>
      <h3>Calle Real, Plaza de Bolívar y miradores</h3>
      <p>La Calle Real concentra artesanías y heladerías locales. Sube al <a href="/paginas-pautantes/mirador-alto-de-la-cruz/">Alto de la Cruz</a> al atardecer y recorre la <a href="/paginas-pautantes/plaza-de-bolivar-de-salento/">Plaza de Bolívar</a>.</p>
      <h3>Gastronomía local</h3>
      <p>Prueba trucha arcoíris, patacones y café de la región. Reserva sin intermediarios en <a href="/categorias/restaurantes.html">restaurantes</a>, <a href="/paginas-pautantes/restaurante-don-elias/">Don Elías</a>, <a href="/paginas-pautantes/fonda-boquia/">Fonda Boquía</a> o <a href="/paginas-pautantes/boki-mall-restaurante-terra/">Boki Mall Terra</a>. Más ideas: <a href="/landing/mejor-trucha-salento/">mejor trucha en Salento</a>.</p>
      <h2>Mejores épocas para visitar Salento</h2>
      <h3>Diciembre a marzo: temporada seca</h3>
      <p>Mañanas más despejadas para el Valle de Cocora y miradores. Alta temporada: reserva alojamiento con anticipación. Ver <a href="/landing/hotel-barato-salento/">hoteles</a>.</p>
      <h3>Julio y agosto: vacaciones</h3>
      <p>El pueblo se llena de familias colombianas; lluvias de tarde habituales. Estado de atractivos: <a href="/valle-cocora-accesible-100.html">Valle de Cocora accesible</a>.</p>
      <h3>Temporada de lluvias: verde intenso</h3>
      <p>Abril-mayo y octubre-noviembre: más cascadas y menos gente. Plan B: <a href="/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/">Cascadas de Santa Rita</a>.</p>
      <h3>Puentes, Semana Santa y ferias</h3>
      <p>Mayor movimiento en ferias y eventos. Consulta <a href="/categorias/eventos.html">agenda de eventos</a> y el plan de <a href="/landing/que-hacer-salento-fin-de-semana/">fin de semana en Salento</a>.</p>
    </div>`;

html = html.replace('<div id="root"></div>', prerender + '\n    <div id="root"></div>');

// Canonical sin params (?lang= / ?q= -> versión limpia)
if (!/<link rel="canonical"[^>]*>/.test(html)) {
  html = html.replace('</head>', '  <link rel="canonical" href="https://www.salentoalamano.com/" />\n  </head>');
}
html = html.replace(/<link rel="canonical" href="[^"]*\?[^"]*"\s*\/?>/g, '<link rel="canonical" href="https://www.salentoalamano.com/" />');

// Fix meta tags for Naver/SEO
html = html.replace(/<title>.*?<\/title>/, '<title>Salento a la Mano - Guía Turística 2026</title>');
html = html.replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="Guía de Salento, Quindío. Hoteles, restaurantes, coffee tours y mapa interactivo."');
html = html.replace(/<meta property="og:title" content="[^"]*"/, '<meta property="og:title" content="Salento a la Mano | Guía Turística 2026"');
html = html.replace(/<meta property="og:description" content="[^"]*"/, '<meta property="og:description" content="Hoteles, restaurantes, coffee tours y mapa de Salento. Reserva directa."');
html = html.replace(/<meta name="naver-site-verification" content="[^"]*"/, '<meta name="naver-site-verification" content="932c1bd7459fb55347b5f347de3831588dfc7c4c"');
// Asegurar hreflang it en homepage
if (!/hreflang="it"/i.test(html) && !/hrefLang="it"/.test(html)) {
  html = html.replace(
    /(<link rel="alternate" hreflang="pt-BR"[^>]*>)/,
    '$1\n    <link rel="alternate" hreflang="it" href="https://www.salentoalamano.com/it/" />'
  );
}

fs.writeFileSync(distPath, html, 'utf8');
console.log('Prerender + meta tags injected into dist/index.html');
