#!/usr/bin/env python3
"""Audita botones Volver/Inicio y estructura en páginas nuevas. Solo lectura."""
from __future__ import annotations
from html.parser import HTMLParser
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
]

class TagCheck(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.links = []
        VOID = {"meta","link","img","br","hr","input","source"}
        self._void = VOID
    def handle_starttag(self, tag, attrs):
        if tag in self._void:
            return
        self.stack.append((tag, self.getpos()))
        if tag == "a":
            d = dict(attrs)
            self.links.append(d.get("href", ""))
    def handle_endtag(self, tag):
        if tag in self._void:
            return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            # busca cierre coincidente
            names = [t for t, _ in self.stack]
            if tag in names:
                while self.stack and self.stack[-1][0] != tag:
                    bad, pos = self.stack.pop()
                    self.errors.append(f"<{bad}> abierto en {pos} sin cerrar antes de </{tag}>")
                self.stack.pop()
            else:
                self.errors.append(f"</{tag}> sin apertura en {self.getpos()}")

for rel in FILES:
    p = PUBLIC / rel
    if not p.exists():
        print("FALTA:", rel)
        continue
    t = p.read_text(encoding="utf-8", errors="ignore")
    c = TagCheck()
    try:
        c.feed(t)
    except Exception as e:  # noqa
        print("PARSE-FAIL:", rel, e)
        continue
    volver = [h for h in c.links if h == "/"]
    idx = [h for h in c.links if h == "/index.html"]
    print(f"{rel} | links:{len(c.links)} href='/':{len(volver)} href='/index.html':{len(idx)} | VolverTxt:{t.count('Volver al inicio')} | errores:{len(c.errors)} | sin_cerrar:{[x[0] for x in c.stack]}")
    for e in c.errors[:4]:
        print("   ERR:", e)
