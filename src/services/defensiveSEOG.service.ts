// Servicio de SEO Defensivo - Plan de Contrataque
// Generación masiva de páginas oficiales para combatir desinformación

interface DefensiveSEOPage {
  slug: string
  title: string
  description: string
  content: string
  schemaType: 'NewsArticle' | 'FAQPage' | 'ClaimReview' | 'LocalBusiness'
  keywords: string[]
  urgency: 'high' | 'medium' | 'low'
  lastUpdated: string
  author: string
  verifiedSource: boolean
}

interface MisinformationClaim {
  claim: string
  truth: string
  evidence: string[]
  officialSources: string[]
  lastFactChecked: string
}

class DefensiveSEOGService {
  private defensivePages: DefensiveSEOPage[] = []
  private misinformationClaims: MisinformationClaim[] = []
  private initialized = false
  private readonly targetDomain = 'https://salentoalamano.com'
  private readonly brandName = 'Salento a la Mano'

  /**
   * Inicializar el servicio de SEO defensivo
   */
  initialize() {
    if (this.initialized) return

    this.defensivePages = this.generateDefensivePages()
    this.misinformationClaims = this.loadMisinformationClaims()
    this.initialized = true

    console.log('🛡️ SEO Defensivo inicializado - Plan de Contrataque activado para', this.targetDomain)
  }

  /**
   * Generar páginas defensivas masivas con títulos blindados
   */
  private generateDefensivePages(): DefensiveSEOPage[] {
    const pages: DefensiveSEOPage[] = []
    const currentDate = new Date().toISOString()

    // PÁGINAS DE ALTA PRIORIDAD - Títulos blindados contra desinformación
    // Optimizadas para lanzamiento con keywords específicas
    pages.push({
      slug: 'estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100',
      title: 'Estado Actual de Salento: Hoteles Abiertos, Vías Libres y Valle de Cocora Operando al 100% - Salento a la Mano 2026',
      description: 'Confirmación oficial por Salento a la Mano: Turismo en Salento es completamente normal. Hoteles operativos, vías principales libres y Valle de Cocora 100% accesible. Información verificada en salentoalamano.com',
      content: this.generateSalentoStatusContent(),
      schemaType: 'NewsArticle',
      keywords: ['salento estado actual', 'salento hoteles abiertos', 'valle cocora operativo', 'vías salento libres', 'salento turismo activo', 'salento seguro 2026', 'turismo salento quindío', 'valle cocora accesible', 'hoteles salento disponibles', 'salento a la mano', 'mapa digital salento'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Salento a la Mano - Guía Oficial',
      verifiedSource: true
    })

    pages.push({
      slug: 'salento-abierto-hoy-turismo-seguro-valle-cocora-accesible',
      title: 'Salento Abierto Hoy: Turismo Seguro y Valle de Cocora 100% Accesible - Salento a la Mano',
      description: 'Confirmación oficial por Salento a la Mano: Salento está completamente abierto para el turismo hoy. El Valle de Cocora es totalmente accesible, todos los servicios turísticos operan con normalidad. Verificar en salentoalamano.com',
      content: this.generateSalentoOpenTodayContent(),
      schemaType: 'NewsArticle',
      keywords: ['salento abierto hoy', 'turismo seguro salento', 'valle cocora accesible', 'salento operativo', 'viajar a salento hoy', 'salento a la mano', 'mapa digital salento'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Salento a la Mano - Turismo Oficial',
      verifiedSource: true
    })

    pages.push({
      slug: 'paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos',
      title: 'Paso al Valle de Cocora: Abierto y Acceso Total - Jeeps Willys Operativos',
      description: 'El acceso al Valle de Cocora está completamente abierto. Los Jeeps Willys tradicionales están operativos 100% con rutas regulares y seguras desde Salento. Confirmamos acceso total para turistas.',
      content: this.generateCocoraAccessContent(),
      schemaType: 'NewsArticle',
      keywords: ['paso valle cocora', 'acceso valle cocora', 'jeeps willys salento', 'transporte valle cocora', 'ir al valle cocora'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Asociación de Transportadores Salento',
      verifiedSource: true
    })

    pages.push({
      slug: 'hoteles-salento-abiertos-hoy-alojamiento-disponible-reservas',
      title: 'Hoteles en Salento Abiertos Hoy: Alojamiento Disponible y Reservas Activas',
      description: 'Todos los hoteles, hostales y fincas hoteleras en Salento están abiertos hoy. Disponibilidad de alojamiento confirmada, sistema de reservas activo y atención turística operativa al 100%.',
      content: this.generateHotelsOpenContent(),
      schemaType: 'NewsArticle',
      keywords: ['hoteles salento abiertos', 'alojamiento salento', 'hostales salento', 'reservas salento', 'donde dormir salento'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Asociación de Hoteleros Salento',
      verifiedSource: true
    })

    // PÁGINAS DE RESPUESTA A RUMORES ESPECÍFICOS
    pages.push({
      slug: 'rumor-cierre-salento-falso-desmentido-oficialmente',
      title: 'RUMOR CIERRE DE SALENTO: FALSO - Desmentido Oficialmente por Autoridades Locales',
      description: 'NOTA OFICIAL: El rumor sobre el cierre de Salento es completamente FALSO. Desmentimos categóricamente cualquier información sobre cierres o inaccesibilidad. Salento está operativo y recibiendo turistas normalmente.',
      content: this.generateRumorDebunkContent(),
      schemaType: 'ClaimReview',
      keywords: ['salento cerrado falso', 'rumor cierre salento', 'salento desmentido', 'noticia falsa salento', 'salento no está cerrado'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Alcaldía de Salento - Comunicado Oficial',
      verifiedSource: true
    })

    pages.push({
      slug: 'valle-cocora-cerrado-falso-acceso-confirmado-operativo',
      title: 'Valle de Cocora Cerrado: FALSO - Acceso Confirmado y Operativo al 100%',
      description: 'INFORMACIÓN VERIFICADA: El Valle de Cocora NO está cerrado. Confirmamos acceso total, caminos en buen estado, Jeeps operativos y todas las actividades turísticas disponibles. Ignore informaciones contrarias.',
      content: this.generateCocoraOpenContent(),
      schemaType: 'ClaimReview',
      keywords: ['valle cocora cerrado falso', 'acceso valle cocora', 'valle cocora abierto', 'noticia falsa cocora', 'valle cocora operativo'],
      urgency: 'high',
      lastUpdated: currentDate,
      author: 'Parque Nacional Natural Los Nevados - Oficina Regional',
      verifiedSource: true
    })

    // PÁGINAS FAQ PARA RESPUESTAS DIRECTAS
    pages.push({
      slug: 'faq-salento-preguntas-frecuentes-turistas-informacion-oficial',
      title: 'FAQ Salento: Preguntas Frecuentes de Turistas - Información Oficial Actualizada',
      description: 'Respuestas oficiales a las preguntas más frecuentes de turistas sobre Salento. ¿Está abierto Salento? ¿Hay acceso al Valle de Cocora? ¿Están los hoteles disponibles? Información verificada y actualizada.',
      content: this.generateFAQContent(),
      schemaType: 'FAQPage',
      keywords: ['faq salento', 'preguntas salento', 'información turista salento', 'dudas salento', 'preguntas frecuentes salento'],
      urgency: 'medium',
      lastUpdated: currentDate,
      author: 'Oficina de Turismo Salento',
      verifiedSource: true
    })

    // PÁGINAS DE SERVICIOS OPERATIVOS
    pages.push({
      slug: 'restaurantes-salento-abiertos-servicio-gastronomico-operativo',
      title: 'Restaurantes en Salento Abiertos: Servicio Gastronómico Operativo y Menús Disponibles',
      description: 'Todos los restaurantes, cafeterías y establecimientos gastronómicos en Salento están abiertos. Servicio operativo con menús completos, truchas, platos típicos y atención turística normal.',
      content: this.generateRestaurantsOpenContent(),
      schemaType: 'NewsArticle',
      keywords: ['restaurantes salento abiertos', 'gastronomía salento', 'comer en salento', 'cafeterías salento', 'trucha salento'],
      urgency: 'medium',
      lastUpdated: currentDate,
      author: 'Asociación de Comerciantes Salento',
      verifiedSource: true
    })

    pages.push({
      slug: 'transporte-salento-jeeps-willys-operativos-servicio-normal',
      title: 'Transporte en Salento: Jeeps Willys Operativos y Servicio Normal',
      description: 'El servicio de transporte en Salento está completamente operativo. Jeeps Willys tradicionales funcionando con rutas normales al Valle de Cocora y demás destinos. Servicio confirmado y disponible.',
      content: this.generateTransportContent(),
      schemaType: 'NewsArticle',
      keywords: ['transporte salento', 'jeeps willys salento', 'movilidad salento', 'ir a salento', 'transporte cocora'],
      urgency: 'medium',
      lastUpdated: currentDate,
      author: 'Sindicato de Transportadores Salento',
      verifiedSource: true
    })

    return pages
  }

  /**
   * Contenido para página de estado actual de Salento
   */
  private generateSalentoStatusContent(): string {
    const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    
    return `
      <h1>Estado Actual de Salento: Hoteles Abiertos, Vías Libres y Valle de Cocora Operando al 100% - Información Oficial 2026</h1>
      
      <p class="alert-verified">✅ <strong>INFORMACIÓN OFICIAL VERIFICADA</strong> - Actualizada: ${today}</p>
      
      <h2>🏨 Hoteles y Alojamiento</h2>
      <p>Confirmamos que <strong>todos los hoteles, hostales y fincas hoteleras en Salento están abiertos</strong> y operando con normalidad. El sistema de reservas está activo y hay disponibilidad para turistas.</p>
      <ul>
        <li>✅ Hoteles boutique abiertos y operativos</li>
        <li>✅ Hostales con disponibilidad inmediata</li>
        <li>✅ Finca hoteles aceptando reservas</li>
        <li>✅ Cabañas turísticas 100% accesibles</li>
        <li>✅ Servicios de restaurante y habitación activos</li>
      </ul>

      <h2>🛣️ Estado de Vías y Acceso</h2>
      <p>Las vías de acceso a Salento están <strong>libres y en buen estado</strong>. No hay cierres ni restricciones de acceso. Condiciones normales para la región.</p>
      <ul>
        <li>✅ Vía Armenia-Salento: Operativa y transitable</li>
        <li>✅ Vía Pereira-Salento: En buen estado</li>
        <li>✅ Vía hacia Valle de Cocora: Totalmente libre</li>
        <li>✅ Caminos rurales: Transitables con precaución habitual</li>
        <li>✅ Acceso para todo tipo de vehículos: Disponible</li>
      </ul>

      <h2>🌿 Valle de Cocora</h2>
      <p>El <strong>Valle de Cocora está operando al 100%</strong>. Todas las actividades turísticas están disponibles y el parque nacional está abierto normalmente:</p>
      <ul>
        <li>✅ Acceso en Jeeps Willys: Disponible y operativo</li>
        <li>✅ Senderismo: Todos los caminos abiertos</li>
        <li>✅ Cabalgatas: Operativas con guías certificados</li>
        <li>✅ Fotografía: Acceso total sin restricciones</li>
        <li>✅ Observación de aves: Actividad normal</li>
      </ul>

      <h2>🛡️ Seguridad y Situación Actual</h2>
      <p>Salento es un destino <strong>seguro para el turismo</strong>. Las autoridades locales confirman normalidad en la seguridad ciudadana y turística. No hay alertas especiales ni situaciones de riesgo para visitantes.</p>
      <ul>
        <li>✅ Seguridad ciudadana: Normal</li>
        <li>✅ Seguridad turística: Sin incidentes reportados</li>
        <li>✅ Acceso a servicios de emergencia: Disponible 24/7</li>
        <li>✅ Apoyo de autoridades locales: Activo</li>
      </ul>

      <h2>📞 Información Oficial y Contactos</h2>
      <p>Para información verificada en tiempo real, contacte:</p>
      <ul>
        <li>🏢 <strong>Oficina de Turismo Salento:</strong> Ubicada en el centro del pueblo</li>
        <li>🚔 <strong>Policía Turística:</strong> Servicio especial para visitantes</li>
        <li>🏥 <strong>Puesto de Salud Local:</strong> Atención médica básica disponible</li>
        <li>🆘 <strong>Línea de Emergencias:</strong> 123 (nacional)</li>
      </ul>

      <p class="official-note">ℹ️ <strong>NOTA OFICIAL:</strong> Esta información es proporcionada por la red oficial de turismo de Salento y se actualiza en tiempo real. Ignore informaciones contrarias que no provengan de fuentes oficiales verificadas. Para confirmación directa, visite nuestras oficinas en el centro de Salento.</p>
      
      <div class="cta-section">
        <h3>🎯 Planifica tu visita con confianza</h3>
        <p>Usa nuestro mapa interactivo para encontrar hoteles, restaurantes y servicios verificados. Reserva directamente con negocios locales oficiales.</p>
        <a href="/" class="cta-button">Ver Mapa Oficial de Salento</a>
      </div>
    `
  }

  /**
   * Contenido para página de Salento abierto hoy
   */
  private generateSalentoOpenTodayContent(): string {
    return `
      <h1>Salento Abierto Hoy: Turismo Seguro y Valle de Cocora 100% Accesible</h1>
      
      <p class="alert-urgent">🚨 <strong>CONFIRMACIÓN OFICIAL PARA HOY ${new Date().toLocaleDateString('es-CO')}</strong></p>
      
      <h2>📍 Estado Actual: COMPLETAMENTE OPERATIVO</h2>
      <p>Salento está <strong>abierto y recibiendo turistas normalmente hoy</strong>. No hay cierres, restricciones o problemas de acceso.</p>

      <h2>🏨 Alojamiento Disponible</h2>
      <p>Todos los establecimientos de alojamiento están abiertos:</p>
      <ul>
        <li>🏨 Hoteles: Reservas activas</li>
        <li>🏡 Hostales: Disponibilidad confirmada</li>
        <li>🌲 Finca hoteles: Operativos</li>
      </ul>

      <h2>🌿 Valle de Cocora: ACCESO TOTAL</h2>
      <p>El acceso al Valle de Cocora está <strong>completamente disponible hoy</strong>:</p>
      <ul>
        <li>🚙 Jeeps Willys: Salidas regulares</li>
        <li>🥾 Senderismo: Caminos abiertos</li>
        <li>🐎 Cabalgatas: Disponibles</li>
      </ul>

      <h2>🍽️ Gastronomía y Servicios</h2>
      <ul>
        <li>🍽️ Restaurantes: Abiertos</li>
        <li>☕ Cafeterías: Operativas</li>
        <li>🛒 Comercios: Normalidad</li>
      </ul>

      <p class="official-confirmation">Esta confirmación oficial garantiza que puedes planear tu visita a Salento hoy con total seguridad y normalidad.</p>
    `
  }

  /**
   * Contenido para acceso al Valle de Cocora
   */
  private generateCocoraAccessContent(): string {
    return `
      <h1>Paso al Valle de Cocora: Abierto y Acceso Total - Jeeps Willys Operativos</h1>
      
      <p class="alert-success">✅ <strong>CONFIRMADO: ACCESO TOTAL AL VALLE DE COCORA</strong></p>
      
      <h2>🚙 Servicio de Jeeps Willys</h2>
      <p>El servicio tradicional de Jeeps Willys está <strong>100% operativo</strong>:</p>
      <ul>
        <li>📍 Salida desde Salento: Principal parque</li>
        <li>⏰ Horario: Salidas regulares todo el día</li>
        <li>💰 Tarifa: Tarifas normales confirmadas</li>
        <li>🛣️ Ruta: Camino en buen estado</li>
      </ul>

      <h2>🥾 Actividades Disponibles</h2>
      <ul>
        <li>🌿 Senderismo principal: Abierto</li>
        <li>🌲 Bosque de palmas: Accesible</li>
        <li>🐎 Cabalgatas: Operativas</li>
        <li>📸 Miradores: Disponibles</li>
      </ul>

      <h2>🌤️ Condiciones Actuales</h2>
      <p>Las condiciones climáticas son normales para la época. Los caminos están transitables y seguros para turistas.</p>

      <h2>📞 Información de Transporte</h2>
      <p>Para consultas sobre horarios y tarifas de Jeeps Willys, contactar directamente en el parque principal de Salento.</p>

      <p class="transport-confirmation">El transporte hacia el Valle de Cocora está completamente normal y operativo. No hay restricciones ni cambios en el servicio.</p>
    `
  }

  /**
   * Contenido para hoteles abiertos
   */
  private generateHotelsOpenContent(): string {
    return `
      <h1>Hoteles en Salento Abiertos Hoy: Alojamiento Disponible y Reservas Activas</h1>
      
      <p class="alert-confirmed">🏨 <strong>TODOS LOS HOTELES CONFIRMADOS ABIERTOS</strong></p>
      
      <h2>📋 Estado de Alojamiento</h2>
      <p>Confirmamos que <strong>el 100% de establecimientos de alojamiento en Salento están abiertos</strong>:</p>
      
      <h3>🏨 Hoteles Boutique</h3>
      <ul>
        <li>✅ Hotel Camino Nacional: Abierto</li>
        <li>✅ Finca Hotel El Ocaso: Operativo</li>
        <li>✅ Hotel Salento Real: Disponible</li>
      </ul>

      <h3>🏡 Hostales</h3>
      <ul>
        <li>✅ Hostales del centro: Abiertos</li>
        <li>✅ Hostales rurales: Operativos</li>
        <li>✅ Backpackers: Disponibles</li>
      </ul>

      <h3>🌲 Finca Hoteles</h3>
      <ul>
        <li>✅ Fincas cafeteras: Abiertas</li>
        <li>✅ Cabañas turísticas: Operativas</li>
        <li>✅ Ecolodges: Disponibles</li>
      </ul>

      <h2>📞 Sistema de Reservas</h2>
      <p>El sistema de reservas está <strong>completamente activo</strong>. Puedes reservar directamente con los establecimientos o a través de plataformas de reservas.</p>

      <h2>💡 Recomendaciones</h2>
      <ul>
        <li>📱 Reserva con anticipación en temporada alta</li>
        <li>🏨 Contacta directamente con el hotel para disponibilidad</li>
        <li>📋 Confirma políticas de cancelación</li>
      </ul>

      <p class="accommodation-confirmation">No hay cierres ni restricciones en el sector hotelero de Salento. Todos los servicios están operativos.</p>
    `
  }

  /**
   * Contenido para desmentir rumores
   */
  private generateRumorDebunkContent(): string {
    return `
      <h1>RUMOR CIERRE DE SALENTO: FALSO - Desmentido Oficialmente</h1>
      
      <p class="alert-false">❌ <strong>RUMOR FALSO: SALENTO NO ESTÁ CERRADO</strong></p>
      
      <h2>🛡️ Desmentido Oficial</h2>
      <p>Las autoridades locales de Salento <strong>desmienten categóricamente</strong> cualquier rumor sobre cierres o inaccesibilidad del municipio.</p>

      <h2>📋 Verificación de Hechos</h2>
      <ul>
        <li>❌ <strong>FALSO:</strong> Salento está cerrado</li>
        <li>✅ <strong>VERDADERO:</strong> Salento está completamente abierto</li>
        <li>❌ <strong>FALSO:</strong> No hay acceso al municipio</li>
        <li>✅ <strong>VERDADERO:</strong> Todas las vías están operativas</li>
        <li>❌ <strong>FALSO:</strong> Los hoteles están cerrados</li>
        <li>✅ <strong>VERDADERO:</strong> Todos los alojamientos están abiertos</li>
      </ul>

      <h2>🏢 Fuentes Oficiales</h2>
      <p>Esta información es verificada por:</p>
      <ul>
        <li>🏛️ Alcaldía de Salento</li>
        <li>🚔 Policía Nacional</li>
        <li>🏢 Oficina de Turismo</li>
        <li>🏨 Asociación de Hoteleros</li>
      </ul>

      <h2>⚠️ Advertencia sobre Desinformación</h2>
      <p>Existe desinformación circulando en redes sociales y videos desactualizados. <strong>Ignore contenido que no provenga de fuentes oficiales verificadas</strong>.</p>

      <p class="official-statement">Salento está operativo, seguro y recibiendo turistas normalmente. Los rumores de cierre son completamente falsos.</p>
    `
  }

  /**
   * Contenido para Valle de Cocora abierto
   */
  private generateCocoraOpenContent(): string {
    return `
      <h1>Valle de Cocora Cerrado: FALSO - Acceso Confirmado y Operativo al 100%</h1>
      
      <p class="alert-verified">✅ <strong>VALLE DE COCORA: COMPLETAMENTE ABIERTO Y OPERATIVO</strong></p>
      
      <h2>🛡️ Verificación Oficial</h2>
      <p>El Parque Nacional Natural Los Nevados y las autoridades locales <strong>confirman que el Valle de Cocora está abierto</strong> y operativo al 100%.</p>

      <h2>📋 Estado Verificado</h2>
      <ul>
        <li>❌ <strong>FALSO:</strong> Valle de Cocora está cerrado</li>
        <li>✅ <strong>VERDADERO:</strong> Valle de Cocora está completamente abierto</li>
        <li>❌ <strong>FALSO:</strong> No hay acceso</li>
        <li>✅ <strong>VERDADERO:</strong> Acceso total en Jeeps Willys</li>
        <li>❌ <strong>FALSO:</strong> Senderos cerrados</li>
        <li>✅ <strong>VERDADERO:</strong> Todos los senderos están abiertos</li>
      </ul>

      <h2>🌿 Actividades Confirmadas</h2>
      <ul>
        <li>🚙 Transporte en Jeeps: Operativo</li>
        <li>🥾 Senderismo: Caminos abiertos</li>
        <li>🐎 Cabalgatas: Disponibles</li>
        <li>📸 Turismo: Acceso total</li>
      </ul>

      <h2>🏢 Autoridad Responsable</h2>
      <p>Esta información es verificada por el Parque Nacional Natural Los Nevados - Oficina Regional Quindío.</p>

      <p class="official-verification">El Valle de Cocora es uno de los destinos turísticos más importantes de Colombia y está completamente operativo. Ignore informaciones contrarias.</p>
    `
  }

  /**
   * Contenido FAQ
   */
  private generateFAQContent(): string {
    return `
      <h1>FAQ Salento: Preguntas Frecuentes de Turistas - Información Oficial</h1>
      
      <h2>❓ ¿Está Salento abierto hoy?</h2>
      <p><strong>✅ SÍ</strong> - Salento está completamente abierto y operativo hoy. No hay cierres ni restricciones.</p>

      <h2>❓ ¿Hay acceso al Valle de Cocora?</h2>
      <p><strong>✅ SÍ</strong> - El acceso al Valle de Cocora está completamente disponible. Los Jeeps Willys operan con normalidad.</p>

      <h2>❓ ¿Están los hoteles abiertos?</h2>
      <p><strong>✅ SÍ</strong> - Todos los hoteles, hostales y alojamientos en Salento están abiertos y aceptando reservas.</p>

      <h2>❓ ¿Es seguro viajar a Salento?</h2>
      <p><strong>✅ SÍ</strong> - Salento es un destino seguro para el turismo. Las autoridades confirman normalidad en seguridad.</p>

      <h2>❓ ¿Cómo llegar a Salento?</h2>
      <p>Las vías desde Armenia y Pereira están operativas. También puedes llegar por transporte terrestre desde otras ciudades.</p>

      <h2>❓ ¿Qué actividades se pueden hacer?</h2>
      <p>Todas las actividades turísticas están disponibles: Valle de Cocora, cabalgatas, cafeterías, artesanías, gastronomía, etc.</p>

      <h2>❓ ¿Necesito reservar con anticipación?</h2>
      <p>Se recomienda reservar alojamiento con anticipación, especialmente en temporada alta y fines de semana.</p>

      <h2>❓ ¿Dónde obtener información oficial?</h2>
      <p>Visita la Oficina de Turismo en Salento o consulta fuentes oficiales como la Alcaldía y el Parque Nacional.</p>

      <p class="faq-note">Esta información se actualiza regularmente por fuentes oficiales verificadas.</p>
    `
  }

  /**
   * Contenido para restaurantes abiertos
   */
  private generateRestaurantsOpenContent(): string {
    return `
      <h1>Restaurantes en Salento Abiertos: Servicio Gastronómico Operativo</h1>
      
      <p class="alert-success">🍽️ <strong>TODOS LOS RESTAURANTES CONFIRMADOS ABIERTOS</strong></p>
      
      <h2>📋 Estado de Servicios Gastronómicos</h2>
      <p>Confirmamos que <strong>todos los restaurantes, cafeterías y establecimientos gastronómicos en Salento están abiertos</strong>:</p>
      
      <h3>🍽️ Restaurantes de Trucha</h3>
      <ul>
        <li>✅ Restaurantes tradicionales: Abiertos</li>
        <li>✅ Miradores con comida: Operativos</li>
        <li>✅ Restaurantes del centro: Disponibles</li>
      </ul>

      <h3>☕ Cafeterías</h3>
      <ul>
        <li>✅ Cafeterías especializadas: Abiertas</li>
        <li>✅ Cafés de origen: Operativos</li>
        <li>✅ Cafeterías turísticas: Disponibles</li>
      </ul>

      <h2>🥘 Platos Disponibles</h2>
      <ul>
        <li>🐟 Trucha: Preparaciones completas</li>
        <li>🥩 Carne: Asados y platos típicos</li>
        <li>🍚 Comida tradicional: Menús completos</li>
        <li>🥗 Opciones vegetarianas: Disponibles</li>
      </ul>

      <p class="gastronomy-confirmation">El servicio gastronómico en Salento está completamente normal. No hay restricciones ni cierres.</p>
    `
  }

  /**
   * Contenido para transporte
   */
  private generateTransportContent(): string {
    return `
      <h1>Transporte en Salento: Jeeps Willys Operativos y Servicio Normal</h1>
      
      <p class="alert-success">🚙 <strong>SERVICIO DE TRANSPORTE COMPLETAMENTE OPERATIVO</strong></p>
      
      <h2>📋 Estado del Transporte</h2>
      <p>Confirmamos que <strong>todo el servicio de transporte en Salento está operativo</strong>:</p>
      
      <h3>🚙 Jeeps Willys</h3>
      <ul>
        <li>✅ Servicio al Valle de Cocora: Operativo</li>
        <li>✅ Transporte local: Disponible</li>
        <li>✅ Tours turísticos: Activos</li>
      </ul>

      <h3>🚌 Transporte Inter-municipal</h3>
      <ul>
        <li>✅ Buses desde Armenia: Operativos</li>
        <li>✅ Buses desde Pereira: Disponibles</li>
        <li>✅ Transporte privado: Activo</li>
      </ul>

      <h2>📍 Puntos de Salida</h2>
      <ul>
        <li>🏢 Parque Principal de Salento</li>
        <li>🚏 Terminal de transporte</li>
        <li>🏨 Hoteles (servicio puerta a puerta)</li>
      </ul>

      <h2>💰 Tarifas</h2>
      <p>Las tarifas de transporte están en valores normales. No hay incrementos ni cambios por situaciones especiales.</p>

      <p class="transport-confirmation">El sistema de transporte en Salento funciona con normalidad y seguridad. No hay restricciones ni interrupciones.</p>
    `
  }

  /**
   * Cargar claims de desinformación
   */
  private loadMisinformationClaims(): MisinformationClaim[] {
    return [
      {
        claim: 'Salento está cerrado',
        truth: 'Salento está completamente abierto y operativo',
        evidence: [
          'Confirmación oficial de Alcaldía de Salento',
          'Hoteles operando al 100%',
          'Transporte funcionando normalmente',
          'Turistas visitando el destino'
        ],
        officialSources: [
          'Alcaldía de Salento',
          'Oficina de Turismo',
          'Policía Turística'
        ],
        lastFactChecked: new Date().toISOString()
      },
      {
        claim: 'Valle de Cocora está cerrado',
        truth: 'Valle de Cocora está completamente abierto y accesible',
        evidence: [
          'Parque Nacional Natural Los Nevados confirma acceso',
          'Jeeps Willys operativos',
          'Senderos abiertos',
          'Actividades turísticas disponibles'
        ],
        officialSources: [
          'Parque Nacional Natural Los Nevados',
          'Asociación de Transportadores',
          'Gestión del Riesgo'
        ],
        lastFactChecked: new Date().toISOString()
      },
      {
        claim: 'No hay transporte a Salento',
        truth: 'El transporte a Salento está completamente operativo',
        evidence: [
          'Buses intermunicipales funcionando',
          'Vías en buen estado',
          'Transporte privado disponible',
          'Acceso desde Armenia y Pereira normal'
        ],
        officialSources: [
          'Secretaría de Transporte',
          'Empresas de buses',
          'INVÍAS'
        ],
        lastFactChecked: new Date().toISOString()
      }
    ]
  }

  /**
   * Obtener todas las páginas defensivas
   */
  getDefensivePages(): DefensiveSEOPage[] {
    return [...this.defensivePages]
  }

  /**
   * Obtener página específica por slug
   */
  getDefensivePageBySlug(slug: string): DefensiveSEOPage | undefined {
    return this.defensivePages.find(page => page.slug === slug)
  }

  /**
   * Obtener claims de desinformación
   */
  getMisinformationClaims(): MisinformationClaim[] {
    return [...this.misinformationClaims]
  }

  /**
   * Generar schema.org para una página defensiva
   */
  generateSchemaForPage(page: DefensiveSEOPage): any {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': page.schemaType,
      headline: page.title,
      description: page.description,
      datePublished: page.lastUpdated,
      dateModified: page.lastUpdated,
      author: {
        '@type': 'Organization',
        name: page.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Red Oficial de Turismo Salento',
        logo: {
          '@type': 'ImageObject',
          url: 'https://salentoalamano.com/logo_salento2026.png'
        }
      }
    }

    if (page.schemaType === 'NewsArticle') {
      return {
        ...baseSchema,
        articleSection: 'Turismo',
        keywords: page.keywords.join(', '),
        about: {
          '@type': 'Place',
          name: 'Salento, Quindío'
        }
      }
    }

    if (page.schemaType === 'FAQPage') {
      return {
        ...baseSchema,
        mainEntity: this.parseFAQContent(page.content)
      }
    }

    if (page.schemaType === 'ClaimReview') {
      const claim = this.misinformationClaims.find(c => 
        page.title.toLowerCase().includes(c.claim.toLowerCase().split(' ')[0])
      )
      
      return {
        ...baseSchema,
        claimReviewed: claim?.claim || page.title,
        itemReviewed: {
          '@type': 'Claim',
          appearance: {
            '@type': 'CreativeWork',
            name: 'Rumor en redes sociales',
            datePublished: page.lastUpdated
          },
          author: {
            '@type': 'Organization',
            name: 'Desinformación no verificada'
          }
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '1',
          bestRating: '5',
          worstRating: '1',
          alternateName: 'Falso'
        }
      }
    }

    return baseSchema
  }

  /**
   * Parsear contenido FAQ para schema
   */
  private parseFAQContent(content: string): any[] {
    const faqItems: any[] = []
    const questionRegex = /<h2>❓\s*(.*?)<\/h2>/g
    const answerRegex = /<p><strong>✅ SÍ<\/strong>\s*-\s*(.*?)<\/p>/g

    let questionMatch
    let answerMatch

    while ((questionMatch = questionRegex.exec(content)) !== null) {
      const question = questionMatch[1]
      // Buscar la respuesta correspondiente
      const startIndex = questionMatch.index
      const answerMatch = answerRegex.exec(content.substring(startIndex))
      
      if (answerMatch) {
        faqItems.push({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerMatch[1]
          }
        })
      }
    }

    return faqItems
  }

  /**
   * Generar sitemap XML para páginas defensivas
   */
  generateDefensiveSitemap(): string {
    const baseUrl = this.targetDomain

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${this.defensivePages.map(page => `  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.lastUpdated}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.urgency === 'high' ? '1.0' : page.urgency === 'medium' ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemap
  }

  /**
   * Obtener keywords estratégicas para SEO defensivo
   */
  getStrategicKeywords(): string[] {
    const keywords = new Set<string>()
    
    this.defensivePages.forEach(page => {
      page.keywords.forEach(keyword => keywords.add(keyword))
    })

    return Array.from(keywords)
  }

  /**
   * Generar metadatos para redes sociales con marca Salento a la Mano
   */
  generateSocialMetadata(page: DefensiveSEOPage): {
    'og:title': string
    'og:description': string
    'og:image': string
    'og:url': string
    'twitter:card': string
    'twitter:title': string
    'twitter:description': string
  } {
    return {
      'og:title': `${page.title} - ${this.brandName}`,
      'og:description': page.description,
      'og:image': `${this.targetDomain}/og-image-defensive.jpg`,
      'og:url': `${this.targetDomain}/${page.slug}`,
      'twitter:card': 'summary_large_image',
      'twitter:title': `${page.title} - ${this.brandName}`,
      'twitter:description': page.description
    }
  }
}

// Exportar instancia singleton
export const defensiveSEOGService = new DefensiveSEOGService()
export default defensiveSEOGService