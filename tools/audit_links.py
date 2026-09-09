#!/usr/bin/env python3
"""Audita hrefs internos de páginas nuevas contra archivos existentes. Solo lectura."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

FILES = [
    "salento-abierto-hoy-turismo-seguro-valle-cocora-accesible.html",
    "paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos.html",
    "hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas.html",
    "rumor-cierre-salento-falso-desmentido-oficialmente.html",
    "valle-cocora-cerrado-falso-acceso-confirmado-operativo.html",
    "faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html",
    "restaurantes-salento-abiertos-servicio-gastronomico-operativo.html",
    "transporte-salento-jeeps-willys-operativos-servicio-normal.html",
    "estado-vias-salento-hoy.html",
    "hoteles-hostales-abiertos-salento.html",
    "valle-cocora-operativo-seguro.html",
    "turismo-salento-seguro-hoy.html",
    "categorias/camping.html",
    "paginas-pautantes/moto-aventura-110/index.html",
    "paginas-pautantes/hotel-camino-nacional-salento/index.html",
    "paginas-pautantes/camping-cascadas-de-santa-rita/index.html",
    "paginas-pautantes/fonda-boquia/index.html",
]

def resolves(href: str) -> str:
    if not href.startswith("/") or href.startswith("//"):
        return "EXTERNO/SKIP"
    if href == "/":
        return "OK" if (PUBLIC / "index.html").exists() else "FALTA-index"
    clean = href.split("#")[0].split("?")[0]
    # 1. archivo exacto
    if (PUBLIC / clean.lstrip("/")).is_file():
        return "OK"
    # 2. cleanUrls: /ruta -> /ruta.html
    if (PUBLIC / (clean.lstrip("/") + ".html")).is_file():
        return "OK-cleanUrls"
    # 3. directorio con index
    if (PUBLIC / clean.lstrip("/")).is_dir() and (PUBLIC / clean.lstrip("/") / "index.html").is_file():
        return "OK-index"
    return "ROTO"

for rel in FILES:
    t = (PUBLIC / rel).read_text(encoding="utf-8", errors="ignore")
    hrefs = sorted(set(re.findall(r'href="(/[^"]*)"', t)))
    print(f"== {rel} ==")
    for h in hrefs:
        st = resolves(h)
        flag = "  <-- REVISAR" if st == "ROTO" else ""
        print(f"  [{st}] {h}{flag}")
