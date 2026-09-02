# INFORME COMERCIAL PARA EMPRESARIOS
## Salento a la Mano

**Plataforma digital turística y comercial de Salento, Quindío**  
**Fecha:** 2 de septiembre de 2026  
**Versión de referencia:** 0.1.0  
**Estado:** MVP funcional en validación comercial

---

## 1. Propósito del informe

Este documento presenta a hoteles, restaurantes, cafés, comercios, operadores y prestadores de servicios qué es **Salento a la Mano**, cómo funciona, qué oportunidades ofrece para un negocio local y cuáles son los pasos para vincularse.

El objetivo es que cada empresario pueda evaluar la plataforma con información clara sobre:

- La propuesta de valor.
- Las funciones disponibles actualmente.
- La forma de mostrar y contactar cada negocio.
- Los planes comerciales propuestos.
- Las responsabilidades del empresario y de la plataforma.
- Las funciones que requieren una siguiente fase técnica.

Las cifras de ventas, tráfico y retorno incluidas en este informe son **escenarios de referencia**, no resultados garantizados. Los resultados reales dependerán de la calidad de la información, las fotografías, la disponibilidad, la atención al cliente, la temporada y la promoción de la plataforma.

---

## 2. Resumen ejecutivo

**Salento a la Mano** es un directorio turístico digital con mapa, fichas comerciales, contacto directo y herramientas de orientación para visitantes. Conecta a los turistas con negocios locales sin obligarlos a pasar por un intermediario para llamar, escribir por WhatsApp o consultar una ubicación.

La plataforma está diseñada para resolver problemas frecuentes del turismo local:

- El visitante no sabe dónde encontrar negocios confiables.
- La información de horarios, ubicación y servicios está dispersa.
- Muchos negocios dependen exclusivamente del tráfico espontáneo.
- Los turistas internacionales necesitan información en otros idiomas y monedas.
- En zonas rurales la conexión puede ser limitada.
- Los empresarios necesitan visibilidad y contacto directo, no solo aparecer en una lista.

La oportunidad para el empresario es contar con una presencia digital organizada dentro de una guía especializada en Salento, con una ficha que puede incluir descripción, categoría, horarios, ubicación, fotografías, teléfono, correo, WhatsApp, servicios y enlaces de reserva o contacto.

---

## 3. Qué existe actualmente

La plataforma tiene una aplicación web funcional y páginas públicas generadas para el catálogo comercial.

### Inventario verificado durante la revisión

- **22 pautantes** cargados en la fuente de datos principal.
- **7 categorías comerciales:** Alojamientos, Restaurantes, Cafés, Artesanías, Tiendas, Experiencias y Servicios.
- **7 páginas de categorías** generadas.
- **22 fichas públicas de pautantes** generadas.
- Mapa interactivo con ubicaciones.
- Contacto directo por WhatsApp, teléfono y correo cuando el dato está disponible.
- Página individual para cada negocio.
- Datos locales en JSON como fuente operativa del catálogo.
- Modo offline basado en caché e IndexedDB para información crítica.
- Franja de mercados internacionales con ciclo continuo de banderas.

### Validación técnica realizada

- TypeScript: correcto.
- Build de producción: correcto.
- Herramientas Python y Node: sintaxis correcta.
- Generador de categorías y fichas: correcto.
- Auditoría de marca: sin dominios antiguos detectados en la revisión.
- Rutas públicas principales: respuesta HTTP 200.
- Mapa, centro de soporte, carrito, navegación de alojamientos y fichas: probados en el preview.

La plataforma está lista para demostración y vinculación inicial de empresarios. La operación comercial a gran escala requiere completar procesos, contenidos y servicios descritos en la sección de fases.

---

## 4. Propuesta de valor para el empresario

### Más visibilidad antes de la llegada

El turista puede descubrir el negocio mientras planea su visita, no únicamente cuando ya está caminando por la Calle Real.

### Contacto directo

La ficha puede dirigir al visitante al WhatsApp, teléfono, correo, sitio web o ubicación del propio negocio. El empresario conserva la conversación y define sus condiciones comerciales.

### Información organizada

El negocio se presenta en una ficha con categoría, descripción, servicios, horario, ubicación, fotografías, rango de precio y datos de contacto.

### Alcance nacional e internacional

La interfaz contempla español, inglés, francés, alemán, portugués e italiano, además de precios en COP, USD y EUR. La traducción de contenidos específicos debe revisarse y aprobarse con cada empresario para evitar errores comerciales.

### Descubrimiento por mapa y categorías

El visitante puede buscar por tipo de negocio, consultar categorías y ubicar establecimientos en el mapa de Salento.

### Presencia en el ecosistema turístico

La plataforma puede conectar alojamientos, restaurantes, cafés, experiencias, tiendas y servicios para favorecer recorridos y compras dentro de la economía local.

---

## 5. Cómo funciona para el visitante

1. Ingresa a la plataforma desde un celular o computador.
2. Consulta una categoría, utiliza la búsqueda o explora el mapa.
3. Revisa la ficha del negocio.
4. Consulta fotografías, descripción, horarios, servicios, precio orientativo y ubicación.
5. Contacta directamente al empresario por WhatsApp, teléfono, correo o sitio web.
6. Según el servicio, puede solicitar una reserva, pedir información o dirigirse al establecimiento.

La plataforma no sustituye la confirmación del negocio. Disponibilidad, tarifa final, condiciones de reserva y tiempos de entrega deben ser confirmados directamente por el empresario.

---

## 6. Funciones disponibles para los negocios

### Ficha comercial

Cada ficha puede incluir:

- Nombre comercial.
- Categoría y etiquetas.
- Descripción del negocio.
- Horarios.
- Rango de precios.
- Teléfono y WhatsApp.
- Correo y sitio web.
- Dirección y referencia.
- Ubicación en el mapa.
- Fotografías.
- Servicios, productos o actividades.
- Información especial para hoteles, restaurantes o experiencias.
- Estado de verificación cuando corresponda.

### Página pública individual

Cada pautante puede tener una página pública indexable con su información comercial y botones de contacto. Esto facilita compartir el negocio mediante enlaces, redes sociales, códigos QR o material impreso.

### Mapa interactivo

El mapa permite ubicar lugares y consultar información básica. La precisión depende de que el empresario entregue dirección, coordenadas y referencias actualizadas.

### Contacto por WhatsApp

Cuando se registra un número válido, la ficha puede abrir una conversación directa con el negocio. El empresario debe mantener activo el número y responder las solicitudes recibidas.

### QR para hoteles y puntos físicos

El sistema contempla códigos QR para hoteles y establecimientos. En la fase actual se puede generar y compartir información QR; el seguimiento avanzado de conversiones y comisiones requiere formalizar el modelo operativo y el backend.

### Asistente Don Chucho

El asistente responde preguntas generales sobre Salento y puede orientar hacia categorías o negocios registrados. Sus recomendaciones dependen de que la información del catálogo esté actualizada y aprobada.

### Clima, eventos y guía local

La plataforma muestra información de clima, eventos y orientación turística para ayudar al visitante a decidir qué hacer. Estas funciones sirven como contexto para que el turista encuentre negocios relacionados con su actividad.

### Modo offline

El navegador puede conservar datos críticos mediante caché e IndexedDB. El modo offline no significa que WhatsApp, mapas externos, pagos o llamadas funcionen sin conexión; esas acciones requieren conectividad.

### Idiomas y monedas

La interfaz contempla seis idiomas y tres monedas. Las tarifas mostradas son orientativas mientras el negocio no suministre precios estructurados y actualizados.

---

## 7. Beneficios por tipo de negocio

### Hoteles y hospedajes

- Ficha de alojamiento con servicios, horarios, referencias y contacto.
- Código QR para entregar a huéspedes.
- Recomendaciones de restaurantes, cafés y actividades cercanas.
- Oportunidad de generar reservas directas y servicios complementarios.
- Visibilidad para turistas que buscan hospedaje antes de viajar.

### Restaurantes y cafés

- Presentación de menú, especialidades, rango de precios y horarios.
- Contacto directo para reservas o pedidos.
- Visibilidad ante turistas alojados en hoteles aliados.
- Asociación con rutas gastronómicas, cafés y eventos.
- Posibilidad de mostrar productos para llevar o vender por WhatsApp.

### Artesanías y tiendas

- Catálogo visual de productos.
- Historia del producto y del productor.
- Contacto para compras, encargos o visitas.
- Integración con recorridos culturales y experiencias.
- Oportunidad de recibir pedidos antes de la llegada del turista.

### Experiencias, tours y operadores

- Descripción de actividad, duración, dificultad, punto de encuentro y requisitos.
- Información de contacto y reserva.
- Ubicación y relación con otras actividades de Salento.
- Mayor claridad para el turista sobre qué incluye y qué no incluye la experiencia.

### Transporte y servicios

- Ficha de servicio con cobertura, horarios y contacto.
- Visibilidad para turistas que necesitan movilización, alquiler o asistencia.
- Enlace directo para cotización y coordinación.

---

## 8. Planes comerciales propuestos

Los siguientes planes son una base para la conversación comercial y deben confirmarse en el acuerdo final con empresarios y aliados.

### Plan Básico: $50.000 a $80.000 COP mensuales

Incluye:

- Ficha comercial en el directorio.
- Categoría y ubicación en el mapa.
- Teléfono, WhatsApp o correo suministrado.
- Horarios y descripción básica.
- Hasta 5 fotografías entregadas por el negocio.
- Actualización periódica de información.
- Enlace para contacto directo.

### Plan Premium: $120.000 a $180.000 COP mensuales

Incluye lo anterior más:

- Mayor visibilidad dentro de la categoría.
- Perfil destacado según criterios definidos y disponibilidad del espacio.
- Sello de información verificada, sujeto a validación documental o comercial.
- Hasta 15 fotografías.
- Código QR personalizado.
- Reporte de visitas y clics cuando la medición esté habilitada.
- Prioridad en campañas y contenidos de la plataforma.

### Plan Pedidos y Reservas: $200.000 a $300.000 COP mensuales

Incluye lo anterior más:

- Catálogo de productos o servicios.
- Flujo de solicitud de pedidos o reservas.
- Integración con WhatsApp.
- Coordinación con hoteles aliados cuando aplique.
- Panel o reporte operativo según la fase técnica contratada.
- Comisión sobre pedidos únicamente si se pacta expresamente.

**Importante:** La publicación no garantiza una cantidad fija de clientes, reservas o ventas. La plataforma genera visibilidad y facilita el contacto; la conversión depende también de la oferta, precio, disponibilidad y atención del negocio.

---

## 9. Modelo de relación comercial

La relación debe ser transparente para todas las partes.

### El empresario decide

- Qué información publica.
- Qué productos o servicios ofrece.
- Sus tarifas y condiciones.
- Sus horarios y disponibilidad.
- Cómo atiende reservas, pedidos y reclamaciones.
- Qué canales de contacto utiliza.

### La plataforma aporta

- Organización del catálogo.
- Diseño y alojamiento de la ficha.
- Visibilidad dentro del ecosistema.
- Herramientas de búsqueda, mapa y contacto.
- Actualización técnica y mantenimiento.
- Promoción general de la plataforma.
- Soporte para la carga inicial de información.

### Responsabilidad sobre la información

El empresario debe aprobar la información publicada. La plataforma no debe mostrar como confirmado un precio, horario, dirección, premio, licencia o disponibilidad que no haya sido entregado o validado.

---

## 10. Métricas que deben medirse

Para evaluar el proyecto comercialmente se recomienda medir desde el inicio:

- Visitas a la portada.
- Visitas por categoría.
- Visitas a cada ficha.
- Clics en WhatsApp.
- Clics en teléfono, correo y sitio web.
- Solicitudes de reserva.
- Pedidos recibidos.
- Escaneos de QR.
- Negocios activos y negocios con información incompleta.
- Tiempo de respuesta del empresario.
- Conversiones confirmadas por cada aliado.

Durante el MVP, algunas métricas pueden ser locales o estimadas. Para reportes comerciales confiables será necesario consolidar analítica web y un backend de pedidos/reservas.

---

## 11. Proyecciones comerciales responsables

El proyecto puede generar valor por tres vías:

1. **Pauta mensual** de negocios participantes.
2. **Servicios adicionales** de fotografía, carga de catálogo, QR, contenido o posicionamiento.
3. **Comisión por pedidos o reservas**, únicamente cuando exista una operación verificable y un acuerdo explícito.

No se recomienda presentar como resultados actuales las cifras de tráfico, ventas o ROI que aparecen en documentos de planeación. Deben tratarse como metas o escenarios y reemplazarse progresivamente por datos reales del panel de analítica.

Una forma prudente de presentar el retorno es:

> Si una ficha genera una sola reserva o venta adicional cuyo margen supera el valor mensual de la pauta, el empresario ya puede recuperar la inversión. La medición debe hacerse con códigos, enlaces o preguntas de origen para identificar qué contactos provienen de la plataforma.

---

## 12. Qué debe entregar cada empresario

Para publicar una ficha completa se solicita:

- Nombre comercial exacto.
- Nombre legal, si aplica.
- Categoría del negocio.
- Descripción aprobada.
- Dirección exacta y referencia.
- Coordenadas o ubicación en mapa.
- Teléfono de atención.
- WhatsApp de reservas o pedidos.
- Correo y sitio web, si existen.
- Horarios reales y días de cierre.
- Servicios o productos principales.
- Rango de precios o tarifas.
- Políticas de reserva, cancelación y entrega.
- Entre 5 y 15 fotografías propias y autorizadas.
- Licencias, registros o documentos cuando se solicite el sello verificado.
- Persona responsable de actualizar la información.

### Revisión antes de publicar

Cada empresario debe revisar nombre, teléfono, dirección, precios, fotografías, horarios y enlaces antes de aprobar su ficha. Los cambios deben reportarse por el canal definido por la administración de la plataforma.

---

## 13. Estado actual y siguientes fases

### Disponible en el MVP

- Directorio y categorías.
- Fichas públicas de pautantes.
- Mapa interactivo.
- Contacto directo.
- Página de alojamiento y experiencias.
- Clima y eventos de referencia.
- Asistente local.
- Idiomas y monedas de interfaz.
- QR y almacenamiento offline inicial.
- Páginas SEO estáticas para categorías y pautantes.

### Siguiente fase recomendada

- Panel privado para cada empresario.
- Inicio de sesión y permisos por negocio.
- Edición de fichas sin intervención técnica.
- Analítica centralizada por ficha.
- Gestión real de pedidos y reservas.
- Estados de pedido y notificaciones.
- Integración formal con pagos, si se decide ofrecer pagos en línea.
- Política de tratamiento de datos, términos y condiciones comerciales.
- Proceso documentado de verificación.
- Sistema de soporte y tiempos de respuesta.
- Carga de fotografías propias para cada pautante.

### Funciones que no deben prometerse como completas todavía

- Panel empresarial con backend multiusuario.
- Pagos en línea.
- Disponibilidad hotelera en tiempo real.
- Comisiones automáticas para hoteles.
- Analytics avanzado de negocio.
- Garantía de posiciones fijas en buscadores.
- Funcionamiento offline de servicios externos como WhatsApp, Google Maps o pagos.

---

## 14. Preguntas frecuentes para empresarios

### ¿La plataforma reemplaza a Google Maps o a las redes sociales?

No. Funciona como una guía especializada de Salento que organiza la información turística y dirige al visitante hacia los canales del negocio.

### ¿El turista puede contactarme directamente?

Sí, cuando la ficha tiene WhatsApp, teléfono, correo o sitio web correctamente registrados.

### ¿La plataforma cobra comisión por cada contacto?

La pauta básica y premium se plantean como pagos mensuales. Cualquier comisión por pedidos o reservas debe quedar escrita en el plan contratado.

### ¿Puedo cambiar mis precios y horarios?

Sí. La información debe actualizarse por el canal operativo definido. Mientras exista un panel privado, la administración apoyará los cambios.

### ¿Qué ocurre si no tengo fotografías?

La ficha puede publicarse con información básica, pero se recomienda contar con fotografías propias. Las imágenes de respaldo no deben presentarse como fotografías reales del negocio.

### ¿Apareceré automáticamente en Google?

La plataforma crea páginas públicas preparadas para indexación, pero ningún buscador garantiza una posición o tiempo exacto de indexación.

### ¿Puedo retirarme?

Las condiciones de permanencia, renovación y retiro deben quedar definidas en el acuerdo comercial.

---

## 15. Mensaje de presentación para reuniones

> **Salento a la Mano conecta su negocio directamente con los turistas que buscan qué hacer, dónde hospedarse, dónde comer y qué comprar en Salento.**
>
> Su empresa obtiene una ficha organizada, ubicación en el mapa, presencia dentro de categorías turísticas y botones de contacto directo. La plataforma busca fortalecer la economía local, reducir la dispersión de información y ayudar a que el visitante tome decisiones con datos claros.
>
> El modelo comienza con una presencia digital sencilla y puede crecer hacia QR, catálogos, pedidos, reservas y métricas. El empresario mantiene el control de su oferta, sus precios y su relación con el cliente.

---

## 16. Datos de contacto y demostración

**Plataforma:** Salento a la Mano  
**Preview de demostración:** http://localhost:3000/  
**Categorías públicas:** `/categorias/`  
**Fichas públicas:** `/pautantes/`  
**Fuente de catálogo:** `public/data/places.json`

Antes de la entrega externa debe reemplazarse el correo, teléfono y dominio de demostración por los canales oficiales de atención comercial.

---

## Conclusión

Salento a la Mano ya cuenta con una base funcional para presentar y organizar la oferta turística local: catálogo, categorías, fichas, mapa, contacto directo, orientación al visitante y páginas públicas. Su valor comercial aumentará a medida que se incorporen empresarios con información completa, fotografías reales, disponibilidad actualizada y canales de atención activos.

La recomendación es iniciar con un grupo controlado de aliados, medir visitas y contactos durante un periodo piloto, corregir la experiencia con datos reales y luego ampliar la red comercial con un modelo de planes claramente documentado.
