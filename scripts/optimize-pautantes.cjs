const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MAX_WIDTH = 1200;
const QUALITY = 80;
const dirs = [
  'public/paginas-pautantes/calle-real-de-salento',
  'public/paginas-pautantes/iglesia-de-nuestra-senora-del-carmen-de-salento',
  'public/paginas-pautantes/mirador-alto-de-la-cruz',
  'public/paginas-pautantes/mirador-del-condor-salento',
  'public/paginas-pautantes/mirador-las-manos-de-dios',
  'public/paginas-pautantes/plaza-de-bolivar-de-salento',
  'public/paginas-pautantes/puente-de-boquia-sendero-cercano',
  'public/paginas-pautantes/punto-de-encuentro-jeeps-willys-plaza',
  'public/paginas-pautantes/recorrido-cultural-casco-historico',
  'public/paginas-pautantes/sendero-de-las-palmas-entrada-libre-valle',
  'public/paginas-pautantes/terminal-de-transporte-de-salento-acceso-peatonal',
  'public/paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre',
  'public/paginas-pautantes/reserva-natural-cascadas-de-santa-rita'
];

const exts = ['.jpg', '.jpeg', '.png', '.webp', '.jfif'];
let totalProcessed = 0;
let totalSaved = 0;

async function optimizeImage(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.svg') return;
    const buffer = fs.readFileSync(filePath);
    let pipeline = sharp(buffer).rotate();
    const metadata = await sharp(buffer).metadata();
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }
    let outputBuffer;
    let newExt = ext;
    if (ext === '.jfif') {
      outputBuffer = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
      newExt = '.jpg';
    } else if (ext === '.png') {
      outputBuffer = await pipeline.png({ quality: QUALITY, compressionLevel: 8 }).toBuffer();
    } else if (ext === '.webp') {
      outputBuffer = await pipeline.webp({ quality: QUALITY }).toBuffer();
    } else {
      outputBuffer = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    }
    const newSize = outputBuffer.length;
    const saved = stat.size - newSize;
    if (newExt !== ext) {
      const newPath = filePath.replace(ext, newExt);
      fs.writeFileSync(newPath, outputBuffer);
      fs.unlinkSync(filePath);
      console.log(`✓ ${path.relative('.', filePath)} → ${newExt} (${(stat.size/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB)`);
    } else if (saved > 100) {
      fs.writeFileSync(filePath, outputBuffer);
      console.log(`✓ ${path.relative('.', filePath)} (${(stat.size/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB)`);
    }
    totalProcessed++;
    totalSaved += Math.max(saved, 0);
  } catch (err) {
    console.log(`✗ ${path.relative('.', filePath)}: ${err.message}`);
  }
}

async function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) continue;
    if (exts.includes(path.extname(entry.name).toLowerCase())) {
      await optimizeImage(fullPath);
    }
  }
}

async function main() {
  console.log('=== Optimizing new pautante images ===\n');
  for (const dir of dirs) {
    console.log(`\n--- ${path.basename(dir)} ---`);
    await scanDir(dir);
  }
  console.log(`\n=== Done: ${totalProcessed} images, ${(totalSaved/1024/1024).toFixed(2)} MB saved ===`);
}
main();
