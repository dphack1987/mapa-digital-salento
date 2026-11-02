/**
 * Google Analytics 4 Service
 * Servicio para tracking de eventos y métricas en Google Analytics 4
 * Agregado para documentar impacto WSA 2026
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

interface GA4EventParams {
  [key: string]: string | number | boolean | undefined
}

class GA4Service {
  private measurementId: string
  private initialized = false
  private enabled = true

  constructor(measurementId: string = 'G-XXXXXXXXXX') {
    this.measurementId = measurementId
  }

  /**
   * Inicializa Google Analytics 4
   * Carga el script gtag.js si no está presente
   */
  initialize(measurementId?: string) {
    if (this.initialized) {
      console.log('[GA4] Ya inicializado')
      return
    }

    if (measurementId) {
      this.measurementId = measurementId
    }

    // Si no hay un ID válido (placeholder), no inicializar
    if (this.measurementId === 'G-XXXXXXXXXX') {
      console.warn('[GA4] Measurement ID es placeholder. Configura un ID real para activar tracking.')
      this.enabled = false
      return
    }

    // Cargar script gtag.js dinámicamente
    this.loadGtagScript()

    this.initialized = true
    console.log('[GA4] Inicializado con ID:', this.measurementId)
  }

  /**
   * Carga el script de gtag.js dinámicamente
   */
  private loadGtagScript() {
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
      document.head.appendChild(script)

      // Inicializar dataLayer
      window.dataLayer = window.dataLayer || []

      window.gtag = function () {
        window.dataLayer!.push(arguments)
      }

      // Configurar GA4
      window.gtag('js', new Date())
      window.gtag('config', this.measurementId, {
        send_page_view: false, // Enviaremos page views manualmente
        anonymize_ip: true,
        cookie_flags: 'samesite=none;secure'
      })
    }
  }

  /**
   * Track page view
   * @param pagePath - Ruta de la página (ej: '/', '/categorias/Restaurantes')
   * @param pageTitle - Título de la página
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.enabled || !window.gtag) return

    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href
    })

    console.log('[GA4] Page view:', pagePath)
  }

  /**
   * Track evento personalizado
   * @param eventName - Nombre del evento
   * @param params - Parámetros del evento
   */
  trackEvent(eventName: string, params?: GA4EventParams) {
    if (!this.enabled || !window.gtag) return

    window.gtag('event', eventName, params)
    console.log('[GA4] Event:', eventName, params)
  }

  /**
   * Track vista de lugar
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   * @param category - Categoría del lugar
   * @param isPautante - Si es pautante
   */
  trackPlaceView(placeId: string, placeName: string, category: string, isPautante: boolean = false) {
    this.trackEvent('place_view', {
      place_id: placeId,
      place_name: placeName,
      category: category,
      is_pautante: isPautante
    })
  }

  /**
   * Track clic a WhatsApp
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   * @param category - Categoría del lugar
   */
  trackWhatsAppClick(placeId: string, placeName: string, category: string) {
    this.trackEvent('whatsapp_click', {
      place_id: placeId,
      place_name: placeName,
      category: category
    })
  }

  /**
   * Track clic a teléfono
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   */
  trackPhoneClick(placeId: string, placeName: string) {
    this.trackEvent('phone_click', {
      place_id: placeId,
      place_name: placeName
    })
  }

  /**
   * Track clic a email
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   */
  trackEmailClick(placeId: string, placeName: string) {
    this.trackEvent('email_click', {
      place_id: placeId,
      place_name: placeName
    })
  }

  /**
   * Track clic a website
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   */
  trackWebsiteClick(placeId: string, placeName: string) {
    this.trackEvent('website_click', {
      place_id: placeId,
      place_name: placeName
    })
  }

  /**
   * Track búsqueda en mapa
   * @param query - Término de búsqueda
   * @param resultsCount - Número de resultados
   * @param category - Categoría filtrada (si aplica)
   */
  trackSearch(query: string, resultsCount: number, category?: string) {
    this.trackEvent('search_query', {
      search_query: query,
      results_count: resultsCount,
      category: category || 'all'
    })
  }

  /**
   * Track filtro de categoría
   * @param category - Categoría seleccionada
   */
  trackCategoryFilter(category: string) {
    this.trackEvent('category_filter', {
      category: category
    })
  }

  /**
   * Track cambio de idioma
   * @param language - Idioma seleccionado
   * @param previousLanguage - Idioma anterior
   */
  trackLanguageChange(language: string, previousLanguage?: string) {
    this.trackEvent('language_change', {
      language: language,
      previous_language: previousLanguage
    })
  }

  /**
   * Track cambio de moneda
   * @param currency - Moneda seleccionada
   * @param previousCurrency - Moneda anterior
   */
  trackCurrencyChange(currency: string, previousCurrency?: string) {
    this.trackEvent('currency_change', {
      currency: currency,
      previous_currency: previousCurrency
    })
  }

  /**
   * Track pedido enviado
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   * @param orderValue - Valor del pedido (en COP)
   * @param currency - Moneda del pedido
   */
  trackOrderSubmit(placeId: string, placeName: string, orderValue: number, currency: string) {
    this.trackEvent('order_submit', {
      place_id: placeId,
      place_name: placeName,
      order_value: orderValue,
      currency: currency
    })
  }

  /**
   * Track pregunta a Don Chucho
   * @param query - Pregunta del usuario
   * @param answerType - Tipo de respuesta (knowledge_base, ai, fallback)
   */
  trackDonChuchoQuery(query: string, answerType: 'knowledge_base' | 'ai' | 'fallback') {
    this.trackEvent('don_chucho_query', {
      query: query.substring(0, 100), // Limitar longitud
      answer_type: answerType
    })
  }

  /**
   * Track uso de voz (VoiceInput)
   * @param success - Si fue exitoso
   * @param duration - Duración en segundos
   */
  trackVoiceInput(success: boolean, duration?: number) {
    this.trackEvent('voice_input', {
      success: success,
      duration_seconds: duration
    })
  }

  /**
   * Track QR generado
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   */
  trackQRGenerated(placeId: string, placeName: string) {
    this.trackEvent('qr_generated', {
      place_id: placeId,
      place_name: placeName
    })
  }

  /**
   * Track QR escaneado
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   */
  trackQRScanned(placeId: string, placeName: string) {
    this.trackEvent('qr_scanned', {
      place_id: placeId,
      place_name: placeName
    })
  }

  /**
   * Track reserva de cabalgata
   * @param provider - Proveedor de cabalgata
   * @param participants - Número de participantes
   */
  trackHorsebackRidingBooking(provider: string, participants: number) {
    this.trackEvent('horseback_riding_booking', {
      provider: provider,
      participants: participants
    })
  }

  /**
   * Track reseña enviada
   * @param placeId - ID del lugar
   * @param placeName - Nombre del lugar
   * @param rating - Calificación (1-5)
   */
  trackReviewSubmit(placeId: string, placeName: string, rating: number) {
    this.trackEvent('review_submit', {
      place_id: placeId,
      place_name: placeName,
      rating: rating
    })
  }

  /**
   * Track registro de aliado
   * @param businessType - Tipo de negocio
   */
  trackAllyRegistration(businessType: string) {
    this.trackEvent('ally_registration', {
      business_type: businessType
    })
  }

  /**
   * Track verificación de aliado
   * @param success - Si fue exitoso
   */
  trackAllyVerification(success: boolean) {
    this.trackEvent('ally_verification', {
      success: success
    })
  }

  /**
   * Set user ID para tracking cross-device
   * @param userId - ID del usuario
   */
  setUserId(userId: string) {
    if (!this.enabled || !window.gtag) return

    window.gtag('config', this.measurementId, {
      user_id: userId
    })

    console.log('[GA4] User ID set:', userId)
  }

  /**
   * Set user properties para segmentación
   * @param properties - Propiedades del usuario
   */
  setUserProperties(properties: GA4EventParams) {
    if (!this.enabled || !window.gtag) return

    window.gtag('set', 'user_properties', properties)
    console.log('[GA4] User properties set:', properties)
  }

  /**
   * Disable tracking (para privacidad del usuario)
   */
  disableTracking() {
    if (!window.gtag) return

    window.gtag('config', this.measurementId, {
      send_page_view: false,
      storage: 'none',
      anonymize_ip: true
    })

    this.enabled = false
    console.log('[GA4] Tracking deshabilitado')
  }

  /**
   * Enable tracking
   */
  enableTracking() {
    if (!window.gtag) return

    window.gtag('config', this.measurementId, {
      send_page_view: true,
      storage: 'local',
      anonymize_ip: true
    })

    this.enabled = true
    console.log('[GA4] Tracking habilitado')
  }

  /**
   * Track social share
   * @param platform - Plataforma de compartición (facebook, twitter, whatsapp, linkedin, email)
   */
  trackSocialShare(platform: string) {
    this.trackEvent('social_share', {
      platform: platform
    })
  }

  /**
   * Cleanup
   */
  cleanup() {
    // GA4 no requiere cleanup específico
    console.log('[GA4] Cleanup completado')
  }
}

// Instancia singleton con Measurement ID real de Google Analytics
// Configurado para WSA 2026 - Salento a la Mano
const ga4Service = new GA4Service('G-1Z70BRW660')

export default ga4Service
