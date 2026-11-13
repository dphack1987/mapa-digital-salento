/**
 * Auditoría de cobertura de traducciones del diccionario base.
 * Uso: npm run check:translations
 *
 * Cuenta las claves declaradas en cada bloque de `translationService.ts`.
 * Las claves que falten en un idioma caen al fallback (en → es), así que
 * este informe sirve para detectar huecos antes de publicar.
 */
const fs = require('fs')
const path = require('path')

const SOURCE = path.join(__dirname, 'src/services/translationService.ts')
const REFERENCE = 'es'
const LANGUAGES = ['es', 'en', 'fr', 'de', 'pt', 'it', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'en-gb', 'ar']

const content = fs.readFileSync(SOURCE, 'utf8')

/** Extrae el cuerpo de cada bloque `'xx': { ... }` con llaves balanceadas. */
function extractBlocks(source) {
  const blocks = {}
  const header = /'([\w-]+)'\s*:\s*\{/g
  let match
  while ((match = header.exec(source)) !== null) {
    const start = header.lastIndex
    let depth = 1
    let i = start
    let inString = null
    while (i < source.length && depth > 0) {
      const char = source[i]
      if (inString) {
        if (char === '\\') i++
        else if (char === inString) inString = null
      } else if (char === "'" || char === '"' || char === '`') {
        inString = char
      } else if (char === '{') {
        depth++
      } else if (char === '}') {
        depth--
      }
      i++
    }
    blocks[match[1]] = source.slice(start, i - 1)
  }
  return blocks
}

/** Claves de primer nivel del bloque: `clave:` o `'clave.con.punto':`. */
function extractKeys(body) {
  const keys = new Set()
  const re = /^\s*(?:'([^']+)'|"([^"]+)"|([\w.$-]+))\s*:/gm
  let match
  while ((match = re.exec(body)) !== null) {
    const key = match[1] ?? match[2] ?? match[3]
    if (key && !['true', 'false', 'null', 'undefined'].includes(key)) keys.add(key)
  }
  return keys
}

const blocks = extractBlocks(content)
const report = {}
for (const language of LANGUAGES) {
  const body = blocks[language]
  report[language] = {
    present: Boolean(body),
    keys: body ? extractKeys(body) : new Set()
  }
}

const referenceKeys = report[REFERENCE]?.keys ?? new Set()

console.log('=== COBERTURA DE TRADUCCIONES (diccionario base) ===\n')
for (const language of LANGUAGES) {
  const { present, keys } = report[language]
  if (!present) {
    console.log(`${language.toUpperCase().padEnd(6)} SIN BLOQUE`)
    continue
  }
  const missing = referenceKeys.size ? [...referenceKeys].filter((key) => !keys.has(key)).length : 0
  const pct = referenceKeys.size ? Math.round(((referenceKeys.size - missing) / referenceKeys.size) * 100) : 100
  console.log(`${language.toUpperCase().padEnd(6)} ${String(keys.size).padStart(4)} claves  ${String(pct).padStart(3)}% de ${REFERENCE}`)
}

console.log('\n=== HUECOS (primeras 15 claves por idioma) ===\n')
let issues = 0
for (const language of LANGUAGES) {
  if (language === REFERENCE) continue
  const { present, keys } = report[language]
  if (!present) continue
  const missing = [...referenceKeys].filter((key) => !keys.has(key))
  if (missing.length === 0) continue
  issues++
  console.log(`${language.toUpperCase()}: ${missing.length} sin traducir`)
  console.log(`  ${missing.slice(0, 15).join(', ')}${missing.length > 15 ? '…' : ''}`)
  console.log('')
}

if (issues === 0) {
  console.log(`Todos los idiomas cubren las ${referenceKeys.size} claves de ${REFERENCE}.`)
}
