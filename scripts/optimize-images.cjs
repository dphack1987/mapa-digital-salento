const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MAX_WIDTH = 1200;
const QUALITY = 80;
const dirs = [
  'public/pautas',
  'public/imagenes-salento',
  'public/salento'
];

const exts = ['.jpg', '.jpeg', '.png', '.webp', '.jfif'];

let totalProcessed = 0;
let totalSaved = 0;
let totalErrors = 0;

async function optimizeImage(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
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
      console.log(`✓ ${path.relative('.', filePath)} → ${newExt} (${(stat.size/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB, saved ${(saved/1024).toFixed(0)}KB)`);
    } else if (saved > 0) {
      fs.writeFileSync(filePath, outputBuffer);
      console.log(`✓ ${path.relative('.', filePath)} (${(stat.size/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB, saved ${(saved/1024).toFixed(0)}KB)`);
    } else {
      console.log(`– ${path.relative('.', filePath)} (already optimal)`);
      return;
    }

    totalProcessed++;
    totalSaved += saved;
  } catch (err) {
    console.log(`✗ ${path.relative('.', filePath)}: ${err.message}`);
    totalErrors++;
  }
}

async function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanDir(fullPath);
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      await optimizeImage(fullPath);
    }
  }
}

async function main() {
  console.log('=== Image Optimization ===\n');
  for (const dir of dirs) {
    console.log(`Scanning ${dir}...`);
    await scanDir(dir);
  }
  console.log(`\n=== Done ===`);
  console.log(`Processed: ${totalProcessed}`);
  console.log(`Total saved: ${(totalSaved/1024/1024).toFixed(2)} MB`);
  console.log(`Errors: ${totalErrors}`);
}

main();
