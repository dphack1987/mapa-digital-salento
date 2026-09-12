// Servicio de eventos culturales y agenda en vivo
// Proporciona información actualizada de eventos en Salento

interface Event {
  id: string
  title: string
  description: string
  category: 'music' | 'culture' | 'food' | 'crafts' | 'nature' | 'community'
  date: Date
  time: string
  location: string
  price?: string
  organizer: string
  contact?: string
  imageUrl?: string
  isFree: boolean
  highlights: string[]
  language: 'es' | 'en' | 'both'
}

interface EventFilters {
  category?: string
  date?: Date
  isFree?: boolean
  language?: string
}

class EventsService {
  private events: Event[] = []
  private lastUpdate: number = 0
  private updateInterval = 6 * 60 * 60 * 1000 // 6 horas

  /**
   * Inicializar con eventos de demostración
   */
  initialize(): void {
    this.loadDemoEvents()
    this.loadEventsFromStorage()
  }

  /**
   * Cargar eventos de demostración basados en eventos típicos de Salento
   */
  private loadDemoEvents(): void {
    const today = new Date()
    const todayDate = today.toISOString().split('T')[0]
    
    // Fechas para eventos específicos de septiembre 2026
    const festivalStartDate = new Date('2026-09-10')
    const festivalEndDate = new Date('2026-09-20')
    const marathonDate = new Date('2026-09-13')
    
    this.events = [
      {
        id: 'event-1',
        title: '🐟 Festival de la Trucha 2026',
        description: '40 restaurantes participantes presentan sus mejores preparaciones de trucha por $28.000. Platos especiales con café, naranja y otras preparaciones tradicionales. Ubicaciones: Plaza Bolívar, Calle Real y Valle de Cocora.',
        category: 'food',
        date: festivalStartDate,
        time: '10:00 - 22:00',
        location: 'Plaza Bolívar, Calle Real y Valle de Cocora, Salento',
        price: 'Platos $28.000 COP',
        organizer: 'Cámara de Comercio de Armenia y del Quindío',
        contact: 'www.festivaldelatrucha.com',
        isFree: false,
        highlights: ['40 restaurantes', 'Platos especiales de trucha', 'Reactivación económica'],
        language: 'both'
      },
      {
        id: 'event-2',
        title: '🏃 Media Maratón Entre Montañas',
        description: '1.700 corredores inscritos participan en recorridos de 10K y 22K sobre asfalto con vistas espectaculares de la Cordillera Central. Ruta: Plaza Bolívar → Calle Real → Vía Valle de Cocora → Retorno.',
        category: 'culture',
        date: marathonDate,
        time: '06:00 - 14:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Inscripciones variadas',
        organizer: 'Media Maratón Entre Montañas',
        contact: 'www.mediamaratonentremontanas.com.co',
        isFree: false,
        highlights: ['1.700 corredores', 'Recorridos 10K y 22K', 'Vistas de palmas de cera'],
        language: 'both'
      },
      {
        id: 'event-3',
        title: '🎵 Latinoamérica Fest',
        description: 'Festival latinoamericano de música con diferentes presentaciones artísticas. Música en vivo y cultural para todos los visitantes.',
        category: 'music',
        date: new Date('2026-09-12'),
        time: '15:00 - 22:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 123 4567',
        isFree: true,
        highlights: ['Música latinoamericana', 'Presentaciones artísticas', 'Ambiente familiar'],
        language: 'both'
      },
      {
        id: 'event-4',
        title: '💃 Coroteo Campesino',
        description: 'Actividad cultural tradicional con música y danzas típicas del Quindío. Experiencia auténtica de la cultura cafetera.',
        category: 'culture',
        date: new Date('2026-09-14'),
        time: '18:00 - 21:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 234 5678',
        isFree: true,
        highlights: ['Tradición quindiana', 'Música típica', 'Cultura local'],
        language: 'both'
      },
      {
        id: 'event-5',
        title: '🎭 Rajaleña',
        description: 'Actividad folclórica tradicional con música, bailes y participación comunitaria. Celebración de las raíces culturales de Salento.',
        category: 'culture',
        date: new Date('2026-09-15'),
        time: '19:00 - 22:00',
        location: 'Calle Real, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 345 6789',
        isFree: true,
        highlights: ['Folclore tradicional', 'Participación comunitaria', 'Música local'],
        language: 'both'
      },
      {
        id: 'event-6',
        title: '🎪 Presentaciones Familia Castañeda',
        description: 'Espectáculo de música tradicional con la reconocida Familia Castañeda. Música andina colombiana e instrumentos típicos.',
        category: 'music',
        date: new Date('2026-09-16'),
        time: '20:00 - 22:00',
        location: 'Teatro Municipal, Salento',
        price: '$15.000 COP',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 456 7890',
        isFree: false,
        highlights: ['Música andina', 'Instrumentos típicos', 'Grupo reconocido'],
        language: 'both'
      },
      {
        id: 'event-7',
        title: '🌱 Recicla por el Río',
        description: 'Jornada ambiental con conciertos donde los asistentes pueden llevar elementos reciclables para contribuir con los damnificados del municipio post-terremoto.',
        category: 'community',
        date: new Date('2026-09-17'),
        time: '10:00 - 18:00',
        location: 'Río Barbas, cercanías de Salento',
        price: 'Gratis (llevar reciclables)',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 567 8901',
        isFree: true,
        highlights: ['Actividad ambiental', 'Conciertos', 'Apoyo a damnificados'],
        language: 'both'
      },
      {
        id: 'event-8',
        title: '🎨 Danzas y Teatro',
        description: 'Presentaciones de grupos de danza y teatro local. Espectáculos culturales que muestran el talento artístico de la comunidad.',
        category: 'culture',
        date: new Date('2026-09-18'),
        time: '16:00 - 21:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 678 9012',
        isFree: true,
        highlights: ['Arte local', 'Danzas tradicionales', 'Teatro comunitario'],
        language: 'both'
      },
      {
        id: 'event-9',
        title: '🎂 Celebraciones del Municipio',
        description: 'Actividades especiales conmemorando el cumpleaños del municipio de Salento y la palma de cera como árbol nacional. Encuentros con estudiantes y actividades ambientales.',
        category: 'community',
        date: new Date('2026-09-19'),
        time: '09:00 - 20:00',
        location: 'Varios puntos, Salento',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 789 0123',
        isFree: true,
        highlights: ['Cumpleaños del municipio', 'Palma de cera', 'Actividades ambientales'],
        language: 'both'
      },
      {
        id: 'event-10',
        title: '🍽️ Gastronomía del Festival',
        description: 'Degustación de platos especiales de trucha preparados por los 40 restaurantes participantes del Festival de la Trucha. Último día del festival.',
        category: 'food',
        date: festivalEndDate,
        time: '10:00 - 22:00',
        location: 'Plaza Bolívar, Calle Real y Valle de Cocora, Salento',
        price: 'Platos $28.000 COP',
        organizer: 'Cámara de Comercio de Armenia y del Quindío',
        contact: 'www.festivaldelatrucha.com',
        isFree: false,
        highlights: ['Cierre del festival', '40 restaurantes', 'Platos especiales'],
        language: 'both'
      }
    ]

    this.lastUpdate = Date.now()
    this.saveEventsToStorage()
  }

  /**
   * Obtener todos los eventos
   */
  getAllEvents(): Event[] {
    return this.events
  }

  /**
   * Obtener eventos de hoy
   */
  getTodayEvents(): Event[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === today.getTime()
    })
  }

  /**
   * Obtener eventos activos (hoy y esta semana)
   */
  getActiveEvents(): Event[] {
    const today = new Date()
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + 7)
    
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= endOfWeek
    })
  }

  /**
   * Obtener eventos de esta semana
   */
  getThisWeekEvents(): Event[] {
    const today = new Date()
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + 7)
    
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= endOfWeek
    })
  }

  /**
   * Obtener eventos por categoría
   */
  getEventsByCategory(category: string): Event[] {
    return this.events.filter(event => event.category === category)
  }

  /**
   * Obtener eventos filtrados
   */
  getFilteredEvents(filters: EventFilters): Event[] {
    let filtered = [...this.events]
    
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category)
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date)
      filterDate.setHours(0, 0, 0, 0)
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === filterDate.getTime()
      })
    }
    
    if (filters.isFree !== undefined) {
      filtered = filtered.filter(event => event.isFree === filters.isFree)
    }
    
    if (filters.language) {
      filtered = filtered.filter(event => 
        event.language === filters.language || event.language === 'both'
      )
    }
    
    return filtered
  }

  /**
   * Obtener evento por ID
   */
  getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id)
  }

  /**
   * Obtener eventos destacados
   */
  getFeaturedEvents(): Event[] {
    return this.events.filter(event => 
      event.isFree || 
      event.category === 'music' || 
      event.category === 'culture'
    ).slice(0, 3)
  }

  /**
   * Obtener categorías disponibles
   */
  getCategories(): Array<{ id: string; name: string; icon: string }> {
    return [
      { id: 'music', name: 'Música', icon: '🎵' },
      { id: 'culture', name: 'Cultura', icon: '🎭' },
      { id: 'food', name: 'Gastronomía', icon: '🍽️' },
      { id: 'crafts', name: 'Artesanías', icon: '🧶' },
      { id: 'nature', name: 'Naturaleza', icon: '🌿' },
      { id: 'community', name: 'Comunidad', icon: '👥' }
    ]
  }

  /**
   * Formatear fecha para display
   */
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('es-CO', options)
  }

  /**
   * Verificar si el evento es hoy
   */
  isEventToday(event: Event): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    
    return eventDate.getTime() === today.getTime()
  }

  /**
   * Obtener eventos que están ocurriendo ahora
   */
  getCurrentEvents(): Event[] {
    const now = new Date()
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      const [startHour, startMin] = event.time.split('-')[0].trim().split(':').map(Number)
      const [endHour, endMin] = event.time.split('-')[1].trim().split(':').map(Number)
      
      const startTime = new Date(eventDate)
      startTime.setHours(startHour, startMin, 0, 0)
      
      const endTime = new Date(eventDate)
      endTime.setHours(endHour, endMin, 0, 0)
      
      return now >= startTime && now <= endTime
    })
  }

  /**
   * Guardar eventos en localStorage
   */
  private saveEventsToStorage(): void {
    try {
      localStorage.setItem('salento_events_data', JSON.stringify({
        events: this.events,
        lastUpdate: this.lastUpdate
      }))
    } catch (error) {
      console.error('Error saving events to storage:', error)
    }
  }

  /**
   * Cargar eventos desde localStorage
   */
  private loadEventsFromStorage(): void {
    try {
      const stored = localStorage.getItem('salento_events_data')
      if (stored) {
        const data = JSON.parse(stored)
        this.events = data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }))
        this.lastUpdate = data.lastUpdate
      }
    } catch (error) {
      console.error('Error loading events from storage:', error)
    }
  }

  /**
   * Obtener última actualización
   */
  getLastUpdate(): Date {
    return new Date(this.lastUpdate)
  }

  /**
   * Verificar si los datos están actualizados
   */
  isDataFresh(): boolean {
    return Date.now() - this.lastUpdate < this.updateInterval
  }

  /**
   * Forzar actualización de eventos
   */
  forceUpdate(): void {
    this.loadDemoEvents()
  }
}

// Exportar instancia singleton
export const eventsService = new EventsService()
export default eventsService