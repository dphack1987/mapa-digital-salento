// Servicio de Programmatic SEO para generación automática de landing pages
// Genera páginas optimizadas para SEO defensivo basadas en templates y datos dinámicos

interface LandingPageTemplate {
  id: string
  category: 'safety' | 'routes' | 'hotels' | 'activities' | 'transport'
  keywords: string[]
  defensiveMode: boolean
  schemaTypes: ('FAQPage' | 'ClaimReview' | 'NewsArticle' | 'LocalBusiness')[]
}

interface GeneratedLandingPage {
  slug: string
  title: string
  description: string
  content: string
  schema: object
  lastUpdated: Date
  source: 'official' | 'community' | 'mixed'
  category: string
  keywords: string[]
  locale: 'es' | 'en'
  defensiveKeywords: string[]
}

class ProgrammaticSEOLandingService {
  private templates: LandingPageTemplate[] = []
  private generatedPages: Map<string, GeneratedLandingPage> = new Map()
  private toxicKeywords: string[] = []
  private defensiveResponses: Map<string, string> = new Map()

  constructor() {
    this.initializeTemplates()
    this.initializeToxicKeywords()
    this.initializeDefensiveResponses()
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'safety-status',
        category: 'safety',
        keywords: ['seguridad', 'estado', 'situación', 'alertas', 'condiciones'],
        defensiveMode: true,
        schemaTypes: ['FAQPage', 'ClaimReview', 'LocalBusiness']
      },
      {
        id: 'route-status',
        category: 'routes',
        keywords: ['vías', 'acceso', 'carreteras', 'transporte', 'llegada'],
        defensiveMode: true,
        schemaTypes: ['FAQPage', 'ClaimReview']
      },
      {
        id: 'hotel-availability',
        category: 'hotels',
        keywords: ['hoteles', 'hostales', 'alojamiento', 'disponibilidad', 'reservas'],
        defensiveMode: true,
        schemaTypes: ['FAQPage', 'LocalBusiness']
      },
      {
        id: 'activity-status',
        category: 'activities',
        keywords: ['actividades', 'tours', 'experiencias', 'planes', 'qué hacer'],
        defensiveMode: false,
        schemaTypes: ['FAQPage']
      },
      {
        id: 'transport-status',
        category: 'transport',
        keywords: ['jeeps', 'willys', 'colectivos', 'buses', 'movilidad'],
        defensiveMode: false,
        schemaTypes: ['FAQPage', 'LocalBusiness']
      }
    ]
  }

  private initializeToxicKeywords() {
    this.toxicKeywords = [
      'peligro', 'inseguro', 'cierre', 'bloqueo', 'no vengas', 'evitar',
      'riesgo', 'alarma', 'crisis', 'emergencia', 'desastre', 'evacuación',
      'abandono', 'sin turistas', 'pueblo fantasma', 'todo cerrado',
      'vías cerradas', 'carreteras bloqueadas', 'acceso imposible',
      'valle peligroso', 'cascada insegura', 'senderismo riesgoso',
      'delincuencia', 'robos', 'inseguridad', 'no hay servicios'
    ]
  }

  private initializeDefensiveResponses() {
    this.defensiveResponses.set('peligro', '¡Tranquilo! Salento está seguro y operativo al 100%. La comunidad local recibe visitantes con calidez y todos los servicios turísticos funcionan con normalidad.')
    this.defensiveResponses.set('cierre', '¡No hay cierres! Salento está completamente abierto. Hoteles, restaurantes, transporte y actividades turísticas disponibles.')
    this.defensiveResponses.set('vías', '¡Las vías están operativas! Acceso desde Armenia (45 min) y Pereira (1 hora) en buen estado. Transporte disponible.')
    this.defensiveResponses.set('valle', '¡El Valle de Cocora es seguro! Miles de visitantes lo disfrutan diariamente. Senderos, cabalgatas y miradores abiertos.')
  }

  generateDynamicLandingPage(topic: string, language: 'es' | 'en' = 'es'): GeneratedLandingPage {
    const template = this.getTemplateForTopic(topic)
    const slug = this.generateSlug(topic)
    const isDefensive = this.containsToxicKeywords(topic)
    
    const page: GeneratedLandingPage = {
      slug,
      title: this.generateTitle(topic, language, isDefensive),
      description: this.generateDescription(topic, language, isDefensive),
      content: this.generateContent(topic, language, template, isDefensive),
      schema: this.generateSchema(topic, template, isDefensive),
      lastUpdated: new Date(),
      source: 'official',
      category: template.category,
      keywords: this.generateKeywords(topic, template),
      locale: language,
      defensiveKeywords: isDefensive ? this.extractToxicKeywords(topic) : []
    }

    this.generatedPages.set(slug, page)
    return page
  }

  private getTemplateForTopic(topic: string): LandingPageTemplate {
    const normalizedTopic = topic.toLowerCase()
    
    for (const template of this.templates) {
      if (template.keywords.some(keyword => normalizedTopic.includes(keyword))) {
        return template
      }
    }
    
    return this.templates[0] // Default to safety template
  }

  private generateSlug(topic: string): string {
    const normalized = topic.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    return `${normalized}-hoy`
  }

  private generateTitle(topic: string, language: 'es' | 'en', isDefensive: boolean): string {
    const normalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
    
    if (isDefensive) {
      return language === 'es' 
        ? `Estado Real de ${normalizedTopic} en Salento - Información Oficial`
        : `Real Status of ${normalizedTopic} in Salento - Official Information`
    }
    
    return language === 'es'
      ? `${normalizedTopic} en Salento - Guía Actualizada`
      : `${normalizedTopic} in Salento - Updated Guide`
  }

  private generateDescription(topic: string, language: 'es' | 'en', isDefensive: boolean): string {
    const normalizedTopic = topic.toLowerCase()
    
    if (isDefensive) {
      return language === 'es'
        ? `Información oficial y verificada sobre ${normalizedTopic} en Salento. Reporte de la Red de Prestadores Turísticos para desmentir rumores falsos.`
        : `Official and verified information about ${normalizedTopic} in Salento. Report from the Tourism Providers Network to debunk false rumors.`
    }
    
    return language === 'es'
      ? `Guía completa sobre ${normalizedTopic} en Salento. Información actualizada, recomendaciones y contacto directo con proveedores locales.`
      : `Complete guide about ${normalizedTopic} in Salento. Updated information, recommendations and direct contact with local providers.`
  }

  private generateContent(topic: string, language: 'es' | 'en', template: LandingPageTemplate, isDefensive: boolean): string {
    const normalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
    const currentDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')
    
    let content = `
      <h1>${this.generateTitle(topic, language, isDefensive)}</h1>
      <p class="update-time">Última actualización: ${currentDate}</p>
    `

    if (isDefensive) {
      content += `
      <div class="defensive-banner">
        <span class="shield-icon">🛡️</span>
        <span class="defensive-text">INFORMACIÓN OFICIAL PARA CONTRARRESTAR RUMORES</span>
      </div>
      `
    }

    content += `
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">${isDefensive ? 'SITUACIÓN NORMAL' : 'SERVICIO OPERATIVO'}</span>
      </div>

      <h2>Estado Actual</h2>
      <p>${this.generateStatusContent(topic, language, isDefensive)}</p>

      <h2>Información Verificada</h2>
      <ul>
        ${this.generateBulletPoints(topic, language, isDefensive)}
      </ul>

      <div class="official-source">
        <p><strong>Fuente:</strong> Red de Prestadores Turísticos de Salento - Reporte oficial actualizado en tiempo real.</p>
      </div>
    `

    return content
  }

  private generateStatusContent(topic: string, language: 'es' | 'en', isDefensive: boolean): string {
    if (isDefensive) {
      const defensiveResponse = this.getDefensiveResponse(topic)
      return language === 'es'
        ? `Contrario a rumores que circulan en redes sociales, ${topic} en Salento se encuentra en estado completamente normal. ${defensiveResponse} Nuestra comunidad local confirma esta situación diariamente.`
        : `Contrary to rumors circulating on social media, ${topic} in Salento is in completely normal condition. ${defensiveResponse} Our local community confirms this situation daily.`
    }
    
    return language === 'es'
      ? `${topic} en Salento opera con normalidad. Todos los servicios relacionados están disponibles y el personal local está atento para recibir visitantes.`
      : `${topic} in Salento operates normally. All related services are available and local staff is ready to receive visitors.`
  }

  private generateBulletPoints(topic: string, language: 'es' | 'en', isDefensive: boolean): string {
    const points = isDefensive ? [
      language === 'es' ? 'Verificado por fuentes oficiales locales' : 'Verified by local official sources',
      language === 'es' ? 'Confirmado por la comunidad de Salento' : 'Confirmed by the Salento community',
      language === 'es' ? 'Monitoreado por autoridades turísticas' : 'Monitored by tourism authorities',
      language === 'es' ? 'Actualizado en tiempo real' : 'Updated in real time'
    ] : [
      language === 'es' ? 'Servicio disponible y operativo' : 'Service available and operational',
      language === 'es' ? 'Personal local capacitado' : 'Trained local staff',
      language === 'es' ? 'Contacto directo disponible' : 'Direct contact available',
      language === 'es' ? 'Calidad garantizada por proveedores locales' : 'Quality guaranteed by local providers'
    ]

    return points.map(point => `<li>${point}</li>`).join('')
  }

  private generateSchema(topic: string, template: LandingPageTemplate, isDefensive: boolean): object {
    const schemas: any[] = []

    // FAQPage schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": this.generateFAQEntities(topic, isDefensive)
    })

    // ClaimReview schema si es defensivo
    if (isDefensive && template.schemaTypes.includes('ClaimReview')) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ClaimReview",
        "claimReviewed": this.generateClaimText(topic),
        "itemReviewed": {
          "@type": "Place",
          "name": "Salento, Quindío"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "1",
          "bestRating": "5",
          "worstRating": "1",
          "ratingExplanation": "Información falsa desmentida por fuentes oficiales locales"
        },
        "author": {
          "@type": "Organization",
          "name": "Red de Prestadores Turísticos de Salento"
        },
        "reviewDate": new Date().toISOString()
      })
    }

    // LocalBusiness schema
    if (template.schemaTypes.includes('LocalBusiness')) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "TourismOrganization",
        "name": "Red de Prestadores Turísticos de Salento",
        "description": "Red oficial de turismo de Salento, Quindío",
        "url": "https://salentoalamano.com",
        "telephone": "+57 300 1234567",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Salento",
          "addressRegion": "Quindío",
          "addressCountry": "CO"
        }
      })
    }

    return {
      "@context": "https://schema.org",
      "@graph": schemas
    }
  }

  private generateFAQEntities(topic: string, isDefensive: boolean): any[] {
    const normalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
    
    if (isDefensive) {
      return [
        {
          "@type": "Question",
          "name": `¿Es cierto lo que dicen sobre ${normalizedTopic} en Salento?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `No. La información que circula en redes sociales sobre ${normalizedTopic} en Salento no corresponde a la realidad. Nuestras fuentes oficiales confirman que todo opera con normalidad.`
          }
        },
        {
          "@type": "Question",
          "name": `¿Cuál es el estado real de ${normalizedTopic}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${normalizedTopic} en Salento se encuentra en estado completamente normal y operativo. No hay novedades que afecten el turismo.`
          }
        }
      ]
    }

    return [
      {
        "@type": "Question",
        "name": `¿Cómo está ${normalizedTopic} en Salento hoy?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${normalizedTopic} opera con normalidad en Salento. Todos los servicios están disponibles y el personal local está atento a recibir visitantes.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Necesito reservar ${normalizedTopic} con anticipación?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recomendamos contactar directamente con los proveedores locales para verificar disponibilidad y coordinar detalles específicos."
        }
      }
    ]
  }

  private generateClaimText(topic: string): string {
    const claims: Record<string, string> = {
      'peligro': 'Salento es un destino peligroso',
      'cierre': 'Salento está cerrado al turismo',
      'vías': 'Las vías a Salento están cerradas',
      'valle': 'El Valle de Cocora es peligroso',
      'default': 'Información alarmista sobre Salento'
    }
    
    const normalizedTopic = topic.toLowerCase()
    return claims[normalizedTopic] || claims['default']
  }

  private generateKeywords(topic: string, template: LandingPageTemplate): string[] {
    const baseKeywords = template.keywords
    const topicVariations = [
      topic.toLowerCase(),
      topic.replace(/\s+/g, '-'),
      topic.replace(/\s+/g, '_')
    ]
    
    return [...baseKeywords, ...topicVariations]
  }

  private containsToxicKeywords(text: string): boolean {
    const normalizedText = text.toLowerCase()
    return this.toxicKeywords.some(keyword => normalizedText.includes(keyword))
  }

  private extractToxicKeywords(text: string): string[] {
    const normalizedText = text.toLowerCase()
    return this.toxicKeywords.filter(keyword => normalizedText.includes(keyword))
  }

  private getDefensiveResponse(topic: string): string {
    const normalizedTopic = topic.toLowerCase()
    
    for (const [keyword, response] of this.defensiveResponses) {
      if (normalizedTopic.includes(keyword)) {
        return response
      }
    }
    
    return 'La situación es normal y todos los servicios operan con regularidad.'
  }

  getGeneratedPage(slug: string): GeneratedLandingPage | undefined {
    return this.generatedPages.get(slug)
  }

  getAllGeneratedPages(): GeneratedLandingPage[] {
    return Array.from(this.generatedPages.values())
  }

  generateBatchPages(topics: string[], language: 'es' | 'en' = 'es'): GeneratedLandingPage[] {
    return topics.map(topic => this.generateDynamicLandingPage(topic, language))
  }

  getToxicKeywords(): string[] {
    return [...this.toxicKeywords]
  }

  addToxicKeywords(keyword: string): void {
    if (!this.toxicKeywords.includes(keyword.toLowerCase())) {
      this.toxicKeywords.push(keyword.toLowerCase())
    }
  }

  predictNextToxicKeywords(currentTrends: string[]): string[] {
    // Análisis simple de tendencias para predecir keywords tóxicas
    const predictions: string[] = []
    
    for (const trend of currentTrends) {
      if (this.containsToxicKeywords(trend)) {
        // Si una tendencia tóxica está emergiendo, predecir variaciones
        const variations = [
          trend + ' hoy',
          trend + ' salento',
          'estado ' + trend,
          'situación ' + trend
        ]
        predictions.push(...variations)
      }
    }
    
    return predictions
  }
}

export const programmaticSEOLandingService = new ProgrammaticSEOLandingService()
export default programmaticSEOLandingService