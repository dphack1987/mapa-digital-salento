#!/usr/bin/env python3
"""Create indexable static companions for the strategic sitemap routes."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://salentoalamano.com"

PAGES = {
    "don-chucho-asistente": {
        "title": "Don Chucho: asistente turístico de Salento | Salento a la Mano",
        "description": "Consulta información turística de Salento, Quindío con Don Chucho y descubre lugares, rutas, servicios y recomendaciones locales.",
        "heading": "Don Chucho, tu asistente turístico de Salento",
        "body": "Encuentra orientación sobre alojamientos, gastronomía, experiencias, rutas y servicios locales. La información debe confirmarse con cada prestador antes de viajar.",
    },
    "estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100": {
        "title": "Estado actual de Salento: información turística verificada",
        "description": "Consulta el estado actual de Salento, Quindío: alojamientos, vías, Valle de Cocora y servicios turísticos con información local verificable.",
        "heading": "Estado actual de Salento",
        "body": "Esta página reúne información de referencia para planear una visita a Salento. Consulta cada servicio y las autoridades locales antes de desplazarte, porque horarios, vías y disponibilidad pueden cambiar.",
    },
    "hoteles-abiertos-salento": {
        "title": "Hoteles abiertos en Salento: alojamientos y contacto directo",
        "description": "Explora hoteles, hostales y fincas hoteleras de Salento, Quindío con información de ubicación, servicios y contacto directo.",
        "heading": "Hoteles y alojamientos en Salento",
        "body": "Compara opciones de alojamiento en Salento y contacta directamente con cada establecimiento para confirmar disponibilidad, tarifas, horarios y condiciones de reserva.",
    },
    "landing-estado-actual-salento-2026": {
        "title": "Salento 2026: guía de estado actual y planificación turística",
        "description": "Guía actualizada para planear un viaje a Salento en 2026: alojamientos, gastronomía, Valle de Cocora, rutas y servicios locales.",
        "heading": "Guía de Salento 2026",
        "body": "Usa esta guía como punto de partida para organizar tu visita. Revisa información reciente de transporte, clima, reservas y operadores antes de confirmar un plan.",
    },
    "mapa-interactivo-salento": {
        "title": "Mapa interactivo de Salento, Quindío | Salento a la Mano",
        "description": "Consulta el mapa turístico interactivo de Salento para ubicar alojamientos, restaurantes, cafés, experiencias, transporte y servicios locales.",
        "heading": "Mapa interactivo de Salento",
        "body": "Explora lugares y servicios del directorio turístico de Salento. Abre cada ficha para consultar ubicación, contacto y detalles publicados por el negocio.",
    },
    "registro-aliados": {
        "title": "Registro de aliados turísticos de Salento | Salento a la Mano",
        "description": "Registra tu negocio turístico de Salento a la Mano y comparte información clara de contacto, ubicación, servicios y atención al visitante.",
        "heading": "Registro de aliados locales",
        "body": "Los negocios de Salento pueden solicitar su inclusión en el directorio con información verificable de contacto, ubicación y servicios. La publicación queda sujeta a revisión.",
    },
    "salento-seguro-turismo": {
        "title": "Turismo en Salento: recomendaciones y planificación segura",
        "description": "Encuentra recomendaciones prácticas para visitar Salento, Quindío: movilidad, clima, reservas, rutas y servicios turísticos locales.",
        "heading": "Turismo responsable en Salento",
        "body": "Planifica con información actualizada, respeta las normas ambientales y confirma las condiciones de cada ruta o servicio con fuentes locales antes de salir.",
    },
    "valle-cocora-accesible-100": {
        "title": "Valle de Cocora: acceso, rutas y planificación de visita",
        "description": "Planifica tu visita al Valle de Cocora desde Salento con información sobre acceso, transporte, rutas, clima y operadores locales.",
        "heading": "Visitar el Valle de Cocora",
        "body": "Consulta rutas, transporte y recomendaciones antes de visitar el Valle de Cocora. El acceso y las condiciones del sendero pueden variar según el clima y las autoridades.",
    },
    "vias-salento-libres-acceso": {
        "title": "Vías de acceso a Salento: consulta antes de viajar",
        "description": "Consulta recomendaciones para llegar a Salento, Quindío y verifica el estado de las vías, transporte y rutas antes de iniciar el viaje.",
        "heading": "Cómo llegar a Salento",
        "body": "Revisa el estado de las vías y las condiciones de transporte con fuentes oficiales antes de viajar. Esta guía orienta la planificación, pero no sustituye los reportes en tiempo real.",
    },
}


def page_html(slug: str, page: dict[str, str]) -> str:
    url = f"{ORIGIN}/{slug}"
    payload = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page["title"],
        "description": page["description"],
        "url": url,
        "inLanguage": "es-CO",
        "isPartOf": {"@type": "WebSite", "name": "Salento a la Mano", "url": f"{ORIGIN}/"},
    }
    related = "".join(
        f'<li><a href="/{related_slug}">{html.escape(related_page["heading"])}</a></li>'
        for related_slug, related_page in PAGES.items()
        if related_slug != slug
    )
    return f'''<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(page["title"])}</title>
    <meta name="description" content="{html.escape(page["description"], quote=True)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="{url}">
    <link rel="stylesheet" href="/page-theme.css">
    <script type="application/ld+json">{json.dumps(payload, ensure_ascii=False)}</script>
  </head>
  <body>
    <main style="max-width:900px;margin:0 auto;padding:48px 20px 80px">
      <p><a href="/">Salento a la Mano</a></p>
      <h1>{html.escape(page["heading"])}</h1>
      <p>{html.escape(page["body"])}</p>
      <nav aria-label="Enlaces relacionados">
        <a href="/categorias/">Explorar categorías</a> |
        <a href="/es/">Guía turística</a> |
        <a href="/mapa-interactivo-salento">Mapa interactivo</a>
      </nav>
            <section>
                <h2>También puede interesarte</h2>
                <ul>{related}</ul>
            </section>
    </main>
  </body>
</html>
'''


def main() -> None:
    for slug, page in PAGES.items():
        (PUBLIC / f"{slug}.html").write_text(page_html(slug, page), encoding="utf-8")
    print(f"Rutas estáticas generadas: {len(PAGES)}")


if __name__ == "__main__":
    main()