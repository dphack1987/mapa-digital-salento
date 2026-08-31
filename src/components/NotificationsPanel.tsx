// Componente Panel de Notificaciones
// Muestra las notificaciones del sistema de aliados

import { useState, useEffect } from 'react'
import { Bell, X, Check, Trash2, AlertCircle, CheckCircle, Info, Settings } from 'lucide-react'
import notificationsService from '../services/notifications.service'

interface NotificationsPanelProps {
  onClose?: () => void
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')

  useEffect(() => {
    // Suscribirse a cambios en notificaciones
    const unsubscribe = notificationsService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
    })

    return unsubscribe
  }, [])

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read)
      case 'high':
        return notifications.filter(n => n.priority === 'high')
      default:
        return notifications
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    notificationsService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    notificationsService.markAllAsRead()
  }

  const handleDelete = (notificationId: string) => {
    notificationsService.deleteNotification(notificationId)
  }

  const handleClearAll = () => {
    notificationsService.clearAllNotifications()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <CheckCircle size={16} className="text-green-600" />
      case 'verification':
        return <AlertCircle size={16} className="text-orange-600" />
      case 'profile_update':
        return <Info size={16} className="text-blue-600" />
      case 'backlink':
        return <Bell size={16} className="text-purple-600" />
      default:
        return <Info size={16} className="text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500'
      case 'medium':
        return 'border-orange-500'
      default:
        return 'border-gray-300'
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notificationsService.getUnreadCount()

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <div className="notifications-title">
          <Bell size={20} />
          <h3>Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="icon-button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            aria-label="Marcar todas como leídas"
          >
            <Check size={16} />
          </button>
          <button 
            className="icon-button"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            aria-label="Limpiar todas"
          >
            <Trash2 size={16} />
          </button>
          <button 
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button 
          className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          No leídas ({unreadCount})
        </button>
        <button 
          className={`filter-button ${filter === 'high' ? 'active' : ''}`}
          onClick={() => setFilter('high')}
        >
          Importantes
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="text-gray-400" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${getPriorityColor(notification.priority)}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-text">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: 'short'
                    })}
                  </span>
                </div>
                {notification.action && (
                  <button 
                    className="notification-action"
                    onClick={() => {
                      notification.action?.handler()
                      handleMarkAsRead(notification.id)
                    }}
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="icon-button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    aria-label="Marcar como leída"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button 
                  className="icon-button"
                  onClick={() => handleDelete(notification.id)}
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationsPanel