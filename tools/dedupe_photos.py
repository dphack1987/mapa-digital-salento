#!/usr/bin/env python3
"""Asigna fotos únicas por pautante (sin repetir) desde inventario verificado."""
from __future__ import annotations
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def U(p: str) -> str:
    return quote(p, safe="/:%")

ASSIGN = {
    13: [
        "/pautas/boki_mall/hotel-mirador-boquia/Hotel_Mirador_de_Boquia_1747081077351.jpeg",
        "/pautas/boki_mall/hotel-mirador-boquia/images.jfif",
        "/pautas/boki_mall/hotel-mirador-boquia/images (1).jfif",
    ],
    28: ["/pautas/boki_mall/hotel-mirador-boquia/314270821.jpg"],
    29: ["/pautas/boki_mall/hotel-mirador-boquia/images (2).jfif"],
    30: ["/pautas/boki_mall/hotel-mirador-boquia/370049629.jpg"],
}

def main() -> None:
    pp = PUB / "data/places.json"
    data = json.loads(pp.read_text(encoding="utf-8"))
    for p in data["places"]:
        if p["id"] in ASSIGN:
            # solo archivos que existen (u lleva / inicial: quitarlo para unir rutas)
            ok = [U(u) for u in ASSIGN[p["id"]] if (PUB / u.lstrip("/")).exists()]
            missing = [u for u in ASSIGN[p["id"]] if not (PUB / u.lstrip("/")).exists()]
            p["photos"] = ok
            print(f"ID{p['id']} {p['name']}: {len(ok)} fotos únicas" + (f" (faltan en disco: {missing})" if missing else ""))
    # verifica duplicados globales
    seen: dict[str, list[str]] = {}
    for p in data["places"]:
        for u in p.get("photos") or []:
            seen.setdefault(u, []).append(p["name"])
    dupes = {u: v for u, v in seen.items() if len(v) > 1}
    if dupes:
        print("DUPLICADOS RESTANTES:")
        for u, v in dupes.items():
            print(" -", u, "=>", " | ".join(v))
    else:
        print("Cero fotos repetidas entre pautantes")
    pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
