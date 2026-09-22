/* Auditoría EXHAUSTIVA de imágenes: cubre todos los patrones posibles */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PUBLIC = path.join(ROOT, 'public');
const IMG_RE = /\.(png|jpe?g|webp|gif|svg|ico|avif|bmp)(\?|#|["'\s)\>]|$)/i;

function walk(dir, skip = ['node_modules', '.git', 'dist', 'venv', '__pycache__', '.trae', '.devin', 'assets']) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p, skip));
    else out.push(p);
  }
  return out;
}

function fileExistsInPublic(pubPath) {
  // pubPath puede empezar con /
  let clean = pubPath.replace(/^\//, '');
  try { clean = decodeURIComponent(clean); } catch {}
  return fs.existsSync(path.join(PUBLIC, clean));
}

function findEquivalent(pubPath) {
  let clean = pubPath.replace(/^\//, '');
  try { clean = decodeURIComponent(clean); } catch {}
  const noExt = clean.replace(/\.(png|jpe?g|webp|gif|svg|ico|avif|bmp)$/i, '');
  for (const ext of ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif']) {
    if (fs.existsSync(path.join(PUBLIC, noExt + ext))) return '/' + noExt + ext;
  }
  return null;
}

/* Extraer TODAS las cadenas que parezcan ruta de imagen */
function extractImageRefs(content, file) {
  const refs = [];
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const lineNo = i + 1;

    // Patrón 1: cualquier cadena entre quotes que contenga ext de imagen
    // Cubre: '...', "...", `...`
    // Ignorar concatenaciones JS como P+'archivo.jpg'
    const strRe = /['"`]([^'"`\n]*\.(?:png|jpe?g|webp|gif|svg|ico|avif|bmp)(?:[?#][^'"`\n]*)?)['"`]/gi;
    let m;
    while ((m = strRe.exec(ln)) !== null) {
      // Skip si es parte de concatenación JS (precedido por +)
      const before = ln.substring(Math.max(0, m.index - 2), m.index);
      if (before.endsWith('+')) continue;
      refs.push({ line: lineNo, raw: m[1] });
    }

    // Patrón 2: url(...) en CSS
    const urlRe = /url\(\s*['"]?([^'")\s]+?\.(?:png|jpe?g|webp|gif|svg|ico|avif|bmp)(?:[?#][^'")\s]*)?)['"]?\s*\)/gi;
    while ((m = urlRe.exec(ln)) !== null) {
      refs.push({ line: lineNo, raw: m[1] });
    }

    // Patrón 3: src=... href=... content=... (sin quotes previas ya capturados)
    const attrRe = /(?:src|href|content|poster|data-src)\s*=\s*['"]([^'"]+\.(?:png|jpe?g|webp|gif|svg|ico|avif|bmp)(?:[?#][^'"]*)?)['"]/gi;
    while ((m = attrRe.exec(ln)) !== null) {
      refs.push({ line: lineNo, raw: m[1] });
    }
  }
  return refs;
}

