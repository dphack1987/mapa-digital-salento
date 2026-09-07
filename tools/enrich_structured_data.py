#!/usr/bin/env python3
"""Add factual WebPage JSON-LD to static pages that have none."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://salentoalamano.com"


def extract(pattern: str, text: str) -> str:
    match = re.search(pattern, text, re.I | re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else ""


def page_url(path: Path) -> str:
    if path == ROOT / "index.html":
        return ORIGIN + "/"
    relative = path.relative_to(PUBLIC).as_posix()
    if relative.endswith("/index.html"):
        relative = relative[:-10]
    elif relative.endswith(".html"):
        relative = relative[:-5]
    return ORIGIN + "/" + relative.lstrip("/")


def enrich(path: Path, apply: bool) -> bool:
    if path.name.startswith("google"):
        return False
    text = path.read_text(encoding="utf-8", errors="replace")
    if re.search(r"application/ld\+json", text, re.I) or not re.search(r"</head>", text, re.I):
        return False
    title = extract(r"<title[^>]*>(.*?)</title>", text)
    description = extract(r'<meta\b[^>]*\bname=["\']description["\'][^>]*\bcontent=["\']([^"\']*)', text)
    canonical = extract(r'<link\b[^>]*\brel=["\']canonical["\'][^>]*\bhref=["\']([^"\']*)', text)
    url = canonical or page_url(path)
    if urlparse(url).scheme not in {"http", "https"}:
        url = page_url(path)
    schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": url,
        "isPartOf": {"@type": "WebSite", "name": "Salento a la Mano", "url": ORIGIN + "/"},
    }
    block = f'    <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>'
    if apply:
        path.write_text(re.sub(r"</head>", f"\n{block}\n  </head>", text, count=1, flags=re.I), encoding="utf-8")
    print(f"{'UPDATED' if apply else 'WOULD_UPDATE'} {path.relative_to(ROOT).as_posix()}")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Enriquece JSON-LD sin datos inventados")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    paths = sorted(PUBLIC.rglob("*.html"))
    root_index = ROOT / "index.html"
    if root_index.exists():
        paths.append(root_index)
    changed = sum(enrich(path, apply=not args.check) for path in paths)
    print(f"Paginas con JSON-LD añadido: {changed}")


if __name__ == "__main__":
    main()