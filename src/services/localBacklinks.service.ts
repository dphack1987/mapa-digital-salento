// Servicio de Backlinks Locales para Aliados
// Sistema para que hoteles, restaurantes y transportadores generen enlaces hacia la plataforma oficial

interface AllyBusiness {
  id: string
  name: string
  type: 'hotel' | 'restaurant' | 'transport' | 'guide' | 'shop' | 'experience'
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    whatsapp?: string
  }
  verified: boolean
  joinDate: string
}

interface BacklinkOption {
  type: 'badge' | 'widget' | 'text-link' | 'qr-code'
  name: string
  description: string
  code: string
  preview: string
  size?: 'small' | 'medium' | 'large'
}

interface BacklinkStats {
  allyId: string
  clicks: number
  impressions: number
  conversionRate: number
  lastClick: string
  topReferrers: string[]
}

class LocalBacklinksService {
  private allies: AllyBusiness[] = []
  private backlinkOptions: BacklinkOption[] = []
  private backlinkStats: Map<string, BacklinkStats> = new Map()
  private initialized = false

  /**
   * Inicializar el servicio de backlinks locales
   */
  initialize() {
    if (this.initialized) return

    this.allies = this.loadSampleAllies()
    this.backlinkOptions = this.generateBacklinkOptions()
    this.initialized = true

    console.log('🔗 Sistema de Backlinks Locales inicializado - Aliados conectados')
  }

  /**
   * Cargar aliados de muestra
   */
  private loadSampleAllies(): AllyBusiness[] {
    return [
      {
        id: 'hotel-1',
        name: 'Hotel Camino Nacional',
        type: 'hotel',
        website: 'https://hotelcaminonacional.com',
        socialMedia: {
          facebook: 'hotelcaminonacional',
          instagram: '@hotelcaminonacional',
          whatsapp: '573000000000'
        },
        verified: true,
        joinDate: '2024-01-15'
      },
      {
        id: 'hotel-2',
        name: 'Finca Hotel El Ocaso',
        type: 'hotel',
        website: 'https://fincahotelocaso.com',
        socialMedia: {
          instagram: '@fincahotelocaso',
          whatsapp: '573000000001'
        },
        verified: true,
        joinDate: '2024-02-20'
      },
      {
        id: 'restaurant-1',
        name: 'Restaurantes de Trucha Salento',
        type: 'restaurant',
        socialMedia: {
          facebook: 'truchassalento',
          instagram: '@truchassalento',
          whatsapp: '573000000002'
        },
        verified: true,
        joinDate: '2024-03-10'
      },
      {
        id: 'transport-1',
        name: 'Jeeps Willys Salento',
        type: 'transport',
        socialMedia: {
          facebook: 'jeepswillyssalento',
          whatsapp: '573000000003'
        },
        verified: true,
        joinDate: '2024-01-20'
      },
      {
        id: 'guide-1',
        name: 'Guías de Turismo Local',
        type: 'guide',
        socialMedia: {
          instagram: '@guiasturismosalento',
          whatsapp: '573000000004'
        },
        verified: true,
        joinDate: '2024-04-05'
      }
    ]
  }

