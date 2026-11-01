import re

with open('src/services/donChuchoKnowledge.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar todas las entradas de conocimiento
entry_pattern = r'answer:\s*\{([^}]+)\}'

entries = re.findall(entry_pattern, content, re.DOTALL)

languages = ['es', 'en', 'de', 'fr', 'pt', 'it']
issues = []

for i, entry in enumerate(entries, 1):
    entry_issues = {}
    for lang in languages:
        # Buscar cada idioma en la entrada
        lang_pattern = f'{lang}:\s*[\'"]([^\'"]+)[\'"]'
        match = re.search(lang_pattern, entry)
        if not match:
            entry_issues[lang] = 'Falta traducción'
        else:
            translation = match.group(1)
            # Verificar si es una traducción vacía o muy corta
            if len(translation) < 10:
                entry_issues[lang] = f'Traducción muy corta: "{translation}"'
            # Verificar si es placeholder
            if translation.lower() in ['todo', 'pendiente', 'tbd', '...', '-']:
                entry_issues[lang] = f'Placeholder: "{translation}"'

    if entry_issues:
        issues.append({
            'entry': i,
            'issues': entry_issues
        })

print(f'=== ANÁLISIS DE DON CHUCHO - {len(entries)} entradas ===\n')

if issues:
    print(f'❌ {len(issues)} entradas con problemas:\n')
    for issue in issues:
        print(f'Entrada #{issue["entry"]}:')
        for lang, problem in issue['issues'].items():
            print(f'  {lang.upper()}: {problem}')
        print()
else:
    print('✅ Todas las entradas tienen traducciones en los 6 idiomas')

# Verificar longitud promedio de traducciones por idioma
print('\n=== LONGITUD PROMEDIO DE TRADUCCIONES ===\n')
lang_lengths = {lang: [] for lang in languages}

for entry in entries:
    for lang in languages:
        lang_pattern = f'{lang}:\s*[\'"]([^\'"]+)[\'"]'
        match = re.search(lang_pattern, entry)
        if match:
            lang_lengths[lang].append(len(match.group(1)))

for lang in languages:
    if lang_lengths[lang]:
        avg = sum(lang_lengths[lang]) / len(lang_lengths[lang])
        print(f'{lang.upper()}: {avg:.0f} caracteres promedio')
