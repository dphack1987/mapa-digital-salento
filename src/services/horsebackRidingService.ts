// Servicio de reservas para cabalgatas tradicionales
// Especializado en el sello insignia de Salento

interface HorsebackRidingOperator {
  id: string
  name: string
  location: string
  rating: number
  experience: string
  routes: HorsebackRoute[]
  contact: {
    phone: string
    whatsapp: string
    email: string
  }
  prices: {
    basic: number
    premium: number
    private: number
  }
  capacity: {
    maxGroups: number
    maxPeoplePerGroup: number
  }
  certifications: string[]
  operatingHours: {
    start: string
    end: string
  }
}

interface HorsebackRoute {
  id: string
  name: string
  description: string
  duration: number // en minutos
  difficulty: 'fácil' | 'moderado' | 'difícil'
  distance: number // en km
  highlights: string[]
  pricePerPerson: number
  maxPeople: number
  requirements: string[]
}

interface HorsebackReservation {
  reservationId: string
  operatorId: string
  customerInfo: {
    name: string
    phone: string
    email: string
    hotel?: string
    roomNumber?: string
  }
  routeId: string
  date: Date
  time: string
  participants: number
  experienceLevel: 'principiante' | 'intermedio' | 'avanzado'
  specialRequests?: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  confirmedAt?: Date
}

class HorsebackRidingService {
  private operators: Map<string, HorsebackRidingOperator> = new Map()
  private reservations: Map<string, HorsebackReservation> = new Map()
  private reservationCounter = 0

  /**
   * Inicializar con operadores de ejemplo
   */
  initialize() {
    const sampleOperators: HorsebackRidingOperator[] = [
      {
        id: 'OP-001',
        name: 'Cabalgatas del Valle',
        location: 'Valle de Cocora',
        rating: 4.8,
        experience: '15 años',
        routes: [
          {
            id: 'R-001',
            name: 'Ruta de las Palmas',
            description: 'Recorrido por el Valle de Cocora con vistas espectaculares de las palmas de cera',
            duration: 180,
            difficulty: 'moderado',
            distance: 8,
            highlights: ['Valle de Cocora', 'Miradores', 'Palmas de cera gigantes'],
            pricePerPerson: 80000,
            maxPeople: 8,
            requirements: ['Mínimo 12 años', 'Calzado cerrado', 'Ropa cómoda']
          },
          {
            id: 'R-002',
            name: 'Sendero a la Cruz',
            description: 'Caminata hasta el Alto de la Cruz con vistas panorámicas de Salento',
            duration: 120,
            difficulty: 'fácil',
            distance: 5,
            highlights: ['Alto de la Cruz', 'Vistas del pueblo', 'Atardecer'],
            pricePerPerson: 60000,
            maxPeople: 6,
            requirements: ['Mínimo 10 años', 'Protector solar']
          }
        ],
        contact: {
          phone: '+573001234567',
          whatsapp: '+573001234567',
          email: 'cabalgatas@valle.com'
        },
        prices: {
          basic: 60000,
          premium: 80000,
          private: 150000
        },
        capacity: {
          maxGroups: 4,
          maxPeoplePerGroup: 8
        },
        certifications: ['Certificado PNAL', 'Guías locales capacitados', 'Seguros incluidos'],
        operatingHours: {
          start: '08:00',
          end: '17:00'
        }
      },
      {
        id: 'OP-002',
        name: 'Pesebrera El Arriero',
        location: 'Salento Centro',
        rating: 4.6,
        experience: '20 años',
        routes: [
          {
            id: 'R-003',
            name: 'Caminata Ecológica',
            description: 'Ruta ecológica por los alrededores de Salento con avistamiento de aves',
            duration: 150,
            difficulty: 'fácil',
            distance: 6,
            highlights: ['Aves nativas', 'Flora local', 'Cafetales'],
            pricePerPerson: 70000,
            maxPeople: 10,
            requirements: ['Cámara recomendada', 'Binoculares opcionales']
          }
        ],
        contact: {
          phone: '+573009876543',
          whatsapp: '+573009876543',
          email: 'info@elarriero.com'
        },
        prices: {
          basic: 55000,
          premium: 75000,
          private: 120000
        },
        capacity: {
          maxGroups: 3,
          maxPeoplePerGroup: 10
        },
        certifications: ['Operador certificado', 'Guías bilingües', 'Bienestar animal garantizado'],
        operatingHours: {
          start: '07:00',
          end: '18:00'
        }
      }
    ]

    sampleOperators.forEach(op => this.operators.set(op.id, op))
  }

  /**
   * Obtener todos los operadores
   */
  getOperators(): HorsebackRidingOperator[] {
    return Array.from(this.operators.values())
  }

  /**
   * Obtener operador por ID
   */
  getOperator(operatorId: string): HorsebackRidingOperator | undefined {
    return this.operators.get(operatorId)
  }

  /**
   * Obtener rutas disponibles
   */
  getAvailableRoutes(): HorsebackRoute[] {
    const routes: HorsebackRoute[] = []
    this.operators.forEach(operator => {
      routes.push(...operator.routes)
    })
    return routes
  }

  /**
   * Obtener ruta por ID
   */
  getRoute(routeId: string): HorsebackRoute | undefined {
    for (const operator of this.operators.values()) {
      const route = operator.routes.find(r => r.id === routeId)
      if (route) return route
    }
    return undefined
  }

  /**
   * Crear reserva de cabalgata
   */
  createReservation(reservationData: {
    operatorId: string
    routeId: string
    customerInfo: Omit<HorsebackReservation['customerInfo'], 'hotel' | 'roomNumber'> & { hotel?: string; roomNumber?: string }
    date: Date
    time: string
    participants: number
    experienceLevel: HorsebackReservation['experienceLevel']
    specialRequests?: string
  }): HorsebackReservation {
    const operator = this.operators.get(reservationData.operatorId)
    const route = operator?.routes.find(r => r.id === reservationData.routeId)
    
    if (!operator || !route) {
      throw new Error('Operador o ruta no encontrados')
    }

    if (reservationData.participants > route.maxPeople) {
      throw new Error(`El máximo de participantes para esta ruta es ${route.maxPeople}`)
    }

    this.reservationCounter++
    const reservationId = this.generateReservationId()

    const reservation: HorsebackReservation = {
      reservationId,
      operatorId: reservationData.operatorId,
      customerInfo: {
        ...reservationData.customerInfo,
        hotel: reservationData.customerInfo.hotel,
        roomNumber: reservationData.customerInfo.roomNumber
      },
      routeId: reservationData.routeId,
      date: reservationData.date,
      time: reservationData.time,
      participants: reservationData.participants,
      experienceLevel: reservationData.experienceLevel,
      specialRequests: reservationData.specialRequests,
      totalPrice: route.pricePerPerson * reservationData.participants,
      status: 'pending',
      createdAt: new Date()
    }

    this.reservations.set(reservationId, reservation)
    return reservation
  }

  /**
   * Obtener reserva por ID
   */
  getReservation(reservationId: string): HorsebackReservation | undefined {
    return this.reservations.get(reservationId)
  }

  /**
   * Obtener reservas por cliente
   */
  getReservationsByCustomer(customerPhone: string): HorsebackReservation[] {
    return Array.from(this.reservations.values()).filter(
      r => r.customerInfo.phone === customerPhone
    )
  }

  /**
   * Obtener reservas por operador
   */
  getReservationsByOperator(operatorId: string): HorsebackReservation[] {
    return Array.from(this.reservations.values()).filter(
      r => r.operatorId === operatorId
    )
  }

  /**
   * Obtener reservas por fecha
   */
  getReservationsByDate(date: Date): HorsebackReservation[] {
    return Array.from(this.reservations.values()).filter(
      r => r.date.toDateString() === date.toDateString()
    )
  }

  /**
   * Confirmar reserva
   */
  confirmReservation(reservationId: string): boolean {
    const reservation = this.reservations.get(reservationId)
    if (reservation && reservation.status === 'pending') {
      reservation.status = 'confirmed'
      reservation.confirmedAt = new Date()
      this.reservations.set(reservationId, reservation)
      return true
    }
    return false
  }

  /**
   * Cancelar reserva
   */
  cancelReservation(reservationId: string, reason?: string): boolean {
    const reservation = this.reservations.get(reservationId)
    if (reservation && reservation.status !== 'completed') {
      reservation.status = 'cancelled'
      if (reason) {
        reservation.specialRequests = (reservation.specialRequests || '') + `\nCANCELACIÓN: ${reason}`
      }
      this.reservations.set(reservationId, reservation)
      return true
    }
    return false
  }

  /**
   * Completar reserva
   */
  completeReservation(reservationId: string): boolean {
    const reservation = this.reservations.get(reservationId)
    if (reservation && reservation.status === 'confirmed') {
      reservation.status = 'completed'
      this.reservations.set(reservationId, reservation)
      return true
    }
    return false
  }

  /**
   * Generar mensaje de WhatsApp para reserva
   */
  generateWhatsAppMessage(reservationId: string, language: 'es' | 'en' = 'es'): string {
    const reservation = this.reservations.get(reservationId)
    const operator = reservation ? this.operators.get(reservation.operatorId) : null
    const route = reservation ? operator?.routes.find(r => r.id === reservation.routeId) : null

    if (!reservation || !operator || !route) {
      return ''
    }

    const isSpanish = language === 'es'

    const header = isSpanish
      ? `🐎 *RESERVA DE CABALGATA* #${reservation.reservationId}`
      : `🐎 *HORSEBACK RIDING RESERVATION* #${reservation.reservationId}`

    const customerInfo = isSpanish
      ? `👤 *Cliente:* ${reservation.customerInfo.name}`
      : `👤 *Customer:* ${reservation.customerInfo.name}`

    const contact = isSpanish
      ? `📞 *Contacto:* ${reservation.customerInfo.phone}`
      : `📞 *Contact:* ${reservation.customerInfo.phone}`

    const location = reservation.customerInfo.hotel
      ? (isSpanish
        ? `🏨 *Hotel:* ${reservation.customerInfo.hotel}${reservation.customerInfo.roomNumber ? ` - Hab: ${reservation.customerInfo.roomNumber}` : ''}`
        : `🏨 *Hotel:* ${reservation.customerInfo.hotel}${reservation.customerInfo.roomNumber ? ` - Room: ${reservation.customerInfo.roomNumber}` : ''}`)
      : ''

    const routeInfo = isSpanish
      ? `🛤️ *Ruta:* ${route.name}`
      : `🛤️ *Route:* ${route.name}`

    const dateInfo = isSpanish
      ? `📅 *Fecha:* ${reservation.date.toLocaleDateString()} - ${reservation.time}`
      : `📅 *Date:* ${reservation.date.toLocaleDateString()} - ${reservation.time}`

    const participants = isSpanish
      ? `👥 *Participantes:* ${reservation.participants}`
      : `👥 *Participants:* ${reservation.participants}`

    const experience = isSpanish
      ? `🎯 *Nivel:* ${reservation.experienceLevel}`
      : `🎯 *Level:* ${reservation.experienceLevel}`

    const total = isSpanish
      ? `💰 *Total:* $${reservation.totalPrice.toLocaleString()}`
      : `💰 *Total:* $${reservation.totalPrice.toLocaleString()}`

    const operatorInfo = isSpanish
      ? `🏢 *Operador:* ${operator.name}`
      : `🏢 *Operator:* ${operator.name}`

    let message = `${header}\n${customerInfo}\n${contact}${location ? `\n${location}` : ''}\n${routeInfo}\n${dateInfo}\n${participants}\n${experience}\n${total}\n${operatorInfo}`

    if (reservation.specialRequests) {
      const requests = isSpanish
        ? `\n📝 *Solicitudes:* ${reservation.specialRequests}`
        : `\n📝 *Requests:* ${reservation.specialRequests}`
      message += requests
    }

    const footer = isSpanish
      ? '\n\n✅ *Por favor confirmar disponibilidad*'
      : '\n\n✅ *Please confirm availability*'

    return message + footer
  }

  /**
   * Verificar disponibilidad
   */
  checkAvailability(operatorId: string, date: Date, time: string, participants: number): { available: boolean; message?: string } {
    const operator = this.operators.get(operatorId)
    if (!operator) {
      return { available: false, message: 'Operador no encontrado' }
    }

    // Verificar horario de operación
    const [hours, minutes] = operator.operatingHours.start.split(':').map(Number)
    const [endHours, endMinutes] = operator.operatingHours.end.split(':').map(Number)
    const [requestedHours, requestedMinutes] = time.split(':').map(Number)
    
    const requestedTime = requestedHours * 60 + requestedMinutes
    const startTime = hours * 60 + minutes
    const endTime = endHours * 60 + endMinutes

    if (requestedTime < startTime || requestedTime > endTime) {
      return { 
        available: false, 
        message: `Horario no disponible. Operamos de ${operator.operatingHours.start} a ${operator.operatingHours.end}` 
      }
    }

    // Verificar capacidad en esa fecha
    const existingReservations = this.getReservationsByDate(date)
      .filter(r => r.operatorId === operatorId && r.time === time && r.status !== 'cancelled')
    
    const totalParticipants = existingReservations.reduce((sum, r) => sum + r.participants, 0)
    
    if (totalParticipants + participants > operator.capacity.maxPeoplePerGroup * operator.capacity.maxGroups) {
      return { 
        available: false, 
        message: 'Capacidad máxima alcanzada para este horario' 
      }
    }

    return { available: true }
  }

  /**
   * Obtener estadísticas
   */
  getStatistics(): {
    totalReservations: number
    totalRevenue: number
    reservationsByStatus: Record<string, number>
    reservationsByRoute: Record<string, number>
    averageParticipants: number
  } {
    const reservations = Array.from(this.reservations.values())
    
    const totalReservations = reservations.length
    const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0)
    const averageParticipants = totalReservations > 0 
      ? reservations.reduce((sum, r) => sum + r.participants, 0) / totalReservations 
      : 0

    const reservationsByStatus: Record<string, number> = {}
    const reservationsByRoute: Record<string, number> = {}

    reservations.forEach(r => {
      reservationsByStatus[r.status] = (reservationsByStatus[r.status] || 0) + 1
      reservationsByRoute[r.routeId] = (reservationsByRoute[r.routeId] || 0) + 1
    })

    return {
      totalReservations,
      totalRevenue,
      reservationsByStatus,
      reservationsByRoute,
      averageParticipants
    }
  }

  /**
   * Generar ID de reserva
   */
  private generateReservationId(): string {
    return `CAB-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }
}

// Exportar instancia singleton
export const horsebackRidingService = new HorsebackRidingService()
export default horsebackRidingService