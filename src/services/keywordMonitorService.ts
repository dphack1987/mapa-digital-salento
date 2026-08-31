// Servicio de monitoreo de keywords tóxicas para SEO defensivo
// Detecta tendencias de desinformación y activa respuestas automáticas

interface ToxicKeywordAlert {
  keyword: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  detectedAt: Date
  source: 'social' | 'search' | 'news' | 'community'
  volume: number
  trend: 'rising' | 'stable' | 'falling'
  suggestedActions: string[]
}

interface MonitoringConfig {
  checkInterval: number // minutos
  alertThreshold: number // volumen mínimo para alerta
  sources: string[] // fuentes a monitorear
  autoResponseEnabled: boolean
}

class KeywordMonitorService {
  private alerts: ToxicKeywordAlert[] = []
  private monitoredKeywords: Map<string, ToxicKeywordAlert> = new Map()
  private config: MonitoringConfig = {
    checkInterval: 30, // 30 minutos
    alertThreshold: 50, // 50 menciones mínimas
    sources: ['twitter', 'facebook', 'tiktok', 'youtube', 'instagram'],
    autoResponseEnabled: true
  }
  private monitoringActive = false
  private monitoringInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeMonitoredKeywords()
  }

  private initializeMonitoredKeywords() {
    // Keywords de alto riesgo para monitoreo constante
    const highRiskKeywords = [
      'salento peligroso',
      'no vengas a salento',
      'salento cerrado',
      'valle cocora peligro',
      'turismo salento prohibido',
      'crisis salento',
      'emergencia salento',
      'inseguridad salento'
    ]

    highRiskKeywords.forEach(keyword => {
      this.monitoredKeywords.set(keyword, {
        keyword,
        severity: 'critical',
        detectedAt: new Date(),
        source: 'social',
        volume: 0,
        trend: 'stable',
        suggestedActions: [
          'Activar landing page defensiva',
          'Preparar respuesta de Don Chucho',
          'Notificar a aliados locales',
          'Generar contenido de contra-información'
        ]
      })
    })
  }

  startMonitoring(): void {
    if (this.monitoringActive) {
      console.log('[KeywordMonitor] Monitoring already active')
      return
    }

    this.monitoringActive = true
    console.log('[KeywordMonitor] Starting keyword monitoring...')

    this.monitoringInterval = setInterval(() => {
      this.checkKeywords()
    }, this.config.checkInterval * 60 * 1000) // Convertir a milisegundos
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    this.monitoringActive = false
    console.log('[KeywordMonitor] Keyword monitoring stopped')
  }

  private async checkKeywords(): Promise<void> {
    console.log('[KeywordMonitor] Checking keywords...')
    
    // Simulación de monitoreo - en producción esto conectaría con APIs reales
    const detectedTrends = await this.simulateSocialMonitoring()
    
    for (const trend of detectedTrends) {
      this.processDetectedTrend(trend)
    }

    this.generateAlerts()
  }

  private async simulateSocialMonitoring(): Promise<any[]> {
    // Simulación de monitoreo de redes sociales
    // En producción, esto usaría APIs de Twitter, Facebook, Google Trends, etc.
    const trends = [
      {
        keyword: 'salento peligroso',
        volume: Math.floor(Math.random() * 100) + 20,
        source: 'twitter',
        trend: Math.random() > 0.5 ? 'rising' : 'stable'
      },
      {
        keyword: 'valle cocora seguro',
        volume: Math.floor(Math.random() * 200) + 50,
        source: 'facebook',
        trend: 'rising'
      },
      {
        keyword: 'estado vías salento',
        volume: Math.floor(Math.random() * 150) + 30,
        source: 'tiktok',
        trend: 'stable'
      }
    ]

    return trends
  }

  private processDetectedTrend(trend: any): void {
    const existingAlert = this.monitoredKeywords.get(trend.keyword)
    
    if (existingAlert) {
      // Actualizar alerta existente
      existingAlert.volume = trend.volume
      existingAlert.trend = trend.trend
      existingAlert.detectedAt = new Date()
      existingAlert.source = trend.source
      
      // Ajustar severidad basado en volumen y tendencia
      existingAlert.severity = this.calculateSeverity(trend.volume, trend.trend)
    } else {
      // Crear nueva alerta
      const newAlert: ToxicKeywordAlert = {
        keyword: trend.keyword,
        severity: this.calculateSeverity(trend.volume, trend.trend),
        detectedAt: new Date(),
        source: trend.source,
        volume: trend.volume,
        trend: trend.trend,
        suggestedActions: this.generateSuggestedActions(trend.keyword, trend.volume)
      }
      
      this.monitoredKeywords.set(trend.keyword, newAlert)
    }
  }

  private calculateSeverity(volume: number, trend: string): 'low' | 'medium' | 'high' | 'critical' {
    if (volume > 200 || (volume > 100 && trend === 'rising')) {
      return 'critical'
    }
    if (volume > 100 || (volume > 50 && trend === 'rising')) {
      return 'high'
    }
    if (volume > 50) {
      return 'medium'
    }
    return 'low'
  }

  private generateSuggestedActions(keyword: string, volume: number): string[] {
    const actions: string[] = []
    
    if (volume > 100) {
      actions.push('Generar landing page defensiva inmediata')
      actions.push('Activar modo emergencia en Don Chucho')
      actions.push('Notificar a todos los aliados locales')
    }
    
    if (volume > 50) {
      actions.push('Preparar contenido de contra-información')
      actions.push('Actualizar FAQ en landing pages existentes')
    }
    
    actions.push('Monitorear evolución de la keyword')
    actions.push('Registrar en log de desinformación')
    
    return actions
  }

  private generateAlerts(): void {
    const criticalAlerts = Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.severity === 'critical' || alert.severity === 'high')
    
    if (criticalAlerts.length > 0) {
      console.log('[KeywordMonitor] ⚠️ CRITICAL ALERTS DETECTED:', criticalAlerts)
      this.alerts.push(...criticalAlerts)
      
      if (this.config.autoResponseEnabled) {
        this.triggerAutoResponse(criticalAlerts)
      }
    }
  }

  private triggerAutoResponse(alerts: ToxicKeywordAlert[]): void {
    console.log('[KeywordMonitor] Triggering auto-response for alerts:', alerts)
    
    // Aquí se activaría la respuesta automática:
    // 1. Generar landing pages defensivas
    // 2. Preparar respuestas de Don Chucho
    // 3. Notificar a los servicios correspondientes
    
    // En implementación real, esto llamaría a los servicios correspondientes
    console.log('[KeywordMonitor] Auto-response triggered - landing pages, Don Chucho, notifications')
  }

  getActiveAlerts(): ToxicKeywordAlert[] {
    return Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.severity === 'critical' || alert.severity === 'high')
  }

  getAlertsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ToxicKeywordAlert[] {
    return Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.severity === severity)
  }

  getAlertsByKeyword(keyword: string): ToxicKeywordAlert | undefined {
    return this.monitoredKeywords.get(keyword.toLowerCase())
  }

  addMonitoredKeyword(keyword: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    this.monitoredKeywords.set(keyword.toLowerCase(), {
      keyword: keyword.toLowerCase(),
      severity,
      detectedAt: new Date(),
      source: 'manual',
      volume: 0,
      trend: 'stable',
      suggestedActions: ['Monitorear evolución', 'Preparar respuestas defensivas']
    })
  }

  removeMonitoredKeyword(keyword: string): boolean {
    return this.monitoredKeywords.delete(keyword.toLowerCase())
  }

  getMonitoringConfig(): MonitoringConfig {
    return { ...this.config }
  }

  updateMonitoringConfig(updates: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...updates }
    
    // Si cambió el intervalo, reiniciar monitoreo
    if (updates.checkInterval && this.monitoringActive) {
      this.stopMonitoring()
      this.startMonitoring()
    }
  }

  generateMonitoringReport(): {
    const totalAlerts = this.monitoredKeywords.size
    const criticalCount = Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.severity === 'critical').length
    const highCount = Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.severity === 'high').length
    const risingTrends = Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.trend === 'rising').length

    return {
      timestamp: new Date(),
      totalMonitoredKeywords: totalAlerts,
      criticalAlerts: criticalCount,
      highAlerts: highCount,
      risingTrends: risingTrends,
      topKeywords: Array.from(this.monitoredKeywords.values())
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10),
      recommendedActions: this.generateOverallRecommendations()
    }
  }

  private generateOverallRecommendations(): string[] {
    const recommendations: string[] = []
    const criticalAlerts = this.getAlertsBySeverity('critical')
    const risingTrends = Array.from(this.monitoredKeywords.values())
      .filter(alert => alert.trend === 'rising')

    if (criticalAlerts.length > 0) {
      recommendations.push('Activar protocolo de respuesta de emergencia inmediata')
      recommendations.push('Generar landing pages defensivas para todas las keywords críticas')
      recommendations.push('Reunir comité de crisis con aliados locales')
    }

    if (risingTrends.length > 3) {
      recommendations.push('Preparar contenido preventivo para keywords en tendencia ascendente')
      recommendations.push('Actualizar respuestas de Don Chucho para nuevas amenazas')
    }

    if (recommendations.length === 0) {
      recommendations.push('Situación estable - continuar monitoreo rutinario')
    }

    return recommendations
  }

  clearOldAlerts(hoursThreshold: number = 24): void {
    const threshold = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000)
    
    for (const [keyword, alert] of this.monitoredKeywords) {
      if (alert.detectedAt < threshold && alert.severity !== 'critical') {
        this.monitoredKeywords.delete(keyword)
      }
    }
    
    console.log(`[KeywordMonitor] Cleared alerts older than ${hoursThreshold} hours`)
  }
}

export const keywordMonitorService = new KeywordMonitorService()
export default keywordMonitorService