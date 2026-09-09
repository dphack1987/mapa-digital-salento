#!/usr/bin/env python3
"""Parche quirúrgico solo prioritarios: no borra, solo enriquece.
- brand-logo 42px -> 64px en <style> inline
- inyecta CSS anti-corte WhatsApp/acciones
- unifica Volver al inicio a href="/" y añade nav inferior con Volver + Principal si falta
- sustituye Unsplash por fotos locales de places.json (solo las 3 primeras, encode espacios)
"""
from __future__ import annotations
import json, re, unicodedata
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

PRIORITARIOS = [
    "hotel-camino-nacional-salento",
    "hotel-la-floresta-salento",
    "boki-mall-hotel-el-mirador-de-boquia",
    "boki-mall-restaurante-terra",
    "boki-mall-barcinales-cafe-bar",
    "boki-mall-eventos",
    "camping-cascadas-de-santa-rita",
    "camping-cascadas-santa-rita",
    "reserva-natural-cascadas-de-santa-rita",
    "moto-aventura-110",
    "finca-hotel-el-ocaso",
    "fonda-boquia",
]

CSS_FIX = """<style data-patch="whatsapp-wrap">.topbar{flex-wrap:wrap}.top-actions,.actions,.card-actions{flex-wrap:wrap}.top-actions .button,.actions .button,.actions .action-btn,.card-actions .btn{flex:1 1 160px;min-width:0;white-space:normal;text-align:center}.brand-logo{width:64px!important;height:64px!important}@media(max-width:800px){.actions{flex-direction:column}.actions .button,.actions .action-btn{width:100%}}</style>"""

BOTTOM_NAV = """<nav class="bottom-nav" aria-label="Volver" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:28px"><a class="button primary" href="/">Volver al inicio</a><a class="button dark" href="/">Ir a página principal</a><a class="button" href="/categorias/">Ver categorías</a></nav>"""

def load_photos():
    d = json.loads((PUBLIC / "data/places.json").read_text(encoding="utf-8"))
    def slug(s):
        s = unicodedata.normalize("NFD", s.lower())
        s = "".join(c for c in s if unicodedata.category(c) != "Mn")
        return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    m = {}
    for p in d.get("places", []):
        ph = [quote(u, safe="/:%") if not u.startswith("http") else u for u in (p.get("photos") or [])]
        m[slug(p["name"])] = ph
    # alias legacy sin "de"
    if "camping-cascadas-de-santa-rita" in m:
        m.setdefault("camping-cascadas-santa-rita", m["camping-cascadas-de-santa-rita"])
    return m

def patch_html(path: Path, photos: list[str], name: str) -> bool:
    if not path.exists():
        return False
    t = path.read_text(encoding="utf-8", errors="ignore")
    orig = t
    # 1. logo 42 -> 64 en inline style
    t = t.replace("width:42px; height:42px;", "width:64px; height:64px;")
    t = t.replace("width:42px;height:42px;", "width:64px;height:64px;")
    t = t.replace(".brand-logo { width: 42px;", ".brand-logo { width: 64px;")
    # 2. CSS fix una sola vez
    if 'data-patch="whatsapp-wrap"' not in t and "</head>" in t:
        t = t.replace("</head>", CSS_FIX + "\n</head>", 1)
    # 3. brand href /index.html -> /  (solo marca, conserva resto)
    t = t.replace('<a class="brand" href="/index.html">', '<a class="brand" href="/">')
    # 4. galería Unsplash -> locales (solo <img> con unsplash, conserva alt)
    if photos:
        imgs = photos[:3]
        # reemplaza hasta 3 unsplash en gallery
        parts = re.split(r'(<img[^>]*images\.unsplash\.com[^>]*>)', t)
        j = 0
        for i, part in enumerate(parts):
            if "images.unsplash.com" in part and j < len(imgs):
                parts[i] = re.sub(r'src="[^"]+"', f'src="{imgs[j]}"', part, count=1)
                j += 1
        t = "".join(parts)
        # hero-image unsplash -> primera local
        t = re.sub(r"url\('https://images\.unsplash\.com[^']*'\)", f"url('{imgs[0]}')", t, count=1)
    # 5. nav inferior si falta Volver al inicio
    if "Volver al inicio" not in t:
        if "</main>" in t:
            t = t.replace("</main>", BOTTOM_NAV + "\n</main>", 1)
        elif "</div>" in t:
            # fallback antes de </body>
            t = t.replace("</body>", BOTTOM_NAV + "\n</body>", 1)
    else:
        # asegura que Volver apunte a "/"
        t = re.sub(r'href="/index\.html">Volver al inicio<', 'href="/">Volver al inicio<', t)
    if t != orig:
        path.write_text(t, encoding="utf-8")
        return True
    return False

def main():
    photos_map = load_photos()
    touched = []
    for slug in PRIORITARIOS:
        ph = photos_map.get(slug, [])
        cands = [
            PUBLIC / "paginas-pautantes" / slug / "index.html",
            PUBLIC / "pautantes" / f"{slug}.html",
        ]
        for c in cands:
            if patch_html(c, ph, slug):
                touched.append(str(c.relative_to(ROOT)))
    print(f"Prioritarios parcheados: {len(touched)}")
    for x in touched:
        print(" -", x)

if __name__ == "__main__":
    main()
