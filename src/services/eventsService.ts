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
    
    this.events = [
      {
        id: 'event-1',
        title: 'Música en la Plaza',
        description: 'Grupos de música tradicional de la región presentan canciones típicas del Quindío. Venta de snacks y bebidas locales.',
        category: 'music',
        date: new Date(todayDate + 'T19:00:00'),
        time: '19:00 - 21:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 123 4567',
        isFree: true,
        highlights: ['Música vallenata', 'Jazz latino', 'Rinde r'],
        language: 'both'
      },
      {
        id: 'event-2',
        title: 'Feria Artesanal del Fin de Semana',
        description: 'Exposición y venta de artesanías locales: ruanas, carrielas, textiles y cerámica de artesanos del municipio.',
        category: 'crafts',
        date: new Date(todayDate + 'T10:00:00'),
        time: '10:00 - 18:00',
        location: 'Calle Real, Salento',
        price: 'Entrada gratuita',
        organizer: 'Asociación de Artesanos de Salento',
        contact: '+57 300 234 5678',
        isFree: true,
        highlights: ['Artesanos locales', 'Textiles tradicionales', 'Cerámica'],
        language: 'both'
      },
      {
        id: 'event-3',
        title: 'Tour Nocturno del Casco Histórico',
        description: 'Recorrido guiado por las calles históricas de Salento con historias y leyendas del pueblo. Incluye café caliente.',
        category: 'culture',
        date: new Date(todayDate + 'T20:00:00'),
        time: '20:00 - 21:30',
        location: 'Salida desde Plaza de Bolívar',
        price: '$15.000 COP',
        organizer: 'Guías de Turismo Certificados',
        contact: '+57 300 345 6789',
        isFree: false,
        highlights: ['Historia local', 'Leyendas', 'Café incluido'],
        language: 'both'
      },
      {
        id: 'event-4',
        title: 'Festival de la Trucha y la Trucha',
        description: 'Competencia de cocina con trucha como ingrediente principal. Restaurantes locales presentan sus mejores platos.',
        category: 'food',
        date: new Date(todayDate + 'T12:00:00'),
        time: '12:00 - 16:00',
        location: 'Parque Principal, Salento',
        price: 'Entrada $5.000 COP',
        organizer: 'Asociación de Restaurantes de Salento',
        contact: '+57 300 456 7890',
        isFree: false,
        highlights: ['Cocina tradicional', 'Degustación', 'Concurso'],
        language: 'both'
      },
      {
        id: 'event-5',
        title: 'Taller de Tejido Tradicional',
        description: 'Aprende las técnicas de tejido utilizadas por los artesanos locales. Materiales incluidos. Cupos limitados.',
        category: 'crafts',
        date: new Date(todayDate + 'T14:00:00'),
        time: '14:00 - 17:00',
        location: 'Casa de la Cultura, Salento',
        price: '$25.000 COP',
        organizer: 'Casa de la Cultura Salento',
        contact: '+57 300 567 8901',
        isFree: false,
        highlights: ['Técnicas tradicionales', 'Materiales incluidos', 'Cupos limitados'],
        language: 'both'
      },
      {
        id: 'event-6',
        title: 'Caminata Ecológica a Cascada Santa Rita',
        description: 'Recorrido guiado a la cascada más cercana a Salento. Incluye información sobre flora y fauna local.',
        category: 'nature',
        date: new Date(todayDate + 'T08:00:00'),
        time: '08:00 - 10:00',
        location: 'Salida desde mirador Alto de la Cruz',
        price: '$10.000 COP',
        organizer: 'Guías del Cocora',
        contact: '+57 300 678 9012',
        isFree: false,
        highlights: ['Senderismo fácil', 'Flora y fauna', 'Fotografía'],
        language: 'both'
      },
      {
        id: 'event-7',
        title: 'Ronda de Cafés de Origen',
        description: 'Degustación comparativa de cafés de diferentes fincas del Quindío. Explicación del proceso de beneficio.',
        category: 'food',
        date: new Date(todayDate + 'T16:00:00'),
        time: '16:00 - 18:00',
        location: 'Café Quindío, Calle Real',
        price: '$20.000 COP',
        organizer: 'Café Quindío',
        contact: '+57 300 789 0123',
        isFree: false,
        highlights: ['Degustación', 'Café de origen', 'Explicación'],
        language: 'both'
      },
      {
        id: 'event-8',
        title: 'Noche de Cine al Aire Libre',
        description: 'Proyección de películas colombianas en la plaza principal. Venta de snacks y bebidas.',
        category: 'culture',
        date: new Date(todayDate + 'T19:30:00'),
        time: '19:30 - 22:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura Salento',
        contact: '+57 300 890 1234',
        isFree: true,
        highlights: ['Cine colombiano', 'Ambiente familiar', 'Snacks disponibles'],
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