// Sistema de notificaciones y alertas inteligentes
// Proporciona alertas contextuales sobre clima, eventos, pedidos, etc.

interface Notification {
  id: string
  type: 'weather' | 'event' | 'order' | 'promotion' | 'emergency' | 'system'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
  duration?: number // Duración en milisegundos para notificaciones temporales
}

interface NotificationPreferences {
  weatherAlerts: boolean
  eventNotifications: boolean
  orderUpdates: boolean
  promotionalMessages: boolean
  emergencyAlerts: boolean
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
}

class NotificationService {
  private notifications: Notification[] = []
  private preferences: NotificationPreferences = {
    weatherAlerts: true,
    eventNotifications: true,
    orderUpdates: true,
    promotionalMessages: false,
    emergencyAlerts: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  }
  private listeners: Set<(notification: Notification) => void> = new Set()

  /**
   * Agregar un listener para nuevas notificaciones
   */
  addListener(listener: (notification: Notification) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Enviar notificación
   */
  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    // Verificar si está en horas silenciosas
    if (this.isQuietHours() && notification.priority !== 'urgent') {
      console.log('Notificación silenciada por horas de quietud')
      return null as any
    }

    // Verificar preferencias del usuario
    if (!this.shouldSendNotification(notification.type)) {
      return null as any
    }

    const newNotification: Notification = {
      ...notification,
      id: this.generateNotificationId(),
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Limitar a 50 notificaciones
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    // Notificar a los listeners
    this.listeners.forEach(listener => listener(newNotification))

    // Si es una notificación temporal, programar su eliminación
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(newNotification.id)
      }, notification.duration)
    }

    return newNotification
  }

  /**
   * Obtener todas las notificaciones
   */
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  /**
   * Obtener notificaciones no leídas
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read)
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  }

  /**
   * Marcar todas como leídas
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
  }

  /**
   * Eliminar notificación
   */
  removeNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      this.notifications.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Generar alerta de clima inteligente
   */
  generateWeatherAlert(weatherData: any): Notification | null {
    if (!this.preferences.weatherAlerts) return null

    const temp = weatherData.salento.temperature
    const condition = weatherData.salento.condition
    
    let title = 'Actualización del clima'
    let message = `El clima en Salento es de ${temp}°C`
    let priority: 'low' | 'medium' | 'high' = 'low'
    let icon = '🌤️'

    if (condition === 'rain' || condition === 'storm') {
      title = '⚠️ Alerta de lluvia'
      message = `Se espera lluvia en Salento. Recomendamos llevar chaqueta y paraguas.`
      priority = 'medium'
      icon = '🌧️'
    } else if (temp > 28) {
      title = '☀️ Día caluroso'
      message = `Hace ${temp}°C en Salento. Recomendamos hidratación y protector solar.`
      priority = 'medium'
      icon = '🥵'
    } else if (temp < 12) {
      title = '🧊 Día fresco'
      message = `Hace ${temp}°C en Salento. Recomendamos chaqueta, especialmente para el Valle.`
      priority = 'medium'
      icon = '🥶'
    }

    return this.sendNotification({
      type: 'weather',
      title,
      message,
      priority,
      icon,
      duration: 10000 // 10 segundos
    })
  }

  /**
   * Generar alerta de evento
   */
  generateEventAlert(event: any): Notification | null {
    if (!this.preferences.eventNotifications) return null

    return this.sendNotification({
      type: 'event',
      title: `🎭 Evento hoy: ${event.name}`,
      message: event.description || 'No te lo pierdas en Salento',
      priority: 'medium',
      icon: '🎪',
      actionUrl: event.url,
      actionLabel: 'Ver detalles'
    })
  }

  /**
   * Generar alerta de actualización de pedido
   */
  generateOrderUpdate(orderId: string, status: string, businessName: string): Notification | null {
    if (!this.preferences.orderUpdates) return null

    const statusMessages: Record<string, string> = {
      'confirmed': '¡Tu pedido ha sido confirmado!',
      'preparing': 'Tu pedido está siendo preparado',
      'delivered': '¡Tu pedido ha sido entregado!',
      'cancelled': 'Tu pedido ha sido cancelado'
    }

    const priority = status === 'cancelled' ? 'high' : 'medium'

    return this.sendNotification({
      type: 'order',
      title: `Pedido #${orderId}`,
      message: `${statusMessages[status] || 'Actualización de pedido'} - ${businessName}`,
      priority,
      icon: status === 'delivered' ? '✅' : status === 'cancelled' ? '❌' : '📦'
    })
  }

  /**
   * Generar alerta de emergencia
   */
  generateEmergencyAlert(type: string, location: string, instructions: string): Notification {
    return this.sendNotification({
      type: 'emergency',
      title: `🚨 Emergencia: ${type}`,
      message: `Ubicación: ${location}. ${instructions}`,
      priority: 'urgent',
      icon: '🚨',
      duration: 30000 // 30 segundos para alertas de emergencia
    })
  }

  /**
   * Generar alerta promocional
   */
  generatePromotionalAlert(businessName: string, offer: string, discount: string): Notification | null {
    if (!this.preferences.promotionalMessages) return null

    return this.sendNotification({
      type: 'promotion',
      title: `🎉 Oferta especial de ${businessName}`,
      message: `${offer} - ${discount}`,
      priority: 'low',
      icon: '🎁'
    })
  }

  /**
   * Generar alerta del sistema
   */
  generateSystemAlert(message: string, priority: 'low' | 'medium' | 'high' = 'low'): Notification {
    return this.sendNotification({
      type: 'system',
      title: '🔔 Actualización del sistema',
      message,
      priority,
      icon: '⚙️'
    })
  }

  /**
   * Verificar si debe enviar notificación según preferencias
   */
  private shouldSendNotification(type: Notification['type']): boolean {
    switch (type) {
      case 'weather':
        return this.preferences.weatherAlerts
      case 'event':
        return this.preferences.eventNotifications
      case 'order':
        return this.preferences.orderUpdates
      case 'promotion':
        return this.preferences.promotionalMessages
      case 'emergency':
        return this.preferences.emergencyAlerts
      case 'system':
        return true // Las notificaciones del sistema siempre se envían
      default:
        return true
    }
  }

  /**
   * Verificar si está en horas silenciosas
   */
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const [startHour, startMinute] = this.preferences.quietHours.start.split(':').map(Number)
    const [endHour, endMinute] = this.preferences.quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute

    // Manejar el caso donde el rango cruza la medianoche
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime
    }

    return currentTime >= startTime && currentTime < endTime
  }

  /**
   * Actualizar preferencias de notificación
   */
  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences }
  }

  /**
   * Obtener preferencias actuales
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences }
  }

  /**
   * Generar ID de notificación
   */
  private generateNotificationId(): string {
    return `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Limpiar notificaciones antiguas (más de 7 días)
   */
  cleanOldNotifications(): void {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    this.notifications = this.notifications.filter(
      n => n.timestamp > sevenDaysAgo
    )
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  getStatistics(): {
    total: number
    unread: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  } {
    const byType: Record<string, number> = {}
    const byPriority: Record<string, number> = {}

    this.notifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1
      byPriority[n.priority] = (byPriority[n.priority] || 0) + 1
    })

    return {
      total: this.notifications.length,
      unread: this.getUnreadNotifications().length,
      byType,
      byPriority
    }
  }
}

// Exportar instancia singleton
export const notificationService = new NotificationService()
export default notificationService