function resolveRef(raw, file) {
  let clean = raw.replace(/[?#].*$/, '');
  // Ignorar URLs externas, data URIs, blobs
  if (/^(https?:|data:|blob:|mailto:|\/\/|javascript:)/i.test(clean)) return null;
  // Ignorar template literals de JS minificado
  if (clean.includes('${') || (clean.includes('}') && !clean.match(/^\/[a-z]/i))) return null;
  // Ignorar concatenaciones JS como P+'...' (falsos positivos de variables)
  if (/^[A-Za-z_$][\w$]*\s*\+/.test(clean)) return null;
  // Solo interesan rutas que parecen locales
  if (clean.startsWith('/')) return clean;

  // Ruta relativa al archivo
  const abs = path.resolve(path.dirname(file), clean);
  // Debe estar dentro de public/
  const rel = path.relative(PUBLIC, abs).replace(/\\/g, '/');
  if (rel.startsWith('..')) return null;
  return '/' + rel;
}

const allFiles = walk(ROOT).filter(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  // Excluir backups, builds viejos, minificados, y scripts de auditoría
  if (rel.includes('.backup-')) return false;
  if (rel.startsWith('public/assets/')) return false;
  if (rel.startsWith('tools/backup-')) return false;
  if (rel.endsWith('.min.js')) return false;
  if (rel === 'audit-images.cjs' || rel === 'fix-images.cjs' || rel === 'fix-remaining.cjs') return false;
  if (rel === 'image-inventory.json') return false;
  return true;
});
const results = [];

for (const file of allFiles) {
  const ext = path.extname(file).toLowerCase();
  // Escanear estos tipos de archivo
  const scanExts = ['.html', '.htm', '.tsx', '.ts', '.jsx', '.js', '.css', '.json', '.xml', '.webmanifest', '.txt', '.md', '.mjs', '.cjs'];
  if (!scanExts.includes(ext)) continue;

  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }

  const refs = extractImageRefs(content, file);
  for (const r of refs) {
    const resolved = resolveRef(r.raw, file);
    if (!resolved) continue;
    // Solo rutas que apuntan a áreas de imágenes conocidas o con ruta local
    if (!resolved.match(/^\/(pautas|imagenes-salento|img|images|assets|logo|avatar|don|icons|favicon|screenshots|imagenes)\//i)
        && !resolved.match(/^\/[^/]+\.(png|jpe?g|webp|gif|svg|ico|avif|bmp)$/i)) {
      // ruta local en subdirectorio - verificar también
    }
    const exists = fileExistsInPublic(resolved);
    const equiv = exists ? null : findEquivalent(resolved);
    results.push({
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      line: r.line,
      raw: r.raw,
      resolved,
      exists,
      equiv
    });
  }
}

// Deduplicar por file:line:resolved
const seen = new Set();
const unique = results.filter(r => {
  const k = `${r.file}:${r.line}:${r.resolved}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

const ok = unique.filter(r => r.exists);
const broken = unique.filter(r => !r.exists);
const fixable = broken.filter(r => r.equiv);
const unfixable = broken.filter(r => !r.equiv);

console.log('='.repeat(70));
console.log('AUDITORÍA EXHAUSTIVA DE IMÁGENES');
console.log('='.repeat(70));
console.log(`Archivos escaneados      : ${allFiles.length}`);
console.log(`Referencias únicas       : ${unique.length}`);
console.log(`OK (existen)             : ${ok.length}`);
console.log(`ROTAS                    : ${broken.length}`);
console.log(`  Corregibles (equiv.)   : ${fixable.length}`);
console.log(`  SIN equivalente        : ${unfixable.length}`);
console.log('='.repeat(70));

if (fixable.length) {
  console.log('\n--- CORREGIBLES ---');
  for (const r of fixable) {
    console.log(`  ${r.file}:${r.line}`);
    console.log(`    rota: ${r.resolved}`);
    console.log(`    real: ${r.equiv}`);
  }
}

if (unfixable.length) {
  console.log('\n--- SIN EQUIVALENTE ---');
  for (const r of unfixable) {
    console.log(`  ${r.file}:${r.line}`);
    console.log(`    falta: ${r.resolved}`);
  }
}

// Fix automático
if (process.argv.includes('--fix') && fixable.length) {
  console.log('\n--- APLICANDO CORRECCIONES ---');
  const byFile = {};
  for (const r of fixable) {
    if (!byFile[r.file]) byFile[r.file] = [];
    byFile[r.file].push(r);
  }
  for (const [file, refs] of Object.entries(byFile)) {
    const abs = path.join(ROOT, file);
    let content = fs.readFileSync(abs, 'utf8');
    for (const r of refs) {
      content = content.split(r.resolved).join(r.equiv);
      if (r.raw !== r.resolved && r.raw !== r.equiv) {
        content = content.split(r.raw).join(r.equiv);
      }
    }
    fs.writeFileSync(abs, content, 'utf8');
    console.log(`  FIXED: ${file} (${refs.length})`);
  }
}

// Guardar inventario
const inv = {
  generatedAt: new Date().toISOString(),
  total: unique.length,
  ok: ok.length,
  broken: broken.length,
  fixable: fixable.length,
  unfixable: unfixable.length,
  references: unique.map(r => ({
    file: r.file, line: r.line, path: r.resolved,
    status: r.exists ? 'OK' : (r.equiv ? 'FIXABLE' : 'MISSING'),
    equivalent: r.equiv
  }))
};
fs.writeFileSync(path.join(ROOT, 'image-inventory.json'), JSON.stringify(inv, null, 2));
console.log('\nInventario: image-inventory.json');
process.exit(broken.length > 0 ? 1 : 0);
