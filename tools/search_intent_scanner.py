#!/usr/bin/env python3
"""Advanced Salento search-intent scanner.

This utility performs a multi-engine search scan for the most relevant
Salento tourism queries, extracts candidate result titles/snippets, classifies
search intent, and produces a structured JSON analysis that can be used for
SEO, content planning, and keyword strategy.

Usage examples:
  python tools/search_intent_scanner.py --providers google bing duckduckgo --limit 8
  python tools/search_intent_scanner.py --output tools/salento_search_scan.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ROOT = Path(__file__).resolve().parents[1]

PROVIDERS: Dict[str, str] = {
    "google": "https://www.google.com/search?q={q}&num={limit}",
    "bing": "https://www.bing.com/search?q={q}&setlang=es&cc=co&count={limit}",
    "duckduckgo": "https://duckduckgo.com/html/?q={q}",
    "brave": "https://search.brave.com/search?q={q}&source=web",
}

SEED_QUERIES = [
    "Salento Colombia",
    "Salento Quindío",
    "hoteles en Salento",
    "restaurantes en Salento",
    "Valle de Cocora Salento",
    "tour en Salento",
    "Salento turismo",
    "Salento actividades",
    "Salento cosas para hacer",
    "Salento mapa",
    "Salento seguridad",
    "Salento clima",
    "Salento viajes",
    "finca cafetera Salento",
    "cabalgatas en Salento",
    "Salento restaurante recomendado",
    "Salento hotel barato",
    "Salento con niños",
    "Salento para parejas",
    "Salento desde Armenia",
    "como llegar a Salento",
    "Salento que hacer",
    "Salento Boquía",
    "Salento naturaleza",
    "Salento café",
    "Salento opiniones",
    "Salento reserva hotel",
    "Salento tours en español",
    "Salento finca coffee tour",
]

INTENT_KEYWORDS = {
    "informational": [
        "que es", "qué es", "como llegar", "cómo llegar", "como hacer",
        "que hacer", "qué hacer", "donde", "dónde", "informacion", "información",
        "clima", "mapa", "historia", "distancia", "horario", "precio", "opiniones",
        "turismo", "atractivo", "atracciones"
    ],
    "transactional": [
        "reservar", "comprar", "precio", "precio", "book", "booking",
        "hotel", "restaurante", "tour", "cabalgata", "reserva", "paquete", "oferta"
    ],
    "commercial": [
        "mejor", "recomendado", "opiniones", "comparar", "hoteles", "restaurantes",
        "tour operadores", "guia", "review"
    ],
    "navigational": [
        "hotel la floresta", "boki mall", "mirador manos de dios", "cocora magic",
        "moto aventura 110", "finca don elias", "restaurante don elias", "salento a la mano"
    ],
    "local": [
        "ubicacion", "dirección", "telefono", "teléfono", "cerca", "al lado",
        "en salento", "boquía", "valle de cocora", "plaza principal", "vereda", "calle" 
    ],
}


def normalize_query(q: str) -> str:
    return " ".join(q.strip().split())


def detect_intent(query: str) -> str:
    q = query.lower()
    if any(token in q for token in INTENT_KEYWORDS["navigational"]):
        return "navigational"
    if any(token in q for token in ["reservar", "precio", "book", "oferta", "hotel barato", "comprar", "tour"]):
        return "transactional"
    if any(token in q for token in ["mejor", "opiniones", "recomendado", "comparar", "ranking"]):
        return "commercial"
    if any(token in q for token in ["telefono", "direccion", "ubicacion", "como llegar", "donde", "horario", "mapa"]):
        return "local"
    if any(token in q for token in ["que es", "qué es", "como", "cómo", "que hacer", "clima", "historia", "turismo"]):
        return "informational"
    return "informational"


def fetch_url(url: str, timeout: int = 20) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36"
        ),
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = response.read()
    return payload.decode("utf-8", errors="ignore")


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "")
    return value.strip()


def extract_anchor_texts(html: str) -> List[str]:
    candidates = []
    patterns = [
        r'<a[^>]+href=["\'][^"\']+["\'][^>]*>(.*?)</a>',
        r'<h3[^>]*>(.*?)</h3>',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, html, flags=re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', ' ', match.group(1))
            text = html_unescape(text)
            text = clean_text(text)
            if text and len(text) > 2:
                candidates.append(text)
    return candidates


def html_unescape(s: str) -> str:
    s = s.replace("&amp;", "&")
    s = s.replace("&quot;", '"')
    s = s.replace("&#39;", "'")
    s = s.replace("&lt;", "<")
    s = s.replace("&gt;", ">")
    return s


def parse_search_results(html: str, provider: str) -> List[str]:
    snippets: List[str] = []
    if provider == "google":
        for match in re.finditer(r'<a[^>]+href="(/url\?q=|https?://)[^"\']+"[^>]*>(.*?)</a>', html, flags=re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', ' ', match.group(2))
            text = html_unescape(clean_text(text))
            if text:
                snippets.append(text)
    elif provider == "bing":
        for match in re.finditer(r'<li[^>]*class="b_algo"[^>]*>(.*?)</li>', html, flags=re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', ' ', match.group(1))
            text = html_unescape(clean_text(text))
            if text:
                snippets.append(text)
    elif provider == "duckduckgo":
        for match in re.finditer(r'<a[^>]*class="result-link"[^>]*>(.*?)</a>', html, flags=re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', ' ', match.group(1))
            text = html_unescape(clean_text(text))
            if text:
                snippets.append(text)
    elif provider == "brave":
        for match in re.finditer(r'<a[^>]*class="result-header"[^>]*>(.*?)</a>', html, flags=re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', ' ', match.group(1))
            text = html_unescape(clean_text(text))
            if text:
                snippets.append(text)
    if not snippets:
        snippets = extract_anchor_texts(html)
    return [s for s in snippets if len(s) > 25][:20]


def estimate_query_strength(query: str, results: List[str]) -> int:
    score = 1
    if any(word in query.lower() for word in ["hotel", "restaurante", "tour", "valle", "cocora", "salento"]):
        score += 2
    if len(results) >= 8:
        score += 2
    if len(results) >= 15:
        score += 3
    return score


def aggregate_keywords(results: List[str]) -> List[Tuple[str, int]]:
    counter = Counter()
    for text in results:
        tokens = re.findall(r"[A-Za-zÁÉÍÓÚáéíóúÑñ]{4,}", text, flags=re.UNICODE)
        for token in tokens:
            lowered = token.lower()
            if lowered in {"salento", "colombia", "quindio", "cocora", "hotel", "restaurante", "turismo", "tour", "cafe", "café"}:
                counter[lowered] += 2
            elif lowered not in {"para", "desde", "como", "donde", "porque", "todos", "sobre", "junto", "mejor", "cerca", "puede", "viene"}:
                counter[lowered] += 1
    return counter.most_common(12)


def build_summary(query: str, provider_results: Dict[str, List[str]]) -> Dict[str, Any]:
    all_results = []
    for provider, results in provider_results.items():
        all_results.extend(results)
    related = aggregate_keywords(all_results)
    summary = {
        "query": query,
        "intent": detect_intent(query),
        "strength": estimate_query_strength(query, all_results),
        "search_engine_coverage": {provider: len(results) for provider, results in provider_results.items()},
        "top_related_terms": [{"term": term, "count": count} for term, count in related],
        "sample_results": all_results[:6],
    }
    return summary


def run_scan(queries: Iterable[str], providers: Iterable[str], limit: int = 8, delay: float = 0.5) -> Dict[str, Any]:
    provider_list = list(providers)
    summaries = []
    for query in queries:
        q_clean = normalize_query(query)
        provider_results: Dict[str, List[str]] = {}
        for provider in provider_list:
            url = PROVIDERS[provider].format(q=urllib.parse.quote_plus(q_clean), limit=limit)
            try:
                html = fetch_url(url)
                results = parse_search_results(html, provider)
                provider_results[provider] = results[:limit]
            except Exception as exc:
                provider_results[provider] = []
                print(f"[WARN] {provider} | {q_clean} | {exc}", file=sys.stderr)
            time.sleep(delay)
        summaries.append(build_summary(q_clean, provider_results))

    by_intent = Counter(item["intent"] for item in summaries)
    top_queries = [item["query"] for item in sorted(summaries, key=lambda x: x["strength"], reverse=True)[:15]]
    return {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "providers": provider_list,
        "seed_queries": list(queries),
        "intent_distribution": dict(by_intent),
        "top_queries_by_strength": top_queries,
        "summaries": summaries,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Search intent scanner for Salento tourism")
    parser.add_argument("--providers", nargs="+", default=["google", "bing", "duckduckgo", "brave"], help="Search engines to scan")
    parser.add_argument("--queries", nargs="*", default=SEED_QUERIES, help="Specific query list to analyze")
    parser.add_argument("--limit", type=int, default=8, help="Number of result snippets per provider")
    parser.add_argument("--delay", type=float, default=0.6, help="Delay between requests in seconds")
    parser.add_argument("--output", type=str, default="tools/salento_search_scan.json", help="Path to JSON output file")
    args = parser.parse_args()

    unknown = [p for p in args.providers if p not in PROVIDERS]
    if unknown:
        raise SystemExit(f"Unsupported providers: {unknown}. Available: {sorted(PROVIDERS)}")

    report = run_scan(args.queries, args.providers, limit=args.limit, delay=args.delay)

    out_path = ROOT / args.output
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(json.dumps({
        "providers": args.providers,
        "queries_analyzed": len(args.queries),
        "intent_distribution": report["intent_distribution"],
        "top_queries_by_strength": report["top_queries_by_strength"][:10],
        "output_file": str(out_path.relative_to(ROOT)),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
