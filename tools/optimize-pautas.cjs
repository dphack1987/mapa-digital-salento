/**
 * Convierte imágenes no-webp de carpetas de pautantes a webp comprimido,
 * actualiza todas las referencias (HTML, JSON, TSX, MD) y elimina el original
 * solo si quedan 0 referencias al nombre antiguo.
 * Uso: node tools/optimize-pautas.cjs [carpeta1 carpeta2 ...]
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PAUTAS = path.join(ROOT, 'public', 'pautas');
const TARGETS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['mirador-manos-de-cocora', 'ruta-navarco', 'downhill_bike_salento', 'hotel-barranqueros'];

const IMG_RE = /(\.(jfif|jpe?g|png))+$/i;
const REF_DIRS = ['public', 'src', 'index.html'];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  if (fs.statSync(dir).isFile()) { out.push(dir); return out; }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', 'dist', '.git'].includes(e.name)) walk(p, out); }
    else if (/\.(html|json|tsx?|md|txt|css)$/i.test(e.name)) out.push(p);
  }
  return out;
}

function collectRefFiles() {
  const files = new Set();
  for (const t of REF_DIRS) walk(path.join(ROOT, t), []).forEach(f => files.add(f));
  return [...files];
}

async function convert(dirName) {
  const dir = path.join(PAUTAS, dirName);
  if (!fs.existsSync(dir)) { console.log('NO EXISTE ' + dirName); return; }
  const imgs = [];
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (IMG_RE.test(e.name) && !e.name.endsWith('.webp')) imgs.push(p);
    }
  })(dir);

  const refFiles = collectRefFiles();
  let savedTotal = 0;

  for (const oldPath of imgs) {
    const oldName = path.basename(oldPath);
    const newName = oldName.replace(IMG_RE, '') + '.webp';
    const newPath = path.join(path.dirname(oldPath), newName);
    const oldKB = fs.statSync(oldPath).size / 1024;
    if (fs.existsSync(newPath)) {
      // ya convertido antes: solo refrescar referencias y borrar original
    } else {
      const isLogo = /logo/i.test(oldName);
      const isArt = /arte|publicitari/i.test(oldName);
      try {
        let img = sharp(oldPath).rotate();
        if (!isLogo) img = img.resize({ width: isArt ? 1920 : 1600, withoutEnlargement: true });
        await img.webp({ quality: isLogo ? 86 : isArt ? 82 : 75, effort: 6 }).toFile(newPath);
      } catch (e) {
        console.log('FALLO ' + oldName + ' -> ' + e.message);
        continue;
      }
    }
    const newKB = fs.statSync(newPath).size / 1024;

    // actualizar referencias: cruda y URL-encoded
    const pairs = [
      [oldName, newName],
      [encodeURIComponent(oldName), encodeURIComponent(newName)],
    ];
    let changedFiles = 0;
    for (const f of refFiles) {
      let c;
      try { c = fs.readFileSync(f, 'utf8'); } catch { continue; }
      if (!c.includes(oldName) && !c.includes(encodeURIComponent(oldName))) continue;
      let n = c;
      for (const [from, to] of pairs) {
        if (n.includes(from)) n = n.split(from).join(to);
      }
      if (n !== c) { fs.writeFileSync(f, n); changedFiles++; }
    }

    // verificar que NO queden referencias al nombre viejo
    let leftover = 0;
    for (const f of refFiles) {
      let c;
      try { c = fs.readFileSync(f, 'utf8'); } catch { continue; }
      if (c.includes(oldName) || c.includes(encodeURIComponent(oldName))) { leftover++; console.log('  REF QUEDA: ' + path.basename(f) + ' <- ' + oldName); }
    }
    if (leftover === 0) {
      fs.unlinkSync(oldPath);
      savedTotal += oldKB - newKB;
      console.log(dirName + ' | ' + oldName + ' | ' + oldKB.toFixed(0) + 'KB -> ' + newKB.toFixed(0) + 'KB | refs ok (' + changedFiles + ' archivos) | orig eliminado');
    } else {
      console.log(dirName + ' | ' + oldName + ' | CONVERTIDO pero orig SE CONSERVA (' + leftover + ' refs)');
    }
  }
  console.log('== ' + dirName + ' ahorro: ' + savedTotal.toFixed(0) + 'KB');
}

(async () => {
  for (const d of TARGETS) await convert(d);
})();
