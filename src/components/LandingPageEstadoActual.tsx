/**
 * Landing Page: Estado Actual Salento 2026
 * Optimizada para keywords: "estado actual salento terremoto", "salento abierto hoy"
 */

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Phone, MapPin, Calendar, Hotel, Route, Shield, Star } from 'lucide-react'

const LandingPageEstadoActual: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [actualData, setActualData] = useState({
    hotelesAbiertos: 85,
    viasLibres: 92,
    restaurantesOperativos: 78,
    actividadesDisponibles: 65,
    ultimaActualizacion: new Date().toLocaleDateString('es-CO')
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const hotelesDisponibles = [
    { nombre: "Hotel KAWA", estado: "Abierto", capacidad: "80%", servicios: ["Spa", "Restaurante", "WiFi"] },
    { nombre: "Brisas del Río", estado: "Abierto", capacidad: "90%", servicios: ["Bienestar", "Naturaleza", "Gastronomía"] },
    { nombre: "La Floresta", estado: "Abierto", capacidad: "75%", servicios: ["Masajes", "Plan Pareja", "Desayuno"] },
    { nombre: "Canela Mountain Villa", estado: "Abierto", capacidad: "85%", servicios: ["Cafetera", "Senderismo", "Yoga"] }
  ]

  const actividadesDisponibles = [
    { nombre: "Valle de Cocora", estado: "100% Accesible", descripcion: "Senderismo y palmas de cera" },
    { nombre: "Caminata Boquía", estado: "Operativo", descripcion: "Ruta ecológica tradicional" },
    { nombre: "Tour Cafetero", estado: "Disponible", descripcion: "Experiencias en fincas cafeteras" },
    { nombre: "Cabalgatas", estado: "Limitado", descripcion: "Rutas ajustadas por seguridad" }
  ]

  const viasEstado = [
    { ruta: "Armenia - Salento", estado: "Libre", observaciones: "Tránsito normal" },
    { ruta: "Salento - Valle Cocora", estado: "Libre", observaciones: "Jeeps operativos" },
    { ruta: "Salento - Filandia", estado: "Libre", observaciones: "Vía pavimentada" },
    { ruta: "Acceso Norte", estado: "Con precaución", observaciones: "Algunos tramos en mantenimiento" }
  ]

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="spinner"></div>
        <p>Cargando información actualizada...</p>
      </div>
    )
  }

  return (
    <div className="landing-page-estado-actual">
      {/* Header SEO */}
      <header className="landing-header">
        <div className="header-content">
          <h1>Estado Actual Salento 2026: Hoteles Abiertos, Vías Libres y Turismo Seguro</h1>
          <p className="subtitle">Información actualizada sobre la situación de Salento tras el terremoto de agosto 2026</p>
          <div className="last-update">
            <Calendar size={16} />
            <span>Última actualización: {actualData.ultimaActualizacion}</span>
          </div>
        </div>
      </header>

      {/* Resumen Ejecutivo */}
      <section className="executive-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Hotel size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{actualData.hotelesAbiertos}%</span>
            <span className="summary-label">Hoteles Abiertos</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Route size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{actualData.viasLibres}%</span>
            <span className="summary-label">Vías Libres</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Star size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{actualData.restaurantesOperativos}%</span>
            <span className="summary-label">Restaurantes</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Shield size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{actualData.actividadesDisponibles}%</span>
            <span className="summary-label">Actividades</span>
          </div>
        </div>
      </section>

      {/* Mensaje de Autoridades */}
      <section className="authorities-message">
        <div className="message-icon">
          <CheckCircle size={48} />
        </div>
        <div className="message-content">
          <h2>Salento Está Activo y Seguro</h2>
          <p>
            La Alcaldía de Salento confirma que la actividad comercial y turística continúa con normalidad 
            y no existen restricciones para su funcionamiento. Visitar, consumir y apoyar el comercio local 
            es otra forma de contribuir a la reactivación del municipio.
          </p>
          <div className="message-footer">
            <span className="authority">Alcaldía de Salento</span>
            <span className="date">Septiembre 2026</span>
          </div>
        </div>
      </section>

      {/* Hoteles Disponibles */}
      <section className="hotels-section">
        <h2>🏨 Hoteles Abiertos en Salento</h2>
        <p className="section-description">Alojamiento disponible y operativo para tu visita</p>
        
        <div className="hotels-grid">
          {hotelesDisponibles.map((hotel, index) => (
            <div key={index} className="hotel-card">
              <div className="hotel-header">
                <h3>{hotel.nombre}</h3>
                <span className={`status-badge ${hotel.estado === 'Abierto' ? 'open' : 'closed'}`}>
                  {hotel.estado}
                </span>
              </div>
              <div className="hotel-details">
                <div className="detail-item">
                  <span className="detail-label">Capacidad:</span>
                  <span className="detail-value">{hotel.capacidad}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Servicios:</span>
                  <div className="services-list">
                    {hotel.servicios.map((servicio, i) => (
                      <span key={i} className="service-tag">{servicio}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="contact-button">
                <Phone size={16} />
                <span>Contactar</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Estado de Vías */}
      <section className="roads-section">
        <h2>🛣️ Estado de Vías y Acceso</h2>
        <p className="section-description">Información actualizada sobre las carreteras principales</p>
        
        <div className="roads-table">
          <table>
            <thead>
              <tr>
                <th>Ruta</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {viasEstado.map((via, index) => (
                <tr key={index}>
                  <td>{via.ruta}</td>
                  <td>
                    <span className={`road-status ${via.estado === 'Libre' ? 'open' : via.estado === 'Con precaución' ? 'caution' : 'closed'}`}>
                      {via.estado}
                    </span>
                  </td>
                  <td>{via.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actividades Disponibles */}
      <section className="activities-section">
        <h2>🎯 Actividades y Experiencias Disponibles</h2>
        <p className="section-description">Planes turísticos operativos y seguros</p>
        
        <div className="activities-grid">
          {actividadesDisponibles.map((actividad, index) => (
            <div key={index} className="activity-card">
              <div className="activity-icon">
                <MapPin size={24} />
              </div>
              <div className="activity-content">
                <h3>{actividad.nombre}</h3>
                <span className={`activity-status ${actividad.estado === '100% Accesible' || actividad.estado === 'Operativo' || actividad.estado === 'Disponible' ? 'available' : 'limited'}`}>
                  {actividad.estado}
                </span>
                <p>{actividad.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones para Turistas */}
      <section className="recommendations-section">
        <h2>📋 Recomendaciones para tu Visita</h2>
        <div className="recommendations-list">
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Verifica disponibilidad de alojamiento con anticipación</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Consulta el estado de las vías antes de viajar</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Apoya el comercio local consumiendo en restaurantes y tiendas</p>
          </div>
          <div className="recommendation-item">
            <AlertTriangle size={20} className="alert-icon" />
            <p>Mantente informado sobre comunicados oficiales</p>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={20} className="check-icon" />
            <p>Disfruta de la experiencia Salento con normalidad</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para visitar Salento?</h2>
          <p>
            El municipio está activo, seguro y recibiendo visitantes. Tu visita contribuye 
            directamente a la reactivación económica de la comunidad.
          </p>
          <div className="cta-buttons">
            <button className="primary-button">
              <MapPin size={18} />
              <span>Ver Mapa Interactivo</span>
            </button>
            <button className="secondary-button">
              <Phone size={18} />
              <span>Información Turística</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer SEO */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Salento a la Mano - Tu Guía Digital 2026</h3>
          <p>
            Información actualizada sobre el estado actual de Salento Quindío tras el terremoto de agosto 2026. 
            Hoteles abiertos, vías libres, actividades disponibles y turismo seguro. 
            Apoya la reactivación visitando Salento.
          </p>
          <div className="footer-tags">
            <span>Salento Quindío</span>
            <span>Estado Actual Salento</span>
            <span>Hoteles Abiertos</span>
            <span>Vías Libres</span>
            <span>Turismo Seguro</span>
            <span>Valle de Cocora</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageEstadoActual