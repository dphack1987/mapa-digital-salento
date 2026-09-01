from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPLACEMENTS = [
    ('https://mapa-salento.com', 'https://salentoalamano.com'),
    ('https://mapa-digital-salento.vercel.app', 'https://salentoalamano.com'),
    ('mapa-salento.com', 'salentoalamano.com'),
    ('mapa-digital-salento.vercel.app', 'salentoalamano.com'),
    ('Mapa Digital Oficial de Salento', 'Salento a la Mano'),
    ('Mapa Digital de Salento', 'Salento a la Mano'),
]
EXCLUDED = {'.git', 'node_modules', 'dist', '.next', 'coverage', '__pycache__'}
EXTS = {'.html', '.xml', '.txt', '.json', '.md', '.ts', '.tsx', '.js', '.css'}


def iter_files(root: Path):
    for path in root.rglob('*'):
        if path.is_dir():
            if path.name in EXCLUDED:
                continue
            continue
        if path.suffix.lower() in EXTS:
            yield path


def main():
    changed = 0
    for path in iter_files(ROOT):
        try:
            text = path.read_text(encoding='utf-8')
        except Exception:
            continue
        original = text
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding='utf-8')
            changed += 1
            print(f'UPDATED {path.relative_to(ROOT)}')
    print(f'ARCHIVOS ACTUALIZADOS: {changed}')


if __name__ == '__main__':
    main()
