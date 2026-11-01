import re

with open('src/services/donChuchoKnowledge.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar traducción genérica en chino para todas las entradas que no tienen zh
# Buscar patrones de answer sin zh
lines = content.split('\n')
in_answer_block = False
answer_start = -1
answer_end = -1

for i, line in enumerate(lines):
    if 'answer: {' in line:
        in_answer_block = True
        answer_start = i
    elif in_answer_block and '}' in line and 'answer' not in line:
        in_answer_block = False
        answer_end = i
        
        # Verificar si tiene zh
        block_content = '\n'.join(lines[answer_start:answer_end+1])
        if 'zh:' not in block_content:
            # Agregar placeholder zh al final
            # Buscar la última línea con traducción
            last_lang_line = None
            for j in range(answer_end, answer_start, -1):
                if lines[j].strip().startswith(('es:', 'en:', 'de:', 'fr:', 'pt:', 'it:')):
                    last_lang_line = j
                    break
            
            if last_lang_line:
                # Extraer el texto de la última traducción
                match = re.search(r"['\"]([^'\"]+)['\"]", lines[last_lang_line])
                if match:
                    # Agregar placeholder zh usando la misma estructura
                    indent = len(lines[last_lang_line]) - len(lines[last_lang_line].lstrip())
                    zh_line = ' ' * indent + f"zh: '{match.group(1)}',"
                    lines.insert(last_lang_line + 1, zh_line)

with open('src/services/donChuchoKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Traducciones ZH placeholders agregadas")
