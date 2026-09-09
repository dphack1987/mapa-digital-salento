#!/usr/bin/env python3
"""Audita todos los botones/enlaces de cada página única por pautante. Solo lectura."""
from __future__ import annotations
import re
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def resolves(href: str) -> str:
    if href.startswith(("https://wa.me/", "http://wa.me/")):
        num = re.sub(r"\D", "", href.split("?")[0].rsplit("/", 1)[-1])
        return "OK-wa" if 8 <= len(num) <= 15 else "WA-MALO"
    if href.startswith("tel:"):
        return "OK-tel" if re.fullmatch(r"tel:\+?\d[\d\s-]*", href) else "TEL-MALO"
    if href.startswith("mailto:"):
        return "OK-mail" if "@" in href else "MAIL-MALO"
    if href.startswith("https://www.google.com/maps"):
        return "OK-maps"
    if href.startswith(("https://", "http://")):
        return "OK-ext"
    if href.startswith("/"):
        clean = unquote(href.split("#")[0].split("?")[0])
        if clean == "/":
            return "OK" if (PUB / "index.html").exists() else "ROTO"
        rel = clean.lstrip("/")
        if (PUB / rel).is_file():
            return "OK"
        if (PUB / (rel + ".html")).is_file():
            return "OK-clean"
        if (PUB / rel).is_dir() and (PUB / rel / "index.html").is_file():
            return "OK-index"
        return "ROTO"
    return "SKIP"

total_ok = total_bad = 0
bad: list[str] = []
for d in sorted((PUB / "paginas-pautantes").iterdir()):
    idx = d / "index.html"
    if not idx.is_file():
        continue
    t = idx.read_text(encoding="utf-8", errors="ignore")
    hrefs = re.findall(r'href="([^"]+)"', t)
    okn = badn = 0
    for h in hrefs:
        st = resolves(h)
        if st.startswith("OK") or st == "SKIP":
            okn += 1
            total_ok += 1
        else:
            badn += 1
            total_bad += 1
            bad.append(f"{d.name} :: [{st}] {h}")
    wa = len(re.findall(r"https://wa\.me/\d+", t))
    print(f"{d.name}: {okn} ok / {badn} mal — wa.me:{wa} {'BOTONES-WA-OK' if wa > 0 else '(sin botón wa)'}")

print(f"\nTOTAL: {total_ok} ok, {total_bad} rotos")
for b in bad[:30]:
    print(" -", b)
