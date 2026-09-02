/**
 * Landing Page: Valle de Cocora Accesible 100
 * Optimizada para keywords: "valle cocora accesible", "palmas de cera", "senderismo"
 */

import { useState, useEffect } from 'react'
import { Mountain, TreePine, Camera, MapPin, Clock, CheckCircle, AlertTriangle, X, Phone, Navigation } from 'lucide-react'

interface LandingPageValleCocoraProps {
  onClose?: () => void
}

const LandingPageValleCocora: React.FC<LandingPageValleCocoraProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true)
  const [valleData, setValleData] = useState({
    accesibilidad: 100,
    senderismoDisponible: true,
    toursOperativos: true,
    palmasVisibles: true,
    ultimaActualizacion: new Date().toLocaleDateString('es-CO')
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const senderismoRoutes = [
    { nombre: "Ruta Principal", distancia: "6 km", dificultad: "Media", tiempo: "2-3 horas", estado: "100% accesible" },
    { nombre: "Ruta Acolmonada", distancia: "12 km", dificultad: "Alta", tiempo: "4-5 horas", estado: "100% accesible" },
    { nombre: "Ruta Bosque Nublado", distancia: "8 km", dificultad: "Media", tiempo: "3 horas", estado: "100% accesible" }
  ]

  const toursDisponibles = [
    { nombre: "Tour Jeep Willys", duracion: "30 min", precio: "$8.000", estado: "Operativo" },
    { nombre: "Tour Caballo", duracion: "2 horas", precio: "$25.000", estado: "Operativo" },
    { nombre: "Tour Fotográfico", duracion: "3 horas", precio: "$15.000", estado: "Operativo" }
  ]

  const recomendaciones = [
    "Llevar ropa cómoda y calzado adecuado para senderismo",
    "Protector solar y repelente de insectos",
    "Cámara para fotografiar las palmas de cera",
    "Agua y snacks para la caminata",
    "Llegar temprano (7:00-10:00 AM) para evitar multitudes"
  ]

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="spinner"></div>
        <p>Cargando información del Valle de Cocora...</p>
      </div>
    )
  }

  return (
    <div className="landing-page-valle-cocora">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="header-main">
            <h1>Valle de Cocora Accesible 100%: Palmas de Cera y Senderismo</h1>
            <p className="subtitle">El Valle de Cocora está completamente accesible para turismo. Disfruta de las palmas de cera más altas del mundo en condiciones óptimas.</p>
            <div className="last-update">
              <Clock size={16} />
              <span>Última actualización: {valleData.ultimaActualizacion}</span>
            </div>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose} aria-label="Cerrar">
              <X size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Resumen de Accesibilidad */}
      <section className="accessibility-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{valleData.accesibilidad}%</span>
            <span className="summary-label">Accesible</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <TreePine size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Senderismo</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Camera size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Fotografía</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Mountain size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Tours</span>
          </div>
        </div>
      </section>

      {/* Información Principal */}
      <section className="main-info">
        <div className="info-card">
          <h2>🌴 Las Palmas de Cera del Quindío</h2>
          <p>
            El Valle de Cocora es hogar de la palma de cera del Quindío (Ceroxylon quindiuense), 
            el árbol nacional de Colombia y la palma más alta del mundo, alcanzando hasta 60 metros de altura. 
            Este espectacular paisaje es parte del Parque Nacional Natural Los Nevados y es accesible en su totalidad.
          </p>
          <div className="highlights">
            <div className="highlight-item">
              <TreePine size={20} />
              <span>Altura máxima: 60 metros</span>
            </div>
            <div className="highlight-item">
              <MapPin size={20} />
              <span>Altitud: 2.400 - 3.000 m s.n.m.</span>
            </div>
            <div className="highlight-item">
              <Camera size={20} />
              <span>Ideal para fotografía</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rutas de Senderismo */}
      <section className="hiking-routes">
        <h2>🥾 Rutas de Senderismo Disponibles</h2>
        <p className="section-description">Todas las rutas están 100% accesibles y en condiciones óptimas</p>
        
        <div className="routes-grid">
          {senderismoRoutes.map((ruta, index) => (
            <div key={index} className="route-card">
              <div className="route-header">
                <h3>{ruta.nombre}</h3>
                <span className="route-status accessible">{ruta.estado}</span>
              </div>
              <div className="route-details">
                <div className="detail-item">
                  <span className="detail-label">Distancia:</span>
                  <span className="detail-value">{ruta.distancia}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dificultad:</span>
                  <span className="detail-value">{ruta.dificultad}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tiempo:</span>
                  <span className="detail-value">{ruta.tiempo}</span>
                </div>
              </div>
              <button className="route-button">
                <Navigation size={16} />
                <span>Ver Ruta</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tours Disponibles */}
      <section className="tours-section">
        <h2>🚙 Tours Operativos</h2>
        <p className="section-description">Experiencias guiadas disponibles en el Valle de Cocora</p>
        
        <div className="tours-grid">
          {toursDisponibles.map((tour, index) => (
            <div key={index} className="tour-card">
              <div className="tour-icon">
                <Mountain size={24} />
              </div>
              <div className="tour-content">
                <h3>{tour.nombre}</h3>
                <div className="tour-details">
                  <span className="tour-detail">⏱️ {tour.duracion}</span>
                  <span className="tour-detail">💰 {tour.precio}</span>
                </div>
                <span className="tour-status operational">{tour.estado}</span>
              </div>
              <button className="tour-button">
                <Phone size={16} />
                <span>Reservar</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="recommendations-section">
        <h2>📋 Recomendaciones para tu Visita</h2>
        <div className="recommendations-list">
          {recomendaciones.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <CheckCircle size={20} className="check-icon" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo Llegar */}
      <section className="how-to-reach">
        <h2>🚗 Cómo Llegar al Valle de Cocora</h2>
        <div className="transport-options">
          <div className="transport-option">
            <div className="transport-icon">
              <Navigation size={32} />
            </div>
            <div className="transport-info">
              <h3>Jeep Willys</h3>
              <p>Desde la plaza principal de Salento. Sale cada 30 minutos.</p>
              <span className="transport-price">$8.000 COP por trayecto</span>
            </div>
          </div>
          
          <div className="transport-option">
            <div className="transport-icon">
              <MapPin size={32} />
            </div>
            <div className="transport-info">
              <h3>Vehículo Propio</h3>
              <p>20 minutos desde Salento. Parqueadero disponible.</p>
              <span className="transport-price">Combustible aprox. $10.000 COP</span>
            </div>
          </div>
          
          <div className="transport-option">
            <div className="transport-icon">
              <TreePine size={32} />
            </div>
            <div className="transport-info">
              <h3>Caminata Ecológica</h3>
              <p>2 horas desde Salento. Ruta pintoresca.</p>
              <span className="transport-price">Gratuito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para el Valle de Cocora?</h2>
          <p>
            El Valle de Cocora está 100% accesible y listo para recibir visitantes. 
            Disfruta de este paisaje único y las majestuosas palmas de cera.
          </p>
          <div className="cta-buttons">
            <button className="primary-button">
              <MapPin size={18} />
              <span>Ver Mapa</span>
            </button>
            <button className="secondary-button">
              <Phone size={18} />
              <span>Información</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Valle de Cocora - Salento a la Mano</h3>
          <p>
            Información actualizada sobre el estado del Valle de Cocora, senderismo, tours y 
            accesibilidad. El paraíso de las palmas de cera está abierto y listo para recibirte.
          </p>
          <div className="footer-tags">
            <span>Valle de Cocora</span>
            <span>Palmas de Cera</span>
            <span>Senderismo</span>
            <span>Salento Quindío</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageValleCocora