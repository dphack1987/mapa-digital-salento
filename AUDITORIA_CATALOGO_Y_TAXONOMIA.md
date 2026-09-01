# Auditoría de catálogo y taxonomía - Salento

## Objetivo
Establecer una base editorial clara antes de seguir agregando contenido, imágenes o automatizaciones.

## Evidencia actual del proyecto
- `public/data/places.json`: 22 entradas
- `public/data/hotels.json`: 5 entradas
- `public/data/mapMarkers.json`: 16 marcadores

La estructura de archivos confirma que la app sigue un patrón de datos centralizados y mapa basado en JSON.

## Taxonomía recomendada

### 1. Alojamiento
- hotel
- finca/cabaña
- hostal
- apartamento turístico

### 2. Gastronomía
- restaurante
- cafetería
- bar
- panadería / punto de comida

### 3. Experiencia
- tour
- visita guiada
- experiencia cultural
- café especial
- aventura

### 4. Atractivo natural
- mirador
- sendero
- reserva natural
- paisaje icónico
- sitio turístico

### 5. Servicio local
- transporte
- renta de equipo
- apoyo turístico
- servicio logistico

### 6. Comercio
- tienda local
- artesanía
- souvenir
- comercio especializado

## Estado de verificación
Cada entrada debe quedar etiquetada como:
- Verificado
- Validado parcialmente
- Sugerido
- No recomendado

## Fichas mínimas requeridas por negocio
Cada entidad debe tener:
- nombre
- categoría
- descripción breve real
- ubicación
- horario
- contacto / WhatsApp
- servicios principales
- estado de verificación
- fotos reales

## Criterio de aceptacion para contenido
No se incorpora una entrada si:
- no tiene categoría clara
- no tiene propósito turístico claro
- tiene texto genérico o promocional sin base
- no se entiende si es negocio, experiencia o SEO
- se repite en otra categoría o lista

## Orden de limpieza

### Fase 1: catálogo principal
- revisar cada entrada en `public/data/places.json`
- clasificar por categoría
- marcar estado de verificación
- quitar duplicados o ambigüedades

### Fase 2: hoteles
- revisar `public/data/hotels.json`
- confirmar categoría y tipo de alojamiento
- separar alojamientos reales de contenido comercial

### Fase 3: mapa
- revisar `public/data/mapMarkers.json`
- verificar concordancia con cada lugar y hotel
- corregir latitud/longitud si no coincide

### Fase 4: contenido enriquecido
- preparar texto real por negocio
- preparar fotos reales
- crear carpetas por establecimiento
- dejar el contenido listo para ser integrado

## Prioridad de ejecución
1. limpieza de contenido base
2. revisión de categorías
3. verificación de marcadores
4. validación de hoteles
5. enriquecer contenido con texto y fotos reales
6. luego continuar con mejoras en UX y SEO

## Resultado esperado
Un catálogo coherente, verificable y útil para turistas, con una diferencia clara entre:
- contenido oficial
- contenido comercial
- contenido promocional
- contenido de experiencia local

## Siguiente acción inmediata
Empezar por revisar las entradas de `public/data/places.json` y clasificar cada una en esta taxonomía, marcando su estado antes de agregar más contenido o fotos.
