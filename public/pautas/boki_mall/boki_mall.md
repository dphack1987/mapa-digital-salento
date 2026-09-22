# Boki Mall - Mall de experiencias (marca padre)

## Estado
- Estado actual: información verificada desde sitio oficial (bokimall.com)
- Prioridad: alta
- Verificación: completamente verificada
- Fuente de verdad complementaria: `/BOKI_MALL_MARCAS.md`

## Estructura de assets (subcarpetas por marca)

```
/pautas/boki_mall/
  README.md
  boki_mall.md                 # este archivo (marca padre)
  boki_mall_logo.webp          # logo raíz
  hotel-mirador-boquia/        # Marca 1 — Hotel
  restaurante-terra/           # Marca 2 — Restaurante Terra
  barcinales-cafe-bar/         # Marca 3 — Barcinales Café-Bar
  eventos/                     # Marca 4 — Salón de eventos
  boki-travel/                 # Operador logístico (sin place propio aún)
```

## Información confirmada (marca padre)
- Nombre comercial: Boki Mall — mall de experiencias
- Sitio web oficial: https://bokimall.com/
- Teléfono: +57 311 222 5312
- WhatsApp: https://wa.me/573112225312
- Email: reservas@bokimall.com
- Dirección: Km 5 Vía principal a Salento, Vereda Boquía, 400 metros después del puente de Boquía
- Registro Nacional de Turismo: #91079
- Ubicación: 5 minutos de Salento, 15 minutos del Valle del Cocora
- Río Quindío a 500 metros de distancia

## 4 marcas del complejo

### 1. Hotel El Mirador de Boquía (place id 13)
- Página: /paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/
- Assets: /pautas/boki_mall/hotel-mirador-boquia/
- 9 habitaciones, check-in 15:00, check-out 12:00, pet friendly

### 2. Restaurante Terra (place id 28)
- Página: /paginas-pautantes/boki-mall-restaurante-terra/
- Assets: /pautas/boki_mall/restaurante-terra/
- Horario: 7:00 AM - 9:00 PM, cocina de autor

### 3. Barcinales Café - Bar (place id 29)
- Página: /paginas-pautantes/boki-mall-barcinales-cafe-bar/
- Assets: /pautas/boki_mall/barcinales-cafe-bar/
- Café de especialidad y cócteles

### 4. Eventos / Salón de eventos (place id 30)
- Página: /paginas-pautantes/boki-mall-eventos/
- Assets: /pautas/boki_mall/eventos/
- Bodas, corporativos, celebraciones; con cita previa

### Boki Travel (operador logístico, sin place propio)
- Tours, senderismo, traslados (se coordina desde recepción del hotel)

## Integración en el producto
- `places.json`: `parentBrand: "Boki Mall"`, `brandSlug`, `siblingBrands` en ids 13/28/29/30
- Home (`PlaceCard` / banda pautantes): badge `parentBrand`
- Páginas pautantes: sección `#familia-boki` “También en Boki Mall” con enlaces cruzados
- Contacto unificado en todas las marcas
