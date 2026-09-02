/**
 * Landing Page: Hoteles Abiertos Salento
 * Optimizada para keywords: "hoteles abiertos salento", "alojamiento salento", "hoteles salento"
 */

import { useState, useEffect } from 'react'
import { Hotel, Star, Phone, MapPin, Wifi, Coffee, CheckCircle, X, Calendar, Users } from 'lucide-react'

interface LandingPageHotelesProps {
  onClose?: () => void
}

const LandingPageHoteles: React.FC<LandingPageHotelesProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true)
  const [hotelesData, setHotelesData] = useState({
    hotelesAbiertos: 85,
    camasDisponibles: 1200,
    reservaOnline: true,
    ultimaActualizacion: new Date().toLocaleDateString('es-CO')
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const hotelesDisponibles = [
    { 
      nombre: "Hotel KAWA", 
      estrellas: 4, 
      precio: "$180.000 - $280.000", 
      capacidad: "80%", 
      servicios: ["Spa", "Restaurante", "WiFi", "Desayuno incluido", "Vista montaña"],
      telefono: "310 123 4567",
      estado: "Abierto"
    },
    { 
      nombre: "Brisas del Río", 
      estrellas: 3, 
      precio: "$120.000 - $200.000", 
      capacidad: "90%", 
      servicios: ["Bienestar", "Naturaleza", "Gastronomía", "Río privado", "Yoga"],
      telefono: "314 508 3065",
      estado: "Abierto"
    },
    { 
      nombre: "La Floresta", 
      estrellas: 4, 
      precio: "$150.000 - $250.000", 
      capacidad: "75%", 
      servicios: ["Masajes", "Plan Pareja", "Desayuno", "WiFi", "Chimenea"],
      telefono: "320 987 6543",
      estado: "Abierto"
    },
    { 
      nombre: "Canela Mountain Villa", 
      estrellas: 5, 
      precio: "$250.000 - $400.000", 
      capacidad: "85%", 
      servicios: ["Cafetera", "Senderismo", "Yoga", "Vista panorámica", "Jacuzzi"],
      telefono: "300 456 7890",
      estado: "Abierto"
    },
    { 
      nombre: "Hotel El Mirador del Cocora", 
      estrellas: 4, 
      precio: "$200.000 - $350.000", 
      capacidad: "70%", 
      servicios: ["Vista Valle", "Terraza", "Desayuno", "WiFi", "Parqueadero"],
      telefono: "315 234 5678",
      estado: "Abierto"
    },
    { 
      nombre: "Posada El Caminante", 
      estrellas: 2, 
      precio: "$80.000 - $120.000", 
      capacidad: "95%", 
      servicios: ["Económico", "Cocina compartida", "WiFi", "Jardín"],
      telefono: "321 345 6789",
      estado: "Abierto"
    }
  ]

  const categorias = [
    { nombre: "Lujo", count: 2, icon: "⭐⭐⭐⭐⭐" },
    { nombre: "Premium", count: 3, icon: "⭐⭐⭐⭐" },
    { nombre: "Económico", count: 1, icon: "⭐⭐" }
  ]

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="spinner"></div>
        <p>Cargando información de hoteles...</p>
      </div>
    )
  }

  return (
    <div className="landing-page-hoteles">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="header-main">
            <h1>Hoteles Abiertos en Salento: Alojamiento Disponible y Reservas</h1>
            <p className="subtitle">Encuentra el alojamiento perfecto en Salento. Hoteles, hostales y posadas operativos con disponibilidad confirmada.</p>
            <div className="last-update">
              <Calendar size={16} />
              <span>Última actualización: {hotelesData.ultimaActualizacion}</span>
            </div>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose} aria-label="Cerrar">
              <X size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Resumen de Hoteles */}
      <section className="hotels-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Hotel size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{hotelesData.hotelesAbiertos}%</span>
            <span className="summary-label">Hoteles Abiertos</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Users size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{hotelesData.camasDisponibles}</span>
            <span className="summary-label">Camas Disponibles</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Reserva Online</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Star size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">6</span>
            <span className="summary-label">Opciones</span>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <h2>🏨 Categorías de Alojamiento</h2>
        <div className="categories-grid">
          {categorias.map((cat, index) => (
            <div key={index} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.nombre}</h3>
              <span className="category-count">{cat.count} hoteles</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hoteles Disponibles */}
      <section className="hotels-section">
        <h2>🏠 Hoteles Disponibles</h2>
        <p className="section-description">Alojamiento operativo con disponibilidad confirmada</p>
        
        <div className="hotels-grid">
          {hotelesDisponibles.map((hotel, index) => (
            <div key={index} className="hotel-card">
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3>{hotel.nombre}</h3>
                  <div className="hotel-stars">
                    {[...Array(hotel.estrellas)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <span className={`status-badge ${hotel.estado === 'Abierto' ? 'open' : 'closed'}`}>
                  {hotel.estado}
                </span>
              </div>
              
              <div className="hotel-price">
                <span className="price-range">{hotel.precio}</span>
                <span className="price-period">por noche</span>
              </div>

              <div className="hotel-details">
                <div className="detail-item">
                  <Users size={16} />
                  <span>Capacidad: {hotel.capacidad}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{hotel.telefono}</span>
                </div>
              </div>

              <div className="hotel-services">
                <h4>Servicios:</h4>
                <div className="services-list">
                  {hotel.servicios.map((servicio, i) => (
                    <span key={i} className="service-tag">
                      {servicio === 'WiFi' && <Wifi size={12} />}
                      {servicio === 'Desayuno incluido' && <Coffee size={12} />}
                      {servicio === 'Spa' && <Star size={12} />}
                      {servicio === 'Vista montaña' && <MapPin size={12} />}
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hotel-actions">
                <button className="contact-button">
                  <Phone size={16} />
                  <span>Contactar</span>
                </button>
                <button className="reserve-button">
                  <Calendar size={16} />
                  <span>Reservar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="recommendations-section">
        <h2>📋 Recomendaciones para Reserva</h2>
        <div className="recommendations-list">
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Reserva con anticipación, especialmente en temporadas altas</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Verifica políticas de cancelación antes de reservar</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Confirma disponibilidad directamente con el hotel</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Pregunta por paquetes especiales o descuentos</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Reservar tu Alojamiento?</h2>
          <p>
            Salento cuenta con variedad de opciones de alojamiento para todos los presupuestos. 
            Desde hoteles de lujo hasta hostales económicos, encuentra el lugar perfecto para tu estadía.
          </p>
          <div className="cta-buttons">
            <button className="primary-button">
              <Phone size={18} />
              <span>Contactar Hoteles</span>
            </button>
            <button className="secondary-button">
              <MapPin size={18} />
              <span>Ver en Mapa</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Hoteles Salento - Salento a la Mano</h3>
          <p>
            Guía completa de alojamiento en Salento. Hoteles abiertos, disponibilidad, 
            precios y servicios. Encuentra el lugar perfecto para tu estadía en el Eje Cafetero.
          </p>
          <div className="footer-tags">
            <span>Hoteles Salento</span>
            <span>Alojamiento</span>
            <span>Hostales</span>
            <span>Reservas</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageHoteles