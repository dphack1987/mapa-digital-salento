interface Business {
  id: string
  name: string
  type: string
  whatsapp?: string
  phone?: string
  email?: string
  instagram?: string
  facebook?: string
}

interface BacklinkContent {
  platform: 'instagram' | 'facebook' | 'whatsapp' | 'google_business' | 'twitter' | 'linkedin'
  content: string
  hashtags: string[]
  callToAction: string
  url: string
  imageSuggestions: string[]
}

interface CampaignConfig {
  landingPage: string
  targetAudience: 'tourists' | 'locals' | 'both'
  tone: 'informative' | 'promotional' | 'community'
  language: 'es' | 'en'
}

class BacklinkGeneratorService {
  private config = {
    siteUrl: 'https://salentoalamano.com',
    organizationName: 'Red de Prestadores Turísticos de Salento'
  }

  private campaignTemplates = {
    es: {
      informative: {
        instagram: "📍 {business_name} - Verificación oficial del estado de Salento\n\n✅ Información actualizada y verificada por la red de prestadores locales\n\n🔗 {url}\n\n{hashtags}",
        facebook: "🟢 SALENTO OPERATIVO - Reporte Oficial\n\nDesde {business_name} confirmamos que Salento está recibiendo visitantes con normalidad. Toda la información oficial está disponible en:\n\n🔗 {url}\n\nComparte esta información para ayudar a otros viajeros.",
        whatsapp: "🟢 *SALENTO OPERATIVO* - Información Oficial\n\nDesde {business_name} confirmamos que Salento está recibiendo visitantes con normalidad.\n\nInformación oficial actualizada:\n👉 {url}\n\n{call_to_action}",
        google_business: "Estado actual de Salento - Información oficial y actualizada. Verificación de servicios operativos por la red de prestadores turísticos locales.",
        twitter: "🟢 Salento OPERATIVO - Información oficial: {url} #SalentoSeguro #TurismoResponsable",
        linkedin: "🟢 Actualización del estado turístico de Salento\n\nComo parte de la red de prestadores turísticos, {business_name} confirma que Salento está operativo al 100%. Información oficial disponible en: {url}\n\n#TurismoSostenible #EconomíaLocal #Salento"
      },
      promotional: {
        instagram: "🌟 ¡Síguenos en {business_name}!\n\n📍 Salento está vivo y esperándote\n✅ Servicios 100% operativos\n🔗 Información oficial: {url}\n\n{hashtags}",
        facebook: "🌟 VEN A SALENTO - ESTAMOS ABIERTOS\n\nDesde {business_name} los recibimos con los brazos abiertos. Todos nuestros servicios están operativos.\n\n🔗 Información oficial del estado de Salento: {url}\n\n¡Reserva tu visita hoy!",
        whatsapp: "🌟 *¡SÍGUENOS EN {business_name}!*\n\n📍 Salento está vivo y esperándote\n✅ Servicios 100% operativos\n\nInformación oficial: {url}\n\n{call_to_action}",
        google_business: "Servicios turísticos disponibles en Salento. Confirmación de operatividad y condiciones actuales del destino.",
        twitter: "🌟 Salento está vivo y esperándote - Servicios 100% operativos: {url} #Salento #TurismoColombia",
        linkedin: "🌟 Sostenibilidad turística en Salento\n\n{business_name} confirma la plena operatividad de nuestros servicios. Salento continúa siendo un destino seguro y acogedor para turistas nacionales e internacionales.\n\nInformación oficial: {url}"
      },
      community: {
        instagram: "💚 Juntos por Salento\n\nDesde {business_name} hacemos parte de la red que mantiene viva nuestra economía local. Comparte información oficial:\n\n🔗 {url}\n\n{hashtags}",
        facebook: "💚 COMUNIDAD DE SALENTO UNIDA\n\nLos comerciantes locales estamos comprometidos con ofrecer la mejor experiencia a nuestros visitantes. Información oficial del estado de nuestro pueblo:\n\n🔗 {url}\n\nSalento sigue siendo el destino especial que todos amamos.",
        whatsapp: "💚 *JUNTOS POR SALENTO*\n\nDesde {business_name} hacemos parte de la red que mantiene viva nuestra economía local.\n\nInformación oficial: {url}\n\n{call_to_action}",
        google_business: "Compromiso con la comunidad local y el turismo sostenible en Salento. Servicio verificado por la red de prestadores turísticos.",
        twitter: "💚 Comunidad de Salento unida - Información oficial: {url} #SalentoComunidad #EconomíaLocal",
        linkedin: "💚 Resiliencia y comunidad en Salento\n\nLa red de prestadores turísticos, incluyendo {business_name}, mantiene su compromiso con el desarrollo sostenible de nuestro destino. Trabajamos unidos para ofrecer experiencias auténticas y seguras.\n\nInformación oficial: {url}"
      }
    },
    en: {
      informative: {
        instagram: "📍 {business_name} - Official Salento Status Verification\n\n✅ Updated and verified information by local providers network\n\n🔗 {url}\n\n{hashtags}",
        facebook: "🟢 SALENTO OPERATIONAL - Official Report\n\nFrom {business_name} we confirm that Salento is receiving visitors normally. All official information is available at:\n\n🔗 {url}\n\nShare this information to help other travelers.",
        whatsapp: "🟢 *SALENTO OPERATIONAL* - Official Information\n\nFrom {business_name} we confirm that Salento is receiving visitors normally.\n\nOfficial updated information:\n👉 {url}\n\n{call_to_action}",
        google_business: "Current status of Salento - Official and updated information. Verification of operational services by the local tourism providers network.",
        twitter: "🟢 Salento OPERATIONAL - Official info: {url} #SalentoSafe #ResponsibleTourism",
        linkedin: "🟢 Salento tourism status update\n\nAs part of the tourism providers network, {business_name} confirms that Salento is 100% operational. Official information available at: {url}\n\n#SustainableTourism #LocalEconomy #Salento"
      },
      promotional: {
        instagram: "🌟 Follow us at {business_name}!\n\n📍 Salento is alive and waiting for you\n✅ Services 100% operational\n🔗 Official info: {url}\n\n{hashtags}",
        facebook: "🌟 COME TO SALENTO - WE'RE OPEN\n\nFrom {business_name} we welcome you with open arms. All our services are operational.\n\n🔗 Official Salento status information: {url}\n\nBook your visit today!",
        whatsapp: "🌟 *FOLLOW US AT {business_name}!*\n\n📍 Salento is alive and waiting for you\n✅ Services 100% operational\n\nOfficial information: {url}\n\n{call_to_action}",
        google_business: "Tourist services available in Salento. Confirmation of operability and current conditions of the destination.",
        twitter: "🌟 Salento is alive and waiting for you - Services 100% operational: {url} #Salento #ColombiaTourism",
        linkedin: "🌟 Tourism sustainability in Salento\n\n{business_name} confirms the full operability of our services. Salento continues to be a safe and welcoming destination for national and international tourists.\n\nOfficial information: {url}"
      },
      community: {
        instagram: "💚 Together for Salento\n\nFrom {business_name} we are part of the network that keeps our local economy alive. Share official information:\n\n🔗 {url}\n\n{hashtags}",
        facebook: "💚 SALENTO COMMUNITY UNITED\n\nLocal merchants are committed to offering the best experience to our visitors. Official information about the status of our town:\n\n🔗 {url}\n\nSalento continues to be the special destination we all love.",
        whatsapp: "💚 *TOGETHER FOR SALENTO*\n\nFrom {business_name} we are part of the network that keeps our local economy alive.\n\nOfficial information: {url}\n\n{call_to_action}",
        google_business: "Commitment to the local community and sustainable tourism in Salento. Service verified by the tourism providers network.",
        twitter: "💚 Salento community united - Official info: {url} #SalentoCommunity #LocalEconomy",
        linkedin: "💚 Resilience and community in Salento\n\nThe tourism providers network, including {business_name}, maintains its commitment to the sustainable development of our destination. We work together to offer authentic and safe experiences.\n\nOfficial information: {url}"
      }
    }
  }

  private hashtags = {
    es: {
      general: ['#Salento', '#Quindío', '#TurismoColombia', '#EconomíaLocal'],
      safety: ['#SalentoSeguro', '#TurismoResponsable', '#ColombiaSegura'],
      community: ['#SalentoComunidad', '#ApoyoLocal', '#ComercioJusto'],
      informative: ['#InfoOficial', '#Actualización', '#Reporte']
    },
    en: {
      general: ['#Salento', '#Quindio', '#ColombiaTourism', '#LocalEconomy'],
      safety: ['#SalentoSafe', '#ResponsibleTourism', '#SafeColombia'],
      community: ['#SalentoCommunity', '#LocalSupport', '#FairTrade'],
      informative: ['#OfficialInfo', '#Update', '#Report']
    }
  }

  private landingPages = {
    'estado-vias-salento-hoy': {
      es: 'Estado de las vías a Salento hoy',
      en: 'Road status to Salento today'
    },
    'hoteles-hostales-abiertos-salento': {
      es: 'Hoteles y hostales abiertos en Salento',
      en: 'Hotels and hostels open in Salento'
    },
    'valle-cocora-operativo-seguro': {
      es: 'Valle de Cocora operativo y seguro',
      en: 'Cocora Valley operational and safe'
    },
    'turismo-salento-seguro-hoy': {
      es: 'Turismo en Salento hoy - Situación actual',
      en: 'Tourism in Salento today - Current situation'
    },
    'transporte-jeeps-salento-operativo': {
      es: 'Transporte Jeeps a Salento y Valle de Cocora',
      en: 'Jeep transport to Salento and Cocora Valley'
    }
  }

