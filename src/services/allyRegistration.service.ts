// Servicio de Registro de Aliados
// Sistema completo para registro, verificación y gestión de negocios locales

import notificationsService from './notifications.service'

interface AllyRegistration {
  id: string
  businessName: string
  businessType: 'hotel' | 'restaurant' | 'transport' | 'guide' | 'shop' | 'experience' | 'other'
  contactPerson: string
  email: string
  phone: string
  whatsapp?: string
  address: string
  location: {
    lat: number
    lng: number
    address: string
  }
  description: string
  services: string[]
  operatingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  website?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  images: string[]
  pricing?: {
    range: string
    currency: string
    acceptsReservations: boolean
  }
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verificationDate?: string
  rejectionReason?: string
  registrationDate: string
  lastUpdated: string
  metrics: {
    profileViews: number
    backlinkClicks: number
    conversionRate: number
  }
}

interface VerificationDocument {
  type: 'business_license' | 'tax_id' | 'chamber_of_commerce' | 'identity'
  documentNumber: string
  issuingAuthority: string
  expirationDate?: string
  documentUrl?: string
}

class AllyRegistrationService {
  private registrations: AllyRegistration[] = []
  private pendingVerifications: Map<string, VerificationDocument[]> = new Map()
  private initialized = false

  /**
   * Inicializar el servicio de registro
   */
  initialize() {
    if (this.initialized) return

    // Cargar registros desde localStorage si existen
    const savedRegistrations = localStorage.getItem('ally_registrations')
    if (savedRegistrations) {
      this.registrations = JSON.parse(savedRegistrations)
    }

    this.initialized = true
    console.log('📝 Servicio de Registro de Aliados inicializado')
  }

  /**
   * Registrar un nuevo aliado
   */
  async registerAlly(registration: Omit<AllyRegistration, 'id' | 'verificationStatus' | 'registrationDate' | 'lastUpdated' | 'metrics'>): Promise<AllyRegistration> {
    const newRegistration: AllyRegistration = {
      ...registration,
      id: this.generateId(),
      verificationStatus: 'pending',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      metrics: {
        profileViews: 0,
        backlinkClicks: 0,
        conversionRate: 0
      }
    }

    this.registrations.push(newRegistration)
    this.saveToLocalStorage()

    // Notificar sobre nuevo registro
    notificationsService.notifyNewRegistration(
      newRegistration.id,
      newRegistration.businessName,
      newRegistration.businessType
    )

    return newRegistration
  }

  /**
   * Verificar un aliado
   */
  async verifyAlly(allyId: string, documents: VerificationDocument[]): Promise<{ success: boolean; message: string }> {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) {
      return { success: false, message: 'Aliado no encontrado' }
    }

    // Guardar documentos para verificación
    this.pendingVerifications.set(allyId, documents)

    // Notificar solicitud de verificación
    notificationsService.notifyVerificationRequest(allyId, ally.businessName)

    // Simulación de verificación automática
    const verificationResult = await this.performAutomaticVerification(ally, documents)

