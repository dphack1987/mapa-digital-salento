#!/usr/bin/env python3
# Tercera pasada: las paginas pauta cargan su menu via JS
# (PautanteCommon.initMenu). Googlebot renderiza JS pero el contenido
# dinamico no siempre cuenta para "thin content". Se inyecta un bloque
# <noscript> con los mismos items ya existentes en la pagina (sin agregar
# informacion nueva) para que el contenido sea visible sin JS.
# Idempotente via marcador <!-- pauta-menu-noscript -->.
import os, re, json, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'public', 'paginas-pautantes')
MARKER = '<!-- pauta-menu-noscript -->'

def esc(x):
    return html.escape(str(x), quote=True)

def extract_items(h):
    i = h.find('initMenu(')
    if i < 0:
        return None
    j = h.find('</script>', i)
    if j < 0:
        return None
    seg = h[i:j]
    start = seg.find('(') + 1
    payload = seg[start:].strip().rstrip(';').rstrip()
    if payload.endswith(')'):
        payload = payload[:-1]
    try:
        data = json.loads(payload)
    except Exception:
        return None
    return data.get('items') or []

def main():
    stats = {'pages': 0, 'with_items': 0, 'enriched': 0}
    for slug in sorted(os.listdir(BASE)):
        f = os.path.join(BASE, slug, 'index.html')
        if not os.path.isfile(f):
            continue
        h = open(f, encoding='utf-8', errors='ignore').read()
        stats['pages'] += 1
        if MARKER in h or 'http-equiv="refresh"' in h:
            continue
        items = extract_items(h)
        if not items:
            continue
        stats['with_items'] += 1
        # agrupar por categoria
        groups = {}
        for it in items:
            cat = it.get('cat') or 'items'
            groups.setdefault(cat, []).append(it)
        body = []
        for cat, arr in groups.items():
            body.append(f'<h3>{esc(cat.replace("-", " ").title())}</h3><ul>')
            for it in arr:
                nm = it.get('nombre', '')
                pr = it.get('precio')
                ds = it.get('desc', '')
                price = f" — ${pr:,.0f} COP".replace(',', '.') if isinstance(pr, (int, float)) else ''
                body.append(f'<li><strong>{esc(nm)}</strong>{esc(price)}{(" — " + esc(ds)) if ds else ""}</li>')
            body.append('</ul>')
        bn = ''
        m = re.search(r'"businessName"\s*:\s*"([^"]+)"', h)
        if m:
            bn = m.group(1)
        section = ('\n      ' + MARKER + '\n'
                   '      <noscript>\n'
                   '      <section class="section"><h2>Menú y opciones' + (f' — {esc(bn)}' if bn else '') + '</h2>'
                   '<div class="two-col"><div>' + ''.join(body) + '</div></div></section>\n'
                   '      </noscript>\n')
        anchor = '<section class="section"><h2>Lo que puedes encontrar</h2>'
        if anchor in h:
            h = h.replace(anchor, section + '      ' + anchor, 1)
        elif '</main>' in h:
            h = h.replace('</main>', section + '    </main>', 1)
        else:
            continue
        open(f, 'w', encoding='utf-8').write(h)
        stats['enriched'] += 1
        print('  +', slug, f'({len(items)} items)')
    print(stats)

if __name__ == '__main__':
    main()
