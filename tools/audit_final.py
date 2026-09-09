#!/usr/bin/env python3
"""Auditoría final por pautante: datos verificados presentes en su página única."""
from __future__ import annotations
from pathlib import Path

PUB = Path(__file__).resolve().parents[1] / "public"

# slug landing -> lista de (etiqueta, textos que DEBEN aparecer)
EXPECT = {
    "moto-aventura-110": [
        ("tipo Experiencias", ["Experiencias"]),
        ("tarifas", ["$15.000", "$20.000", "$25.000"]),
        ("incluye", ["Casco", "Protecciones", "seguro"]),
        ("requisitos", ["130 cm", "bicicleta"]),
        ("whatsapp", ["573234540949"]),
        ("fotos locales", ["/pautas/moto_aventura_110/imagenes/1.jpeg"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio", "Ir a página principal"]),
        ("logo dual", ["logo-moto-aventura-110.jpg"]),
    ],
    "hotel-la-floresta-salento": [
        ("precio", ["124.000"]),
        ("dirección", ["Cra. 5 #10-11"]),
        ("checkin", ["15:00"]),
        ("whatsapp", ["573128681808"]),
        ("fotos locales", ["/pautas/hotel_la_floresta_salento/imagenes/"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio"]),
    ],
    "hotel-camino-nacional-salento": [
        ("whatsapp", ["573113903550"]),
        ("email", ["reservas@hotelcamino.com.co"]),
        ("fotos locales", ["/pautas/hotel_camino_nacional/imagenes/1326164875.webp"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio"]),
    ],
    "boki-mall-hotel-el-mirador-de-boquia": [
        ("RNT", ["91079"]),
        ("contacto", ["573112225312", "bokimall.com"]),
        ("foto única hotel", ["Hotel_Mirador_de_Boquia_1747081077351.jpeg", "images%20(1).jfif"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio"]),
        ("logo dual", ["logo-hotel-mirador-de-boquia.png"]),
    ],
    "boki-mall-restaurante-terra": [
        ("horario terra", ["Almuerzo:"]),
        ("foto única terra", ["314270821.jpg"]),
        ("sin foto hotel en galería", ["!Hotel_Mirador_de_Boquia_1747081077351.jpeg"]),
        ("nav", ["Volver al inicio"]),
    ],
    "boki-mall-barcinales-cafe-bar": [
        ("foto única bar", ["images%20(2).jfif"]),
        ("nav", ["Volver al inicio"]),
    ],
    "boki-mall-eventos": [
        ("foto única eventos", ["370049629.jpg"]),
        ("nav", ["Volver al inicio"]),
    ],
    "fonda-boquia": [
        ("whatsapp", ["573137160977"]),
        ("carta", ["Trucha mixta", "$46.000", "Mojarra"]),
        ("fotos carta", ["menu-carta1.jpeg"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio"]),
    ],
    "finca-hotel-el-ocaso": [
        ("foto ocaso", ["foto_casa_ocaso.png"]),
        ("logo dual", ["logo_ocaso.png"]),
        ("nav", ["Volver al inicio"]),
    ],
    "reserva-natural-cascadas-de-santa-rita": [
        ("tarifas", ["$11.000", "$28.000", "$140.000"]),
        ("contacto", ["573015038254"]),
        ("fotos locales", ["/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rita1.jpg"]),
        ("sin unsplash", []),
        ("nav", ["Volver al inicio"]),
        ("logo dual", ["logo_cascadas_de_santa_rita.jfif"]),
    ],
    "camping-cascadas-de-santa-rita": [
        ("mapa offline", ["mapOverlay", "santaRitaProgress", "mapaoffline.jpeg"]),
        ("whatsapp", ["573015038254"]),
        ("volver", ["Volver al inicio"]),
    ],
}

ok_total = 0
fail_total = 0
fails: list[str] = []
for slug, checks in EXPECT.items():
    t = (PUB / "paginas-pautantes" / slug / "index.html").read_text(encoding="utf-8", errors="ignore")
    for label, needles in checks:
        if label == "sin unsplash":
            passed = "images.unsplash.com" not in t
            detail = "0 unsplash" if passed else f"{t.count('images.unsplash.com')} unsplash"
        elif label.startswith("sin "):
            passed = all(n not in t for n in needles)
            detail = "ok"
        else:
            missing = [n for n in needles if n not in t]
            passed = not missing
            detail = "ok" if passed else f"falta: {missing}"
        ok_total += passed
        fail_total += not passed
        if not passed:
            fails.append(f"{slug} :: {label} -> {detail}")
        print(f"[{'OK' if passed else 'FALLA'}] {slug} :: {label} ({detail})")

total = ok_total + fail_total
print(f"\nRESULTADO: {ok_total}/{total} = {ok_total/total*100:.1f}%")
for f in fails:
    print(" -", f)
