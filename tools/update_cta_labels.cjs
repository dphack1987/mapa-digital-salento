/**
 * Actualiza CTAs de botones por categoría sin borrar contenido:
 * - Restaurantes/Cafés/Bars → Ver menú
 * - Alojamientos/Camping → Reservar ya
 * - Resto → Ver información
 * Solo toca <a class="btn primary"> con texto Ver ficha / Ver página.
 */
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

function ctaForHref(href) {
  if (/restaurant|terra|fonda|restaurante|barcinales|cafetera-don-elias/i.test(href) && !/hotel|hostel|alojamiento|camping|ocaso|floresta/i.test(href)) {
    return 'Ver menú'
  }
  if (/alojamiento|hotel|hostel|camping|ocaso|floresta|camino-nacional|tia-emiss|mahalo|mirador-de-boquia|mirador-boquia|santa-rita/i.test(href)) {
    return 'Reservar ya'
  }
  return 'Ver información'
}

function processHtml(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  let html = original

  html = html.replace(
    /<a class="btn primary" href="([^"]+)">Ver página<\/a>/g,
    (_m, href) => `<a class="btn primary" href="${href}">${ctaForHref(href)}</a>`
  )

  html = html.replace(
    /<a class="btn primary" href="([^"]+)">Ver ficha(?: completa)?<\/a>/g,
    (_m, href) => `<a class="btn primary" href="${href}">${ctaForHref(href)}</a>`
  )

  if (html !== original) {
    fs.writeFileSync(filePath, html)
    return true
  }
  return false
}

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      out.push(...walk(full))
    } else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

const targets = walk(path.join(root, 'public'))
let changed = 0
for (const file of targets) {
  if (processHtml(file)) {
    changed++
    console.log('updated:', path.relative(root, file))
  }
}
console.log(`done: ${changed}/${targets.length} files`)
