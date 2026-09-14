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
    </div>`;

html = html.replace('<div id="root"></div>', prerender + '\n    <div id="root"></div>');

fs.writeFileSync(distPath, html, 'utf8');
console.log('Prerender content injected into dist/index.html');
