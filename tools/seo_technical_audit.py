#!/usr/bin/env python3
"""Read-only technical SEO audit for the static Salento site.

It reports indexability and discoverability issues without changing site files.
It uses only the Python standard library, so it can run locally or in CI.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DEFAULT_ORIGIN = "https://salentoalamano.com"
SKIP_DIRS = {".git", "node_modules", "dist", "__pycache__"}
SEVERITIES = ("error", "warning", "info")


def iter_html_files() -> Iterable[Path]:
    for path in PUBLIC.rglob("*.html"):
        if not any(part in SKIP_DIRS for part in path.parts) and not path.name.startswith("google"):
            yield path
    root_index = ROOT / "index.html"
    if root_index.exists():
        yield root_index


def first_match(pattern: str, text: str) -> str:
    match = re.search(pattern, text, re.I | re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else ""


def local_url_from_file(path: Path, origin: str) -> str:
    if path == ROOT / "index.html":
        return origin + "/"
    relative = path.relative_to(PUBLIC).as_posix()
    if relative == "index.html":
        return origin + "/"
    if relative.endswith("/index.html"):
        relative = relative[:-10]
    elif relative.endswith(".html"):
        relative = relative[:-5]
    return origin + "/" + relative.lstrip("/")


def comparable_url(url: str) -> str:
    return url.removesuffix(".html").rstrip("/")


def add_issue(issues: list[dict[str, Any]], severity: str, code: str,
              path: str, message: str) -> None:
    issues.append({
        "severity": severity,
        "code": code,
        "path": path,
        "message": message,
    })


def extract_meta(text: str, name: str) -> str:
    patterns = (
        rf'<meta\b[^>]*\bname=["\\\']{re.escape(name)}["\\\'][^>]*\bcontent=["\\\']([^"\\\']*)',
        rf'<meta\b[^>]*\bcontent=["\\\']([^"\\\']*)["\\\'][^>]*\bname=["\\\']{re.escape(name)}',
    )
    for pattern in patterns:
        value = first_match(pattern, text)
        if value:
            return value
    return ""


def extract_attribute(tag: str, name: str) -> str:
    match = re.search(rf"\b{re.escape(name)}\s*=\s*(['\"])(.*?)\1", tag, re.I | re.S)
    return match.group(2).strip() if match else ""


def extract_canonical(text: str) -> str:
    for tag in re.findall(r"<link\b[^>]*>", text, re.I | re.S):
        rel = extract_attribute(tag, "rel").lower().split()
        if "canonical" in rel:
            return extract_attribute(tag, "href")
    return ""


def check_html(path: Path, origin: str, issues: list[dict[str, Any]]) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8", errors="replace")
    relative = path.relative_to(ROOT).as_posix()
    canonical = extract_canonical(text)
    title = first_match(r"<title[^>]*>(.*?)</title>", text)
    description = extract_meta(text, "description")
    robots = extract_meta(text, "robots").lower()
    language = first_match(r"<html\b[^>]*\blang=[\\\"']([^\\\"']+)", text)
    h1_count = len(re.findall(r"<h1\b", text, re.I))
    json_ld_blocks = re.findall(r'<script\b[^>]*type=["\\\']application/ld\+json["\\\'][^>]*>(.*?)</script>', text, re.I | re.S)
    valid_json_ld = 0
    for block in json_ld_blocks:
        try:
            json.loads(block.strip())
            valid_json_ld += 1
        except json.JSONDecodeError:
            add_issue(issues, "error", "invalid-json-ld", relative, "Hay un bloque JSON-LD que no es JSON válido.")

    if not title:
        add_issue(issues, "error", "missing-title", relative, "Falta <title>.")
    elif len(title) > 65:
        add_issue(issues, "warning", "long-title", relative, f"El título tiene {len(title)} caracteres.")
    if not description:
        add_issue(issues, "warning", "missing-description", relative, "Falta meta description.")
    elif len(description) > 170:
        add_issue(issues, "warning", "long-description", relative, f"La descripción tiene {len(description)} caracteres.")
    if not canonical:
        add_issue(issues, "error", "missing-canonical", relative, "Falta canonical.")
    elif not canonical.startswith(origin + "/") and canonical != origin:
        add_issue(issues, "warning", "external-canonical", relative, f"Canonical fuera del dominio esperado: {canonical}")
    if not language:
        add_issue(issues, "warning", "missing-language", relative, "Falta lang en <html>.")
    if "noindex" in robots:
        add_issue(issues, "error", "noindex", relative, "La página contiene noindex y no será indexable.")
    is_react_shell = path == ROOT / "index.html" and '<div id="root"></div>' in text
    if h1_count != 1 and not is_react_shell:
        add_issue(issues, "warning", "h1-count", relative, f"La página contiene {h1_count} elementos H1; se espera uno.")

    return {
        "url": local_url_from_file(path, origin),
        "title": title,
        "description_length": len(description),
        "canonical": canonical,
        "language": language,
        "h1_count": h1_count,
        "json_ld_blocks": len(json_ld_blocks),
        "valid_json_ld_blocks": valid_json_ld,
        "indexable": "noindex" not in robots,
    }


def check_sitemap(origin: str, html_urls: set[str], issues: list[dict[str, Any]]) -> dict[str, Any]:
    sitemap = PUBLIC / "sitemap.xml"
    if not sitemap.exists():
        add_issue(issues, "error", "missing-sitemap", "public/sitemap.xml", "No existe el sitemap principal.")
        return {"url_count": 0, "missing_local_pages": []}
    try:
        root = ElementTree.parse(sitemap).getroot()
    except ElementTree.ParseError as exc:
        add_issue(issues, "error", "invalid-sitemap", "public/sitemap.xml", f"XML inválido: {exc}")
        return {"url_count": 0, "missing_local_pages": []}

    namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    urls = [node.text.strip() for node in root.findall(f"{namespace}url/{namespace}loc") if node.text]
    html_keys = {comparable_url(url) for url in html_urls}
    missing = sorted(
        url for url in urls
        if url.startswith(origin)
        and comparable_url(url) not in html_keys
        and comparable_url(url) != origin
    )
    for url in missing:
        add_issue(issues, "warning", "sitemap-orphan", "public/sitemap.xml", f"URL del sitemap sin HTML estático equivalente: {url}")
    return {"url_count": len(urls), "missing_local_pages": missing}


def check_robots(issues: list[dict[str, Any]]) -> dict[str, Any]:
    path = PUBLIC / "robots.txt"
    if not path.exists():
        add_issue(issues, "error", "missing-robots", "public/robots.txt", "No existe robots.txt.")
        return {"sitemaps": [], "crawl_delay": True}
    text = path.read_text(encoding="utf-8", errors="replace")
    sitemaps = re.findall(r"^\s*Sitemap:\s*(\S+)", text, re.I | re.M)
    if not sitemaps:
        add_issue(issues, "warning", "robots-without-sitemap", "public/robots.txt", "robots.txt no declara ningún sitemap.")
    if re.search(r"^\s*Crawl-delay:", text, re.I | re.M):
        add_issue(issues, "info", "crawl-delay", "public/robots.txt", "Crawl-delay está presente; Google no lo interpreta como señal de ranking.")
    return {"sitemaps": sitemaps, "crawl_delay": bool(re.search(r"^\s*Crawl-delay:", text, re.I | re.M))}


def audit(origin: str) -> dict[str, Any]:
    issues: list[dict[str, Any]] = []
    pages = [check_html(path, origin, issues) for path in sorted(set(iter_html_files()))]
    titles = defaultdict(list)
    canonicals = defaultdict(list)
    for page in pages:
        if page["title"]:
            titles[page["title"].lower()].append(page["url"])
        if page["canonical"]:
            canonicals[page["canonical"]].append(page["url"])
    for title, urls in titles.items():
        if len(urls) > 1:
            add_issue(issues, "warning", "duplicate-title", ", ".join(urls[:3]), f"Título duplicado en {len(urls)} URLs: {title}")
    for canonical, urls in canonicals.items():
        if len(urls) > 1:
            add_issue(issues, "warning", "duplicate-canonical", ", ".join(urls[:3]), f"Canonical compartido por {len(urls)} URLs: {canonical}")

    html_urls = {page["url"] for page in pages}
    sitemap = check_sitemap(origin, html_urls, issues)
    robots = check_robots(issues)
    counts = Counter(issue["severity"] for issue in issues)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "origin": origin,
        "read_only": True,
        "pages_scanned": len(pages),
        "summary": {severity: counts.get(severity, 0) for severity in SEVERITIES},
        "pages": pages,
        "sitemap": sitemap,
        "robots": robots,
        "issues": issues,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Auditor técnico SEO de solo lectura")
    parser.add_argument("--origin", default=DEFAULT_ORIGIN, help="Origen canónico esperado")
    parser.add_argument("--output", default="tools/seo_technical_audit.json", help="Archivo JSON de salida")
    parser.add_argument("--strict", action="store_true", help="Devuelve código 1 si hay errores o advertencias")
    args = parser.parse_args()
    if urlparse(args.origin).scheme not in {"http", "https"}:
        raise SystemExit("--origin debe ser una URL http(s)")

    report = audit(args.origin.rstrip("/"))
    output = ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({
        "read_only": report["read_only"],
        "pages_scanned": report["pages_scanned"],
        "summary": report["summary"],
        "output_file": output.relative_to(ROOT).as_posix(),
    }, ensure_ascii=False, indent=2))
    return 1 if args.strict and (report["summary"]["error"] or report["summary"]["warning"]) else 0


if __name__ == "__main__":
    sys.exit(main())
