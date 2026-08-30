// Panel de notificaciones para mostrar alertas inteligentes
import { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Settings, 
  Weather, 
  Calendar, 
  Package, 
  Gift, 
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react'
import notificationService from '../services/notificationService'

interface NotificationsPanelProps {
  onClose: () => void
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(notificationService.getNotifications())
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState(notificationService.getPreferences())

  useEffect(() => {
    const unsubscribe = notificationService.addListener((newNotification) => {
      setNotifications(notificationService.getNotifications())
    })

    return () => unsubscribe()
  }, [])

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) return icon

    switch (type) {
      case 'weather': return <Weather size={18} />
      case 'event': return <Calendar size={18} />
      case 'order': return <Package size={18} />
      case 'promotion': return <Gift size={18} />
      case 'emergency': return <AlertTriangle size={18} />
      case 'system': return <Info size={18} />
      default: return <Bell size={18} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#e76c52'
      case 'medium': return '#e8bb58'
      case 'low': return '#56755b'
      default: return '#70796e'
    }
  }

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
    setNotifications(notificationService.getNotifications())
  }

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications(notificationService.getNotifications())
  }

  const deleteNotification = (notificationId: string) => {
    notificationService.removeNotification(notificationId)
    setNotifications(notificationService.getNotifications())
  }

  const handleAction = (notification: any) => {
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank')
    }
    markAsRead(notification.id)
  }

  const updatePreference = (key: keyof typeof preferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    notificationService.updatePreferences(newPreferences)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (showPreferences) {
    return (
      <div className="notifications-panel preferences-view">
        <div className="notifications-header">
          <h2>Configuración de Notificaciones</h2>
          <button className="icon-button" onClick={() => setShowPreferences(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="preferences-content">
          <div className="preference-section">
            <h3>Tipos de Alertas</h3>
            
            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.weatherAlerts}
                  onChange={(e) => updatePreference('weatherAlerts', e.target.checked)}
                />
                <div className="preference-info">
                  <span className="preference-label">Alertas de clima</span>
                  <span className="preference-description">Recibe actualizaciones sobre el clima en Salento</span>
                </div>
              </label>
            </div>

            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.eventNotifications}
                  onChange={(e) => updatePreference('eventNotifications', e.target.checked)}
                />
                <div className="preference-info">
                  <span className="preference-label">Eventos locales</span>
                  <span className="preference-description">Notificaciones sobre actividades y eventos</span>
                </div>
              </label>
            </div>

            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.orderUpdates}
                  onChange={(e) => updatePreference('orderUpdates', e.target.checked)}
                />
                <div className="preference-info">
                  <span className="preference-label">Actualizaciones de pedidos</span>
                  <span className="preference-description">Estado de tus pedidos y reservas</span>
                </div>
              </label>
            </div>

            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.promotionalMessages}
                  onChange={(e) => updatePreference('promotionalMessages', e.target.checked)}
                />
                <div className="preference-info">
                  <span className="preference-label">Mensajes promocionales</span>
                  <span className="preference-description">Ofertas especiales de comercios locales</span>
                </div>
              </label>
            </div>

            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.emergencyAlerts}
                  onChange={(e) => updatePreference('emergencyAlerts', e.target.checked)}
                />
                <div className="preference-info">
                  <span className="preference-label">Alertas de emergencia</span>
                  <span className="preference-description">Notificaciones críticas de seguridad</span>
                </div>
              </label>
            </div>
          </div>

          <div className="preference-section">
            <h3>Horas Silenciosas</h3>
            
            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.quietHours.enabled}
                  onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, enabled: e.target.checked })}
                />
                <div className="preference-info">
                  <span className="preference-label">Activar horas silenciosas</span>
                  <span className="preference-description">Silenciar notificaciones durante la noche</span>
                </div>
              </label>
            </div>

            {preferences.quietHours.enabled && (
              <div className="quiet-hours-config">
                <div className="time-input">
                  <label>Desde:</label>
                  <input 
                    type="time" 
                    value={preferences.quietHours.start}
                    onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, start: e.target.value })}
                  />
                </div>
                <div className="time-input">
                  <label>Hasta:</label>
                  <input 
                    type="time" 
                    value={preferences.quietHours.end}
                    onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, end: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <div className="header-left">
          <div className="notifications-title">
            <Bell size={20} />
            <h2>Notificaciones</h2>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="text-button" onClick={markAllAsRead}>
              <Check size={14} />
              Marcar todas como leídas
            </button>
          )}
          <button className="icon-button" onClick={() => setShowPreferences(true)}>
            <Settings size={18} />
          </button>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="notifications-content">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={48} />
            <p>No tienes notificaciones</p>
            <span>Las alertas aparecerán aquí</span>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                style={{ borderLeftColor: getPriorityColor(notification.priority) }}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type, notification.icon)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">
                      <Clock size={12} />
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p>{notification.message}</p>
                  
                  {notification.actionUrl && (
                    <button 
                      className="notification-action"
                      onClick={() => handleAction(notification)}
                    >
                      {notification.actionLabel || 'Ver más'}
                    </button>
                  )}
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="icon-button small"
                      onClick={() => markAsRead(notification.id)}
                      title="Marcar como leída"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    className="icon-button small"
                    onClick={() => deleteNotification(notification.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days < 7) return `Hace ${days} d`
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  })
}