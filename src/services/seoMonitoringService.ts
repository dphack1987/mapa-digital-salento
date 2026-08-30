interface KeywordData {
  keyword: string
  position: number
  searchVolume: number
  competition: 'low' | 'medium' | 'high'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
  targetLandingPage: string
}

interface SERPTracking {
  keyword: string
  date: Date
  position: number
  organicClicks: number
  impressions: number
  ctr: number
  competitors: string[]
}

interface ContentPerformance {
  url: string
  title: string
  views: number
  uniqueVisitors: number
  avgTimeOnPage: number
  bounceRate: number
  conversions: number
  lastUpdated: Date
}

interface BacklinkMetrics {
  totalBacklinks: number
  uniqueDomains: number
  averageDomainAuthority: number
  newBacklinks: number
  lostBacklinks: number
  lastUpdated: Date
}

interface SEOAlert {
  type: 'position_drop' | 'content_issue' | 'technical_issue' | 'opportunity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  recommendation: string
  createdAt: Date
  resolved: boolean
}

interface SEOReport {
  period: string
  overallScore: number
  keywords: KeywordData[]
  contentPerformance: ContentPerformance[]
  backlinkMetrics: BacklinkMetrics
  alerts: SEOAlert[]
  recommendations: string[]
  generatedAt: Date
}

class SEOMonitoringService {
  private keywords: Map<string, KeywordData> = new Map()
  private serpHistory: SERPTracking[] = []
  private contentPerformance: Map<string, ContentPerformance> = new Map()
  private backlinkMetrics: BacklinkMetrics | null = null
  private alerts: SEOAlert[] = []
  private initialized = false

  initialize() {
    if (this.initialized) return
    this.generateSampleData()
    this.initialized = true
  }

  private generateSampleData() {
    // Keywords principales para Salento
    const sampleKeywords: KeywordData[] = [
      {
        keyword: 'estado vías salento',
        position: 1,
        searchVolume: 1200,
        competition: 'medium',
        trend: 'up',
        lastUpdated: new Date(),
        targetLandingPage: 'estado-vias-salento-hoy'
      },
      {
        keyword: 'hoteles salento abiertos',
        position: 2,
        searchVolume: 890,
        competition: 'high',
        trend: 'stable',
        lastUpdated: new Date(),
        targetLandingPage: 'hoteles-hostales-abiertos-salento'
      },
      {
        keyword: 'valle cocora seguro',
        position: 1,
        searchVolume: 2100,
        competition: 'medium',
        trend: 'up',
        lastUpdated: new Date(),
        targetLandingPage: 'valle-cocora-operativo-seguro'
      },
      {
        keyword: 'turismo salento hoy',
        position: 3,
        searchVolume: 1500,
        competition: 'high',
        trend: 'up',
        lastUpdated: new Date(),
        targetLandingPage: 'turismo-salento-seguro-hoy'
      },
      {
        keyword: 'salento seguro visitar',
        position: 2,
        searchVolume: 1800,
        competition: 'medium',
        trend: 'stable',
        lastUpdated: new Date(),
        targetLandingPage: 'turismo-salento-seguro-hoy'
      },
      {
        keyword: 'transporte jeeps salento',
        position: 1,
        searchVolume: 650,
        competition: 'low',
        trend: 'up',
        lastUpdated: new Date(),
        targetLandingPage: 'transporte-jeeps-salento-operativo'
      },
      {
        keyword: 'salento quindío turismo',
        position: 4,
        searchVolume: 3200,
        competition: 'high',
        trend: 'down',
        lastUpdated: new Date(),
        targetLandingPage: 'turismo-salento-seguro-hoy'
      },
      {
        keyword: 'alojamiento salento',
        position: 5,
        searchVolume: 2400,
        competition: 'high',
        trend: 'stable',
        lastUpdated: new Date(),
        targetLandingPage: 'hoteles-hostales-abiertos-salento'
      }
    ]

    sampleKeywords.forEach(kw => {
      this.keywords.set(kw.keyword, kw)
    })

    // Historial de SERP
    const sampleSERP: SERPTracking[] = [
      {
        keyword: 'estado vías salento',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        position: 3,
        organicClicks: 145,
        impressions: 890,
        ctr: 0.16,
        competitors: ['blog-viajero.com', 'guia-turismo.co', 'foro-colombia.net']
      },
      {
        keyword: 'estado vías salento',
        date: new Date(),
        position: 1,
        organicClicks: 320,
        impressions: 1200,
        ctr: 0.27,
        competitors: ['blog-viajero.com', 'guia-turismo.co']
      },
      {
        keyword: 'valle cocora seguro',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        position: 2,
        organicClicks: 180,
        impressions: 1950,
        ctr: 0.09,
        competitors: ['eco-turismo.com', 'colombia-travel.co']
      },
      {
        keyword: 'valle cocora seguro',
        date: new Date(),
        position: 1,
        organicClicks: 450,
        impressions: 2100,
        ctr: 0.21,
        competitors: ['eco-turismo.com']
      }
    ]

    this.serpHistory = sampleSERP

    // Performance de contenido
    const sampleContent: ContentPerformance[] = [
      {
        url: 'estado-vias-salento-hoy',
        title: 'Estado de las vías a Salento hoy - Reporte Oficial',
        views: 1250,
        uniqueVisitors: 980,
        avgTimeOnPage: 180,
        bounceRate: 0.35,
        conversions: 85,
        lastUpdated: new Date()
      },
      {
        url: 'valle-cocora-operativo-seguro',
        title: 'Valle de Cocora operativo y seguro - Información Oficial',
        views: 2100,
        uniqueVisitors: 1850,
        avgTimeOnPage: 240,
        bounceRate: 0.28,
        conversions: 145,
        lastUpdated: new Date()
      },
      {
        url: 'turismo-salento-seguro-hoy',
        title: 'Turismo en Salento hoy - Situación Actual y Seguridad',
        views: 1680,
        uniqueVisitors: 1420,
        avgTimeOnPage: 195,
        bounceRate: 0.32,
        conversions: 110,
        lastUpdated: new Date()
      }
    ]

    sampleContent.forEach(content => {
      this.contentPerformance.set(content.url, content)
    })

    // Métricas de backlinks
    this.backlinkMetrics = {
      totalBacklinks: 145,
      uniqueDomains: 38,
      averageDomainAuthority: 32,
      newBacklinks: 12,
      lostBacklinks: 3,
      lastUpdated: new Date()
    }

    // Alertas iniciales
    this.alerts = [
      {
        type: 'opportunity',
        severity: 'medium',
        message: 'Keyword "salento quindío turismo" tiene potencial de mejora',
        recommendation: 'Optimizar contenido para esta keyword y crear backlinks específicos',
        createdAt: new Date(),
        resolved: false
      },
      {
        type: 'position_drop',
        severity: 'low',
        message: 'Keyword "alojamiento salento" bajó del puesto 3 al 5',
        recommendation: 'Revisar competencia y actualizar contenido con información más fresca',
        createdAt: new Date(),
        resolved: false
      }
    ]
  }

