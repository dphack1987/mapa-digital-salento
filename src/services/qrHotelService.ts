// Servicio de gestión de QR únicos por hotel
// Sistema de generación, validación y tracking de códigos QR para cada establecimiento

interface HotelQRCode {
  id: string
  hotelId: string
  hotelName: string
  secret: string
  generatedAt: Date
  expiresAt: Date
  isActive: boolean
  scanCount: number
  lastScannedAt?: Date
  metadata: {
    location: string
    floor?: string
    zone?: string
  }
}

interface QRSession {
  sessionId: string
  hotelId: string
  hotelName: string
  roomNumber?: string
  checkInDate: Date
  scannedAt: Date
  userAgent: string
  ipAddress?: string
}

interface HotelQRConfig {
  id: string
  hotelId: string
  hotelName: string
  allowedRooms: string[]
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  welcomeMessage: {
    es: string
    en: string
  }
}

class HotelQRService {
  private qrCodes: Map<string, HotelQRCode> = new Map()
  private hotelConfigs: Map<string, HotelQRConfig> = new Map()
  private activeSessions: Map<string, QRSession> = new Map()

  /**
   * Generar código QR único para un hotel
   */
  generateHotelQR(config: HotelQRConfig): HotelQRCode {
    const qrId = `hotel-${config.hotelId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const secret = this.generateSecret()
    
    const qrCode: HotelQRCode = {
      id: qrId,
      hotelId: config.hotelId,
      hotelName: config.hotelName,
      secret,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      isActive: true,
      scanCount: 0,
      metadata: config.metadata || { location: 'Recepción' }
    }

    this.qrCodes.set(qrId, qrCode)
    this.hotelConfigs.set(config.hotelId, config)
    
    console.log(`Generated QR code for ${config.hotelName}:`, qrId)
    return qrCode
  }

  /**
   * Generar secreto único para validación
   */
  private generateSecret(): string {
    const array = new Uint32Array(2)
    crypto.getRandomValues(array)
    return Array.from(array, (dec) => dec.toString(16)).join('')
  }

  /**
   * Validar código QR escaneado
   */
  validateQRCode(qrId: string, secret: string): { valid: boolean; hotelConfig?: HotelQRConfig } {
    const qrCode = this.qrCodes.get(qrId)
    
    if (!qrCode) {
      return { valid: false }
    }

    if (qrCode.secret !== secret) {
      console.warn('Invalid QR secret for:', qrId)
      return { valid: false }
    }

    if (!qrCode.isActive) {
      console.warn('QR code is inactive:', qrId)
      return { valid: false }
    }

    if (new Date() > qrCode.expiresAt) {
      console.warn('QR code expired:', qrId)
      return { valid: false }
    }

    // Actualizar estadísticas
    qrCode.scanCount++
    qrCode.lastScannedAt = new Date()
    this.qrCodes.set(qrId, qrCode)

    const hotelConfig = this.hotelConfigs.get(qrCode.hotelId)
    
    return { valid: true, hotelConfig }
  }

  /**
   * Crear sesión de usuario al escanear QR
   */
  createQRSession(qrId: string, roomNumber?: string): QRSession {
    const qrCode = this.qrCodes.get(qrId)
    
    if (!qrCode) {
      throw new Error('QR code not found')
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const session: QRSession = {
      sessionId,
      hotelId: qrCode.hotelId,
      hotelName: qrCode.hotelName,
      roomNumber,
      checkInDate: new Date(),
      scannedAt: new Date(),
      userAgent: navigator.userAgent,
      ipAddress: 'pending' // Se actualizaría en backend real
    }

    this.activeSessions.set(sessionId, session)
    
    // Guardar en localStorage para persistencia
    this.saveSessionToStorage(session)
    
    console.log('Created QR session:', session)
    return session
  }

  /**
   * Obtener sesión activa
   */
  getActiveSession(): QRSession | null {
    const sessionId = localStorage.getItem('salento_qr_session')
    if (!sessionId) return null
    
    const session = this.activeSessions.get(sessionId)
    return session || null
  }

  /**
   * Cerrar sesión actual
   */
  closeSession(): void {
    const sessionId = localStorage.getItem('salento_qr_session')
    if (sessionId) {
      this.activeSessions.delete(sessionId)
      localStorage.removeItem('salento_qr_session')
      console.log('Closed QR session:', sessionId)
    }
  }

  /**
   * Obtener configuración de hotel activa
   */
  getActiveHotelConfig(): HotelQRConfig | null {
    const session = this.getActiveSession()
    if (!session) return null
    
    return this.hotelConfigs.get(session.hotelId) || null
  }

  /**
   * Generar URL de QR para hotel
   */
  generateQRURL(qrId: string): string {
    const qrCode = this.qrCodes.get(qrId)
    if (!qrCode) {
      return ''
    }

    // URL base de la aplicación + parámetros de QR
    const baseUrl = window.location.origin
    return `${baseUrl}/qr/${qrId}`
  }

  /**
   * Generar datos para código QR (payload)
   */
  generateQRPayload(qrId: string): string {
    const qrCode = this.qrCodes.get(qrId)
    if (!qrCode) {
      return ''
    }

    const payload = {
      id: qrId,
      h: qrCode.hotelId,
      s: qrCode.secret.substring(0, 8), // Primeros 8 caracteres del secreto para validación rápida
      v: '1.0' // Versión del formato
    }

    return JSON.stringify(payload)
  }

  /**
   * Deserializar y validar payload de QR
   */
  parseQRPayload(payload: string): { valid: boolean; hotelId?: string; qrId?: string } {
    try {
      const data = JSON.parse(payload)
      
      if (!data.id || !data.h || !data.s) {
        return { valid: false }
      }

      const qrCode = this.qrCodes.get(data.id)
      if (!qrCode) {
        return { valid: false }
      }

      // Validar secreto parcial
      if (qrCode.secret.substring(0, 8) !== data.s) {
        return { valid: false }
      }

      return { 
        valid: true, 
        hotelId: data.h, 
        qrId: data.id 
      }
    } catch (error) {
      console.error('Error parsing QR payload:', error)
      return { valid: false }
    }
  }

  /**
   * Obtener estadísticas de uso de QR
   */
  getQRStats(qrId: string): { scans: number; lastScanned?: Date; isActive: boolean } | null {
    const qrCode = this.qrCodes.get(qrId)
    if (!qrCode) return null

    return {
      scans: qrCode.scanCount,
      lastScanned: qrCode.lastScannedAt,
      isActive: qrCode.isActive
    }
  }

  /**
   * Obtener estadísticas de hotel
   */
  getHotelStats(hotelId: string): { totalScans: number; activeSessions: number } {
    let totalScans = 0
    let activeSessions = 0

    for (const [id, qrCode] of this.qrCodes.entries()) {
      if (qrCode.hotelId === hotelId) {
        totalScans += qrCode.scanCount
      }
    }

    for (const session of this.activeSessions.values()) {
      if (session.hotelId === hotelId) {
        activeSessions++
      }
    }

    return { totalScans, activeSessions }
  }

  /**
   * Desactivar código QR
   */
  deactivateQRCode(qrId: string): boolean {
    const qrCode = this.qrCodes.get(qrId)
    if (!qrCode) return false

    qrCode.isActive = false
    this.qrCodes.set(qrId, qrCode)
    
    console.log('Deactivated QR code:', qrId)
    return true
  }

  /**
   * Reactivar código QR
   */
  reactivateQRCode(qrId: string): boolean {
    const qrCode = this.qrCodes.get(qrId)
    if (!qrCode) return false

    qrCode.isActive = true
    qrCode.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    this.qrCodes.set(qrId, qrCode)
    
    console.log('Reactivated QR code:', qrId)
    return true
  }

  /**
   * Guardar sesión en localStorage
   */
  private saveSessionToStorage(session: QRSession): void {
    try {
      localStorage.setItem('salento_qr_session', session.sessionId)
      localStorage.setItem('salento_qr_session_data', JSON.stringify(session))
    } catch (error) {
      console.error('Error saving session to storage:', error)
    }
  }

  /**
   * Cargar sesión desde localStorage
   */
  loadSessionFromStorage(): QRSession | null {
    try {
      const sessionId = localStorage.getItem('salento_qr_session')
      const sessionData = localStorage.getItem('salento_qr_session_data')
      
      if (sessionId && sessionData) {
        const session = JSON.parse(sessionData) as QRSession
        this.activeSessions.set(sessionId, session)
        return session
      }
    } catch (error) {
      console.error('Error loading session from storage:', error)
    }
    return null
  }

  /**
   * Inicializar el servicio con datos de hoteles existentes
   */
  initializeWithHotels(hotels: Array<{ id: string; name: string }>): void {
    hotels.forEach(hotel => {
      const config: HotelQRConfig = {
        id: `config-${hotel.id}`,
        hotelId: hotel.id,
        hotelName: hotel.name,
        allowedRooms: [],
        primaryColor: '#27362b',
        secondaryColor: '#e76c52',
        welcomeMessage: {
          es: `Bienvenido a ${hotel.name}. Escanea el QR para acceder a tu sesión personalizada.`,
          en: `Welcome to ${hotel.name}. Scan the QR to access your personalized session.`
        },
        metadata: {
          location: 'Recepción'
        }
      }

      this.hotelConfigs.set(hotel.id, config)
      
      // Generar QR inicial para el hotel
      this.generateHotelQR(config)
    })

    console.log(`Initialized ${hotels.length} hotels with QR system`)
  }

  /**
   * Obtener todos los QR activos
   */
  getAllActiveQRCodes(): HotelQRCode[] {
    return Array.from(this.qrCodes.values()).filter(qr => qr.isActive)
  }

  /**
   * Obtener QR por hotel
   */
  getQRByHotel(hotelId: string): HotelQRCode | null {
    for (const qrCode of this.qrCodes.values()) {
      if (qrCode.hotelId === hotelId && qrCode.isActive) {
        return qrCode
      }
    }
    return null
  }
}

// Exportar instancia singleton
export const hotelQRService = new HotelQRService()
export default hotelQRService