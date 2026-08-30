// Servicio de generación de QR codes dinámicos con tracking
// Para el plan de despliegue físico (stickers, calcomanías)

interface QRTrackingData {
  qrId: string
  businessId: string
  businessName: string
  location: string // 'hostal', 'jeep', 'cafe', 'restaurante', etc.
  placementDate: Date
  scanCount: number
  lastScanDate?: Date
  isActive: boolean
  customParameters?: Record<string, any>
}

interface ScanEvent {
  scanId: string
  qrId: string
  timestamp: Date
  deviceType?: 'mobile' | 'desktop' | 'tablet'
  userAgent?: string
  location?: {
    lat?: number
    lng?: number
  }
  conversionAction?: 'order', 'reservation', 'inquiry', 'view'
}

class QRTrackingService {
  private qrDatabase: Map<string, QRTrackingData> = new Map()
  private scanDatabase: Map<string, ScanEvent[]> = new Map()

  /**
   * Generar QR code dinámico para un negocio
   */
  generateBusinessQR(businessId: string, businessName: string, location: string, customParameters?: Record<string, any>): string {
    const qrId = this.generateQRId()
    
    const qrData: QRTrackingData = {
      qrId,
      businessId,
      businessName,
      location,
      placementDate: new Date(),
      scanCount: 0,
      isActive: true,
      customParameters
    }
    
    this.qrDatabase.set(qrId, qrData)
    
    // Generar URL dinámica para el QR
    const qrUrl = this.generateQRUrl(qrId, businessId, customParameters)
    
    return qrUrl
  }

  /**
   * Generar QR code específico para hostal (plan "mesa de noche")
   */
  generateHostalQR(hostalId: string, hostalName: string, roomNumber?: string): string {
    const customParams = roomNumber ? { roomNumber } : undefined
    return this.generateBusinessQR(hostalId, hostalName, 'hostal', customParams)
  }

  /**
   * Generar QR code para Jeep Willys
   */
  generateJeepQR(jeepId: string, route: string, driverName?: string): string {
    const customParams = { route, driverName }
    return this.generateBusinessQR(jeepId, `Jeep ${route}`, 'jeep', customParams)
  }

  /**
   * Generar QR code para mostrador de comercio
   */
  generateCounterQR(businessId: string, businessName: string, businessType: string): string {
    return this.generateBusinessQR(businessId, businessName, businessType)
  }

  /**
   * Registrar un escaneo de QR
   */
  registerScan(qrId: string, deviceInfo?: { deviceType?: 'mobile' | 'desktop' | 'tablet'; userAgent?: string }, location?: { lat?: number; lng?: number }): ScanEvent | null {
    const qrData = this.qrDatabase.get(qrId)
    
    if (!qrData || !qrData.isActive) {
      return null
    }
    
    // Actualizar datos del QR
    qrData.scanCount++
    qrData.lastScanDate = new Date()
    this.qrDatabase.set(qrId, qrData)
    
    // Crear evento de escaneo
    const scanEvent: ScanEvent = {
      scanId: this.generateScanId(),
      qrId,
      timestamp: new Date(),
      deviceType: deviceInfo?.deviceType,
      userAgent: deviceInfo?.userAgent,
      location
    }
    
    // Guardar evento en base de datos
    const existingScans = this.scanDatabase.get(qrId) || []
    existingScans.push(scanEvent)
    this.scanDatabase.set(qrId, existingScans)
    
    return scanEvent
  }

  /**
   * Registrar conversión después de escaneo
   */
  registerConversion(scanId: string, conversionAction: 'order' | 'reservation' | 'inquiry' | 'view'): boolean {
    // Buscar el evento de escaneo y actualizar con conversión
    for (const [qrId, scans] of this.scanDatabase.entries()) {
      const scanEvent = scans.find(s => s.scanId === scanId)
      if (scanEvent) {
        scanEvent.conversionAction = conversionAction
        this.scanDatabase.set(qrId, scans)
        return true
      }
    }
    return false
  }

  /**
   * Obtener estadísticas de un QR específico
   */
  getQRStatistics(qrId: string): {
    totalScans: number
    conversionRate: number
    lastScanDate: Date | undefined
    scansByDevice: Record<string, number>
    conversionsByAction: Record<string, number>
  } | null {
    const qrData = this.qrDatabase.get(qrId)
    const scans = this.scanDatabase.get(qrId) || []
    
    if (!qrData) {
      return null
    }
    
    const conversions = scans.filter(s => s.conversionAction).length
    const conversionRate = qrData.scanCount > 0 ? (conversions / qrData.scanCount) * 100 : 0
    
    const scansByDevice: Record<string, number> = {}
    const conversionsByAction: Record<string, number> = {}
    
    scans.forEach(scan => {
      if (scan.deviceType) {
        scansByDevice[scan.deviceType] = (scansByDevice[scan.deviceType] || 0) + 1
      }
      if (scan.conversionAction) {
        conversionsByAction[scan.conversionAction] = (conversionsByAction[scan.conversionAction] || 0) + 1
      }
    })
    
    return {
      totalScans: qrData.scanCount,
      conversionRate,
      lastScanDate: qrData.lastScanDate,
      scansByDevice,
      conversionsByAction
    }
  }

