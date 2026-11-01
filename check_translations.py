import re

with open('src/services/translationService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

languages = ['es', 'en', 'fr', 'de', 'pt', 'it']
results = {}

# Regex para capturar el contenido de cada idioma
lang_pattern = r"'(\w+)':\s*\{([\s\S]*?)\n\s*\}"

for match in re.finditer(lang_pattern, content):
    lang = match.group(1)
    lang_content = match.group(2)

    # Contar claves (patrón: clave: valor)
    keys = re.findall(r'\w+:', lang_content)
    key_count = len(keys)

    results[lang] = {
        'key_count': key_count,
        'keys': [k.replace(':', '') for k in keys]
    }

print('=== RESUMEN DE TRADUCCIONES ===\n')
for lang in languages:
    if lang in results:
        print(f'{lang.upper()}: {results[lang]["key_count"]} claves')

es_keys = set(results['es']['keys'])
missing_keys = {}

for lang in languages:
    if lang == 'es' or lang not in results:
        continue
    lang_keys = set(results[lang]['keys'])
    missing = list(es_keys - lang_keys)
    extra = list(lang_keys - es_keys)

    if missing or extra:
        missing_keys[lang] = {
            'missing': len(missing),
            'extra': len(extra),
            'missing_list': missing[:10],
            'extra_list': extra[:10]
        }

print('\n=== DIFERENCIAS ===\n')
for lang, data in missing_keys.items():
    print(f'{lang.upper()}:')
    if data['missing'] > 0:
        print(f"  ❌ Faltan {data['missing']} claves (ej: {', '.join(data['missing_list'])})")
    if data['extra'] > 0:
        print(f"  ⚠️  Extra {data['extra']} claves (ej: {', '.join(data['extra_list'])})")
    print('')

if not missing_keys:
    print('✅ Todos los idiomas tienen las mismas claves que español')