    if (verificationResult.success) {
      ally.verificationStatus = 'verified'
      ally.verificationDate = new Date().toISOString()
      ally.lastUpdated = new Date().toISOString()
      
      this.pendingVerifications.delete(allyId)
      this.saveToLocalStorage()
      
      // Notificar verificación exitosa
      notificationsService.notifyVerificationSuccess(allyId, ally.businessName)
      
      return { success: true, message: 'Aliado verificado exitosamente' }
    } else {
      ally.verificationStatus = 'rejected'
      ally.rejectionReason = verificationResult.message
      ally.lastUpdated = new Date().toISOString()
      
      this.saveToLocalStorage()
      
      // Notificar rechazo
      notificationsService.notifyVerificationRejected(
        allyId, 
        ally.businessName, 
        verificationResult.message
      )
      
      return { success: false, message: verificationResult.message }
    }
  }

  /**
   * Realizar verificación automática
   */
  private async performAutomaticVerification(ally: AllyRegistration, documents: VerificationDocument[]): Promise<{ success: boolean; message: string }> {
    // Verificación básica de documentos
    const hasRequiredDocuments = documents.some(doc => 
      doc.type === 'business_license' || doc.type === 'chamber_of_commerce'
    )

    if (!hasRequiredDocuments) {
      return { success: false, message: 'Faltan documentos requeridos (licencia comercial o cámara de comercio)' }
    }

    // Verificación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(ally.email)) {
      return { success: false, message: 'Formato de email inválido' }
    }

    // Verificación de número de teléfono colombiano
    const phoneRegex = /^57\d{10}$/
    const cleanPhone = ally.phone.replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return { success: false, message: 'Formato de teléfono inválido (debe ser código de país + 10 dígitos)' }
    }

    // Verificación de ubicación dentro de Salento
    const salentoBounds = {
      lat: { min: 4.5, max: 4.7 },
      lng: { min: -75.5, max: -75.3 }
    }

    if (ally.location.lat < salentoBounds.lat.min || ally.location.lat > salentoBounds.lat.max ||
        ally.location.lng < salentoBounds.lng.min || ally.location.lng > salentoBounds.lng.max) {
      return { success: false, message: 'La ubicación debe estar dentro del área de Salento' }
    }

    // Verificación de nombre de negocio
    if (ally.businessName.length < 3) {
      return { success: false, message: 'El nombre del negocio debe tener al menos 3 caracteres' }
    }

    // Si pasa todas las verificaciones
    return { success: true, message: 'Verificación completada exitosamente' }
  }

  /**
   * Obtener todos los registros
   */
  getAllRegistrations(): AllyRegistration[] {
    return [...this.registrations]
  }

  /**
   * Obtener registros por estado de verificación
   */
  getRegistrationsByStatus(status: AllyRegistration['verificationStatus']): AllyRegistration[] {
    return this.registrations.filter(r => r.verificationStatus === status)
  }

  /**
   * Obtener registro por ID
   */
  getRegistrationById(id: string): AllyRegistration | undefined {
    return this.registrations.find(r => r.id === id)
  }

  /**
   * Obtener registros por tipo de negocio
   */
  getRegistrationsByType(type: AllyRegistration['businessType']): AllyRegistration[] {
    return this.registrations.filter(r => r.businessType === type)
  }

  /**
   * Actualizar información de un aliado
   */
  updateAlly(allyId: string, updates: Partial<AllyRegistration>): AllyRegistration | null {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) return null

    Object.assign(ally, updates, { lastUpdated: new Date().toISOString() })
    this.saveToLocalStorage()

    return ally
  }

  /**
   * Añadir servicio a un aliado
   */
  addService(allyId: string, service: string): boolean {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) return false

    if (!ally.services.includes(service)) {
      ally.services.push(service)
      ally.lastUpdated = new Date().toISOString()
      this.saveToLocalStorage()
      return true
    }
    return false
  }

  /**
   * Eliminar servicio de un aliado
   */
  removeService(allyId: string, service: string): boolean {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) return false

    const index = ally.services.indexOf(service)
    if (index > -1) {
      ally.services.splice(index, 1)
      ally.lastUpdated = new Date().toISOString()
      this.saveToLocalStorage()
      return true
    }
    return false
  }

  /**
   * Actualizar horarios de operación
   */
  updateOperatingHours(allyId: string, hours: AllyRegistration['operatingHours']): boolean {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) return false

    ally.operatingHours = hours
    ally.lastUpdated = new Date().toISOString()
    this.saveToLocalStorage()
    return true
  }

  /**
   * Actualizar información de contacto
   */
  updateContactInfo(allyId: string, contactInfo: {
    phone?: string
    whatsapp?: string
    email?: string
    website?: string
    socialMedia?: AllyRegistration['socialMedia']
  }): boolean {
    const ally = this.registrations.find(r => r.id === allyId)
    if (!ally) return false

    if (contactInfo.phone) ally.phone = contactInfo.phone
    if (contactInfo.whatsapp !== undefined) ally.whatsapp = contactInfo.whatsapp
    if (contactInfo.email) ally.email = contactInfo.email
    if (contactInfo.website !== undefined) ally.website = contactInfo.website
    if (contactInfo.socialMedia) ally.socialMedia = contactInfo.socialMedia

    ally.lastUpdated = new Date().toISOString()
    this.saveToLocalStorage()
    return true
  }

  /**
   * Eliminar un registro
   */
  deleteAlly(allyId: string): boolean {
    const index = this.registrations.findIndex(r => r.id === allyId)
    if (index === -1) return false

    this.registrations.splice(index, 1)
    this.saveToLocalStorage()
    return true
  }

  /**
   * Incrementar métricas de un aliado
   */
  incrementMetrics(allyId: string, metric: keyof AllyRegistration['metrics']): void {
    const ally = this.registrations.find(r => r.id === allyId)
    if (ally) {
      ally.metrics[metric]++
      ally.metrics.conversionRate = ally.metrics.backlinkClicks > 0 
        ? (ally.metrics.profileViews / ally.metrics.backlinkClicks) * 100 
        : 0
      ally.lastUpdated = new Date().toISOString()
      this.saveToLocalStorage()
    }
  }

  /**
   * Generar reporte de registros
   */
  generateRegistrationReport(): {
    total: number
    pending: number
    verified: number
    rejected: number
    byType: Record<string, number>
    recentRegistrations: AllyRegistration[]
    verificationRate: number
  } {
    const total = this.registrations.length
    const pending = this.registrations.filter(r => r.verificationStatus === 'pending').length
    const verified = this.registrations.filter(r => r.verificationStatus === 'verified').length
    const rejected = this.registrations.filter(r => r.verificationStatus === 'rejected').length

    const byType: Record<string, number> = {}
    this.registrations.forEach(r => {
      byType[r.businessType] = (byType[r.businessType] || 0) + 1
    })

    const recentRegistrations = this.registrations
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 10)

    const verificationRate = total > 0 ? (verified / total) * 100 : 0

    return {
      total,
      pending,
      verified,
      rejected,
      byType,
      recentRegistrations,
      verificationRate
    }
  }

  /**
   * Buscar aliados
   */
  searchAllies(query: string): AllyRegistration[] {
    const lowerQuery = query.toLowerCase()
    return this.registrations.filter(ally => 
      ally.businessName.toLowerCase().includes(lowerQuery) ||
      ally.description.toLowerCase().includes(lowerQuery) ||
      ally.address.toLowerCase().includes(lowerQuery) ||
      ally.services.some(service => service.toLowerCase().includes(lowerQuery))
    )
  }



  /**
   * Guardar en localStorage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('ally_registrations', JSON.stringify(this.registrations))
    } catch (error) {
      console.error('Error guardando registros en localStorage:', error)
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return `ally_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Exportar datos de aliados
   */
  exportAlliesData(): string {
    return JSON.stringify(this.registrations, null, 2)
  }

  /**
   * Importar datos de aliados
   */
  importAlliesData(data: string): { success: boolean; imported: number; errors: string[] } {
    try {
      const importedData = JSON.parse(data) as AllyRegistration[]
      let imported = 0
      const errors: string[] = []

      importedData.forEach(ally => {
        // Validar estructura básica
        if (!ally.businessName || !ally.email || !ally.phone) {
          errors.push(`Datos inválidos para: ${ally.businessName || 'Sin nombre'}`)
          return
        }

        // Verificar si ya existe
        const existing = this.registrations.find(r => r.email === ally.email)
        if (existing) {
          errors.push(`Email duplicado: ${ally.email}`)
          return
        }

        // Asignar nuevo ID si no tiene
        if (!ally.id) {
          ally.id = this.generateId()
        }

        this.registrations.push(ally)
        imported++
      })

      this.saveToLocalStorage()

      return {
        success: imported > 0,
        imported,
        errors
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: ['Error al parsear los datos importados']
      }
    }
  }
}

// Exportar instancia singleton
export const allyRegistrationService = new AllyRegistrationService()
export default allyRegistrationService