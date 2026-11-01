import re

with open('src/services/translationService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Líneas donde empieza cada idioma
lang_starts = {
    'es': 11,
    'en': 301,
    'fr': 591,
    'de': 881,
    'pt': 1171,
    'it': 1461,
    'zh': 1751
}

# Líneas donde termina cada idioma (empieza el siguiente)
lang_ends = {
    'es': 300,
    'en': 590,
    'fr': 880,
    'de': 1170,
    'pt': 1460,
    'it': 1750,
    'zh': 2040
}

lines = content.split('\n')

results = {}

for lang in ['es', 'en', 'fr', 'de', 'pt', 'it', 'zh']:
    start = lang_starts[lang]
    end = lang_ends[lang]
    lang_lines = lines[start:end]

    # Extraer claves (patrón: 'clave': valor)
    keys = []
    for line in lang_lines:
        match = re.match(r"\s+'([^']+)':", line)
        if match:
            keys.append(match.group(1))

    results[lang] = set(keys)

print('=== CLAVES POR IDIOMA ===\n')
for lang in ['es', 'en', 'fr', 'de', 'pt', 'it', 'zh']:
    print(f'{lang.upper()}: {len(results[lang])} claves')

print('\n=== ANÁLISIS DE DIFERENCIAS ===\n')
es_keys = results['es']

for lang in ['en', 'fr', 'de', 'pt', 'it', 'zh']:
    lang_keys = results[lang]
    missing = sorted(es_keys - lang_keys)
    extra = sorted(lang_keys - es_keys)

    print(f'{lang.upper()}:')
    if missing:
        print(f'  ❌ Faltan {len(missing)} claves:')
        for key in missing:
            print(f'     - {key}')
    if extra:
        print(f'  ⚠️  Extra {len(extra)} claves:')
        for key in extra:
            print(f'     - {key}')
    if not missing and not extra:
        print('  ✅ Completo')
    print()
