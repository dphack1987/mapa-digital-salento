/**
 * Enriquece de forma ADITIVA el JSON-LD de las fichas de paginas-pautantes.
 *
 * - Trabaja sobre el bloque de la entidad principal (no BreadcrumbList).
 * - Añade solo propiedades derivadas de datos YA presentes en la propia ficha:
 *     speakable       -> selectores existentes en la ficha (h1, .lead)
 *     contactPoint    -> telephone / email ya declarados en el nodo
 *     potentialAction -> ReserveAction apuntando al enlace wa.me de la ficha
 * - Idempotente: si la propiedad ya existe, no la duplica.
 * - No modifica HTML visible, CSS ni contenido: solo el bloque JSON-LD.
 *
 * Uso:
 *   node tools/enrich_ficha_structured_data.cjs           (dry-run)
 *   node tools/enrich_ficha_structured_data.cjs --apply   (aplica)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'public', 'paginas-pautantes');
const apply = process.argv.includes('--apply');
const BLOCK_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function isMainEntity(node) {
  return (
    node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    node['@type'] &&
    node['@type'] !== 'BreadcrumbList' &&
    (node.address || node.geo || node.url)
  );
}

function waLink(text) {
  const m = text.match(/https:\/\/wa\.me\/(\d+)/);
  return m ? `https://wa.me/${m[1]}` : '';
}

let files = 0;
let totalAdded = 0;

for (const dir of fs.readdirSync(BASE).sort()) {
  const file = path.join(BASE, dir, 'index.html');
  if (!fs.existsSync(file)) continue;

  const text = fs.readFileSync(file, 'utf8');
  const wa = waLink(text);
  const report = [];

  const out = text.replace(BLOCK_RE, (full, inner) => {
    let node;
    try {
      node = JSON.parse(inner);
    } catch (err) {
      return full;
    }
    if (!isMainEntity(node)) return full;

    const added = [];
    if (!node.speakable) {
      node.speakable = { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.lead'] };
      added.push('speakable');
    }
    if (!node.contactPoint && (node.telephone || node.email)) {
      node.contactPoint = { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['es', 'en'] };
      if (node.telephone) node.contactPoint.telephone = node.telephone;
      if (node.email) node.contactPoint.email = node.email;
      added.push('contactPoint');
    }
    if (!node.potentialAction && wa) {
      node.potentialAction = {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: wa,
          inLanguage: 'es-CO',
          actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
        },
      };
      added.push('potentialAction');
    }
    if (!added.length) return full;

    report.push(...added);
    totalAdded += added.length;
    return `<script type="application/ld+json">${JSON.stringify(node)}</script>`;
  });

  if (!report.length) continue;
  files += 1;
  if (apply) fs.writeFileSync(file, out, 'utf8');
  console.log(`${apply ? 'UPDATED      ' : 'WOULD_UPDATE '}${dir}  (+${report.join(', +')})`);
}

console.log(`${apply ? 'Archivos actualizados' : 'Archivos a actualizar'}: ${files} | propiedades: ${totalAdded}`);