  /**
   * Generar opciones de backlinks para aliados
   */
  private generateBacklinkOptions(): BacklinkOption[] {
    const baseUrl = 'https://salentoalamano.com'
    
    return [
      // BADGE OFICIAL
      {
        type: 'badge',
        name: 'Badge Oficial Verificado',
        description: 'Badge que muestra que tu negocio es parte de la red oficial de turismo de Salento',
        code: `<a href="${baseUrl}" title="Salento a la Mano - Turismo Oficial" target="_blank" rel="noopener noreferrer">
  <img src="${baseUrl}/badges/official-ally-badge.png" alt="Aliado Oficial Salento a la Mano" style="width: 120px; height: auto; border: 0;" />
</a>`,
        preview: `${baseUrl}/badges/official-ally-badge.png`,
        size: 'medium'
      },
      // WIDGET DE ESTADO
      {
        type: 'widget',
        name: 'Widget de Estado en Vivo',
        description: 'Widget que muestra el estado actual de Salento en tiempo real',
        code: `<div id="salento-status-widget" data-ally-id="YOUR_ID">
  <a href="${baseUrl}" title="Estado de Salento - Tiempo Real" target="_blank" rel="noopener noreferrer">
    <div style="background: #27362b; color: #f5f1e8; padding: 12px; border-radius: 8px; font-family: Arial, sans-serif; max-width: 300px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 20px;">🌿</span>
        <strong style="font-size: 14px;">Salento a la Mano</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 6px;">
        <span style="color: #4ade80;">✅</span> Salento: ABIERTO
      </div>
      <div style="font-size: 12px; margin-bottom: 6px;">
        <span style="color: #4ade80;">✅</span> Valle Cocora: OPERATIVO
      </div>
      <div style="font-size: 10px; color: #999; margin-top: 8px;">
        Información oficial en tiempo real
      </div>
    </div>
  </a>
</div>
<script src="${baseUrl}/widgets/status-widget.js" async></script>`,
        preview: `${baseUrl}/widgets/status-widget-preview.png`,
        size: 'medium'
      },
      // ENLACE DE TEXTO SEO
      {
        type: 'text-link',
        name: 'Enlace de Texto SEO',
        description: 'Enlace de texto optimizado para SEO con keywords estratégicas',
        code: `<a href="${baseUrl}" title="Salento Abierto Hoy - Turismo Oficial y Seguro" target="_blank" rel="noopener noreferrer" style="color: #27362b; text-decoration: none; font-weight: 600;">
  🌿 Salento Abierto Hoy - Información Oficial de Turismo
</a>`,
        preview: '🌿 Salento Abierto Hoy - Información Oficial de Turismo',
        size: 'small'
      },
      // BOTÓN DE VERIFICACIÓN
      {
        type: 'badge',
        name: 'Botón de Verificación',
        description: 'Botón que verifica la información oficial de Salento',
        code: `<a href="${baseUrl}/verificacion" title="Verificar Información Oficial de Salento" target="_blank" rel="noopener noreferrer">
  <button style="background: #e76c52; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
    <span>🛡️</span>
    <span>Verificar Info Oficial</span>
  </button>
</a>`,
        preview: '🛡️ Verificar Info Oficial',
        size: 'small'
      },
      // WIDGET DE PREGUNTAS FRECUENTES
      {
        type: 'widget',
        name: 'Widget FAQ Oficial',
        description: 'Widget con preguntas frecuentes y respuestas oficiales',
        code: `<div id="salento-faq-widget" data-ally-id="YOUR_ID">
  <a href="${baseUrl}/faq-salento-oficial" title="FAQ Oficial Salento" target="_blank" rel="noopener noreferrer">
    <div style="background: #f5f1e8; color: #27362b; padding: 16px; border-radius: 8px; font-family: Arial, sans-serif; max-width: 350px; border: 2px solid #27362b;">
      <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">
        ❓ ¿Está Salento abierto hoy?
      </div>
      <div style="font-size: 12px; color: #4ade80; margin-bottom: 8px;">
        ✅ SÍ - Confirmación oficial
      </div>
      <div style="font-size: 11px; color: #666;">
        Ver todas las preguntas frecuentes oficiales →
      </div>
    </div>
  </a>
</div>
<script src="${baseUrl}/widgets/faq-widget.js" async></script>`,
        preview: `${baseUrl}/widgets/faq-widget-preview.png`,
        size: 'large'
      },
      // CÓDIGO QR COMPARTIBLE
      {
        type: 'qr-code',
        name: 'Código QR de Acceso Rápido',
        description: 'QR code que lleva directamente a la información oficial',
        code: `<a href="${baseUrl}" title="Escanear para Info Oficial de Salento" target="_blank" rel="noopener noreferrer">
  <img src="${baseUrl}/qr/salento-oficial-qr.png" alt="QR Salento Oficial" style="width: 150px; height: 150px; border: 2px solid #27362b; border-radius: 8px;" />
</a>
<p style="font-size: 10px; color: #666; margin-top: 4px; text-align: center;">
  Escanea para información oficial
</p>`,
        preview: `${baseUrl}/qr/salento-oficial-qr.png`,
        size: 'medium'
      },
      // WIDGET DE NOTICIAS
      {
        type: 'widget',
        name: 'Widget de Noticias Oficiales',
        description: 'Widget con las últimas noticias oficiales de Salento',
        code: `<div id="salento-news-widget" data-ally-id="YOUR_ID">
  <a href="${baseUrl}/noticias-oficiales" title="Noticias Oficiales Salento" target="_blank" rel="noopener noreferrer">
    <div style="background: linear-gradient(135deg, #27362b 0%, #1a241c 100%); color: #f5f1e8; padding: 16px; border-radius: 8px; font-family: Arial, sans-serif; max-width: 320px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="font-size: 18px;">📰</span>
        <strong style="font-size: 14px;">Noticias Oficiales</strong>
      </div>
      <div style="font-size: 11px; margin-bottom: 8px; line-height: 1.4;">
        🚨 CONFIRMACIÓN: Salento completamente abierto y operativo
      </div>
      <div style="font-size: 10px; color: #999; margin-top: 8px;">
        Actualizado en tiempo real →
      </div>
    </div>
  </a>
</div>
<script src="${baseUrl}/widgets/news-widget.js" async></script>`,
        preview: `${baseUrl}/widgets/news-widget-preview.png`,
        size: 'large'
      },
      // TEXTO ANCLA SEO AVANZADO
      {
        type: 'text-link',
        name: 'Texto Ancla SEO Avanzado',
        description: 'Enlace con texto ancla optimizado para búsquedas específicas',
        code: `<a href="${baseUrl}" title="Estado Actual de Salento: Hoteles Abiertos, Vías Libres y Valle de Cocora Operando" target="_blank" rel="noopener noreferrer" style="color: #27362b; text-decoration: underline; font-weight: 500;">
  Estado Actual de Salento: Hoteles Abiertos, Vías Libres y Valle de Cocora Operando al 100%
</a>`,
        preview: 'Estado Actual de Salento: Hoteles Abiertos, Vías Libres y Valle de Cocora Operando al 100%',
        size: 'small'
      }
    ]
  }

