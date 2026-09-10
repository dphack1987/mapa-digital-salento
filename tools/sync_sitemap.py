#!/usr/bin/env python3
"""Añade al sitemap las URLs de HTML públicos que falten. No borra entradas."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"
SM = PUB / "sitemap.xml"
ORIGIN = "https://salentoalamano.com"

SKIP = {"googleac76b27847921d06.html"}
# Nunca indexar: stubs de redirección ni duplicados .html con canónica limpia
SKIP_PREFIXES = ("pautantes/", "paginas-pautantes/camping-cascadas-santa-rita/")
SKIP_ROOT_HTML = {
    "don-chucho-asistente.html", "estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100.html",
    "estado-vias-salento-hoy.html", "faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html",
    "hoteles-abiertos-salento.html", "hoteles-hostales-abiertos-salento.html",
    "hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas.html", "landing-estado-actual-salento-2026.html",
    "mapa-interactivo-salento.html", "paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos.html",
    "restaurantes-salento-abiertos-servicio-gastronomico-operativo.html",
    "rumor-cierre-salento-falso-desmentido-oficialmente.html",
    "salento-abierto-hoy-turismo-seguro-valle-cocora-accesible.html", "salento-seguro-turismo.html",
    "transporte-salento-jeeps-willys-operativos-servicio-normal.html", "turismo-salento-seguro-hoy.html",
    "valle-cocora-accesible-100.html", "valle-cocora-cerrado-falso-acceso-confirmado-operativo.html",
    "valle-cocora-operativo-seguro.html", "vias-salento-libres-acceso.html", "registro-aliados.html",
}

def prio(rel: str) -> tuple[str, str]:
    if rel.startswith("paginas-pautantes/"):
        return ("weekly", "0.8")
    if rel.startswith("pautantes/"):
        return ("monthly", "0.6")
    if rel.startswith("categorias/"):
        return ("weekly", "0.8")
    if rel.endswith(".html") and "/" not in rel:
        return ("weekly", "0.7")
    return ("monthly", "0.5")

def main() -> None:
    xml = SM.read_text(encoding="utf-8")
    have = set(re.findall(r"<loc>(https://salentoalamano\.com[^<]*)</loc>", xml))
    have_paths = {u.replace(ORIGIN, "") for u in have}
    added = []
    for f in sorted(PUB.rglob("*.html")):
        rel = f.relative_to(PUB).as_posix()
        if f.name in SKIP:
            continue
        if rel in SKIP_ROOT_HTML:
            continue
        if rel.startswith(SKIP_PREFIXES):
            continue
        if rel == "index.html":
            continue
        url_path = "/" + rel
        if rel.endswith("/index.html"):
            url_path = "/" + rel[: -len("index.html")]
        if url_path in have_paths or (url_path + ".html") in have_paths or url_path.rstrip("/") in {h.rstrip("/") for h in have_paths}:
            continue
        # evita duplicado sin slash: /x <-> /x/
        if any(h.rstrip("/") == url_path.rstrip("/") for h in have_paths):
            continue
        cf, pr = prio(rel)
        added.append((url_path, cf, pr))
    if not added:
        print("Sitemap completo, nada que añadir")
        return
    entries = "\n".join(
        f"""  <url>
    <loc>{ORIGIN}{u}</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>{cf}</changefreq>
    <priority>{pr}</priority>
  </url>""" for u, cf, pr in added
    )
    xml = xml.replace("</urlset>", entries + "\n</urlset>")
    SM.write_text(xml, encoding="utf-8")
    print(f"Sitemap: {len(added)} URLs añadidas")
    for u, _, _ in added:
        print(" +", u)

if __name__ == "__main__":
    main()