  generateBacklinkContent(
    business: Business,
    config: CampaignConfig
  ): BacklinkContent[] {
    const results: BacklinkContent[] = []
    const templates = this.campaignTemplates[config.language][config.tone]
    const pageName = this.landingPages[config.landingPage as keyof typeof this.landingPages]?.[config.language] || config.landingPage
    const url = `${this.config.siteUrl}/${config.landingPage}`
    
    const hashtags = this.getHashtags(config.language, config.tone)
    const callToAction = this.getCallToAction(config.language, business.type)

    Object.entries(templates).forEach(([platform, template]) => {
      const content = template
        .replace('{business_name}', business.name)
        .replace('{url}', url)
        .replace('{call_to_action}', callToAction)
        .replace('{hashtags}', hashtags.join(' '))

      results.push({
        platform: platform as BacklinkContent['platform'],
        content,
        hashtags,
        callToAction,
        url,
        imageSuggestions: this.getImageSuggestions(platform, config.tone)
      })
    })

    return results
  }

  private getHashtags(language: 'es' | 'en', tone: string): string[] {
    const langHashtags = this.hashtags[language]
    const toneSpecific = tone === 'informative' ? langHashtags.informative : 
                        tone === 'community' ? langHashtags.community : 
                        langHashtags.safety
    
    return [...langHashtags.general, ...toneSpecific]
  }

  private getCallToAction(language: 'es' | 'en', businessType: string): string {
    const actions = {
      es: {
        restaurant: '🍽️ ¡Contáctanos para reservar tu mesa!',
        hotel: '🏨 ¡Reserva tu habitación hoy!',
        guide: '🧭 ¡Agenda tu tour con nosotros!',
        shop: '🛍️ ¡Visítanos y lleva un pedacito de Salento!',
        transport: '🚗 ¡Viaja seguro con nosotros!',
        default: '📞 ¡Contáctanos para más información!'
      },
      en: {
        restaurant: '🍽️ Contact us to reserve your table!',
        hotel: '🏨 Book your room today!',
        guide: '🧭 Schedule your tour with us!',
        shop: '🛍️ Visit us and take a piece of Salento!',
        transport: '🚗 Travel safely with us!',
        default: '📞 Contact us for more information!'
      }
    }

    const typeActions = actions[language]
    return typeActions[businessType as keyof typeof typeActions] || typeActions.default
  }

  private getImageSuggestions(platform: string, tone: string): string[] {
    const suggestions = {
      instagram: [
        'Foto del negocio con el staff sonriendo',
        'Imagen del paisaje local (Valle de Cocora, calles coloridas)',
        'Foto de productos/servicios destacados',
        'Selfie con clientes satisfechos'
      ],
      facebook: [
        'Foto panorámica del negocio',
        'Imagen del equipo trabajando',
        'Foto de clientes disfrutando el servicio',
        'Imagen del pueblo de Salento'
      ],
      whatsapp: [
        'Foto del logo del negocio',
        'Imagen de servicios principales',
        'Foto del equipo',
        'Imagen del establecimiento'
      ],
      google_business: [
        'Foto de fachada del negocio',
        'Interior del establecimiento',
        'Productos/servicios principales',
        'Equipo atendiendo'
      ],
      twitter: [
        'Foto del negocio',
        'Imagen del paisaje local',
        'Foto de servicios',
        'Imagen del equipo'
      ],
      linkedin: [
        'Foto profesional del equipo',
        'Imagen del negocio en contexto',
        'Foto de servicios/instalaciones',
        'Imagen de colaboración comunitaria'
      ]
    }

    return suggestions[platform as keyof typeof suggestions] || []
  }

  generateCampaignReport(businesses: Business[], config: CampaignConfig): {
    totalBusinesses: number
    platforms: string[]
    estimatedReach: number
    contentPieces: number
    recommendations: string[]
  } {
    const totalBusinesses = businesses.length
    const platforms = Object.keys(this.campaignTemplates[config.language][config.tone])
    const contentPieces = totalBusinesses * platforms.length
    
    // Estimación conservadora de alcance
    const estimatedReach = businesses.reduce((total, business) => {
      const followers = 
        (business.instagram ? 500 : 0) +
        (business.facebook ? 1000 : 0) +
        (business.whatsapp ? 200 : 0)
      return total + followers
    }, 0)

    const recommendations = [
      'Publicar simultáneamente en todas las plataformas para mayor impacto',
      'Usar imágenes auténticas del negocio y del pueblo',
      'Incluir enlaces directos a WhatsApp para facilitar contacto',
      'Monitorear interacciones y responder comentarios rápidamente',
      'Actualizar contenido semanalmente para mantener frescura',
      'Usar geolocalización en todas las publicaciones'
    ]

    return {
      totalBusinesses,
      platforms,
      estimatedReach,
      contentPieces,
      recommendations
    }
  }

  generateTrackingLinks(businessId: string, landingPage: string): {
    utmParams: string
    fullUrl: string
    shortUrl: string
  } {
    const utmParams = `?utm_source=business_backlink&utm_medium=social&utm_campaign=${landingPage}&utm_content=${businessId}`
    const fullUrl = `${this.config.siteUrl}/${landingPage}${utmParams}`
    const shortUrl = `${this.config.siteUrl}/${landingPage}` // En producción, usar un acortador real

    return {
      utmParams,
      fullUrl,
      shortUrl
    }
  }

  generateWhatsAppStatus(business: Business, landingPage: string, language: 'es' | 'en' = 'es'): string {
    const pageName = this.landingPages[landingPage as keyof typeof this.landingPages]?.[language] || landingPage
    const url = `${this.config.siteUrl}/${landingPage}`
    
    if (language === 'es') {
      return `🟢 *SALENTO OPERATIVO* - ${business.name}\n\n✅ Confirmamos que Salento está recibiendo visitantes con normalidad.\n\n📋 ${pageName}\n🔗 ${url}\n\n📞 ${business.whatsapp || business.phone || 'Contáctanos'}`
    } else {
      return `🟢 *SALENTO OPERATIONAL* - ${business.name}\n\n✅ We confirm that Salento is receiving visitors normally.\n\n📋 ${pageName}\n🔗 ${url}\n\n📞 ${business.whatsapp || business.phone || 'Contact us'}`
    }
  }

  generateBatchContent(businesses: Business[], config: CampaignConfig): Map<string, BacklinkContent[]> {
    const batchContent = new Map<string, BacklinkContent[]>()
    
    businesses.forEach(business => {
      const content = this.generateBacklinkContent(business, config)
      batchContent.set(business.id, content)
    })
    
    return batchContent
  }

  exportToCSV(businesses: Business[], config: CampaignConfig): string {
    const headers = ['Business ID', 'Business Name', 'Platform', 'Content', 'Hashtags', 'URL', 'Call to Action']
    const rows: string[] = [headers.join(',')]
    
    businesses.forEach(business => {
      const content = this.generateBacklinkContent(business, config)
      content.forEach(item => {
        const row = [
          business.id,
          business.name,
          item.platform,
          `"${item.content.replace(/"/g, '""')}"`,
          item.hashtags.join(';'),
          item.url,
          item.callToAction
        ]
        rows.push(row.join(','))
      })
    })
    
    return rows.join('\n')
  }
}

const backlinkGeneratorService = new BacklinkGeneratorService()
export default backlinkGeneratorService