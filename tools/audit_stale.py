#!/usr/bin/env python3
"""Detecta landings/fichas desactualizadas vs places.json actual. Solo lectura."""
from __future__ import annotations
import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def slug(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

data = json.loads((PUB / "data/places.json").read_text(encoding="utf-8"))
for p in data["places"]:
    s = slug(p["name"])
    land = PUB / "paginas-pautantes" / s / "index.html"
    ficha = PUB / "pautantes" / f"{s}.html"
    nphotos = len(p.get("photos") or [])
    for label, path in (("landing", land), ("ficha", ficha)):
        if not path.exists():
            print(f"FALTA {label} {s} (ID{p['id']})")
            continue
        t = path.read_text(encoding="utf-8", errors="ignore")
        pend = t.count("photo-pending")
        uns = t.count("images.unsplash.com")
        has_nav = "Volver al inicio" in t
        has_dual = "Logo pautante" in t
        flag = ""
        if nphotos > 0 and (pend > 0 or uns > 0):
            flag = "  <-- REGENERAR (tiene fotos, muestra placeholder/unsplash)"
        if not has_nav:
            flag += "  <-- SIN NAV"
        print(f"{s} [{label}] fotos={nphotos} pending={pend} unsplash={uns} nav={has_nav} dual={has_dual}{flag}")
