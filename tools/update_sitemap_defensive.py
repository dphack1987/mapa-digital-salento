#!/usr/bin/env python3
"""Update sitemap.xml with all defensive SEO pages."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SITEMAP_PATH = PUBLIC / "sitemap.xml"
ORIGIN = "https://salentoalamano.com"

# All defensive SEO pages that should be in sitemap
DEFENSIVE_SEO_PAGES = [
    "estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100",
    "salento-abierto-hoy-turismo-seguro-valle-cocora-accesible",
    "paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos",
    "hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas",
    "rumor-cierre-salento-falso-desmentido-oficialmente",
    "valle-cocora-cerrado-falso-acceso-confirmado-operativo",
    "faq-salento-preguntas-frecuentes-turistas-informacion-oficial",
    "restaurantes-salento-abiertos-servicio-gastronomico-operativo",
    "transporte-salento-jeeps-willys-operativos-servicio-normal",
    "estado-vias-salento-hoy",
    "hoteles-hostales-abiertos-salento",
    "valle-cocora-operativo-seguro",
    "turismo-salento-seguro-hoy",
]

def main():
    # Read existing sitemap
    content = SITEMAP_PATH.read_text(encoding="utf-8")
    
    # Check which pages are already in sitemap
    existing = set()
    for line in content.split('\n'):
        if '<loc>' in line and ORIGIN in line:
            url = line.split('<loc>')[1].split('</loc>')[0]
            slug = url.replace(ORIGIN + '/', '').rstrip('/')
            existing.add(slug)
    
    # Add missing defensive SEO pages
    new_entries = []
    for slug in DEFENSIVE_SEO_PAGES:
        if slug not in existing:
            new_entries.append(f'''  <url>
    <loc>{ORIGIN}/{slug}</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>''')
    
    if new_entries:
        # Insert before </urlset>
        entries_str = '\n'.join(new_entries)
        content = content.replace('</urlset>', f'{entries_str}\n</urlset>')
        SITEMAP_PATH.write_text(content, encoding="utf-8")
        print(f"Sitemap actualizado: {len(new_entries)} páginas defensivas añadidas")
    else:
        print("Todas las páginas defensivas ya están en el sitemap")

if __name__ == "__main__":
    main()