/**
 * Landing Page: Vías Salento Libres Acceso
 * Optimizada para keywords: "vías salento libres", "acceso salento", "carreteras salento"
 */

import { useState, useEffect } from 'react'
import { Route, Car, MapPin, CheckCircle, AlertTriangle, X, Phone, Navigation, Clock, Construction } from 'lucide-react'

interface LandingPageViasProps {
  onClose?: () => void
}

const LandingPageVias: React.FC<LandingPageViasProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true)
  const [viasData, setViasData] = useState({
    viasLibres: 92,
    accesoTotal: true,
    transporteOperativo: true,
    ultimaActualizacion: new Date().toLocaleDateString('es-CO')
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const viasEstado = [
    { 
      ruta: "Armenia - Salento", 
      distancia: "25 km", 
      tiempo: "40 min", 
      estado: "Libre", 
      observaciones: "Tránsito normal, vía pavimentada",
      mantenimiento: "Sin mantenimiento programado"
    },
    { 
      ruta: "Salento - Valle Cocora", 
      distancia: "11 km", 
      tiempo: "25 min", 
      estado: "Libre", 
      observaciones: "Jeeps operativos, vía en buen estado",
      mantenimiento: "Sin mantenimiento programado"
    },
    { 
      ruta: "Salento - Filandia", 
      distancia: "15 km", 
      tiempo: "30 min", 
      estado: "Libre", 
      observaciones: "Vía pavimentada, tránsito fluido",
      mantenimiento: "Sin mantenimiento programado"
    },
    { 
      ruta: "Acceso Norte (Pereira)", 
      distancia: "35 km", 
      tiempo: "50 min", 
      estado: "Con precaución", 
      observaciones: "Algunos tramos en mantenimiento",
      mantenimiento: "Mantenimiento leve programado"
    },
    { 
      ruta: "Circuito Vial Quindío", 
      distancia: "60 km", 
      tiempo: "1.5 horas", 
      estado: "Libre", 
      observaciones: "Ruta turística operativa",
      mantenimiento: "Sin mantenimiento programado"
    }
  ]

  const transporteOptions = [
    { 
      tipo: "Jeep Willys", 
      disponibilidad: "Alta", 
      precio: "$8.000 - $15.000", 
      estado: "Operativo",
      ruta: "Salento - Valle Cocora"
    },
    { 
      tipo: "Bus Intermunicipal", 
      disponibilidad: "Media", 
      precio: "$12.000 - $18.000", 
      estado: "Operativo",
      ruta: "Armenia - Salento"
    },
    { 
      tipo: "Taxi/Moto", 
      disponibilidad: "Alta", 
      precio: "$20.000 - $35.000", 
      estado: "Operativo",
      ruta: "Todas las rutas"
    },
    { 
      tipo: "Vehículo Propio", 
      disponibilidad: "N/A", 
      precio: "Combustible", 
      estado: "Recomendado",
      ruta: "Todas las rutas"
    }
  ]

  const recomendaciones = [
    "Verifica el estado de las vías antes de viajar",
    "Usa transporte oficial y reconocido",
    "Lleva suficiente combustible para rutas largas",
    "Conduce con precaución en zonas montañosas",
    "Respecta las señales de tránsito y velocidades",
    "Tiene a mano números de emergencia"
  ]

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="spinner"></div>
        <p>Cargando información de vías...</p>
      </div>
    )
  }

  return (
    <div className="landing-page-vias">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="header-main">
            <h1>Vías Salento Libres: Acceso Total y Transporte Operativo</h1>
            <p className="subtitle">Todas las vías principales hacia Salento están libres y operativas. Información actualizada sobre estado de carreteras, transporte y acceso.</p>
            <div className="last-update">
              <Clock size={16} />
              <span>Última actualización: {viasData.ultimaActualizacion}</span>
            </div>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose} aria-label="Cerrar">
              <X size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Resumen de Vías */}
      <section className="roads-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Route size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{viasData.viasLibres}%</span>
            <span className="summary-label">Vías Libres</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Acceso Total</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Car size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Transporte</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Navigation size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">5</span>
            <span className="summary-label">Rutas</span>
          </div>
        </div>
      </section>

      {/* Estado de Vías */}
      <section className="roads-status">
        <h2>🛣️ Estado de Vías Principales</h2>
        <p className="section-description">Información actualizada sobre las carreteras principales</p>
        
        <div className="roads-table">
          <table>
            <thead>
              <tr>
                <th>Ruta</th>
                <th>Distancia</th>
                <th>Tiempo</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {viasEstado.map((via, index) => (
                <tr key={index}>
                  <td>
                    <div className="route-name">
                      <MapPin size={16} />
                      {via.ruta}
                    </div>
                  </td>
                  <td>{via.distancia}</td>
                  <td>{via.tiempo}</td>
                  <td>
                    <span className={`road-status ${via.estado === 'Libre' ? 'open' : via.estado === 'Con precaución' ? 'caution' : 'closed'}`}>
                      {via.estado}
                    </span>
                  </td>
                  <td>
                    <div className="route-observations">
                      <p>{via.observaciones}</p>
                      {via.mantenimiento !== "Sin mantenimiento programado" && (
                        <span className="maintenance-note">
                          <Construction size={12} />
                          {via.mantenimiento}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Opciones de Transporte */}
      <section className="transport-section">
        <h2>🚗 Opciones de Transporte</h2>
        <p className="section-description">Transporte disponible y operativo para llegar a Salento</p>
        
        <div className="transport-grid">
          {transporteOptions.map((option, index) => (
            <div key={index} className="transport-card">
              <div className="transport-icon">
                <Car size={24} />
              </div>
              <div className="transport-content">
                <h3>{option.tipo}</h3>
                <div className="transport-details">
                  <span className="transport-detail">📍 {option.ruta}</span>
                  <span className="transport-detail">💰 {option.precio}</span>
                </div>
                <div className="transport-status">
                  <span className="availability">{option.disponibilidad}</span>
                  <span className={`status-badge ${option.estado === 'Operativo' || option.estado === 'Recomendado' ? 'operational' : 'warning'}`}>
                    {option.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="recommendations-section">
        <h2>📋 Recomendaciones para el Viaje</h2>
        <div className="recommendations-list">
          {recomendaciones.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <AlertTriangle size={20} className="alert-icon" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Puntos de Control */}
      <section className="control-points">
        <h2>📍 Puntos de Control y Ayuda</h2>
        <div className="control-points-grid">
          <div className="control-point">
            <div className="point-icon">
              <Phone size={24} />
            </div>
            <div className="point-content">
              <h3>Puesto de Control Armenia</h3>
              <p>Información vial y asistencia en la entrada al Quindío</p>
              <span className="point-status">Operativo 24/7</span>
            </div>
          </div>
          
          <div className="control-point">
            <div className="point-icon">
              <MapPin size={24} />
            </div>
            <div className="point-content">
              <h3>Puesto Salento</h3>
              <p>Información turística y asistencia en el municipio</p>
              <span className="point-status">Operativo 8am-8pm</span>
            </div>
          </div>
          
          <div className="control-point">
            <div className="point-icon">
              <Construction size={24} />
            </div>
            <div className="point-content">
              <h3>INVIAS Quindío</h3>
              <p>Coordinación vial departamental</p>
              <span className="point-status">Operativo 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Viajar a Salento?</h2>
          <p>
            Las vías están libres y el transporte operativo. Salento es accesible 
            y listo para recibir visitantes. Planifica tu viaje con tranquilidad.
          </p>
          <div className="cta-buttons">
            <button className="primary-button">
              <Navigation size={18} />
              <span>Ver Rutas</span>
            </button>
            <button className="secondary-button">
              <Phone size={18} />
              <span>Información Vial</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Vías Salento - Salento a la Mano</h3>
          <p>
            Información actualizada sobre el estado de vías y transporte hacia Salento. 
            Acceso garantizado, carreteras libres y opciones de transporte operativo.
          </p>
          <div className="footer-tags">
            <span>Vías Salento</span>
            <span>Acceso</span>
            <span>Transporte</span>
            <span>Carreteras</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageVias