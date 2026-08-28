// Servicio de micro-donaciones ambientales
// Sistema para donaciones voluntarias para conservación de recursos naturales

interface DonationCause {
  id: string
  name: string
  description: string
  icon: string
  targetAmount: number
  currentAmount: number
  progress: number
  beneficiaries: string[]
  verified: boolean
}

interface Donation {
  id: string
  causeId: string
  amount: number
  currency: string
  userId?: string
  timestamp: number
  isAnonymous: boolean
  message?: string
}

interface DonationOption {
  amount: number
  label: string
  description: string
  icon: string
}

class DonationService {
  private causes: DonationCause[] = []
  private donations: Donation[] = []
  private donationOptions: DonationOption[] = []

  /**
   * Inicializar el servicio con causas de conservación
   */
  initialize(): void {
    this.loadCauses()
    this.loadDonationOptions()
    this.loadDonationsFromStorage()
  }

  /**
   * Cargar causas de conservación específicas de Salento
   */
  private loadCauses(): void {
    this.causes = [
      {
        id: 'palm-cera',
        name: 'Conservación de la Palma de Cera',
        description: 'Protección y reforestación de la palma de cera del Quindío, árbol nacional de Colombia. Apoya viveros locales y educación ambiental.',
        icon: '🌴',
        targetAmount: 5000000,
        currentAmount: 1250000,
        progress: 25,
        beneficiaries: ['Viveros locales', 'Jóvenes ambientalistas', 'Comunidades rurales'],
        verified: true
      },
      {
        id: 'water-sources',
        name: 'Protección de Fuentes Hídricas',
        description: 'Conservación de nacimientos y quebradas que alimentan el Valle de Cocora. Recuperación de bosques protectores.',
        icon: '💧',
        targetAmount: 3000000,
        currentAmount: 800000,
        progress: 27,
        beneficiaries: ['Comunidades rurales', 'Acueductos veredales', 'Ganaderos sostenibles'],
        verified: true
      },
      {
        id: 'wildlife',
        name: 'Protección de Fauna Local',
        description: 'Programa de monitoreo y protección de aves endémicas y fauna del bosque andino. Corredores biológicos.',
        icon: '🦜',
        targetAmount: 2000000,
        currentAmount: 450000,
        progress: 23,
        beneficiaries: ['Guardaparques voluntarios', 'Investigadores locales', 'Estudiantes'],
        verified: true
      },
      {
        id: 'cultural-heritage',
        name: 'Patrimonio Cultural Salento',
        description: 'Preservación de arquitectura tradicional, saberes artesanales y prácticas culturales del municipio.',
        icon: '🏛️',
        targetAmount: 1500000,
        currentAmount: 300000,
        progress: 20,
        beneficiaries: ['Artesanos mayores', 'Jóvenes aprendices', 'Escuelas rurales'],
        verified: true
      }
    ]
  }

  /**
   * Cargar opciones de donación predefinidas
   */
  private loadDonationOptions(): void {
    this.donationOptions = [
      {
        amount: 2000,
        label: 'Aporte Básico',
        description: '1 semilla de palma de cera',
        icon: '🌱'
      },
      {
        amount: 5000,
        label: 'Aporte Intermedio',
        description: '5L de agua protegida',
        icon: '💧'
      },
      {
        amount: 10000,
        label: 'Aporte Generoso',
        description: 'Árbol nativo sembrado',
        icon: '🌳'
      },
      {
        amount: 20000,
        label: 'Aporte Sostenible',
        description: 'Kit de educación ambiental',
        icon: '📚'
      },
      {
        amount: 50000,
        label: 'Aporte Protector',
        description: 'Corredor biológico (1m²)',
        icon: '🦋'
      }
    ]
  }

  /**
   * Obtener todas las causas
   */
  getCauses(): DonationCause[] {
    return this.causes
  }

  /**
   * Obtener causa por ID
   */
  getCauseById(id: string): DonationCause | undefined {
    return this.causes.find(cause => cause.id === id)
  }

  /**
   * Obtener opciones de donación
   */
  getDonationOptions(): DonationOption[] {
    return this.donationOptions
  }

  /**
   * Realizar donación
   */
  async makeDonation(causeId: string, amount: number, isAnonymous: boolean = true, message?: string): Promise<Donation> {
    const cause = this.getCauseById(causeId)
    if (!cause) {
      throw new Error('Causa no encontrada')
    }

    const donation: Donation = {
      id: `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      causeId,
      amount,
      currency: 'COP',
      userId: isAnonymous ? undefined : 'user-placeholder',
      timestamp: Date.now(),
      isAnonymous,
      message
    }

    // Actualizar progreso de la causa
    cause.currentAmount += amount
    cause.progress = Math.min(100, Math.round((cause.currentAmount / cause.targetAmount) * 100))

    // Guardar donación
    this.donations.push(donation)
    this.saveDonationsToStorage()

    console.log('Donation made:', donation)
    return donation
  }

  /**
   * Obtener donaciones por causa
   */
  getDonationsByCause(causeId: string): Donation[] {
    return this.donations.filter(donation => donation.causeId === causeId)
  }

  /**
   * Obtener estadísticas de donaciones
   */
  getDonationStats(): {
    totalAmount: number
    totalDonations: number
    averageDonation: number
    byCause: Record<string, { amount: number; count: number }>
  } {
    const totalAmount = this.donations.reduce((sum, donation) => sum + donation.amount, 0)
    const totalDonations = this.donations.length
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0

    const byCause: Record<string, { amount: number; count: number }> = {}

    for (const donation of this.donations) {
      if (!byCause[donation.causeId]) {
        byCause[donation.causeId] = { amount: 0, count: 0 }
      }
      byCause[donation.causeId].amount += donation.amount
      byCause[donation.causeId].count++
    }

    return {
      totalAmount,
      totalDonations,
      averageDonation,
      byCause
    }
  }

  /**
   * Formatear monto de donación
   */
  formatDonationAmount(amount: number): string {
    return `$${amount.toLocaleString('es-CO')} COP`
  }

  /**
   * Obtener impacto de donación (qué se logra con el monto)
   */
  getDonationImpact(amount: number): string[] {
    const impacts: string[] = []

    if (amount >= 2000) impacts.push('🌱 1 semilla de palma de cera')
    if (amount >= 5000) impacts.push('💧 5L de agua protegida')
    if (amount >= 10000) impacts.push('🌳 1 árbol nativo sembrado')
    if (amount >= 20000) impacts.push('📚 1 kit de educación ambiental')
    if (amount >= 50000) impacts.push('🦋 1m² de corredor biológico')
    if (amount >= 100000) impacts.push('🏞️ 1 hectárea de bosque protegido')

    return impacts
  }

  /**
   * Verificar si el usuario ya donó a una causa
   */
  hasDonatedToCause(causeId: string): boolean {
    return this.donations.some(donation => donation.causeId === causeId)
  }

  /**
   * Obtener causas más populares
   */
  getPopularCauses(limit: number = 3): DonationCause[] {
    const stats = this.getDonationStats()
    
    return this.causes
      .map(cause => ({
        ...cause,
        donationCount: stats.byCause[cause.id]?.count || 0,
        donationAmount: stats.byCause[cause.id]?.amount || 0
      }))
      .sort((a, b) => b.donationCount - a.donationCount)
      .slice(0, limit)
  }

  /**
   * Generar certificado de donación
   */
  generateDonationCertificate(donationId: string): string {
    const donation = this.donations.find(d => d.id === donationId)
    if (!donation) return ''

    const cause = this.getCauseById(donation.causeId)
    if (!cause) return ''

    const certificate = `
    ╔════════════════════════════════════════════════════════════════╗
    ║                    CERTIFICADO DE DONACIÓN                      ║
    ╠════════════════════════════════════════════════════════════════╣
    ║                                                                  ║
    ║  Se certifica que una donación fue realizada para:              ║
    ║                                                                  ║
    ║  ${cause.name.padEnd(50)} ║
    ║                                                                  ║
    ║  Monto: ${this.formatDonationAmount(donation.amount).padEnd(40)} ║
    ║  Fecha: ${new Date(donation.timestamp).toLocaleDateString('es-CO').padEnd(38)} ║
    ║  ID: ${donation.id.padEnd(50)} ║
    ║                                                                  ║
    ║  Impacto de tu aporte:                                          ║
    ${this.getDonationImpact(donation.amount).map(impact => `  ║  ${impact.padEnd(50)} ║`).join('\n')}
    ║                                                                  ║
    ║  Salento a la mano - Turismo Sostenible y Regenerativo         ║
    ║  Salento, Quindío, Colombia                                     ║
    ║                                                                  ║
    ╚════════════════════════════════════════════════════════════════╝
    `
    
    return certificate
  }

  /**
   * Guardar donaciones en localStorage
   */
  private saveDonationsToStorage(): void {
    try {
      localStorage.setItem('salento_donations', JSON.stringify(this.donations))
      localStorage.setItem('salento_causes', JSON.stringify(this.causes))
    } catch (error) {
      console.error('Error saving donations to storage:', error)
    }
  }

  /**
   * Cargar donaciones desde localStorage
   */
  private loadDonationsFromStorage(): void {
    try {
      const storedDonations = localStorage.getItem('salento_donations')
      const storedCauses = localStorage.getItem('salento_causes')
      
      if (storedDonations) {
        this.donations = JSON.parse(storedDonations)
      }
      
      if (storedCauses) {
        this.causes = JSON.parse(storedCauses)
      }
    } catch (error) {
      console.error('Error loading donations from storage:', error)
    }
  }

  /**
   * Simular proceso de pago (en producción sería integración real)
   */
  async processPayment(amount: number, causeId: string): Promise<{ success: boolean; transactionId?: string }> {
    // Simulación de proceso de pago
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% éxito
        resolve({
          success,
          transactionId: success ? `txn-${Date.now()}` : undefined
        })
      }, 1500)
    })
  }

  /**
   * Obtener historial de donaciones del usuario
   */
  getUserDonationHistory(): Donation[] {
    return this.donations.filter(donation => !donation.isAnonymous)
  }

  /**
   * Obtener progreso general de todas las causas
   */
  getOverallProgress(): {
    totalTarget: number
    totalCurrent: number
    overallProgress: number
  } {
    const totalTarget = this.causes.reduce((sum, cause) => sum + cause.targetAmount, 0)
    const totalCurrent = this.causes.reduce((sum, cause) => sum + cause.currentAmount, 0)
    const overallProgress = Math.round((totalCurrent / totalTarget) * 100)

    return {
      totalTarget,
      totalCurrent,
      overallProgress
    }
  }
}

// Exportar instancia singleton
export const donationService = new DonationService()
export default donationService