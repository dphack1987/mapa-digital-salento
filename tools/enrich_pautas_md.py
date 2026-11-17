#!/usr/bin/env python3
# Segunda pasada de enriquecimiento: usa las fichas de investigacion ya
# existentes en public/pautas/<negocio>/*.md y *.txt (datos verificados
# previos) para hacer visible en las paginas pauta informacion que no esta
# en places.json (habitaciones, servicios, carta con precios, email,
# facebook, horarios).
# NO genera contenido nuevo: solo renderiza texto que ya existe en el repo.
# Idempotente via marcador <!-- pauta-md-enriched -->.
import json, os, re, sys, html, unicodedata, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
PAUTAS = os.path.join(PUBLIC, 'pautas')
PAGES = os.path.join(PUBLIC, 'paginas-pautantes')
MARKER = '<!-- pauta-md-enriched -->'

def slugify(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def esc(x):
    return html.escape(str(x), quote=True)

def norm_tokens(s):
    return set(re.findall(r'[a-z0-9]+', unicodedata.normalize('NFKD', s or '').encode('ascii','ignore').decode().lower()))

STOP = {'de','del','la','el','en','y','a','al','los','las','salento','quindio','colombia','restaurante','hotel','hostal','finca','cafe','café'}

def tokens(s):
    return {t for t in norm_tokens(s) if t not in STOP and len(t) > 2}

def parse_md(path):
    """Extrae secciones utiles del .md de investigacion."""
    txt = open(path, encoding='utf-8', errors='ignore').read()
    out = {'nombre': None, 'info': [], 'habitaciones': [], 'servicios': [], 'carta': [], 'modelo': []}
    # nombre comercial
    m = re.search(r'Nombre comercial:\s*(.+)', txt)
    if m: out['nombre'] = m.group(1).strip()
    # secciones ##
    sections = re.split(r'\n##\s+', txt)
    for sec in sections:
        header = sec.split('\n', 1)[0].strip().lower()
        body = sec.split('\n', 1)[1] if '\n' in sec else ''
        bullets = [re.sub(r'^[-*]\s*', '', l).strip() for l in body.split('\n') if re.match(r'^\s*[-*]\s+', l)]
        rows = [l for l in body.split('\n') if l.strip().startswith('|') and '---' not in l and 'Precio' not in l.split('|')[1][:20] if len(l.split('|')) >= 3]
        if 'informaci' in header or 'confirmada' in header or 'datos' in header:
            out['info'] += bullets
        elif 'habitacion' in header or 'rooms' in header:
            out['habitaciones'] += bullets
        elif header.startswith('servicios') or 'servicios' in header:
            out['servicios'] += bullets
        elif 'carta' in header or 'menu' in header or 'productos' in header:
            out['carta'] += rows if rows else bullets
        elif 'modelo' in header or 'reserva' in header or 'pedido' in header:
            out['modelo'] += bullets
    return out

def parse_txt(path):
    """Extrae pares Label: valor de los .txt de investigacion."""
    out = []
    for l in open(path, encoding='utf-8', errors='ignore'):
        l = l.strip()
        if not l or l.startswith('#'):
            continue
        m = re.match(r'^([A-Za-zÁÉÍÓÚáéíóúñÑ /]+):\s*(.+)$', l)
        if m:
            out.append((m.group(1).strip(), m.group(2).strip()))
        elif len(l) > 8:
            out.append(('Dato', l))
    return out

# ---- mapa slug de pagina -> datos fuente ----
def collect_sources():
    """Devuelve {slug_pagina: {'md': parsed, 'txt': [(k,v)]}}"""
    # nombres de paginas pauta
    page_slugs = {d for d in os.listdir(PAGES) if os.path.isdir(os.path.join(PAGES, d))}
    # para cada dir de pautas, slug candidato
    sources = {}
    for d in sorted(os.listdir(PAUTAS)):
        dpath = os.path.join(PAUTAS, d)
        if not os.path.isdir(dpath):
            continue
        md_files = glob.glob(os.path.join(dpath, '*.md'))
        txt_files = glob.glob(os.path.join(dpath, '*.txt'))
        if not md_files and not txt_files:
            continue
        # nombre candidato: Nombre comercial del md o nombre del dir
        cand_names = [d.replace('_', '-'), d.replace('_', ' ')]
        parsed = {'nombre': None, 'info': [], 'habitaciones': [], 'servicios': [], 'carta': [], 'modelo': []}
        txt_pairs = []
        for mf in md_files:
            p = parse_md(mf)
            if p['nombre']:
                cand_names.insert(0, p['nombre'])
            for k in parsed:
                if k == 'nombre':
                    continue
                parsed[k] += p[k]
        for tf in txt_files:
            txt_pairs += parse_txt(tf)
        # encontrar pagina: match por tokens del nombre contra slugs de pagina
        best = None
        for cn in cand_names:
            tt = tokens(cn)
            if not tt:
                continue
            for ps in page_slugs:
                pt = tokens(ps.replace('-', ' '))
                if not pt:
                    continue
                # match si comparten >=60% de tokens del nombre candidato
                inter = tt & pt
                if len(inter) >= max(1, int(0.6 * len(tt))) and len(inter) >= 1:
                    # preferir mayor interseccion
                    score = len(inter)
                    if best is None or score > best[0]:
                        best = (score, ps)
        if best:
            slug = best[1]
            sources.setdefault(slug, {'md': parsed, 'txt': txt_pairs})
    return sources

def already_in(page_txt, value):
    v = re.sub(r'\s+', ' ', str(value)).strip().lower()
    if len(v) < 4:
        return True
    return v in page_txt.lower()

def build_md_section(src, page_txt):
    parts = []
    md = src['md']
    # info: filtrar campos ya visibles (direccion, coordenadas, nombre, categoria)
    SKIP_KEYS = ('nombre comercial', 'direcci', 'coordenada', 'categor', 'fuente', 'estado', 'prioridad', 'verificaci')
    info_lines = []
    for b in md['info']:
        key = b.split(':')[0].strip().lower() if ':' in b else ''
        if any(k in key for k in SKIP_KEYS):
            continue
        val = b.split(':', 1)[1].strip() if ':' in b else b
        if already_in(page_txt, val):
            continue
        info_lines.append(b)
    # txt pairs: email/facebook/web/whatsapp/horario no cubiertos
    for k, v in src['txt']:
        if any(already_in(page_txt, v) for _ in [0]):
            continue
        kl = k.lower()
        if any(s in kl for s in ('coordenada', 'fuente', 'nombre', 'categor')):
            continue
        info_lines.append(f"{k}: {v}")
    # dedupe info_lines
    seen = set(); uniq = []
    for l in info_lines:
        if l not in seen:
            seen.add(l); uniq.append(l)
    if uniq:
        lis = ''.join(f'<li>{esc(l)}</li>' for l in uniq[:15])
        parts.append(f'<p class="trust"><strong>Datos de la ficha verificada:</strong></p><ul>{lis}</ul>')

    if md['habitaciones']:
        lis = ''.join(f'<li>{esc(re.sub(r"\\s*\\(.*?\\)\\s*$","",b))}</li>' for b in md['habitaciones'][:12] if 'pendiente' not in b.lower())
        if lis:
            parts.append(f'<p class="trust"><strong>Habitaciones y opciones de alojamiento:</strong></p><ul>{lis}</ul>')

    if md['servicios']:
        lis = ''.join(f'<li>{esc(b)}</li>' for b in md['servicios'][:15] if 'pendiente' not in b.lower())
        if lis:
            parts.append(f'<p class="trust"><strong>Servicios:</strong></p><ul>{lis}</ul>')

    if md['carta']:
        lis = []
        for row in md['carta'][:20]:
            cells = [c.strip() for c in row.strip().strip('|').split('|')]
            if len(cells) >= 2 and cells[0] and cells[0].lower() not in ('plato / producto', 'producto', 'item'):
                price = cells[1] if len(cells) > 1 else ''
                lis.append(f'<li><strong>{esc(cells[0])}</strong>{(" — " + esc(price)) if price else ""}</li>')
        if not lis:
            for b in md['carta'][:15]:
                if 'pendiente' not in b.lower():
                    lis.append(f'<li>{esc(b)}</li>')
        if lis:
            parts.append(f'<p class="trust"><strong>Carta / productos con precios:</strong></p><ul>{"".join(lis)}</ul>')

    if md['modelo']:
        lis = ''.join(f'<li>{esc(b)}</li>' for b in md['modelo'][:10] if 'pendiente' not in b.lower())
        if lis:
            parts.append(f'<p class="trust"><strong>Modelo de reserva y pago:</strong></p><ul>{lis}</ul>')

    if not parts:
        return None
    return ('\n      ' + MARKER + '\n'
            '      <section class="section"><h2>Ficha verificada del negocio</h2>'
            '<div class="two-col"><div>' + ''.join(parts) + '</div></div></section>\n')

def main():
    sources = collect_sources()
    print(f'Fuentes md/txt mapeadas a paginas: {len(sources)}')
    stats = {'enriched': 0, 'skipped_marker': 0, 'no_section': 0, 'missing_page': 0}
    for slug, src in sorted(sources.items()):
        f = os.path.join(PAGES, slug, 'index.html')
        if not os.path.isfile(f):
            stats['missing_page'] += 1
            continue
        txt = open(f, encoding='utf-8', errors='ignore').read()
        if MARKER in txt or 'http-equiv="refresh"' in txt:
            stats['skipped_marker'] += 1
            continue
        # texto visible para dedupe
        plain = re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', txt, flags=re.S)).lower()
        section = build_md_section(src, plain)
        if not section:
            stats['no_section'] += 1
            continue
        anchor = '<section class="section"><h2>Lo que puedes encontrar</h2>'
        if anchor in txt:
            txt = txt.replace(anchor, section + '      ' + anchor, 1)
        elif '</main>' in txt:
            txt = txt.replace('</main>', section + '    </main>', 1)
        else:
            stats['no_section'] += 1
            continue
        open(f, 'w', encoding='utf-8').write(txt)
        stats['enriched'] += 1
        print('  +', slug)
    print(json.dumps(stats, indent=2))

if __name__ == '__main__':
    main()
