#!/usr/bin/env python3
"""Corrige bug del parche: restaura logo marca y completa galería solo dentro de .gallery."""
from __future__ import annotations
import json, re, unicodedata
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

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
    m.setdefault("camping-cascadas-santa-rita", m.get("camping-cascadas-de-santa-rita", []))
    m.setdefault("fonda-boquia", [])
    return m

def file_slug(rel: str) -> str:
    base = rel.split("/")[-1]
    if base == "index.html":
        base = rel.split("/")[-2]
    else:
        base = base[:-5]
    return base

def fix_one(path: Path, photos: list[str]) -> str:
    t = path.read_text(encoding="utf-8", errors="ignore")
    changes = []
    # 1. restaurar logo marca (solo img con alt Salento a la Mano)
    nt, n = re.subn(r'<img src="/pautas/[^"]+" alt="Salento a la Mano"', '<img src="/logo_salento2026.png" alt="Salento a la Mano"', t)
    if n:
        t = nt
        changes.append(f"logo restaurado x{n}")
    # 2. galería: reemplazar solo <img> con unsplash DENTRO de <div class=\"gallery\">
    def repl_gallery(m):
        inner = m.group(1)
        imgs = photos[:3]
        j = 0
        def repl_img(im):
            nonlocal j
            if j < len(imgs):
                r = re.sub(r'src="[^"]+"', f'src="{imgs[j]}"', im.group(0), count=1)
                j += 1
                return r
            return im.group(0)
        new_inner = re.sub(r'<img[^>]*images\.unsplash\.com[^>]*>', repl_img, inner)
        if new_inner != inner:
            changes.append(f"galeria {j} fotos locales")
        return f'<div class="gallery">{new_inner}</div>'
    t2 = re.sub(r'<div class="gallery">(.*?)</div>', repl_gallery, t, flags=re.S)
    t = t2
    if t != path.read_text(encoding="utf-8", errors="ignore"):
        path.write_text(t, encoding="utf-8")
    return "; ".join(changes) if changes else "sin cambios"

def main():
    pm = load_photos()
    for rel in TARGETS:
        p = ROOT / rel
        if not p.exists():
            print("FALTA:", rel)
            continue
        res = fix_one(p, pm.get(file_slug(rel), []))
        print(("OK " if res != "sin cambios" else "-- ") + rel + " :: " + res)

if __name__ == "__main__":
    main()
