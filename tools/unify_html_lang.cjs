/**
 * Unifica el atributo <html lang> con el idioma declarado en hreflang/canonical.
 *
 * - Reescribe ÚNICAMENTE las coincidencias exactas de la tabla REPLACEMENTS.
 * - Idempotente: volver a ejecutarlo no produce más cambios.
 * - No altera CSS ni estructura: solo el atributo lang del elemento <html>.
 *
 * Uso:
 *   node tools/unify_html_lang.cjs --check   (dry-run)
 *   node tools/unify_html_lang.cjs           (aplica)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// Solo se corrigen etiquetas que no coinciden con el hreflang declarado en el
// propio documento (en, de, fr, it ya son correctas y no se tocan).
const REPLACEMENTS = [
  { from: '<html lang="es">', to: '<html lang="es-CO">' }, // default + /es/ (hreflang es-CO)
  { from: '<html lang="pt">', to: '<html lang="pt-BR">' }, // /pt/ (hreflang pt-BR)
];

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const check = process.argv.includes('--check');
const files = fs.existsSync(PUBLIC) ? walk(PUBLIC, []) : [];
let changed = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  const hits = [];
  for (const { from, to } of REPLACEMENTS) {
    if (!text.includes(from)) continue;
    hits.push(`${from}->${to} x${text.split(from).length - 1}`);
    text = text.split(from).join(to);
  }
  if (text === original) continue;
  changed += 1;
  if (!check) fs.writeFileSync(file, text, 'utf8');
  console.log(`${check ? 'WOULD_UPDATE' : 'UPDATED'} ${path.relative(ROOT, file)} [${hits.join(', ')}]`);
}

console.log(`Archivos ${check ? 'a actualizar' : 'actualizados'}: ${changed}`);
