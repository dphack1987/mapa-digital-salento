#!/usr/bin/env python3
"""Reconstruye sitemap sin duplicados ni redirecciones. Preserva estilos."""
from __future__ import annotations
import re
from pathlib import Path

SM = Path(__file__).resolve().parents[1] / "public" / "sitemap.xml"

xml = SM.read_text(encoding="utf-8")
header = xml.split("<url>")[0]
blocks = re.findall(r"<url>.*?</url>", xml, re.S)
seen: set[str] = set()
out: list[str] = []
dropped = 0
for b in blocks:
    m = re.search(r"<loc>(https://salentoalamano\.com[^<]*)</loc>", b)
    if not m:
        continue
    u = m.group(1)
    if "/pautantes/" in u or u.endswith("/paginas-pautantes/camping-cascadas-santa-rita/"):
        dropped += 1
        continue
    if u in seen:
        dropped += 1
        continue
    seen.add(u)
    out.append(b)
SM.write_text(header + "\n".join(out) + "\n</urlset>\n", encoding="utf-8")
print(f"sitemap limpio: {len(out)} urls, {dropped} duplicadas/redirects fuera")
