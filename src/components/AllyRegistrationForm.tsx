// Componente de Registro de Aliados
// Formulario completo para que negocios locales se registren en el sistema

import { useState, useEffect } from 'react'
import { Building2, MapPin, Phone, Mail, Globe, Facebook, Instagram, Clock, CheckCircle, AlertCircle, Upload, X, User, Navigation } from 'lucide-react'
import allyRegistrationService from '../services/allyRegistration.service'

interface AllyRegistrationFormProps {
  onClose?: () => void
  onSuccess?: (allyId: string) => void
}

const AllyRegistrationForm: React.FC<AllyRegistrationFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'hotel' as const,
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    location: { lat: 4.638, lng: -75.4 }, // Coordenadas aprox de Salento
    description: '',
    services: [] as string[],
    operatingHours: {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: '9:00-18:00',
      sunday: '9:00-18:00'
    },
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    images: [] as string[],
    pricing: {
      range: '',
      currency: 'COP',
      acceptsReservations: false
    }
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredAllyId, setRegisteredAllyId] = useState('')

  const businessTypes = [
    { value: 'hotel', label: 'Hotel/Hostal', icon: Building2 },
    { value: 'restaurant', label: 'Restaurante/Café', icon: '🍽️' },
    { value: 'transport', label: 'Transporte', icon: '🚖' },
    { value: 'guide', label: 'Guía Turístico', icon: '🧭' },
    { value: 'shop', label: 'Tienda/Artesanías', icon: '🛍️' },
    { value: 'experience', label: 'Experiencia Turística', icon: '🎯' },
    { value: 'other', label: 'Otro', icon: '📋' }
  ]

  const commonServices = {
    hotel: ['Desayuno incluido', 'WiFi', 'Parqueadero', 'Aire acondicionado', 'TV cable', 'Baño privado'],
    restaurant: ['Desayuno', 'Almuerzo', 'Cena', 'Vegetariano', 'Vegano', 'Sin gluten', 'Delivery'],
    transport: ['Transporte local', 'Tours', 'Aeropuerto', 'Valle Cocora', 'Personalizado'],
    guide: ['Caminata ecológica', 'Valle Cocora', 'Cafetería', 'Cultura local', 'Photography tours'],
    shop: ['Artesanías', 'Café', 'Chocolate', 'Ropa', 'Souvenirs', 'Productos locales'],
    experience: ['Cabalgatas', 'Caminata', 'Birdwatching', 'Cafetería', 'Cocina tradicional'],
    other: ['Servicio personalizado', 'Consultoría', 'Eventos', 'Workshops']
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleLocationSelect = () => {
    // En un sistema real, esto abriría un mapa para seleccionar ubicación
    // Por ahora, usamos las coordenadas aproximadas de Salento
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: formData.address
          })
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          setError('No se pudo obtener la ubicación automáticamente. Se usarán coordenadas aproximadas de Salento.')
        }
      )
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          setError('El nombre del negocio es requerido')
          return false
        }
        if (!formData.businessType) {
          setError('El tipo de negocio es requerido')
          return false
        }
        if (!formData.contactPerson.trim()) {
          setError('El nombre de contacto es requerido')
          return false
        }
        return true

      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          setError('Email inválido')
          return false
        }
        const phoneRegex = /^57\d{10}$/
        const cleanPhone = formData.phone.replace(/\D/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          setError('Teléfono inválido (formato: 57 seguido de 10 dígitos)')
          return false
        }
        if (!formData.address.trim()) {
          setError('La dirección es requerida')
          return false
        }
        return true

      case 3:
        if (!formData.description.trim()) {
          setError('La descripción es requerida')
          return false
        }
        if (formData.description.length < 50) {
          setError('La descripción debe tener al menos 50 caracteres')
          return false
        }
        if (formData.services.length === 0) {
          setError('Selecciona al menos un servicio')
          return false
        }
        return true

      case 4:
        if (!formData.operatingHours.monday || !formData.operatingHours.sunday) {
          setError('Completa los horarios de operación')
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNextStep = () => {
    setError('')
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePreviousStep = () => {
    setError('')
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const registration = await allyRegistrationService.registerAlly({
        businessName: formData.businessName,
        businessType: formData.businessType,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || undefined,
        address: formData.address,
        location: {
          ...formData.location,
          address: formData.address
        },
        description: formData.description,
        services: formData.services,
        operatingHours: formData.operatingHours,
        website: formData.website || undefined,
        socialMedia: formData.socialMedia,
        images: formData.images,
        pricing: formData.pricing.range ? formData.pricing : undefined
      })

      setSuccess(true)
      setRegisteredAllyId(registration.id)
      
      if (onSuccess) {
        onSuccess(registration.id)
      }

      // Reiniciar formulario después de 3 segundos
      setTimeout(() => {
        if (onClose) onClose()
      }, 3000)

    } catch (err) {
      setError('Error al registrar el negocio. Por favor intenta nuevamente.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="registration-step">
            <h3>📋 Información Básica</h3>
            
            <div className="form-group">
              <label>Nombre del Negocio *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Ej. Hotel Camino Nacional"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Negocio *</label>
              <div className="business-types-grid">
                {businessTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`business-type-button ${formData.businessType === type.value ? 'selected' : ''}`}
                    onClick={() => handleChange('businessType', type.value)}
                  >
                    <span className="business-type-icon">{typeof type.icon === 'string' ? type.icon : <type.icon size={20} />}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Persona de Contacto *</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="registration-step">
            <h3>📞 Información de Contacto</h3>
            
            <div className="form-group">
              <label>Email *</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="ejemplo@negocio.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Teléfono (con código país) *</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="573000000000"
                  required
                />
              </div>
              <small>Formato: 57 + 10 dígitos (ej: 573000000000)</small>
            </div>

            <div className="form-group">
              <label>WhatsApp (opcional)</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="573000000000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección *</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Calle principal #123, Salento"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <button
                type="button"
                className="location-button"
                onClick={handleLocationSelect}
              >
                <Navigation size={18} />
                Usar mi ubicación actual
              </button>
              <small>Coordenadas: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}</small>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="registration-step">
            <h3>📝 Descripción y Servicios</h3>
            
            <div className="form-group">
              <label>Descripción del Negocio *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe tu negocio, qué lo hace especial, y qué ofrece a los visitantes..."
                rows={4}
                minLength={50}
                required
              />
              <small>Mínimo 50 caracteres</small>
            </div>

            <div className="form-group">
              <label>Servicios Ofrecidos *</label>
              <div className="services-grid">
                {commonServices[formData.businessType as keyof typeof commonServices]?.map(service => (
                  <button
                    key={service}
                    type="button"
                    className={`service-button ${formData.services.includes(service) ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    {formData.services.includes(service) && <CheckCircle size={14} />}
                    {service}
                  </button>
                ))}
              </div>
              <small>Selecciona al menos un servicio</small>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="registration-step">
            <h3>🕐 Horarios de Operación</h3>
            
            <div className="operating-hours-grid">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="hours-input">
                  <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => handleNestedChange('operatingHours', day, e.target.value)}
                    placeholder="9:00-18:00"
                    pattern="[0-9]{1,2}:[0-9]{2}-[0-9]{1,2}:[0-9]{2}"
                  />
                </div>
              ))}
            </div>
            <small>Formato: 9:00-18:00 (hora inicio-hora fin)</small>
          </div>
        )

      case 5:
        return (
          <div className="registration-step">
            <h3>🌐 Presencia Digital (Opcional)</h3>
            
            <div className="form-group">
              <label>Sitio Web</label>
              <div className="input-with-icon">
                <Globe size={18} />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://tunegocio.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <div className="input-with-icon">
                <Facebook size={18} />
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                  placeholder="usuario o URL"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Instagram</label>
              <div className="input-with-icon">
                <Instagram size={18} />
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                  placeholder="@usuario"
                />
              </div>
            </div>

            {formData.businessType === 'hotel' || formData.businessType === 'restaurant' && (
              <div className="form-group">
                <label>Información de Precios</label>
                <div className="pricing-inputs">
                  <input
                    type="text"
                    value={formData.pricing.range}
                    onChange={(e) => handleNestedChange('pricing', 'range', e.target.value)}
                    placeholder="Ej: $50,000 - $150,000"
                  />
                  <select
                    value={formData.pricing.currency}
                    onChange={(e) => handleNestedChange('pricing', 'currency', e.target.value)}
                  >
                    <option value="COP">COP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.pricing.acceptsReservations}
                    onChange={(e) => handleNestedChange('pricing', 'acceptsReservations', e.target.checked)}
                  />
                  Acepta reservas
                </label>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (success) {
    return (
      <div className="registration-success">
        <div className="success-icon">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2>¡Registro Exitoso!</h2>
        <p>Tu negocio ha sido registrado exitosamente en el sistema.</p>
        <p className="success-details">
          <strong>ID de Registro:</strong> {registeredAllyId}
        </p>
        <p className="success-note">
          Tu registro está en proceso de verificación. Recibirás una notificación cuando sea verificado.
        </p>
        <div className="success-actions">
          <button className="primary-button" onClick={() => onClose && onClose()}>
            Entendido
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ally-registration-form">
      <div className="form-header">
        <div className="form-title">
          <Building2 className="text-blue-600" size={24} />
          <div>
            <h2>Registro de Aliado</h2>
            <p>Únete a la red oficial de turismo de Salento</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>
      </div>

      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map(step => (
            <div 
              key={step} 
              className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="form-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="form-content">
        {renderStep()}
      </div>

      <div className="form-actions">
        {currentStep > 1 && (
          <button 
            className="secondary-button"
            onClick={handlePreviousStep}
            disabled={loading}
          >
            Anterior
          </button>
        )}
        
        {currentStep < 5 ? (
          <button 
            className="primary-button"
            onClick={handleNextStep}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Siguiente'}
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Completar Registro'}
          </button>
        )}
      </div>

      <div className="form-footer">
        <p>
          Al registrarte, aceptas nuestros términos y condiciones. Tu información será verificada antes de ser publicada.
        </p>
      </div>
    </div>
  )
}

export default AllyRegistrationForm