  /**
   * Obtener todas las opciones de backlinks
   */
  getBacklinkOptions(): BacklinkOption[] {
    return [...this.backlinkOptions]
  }

  /**
   * Obtener opciones de backlinks por tipo
   */
  getBacklinkOptionsByType(type: BacklinkOption['type']): BacklinkOption[] {
    return this.backlinkOptions.filter(option => option.type === type)
  }

  /**
   * Obtener código de backlink personalizado para un aliado
   */
  getCustomBacklinkCode(allyId: string, optionType: BacklinkOption['type']): string {
    const ally = this.allies.find(a => a.id === allyId)
    const option = this.backlinkOptions.find(o => o.type === optionType)
    
    if (!ally || !option) return ''

    let customCode = option.code
    
    // Reemplazar placeholder de ID de aliado
    customCode = customCode.replace(/YOUR_ID/g, allyId)
    
    // Agregar parámetros de tracking
    const trackingParams = `?utm_source=${ally.type}&utm_medium=backlink&utm_campaign=seo_defensivo&utm_content=${optionType}`
    customCode = customCode.replace(/href="([^"]*)"/g, (match, url) => {
      if (url.includes('salentoalamano.com')) {
        return `href="${url}${trackingParams}"`
      }
      return match
    })

    return customCode
  }

  /**
   * Registrar un nuevo aliado
   */
  registerAlly(business: Omit<AllyBusiness, 'verified' | 'joinDate'>): AllyBusiness {
    const newAlly: AllyBusiness = {
      ...business,
      verified: false, // Requiere verificación manual
      joinDate: new Date().toISOString()
    }

    this.allies.push(newAlly)
    
    // Inicializar estadísticas
    this.backlinkStats.set(newAlly.id, {
      allyId: newAlly.id,
      clicks: 0,
      impressions: 0,
      conversionRate: 0,
      lastClick: '',
      topReferrers: []
    })

    return newAlly
  }

  /**
   * Verificar un aliado
   */
  verifyAlly(allyId: string): boolean {
    const ally = this.allies.find(a => a.id === allyId)
    if (ally) {
      ally.verified = true
      return true
    }
    return false
  }

  /**
   * Obtener todos los aliados
   */
  getAllies(): AllyBusiness[] {
    return [...this.allies]
  }

  /**
   * Obtener aliados por tipo
   */
  getAlliesByType(type: AllyBusiness['type']): AllyBusiness[] {
    return this.allies.filter(ally => ally.type === type)
  }

  /**
   * Obtener estadísticas de backlinks de un aliado
   */
  getBacklinkStats(allyId: string): BacklinkStats | undefined {
    return this.backlinkStats.get(allyId)
  }

  /**
   * Registrar un clic en backlink
   */
  trackBacklinkClick(allyId: string, referrer: string = 'direct') {
    const stats = this.backlinkStats.get(allyId)
    if (stats) {
      stats.clicks++
      stats.lastClick = new Date().toISOString()
      
      // Actualizar top referrers
      if (!stats.topReferrers.includes(referrer)) {
        stats.topReferrers.push(referrer)
        if (stats.topReferrers.length > 5) {
          stats.topReferrers.shift()
        }
      }
      
      // Recalcular tasa de conversión
      stats.conversionRate = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0
      
      this.backlinkStats.set(allyId, stats)
    }
  }

  /**
   * Registrar una impresión de backlink
   */
  trackBacklinkImpression(allyId: string) {
    const stats = this.backlinkStats.get(allyId)
    if (stats) {
      stats.impressions++
      stats.conversionRate = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0
      this.backlinkStats.set(allyId, stats)
    }
  }

  /**
   * Generar dashboard de backlinks para un aliado
   */
  generateAllyDashboard(allyId: string): {
    ally: AllyBusiness | undefined
    stats: BacklinkStats | undefined
    recommendedOptions: BacklinkOption[]
    performance: {
      totalClicks: number
      totalImpressions: number
      averageConversionRate: number
    }
  } {
    const ally = this.allies.find(a => a.id === allyId)
    const stats = this.backlinkStats.get(allyId)
    
    // Recomendar opciones basadas en el tipo de negocio
    const recommendedOptions = this.backlinkOptions.filter(option => {
      if (ally?.type === 'hotel') {
        return ['badge', 'widget', 'qr-code'].includes(option.type)
      }
      if (ally?.type === 'restaurant') {
        return ['badge', 'text-link', 'widget'].includes(option.type)
      }
      return true
    })

    // Calcular performance general
    const allStats = Array.from(this.backlinkStats.values())
    const performance = {
      totalClicks: allStats.reduce((sum, s) => sum + s.clicks, 0),
      totalImpressions: allStats.reduce((sum, s) => sum + s.impressions, 0),
      averageConversionRate: allStats.length > 0 
        ? allStats.reduce((sum, s) => sum + s.conversionRate, 0) / allStats.length 
        : 0
    }

    return {
      ally,
      stats,
      recommendedOptions,
      performance
    }
  }

  /**
   * Generar código de integración para redes sociales
   */
  generateSocialMediaIntegration(allyId: string): {
    facebook: string
    instagram: string
    whatsapp: string
  } {
    const ally = this.allies.find(a => a.id === allyId)
    const baseUrl = 'https://salentoalamano.com'
    const trackingParams = `?utm_source=social&utm_medium=${ally?.type}_backlink&utm_campaign=seo_defensivo`

    return {
      facebook: `🌿 Salento está ABIERTO y operativo. Información oficial confirmada: ${baseUrl}${trackingParams} #SalentoAbierto #TurismoSeguro`,
      instagram: `🌿✅ CONFIRMACIÓN OFICIAL: Salento completamente abierto y operativo. Valle de Cocora accesible al 100%. Info verificada: ${baseUrl}${trackingParams} #Salento #ValleDeCocora #TurismoColombia`,
      whatsapp: `🌿 *INFORMACIÓN OFICIAL*\n\n✅ Salento: ABIERTO\n✅ Valle Cocora: OPERATIVO\n✅ Hoteles: DISPONIBLES\n\nInformación verificada: ${baseUrl}${trackingParams}`
    }
  }

  /**
   * Generar reporte de impacto SEO
   */
  generateSEOImpactReport(): {
    totalAllies: number
    verifiedAllies: number
    totalBacklinks: number
    estimatedDAImpact: number
    keywordCoverage: string[]
    topPerformingAllies: Array<{ name: string; clicks: number; conversionRate: number }>
  } {
    const verifiedAllies = this.allies.filter(a => a.verified).length
    const totalBacklinks = this.allies.length * this.backlinkOptions.length
    
    // Estimar impacto en Domain Authority (0-100)
    const estimatedDAImpact = Math.min(100, (verifiedAllies * 2) + (totalBacklinks * 0.5))
    
    // Cobertura de keywords
    const keywordCoverage = [
      'salento abierto hoy',
      'valle cocora operativo',
      'hoteles salento abiertos',
      'estado actual salento',
      'turismo seguro salento',
      'transporte salento disponible',
      'restaurantes salento abiertos'
    ]

    // Top aliados por performance
    const topPerformingAllies = Array.from(this.backlinkStats.entries())
      .map(([allyId, stats]) => ({
        name: this.allies.find(a => a.id === allyId)?.name || 'Unknown',
        clicks: stats.clicks,
        conversionRate: stats.conversionRate
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    return {
      totalAllies: this.allies.length,
      verifiedAllies,
      totalBacklinks,
      estimatedDAImpact,
      keywordCoverage,
      topPerformingAllies
    }
  }

  /**
   * Generar script de tracking para backlinks
   */
  generateTrackingScript(): string {
    return `
// Script de tracking para backlinks de aliados
(function() {
  function trackBacklink(event) {
    const allyId = event.currentTarget.dataset.allyId;
    const backlinkType = event.currentTarget.dataset.backlinkType;
    
    if (allyId && backlinkType) {
      // Enviar datos al servidor
      fetch('https://salentoalamano.com/api/backlink-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allyId: allyId,
          backlinkType: backlinkType,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'direct'
        })
      }).catch(error => console.error('Error tracking backlink:', error));
    }
  }

  // Inicializar tracking cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    const backlinks = document.querySelectorAll('[data-ally-id]');
    backlinks.forEach(backlink => {
      backlink.addEventListener('click', trackBacklink);
      
      // Track impresión
      const allyId = backlink.dataset.allyId;
      if (allyId) {
        fetch('https://salentoalamano.com/api/backlink-impression', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            allyId: allyId,
            timestamp: new Date().toISOString()
          })
        }).catch(error => console.error('Error tracking impression:', error));
      }
    });
  });
})();
`
  }
}

// Exportar instancia singleton
export const localBacklinksService = new LocalBacklinksService()
export default localBacklinksService