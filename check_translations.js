const fs = require('fs');

const content = fs.readFileSync('src/services/translationService.ts', 'utf8');

const languages = ['es', 'en', 'fr', 'de', 'pt', 'it'];
const results = {};

// Regex para capturar el contenido de cada idioma
const langPattern = /'(\w+)':\s*\{([\s\S]*?)\n\s*\}/g;

let match;
while ((match = langPattern.exec(content)) !== null) {
  const lang = match[1];
  const langContent = match[2];

  // Contar claves (patrón: clave: valor)
  const keys = langContent.match(/\w+:/g);
  const keyCount = keys ? keys.length : 0;

  results[lang] = {
    keyCount,
    // Extraer todas las claves para comparación
    keys: keys ? keys.map(k => k.replace(':', '')) : []
  };
}

console.log('=== RESUMEN DE TRADUCCIONES ===\n');
languages.forEach(lang => {
  console.log(`${lang.toUpperCase()}: ${results[lang].keyCount} claves`);
});

const esKeys = new Set(results.es.keys);
const missingKeys = {};

languages.forEach(lang => {
  if (lang === 'es') return;
  const langKeys = new Set(results[lang].keys);
  const missing = [...esKeys].filter(k => !langKeys.has(k));
  const extra = [...langKeys].filter(k => !esKeys.has(k));

  if (missing.length > 0 || extra.length > 0) {
    missingKeys[lang] = {
      missing: missing.length,
      extra: extra.length,
      missingList: missing.slice(0, 10), // Mostrar solo los primeros 10
      extraList: extra.slice(0, 10)
    };
  }
});

console.log('\n=== DIFERENCIAS ===\n');
Object.entries(missingKeys).forEach(([lang, data]) => {
  console.log(`${lang.toUpperCase()}:`);
  if (data.missing > 0) {
    console.log(`  ❌ Faltan ${data.missing} claves (ej: ${data.missingList.join(', ')})`);
  }
  if (data.extra > 0) {
    console.log(`  ⚠️  Extra ${data.extra} claves (ej: ${data.extraList.join(', ')})`);
  }
  console.log('');
});

if (Object.keys(missingKeys).length === 0) {
  console.log('✅ Todos los idiomas tienen las mismas claves que español');
}