  getKeywordData(keyword: string): KeywordData | undefined {
    return this.keywords.get(keyword)
  }

  getAllKeywords(): KeywordData[] {
    return Array.from(this.keywords.values())
  }

  getKeywordsByPosition(range: { min: number; max: number }): KeywordData[] {
    return Array.from(this.keywords.values()).filter(
      kw => kw.position >= range.min && kw.position <= range.max
    )
  }

  getKeywordsByTrend(trend: 'up' | 'down' | 'stable'): KeywordData[] {
    return Array.from(this.keywords.values()).filter(kw => kw.trend === trend)
  }

  getSERPHistory(keyword: string): SERPTracking[] {
    return this.serpHistory.filter(tracking => tracking.keyword === keyword)
  }

  getContentPerformance(url: string): ContentPerformance | undefined {
    return this.contentPerformance.get(url)
  }

  getAllContentPerformance(): ContentPerformance[] {
    return Array.from(this.contentPerformance.values())
  }

  getBacklinkMetrics(): BacklinkMetrics | null {
    return this.backlinkMetrics
  }

  getActiveAlerts(): SEOAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  getAlertsBySeverity(severity: SEOAlert['severity']): SEOAlert[] {
    return this.alerts.filter(alert => alert.severity === severity && !alert.resolved)
  }

  resolveAlert(alertId: number): boolean {
    if (alertId >= 0 && alertId < this.alerts.length) {
      this.alerts[alertId].resolved = true
      return true
    }
    return false
  }

  addAlert(alert: Omit<SEOAlert, 'createdAt' | 'resolved'>): void {
    this.alerts.push({
      ...alert,
      createdAt: new Date(),
      resolved: false
    })
  }

  calculateOverallScore(): number {
    let score = 0
    let factors = 0

    // Puntuación de keywords (posición promedio)
    const avgPosition = Array.from(this.keywords.values())
      .reduce((sum, kw) => sum + kw.position, 0) / this.keywords.size
    score += Math.max(0, 100 - (avgPosition - 1) * 10)
    factors++

    // Tendencia de keywords
    const trendingUp = this.getKeywordsByTrend('up').length
    const trendingDown = this.getKeywordsByTrend('down').length
    const trendScore = (trendingUp - trendingDown) / this.keywords.size * 100
    score += Math.max(0, trendScore)
    factors++

    // Performance de contenido
    const avgCTR = this.serpHistory.reduce((sum, tracking) => sum + tracking.ctr, 0) / this.serpHistory.length
    score += avgCTR * 100
    factors++

    // Backlinks
    if (this.backlinkMetrics) {
      const backlinkScore = Math.min(100, this.backlinkMetrics.totalBacklinks / 2)
      score += backlinkScore
      factors++
    }

    // Alertas críticas restan puntos
    const criticalAlerts = this.getAlertsBySeverity('critical').length
    score -= criticalAlerts * 15
    factors++

    return Math.max(0, Math.min(100, score / factors))
  }

