#!/usr/bin/env python3
"""Enriquece prioritarios con logo dual y galería de marca. No borra nada."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# slug archivo -> logo pautante local (verificado que existe)
DUAL_LOGO = {
    "boki-mall-hotel-el-mirador-de-boquia": "/pautas/boki_mall/hotel-mirador-boquia/logo-hotel-mirador-de-boquia.png",
    "boki-mall-restaurante-terra": "/pautas/boki_mall/boki_mall_logo.jpg",
    "boki-mall-barcinales-cafe-bar": "/pautas/boki_mall/boki_mall_logo.jpg",
    "boki-mall-eventos": "/pautas/boki_mall/boki_mall_logo.jpg",
    "moto-aventura-110": "/pautas/moto_aventura_110/imagenes/logo-moto-aventura-110.jpg",
    "reserva-natural-cascadas-de-santa-rita": "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.jfif",
    "camping-cascadas-de-santa-rita": "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.jfif",
    "camping-cascadas-santa-rita": "/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita.jfif",
    "finca-hotel-el-ocaso": "/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso.png",
}

# relleno de marca para galerías con fallback Unsplash restante
GALLERY_FILL = {
    "boki-mall-barcinales-cafe-bar": ["/pautas/boki_mall/hotel-mirador-boquia/370049629.jpg", "/pautas/boki_mall/boki_mall_logo.jpg"],
    "boki-mall-eventos": ["/pautas/boki_mall/hotel-mirador-boquia/370049629.jpg", "/pautas/boki_mall/boki_mall_logo.jpg"],
    "boki-mall-restaurante-terra": ["/pautas/boki_mall/hotel-mirador-boquia/314270821.jpg", "/pautas/boki_mall/boki_mall_logo.jpg"],
    "finca-hotel-el-ocaso": ["/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.png", "/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso.png"],
}

TARGETS = [
    "public/paginas-pautantes/hotel-camino-nacional-salento/index.html",
    "public/paginas-pautantes/hotel-la-floresta-salento/index.html",
    "public/paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/index.html",
    "public/paginas-pautantes/boki-mall-restaurante-terra/index.html",
    "public/paginas-pautantes/boki-mall-barcinales-cafe-bar/index.html",
    "public/paginas-pautantes/boki-mall-eventos/index.html",
    "public/paginas-pautantes/camping-cascadas-de-santa-rita/index.html",
    "public/paginas-pautantes/camping-cascadas-santa-rita/index.html",
    "public/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/index.html",
    "public/paginas-pautantes/moto-aventura-110/index.html",
    "public/paginas-pautantes/finca-hotel-el-ocaso/index.html",
    "public/paginas-pautantes/fonda-boquia/index.html",
    "public/pautantes/hotel-camino-nacional-salento.html",
    "public/pautantes/hotel-la-floresta-salento.html",
    "public/pautantes/boki-mall-hotel-el-mirador-de-boquia.html",
    "public/pautantes/boki-mall-restaurante-terra.html",
    "public/pautantes/boki-mall-barcinales-cafe-bar.html",
    "public/pautantes/boki-mall-eventos.html",
    "public/pautantes/camping-cascadas-de-santa-rita.html",
    "public/pautantes/reserva-natural-cascadas-de-santa-rita.html",
    "public/pautantes/moto-aventura-110.html",
    "public/pautantes/finca-hotel-el-ocaso.html",
    "public/pautantes/fonda-boquia.html",
]

def slug_of(rel: str) -> str:
    base = rel.split("/")[-1]
    return rel.split("/")[-2] if base == "index.html" else base[:-5]

def enrich(path: Path, slug: str) -> str:
    t = path.read_text(encoding="utf-8", errors="ignore")
    orig = t
    notes = []
    # 1. logo dual junto a marca Salento (reemplazo completo del anchor, solo si existe logo y aún no está)
    logo = DUAL_LOGO.get(slug)
    if logo and logo not in t:
        dual = f'<a class="brand" href="/"><img src="/logo_salento2026.png" alt="Salento a la Mano" class="brand-logo"/><span>Salento a la Mano</span><span aria-hidden="true" style="opacity:.4">×</span><img src="{logo}" alt="Logo pautante" class="brand-logo" style="border:1px solid var(--line)" /></a>'
        t2, n = re.subn(r'<a class="brand" href="/">.*?</a>', dual, t, count=1, flags=re.S)
        if n:
            t = t2
            notes.append("logo dual")
    # 2. relleno galería marca
    fills = GALLERY_FILL.get(slug, [])
    if fills:
        def repl_gallery(m):
            inner = m.group(1)
            fi = 0
            def repl_img(im):
                nonlocal fi
                if "images.unsplash.com" in im.group(0) and fi < len(fills):
                    r = re.sub(r'src="[^"]+"', f'src="{fills[fi]}"', im.group(0), count=1)
                    fi += 1
                    return r
                return im.group(0)
            new_inner = re.sub(r'<img[^>]*>', repl_img, inner)
            return f'<div class="gallery">{new_inner}</div>'
        t2 = re.sub(r'<div class="gallery">(.*?)</div>', repl_gallery, t, flags=re.S)
        if t2 != t:
            t = t2
            notes.append("galeria marca")
    if t != orig:
        path.write_text(t, encoding="utf-8")
    return "; ".join(notes)

def main():
    for rel in TARGETS:
        p = ROOT / rel
        if not p.exists():
            print("FALTA:", rel)
            continue
        print(("OK " if True else "") + rel + " :: " + (enrich(p, slug_of(rel)) or "sin cambios"))

if __name__ == "__main__":
    main()
