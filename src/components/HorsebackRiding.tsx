// Componente de reservas de cabalgatas tradicionales
import { useState } from 'react'
import { 
  Zap, 
  MapPin, 
  Clock, 
  Users, 
  Mountain, 
  Star, 
  Calendar,
  Phone,
  MessageCircle,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import horsebackRidingService from '../services/horsebackRidingService'

interface HorsebackRidingProps {
  onClose: () => void
  language: 'es' | 'en'
}

export default function HorsebackRiding({ onClose, language }: HorsebackRidingProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hotel: '',
    roomNumber: '',
    date: '',
    time: '08:00',
    participants: 2,
    experienceLevel: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
    specialRequests: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const operators = horsebackRidingService.getOperators()
  const routes = horsebackRidingService.getAvailableRoutes()

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId)
    setShowReservationForm(true)
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!selectedRoute) return

      const route = horsebackRidingService.getRoute(selectedRoute)
      if (!route) {
        setError('Ruta no encontrada')
        return
      }

      const operator = operators.find(op => op.routes.some(r => r.id === selectedRoute))
      if (!operator) {
        setError('Operador no encontrado')
        return
      }

      // Verificar disponibilidad
      const availability = horsebackRidingService.checkAvailability(
        operator.id,
        new Date(formData.date),
        formData.time,
        formData.participants
      )

      if (!availability.available) {
        setError(availability.message || 'No hay disponibilidad')
        return
      }

      // Crear reserva
      const reservation = horsebackRidingService.createReservation({
        operatorId: operator.id,
        routeId: selectedRoute,
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          hotel: formData.hotel,
          roomNumber: formData.roomNumber
        },
        date: new Date(formData.date),
        time: formData.time,
        participants: formData.participants,
        experienceLevel: formData.experienceLevel,
        specialRequests: formData.specialRequests
      })

      // Generar mensaje de WhatsApp
      const whatsappMessage = horsebackRidingService.generateWhatsAppMessage(reservation.reservationId, language)
      
      // Enviar por WhatsApp
      const whatsappUrl = `https://wa.me/${operator.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')

      setSuccess(true)
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setSuccess(false)
        setShowReservationForm(false)
        setSelectedRoute(null)
        setFormData({
          name: '',
          phone: '',
          email: '',
          hotel: '',
          roomNumber: '',
          date: '',
          time: '08:00',
          participants: 2,
          experienceLevel: 'principiante',
          specialRequests: ''
        })
      }, 3000)

    } catch (err) {
      setError('Error al crear la reserva. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const isSpanish = language === 'es'

  return (
    <div className="horseback-riding-overlay">
      <div className="horseback-riding-modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        {!showReservationForm ? (
          <>
            <div className="horseback-header">
              <div className="horseback-icon">
                <Zap size={32} />
              </div>
              <div>
                <h2>{isSpanish ? 'Cabalgatas Tradicionales' : 'Traditional Horseback Riding'}</h2>
                <p>{isSpanish ? 'El sello insignia de Salento' : 'The signature experience of Salento'}</p>
              </div>
            </div>

            <div className="operators-section">
              <h3>{isSpanish ? 'Operadores Certificados' : 'Certified Operators'}</h3>
              <div className="operators-list">
                {operators.map(operator => (
                  <div key={operator.id} className="operator-card">
                    <div className="operator-info">
                      <div className="operator-header">
                        <h4>{operator.name}</h4>
                        <div className="operator-rating">
                          <Star size={14} fill="#e8bb58" />
                          <span>{operator.rating}</span>
                        </div>
                      </div>
                      <div className="operator-location">
                        <MapPin size={14} />
                        {operator.location}
                      </div>
                      <div className="operator-experience">
                        {isSpanish ? 'Experiencia:' : 'Experience:'} {operator.experience}
                      </div>
                      <div className="operator-certifications">
                        {operator.certifications.map((cert, index) => (
                          <span key={index} className="certification-badge">🏅 {cert}</span>
                        ))}
                      </div>
                    </div>
                    <div className="operator-contact">
                      <button 
                        className="contact-button whatsapp"
                        onClick={() => window.open(`https://wa.me/${operator.contact.whatsapp}`, '_blank')}
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                      <button 
                        className="contact-button phone"
                        onClick={() => window.open(`tel:${operator.contact.phone}`, '_self')}
                      >
                        <Phone size={16} />
                        {isSpanish ? 'Llamar' : 'Call'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="routes-section">
              <h3>{isSpanish ? 'Rutas Disponibles' : 'Available Routes'}</h3>
              <div className="routes-grid">
                {routes.map(route => (
                  <div key={route.id} className="route-card">
                    <div className="route-header">
                      <h4>{route.name}</h4>
                      <span className="route-price">
                        ${route.pricePerPerson.toLocaleString()}/{isSpanish ? 'persona' : 'person'}
                      </span>
                    </div>
                    <p className="route-description">{route.description}</p>
                    
                    <div className="route-details">
                      <div className="route-detail">
                        <Clock size={14} />
                        <span>{route.duration} {isSpanish ? 'min' : 'min'}</span>
                      </div>
                      <div className="route-detail">
                        <Mountain size={14} />
                        <span>{route.distance} km</span>
                      </div>
                      <div className="route-detail">
                        <Users size={14} />
                        <span>Max: {route.maxPeople}</span>
                      </div>
                      <div className="route-detail">
                        <span className={`difficulty-badge ${route.difficulty}`}>
                          {route.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="route-highlights">
                      {route.highlights.map((highlight, index) => (
                        <span key={index} className="highlight-tag">✨ {highlight}</span>
                      ))}
                    </div>

                    <button 
                      className="reserve-button"
                      onClick={() => handleRouteSelect(route.id)}
                    >
                      {isSpanish ? 'Reservar' : 'Book Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="reservation-header">
              <button 
                className="back-button"
                onClick={() => setShowReservationForm(false)}
              >
                ← {isSpanish ? 'Volver' : 'Back'}
              </button>
              <h2>{isSpanish ? 'Reservar Cabalgata' : 'Book Horseback Riding'}</h2>
            </div>

            {success ? (
              <div className="success-message">
                <CheckCircle size={48} />
                <h3>{isSpanish ? '¡Reserva Enviada!' : 'Reservation Sent!'}</h3>
                <p>{isSpanish ? 'WhatsApp se abrirá para confirmar con el operador' : 'WhatsApp will open to confirm with the operator'}</p>
              </div>
            ) : (
              <form className="reservation-form" onSubmit={handleReservation}>
                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="form-section">
                  <h3>{isSpanish ? 'Información Personal' : 'Personal Information'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{isSpanish ? 'Nombre' : 'Name'}</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{isSpanish ? 'Teléfono' : 'Phone'}</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>{isSpanish ? 'Ubicación' : 'Location'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{isSpanish ? 'Hotel (opcional)' : 'Hotel (optional)'}</label>
                      <input 
                        type="text" 
                        value={formData.hotel}
                        onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{isSpanish ? 'Habitación (opcional)' : 'Room (optional)'}</label>
                      <input 
                        type="text" 
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>{isSpanish ? 'Detalles de la Reserva' : 'Reservation Details'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{isSpanish ? 'Fecha' : 'Date'}</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>{isSpanish ? 'Hora' : 'Time'}</label>
                      <select 
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      >
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{isSpanish ? 'Participantes' : 'Participants'}</label>
                      <input 
                        type="number" 
                        min="1"
                        max="10"
                        value={formData.participants}
                        onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{isSpanish ? 'Nivel de Experiencia' : 'Experience Level'}</label>
                      <select 
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                      >
                        <option value="principiante">{isSpanish ? 'Principiante' : 'Beginner'}</option>
                        <option value="intermedio">{isSpanish ? 'Intermedio' : 'Intermediate'}</option>
                        <option value="avanzado">{isSpanish ? 'Avanzado' : 'Advanced'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{isSpanish ? 'Solicitudes Especiales (opcional)' : 'Special Requests (optional)'}</label>
                    <textarea 
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (isSpanish ? 'Procesando...' : 'Processing...') : (isSpanish ? 'Confirmar Reserva' : 'Confirm Reservation')}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}