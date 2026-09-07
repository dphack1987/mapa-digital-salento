#!/usr/bin/env python3
"""Read-only SEO strategy analyzer for content and internal-link signals."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://salentoalamano.com"
SKIP = {".git", "node_modules", "dist", "__pycache__"}


def pages() -> list[Path]:
    result = [
        path for path in PUBLIC.rglob("*.html")
        if not any(part in SKIP for part in path.parts)
        and not path.name.startswith("google")
        and path.name != "pautante.html"
    ]
    if (ROOT / "index.html").exists():
        result.append(ROOT / "index.html")
    return sorted(set(result))


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def match(pattern: str, text: str) -> str:
    found = re.search(pattern, text, re.I | re.S)
    return clean(found.group(1)) if found else ""


def page_url(path: Path) -> str:
    if path == ROOT / "index.html":
        return ORIGIN + "/"
    relative = path.relative_to(PUBLIC).as_posix()
    if relative.endswith("/index.html"):
        relative = relative[:-10]
        return ORIGIN + "/" + relative.rstrip("/")
    elif relative.endswith(".html"):
        relative = relative[:-5]
    return ORIGIN + "/" + relative.lstrip("/")


def normalize_url(value: str, base: str) -> str:
    absolute = urljoin(base, value)
    parsed = urlparse(absolute)
    if parsed.netloc and parsed.netloc != urlparse(ORIGIN).netloc:
        return ""
    path = parsed.path or "/"
    if path.endswith(".html"):
        path = path[:-5]
    return ORIGIN + path.rstrip("/") if path != "/" else ORIGIN + "/"


def analyze_page(path: Path) -> tuple[dict, list[str]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    url = page_url(path)
    visible = re.sub(r"<(script|style)\b.*?</\1>", " ", text, flags=re.I | re.S)
    visible = clean(re.sub(r"<[^>]+>", " ", visible))
    links = []
    for value in re.findall(r"<a\b[^>]*\bhref=[\"']([^\"']+)", text, re.I):
        target = normalize_url(value, url)
        if target and target != url:
            links.append(target)
    hreflang = re.findall(r'<link\b[^>]*\bhreflang=["\']([^"\']+)["\'][^>]*>', text, re.I)
    item = {
        "url": url,
        "path": path.relative_to(ROOT).as_posix(),
        "title": match(r"<title[^>]*>(.*?)</title>", text),
        "word_count": len(re.findall(r"\b[\wÁÉÍÓÚáéíóúÑñ]{3,}\b", visible, re.UNICODE)),
        "h1_count": len(re.findall(r"<h1\b", text, re.I)),
        "json_ld_count": len(re.findall(r"application/ld\+json", text, re.I)),
        "internal_links": sorted(set(links)),
        "hreflang_count": len(hreflang),
    }
    return item, links


def analyze() -> dict:
    records = []
    graph: dict[str, set[str]] = defaultdict(set)
    for path in pages():
        record, links = analyze_page(path)
        records.append(record)
        graph[record["url"]].update(links)
    known = {record["url"] for record in records}
    incoming = Counter(target for links in graph.values() for target in links if target in known)
    opportunities = []
    for record in records:
        inbound = incoming[record["url"]]
        if inbound == 0 and record["url"] != ORIGIN + "/":
            opportunities.append({"priority": "high", "type": "orphan-page", "url": record["url"], "action": "Añadir enlaces contextuales desde una categoría o guía relacionada."})
        if record["word_count"] < 180 and record["url"] != ORIGIN + "/":
            opportunities.append({"priority": "medium", "type": "thin-content", "url": record["url"], "action": "Añadir información original: precios, acceso, horarios, requisitos y fuente de actualización."})
        if record["json_ld_count"] == 0:
            opportunities.append({"priority": "medium", "type": "missing-structured-data", "url": record["url"], "action": "Añadir JSON-LD que describa exactamente el tipo de página."})
        record["incoming_links"] = inbound
        record["authority_score"] = min(100, inbound * 12 + min(record["word_count"], 700) // 14 + record["json_ld_count"] * 5)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "read_only": True,
        "origin": ORIGIN,
        "pages_scanned": len(records),
        "summary": {
            "total_internal_edges": sum(len(links & known) for links in graph.values()),
            "pages_with_hreflang": sum(1 for item in records if item["hreflang_count"]),
            "pages_with_json_ld": sum(1 for item in records if item["json_ld_count"]),
            "high_priority_opportunities": sum(1 for item in opportunities if item["priority"] == "high"),
            "total_opportunities": len(opportunities),
        },
        "top_authority_pages": sorted(records, key=lambda item: item["authority_score"], reverse=True)[:15],
        "opportunities": opportunities,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Analizador SEO estratégico de solo lectura")
    parser.add_argument("--output", default="tools/seo_strategy_report.json")
    args = parser.parse_args()
    report = analyze()
    output = ROOT / args.output
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"read_only": True, "pages_scanned": report["pages_scanned"], "summary": report["summary"], "output_file": output.relative_to(ROOT).as_posix()}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()