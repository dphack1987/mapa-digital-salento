import re

with open('src/services/donChuchoKnowledge.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar entradas que no tienen zh
pattern = r"answer:\s*\{([^}]+)\}"

entries = re.findall(pattern, content, re.DOTALL)

# Buscar entradas sin zh
entries_without_zh = []
for entry in entries:
    if 'zh:' not in entry:
        entries_without_zh.append(entry)

print(f"Entradas sin zh: {len(entries_without_zh)}")

# Para cada entrada sin zh, agregar placeholder al final
for i, entry in enumerate(entries_without_zh[:10]):  # Primero 10 para prueba
    # Buscar el último idioma (it) y agregar zh después
    if 'it:' in entry:
        # Extraer la traducción en italiano
        it_match = re.search(r"it:\s*'([^']+)'", entry)
        if it_match:
            it_text = it_match.group(1)
            # Agregar placeholder en chino (traducción básica del italiano)
            zh_placeholder = f"zh: '{it_text}'"
            # Reemplazar en el contenido
            content = content.replace(entry, entry.replace(it_match.group(0), it_match.group(0) + ',\n      ' + zh_placeholder))

with open('src/services/donChuchoKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Placeholders ZH agregados")