  /**
   * Obtener estadísticas agregadas por negocio
   */
  getBusinessStatistics(businessId: string): {
    totalQRs: number
    totalScans: number
    totalConversions: number
    averageConversionRate: number
    topPerformingQR: string | null
  } {
    let totalQRs = 0
    let totalScans = 0
    let totalConversions = 0
    let topPerformingQR: string | null = null
    let maxScans = 0
    
    for (const [qrId, qrData] of this.qrDatabase.entries()) {
      if (qrData.businessId === businessId) {
        totalQRs++
        totalScans += qrData.scanCount
        
        const scans = this.scanDatabase.get(qrId) || []
        const conversions = scans.filter(s => s.conversionAction).length
        totalConversions += conversions
        
        if (qrData.scanCount > maxScans) {
          maxScans = qrData.scanCount
          topPerformingQR = qrId
        }
      }
    }
    
    const averageConversionRate = totalScans > 0 ? (totalConversions / totalScans) * 100 : 0
    
    return {
      totalQRs,
      totalScans,
      totalConversions,
      averageConversionRate,
      topPerformingQR
    }
  }

  /**
   * Desactivar un QR (para cuando se retira un sticker/calcomanía)
   */
  deactivateQR(qrId: string): boolean {
    const qrData = this.qrDatabase.get(qrId)
    if (qrData) {
      qrData.isActive = false
      this.qrDatabase.set(qrId, qrData)
      return true
    }
    return false
  }

  /**
   * Reactivar un QR
   */
  reactivateQR(qrId: string): boolean {
    const qrData = this.qrDatabase.get(qrId)
    if (qrData) {
      qrData.isActive = true
      this.qrDatabase.set(qrId, qrData)
      return true
    }
    return false
  }

  /**
   * Generar reporte de efectividad para despliegue físico
   */
  generateDeploymentReport(startDate: Date, endDate: Date): {
    totalQRsDeployed: number
    totalScans: number
    averageScansPerQR: number
    locationBreakdown: Record<string, { count: number; scans: number }>
    recommendations: string[]
  } {
    let totalQRsDeployed = 0
    let totalScans = 0
    const locationBreakdown: Record<string, { count: number; scans: number }> = {}
    
    for (const [qrId, qrData] of this.qrDatabase.entries()) {
      if (qrData.placementDate >= startDate && qrData.placementDate <= endDate) {
        totalQRsDeployed++
        totalScans += qrData.scanCount
        
        if (!locationBreakdown[qrData.location]) {
          locationBreakdown[qrData.location] = { count: 0, scans: 0 }
        }
        locationBreakdown[qrData.location].count++
        locationBreakdown[qrData.location].scans += qrData.scanCount
      }
    }
    
    const averageScansPerQR = totalQRsDeployed > 0 ? totalScans / totalQRsDeployed : 0
    
    // Generar recomendaciones basadas en datos
    const recommendations: string[] = []
    
    if (averageScansPerQR < 5) {
      recommendations.push('Considerar reubicar QR codes con bajo rendimiento')
    }
    
    if (locationBreakdown['hostal'] && locationBreakdown['hostal'].scans > locationBreakdown['jeep']?.scans) {
      recommendations.push('Estrategia de hostales está funcionando mejor que Jeeps - expandir cobertura de hostales')
    }
    
    return {
      totalQRsDeployed,
      totalScans,
      averageScansPerQR,
      locationBreakdown,
      recommendations
    }
  }

  /**
   * Generar ID único para QR
   */
  private generateQRId(): string {
    return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generar ID único para escaneo
   */
  private generateScanId(): string {
    return `SCAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generar URL dinámica para QR
   */
  private generateQRUrl(qrId: string, businessId: string, customParameters?: Record<string, any>): string {
    const baseUrl = 'https://salento-alamano.com/qr'
    const params = new URLSearchParams({
      qr: qrId,
      business: businessId,
      ...customParameters
    })
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Exportar datos para análisis externo
   */
  exportDataForAnalysis(): {
    qrData: QRTrackingData[]
    scanData: Array<{ qrId: string; scans: ScanEvent[] }>
  } {
    return {
      qrData: Array.from(this.qrDatabase.values()),
      scanData: Array.from(this.scanDatabase.entries()).map(([qrId, scans]) => ({ qrId, scans }))
    }
  }
}

// Exportar instancia singleton
export const qrTrackingService = new QRTrackingService()
export default qrTrackingService