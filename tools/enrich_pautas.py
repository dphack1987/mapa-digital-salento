#!/usr/bin/env python3
# Enriquecimiento de paginas pauta con datos YA existentes en places.json.
# No agrega informacion nueva: solo hace visible en el HTML estatico campos
# que el generador original no renderizo (contacto, horario, servicios,
# habitaciones, menus, detalles por tipo de negocio).
# Idempotente: marca cada archivo con <!-- pauta-enriched -->.
import json, os, re, sys, html, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
MARKER = '<!-- pauta-enriched -->'

# Secciones que ya renderizan datos detallados -> no duplicar
RICH_MARKERS = [
    'Servicios incluidos', 'Comodidades', 'Menú con precios verificados',
    'Plan de la experiencia', 'Productos y compra local', 'Transporte y rutas',
    'Carta, precios y pedidos', 'Hospedaje y reservas',
]

def slugify(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def esc(x):
    return html.escape(str(x), quote=True)

def lst(items, limit=None):
    if not items:
        return ''
    arr = [str(i) for i in items if i]
    if limit:
        arr = arr[:limit]
    return '<ul>' + ''.join(f'<li>{esc(i)}</li>' for i in arr) + '</ul>'

def line(label, value):
    if not value:
        return ''
    return f'<p class="trust"><strong>{esc(label)}:</strong> {esc(value)}</p>'

def lines(label, items, limit=None):
    if not items:
        return ''
    arr = [str(i) for i in items if i]
    if limit:
        arr = arr[:limit]
    if not arr:
        return ''
    return f'<p class="trust"><strong>{esc(label)}:</strong> {esc(" · ".join(arr))}</p>'

def hours_of(p):
    oh = p.get('operatingHours') or {}
    return oh.get('notes') or p.get('timeInfo') or ''

def build_section(p):
    parts = []
    # --- Contacto y horario (datos existentes) ---
    c = p.get('contact') or {}
    contact_bits = []
    if c.get('phone'): contact_bits.append(f"Tel: {c['phone']}")
    if c.get('whatsapp'): contact_bits.append(f"WhatsApp: +57 {c['whatsapp']}")
    if c.get('email'): contact_bits.append(f"Email: {c['email']}")
    if c.get('website'): contact_bits.append(f"Web: {c['website']}")
    if c.get('facebook'): contact_bits.append(f"Facebook: {c['facebook']}")
    if contact_bits:
        parts.append('<h3>Contacto directo</h3><p class="trust">' + esc(' · '.join(contact_bits)) + '</p>')
    h = hours_of(p)
    if h:
        parts.append(f'<h3>Horario</h3><p class="trust">{esc(h)}</p>')

    # --- Detalles por tipo de negocio ---
    ad = p.get('accommodationDetails') or {}
    if ad:
        b = []
        if ad.get('categoryLabel'): b.append(f"<p class=\"trust\"><strong>Tipo:</strong> {esc(ad['categoryLabel'])}</p>")
        if ad.get('stars'): b.append(f"<p class=\"trust\"><strong>Estrellas:</strong> {esc(ad['stars'])}</p>")
        if ad.get('license'): b.append(f"<p class=\"trust\"><strong>Registro de turismo:</strong> {esc(ad['license'])}</p>")
        if ad.get('checkIn'): b.append(f"<p class=\"trust\"><strong>Check-in:</strong> {esc(ad['checkIn'])}</p>")
        if ad.get('checkOut'): b.append(f"<p class=\"trust\"><strong>Check-out:</strong> {esc(ad['checkOut'])}</p>")
        if ad.get('roomTypes'): b.append(f"<p class=\"trust\"><strong>Tipos de habitación:</strong> {esc(' · '.join(map(str, ad['roomTypes'])))}</p>")
        if ad.get('services'):
            b.append(f"<p class=\"trust\"><strong>Servicios:</strong></p>{lst(ad['services'])}")
        if ad.get('roomFeatures'):
            b.append(f"<p class=\"trust\"><strong>Características de las habitaciones:</strong> {esc(' · '.join(map(str, ad['roomFeatures'][:12])))}</p>")
        if ad.get('nearby'):
            b.append(f"<p class=\"trust\"><strong>Qué hay cerca:</strong> {esc(' · '.join(map(str, ad['nearby'])))}</p>")
        if b:
            parts.append('<h3>Alojamiento</h3>' + ''.join(b))

    fd = p.get('foodServiceDetails') or {}
    if fd:
        b = []
        if fd.get('cuisineType'): b.append(lines('Cocina', fd['cuisineType']))
        if fd.get('specialties'): b.append(lines('Especialidades', fd['specialties']))
        if fd.get('menuHighlights'): b.append(lines('En la carta', fd['menuHighlights']))
        if fd.get('ambience'): b.append(line('Ambiente', fd['ambience']))
        if fd.get('reservations'): b.append(line('Reservas', fd['reservations']))
        if fd.get('paymentMethods'): b.append(lines('Medios de pago', fd['paymentMethods']))
        items = fd.get('menuItems') or []
        if items:
            lis = []
            for it in items:
                nm = it.get('name', '')
                pr = it.get('price')
                ds = it.get('description', '')
                price_txt = f" — ${pr:,.0f} COP".replace(',', '.') if isinstance(pr, (int, float)) else ''
                lis.append(f"<li><strong>{esc(nm)}</strong>{esc(price_txt)}{(' — ' + esc(ds)) if ds else ''}</li>")
            b.append('<p class="trust"><strong>Carta con precios:</strong></p><ul>' + ''.join(lis) + '</ul>')
        if b:
            parts.append('<h3>Gastronomía</h3>' + ''.join(b))

    for key, label in (('experienceDetails', 'Experiencia'), ('horsebackRidingDetails', 'Cabalgata'), ('tourismDetails', 'Turismo')):
        d = p.get(key) or {}
        if not d:
            continue
        b = []
        if d.get('duration'): b.append(line('Duración', d['duration']))
        if d.get('difficulty'): b.append(line('Dificultad', d['difficulty']))
        if d.get('meetingPoint'): b.append(line('Punto de encuentro', d['meetingPoint']))
        if d.get('included'): b.append('<p class="trust"><strong>Incluye:</strong></p>' + lst(d['included']))
        if d.get('requirements'): b.append('<p class="trust"><strong>Qué llevar / requisitos:</strong></p>' + lst(d['requirements']))
        if d.get('languages'): b.append(lines('Idiomas', d['languages']))
        if d.get('tariff'): b.append(line('Tarifa', d['tariff']))
        if b:
            parts.append(f'<h3>{label}</h3>' + ''.join(b))
        break  # solo el primero que exista

    cd = p.get('commerceDetails') or {}
    if cd:
        b = []
        if cd.get('mainProducts'): b.append('<p class="trust"><strong>Productos principales:</strong></p>' + lst(cd['mainProducts']))
        if cd.get('productTypes'): b.append(lines('Tipos de producto', cd['productTypes']))
        if cd.get('paymentMethods'): b.append(lines('Medios de pago', cd['paymentMethods']))
        di = cd.get('deliveryInfo') or {}
        if di.get('available'): b.append(line('Entrega a domicilio', f"{', '.join(di.get('areas', []))} {di.get('deliveryTime', '')}".strip()))
        if b:
            parts.append('<h3>Productos y compras</h3>' + ''.join(b))

    td = p.get('transportDetails') or {}
    if td:
        b = []
        if td.get('vehicles'): b.append('<p class="trust"><strong>Vehículos:</strong></p>' + lst(td['vehicles']))
        if td.get('routes'): b.append('<p class="trust"><strong>Rutas:</strong></p>' + lst(td['routes']))
        if td.get('capacity'): b.append(line('Capacidad', td['capacity']))
        if td.get('tariff'): b.append(line('Tarifa', td['tariff']))
        if td.get('reservationRequired') is not None:
            b.append(line('Reserva', 'Requerida' if td['reservationRequired'] else 'No requerida'))
        if b:
            parts.append('<h3>Transporte</h3>' + ''.join(b))

    sus = p.get('sustainability') or []
    if sus:
        parts.append('<h3>Sostenibilidad</h3><p class="trust">' + esc(' · '.join(map(str, sus))) + '</p>')

    # --- Datos generales ya existentes ---
    meta = []
    if p.get('priceRange'): meta.append(f"Rango: {p['priceRange']}")
    if p.get('rating'): meta.append(f"Valoración: {p['rating']}")
    if p.get('badge'): meta.append(f"Sello: {p['badge']}")
    loc = p.get('location') or {}
    if loc.get('address'): meta.append(f"Dirección: {loc['address']}")
    if loc.get('landmark'): meta.append(f"Referencia: {loc['landmark']}")
    if meta:
        parts.append('<h3>Datos del lugar</h3><p class="trust">' + esc(' · '.join(meta)) + '</p>')

    if not parts:
        return None
    return ('\n      ' + MARKER + '\n'
            '      <section class="section"><h2>Información verificada del lugar</h2>'
            '<div class="two-col"><div>' + ''.join(parts) + '</div></div></section>\n')

def fix_hours(html_txt, p):
    h = hours_of(p)
    if not h:
        return html_txt, 0
    n = 0
    # FAQ generica: "Horario por confirmar con el local" / "Horario por confirmar"
    for pat in ('Horario por confirmar con el local', 'Horario por confirmar.'):
        if pat in html_txt:
            html_txt = html_txt.replace(pat, esc(h))
            n += 1
    return html_txt, n

def main():
    data = json.load(open(os.path.join(PUBLIC, 'data', 'places.json'), encoding='utf-8'))
    places = data['places'] if isinstance(data, dict) else data
    byslug = {}
    for p in places:
        byslug.setdefault(slugify(p.get('name', '')), p)
        vu = p.get('viewUrl') or (p.get('actionTarget') or {}).get('viewUrl') or ''
        m = re.search(r'paginas-pautantes/([^/?#]+)', vu)
        if m:
            byslug[m.group(1)] = p

    base = os.path.join(PUBLIC, 'paginas-pautantes')
    stats = {'processed': 0, 'enriched': 0, 'skipped_rich': 0, 'skipped_stub': 0,
             'no_data': 0, 'hours_fixed': 0, 'no_place': 0}
    word_gains = []

    for slug in sorted(os.listdir(base)):
        f = os.path.join(base, slug, 'index.html')
        if not os.path.isfile(f):
            continue
        stats['processed'] += 1
        txt = open(f, encoding='utf-8', errors='ignore').read()
        if MARKER in txt:
            continue
        if 'http-equiv="refresh"' in txt or 'noindex' in txt:
            stats['skipped_stub'] += 1
            continue
        if any(m in txt for m in RICH_MARKERS):
            stats['skipped_rich'] += 1
            continue
        p = byslug.get(slug)
        if not p:
            stats['no_place'] += 1
            continue
        before = len(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', txt, flags=re.S)).split())
        txt, nfix = fix_hours(txt, p)
        stats['hours_fixed'] += nfix
        section = build_section(p)
        if not section:
            stats['no_data'] += 1
            continue
        # insertar antes de "Lo que puedes encontrar" o antes de </main>
        anchor = '<section class="section"><h2>Lo que puedes encontrar</h2>'
        if anchor in txt:
            txt = txt.replace(anchor, section + '      ' + anchor, 1)
        elif '</main>' in txt:
            txt = txt.replace('</main>', section + '    </main>', 1)
        else:
            stats['no_data'] += 1
            continue
        open(f, 'w', encoding='utf-8').write(txt)
        after = len(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', txt, flags=re.S)).split())
        word_gains.append((slug, before, after))
        stats['enriched'] += 1

    print(json.dumps(stats, indent=2, ensure_ascii=False))
    if word_gains:
        gains = sorted(word_gains, key=lambda x: x[2]-x[1])
        print('Menor ganancia:', gains[0], '| Mayor:', gains[-1])
        avg = sum(g[2]-g[1] for g in word_gains)/len(word_gains)
        print(f'Ganancia promedio: {avg:.0f} palabras/pagina')

if __name__ == '__main__':
    main()