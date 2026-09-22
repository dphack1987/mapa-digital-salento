import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(distPath, 'utf8');

const prerender = `    <div id="prerender" style="font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px">
      <h1>Salento a la Mano - Guia Turistica Oficial de Salento, Quindio 2026</h1>
      <p>Descubre hoteles abiertos, restaurantes autenticos, coffee tours, Valle de Cocora, palmas de cera y experiencias unicas con el mapa turistico digital mas completo de Salento, Quindio.</p>
      <h2>Categorias</h2>
      <ul>
        <li><a href="/categorias/restaurantes.html">Restaurantes en Salento</a></li>
        <li><a href="/categorias/cafes.html">Cafes en Salento</a></li>
        <li><a href="/categorias/alojamientos.html">Alojamientos en Salento</a></li>
        <li><a href="/categorias/coffee-tours.html">Coffee Tours en Salento</a></li>
        <li><a href="/categorias/atractivos-turisticos.html">Atractivos Turisticos en Salento</a></li>
        <li><a href="/categorias/experiencias.html">Experiencias en Salento</a></li>
        <li><a href="/categorias/servicios.html">Servicios en Salento</a></li>
        <li><a href="/categorias/tiendas.html">Tiendas en Salento</a></li>
        <li><a href="/categorias/camping.html">Camping en Salento</a></li>
        <li><a href="/categorias/artesanias.html">Artesanias en Salento</a></li>
        <li><a href="/categorias/eventos.html">Eventos en Salento</a></li>
      </ul>
      <h2>Pautantes destacados en Salento</h2>
      <ul>
        <li><a href="/paginas-pautantes/fonda-boquia/index.html">Fonda Boquia - Restaurante tradicional en Salento</a></li>
        <li><a href="/paginas-pautantes/restaurante-don-elias/index.html">Restaurante Don Elias en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-restaurante-terra/index.html">Restaurante Terra en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-barcinales-cafe-bar/index.html">Barcinales Cafe Bar en Salento</a></li>
        <li><a href="/paginas-pautantes/finca-cafetera-don-elias/index.html">Finca Cafetera Don Elias - Coffee Tour en Salento</a></li>
        <li><a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/index.html">Finca Don Eduardo - Coffee Tour en Salento</a></li>
        <li><a href="/paginas-pautantes/hotel-la-floresta-salento/index.html">Hotel La Floresta en Salento</a></li>
        <li><a href="/paginas-pautantes/hotel-camino-nacional-salento/index.html">Hotel Camino Nacional en Salento</a></li>
        <li><a href="/paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/index.html">Hotel El Mirador de Boquia en Salento</a></li>
        <li><a href="/paginas-pautantes/camping-cascadas-de-santa-rita/index.html">Camping Cascadas de Santa Rita en Salento</a></li>
      </ul>
      <h2>Guias turisticas de Salento</h2>
      <ul>
        <li><a href="/mejor-trucha-salento.html">Mejor trucha en Salento</a></li>
        <li><a href="/hotel-barato-salento.html">Hotel barato en Salento</a></li>
        <li><a href="/coffee-tour-salento.html">Coffee tour en Salento</a></li>
        <li><a href="/valle-de-cocora-salento.html">Valle de Cocora - Guia completa</a></li>
        <li><a href="/fin-de-semana-salento.html">Fin de semana en Salento</a></li>
        <li><a href="/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html">Preguntas frecuentes sobre Salento</a></li>
        <li><a href="/seguridad-salento-emergencias.html">Seguridad y emergencias en Salento</a></li>
      </ul>
      <h2>Mapa interactivo de Salento</h2>
      <p><a href="/mapa-interactivo-salento.html">Explora el mapa turistico interactivo de Salento con hoteles, restaurantes, coffee tours y atractivos turisticos</a></p>
      <p><a href="https://www.mapaturisticodelquindio.com">Mapa Turistico del Quindio - Sitio aliado con 70+ negocios</a></p>
      <h2>Salento, Quindio: guia completa para planear tu visita</h2>
      <p>Salento es un pueblo paisa a 1895 metros en el Quindio, corazon del Eje Cafetero. Su casco urbano conserva calles empedradas, balcones de guadua y casas de bahareque de colores. Desde la Plaza de Bolivar y el mirador del Alto de la Cruz se entiende por que miles de viajeros llegan cada anio en busca de naturaleza, cafe de origen y experiencias autenticas con la comunidad. El gran reclamo es el Valle de Cocora, a pocos minutos en jeep, atravesado por el rio Quindio y flanqueado por palmas de cera de mas de 60 metros. En el pueblo, los jeeps Willys parten desde la plaza hacia fincas, senderos y miradores. Muchos visitantes combinan el Alto de la Cruz al atardecer, una manana de siembra y cata en finca, y una tarde lenta por la Calle Real, donde las tiendas de artesania conviven con heladerias y cafes de especialidad. El clima de altura suaviza las jornadas: mananas frescas, tardes templadas y noches ideales para cenar con vistas al valle. Esta guia reune como llegar, que hacer y cuando ir, con enlaces a pautantes y guias extendidas para armar un itinerario claro y sin vueltas.</p>
      <h2>Como llegar a Salento</h2>
      <h3>Desde Armenia en bus o transporte local</h3>
      <p>Desde el terminal de Armenia el trayecto dura entre 30 y 45 minutos. Hay buses y combis frecuentes; el ultimo regreso conviene confirmarlo en temporada alta. Enlace: <a href="/landing/hotel-barato-salento/">hoteles economicos en Salento</a>.</p>
      <h3>Desde Pereira y el aeropuerto Matecana</h3>
      <p>Desde Pereira se toma bus hacia Armenia y conexion a Salento, o traslado directo de 2 a 2.5 horas. El aeropuato Matecana (PEI) es una de las entradas mas comodas. Estado de vias: <a href="/vias-salento-libres-acceso.html">vias libres de acceso</a>.</p>
      <h3>En jeep Willys desde la plaza</h3>
      <p>Los jeeps Willys son el sistema publico hacia el Valle de Cocora, Filadelfia y veredas cercanas. Salen desde la Plaza de Bolivar cuando llenan cupo. Punto de referencia: <a href="/paginas-pautantes/punto-de-encuentro-jeeps-willys-plaza/">jeeps Willys en la plaza</a>.</p>
      <h3>Desde Bogota o Medellin</h3>
      <p>La opcion mas practica es volar a Armenia (AXM) o Pereira (PEI) y continuar por tierra. Alojamiento con anticipacion: <a href="/hoteles-abiertos-salento.html">hoteles abiertos en Salento</a>.</p>
      <h2>Que hacer en Salento</h2>
      <h3>Valle de Cocora y las palmas de cera</h3>
      <p>El sendero clasico rodea el rio Quindio, cruza puentes colgantes y asciende entre niebla hasta el bosque de los Robles. Completa la vuelta en 4 a 6 horas con calzado con agarre y agua. Mas info: <a href="/paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre/">Valle de Cocora entrada libre</a> y <a href="/landing/valle-de-cocora-guia/">guia del Valle de Cocora</a>.</p>
      <h3>Coffee tours en fincas cafeteras</h3>
      <p>Un coffee tour de media manana ensena siembra, cosecha y cata en fincas familiares. Reserva directa: <a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/">Finca Don Eduardo</a> y <a href="/coffee-tour-salento.html">guia de coffee tours</a>.</p>
      <h3>Calle Real, Plaza de Bolivar y miradores</h3>
      <p>La Calle Real concentra artesanias y heladerias locales. Sube al <a href="/paginas-pautantes/mirador-alto-de-la-cruz/">Alto de la Cruz</a> al atardecer y recorre la <a href="/paginas-pautantes/plaza-de-bolivar-de-salento/">Plaza de Bolivar</a>.</p>
      <h3>Gastronomia local</h3>
      <p>Prueba trucha arcoiris, patacones y cafe de la region. Reserva sin intermediarios en <a href="/categorias/restaurantes.html">restaurantes</a>, <a href="/paginas-pautantes/restaurante-don-elias/">Don Elias</a>, <a href="/paginas-pautantes/fonda-boquia/">Fonda Boquia</a> o <a href="/paginas-pautantes/boki-mall-restaurante-terra/">Boki Mall Terra</a>. Mas ideas: <a href="/landing/mejor-trucha-salento/">mejor trucha en Salento</a>.</p>
      <h2>Mejores epocas para visitar Salento</h2>
      <h3>Diciembre a marzo: temporada seca</h3>
      <p>Mananas mas despejadas para el Valle de Cocora y miradores. Alta temporada: reserva alojamiento con anticipacion. Ver <a href="/landing/hotel-barato-salento/">hoteles</a>.</p>
      <h3>Julio y agosto: vacaciones</h3>
      <p>El pueblo se llena de familias colombianas; lluvias de tarde habituales. Estado de atractivos: <a href="/valle-cocora-accesible-100.html">Valle de Cocora accesible</a>.</p>
      <h3>Temporada de lluvias: verde intenso</h3>
      <p>Abril-mayo y octubre-noviembre: mas cascadas y menos gente. Plan B: <a href="/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/">Cascadas de Santa Rita</a>.</p>
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
html = html.replace(/<title>.*?<\/title>/, '<title>Salento a la Mano - Guia Turistica 2026</title>');
html = html.replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="Guia de Salento, Quindio. Hoteles, restaurantes, coffee tours y mapa interactivo."');
html = html.replace(/<meta property="og:title" content="[^"]*"/, '<meta property="og:title" content="Salento a la Mano | Guia Turistica 2026"');
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
