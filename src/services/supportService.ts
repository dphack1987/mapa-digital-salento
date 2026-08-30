interface SupportTicket {
  id: string
  touristName: string
  touristEmail: string
  category: 'emergency' | 'information' | 'complaint' | 'suggestion' | 'technical'
  subject: string
  message: string
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  response?: string
  location?: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  language: 'es' | 'en'
  helpful: number
  notHelpful: number
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: 'police' | 'medical' | 'fire' | 'tourist_police' | 'red_cross'
  available24h: boolean
}

class SupportService {
  private tickets: SupportTicket[] = []
  private faqs: FAQ[] = []
  private emergencyContacts: EmergencyContact[] = []
  private initialized = false

  initialize() {
    if (this.initialized) return
    this.generateSampleData()
    this.initialized = true
  }

  private generateSampleData() {
    // Generate sample FAQs
    this.faqs = [
      {
        id: 'faq1',
        question: '¿Cómo llego al Valle de Cocora?',
        answer: 'Puedes tomar un jeep Willy desde la plaza principal de Salento. Los jeeps salen cada 30 minutos desde las 6:00 AM hasta las 6:00 PM. El viaje dura aproximadamente 30 minutos y cuesta $3,000 COP por persona.',
        category: 'transport',
        language: 'es',
        helpful: 45,
        notHelpful: 2
      },
      {
        id: 'faq2',
        question: '¿Cuál es la mejor época para visitar Salento?',
        answer: 'La mejor época es durante la temporada seca (diciembre a marzo y julio a agosto) cuando hay menos lluvias. Sin embargo, Salento es hermoso durante todo el año. Lleva siempre ropa impermeable ya que el clima puede cambiar rápidamente.',
        category: 'general',
        language: 'es',
        helpful: 38,
        notHelpful: 1
      },
      {
        id: 'faq3',
        question: '¿Dónde puedo cambiar divisas?',
        answer: 'En Salento hay varios puntos de cambio de divisas en la plaza principal. También puedes usar los cajeros automáticos disponibles. Te recomendamos cambiar solo lo necesario y siempre revisar las tasas de cambio.',
        category: 'practical',
        language: 'es',
        helpful: 29,
        notHelpful: 3
      },
      {
        id: 'faq4',
        question: '¿Es seguro caminar de noche en Salento?',
        answer: 'Salento es generalmente un pueblo seguro, pero como en cualquier lugar, se recomienda precaución. Evita caminar solo por zonas poco iluminadas y guarda tus pertenencias de valor. El centro del pueblo suele estar tranquilo hasta tarde.',
        category: 'safety',
        language: 'es',
        helpful: 42,
        notHelpful: 4
      },
      {
        id: 'faq5',
        question: '¿Qué debo llevar para el Valle de Cocora?',
        answer: 'Lleva: ropa cómoda para caminar, botas o zapatos resistentes, protector solar, sombrero, agua suficiente, snacks, impermeable (llueve frecuentemente), y cámara. Si planeas cabalgar, usa pantalón largo.',
        category: 'practical',
        language: 'es',
        helpful: 51,
        notHelpful: 1
      },
      {
        id: 'faq6',
        question: 'How do I get to Cocora Valley?',
        answer: 'You can take a Willy Jeep from Salento\'s main square. Jeeps depart every 30 minutes from 6:00 AM to 6:00 PM. The trip takes about 30 minutes and costs $3,000 COP per person.',
        category: 'transport',
        language: 'en',
        helpful: 23,
        notHelpful: 1
      },
      {
        id: 'faq7',
        question: 'What is the best time to visit Salento?',
        answer: 'The best time is during the dry season (December to March and July to August) when there is less rain. However, Salento is beautiful year-round. Always bring rain gear as the weather can change quickly.',
        category: 'general',
        language: 'en',
        helpful: 19,
        notHelpful: 0
      }
    ]

    // Generate emergency contacts
    this.emergencyContacts = [
      {
        id: 'emergency1',
        name: 'Emergencias 123',
        phone: '123',
        type: 'police',
        available24h: true
      },
      {
        id: 'emergency2',
        name: 'Policía Turística',
        phone: '311 123 4567',
        type: 'tourist_police',
        available24h: true
      },
      {
        id: 'emergency3',
        name: 'Cruz Roja',
        phone: '132',
        type: 'red_cross',
        available24h: true
      },
      {
        id: 'emergency4',
        name: 'Ambulancia',
        phone: '125',
        type: 'medical',
        available24h: true
      },
      {
        id: 'emergency5',
        name: 'Bomberos',
        phone: '119',
        type: 'fire',
        available24h: true
      }
    ]
  }

  createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.tickets.push(newTicket)
    return newTicket
  }

  getTicket(ticketId: string): SupportTicket | undefined {
    return this.tickets.find(t => t.id === ticketId)
  }

  getTouristTickets(touristEmail: string): SupportTicket[] {
    return this.tickets.filter(t => t.touristEmail === touristEmail)
  }

  updateTicketStatus(ticketId: string, status: SupportTicket['status']): boolean {
    const ticket = this.tickets.find(t => t.id === ticketId)
    if (ticket) {
      ticket.status = status
      ticket.updatedAt = new Date()
      return true
    }
    return false
  }

  addResponse(ticketId: string, response: string): boolean {
    const ticket = this.tickets.find(t => t.id === ticketId)
    if (ticket) {
      ticket.response = response
      ticket.status = 'resolved'
      ticket.updatedAt = new Date()
      return true
    }
    return false
  }

  getFAQs(language: 'es' | 'en', category?: string): FAQ[] {
    let filtered = this.faqs.filter(faq => faq.language === language)
    if (category) {
      filtered = filtered.filter(faq => faq.category === category)
    }
    return filtered
  }

  rateFAQ(faqId: string, helpful: boolean): boolean {
    const faq = this.faqs.find(f => f.id === faqId)
    if (faq) {
      if (helpful) {
        faq.helpful++
      } else {
        faq.notHelpful++
      }
      return true
    }
    return false
  }

  searchFAQs(query: string, language: 'es' | 'en'): FAQ[] {
    const lowerQuery = query.toLowerCase()
    return this.faqs.filter(faq => 
      faq.language === language && 
      (faq.question.toLowerCase().includes(lowerQuery) || 
       faq.answer.toLowerCase().includes(lowerQuery))
    )
  }

  getEmergencyContacts(): EmergencyContact[] {
    return this.emergencyContacts
  }

  getEmergencyContactsByType(type: EmergencyContact['type']): EmergencyContact[] {
    return this.emergencyContacts.filter(contact => contact.type === type)
  }

  getTicketStatistics() {
    return {
      total: this.tickets.length,
      byStatus: {
        pending: this.tickets.filter(t => t.status === 'pending').length,
        in_progress: this.tickets.filter(t => t.status === 'in_progress').length,
        resolved: this.tickets.filter(t => t.status === 'resolved').length,
        closed: this.tickets.filter(t => t.status === 'closed').length
      },
      byCategory: {
        emergency: this.tickets.filter(t => t.category === 'emergency').length,
        information: this.tickets.filter(t => t.category === 'information').length,
        complaint: this.tickets.filter(t => t.category === 'complaint').length,
        suggestion: this.tickets.filter(t => t.category === 'suggestion').length,
        technical: this.tickets.filter(t => t.category === 'technical').length
      },
      byPriority: {
        urgent: this.tickets.filter(t => t.priority === 'urgent').length,
        high: this.tickets.filter(t => t.priority === 'high').length,
        medium: this.tickets.filter(t => t.priority === 'medium').length,
        low: this.tickets.filter(t => t.priority === 'low').length
      }
    }
  }

  getQuickActions(language: 'es' | 'en') {
    const actions = {
      es: [
        { id: 'emergency', label: '🚨 Emergencia', action: 'emergency', priority: 'urgent' },
        { id: 'lost', label: '🔍 Objeto Perdido', action: 'lost_item', priority: 'high' },
        { id: 'medical', label: '🏥 Ayuda Médica', action: 'medical_help', priority: 'urgent' },
        { id: 'transport', label: '🚗 Información Transporte', action: 'transport_info', priority: 'medium' },
        { id: 'accommodation', label: '🏠 Problema Alojamiento', action: 'accommodation_issue', priority: 'medium' },
        { id: 'suggestion', label: '💡 Sugerencia', action: 'suggestion', priority: 'low' }
      ],
      en: [
        { id: 'emergency', label: '🚨 Emergency', action: 'emergency', priority: 'urgent' },
        { id: 'lost', label: '🔍 Lost Item', action: 'lost_item', priority: 'high' },
        { id: 'medical', label: '🏥 Medical Help', action: 'medical_help', priority: 'urgent' },
        { id: 'transport', label: '🚗 Transport Info', action: 'transport_info', priority: 'medium' },
        { id: 'accommodation', label: '🏠 Accommodation Issue', action: 'accommodation_issue', priority: 'medium' },
        { id: 'suggestion', label: '💡 Suggestion', action: 'suggestion', priority: 'low' }
      ]
    }
    return actions[language]
  }
}

const supportService = new SupportService()
export default supportService