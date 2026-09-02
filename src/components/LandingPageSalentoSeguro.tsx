/**
 * Landing Page: Salento Seguro Turismo
 * Optimizada para keywords: "salento seguro", "turismo seguro salento", "seguridad salento"
 */

import { useState, useEffect } from 'react'
import { Shield, Phone, MapPin, CheckCircle, AlertTriangle, X, User, Building2, AlertCircle } from 'lucide-react'

interface LandingPageSalentoSeguroProps {
  onClose?: () => void
}

const LandingPageSalentoSeguro: React.FC<LandingPageSalentoSeguroProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true)
  const [seguridadData, setSeguridadData] = useState({
    nivelSeguridad: 95,
    turismoActivo: true,
    autoridadesOperativas: true,
    ultimaActualizacion: new Date().toLocaleDateString('es-CO')
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const autoridadesContacto = [
    { nombre: "Policía Turística", telefono: "123", horario: "24 horas", estado: "Operativo" },
    { nombre: "Alcaldía de Salento", telefono: "756-0000", horario: "Lun-Vie 8am-5pm", estado: "Operativo" },
    { nombre: "Puesto de Salud", telefono: "756-0100", horario: "24 horas", estado: "Operativo" },
    { nombre: "Defensa Civil", telefono: "119", horario: "24 horas", estado: "Operativo" }
  ]

  const medidasSeguridad = [
    "Presencia policial en zonas turísticas",
    "Iluminación adecuada en calles principales",
    "Cámaras de seguridad en puntos estratégicos",
    "Coordinación con hoteles y negocios",
    "Protocolos de emergencia establecidos",
    "Monitoreo constante por autoridades locales"
  ]

  const recomendaciones = [
    "Mantener pertenencias seguras y visibles",
    "Usar cajeros automáticos solo en horarios diurnos",
    "Informar a alguien sobre tus planes de viaje",
    "Llevar copia de documentos importantes",
    "Usar transporte oficial y reconocido",
    "Seguir recomendaciones de locales"
  ]

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="spinner"></div>
        <p>Cargando información de seguridad...</p>
      </div>
    )
  }

  return (
    <div className="landing-page-salento-seguro">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="header-main">
            <h1>Salento Seguro: Turismo Seguro y Autoridades Operativas</h1>
            <p className="subtitle">Salento es un destino seguro para el turismo. Conoce las medidas de seguridad, contactos de emergencia y recomendaciones para tu visita.</p>
            <div className="last-update">
              <Shield size={16} />
              <span>Última actualización: {seguridadData.ultimaActualizacion}</span>
            </div>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose} aria-label="Cerrar">
              <X size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Resumen de Seguridad */}
      <section className="security-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Shield size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">{seguridadData.nivelSeguridad}%</span>
            <span className="summary-label">Nivel Seguridad</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Turismo Activo</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Building2 size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">Sí</span>
            <span className="summary-label">Autoridades</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <User size={32} />
          </div>
          <div className="summary-data">
            <span className="summary-value">24/7</span>
            <span className="summary-label">Monitoreo</span>
          </div>
        </div>
      </section>

      {/* Mensaje de Seguridad */}
      <section className="security-message">
        <div className="message-icon">
          <CheckCircle size={48} />
        </div>
        <div className="message-content">
          <h2>Salento es un Destino Seguro</h2>
          <p>
            La Alcaldía de Salento confirma que el municipio es seguro para el turismo. 
            Las autoridades locales están operativas y trabajando para garantizar la seguridad 
            de visitantes y residentes. No existen restricciones para el turismo.
          </p>
          <div className="message-footer">
            <span className="authority">Alcaldía de Salento</span>
            <span className="date">Septiembre 2026</span>
          </div>
        </div>
      </section>

      {/* Contactos de Emergencia */}
      <section className="emergency-contacts">
        <h2>📞 Contactos de Emergencia</h2>
        <p className="section-description">Autoridades y servicios de emergencia disponibles 24/7</p>
        
        <div className="contacts-grid">
          {autoridadesContacto.map((contacto, index) => (
            <div key={index} className="contact-card">
              <div className="contact-header">
                <h3>{contacto.nombre}</h3>
                <span className={`status-badge ${contacto.estado === 'Operativo' ? 'operational' : 'warning'}`}>
                  {contacto.estado}
                </span>
              </div>
              <div className="contact-details">
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{contacto.telefono}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{contacto.horario}</span>
                </div>
              </div>
              <button className="contact-button">
                <Phone size={16} />
                <span>Llamar</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Medidas de Seguridad */}
      <section className="security-measures">
        <h2>🛡️ Medidas de Seguridad Implementadas</h2>
        <div className="measures-list">
          {medidasSeguridad.map((medida, index) => (
            <div key={index} className="measure-item">
              <CheckCircle size={20} className="check-icon" />
              <p>{medida}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="recommendations-section">
        <h2>📋 Recomendaciones para Turistas</h2>
        <div className="recommendations-list">
          {recomendaciones.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <AlertTriangle size={20} className="alert-icon" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zonas Seguras */}
      <section className="safe-zones">
        <h2>📍 Zonas Seguras en Salento</h2>
        <div className="zones-grid">
          <div className="zone-card">
            <div className="zone-icon">
              <MapPin size={24} />
            </div>
            <div className="zone-content">
              <h3>Centro Histórico</h3>
              <p>Zona principal con alta presencia policial y comercio seguro.</p>
              <span className="zone-status">Muy Seguro</span>
            </div>
          </div>
          
          <div className="zone-card">
            <div className="zone-icon">
              <Building2 size={24} />
            </div>
            <div className="zone-content">
              <h3>Zona Hotelera</h3>
              <p>Área de hoteles y hostales con vigilancia 24 horas.</p>
              <span className="zone-status">Muy Seguro</span>
            </div>
          </div>
          
          <div className="zone-card">
            <div className="zone-icon">
              <Shield size={24} />
            </div>
            <div className="zone-content">
              <h3>Valle de Cocora</h3>
              <p>Área natural con guardaparques y rutas monitoreadas.</p>
              <span className="zone-status">Seguro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Visita Segura Garantizada?</h2>
          <p>
            Salento cuenta con todas las medidas de seguridad necesarias para garantizar 
            una visita segura y placentera. Las autoridades están comprometidas con el bienestar de los turistas.
          </p>
          <div className="cta-buttons">
            <button className="primary-button">
              <Phone size={18} />
              <span>Emergencias</span>
            </button>
            <button className="secondary-button">
              <MapPin size={18} />
              <span>Mapa Seguro</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Salento Seguro - Salento a la Mano</h3>
          <p>
            Información oficial sobre seguridad en Salento. Medidas implementadas, 
            contactos de emergencia y recomendaciones para un turismo seguro.
          </p>
          <div className="footer-tags">
            <span>Salento Seguro</span>
            <span>Turismo Seguro</span>
            <span>Seguridad Salento</span>
            <span>Emergencias</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageSalentoSeguro