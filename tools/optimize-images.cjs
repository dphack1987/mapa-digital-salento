/**
 * Optimización general de imágenes de public/:
 *  A) raster no-webp (jpg/png/jfif/avif) -> webp, con actualización de referencias
 *     y borrado del original solo si quedan 0 referencias viejas.
 *  B) webp >250KB -> recomprimir in situ (mismo nombre, sin tocar referencias).
 * Uso: node tools/optimize-images.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DRY = process.argv.includes('--dry');
const RASTER_RE = /(\.(jpe?g|png|jfif|avif))+$/i;
const SKIP_CONVERT = /favicon|apple-touch|android-chrome|safari-pinned|site\.webmanifest|\.ico$/i;
const TEXT_EXT = /\.(html|json|tsx?|js|cjs|mjs|css|md|txt|xml|svg)$/i;
const BIG_WEBP = 250 * 1024;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function refFiles() {
  const out = [];
  let list = '';
  try { list = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', maxBuffer: 1e8 }); } catch { }
  for (const f of list.split('\n')) {
    if (!f.trim() || !TEXT_EXT.test(f)) continue;
    out.push(path.join(ROOT, f));
  }
  return out;
}

const files = walk(PUBLIC);
const rasters = files.filter(f => RASTER_RE.test(f) && !f.endsWith('.webp') && !SKIP_CONVERT.test(path.basename(f)));
const bigWebp = files.filter(f => /\.webp$/i.test(f) && fs.statSync(f).size > BIG_WEBP);

async function convertOne(oldPath, refs) {
  const oldName = path.basename(oldPath);
  const newName = oldName.replace(RASTER_RE, '') + '.webp';
  const newPath = path.join(path.dirname(oldPath), newName);
  const oldKB = fs.statSync(oldPath).size / 1024;
  const isLogo = /logo|avatar|icon/i.test(oldName);
  const isArt = /arte|publicitari/i.test(oldName);
  if (!fs.existsSync(newPath)) {
    if (DRY) { console.log(`DRY convertiría: ${oldName} (${oldKB.toFixed(0)}KB)`); return; }
    try {
      let img = sharp(oldPath).rotate();
      if (!isLogo) img = img.resize({ width: isArt ? 1920 : 1600, withoutEnlargement: true });
      await img.webp({ quality: isLogo ? 86 : isArt ? 82 : 75, effort: 6 }).toBuffer()
        .then(b => fs.writeFileSync(newPath, b));
    } catch (e) { console.log(`FALLO ${oldName}: ${e.message}`); return; }
  }
  const newKB = fs.statSync(newPath).size / 1024;
  const pairs = [[oldName, newName], [encodeURIComponent(oldName), encodeURIComponent(newName)]];
  let changed = 0;
  for (const f of refs) {
    let c; try { c = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (!c.includes(oldName) && !c.includes(encodeURIComponent(oldName))) continue;
    let n = c;
    for (const [from, to] of pairs) if (n.includes(from)) n = n.split(from).join(to);
    if (n !== c && !DRY) { fs.writeFileSync(f, n); changed++; }
  }
  let leftover = 0;
  for (const f of refs) {
    let c; try { c = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (c.includes(oldName) || c.includes(encodeURIComponent(oldName))) leftover++;
  }
  if (leftover === 0 && !DRY) fs.unlinkSync(oldPath);
  console.log(`${oldName} | ${oldKB.toFixed(0)}KB -> ${newKB.toFixed(0)}KB | refs:${changed} | ${leftover === 0 ? 'orig eliminado' : 'CONSERVA orig (' + leftover + ' refs)'}`);
}

async function recompress(f) {
  const oldKB = fs.statSync(f).size / 1024;
  const isLogo = /logo|avatar|icon/i.test(path.basename(f));
  for (let intento = 0; intento < 3; intento++) {
    try {
      const src = await fs.promises.readFile(f);
      const meta = await sharp(src).metadata();
      let img = sharp(src);
      if (meta.width > 1600) img = img.resize({ width: 1600 });
      const buf = await img.webp({ quality: isLogo ? 82 : 65, effort: 6 }).toBuffer();
      if (buf.length < src.length) {
        if (!DRY) await fs.promises.writeFile(f, buf);
        console.log(`${path.basename(f)} | ${oldKB.toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`);
        return oldKB - buf.length / 1024;
      }
      console.log(`${path.basename(f)} | ${oldKB.toFixed(0)}KB (ya optimizado, se conserva)`);
      return 0;
    } catch (e) {
      if (intento === 2) console.log(`FALLO ${path.basename(f)}: ${e.message} code=${e.code || ''}`);
      else await new Promise(r => setTimeout(r, 300));
    }
  }
  return 0;
}

(async () => {
  console.log(`== PASO A: ${rasters.length} raster no-webp`);
  const refs = refFiles();
  let saved = 0;
  for (const f of rasters) {
    const before = fs.existsSync(f) ? fs.statSync(f).size : 0;
    await convertOne(f, refs);
    const np = f.replace(RASTER_RE, '') + '.webp';
    if (fs.existsSync(np)) saved += (before - fs.statSync(np).size) / 1024;
  }
  console.log(`== PASO A ahorro: ${saved.toFixed(0)}KB`);
  console.log(`== PASO B: ${bigWebp.length} webp >250KB`);
  let savedB = 0;
  for (const f of bigWebp) savedB += await recompress(f);
  console.log(`== PASO B ahorro: ${savedB.toFixed(0)}KB`);
})();
