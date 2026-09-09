#!/usr/bin/env python3
"""Unifica gemelo camping sin-de hacia mapa custom con-de + actionTarget. No borra: el legacy está en tools/backup."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"
TARGET = "/paginas-pautantes/camping-cascadas-de-santa-rita/"

stub = f"""<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Camping Cascadas de Santa Rita en Salento. Ver mapa offline interactivo con fotos, precios y contacto directo." />
    <title>Camping Cascadas de Santa Rita | Salento a la Mano</title>
    <link rel="canonical" href="https://salentoalamano.com{TARGET}" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url={TARGET}" />
    <script>window.location.replace("{TARGET}");</script>
    <link rel="stylesheet" href="/page-theme.css" />
  </head>
  <body>
    <div class="container" style="max-width:1184px;margin:0 auto;padding:28px 20px 80px">
      <header class="topbar"><a class="brand" href="/"><img src="/logo_salento2026.png" alt="Salento a la Mano" class="brand-logo" style="width:64px;height:64px;object-fit:contain;border-radius:50%" /><span>Salento a la Mano</span></a><nav class="top-actions"><a class="button" href="/">Inicio</a><a class="button dark" href="/">Volver al inicio</a></nav></header>
      <main>
        <section class="hero-copy">
          <div class="eyebrow">Página unificada</div>
          <h1>Camping Cascadas de Santa Rita</h1>
          <p>Esta página ahora vive en el mapa offline interactivo con toda la información, fotos, precios y contacto directo.</p>
          <div class="actions">
            <a class="button primary" href="{TARGET}">Ir al mapa offline</a>
            <a class="button dark" href="/">Volver al inicio</a>
            <a class="button" href="/categorias/camping.html">Ver camping</a>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
"""

(PUB / "paginas-pautantes/camping-cascadas-santa-rita/index.html").write_text(stub, encoding="utf-8")

pp = PUB / "data/places.json"
data = json.loads(pp.read_text(encoding="utf-8"))
for p in data["places"]:
    if p["id"] == 31:
        p["actionTarget"] = {"viewUrl": "https://salentoalamano.com" + TARGET}
pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Gemelo unificado + actionTarget ID31 -> con-de")
