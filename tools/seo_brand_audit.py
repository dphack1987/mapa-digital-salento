import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    'mapa-salento.com',
    'mapa-digital-salento.vercel.app',
    'salentoalamano.com',
    'salento a la mano',
    'Salento a la Mano'
]

EXCLUDE_DIRS = {
    '.git',
    'node_modules',
    'dist',
    '.next',
    'coverage',
    '__pycache__'
}


def iter_files(root: Path):
    for current_root, directories, filenames in os.walk(root):
        directories[:] = [directory for directory in directories if directory not in EXCLUDE_DIRS]
        for filename in filenames:
            path = Path(current_root) / filename
            if path.suffix.lower() in {'.html', '.xml', '.txt', '.json', '.md', '.ts', '.tsx', '.js', '.css'}:
                yield path


def main():
    findings = {target: [] for target in TARGETS}
    files_scanned = 0
    
    print(f'Escaneando archivos en: {ROOT}')
    
    for file in iter_files(ROOT):
        files_scanned += 1
        try:
            text = file.read_text(encoding='utf-8')
        except Exception as e:
            print(f'Error leyendo {file}: {e}')
            continue
        for target in TARGETS:
            if target.lower() in text.lower():
                findings[target].append(str(file.relative_to(ROOT)))

    print(f'Archivos escaneados: {files_scanned}')
    print('=== SEO BRAND AUDIT ===')
    print(f'ROOT: {ROOT}')
    print()

    old_domain_hits = findings['mapa-salento.com'] + findings['mapa-digital-salento.vercel.app']
    brand_hits = findings['salentoalamano.com'] + findings['salento a la mano'] + findings['Salento a la Mano']

    print('OLD DOMAIN HITS:')
    if old_domain_hits:
        for item in sorted(set(old_domain_hits)):
            print(f'  - {item}')
    else:
        print('  Ningún hit. OK.')

    print('\nBRAND HITS:')
    if brand_hits:
        for item in sorted(set(brand_hits))[:30]:
            print(f'  - {item}')
    else:
        print('  Ningún hit. Revisar branding. ')

    print('\nDETAILED FINDINGS:')
    for target, hits in findings.items():
        print(f'{target}: {len(hits)} hits')
        if hits:
            for hit in hits[:5]:
                print(f'  - {hit}')

    print('\nRECOMENDACION:')
    print('1) Canonical y Open Graph deben apuntar a salentoalamano.com.')
    print('2) robots.txt y sitemap deben apuntar al dominio corto de marca.')
    print('3) El texto visible debe reforzar Salento a la Mano en títulos, encabezados y CTA.')
    print('4) Mantener Vercel como infraestructura, pero posicionar la marca como el nombre principal del negocio.')


if __name__ == '__main__':
    main()
