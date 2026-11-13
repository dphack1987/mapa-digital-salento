/**
 * Genera variantes responsive (-400.webp / -800.webp) para las imágenes
 * que la home muestra en tamaños pequeños. Idempotente: no sobrescribe
 * variantes ya generadas si son más recientes que el original.
 *
 * Uso: node scripts/generate-responsive-images.cjs
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const SOURCES = [
  path.join(ROOT, 'src/components/HomeBanners.tsx'),
  path.join(ROOT, 'src/App.tsx'),
]
const WIDTHS = [400, 800]
const QUALITY = 72

function fileFor(urlPath) {
  return path.join(PUBLIC, decodeURIComponent(urlPath.replace(/^\//, '')))
}

function collectImagePaths() {
  const paths = new Set()
  const re = /(['"`])(\/(?:pautas|imagenes-salento)\/[^'"`\s]+?\.webp)\1/g
  for (const source of SOURCES) {
    if (!fs.existsSync(source)) continue
    const text = fs.readFileSync(source, 'utf8')
    for (const match of text.matchAll(re)) paths.add(match[2])
  }
  return [...paths]
}

function isFresh(original, variant) {
  if (!fs.existsSync(variant)) return false
  return fs.statSync(variant).mtimeMs >= fs.statSync(original).mtimeMs
}

async function main() {
  const paths = collectImagePaths()
  let generated = 0
  let skipped = 0
  let savedBytes = 0
  const missing = []

  for (const urlPath of paths) {
    const original = fileFor(urlPath)
    if (!fs.existsSync(original)) {
      missing.push(urlPath)
      continue
    }
    const originalSize = fs.statSync(original).size
    const meta = await sharp(original).metadata()

    for (const width of WIDTHS) {
      if (!meta.width || meta.width <= width) continue
      const variant = original.replace(/\.webp$/i, `-${width}.webp`)
      if (isFresh(original, variant)) {
        skipped++
        continue
      }
      await sharp(original)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(variant)
      generated++
      savedBytes += Math.max(0, originalSize - fs.statSync(variant).size)
    }
  }

  // Avatar del botón de Don Chucho: se muestra a 38-48 px.
  const avatar = path.join(PUBLIC, 'don-chucho-boton.webp')
  if (fs.existsSync(avatar)) {
    const tmp = `${avatar}.tmp.webp`
    const before = fs.statSync(avatar).size
    await sharp(avatar).resize({ width: 128, withoutEnlargement: true }).webp({ quality: 80 }).toFile(tmp)
    if (fs.statSync(tmp).size < before) {
      fs.renameSync(tmp, avatar)
      generated++
      savedBytes += before - fs.statSync(avatar).size
    } else {
      fs.unlinkSync(tmp)
    }
  }

  console.log(`Imágenes fuente: ${paths.length}`)
  console.log(`Variantes generadas: ${generated}`)
  console.log(`Variantes al día: ${skipped}`)
  console.log(`Ahorro potencial: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`)
  if (missing.length) {
    console.log(`Referencias sin archivo (${missing.length}):`)
    missing.slice(0, 10).forEach((p) => console.log(`  - ${p}`))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
