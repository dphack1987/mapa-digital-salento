const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        fileList.push({
          path: filePath.replace(/\\/g, '/').replace('public/', ''),
          size: stat.size,
          modified: stat.mtime
        });
      }
    }
  });
  return fileList;
}

const publicDir = path.join(__dirname, '../public');
const images = walkDir(publicDir);

const inventory = {
  updated: new Date().toISOString(),
  totalImages: images.length,
  images: images
};

fs.writeFileSync(
  path.join(__dirname, '../image-inventory.json'),
  JSON.stringify(inventory, null, 2)
);

console.log(`Inventario actualizado: ${images.length} imágenes`);
