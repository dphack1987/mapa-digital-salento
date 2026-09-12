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
        id: 'event-001',
        title: '🐟 Festival de la Trucha 2026',
        description: '40 restaurantes participantes presentan sus mejores preparaciones de trucha. Platos especiales con café, naranja y preparaciones tradicionales del Quindío. Ubicaciones: Plaza Bolívar, Calle Real y Valle de Cocora.',
        category: 'food',
        date: new Date('2026-09-10'),
        time: '10:00 - 22:00',
        location: 'Plaza Bolívar, Calle Real y Valle de Cocora',
        price: 'Platos desde $28.000',
        organizer: 'Cámara de Comercio del Quindío',
        contact: 'www.festivaldelatrucha.com',
        isFree: false,
        highlights: ['40 restaurantes', 'Trucha en 15 preparaciones', 'Todos los días'],
        language: 'both'
      },
      {
        id: 'event-002',
        title: '🏃 Media Maratón Entre Montañas',
        description: '1.700 corredores en recorridos de 10K y 22K con vistas de la Cordillera Central. Ruta: Plaza Bolívar → Calle Real → Vía Valle de Cocora → Retorno.',
        category: 'culture',
        date: new Date('2026-09-13'),
        time: '06:00 - 14:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Inscripción previa',
        organizer: 'Media Maratón Entre Montañas',
        contact: 'www.mediamaratonentremontanas.com.co',
        isFree: false,
        highlights: ['1.700 corredores', '10K y 22K', 'Vistas de palmas de cera'],
        language: 'both'
      },
      {
        id: 'event-003',
        title: '🎵 Festival Latinoamérica Fest',
        description: 'Festival de música latinoamericana con presentaciones artísticas en vivo. Música, danza y cultura para toda la familia.',
        category: 'music',
        date: new Date('2026-09-12'),
        time: '15:00 - 22:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 123 4567',
        isFree: true,
        highlights: ['Música en vivo', 'Ambiente familiar', 'Toda la noche'],
        language: 'both'
      },
      {
        id: 'event-004',
        title: '💃 Coroteo Campesino',
        description: 'Música y danzas típicas del Quindío en la Plaza de Bolívar. Experiencia auténtica de la cultura cafetera con tradición ancestral.',
        category: 'culture',
        date: new Date('2026-09-14'),
        time: '18:00 - 21:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura de Salento',
        contact: '+57 300 234 5678',
        isFree: true,
        highlights: ['Tradición quindiana', 'Música típica', 'Al aire libre'],
        language: 'both'
      },
      {
        id: 'event-005',
        title: '🎭 Rajaleña Folclórica',
        description: 'Actividad folclórica tradicional con música, bailes de negros y blancos y participación comunitaria en Calle Real.',
        category: 'culture',
        date: new Date('2026-09-15'),
        time: '19:00 - 22:00',
        location: 'Calle Real, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura de Salento',
        contact: '+57 300 345 6789',
        isFree: true,
        highlights: ['Folclore tradicional', 'Calle Real', 'Participación comunitaria'],
        language: 'both'
      },
      {
        id: 'event-006',
        title: '🎶 Familia Castañeda en Vivo',
        description: 'Espectáculo de música tradicional con la reconocida Familia Castañeda. Música andina colombiana e instrumentos típicos del Eje Cafetero.',
        category: 'music',
        date: new Date('2026-09-16'),
        time: '20:00 - 22:00',
        location: 'Teatro Municipal, Salento',
        price: '$15.000 COP',
        organizer: 'Secretaría de Cultura de Salento',
        contact: '+57 300 456 7890',
        isFree: false,
        highlights: ['Música andina', 'Instrumentos típicos', 'Grupo reconocido'],
        language: 'both'
      },
      {
        id: 'event-007',
        title: '🌱 Recicla por el Río',
        description: 'Jornada ambiental con conciertos. Lleva elementos reciclables para contribuir con la rehabilitación del río Barbas.',
        category: 'nature',
        date: new Date('2026-09-17'),
        time: '10:00 - 18:00',
        location: 'Río Barbas, cercanías de Salento',
        price: 'Gratis (llevar reciclables)',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 567 8901',
        isFree: true,
        highlights: ['Actividad ambiental', 'Conciertos', 'Río Barbas'],
        language: 'both'
      },
      {
        id: 'event-008',
        title: '🎨 Danzas y Teatro Municipal',
        description: 'Presentaciones de grupos locales de danza y teatro. Arte comunitario que refleja la identidad cultural de Salento.',
        category: 'culture',
        date: new Date('2026-09-18'),
        time: '16:00 - 21:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura de Salento',
        contact: '+57 300 678 9012',
        isFree: true,
        highlights: ['Arte local', 'Danzas tradicionales', 'Teatro comunitario'],
        language: 'both'
      },
      {
        id: 'event-009',
        title: '🎂 Celebración del Municipio',
        description: 'Conmemoración del aniversario de Salento y la palma de cera como árbol nacional. Actividades con estudiantes, feria artesanal yambiental.',
        category: 'community',
        date: new Date('2026-09-19'),
        time: '09:00 - 20:00',
        location: 'Varios puntos del municipio',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 789 0123',
        isFree: true,
        highlights: ['Aniversario municipal', 'Palma de cera', 'Feria artesanal'],
        language: 'both'
      },
      {
        id: 'event-010',
        title: '🍽️ Gastronomía del Festival - Cierre',
        description: 'Último día del Festival de la Trucha. Degustación de platos especiales preparados por los 40 restaurantes participantes.',
        category: 'food',
        date: new Date('2026-09-20'),
        time: '10:00 - 22:00',
        location: 'Plaza Bolívar, Calle Real y Valle de Cocora',
        price: 'Platos desde $28.000',
        organizer: 'Cámara de Comercio del Quindío',
        contact: 'www.festivaldelatrucha.com',
        isFree: false,
        highlights: ['Cierre del festival', '40 restaurantes', 'Último día'],
        language: 'both'
      },
      {
        id: 'event-011',
        title: '☕ Feria del Café Especial',
        description: 'Productores locales presentan cafés de origen único del Quindío. Catings, degustación y charlas sobre el proceso del café de especialidad.',
        category: 'food',
        date: new Date('2026-10-03'),
        time: '09:00 - 18:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Asociación de Cafeteros de Salento',
        contact: '+57 301 234 5678',
        isFree: true,
        highlights: ['Café de especialidad', 'Catas guiadas', 'Productores locales'],
        language: 'both'
      },
      {
        id: 'event-012',
        title: '🐎 Cabalgata por el Valle de Cocora',
        description: 'Recorrido a caballo por los senderos del Valle de Cocora entre palmas de cera. Incluye guía, hatos y almuerzo campestre.',
        category: 'nature',
        date: new Date('2026-10-04'),
        time: '07:00 - 15:00',
        location: 'Valle de Cocora, Salento',
        price: '$85.000 COP',
        organizer: 'Asociación de Guías de Salento',
        contact: '+57 302 345 6789',
        isFree: false,
        highlights: ['A caballo', 'Valle de Cocora', 'Almuerzo incluido'],
        language: 'es'
      },
      {
        id: 'event-013',
        title: '🎵 Noche de Música Andina',
        description: 'Concierto de música andina colombiana con bandas locales y grupos invitados del Eje Cafetero. guitarra, tiple y Bandola.',
        category: 'music',
        date: new Date('2026-10-10'),
        time: '19:00 - 22:30',
        location: 'Parque Nacional del Café, Montenegro',
        price: '$20.000 COP',
        organizer: 'Secretaría de Turismo del Quindío',
        contact: '+57 303 456 7890',
        isFree: false,
        highlights: ['Música andina', 'Bandas locales', 'Guitarra y tiple'],
        language: 'es'
      },
      {
        id: 'event-014',
        title: '🎨 Festival de Artesanías del Quindío',
        description: 'Feria de artesanías con 80 artesanos del Quindío. Tapetes de palma de cera, sombreros vueltiao, cerámica y tejidos tradicionales.',
        category: 'crafts',
        date: new Date('2026-10-11'),
        time: '09:00 - 19:00',
        location: 'Calle Real y Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Federación de Artesanos del Quindío',
        contact: '+57 304 567 8901',
        isFree: true,
        highlights: ['80 artesanos', 'Palma de cera', 'Sombreros vueltiao'],
        language: 'both'
      },
      {
        id: 'event-015',
        title: '🎃 Festival de la Achira y el Borojó',
        description: 'Celebración de los cultivos típicos del Quindío. Degustación de achira, borojó, lulo y frutas tropicales. Música y danzas.',
        category: 'food',
        date: new Date('2026-10-17'),
        time: '09:00 - 18:00',
        location: 'Vereda La Samaria, Salento',
        price: 'Gratis',
        organizer: 'Corregimiento de La Samaria',
        contact: '+57 305 678 9012',
        isFree: true,
        highlights: ['Frutas tropicales', 'Degustación', 'Cultivos locales'],
        language: 'both'
      },
      {
        id: 'event-016',
        title: '🏃 Circuito de Trail Salento',
        description: 'Circuito de trail running por senderos naturales de Salento. Recorridos de 8K, 15K y 25K con vistas del Eje Cafetero.',
        category: 'nature',
        date: new Date('2026-10-25'),
        time: '06:00 - 13:00',
        location: 'Salento, Quindío',
        price: '$45.000 COP',
        organizer: 'Club de Trail Salento',
        contact: '+57 306 789 0123',
        isFree: false,
        highlights: ['Trail running', '3 distancias', 'Senderos naturales'],
        language: 'es'
      },
      {
        id: 'event-017',
        title: '🎶 Festival Nacional de Música depjaramillo',
        description: 'Festival de música colombiana con bandas nacionales e internacionales. 3 días de música en vivo en el Parque Nacional del Café.',
        category: 'music',
        date: new Date('2026-11-07'),
        time: '14:00 - 23:00',
        location: 'Parque Nacional del Café, Montenegro',
        price: '$60.000 COP',
        organizer: 'Parque Nacional del Café',
        contact: 'www.parquenacionaldelcafe.com',
        isFree: false,
        highlights: ['Bandas nacionales', '3 días', 'Música en vivo'],
        language: 'es'
      },
      {
        id: 'event-018',
        title: '🎄 Encendido de Luces Navideñas',
        description: 'Ceremonia de encendido del árbol navideño en la Plaza de Bolívar. Música, villancicos y actividades para toda la familia.',
        category: 'community',
        date: new Date('2026-11-30'),
        time: '18:00 - 22:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 890 1234',
        isFree: true,
        highlights: ['Árbol navideño', 'Villancicos', 'Ambiente familiar'],
        language: 'both'
      },
      {
        id: 'event-019',
        title: '☕ Feria del Café de Especialidad',
        description: 'Exposición y degustación de cafés de especialidad del Quindío. 25 productores, catings, talleres y charlas sobre café premium.',
        category: 'food',
        date: new Date('2026-11-14'),
        time: '09:00 - 17:00',
        location: 'Centro Cultural, Salento',
        price: 'Gratis',
        organizer: 'Asociación de Cafeteros del Quindío',
        contact: '+57 301 345 6789',
        isFree: true,
        highlights: ['25 productores', 'Catas guiadas', 'Café premium'],
        language: 'both'
      },
      {
        id: 'event-020',
        title: '🎄 Festival de la Palma de Cera',
        description: 'Conmemoración del árbol nacional colombiano. Actividades ambientales, caminatas ecológicas y feria artesanal en el centro de Salento.',
        category: 'nature',
        date: new Date('2026-11-08'),
        time: '08:00 - 16:00',
        location: 'Centro de Salento y senderos cercanos',
        price: 'Gratis',
        organizer: 'Corporación Ambiental de Salento',
        contact: '+57 302 456 7890',
        isFree: true,
        highlights: ['Árbol nacional', 'Caminata ecológica', 'Feria artesanal'],
        language: 'both'
      },
      {
        id: 'event-021',
        title: '🎶 Feria Taurina del Quindío',
        description: 'Feria taurina tradicional con novilladas y corridas de toros. Evento cultural con tradición en el Eje Cafetero.',
        category: 'culture',
        date: new Date('2026-11-21'),
        time: '15:00 - 22:00',
        location: 'Plaza de Toros, Salento',
        price: '$30.000 COP',
        organizer: 'Junta de Festividades de Salento',
        contact: '+57 303 567 8901',
        isFree: false,
        highlights: ['Novilladas', 'Tradición cafetera', 'Cultura local'],
        language: 'es'
      },
      {
        id: 'event-022',
        title: '🎭 Festival de Teatro Callejero',
        description: 'Festival de teatro al aire libre con 12 grupos nacionales e internacionales. Obras de comedia, drama y teatro experimental.',
        category: 'culture',
        date: new Date('2026-12-05'),
        time: '10:00 - 22:00',
        location: 'Calle Real y Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Secretaría de Cultura de Salento',
        contact: '+57 304 678 9012',
        isFree: true,
        highlights: ['12 grupos', 'Teatro al aire libre', 'Nacional e internacional'],
        language: 'both'
      },
      {
        id: 'event-023',
        title: '🎄 Mercado Navideño Artesanal',
        description: 'Mercado navideño con 60 artesanos locales. Decoraciones, regalos, dulces típicos, chocolate caliente y villancicos.',
        category: 'crafts',
        date: new Date('2026-12-12'),
        time: '10:00 - 20:00',
        location: 'Parque Municipal, Salento',
        price: 'Gratis',
        organizer: 'Corporación de Artesanos de Salento',
        contact: '+57 305 789 0123',
        isFree: true,
        highlights: ['60 artesanos', 'Regalos navideños', 'Dulces típicos'],
        language: 'both'
      },
      {
        id: 'event-024',
        title: '🎊 Año Nuevo en Salento',
        description: 'Celebración de fin de año en la Plaza de Bolívar. Música en vivo, fuegos artificiales y brindis comunitario.',
        category: 'community',
        date: new Date('2026-12-31'),
        time: '20:00 - 02:00',
        location: 'Plaza de Bolívar, Salento',
        price: 'Gratis',
        organizer: 'Alcaldía de Salento',
        contact: '+57 300 890 1234',
        isFree: true,
        highlights: ['Fuegos artificiales', 'Brindis comunitario', 'Música en vivo'],
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
    const endOfMonth = new Date(today)
    endOfMonth.setDate(today.getDate() + 90)
    
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= endOfMonth
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