// Modal de Selección de Pautantes
// Muestra pautantes filtrados por categoría con información detallada y botones específicos

import { useState } from 'react'
import { 
  X, 
  Phone, 
  MessageSquare, 
  Star, 
  MapPin, 
  Clock, 
  Utensils, 
  Bed, 
  Store, 
  Compass,
  ShoppingCart,
  Calendar,
  CreditCard,
  CheckCircle,
  ChevronRight
} from 'lucide-react'
import { Place, Category } from '../types'

function providerSlug(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface ProviderSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category
  places: Place[]
  onDirectOrder: (providerId: number, action: 'reserve' | 'order' | 'contact') => void
  onProviderSelect: (providerId: number) => void
  language: 'es' | 'en'
}

const categoryToTypes: Record<Category, string[]> = {
  'Alojamientos': ['hotel', 'hostel', 'cabaña', 'finca'],
  'Restaurantes': ['restaurante', 'café', 'comida'],
  'Cafés': ['café', 'coffee', 'cafetería'],
  'Artesanías': ['artesanía', 'tienda', 'comercio'],
  'Tiendas': ['tienda', 'supermercado', 'comercio'],
  'Experiencias': ['tour', 'guía', 'actividad', 'experiencia'],
  'Servicios': ['servicio', 'transporte', 'guía']
}

const categoryIcons: Record<Category, string> = {
  'Alojamientos': '🏨',
  'Restaurantes': '🍽️',
  'Cafés': '☕',
  'Artesanías': '🎨',
  'Tiendas': '🛒',
  'Experiencias': '🧭',
  'Servicios': '🛠️'
}

const categoryActions: Record<Category, 'reserve' | 'order' | 'contact'> = {
  'Alojamientos': 'reserve',
  'Restaurantes': 'order',
  'Cafés': 'order',
  'Artesanías': 'contact',
  'Tiendas': 'contact',
  'Experiencias': 'reserve',
  'Servicios': 'contact'
}

const categoryActionLabels: Record<string, Record<'es' | 'en', string>> = {
  'reserve': {
    es: 'Reservar',
    en: 'Reserve'
  },
  'order': {
    es: 'Pedir',
    en: 'Order'
  },
  'contact': {
    es: 'Contactar',
    en: 'Contact'
  }
}

function ProviderSelectionModal({ isOpen, onClose, category, places, onDirectOrder, onProviderSelect, language }: ProviderSelectionModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<Place | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  if (!isOpen) return null

  // Filtrar pautantes por categoría
  const relevantTypes = categoryToTypes[category] || []
  const categoryProviders = places.filter(place => 
    relevantTypes.some(type => place.type.toLowerCase().includes(type.toLowerCase()))
  )

  const handleProviderAction = (provider: Place, action: 'reserve' | 'order' | 'contact') => {
    onDirectOrder(provider.id, action)
    onClose()
  }

  const handleProviderClick = (provider: Place) => {
    setSelectedProvider(provider)
    setShowDetail(true)
  }

  const handleBackToGrid = () => {
    setShowDetail(false)
    setSelectedProvider(null)
  }

  const getProviderServices = (provider: Place) => {
    const services: string[] = []
    
    if (provider.accommodationDetails) {
      services.push(...provider.accommodationDetails.services)
    }
    if (provider.foodServiceDetails) {
      services.push(...provider.foodServiceDetails.cuisineType)
    }
    if (provider.experienceDetails) {
      services.push(provider.experienceDetails.activityType)
    }
    if (provider.commerceDetails) {
      services.push(...provider.commerceDetails.productCategories)
    }
    
    return services.slice(0, 4)
  }

  const getProviderContact = (provider: Place) => {
    return provider.contact || { whatsapp: '', phone: '', email: '' }
  }

  const getProviderHours = (provider: Place) => {
    if (provider.operatingHours) {
      return `${provider.operatingHours.open} - ${provider.operatingHours.close}`
    }
    return language === 'es' ? 'Horario no disponible' : 'Hours not available'
  }

  const renderProviderCard = (provider: Place) => {
    const contact = getProviderContact(provider)
    const services = getProviderServices(provider)
    const hours = getProviderHours(provider)
    const action = categoryActions[category]
    const actionLabel = categoryActionLabels[action][language]

    return (
      <div key={provider.id} className="provider-card" onClick={() => handleProviderClick(provider)}>
        <div className="provider-header">
          <div className="provider-badge">
            {categoryIcons[category]}
          </div>
          <div className="provider-rating">
            <Star size={14} fill="currentColor" />
            <span>{provider.rating}</span>
          </div>
        </div>
        
        <h3 className="provider-name">{provider.name}</h3>
        <p className="provider-description">{provider.description || language === 'es' ? 'Sin descripción' : 'No description'}</p>
        
        <div className="provider-location">
          <MapPin size={14} />
          <span>{provider.location?.address || language === 'es' ? 'Ubicación no disponible' : 'Location not available'}</span>
        </div>

        <div className="provider-services">
          {services.map((service, index) => (
            <span key={index} className="service-tag">{service}</span>
          ))}
        </div>

        <div className="provider-meta">
          <div className="meta-item">
            <Clock size={14} />
            <span>{hours}</span>
          </div>
          {contact.whatsapp && (
            <div className="meta-item">
              <Phone size={14} />
              <span>WhatsApp</span>
            </div>
          )}
        </div>

        <div className="provider-actions">
          <button 
            className="action-button primary"
            onClick={(e) => {
              e.stopPropagation()
              handleProviderAction(provider, action)
            }}
          >
            <MessageSquare size={16} />
            {actionLabel}
          </button>
          <button 
            className="action-button secondary"
            onClick={(e) => {
              e.stopPropagation()
              window.location.assign(`/paginas-pautantes/${providerSlug(provider.name)}/`)
            }}
          >
            <Phone size={16} />
            {language === 'es' ? 'Ver Ficha' : 'View Profile'}
          </button>
        </div>
      </div>
    )
  }

  const renderProviderDetail = (provider: Place) => {
    const contact = getProviderContact(provider)
    const services = getProviderServices(provider)
    const hours = getProviderHours(provider)
    const action = categoryActions[category]
    const actionLabel = categoryActionLabels[action][language]

    return (
      <div className="provider-detail-view">
        <button className="back-button" onClick={handleBackToGrid}>
          <ChevronRight size={16} className="rotate-180" />
          {language === 'es' ? 'Volver a lista' : 'Back to list'}
        </button>

        <div className="detail-header">
          <div className="detail-icon">{categoryIcons[category]}</div>
          <div className="detail-info">
            <h2>{provider.name}</h2>
            <div className="detail-rating">
              <Star size={18} fill="currentColor" />
              <span>{provider.rating}</span>
              {provider.verified && (
                <span className="verified-badge">
                  <CheckCircle size={16} />
                  {language === 'es' ? 'Verificado' : 'Verified'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="detail-description">
          <p>{provider.description || language === 'es' ? 'Sin descripción disponible' : 'No description available'}</p>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h3>{language === 'es' ? '📍 Ubicación' : '📍 Location'}</h3>
            <p>{provider.location?.address || language === 'es' ? 'Ubicación no disponible' : 'Location not available'}</p>
            {provider.location?.phone && (
              <p className="phone">{provider.location.phone}</p>
            )}
          </div>

          <div className="detail-section">
            <h3>{language === 'es' ? '⏰ Horario' : '⏰ Hours'}</h3>
            <p>{hours}</p>
          </div>

          <div className="detail-section">
            <h3>{language === 'es' ? '📞 Contacto' : '📞 Contact'}</h3>
            {contact.whatsapp && (
              <p className="contact-item">
                <Phone size={16} />
                <span>WhatsApp: {contact.whatsapp}</span>
              </p>
            )}
            {contact.phone && (
              <p className="contact-item">
                <Phone size={16} />
                <span>Tel: {contact.phone}</span>
              </p>
            )}
            {contact.email && (
              <p className="contact-item">
                <MessageSquare size={16} />
                <span>Email: {contact.email}</span>
              </p>
            )}
          </div>

          <div className="detail-section">
            <h3>{language === 'es' ? '🛠️ Servicios' : '🛠️ Services'}</h3>
            <div className="services-list">
              {services.map((service, index) => (
                <span key={index} className="service-item">{service}</span>
              ))}
            </div>
          </div>
        </div>

        {provider.accommodationDetails && (
          <div className="detail-section accommodation-section">
            <h3>{language === 'es' ? '🏨 Información de Alojamiento' : '🏨 Accommodation Info'}</h3>
            <div className="accommodation-details">
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Categoría:' : 'Category:'}</span>
                <span>{provider.accommodationDetails.categoryLabel}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Habitaciones:' : 'Rooms:'}</span>
                <span>{provider.accommodationDetails.roomTypes?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Servicios:' : 'Services:'}</span>
                <span>{provider.accommodationDetails.services?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Características:' : 'Features:'}</span>
                <span>{provider.accommodationDetails.roomFeatures?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
            </div>
          </div>
        )}

        {provider.foodServiceDetails && (
          <div className="detail-section food-section">
            <h3>{language === 'es' ? '🍽️ Información de Restaurante' : '🍽️ Restaurant Info'}</h3>
            <div className="food-details">
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Tipo de cocina:' : 'Cuisine type:'}</span>
                <span>{provider.foodServiceDetails.cuisineType?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Precio promedio:' : 'Average price:'}</span>
                <span>{provider.foodServiceDetails.priceRange || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Especialidades:' : 'Specialties:'}</span>
                <span>{provider.foodServiceDetails.specialties?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Servicios:' : 'Services:'}</span>
                <span>{provider.foodServiceDetails.services?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
            </div>
          </div>
        )}

        {provider.experienceDetails && (
          <div className="detail-section experience-section">
            <h3>{language === 'es' ? '🧭 Información de Experiencia' : '🧭 Experience Info'}</h3>
            <div className="experience-details">
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Tipo de actividad:' : 'Activity type:'}</span>
                <span>{provider.experienceDetails.activityType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Duración:' : 'Duration:'}</span>
                <span>{provider.experienceDetails.duration || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Dificultad:' : 'Difficulty:'}</span>
                <span>{provider.experienceDetails.difficulty || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Incluye:' : 'Includes:'}</span>
                <span>{provider.experienceDetails.includes?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
            </div>
          </div>
        )}

        {provider.commerceDetails && (
          <div className="detail-section commerce-section">
            <h3>{language === 'es' ? '🛒 Información de Comercio' : '🛒 Commerce Info'}</h3>
            <div className="commerce-details">
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Tipo de comercio:' : 'Commerce type:'}</span>
                <span>{provider.commerceDetails.commerceType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Categorías de productos:' : 'Product categories:'}</span>
                <span>{provider.commerceDetails.productCategories?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Servicios:' : 'Services:'}</span>
                <span>{provider.commerceDetails.services?.join(', ') || language === 'es' ? 'No disponible' : 'Not available'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{language === 'es' ? 'Entrega a domicilio:' : 'Delivery:'}</span>
                <span>{provider.commerceDetails.deliveryAvailable ? language === 'es' ? 'Sí' : 'Yes' : language === 'es' ? 'No' : 'No'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="detail-actions">
          <button 
            className="detail-action-button primary"
            onClick={() => handleProviderAction(provider, action)}
          >
            {action === 'reserve' ? <Calendar size={20} /> : action === 'order' ? <ShoppingCart size={20} /> : <Phone size={20} />}
            {actionLabel}
          </button>
          <button 
            className="detail-action-button secondary"
            onClick={() => {
              onProviderSelect(provider.id)
              onClose()
            }}
          >
            <Compass size={20} />
            {language === 'es' ? 'Ver en Mapa' : 'View on Map'}
          </button>
          {contact.whatsapp && (
            <button 
              className="detail-action-button whatsapp"
              onClick={() => handleProviderAction(provider, 'contact')}
            >
              <MessageSquare size={20} />
            WhatsApp
          </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="provider-selection-modal-overlay" onClick={onClose}>
      <div className="provider-selection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">{categoryIcons[category]}</span>
            <h2>{category}</h2>
            <span className="provider-count">{categoryProviders.length} {language === 'es' ? 'pautantes' : 'providers'}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!showDetail ? (
          <div className="providers-grid">
            {categoryProviders.length > 0 ? (
              categoryProviders.map(renderProviderCard)
            ) : (
              <div className="no-providers">
                <Compass size={48} />
                <p>{language === 'es' ? 'No hay pautantes disponibles en esta categoría' : 'No providers available in this category'}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="provider-detail-container">
            {selectedProvider && renderProviderDetail(selectedProvider)}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderSelectionModal