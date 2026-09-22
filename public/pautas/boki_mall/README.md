# Boki Mall — assets por marca

Fuente de verdad:
- Web oficial: https://bokimall.com/
- Documento de marcas: /BOKI_MALL_MARCAS.md
- Datos: public/data/places.json (ids 13, 28, 29, 30) con `parentBrand: "Boki Mall"`

## Estructura

```
boki_mall/
  README.md
  boki_mall.md                 # ficha madre del complejo
  boki_mall_logo.webp          # logo raíz Boki Mall
  logo boki.webp
  hotel-mirador-boquia/        # Marca 1 — Hotel
  restaurante-terra/           # Marca 2 — Restaurante Terra
  barcinales-cafe-bar/         # Marca 3 — Barcinales Café-Bar
  eventos/                     # Marca 4 — Salón de eventos
  boki-travel/                 # Operador logístico (sin place propio aún)
```

Cada subcarpeta contiene el logo de la marca y, cuando existan, fotos dedicadas.
Las fotos compartidas del complejo viven en `hotel-mirador-boquia/` y pueden
referenciarse desde otras marcas solo si no hay asset propio.

## Páginas pautantes

- /paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/
- /paginas-pautantes/boki-mall-restaurante-terra/
- /paginas-pautantes/boki-mall-barcinales-cafe-bar/
- /paginas-pautantes/boki-mall-eventos/
