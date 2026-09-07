#!/usr/bin/env python3
"""Keep static SEO titles and descriptions concise without touching body HTML."""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MAX_TITLE = 60
MAX_DESCRIPTION = 160


def shorten(value: str, limit: int) -> str:
    value = re.sub(r"\s+", " ", html.unescape(value)).strip()
    if len(value) <= limit:
        return value
    boundary = max(value.rfind(".", 0, limit + 1), value.rfind(":", 0, limit + 1), value.rfind(" ", 0, limit + 1))
    return value[:boundary if boundary >= limit // 2 else limit].rstrip(" .,:;-")


def replace_tag(text: str, pattern: str, replacement: str) -> str:
    return re.sub(pattern, replacement, text, count=1, flags=re.I | re.S)


def optimize(path: Path, apply: bool) -> bool:
    if path.name.startswith("google"):
        return False
    text = path.read_text(encoding="utf-8", errors="replace")
    original = text
    title_match = re.search(r"<title([^>]*)>(.*?)</title>", text, re.I | re.S)
    if title_match:
        original_title = re.sub(r"\s+", " ", title_match.group(2)).strip()
        title = original_title
        relative = path.relative_to(ROOT).as_posix()
        locale_match = re.match(r"public/(es|en|de|fr)/guias/", relative)
        if locale_match and " | " not in title[-8:]:
            title = f"{title} | {locale_match.group(1).upper()}"
        if relative.startswith("public/paginas-pautantes/") and title.endswith(" | Salento a la Mano"):
            title = title.removesuffix(" | Salento a la Mano") + " | Guía local"
        if len(title) > MAX_TITLE:
            base = title.split(" | ", 1)[0].strip()
            title = shorten(f"{base} | Guía local", MAX_TITLE)
        if title != original_title:
            text = replace_tag(text, r"<title([^>]*)>.*?</title>", f"<title>{html.escape(title)}</title>")

    description_match = re.search(
        r'<meta\b[^>]*\bname=["\']description["\'][^>]*\bcontent=["\']([^"\']*)',
        text,
        re.I | re.S,
    )
    if description_match and len(html.unescape(description_match.group(1))) > MAX_DESCRIPTION:
        description = shorten(description_match.group(1), MAX_DESCRIPTION)
        text = replace_tag(
            text,
            r'(<meta\b[^>]*\bname=["\']description["\'][^>]*\bcontent=["\'])([^"\']*)(["\'])',
            rf"\g<1>{html.escape(description, quote=True)}\g<3>",
        )

    if text == original:
        return False
    if apply:
        path.write_text(text, encoding="utf-8")
    print(f"{'UPDATED' if apply else 'WOULD_UPDATE'} {path.relative_to(ROOT).as_posix()}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimiza metadatos SEO estáticos")
    parser.add_argument("--check", action="store_true", help="Solo muestra cambios potenciales")
    args = parser.parse_args()
    paths = sorted(PUBLIC.rglob("*.html"))
    root_index = ROOT / "index.html"
    if root_index.exists():
        paths.append(root_index)
    changed = sum(optimize(path, apply=not args.check) for path in paths)
    print(f"Metadatos optimizados: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())