import { useState, useEffect } from 'react'
import { 
  LifeBuoy, 
  Search, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Send,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  MapPin
} from 'lucide-react'
import supportService from '../services/supportService'

interface SupportCenterProps {
  onClose: () => void
  language: 'es' | 'en'
}

const SupportCenter: React.FC<SupportCenterProps> = ({ onClose, language }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'emergency' | 'ticket'>('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    category: 'information' as const,
    subject: '',
    message: '',
    location: ''
  })
  const [submittedTicket, setSubmittedTicket] = useState(false)

  const texts = {
    es: {
      title: 'Centro de Soporte',
      subtitle: 'Estamos aquí para ayudarte durante tu visita a Salento',
      tabs: {
        faq: 'Preguntas Frecuentes',
        emergency: 'Contactos de Emergencia',
        ticket: 'Enviar Solicitud'
      },
      search: 'Buscar preguntas...',
      categories: {
        all: 'Todas',
        transport: 'Transporte',
        general: 'General',
        practical: 'Práctico',
        safety: 'Seguridad'
      },
      helpful: '¿Te fue útil?',
      emergency: 'EMERGENCIAS',
      call: 'Llamar ahora',
      available24h: 'Disponible 24h',
      ticket: {
        title: 'Envíanos tu consulta',
        name: 'Tu nombre',
        email: 'Tu correo electrónico',
        category: 'Categoría',
        categories: {
          emergency: '🚨 Emergencia',
          information: 'ℹ️ Información',
          complaint: '😕 Queja',
          suggestion: '💡 Sugerencia',
          technical: '🔧 Técnico'
        },
        subject: 'Asunto',
        message: 'Mensaje',
        location: 'Ubicación (opcional)',
        submit: 'Enviar solicitud',
        submitting: 'Enviando...',
        success: '¡Solicitud enviada con éxito!',
        successMessage: 'Te responderemos lo antes posible. Guarda este número de referencia:'
      },
      close: 'Cerrar'
    },
    en: {
      title: 'Support Center',
      subtitle: 'We are here to help you during your visit to Salento',
      tabs: {
        faq: 'FAQ',
        emergency: 'Emergency Contacts',
        ticket: 'Submit Request'
      },
      search: 'Search questions...',
      categories: {
        all: 'All',
        transport: 'Transport',
        general: 'General',
        practical: 'Practical',
        safety: 'Safety'
      },
      helpful: 'Was this helpful?',
      emergency: 'EMERGENCIES',
      call: 'Call now',
      available24h: 'Available 24h',
      ticket: {
        title: 'Send us your inquiry',
        name: 'Your name',
        email: 'Your email',
        category: 'Category',
        categories: {
          emergency: '🚨 Emergency',
          information: 'ℹ️ Information',
          complaint: '😕 Complaint',
          suggestion: '💡 Suggestion',
          technical: '🔧 Technical'
        },
        subject: 'Subject',
        message: 'Message',
        location: 'Location (optional)',
        submit: 'Submit request',
        submitting: 'Submitting...',
        success: 'Request submitted successfully!',
        successMessage: 'We will respond as soon as possible. Save this reference number:'
      },
      close: 'Close'
    }
  }

  const t = texts[language]

  useEffect(() => {
    supportService.initialize()
  }, [])

  const faqs = searchQuery 
    ? supportService.searchFAQs(searchQuery, language)
    : supportService.getFAQs(language, selectedCategory === 'all' ? undefined : selectedCategory)

  const emergencyContacts = supportService.getEmergencyContacts()
  const quickActions = supportService.getQuickActions(language)

  const handleFAQRate = (faqId: string, helpful: boolean) => {
    supportService.rateFAQ(faqId, helpful)
  }

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const priority = ticketForm.category === 'emergency' ? 'urgent' : 
                     ticketForm.category === 'complaint' ? 'high' : 'medium'

    supportService.createTicket({
      touristName: ticketForm.name,
      touristEmail: ticketForm.email,
      category: ticketForm.category,
      subject: ticketForm.subject,
      message: ticketForm.message,
      priority,
      location: ticketForm.location || undefined
    })

    setSubmittedTicket(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmittedTicket(false)
      setTicketForm({
        name: '',
        email: '',
        category: 'information',
        subject: '',
        message: '',
        location: ''
      })
    }, 3000)
  }

  const handleEmergencyCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="support-overlay">
      <div className="support-modal">
        <div className="support-header">
          <div className="support-title-section">
            <LifeBuoy className="support-icon" size={28} />
            <div>
              <h2>{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
          </div>
          <button className="support-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="support-tabs">
          <button
            className={`support-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            {t.tabs.faq}
          </button>
          <button
            className={`support-tab ${activeTab === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            {t.tabs.emergency}
          </button>
          <button
            className={`support-tab ${activeTab === 'ticket' ? 'active' : ''}`}
            onClick={() => setActiveTab('ticket')}
          >
            {t.tabs.ticket}
          </button>
        </div>

        <div className="support-content">
          {activeTab === 'faq' && (
            <div className="faq-section">
              <div className="faq-search">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {!searchQuery && (
                <div className="faq-categories">
                  {Object.entries(t.categories).map(([key, label]) => (
                    <button
                      key={key}
                      className={`faq-category ${selectedCategory === key ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              <div className="faq-list">
                {faqs.length === 0 ? (
                  <div className="faq-empty">
                    <Search size={32} />
                    <p>No se encontraron resultados</p>
                  </div>
                ) : (
                  faqs.map((faq) => (
                    <div key={faq.id} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        {expandedFAQ === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                          <div className="faq-helpful">
                            <span>{t.helpful}</span>
                            <button
                              className="helpful-btn"
                              onClick={() => handleFAQRate(faq.id, true)}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              className="helpful-btn"
                              onClick={() => handleFAQRate(faq.id, false)}
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="emergency-section">
              <div className="emergency-header">
                <AlertTriangle className="emergency-alert" size={24} />
                <h3>{t.emergency}</h3>
              </div>

              <div className="emergency-contacts">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="emergency-contact">
                    <div className="contact-info">
                      <div className="contact-name">{contact.name}</div>
                      <div className="contact-number">{contact.phone}</div>
                      {contact.available24h && (
                        <div className="contact-availability">
                          <Clock size={12} />
                          {t.available24h}
                        </div>
                      )}
                    </div>
                    <button
                      className="emergency-call-btn"
                      onClick={() => handleEmergencyCall(contact.phone)}
                    >
                      <Phone size={18} />
                      {t.call}
                    </button>
                  </div>
                ))}
              </div>

              <div className="quick-actions">
                <h4>Acciones Rápidas</h4>
                <div className="quick-actions-grid">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className={`quick-action-btn ${action.priority === 'urgent' ? 'urgent' : ''}`}
                      onClick={() => {
                        if (action.action === 'emergency') {
                          setActiveTab('emergency')
                        } else {
                          setActiveTab('ticket')
                          setTicketForm(prev => ({
                            ...prev,
                            category: action.action === 'lost_item' ? 'complaint' : 'information',
                            subject: action.label
                          }))
                        }
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ticket' && (
            <div className="ticket-section">
              {submittedTicket ? (
                <div className="ticket-success">
                  <CheckCircle className="success-icon" size={48} />
                  <h3>{t.ticket.success}</h3>
                  <p>{t.ticket.successMessage}</p>
                </div>
              ) : (
                <form className="ticket-form" onSubmit={handleTicketSubmit}>
                  <h3>{t.ticket.title}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.ticket.name}</label>
                      <input
                        type="text"
                        required
                        value={ticketForm.name}
                        onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.ticket.email}</label>
                      <input
                        type="email"
                        required
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t.ticket.category}</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value as any})}
                    >
                      {Object.entries(t.ticket.categories).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t.ticket.subject}</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.ticket.message}</label>
                    <textarea
                      required
                      rows={5}
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.ticket.location}</label>
                    <div className="location-input">
                      <MapPin size={16} />
                      <input
                        type="text"
                        value={ticketForm.location}
                        onChange={(e) => setTicketForm({...ticketForm, location: e.target.value})}
                        placeholder="Ej: Hotel Camino Nacional, Plaza Principal"
                      />
                    </div>
                  </div>

                  <button type="submit" className="ticket-submit-btn">
                    <Send size={18} />
                    {t.ticket.submit}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupportCenter