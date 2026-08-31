// Componente Dashboard Personalizado para Aliados
// Panel de control individual para cada negocio aliado

import { useState, useEffect } from 'react'
import { Building2, Users, TrendingUp, Shield, Code, FileText, Settings, Bell, BarChart3, Download, Edit, Trash2, CheckCircle, AlertCircle, Clock, Link2, Share2 } from 'lucide-react'
import allyRegistrationService from '../services/allyRegistration.service'
import localBacklinksService from '../services/localBacklinks.service'

interface AllyPersonalDashboardProps {
  allyId: string
  onClose?: () => void
}

const AllyPersonalDashboard: React.FC<AllyPersonalDashboardProps> = ({ allyId, onClose }) => {
  const [ally, setAlly] = useState<any>(null)
  const [backlinkStats, setBacklinkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'backlinks' | 'profile' | 'analytics' | 'settings'>('overview')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [newService, setNewService] = useState('')

  useEffect(() => {
    loadAllyData()
  }, [allyId])

  const loadAllyData = () => {
    setLoading(true)
    try {
      const allyData = allyRegistrationService.getRegistrationById(allyId)
      const stats = localBacklinksService.getBacklinkStats(allyId)
      
      setAlly(allyData)
      setBacklinkStats(stats)
      setEditData(allyData || {})
    } catch (err) {
      console.error('Error loading ally data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = () => {
    if (ally) {
      // Usar los métodos específicos del servicio para actualizar información
      allyRegistrationService.updateAlly(allyId, {
        businessName: editData.businessName,
        description: editData.description,
        phone: editData.phone,
        email: editData.email,
        whatsapp: editData.whatsapp,
        website: editData.website,
        socialMedia: editData.socialMedia
      })
      
      // Recargar datos actualizados
      const updatedAlly = allyRegistrationService.getRegistrationById(allyId)
      setAlly(updatedAlly)
      setEditData(updatedAlly || {})
      setEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditData(ally || {})
    setEditing(false)
  }

  const handleAddService = () => {
    if (newService.trim() && ally) {
      const success = allyRegistrationService.addService(allyId, newService.trim())
      if (success) {
        const updatedAlly = allyRegistrationService.getRegistrationById(allyId)
        setAlly(updatedAlly)
        setNewService('')
      }
    }
  }

  const handleRemoveService = (service: string) => {
    if (ally) {
      const success = allyRegistrationService.removeService(allyId, service)
      if (success) {
        const updatedAlly = allyRegistrationService.getRegistrationById(allyId)
        setAlly(updatedAlly)
      }
    }
  }

  const handleExportData = () => {
    if (ally) {
      const data = JSON.stringify(ally, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ally-${allyId}-data.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getVerificationStatus = () => {
    if (!ally) return { status: 'unknown', color: 'gray', icon: AlertCircle }
    
    switch (ally.verificationStatus) {
      case 'verified':
        return { status: 'Verificado', color: 'green', icon: CheckCircle }
      case 'pending':
        return { status: 'Pendiente', color: 'orange', icon: Clock }
      case 'rejected':
        return { status: 'Rechazado', color: 'red', icon: AlertCircle }
      default:
        return { status: 'Desconocido', color: 'gray', icon: AlertCircle }
    }
  }

  if (loading) {
    return (
      <div className="ally-dashboard-loading">
        <div className="loading-spinner">Cargando dashboard...</div>
      </div>
    )
  }

  if (!ally) {
    return (
      <div className="ally-dashboard-error">
        <AlertCircle size={32} className="text-red-600" />
        <h3>Aliado no encontrado</h3>
        <button className="primary-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    )
  }

  const verificationStatus = getVerificationStatus()
  const StatusIcon = verificationStatus.icon

  return (
    <div className="ally-personal-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Building2 className="text-blue-600" size={24} />
          <div>
            <h2>Dashboard de {ally.businessName}</h2>
            <p>Panel de control personalizado</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={handleExportData} aria-label="Exportar datos">
            <Download size={18} />
          </button>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
      </div>

      <div className="dashboard-status-bar">
        <div className="status-item">
          <StatusIcon size={16} className={`text-${verificationStatus.color}-600`} />
          <span className={`status-text status-${verificationStatus.color}`}>
            {verificationStatus.status}
          </span>
        </div>
        <div className="status-item">
          <Shield size={16} className="text-blue-600" />
          <span className="status-text">{ally.businessType}</span>
        </div>
        <div className="status-item">
          <Clock size={16} className="text-purple-600" />
          <span className="status-text">
            Registrado: {new Date(ally.registrationDate).toLocaleDateString('es-CO')}
          </span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Resumen
        </button>
        <button 
          className={`tab-button ${activeTab === 'backlinks' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlinks')}
        >
          <Link2 size={16} />
          Backlinks
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FileText size={16} />
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={16} />
          Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Configuración
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-cards">
              <div className="overview-card">
                <Users className="text-blue-600" size={24} />
                <div>
                  <strong>{ally.metrics?.profileViews || 0}</strong>
                  <span>Vistas de Perfil</span>
                </div>
              </div>
              <div className="overview-card">
                <Link2 className="text-green-600" size={24} />
                <div>
                  <strong>{ally.metrics?.backlinkClicks || 0}</strong>
                  <span>Clics en Backlinks</span>
                </div>
              </div>
              <div className="overview-card">
                <TrendingUp className="text-purple-600" size={24} />
                <div>
                  <strong>{ally.metrics?.conversionRate?.toFixed(1) || 0}%</strong>
                  <span>Tasa de Conversión</span>
                </div>
              </div>
              <div className="overview-card">
                <Share2 className="text-orange-600" size={24} />
                <div>
                  <strong>{ally.services?.length || 0}</strong>
                  <span>Servicios Ofrecidos</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>📊 Actividad Reciente</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-time">Hoy</div>
                  <div className="activity-content">
                    <strong>Nuevo registro completado</strong>
                    <p>Tu negocio fue registrado en el sistema</p>
                  </div>
                </div>
                {ally.verificationStatus === 'verified' && (
                  <div className="activity-item">
                    <div className="activity-time">{new Date(ally.verificationDate || '').toLocaleDateString('es-CO')}</div>
                    <div className="activity-content">
                      <strong>Verificación aprobada</strong>
                      <p>Tu negocio fue verificado exitosamente</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backlinks' && (
          <div className="backlinks-section">
            <h3>🔗 Gestión de Backlinks</h3>
            <div className="backlinks-summary">
              <div className="summary-item">
                <span className="summary-label">Clics Totales:</span>
                <span className="summary-value">{backlinkStats?.clicks || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Impresiones:</span>
                <span className="summary-value">{backlinkStats?.impressions || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Conversión:</span>
                <span className="summary-value">{backlinkStats?.conversionRate?.toFixed(2) || 0}%</span>
              </div>
            </div>

            <div className="backlinks-actions">
              <button className="action-button">
                <Code size={16} />
                Generar Nuevo Backlink
              </button>
              <button className="action-button">
                <Share2 size={16} />
                Compartir en Redes Sociales
              </button>
            </div>

            {backlinkStats?.topReferrers && backlinkStats.topReferrers.length > 0 && (
              <div className="top-referrers">
                <h4>🔝 Top Fuentes de Tráfico</h4>
                <div className="referrers-list">
                  {backlinkStats.topReferrers.map((referrer: string, index: number) => (
                    <div key={index} className="referrer-item">
                      <span>{index + 1}. {referrer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <h3>📋 Información del Negocio</h3>
              <button 
                className="edit-button"
                onClick={() => setEditing(!editing)}
              >
                <Edit size={16} />
                {editing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editing ? (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Nombre del Negocio</label>
                  <input
                    type="text"
                    value={editData.businessName || ''}
                    onChange={(e) => setEditData({ ...editData, businessName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp</label>
                  <input
                    type="tel"
                    value={editData.whatsapp || ''}
                    onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Sitio Web</label>
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    value={editData.socialMedia?.facebook || ''}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      socialMedia: { ...editData.socialMedia, facebook: e.target.value } 
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    value={editData.socialMedia?.instagram || ''}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      socialMedia: { ...editData.socialMedia, instagram: e.target.value } 
                    })}
                  />
                </div>

                <div className="form-actions">
                  <button className="secondary-button" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                  <button className="primary-button" onClick={handleSaveProfile}>
                    Guardar Cambios
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="profile-info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{ally.businessName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tipo:</span>
                    <span className="info-value">{ally.businessType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Contacto:</span>
                    <span className="info-value">{ally.contactPerson}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{ally.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Teléfono:</span>
                    <span className="info-value">{ally.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{ally.address}</span>
                  </div>
                </div>

                <div className="profile-description">
                  <h4>Descripción</h4>
                  <p>{ally.description}</p>
                </div>

                <div className="profile-services">
                  <h4>Servicios</h4>
                  <div className="services-list">
                    {ally.services?.map((service: string, index: number) => (
                      <span key={index} className="service-tag">
                        {service}
                        <button 
                          className="remove-service-button"
                          onClick={() => handleRemoveService(service)}
                          aria-label="Eliminar servicio"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="add-service-form">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Nuevo servicio..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                    />
                    <button 
                      className="add-service-button"
                      onClick={handleAddService}
                      disabled={!newService.trim()}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>📈 Analytics y Métricas</h3>
            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="analytics-header">
                  <Users size={20} />
                  <span>Perfil</span>
                </div>
                <div className="analytics-value">{ally.metrics?.profileViews || 0}</div>
                <div className="analytics-change positive">+12% vs mes anterior</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-header">
                  <Link2 size={20} />
                  <span>Backlinks</span>
                </div>
                <div className="analytics-value">{ally.metrics?.backlinkClicks || 0}</div>
                <div className="analytics-change positive">+8% vs mes anterior</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-header">
                  <TrendingUp size={20} />
                  <span>Conversión</span>
                </div>
                <div className="analytics-value">{ally.metrics?.conversionRate?.toFixed(1) || 0}%</div>
                <div className="analytics-change neutral">Sin cambios</div>
              </div>
            </div>

            <div className="analytics-tips">
              <h4>💡 Recomendaciones</h4>
              <ul>
                <li>Aumenta tu visibilidad compartiendo más backlinks</li>
                <li>Actualiza regularmente tu información de servicios</li>
                <li>Responde rápidamente a consultas de turistas</li>
                <li>Mantén tus horarios actualizados</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>⚙️ Configuración</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <strong>Notificaciones</strong>
                  <p>Recibir alertas sobre actividad y rendimiento</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <strong>Reportes Semanales</strong>
                  <p>Enviar resumen de rendimiento por email</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <strong>Modo Mantenimiento</strong>
                  <p>Ocultar perfil temporalmente</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="danger-zone">
              <h4>⚠️ Zona de Peligro</h4>
              <button className="danger-button">
                <Trash2 size={16} />
                Eliminar Cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllyPersonalDashboard