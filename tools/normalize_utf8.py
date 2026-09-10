"""Normaliza mojibake UTF-8->latin-1 en los JSON fuente a UTF-8 puro.
No borra informacion: solo repara secuencias 'A~X' mal decodificadas.
Uso: python3 normalize_utf8.py (se ejecuta desde la raiz del proyecto)
"""
import json

TABLE = {
    # Mojibake simple: UTF-8 leido como latin-1 (c3 xx)
    '\u00c3\u00a1': 'á', '\u00c3\u00a9': '\u00e9', '\u00c3\u00ad': '\u00ed',
    '\u00c3\u00b3': '\u00f3', '\u00c3\u00ba': '\u00fa', '\u00c3\u00b1': '\u00f1',
    '\u00c3\u0081': '\u00c1', '\u00c3\u0089': '\u00c9', '\u00c3\u008d': '\u00cd',
    '\u00c3\u0093': '\u00d3', '\u00c3\u009a': '\u00da', '\u00c3\u0091': '\u00d1',
    '\u00c3\u00a8': '\u00e8', '\u00c3\u00aa': '\u00ea', '\u00c3\u00b4': '\u00f4',
    '\u00c3\u00a7': '\u00e7', '\u00c2\u00b7': '\u00b7', '\u00c2\u2013': '\u2013',
    '\u00c2\u00a1': '\u00a1',
    # Doble codificacion: UTF-8 leido como Windows-1252 (e2 80 xx)
    '\u00e2\u20ac\u201d': '\u2014', '\u00e2\u20ac\u2013': '\u2013',
    '\u00e2\u20ac\u2122': '\u2019', '\u00e2\u20ac\u0153': '\u201c',
    '\u00e2\u00a6': '\u2026',
}

changed = []


def fix_str(s, path):
    if not isinstance(s, str):
        return s
    out = s
    for bad, good in TABLE.items():
        if bad in out:
            out = out.replace(bad, good)
    # restos: replacement char o soft hyphen huerfanos
    for orphan in ('\ufffd', '\xad'):
        if orphan in out:
            out = out.replace(orphan, '')
    if out != s:
        changed.append((path, s[:70], out[:70]))
    return out


def walk(obj, path='root'):
    if isinstance(obj, dict):
        return {k: walk(v, f'{path}.{k}') for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk(v, f'{path}[{i}]') for i, v in enumerate(obj)]
    if isinstance(obj, str):
        return fix_str(obj, path)
    return obj


for fname in ('public/data/places.json', 'public/data/mapMarkers.json'):
    changed = []
    with open(fname, encoding='utf-8') as f:
        data = json.load(f)
    fixed = walk(data, fname)
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(fixed, f, ensure_ascii=False, indent=2)
    print(f'== {fname}: {len(changed)} cadenas reparadas')
    for path, old, new in changed[:40]:
        print('   ' + path + ': ' + ascii(old[:70]) + ' -> ' + ascii(new[:70]))
