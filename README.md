# Mapa Digital Salento

Ecosistema turístico, comercial y gastronómico de Salento, Quindío. El proyecto conecta un mapa impreso de bolsillo con un gemelo digital para explorar el pueblo, descubrir negocios locales y realizar pedidos desde el hospedaje.

## Resumen ejecutivo

El producto replica la arquitectura probada del mapa interactivo de Armenia y la amplía con un módulo de domicilios y pedidos directos para turistas hospedados en hoteles. La experiencia debe funcionar sin descargas pesadas y servir tanto al visitante que planea su recorrido como al turista que ya está en Salento.

## Objetivos

- Fusionar el mapa impreso y el mapa digital mediante códigos QR dinámicos.
- Promover restaurantes, cafés, tiendas de artesanías, hoteles y operadores turísticos locales.
- Permitir pedidos de comida, café, souvenirs y servicios directamente desde el hospedaje.
- Ofrecer asistencia para orientarse, descubrir rutas y elegir actividades.
- Crear un canal digital medible para los comercios aliados.

## Arquitectura de producto

## Principios de referencia

### De las OTAs y apps de delivery

- Pedidos rápidos, catálogos claros y entrega directa al hospedaje.
- Pasarela comercial adaptada al tamaño y operación real de Salento.

### De los mapas interactivos

- Leaflet ligero, geolocalización y filtros por intención de viaje.
- Presentación visual para descubrir lugares rápidamente.

### Diferencial local

- Interfaz bilingüe contextual y conversión COP, USD y EUR.
- Información local disponible sin conexión en el Valle de Cocora.
- Pedidos pendientes para sincronizar al recuperar señal.
- Economía local con relación directa entre turista y negocio.

La regla de producto es tomar la comodidad de una plataforma grande, mantener la ligereza de un mapa web y proteger la relación económica y cultural de los negocios locales.

### Explora Salento

- Mapa interactivo centrado en el casco urbano.
- Calle Real, Plaza Principal, miradores y accesos al Valle de Cocora.
- Categorías turístico, comercial y gastronómico.
- Buscador en tiempo real.
- Fichas de lugares y pautas publicitarias.
- Ubicación del visitante.
- Rutas a pie y recomendaciones según el tiempo disponible.
- Enlace para compartir y QR hacia el mapa digital.

### Pasa-Pedidos Hotelero

- Selección rápida del hotel aliado y número de habitación.
- Catálogo digital por comercio.
- Productos con precio, descripción y disponibilidad.
- Carrito de compra y cálculo de domicilio.
- Entrega en recepción, habitación o punto acordado.
- Confirmación del pedido y seguimiento de estado.
- Pago al recibir en la primera etapa.

#### Envío híbrido

1. **Opción directa:** generar un pedido formateado y enviarlo por WhatsApp Business al comercio aliado.
2. **Opción backend:** registrar el pedido en Supabase o Firebase para que el comercio lo consulte desde un panel de control.

## Arquitectura técnica

- **Frontend:** React + TypeScript + Vite.
- **Mapa:** Leaflet y OpenStreetMap, con posibilidad de incorporar capas vectoriales personalizadas.
- **Experiencia:** responsive, mobile-first y preparada para convertirse en PWA.
- **Datos iniciales:** catálogo local tipado en el frontend para prototipado.
- **Backend siguiente:** Supabase o Firebase para comercios, productos, hoteles, pedidos y estados.
- **Integración comercial:** WhatsApp Business como canal de validación inicial.

## Estado actual del MVP

- Interfaz visual de Salento con logo local.
- Búsqueda y filtros de lugares.
- Tarjetas de comercios y experiencias.
- Mapa Leaflet con ubicaciones de demostración y popups.
- Controles de zoom y solicitud de ubicación del navegador.
- Carrito de pedido.
- Formulario de hospedaje, habitación, celular e indicaciones.
- Confirmación visual del pedido.

Los datos actuales son demostrativos. Antes de publicar se deben validar nombres, coordenadas, horarios, menús, precios, teléfonos, disponibilidad y condiciones de domicilio de cada aliado.

## Fases siguientes

### Fase 1: validación comercial

- Registrar hoteles aliados y comercios participantes.
- Levantar fichas, menús, precios, fotografías y coordenadas.
- Definir tarifa, cobertura y horarios de domicilio.
- Probar pedidos directos con WhatsApp Business.

### Fase 2: operación digital

- Crear base de datos de comercios, productos, hoteles y pedidos.
- Construir panel para actualizar catálogo y cambiar estados.
- Implementar selección de hotel y habitación.
- Añadir notificaciones y trazabilidad del pedido.

### Fase 3: gemelo digital y PWA

- Generar QR dinámicos para el mapa impreso y las pautas publicitarias.
- Instalar la aplicación como PWA.
- Añadir funcionamiento parcial sin conexión.
- Incorporar analítica de visitas, clics, rutas y pedidos.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación se ejecuta normalmente en `http://localhost:5173/`.

Para validar producción:

```bash
npm run build
```
