#!/usr/bin/env python3
"""Add missing SEO head tags without rewriting existing page content."""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://salentoalamano.com"
ALLOWED_PREFIXES = (
    "public/categorias/",
    "public/pautantes/",
    "public/paginas-pautantes/",
)


def extract(pattern: str, text: str) -> str:
    match = re.search(pattern, text, re.I | re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else ""


def attribute(tag: str, name: str) -> str:
    match = re.search(rf"\b{name}\s*=\s*(['\"])(.*?)\1", tag, re.I | re.S)
    return match.group(2).strip() if match else ""


def has_meta_description(text: str) -> bool:
    return bool(re.search(r'<meta\b[^>]*\bname=["\']description["\']', text, re.I))


def has_canonical(text: str) -> bool:
    for tag in re.findall(r"<link\b[^>]*>", text, re.I | re.S):
        if "canonical" in attribute(tag, "rel").lower().split():
            return True
    return False


def canonical_path(path: Path) -> str:
    relative = path.relative_to(PUBLIC).as_posix()
    if relative.endswith("/index.html"):
        relative = relative[:-10].rstrip("/")
        return "/" + relative + "/"
    return "/" + relative


def enrich(path: Path, apply: bool) -> bool:
    relative = path.relative_to(ROOT).as_posix()
    if not relative.startswith(ALLOWED_PREFIXES):
        return False
    text = path.read_text(encoding="utf-8", errors="replace")
    additions = []
    if not has_canonical(text):
        additions.append(f'    <link rel="canonical" href="{ORIGIN}{canonical_path(path)}" />')
    if not has_meta_description(text):
        title = html.unescape(extract(r"<title[^>]*>(.*?)</title>", text))
        subject = title.split("|")[0].strip() or "Servicio turístico local"
        description = f"{subject} en Salento, Quindío. Consulta información local, ubicación y contacto directo."
        additions.append(f'    <meta name="description" content="{html.escape(description, quote=True)}" />')
    if not additions or not re.search(r"</head>", text, re.I):
        return False
    if apply:
        enriched = re.sub(r"</head>", "\n" + "\n".join(additions) + "\n  </head>", text, count=1, flags=re.I)
        path.write_text(enriched, encoding="utf-8")
    print(f"{'UPDATED' if apply else 'WOULD_UPDATE'} {relative}: {', '.join(addition.split()[2] for addition in additions)}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Enriquece metadatos SEO sin borrar contenido")
    parser.add_argument("--check", action="store_true", help="Solo informa cambios, no escribe archivos")
    args = parser.parse_args()
    changed = sum(enrich(path, apply=not args.check) for path in sorted(PUBLIC.rglob("*.html")))
    print(f"Paginas enriquecidas: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())