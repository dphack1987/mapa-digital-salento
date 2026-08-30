# Mapa Digital Salento

Ecosistema turístico, comercial y gastronómico de Salento, Quindío. El proyecto conecta un mapa impreso de bolsillo con un gemelo digital para explorar el pueblo, descubrir negocios locales y realizar pedidos desde el hospedaje.

## 🌟 Fase 2 Completada - Experiencia Usuario Mejorada

**Estado actual:** Versión 1.1.0 con funcionalidades avanzadas de multi-idioma, offline y sincronización inteligente.

## Resumen ejecutivo

El producto replica la arquitectura probada del mapa interactivo de Armenia y la amplía con un módulo de domicilios y pedidos directos para turistas hospedados en hoteles. La experiencia funciona sin descargas pesadas y sirve tanto al visitante que planea su recorrido como al turista que ya está en Salento.

### Novedades Fase 2:
- ✅ **Traducción dinámica en 6 idiomas** con detección automática
- ✅ **Sistema offline robusto** con IndexedDB para datos persistentes
- ✅ **Cola de pedidos offline** con sincronización automática
- ✅ **Don Chucho mejorado** con base de conocimiento local
- ✅ **Conversor de moneda en tiempo real** (COP/USD/EUR)
- ✅ **Service Worker optimizado** con estrategias de caché inteligentes
- ✅ **Segundo pautante:** Finca Hotel El Ocaso integrado

## Objetivos

- Fusionar el mapa impreso y el mapa digital mediante códigos QR dinámicos.
- Promover restaurantes, cafés, tiendas de artesanías, hoteles y operadores turísticos locales.
- Permitir pedidos de comida, café, souvenirs y servicios directamente desde el hospedaje.
- Ofrecer asistencia para orientarse, descubrir rutas y elegir actividades.
- Crear un canal digital medible para los comercios aliados.

## Arquitectura técnica

- **Frontend:** React + TypeScript + Vite.
- **Mapa:** Leaflet y OpenStreetMap, con posibilidad de incorporar capas vectoriales personalizadas.
- **Experiencia:** responsive, mobile-first y PWA completa.
- **Datos:** JSON estructurados + IndexedDB para offline + caché inteligente.
- **Servicios:** 6 servicios modulares para datos, traducción, offline, pedidos, conocimiento local y moneda.
- **Integración comercial:** WhatsApp Business como canal de validación inicial.

## Pautantes Integrados

### 1. Hotel Camino Nacional ✅ Verificado
- Hotel 2 estrellas en el centro de Salento
- Datos completos con 11 fotos y servicios detallados
- Contacto: WhatsApp, teléfono, email confirmados

### 2. Finca Hotel El Ocaso 🆕 Nuevo
- Finca hotel rural con experiencia cafetera
- Estructura completa creada, pendiente validación comercial
- Ubicación rural con vistas panorámicas

## Estado actual del Proyecto

- ✅ Interfaz visual de Salento con logo local
- ✅ Búsqueda y filtros de lugares
- ✅ Tarjetas de comercios y experiencias
- ✅ Mapa Leaflet con ubicaciones y popups
- ✅ Controles de zoom y geolocalización
- ✅ Carrito de pedido con modo offline
- ✅ Formulario de hospedaje con sincronización
- ✅ Traducción automática en 6 idiomas
- ✅ Don Chucho con base de conocimiento local
- ✅ Conversor de moneda en tiempo real
- ✅ Sistema offline completo con IndexedDB

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación se ejecuta en `http://localhost:5173/`.

Para producción:

```bash
npm run build
```

## Documentación

- **Informe completo:** Ver `INFORME_PROYECTO_SALENTO.md` para análisis detallado
- **Arquitectura:** Estructura modular en `src/services/`
- **Pautantes:** Documentación en `pautas/`