  generateWeeklyReport(): SEOReport {
    const keywords = this.getAllKeywords()
    const contentPerformance = this.getAllContentPerformance()
    const backlinkMetrics = this.getBacklinkMetrics()
    const alerts = this.getActiveAlerts()

    const recommendations = this.generateRecommendations()

    return {
      period: 'Última semana',
      overallScore: this.calculateOverallScore(),
      keywords,
      contentPerformance,
      backlinkMetrics: backlinkMetrics!,
      alerts,
      recommendations,
      generatedAt: new Date()
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    // Análisis de keywords
    const lowPositionKeywords = this.getKeywordsByPosition({ min: 5, max: 10 })
    if (lowPositionKeywords.length > 0) {
      recommendations.push(
        `Mejorar posicionamiento de ${lowPositionKeywords.length} keywords: ${lowPositionKeywords.map(k => k.keyword).join(', ')}`
      )
    }

    const trendingDown = this.getKeywordsByTrend('down')
    if (trendingDown.length > 0) {
      recommendations.push(
        `Investigar caída de keywords: ${trendingDown.map(k => k.keyword).join(', ')}`
      )
    }

    // Análisis de contenido
    const highBounceRate = Array.from(this.contentPerformance.values())
      .filter(content => content.bounceRate > 0.5)
    
    if (highBounceRate.length > 0) {
      recommendations.push(
        `Reducir tasa de rebote en ${highBounceRate.length} páginas de contenido`
      )
    }

    // Análisis de backlinks
    if (this.backlinkMetrics && this.backlinkMetrics.newBacklinks < 5) {
      recommendations.push('Aumentar campaña de backlinks con aliados locales')
    }

    // Alertas específicas
    const criticalAlerts = this.getAlertsBySeverity('critical')
    if (criticalAlerts.length > 0) {
      recommendations.push('Atender alertas críticas de SEO inmediatamente')
    }

    return recommendations
  }

  trackKeywordPosition(keyword: string, newPosition: number): void {
    const existingKeyword = this.keywords.get(keyword)
    if (existingKeyword) {
      const oldPosition = existingKeyword.position
      existingKeyword.position = newPosition
      existingKeyword.lastUpdated = new Date()

      // Determinar tendencia
      if (newPosition < oldPosition) {
        existingKeyword.trend = 'up'
      } else if (newPosition > oldPosition) {
        existingKeyword.trend = 'down'
      }

      // Alerta si cae significativamente
      if (newPosition > oldPosition + 2) {
        this.addAlert({
          type: 'position_drop',
          severity: newPosition > 5 ? 'medium' : 'low',
          message: `Keyword "${keyword}" cayó del puesto ${oldPosition} al ${newPosition}`,
          recommendation: 'Revisar competencia y actualizar contenido'
        })
      }

      // Agregar al historial
      this.serpHistory.push({
        keyword,
        date: new Date(),
        position: newPosition,
        organicClicks: Math.floor(Math.random() * 500) + 100,
        impressions: Math.floor(Math.random() * 2000) + 500,
        ctr: Math.random() * 0.3 + 0.05,
        competitors: ['competitor1.com', 'competitor2.com']
      })
    }
  }

  updateContentPerformance(url: string, updates: Partial<ContentPerformance>): void {
    const existing = this.contentPerformance.get(url)
    if (existing) {
      Object.assign(existing, updates)
      existing.lastUpdated = new Date()
    }
  }

  getCompetitorAnalysis(keyword: string): {
    competitors: string[]
    gapAnalysis: string[]
    opportunities: string[]
  } {
    const tracking = this.getSERPHistory(keyword)
    const latestTracking = tracking[tracking.length - 1]

    if (!latestTracking) {
      return {
        competitors: [],
        gapAnalysis: [],
        opportunities: []
      }
    }

    return {
      competitors: latestTracking.competitors,
      gapAnalysis: [
        'Analizar estructura de contenido de competidores',
        'Revisar keywords secundarias que usan',
        'Evaluar calidad y frescura de su contenido'
      ],
      opportunities: [
        'Crear contenido más específico y local',
        'Incluir datos y estadísticas actualizadas',
        'Optimizar para featured snippets'
      ]
    }
  }

  exportToCSV(): string {
    const headers = ['Keyword', 'Position', 'Search Volume', 'Competition', 'Trend', 'Target Page']
    const rows: string[] = [headers.join(',')]

    this.getAllKeywords().forEach(kw => {
      const row = [
        kw.keyword,
        kw.position.toString(),
        kw.searchVolume.toString(),
        kw.competition,
        kw.trend,
        kw.targetLandingPage
      ]
      rows.push(row.join(','))
    })

    return rows.join('\n')
  }
}

const seoMonitoringService = new SEOMonitoringService()
export default seoMonitoringService