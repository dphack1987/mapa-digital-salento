// Servicio de Notificaciones
// Sistema de notificaciones para eventos del sistema de aliados

export interface Notification {
  id: string
  type: 'registration' | 'verification' | 'profile_update' | 'backlink' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    handler: () => void
  }
  priority: 'low' | 'medium' | 'high'
  allyId?: string
}

class NotificationsService {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []
  private initialized = false

  /**
   * Inicializar el servicio de notificaciones
   */
  initialize() {
    if (this.initialized) return

    // Cargar notificaciones desde localStorage si existen
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications)
    }

    this.initialized = true
    console.log('🔔 Servicio de Notificaciones inicializado')
  }

  /**
   * Agregar un listener para cambios en notificaciones
   */
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    listener(this.notifications)

    // Retornar función para unsuscribir
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Notificar a todos los listeners
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  /**
   * Crear una nueva notificación
   */
  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      read: false
    }

    this.notifications.unshift(newNotification)
    this.saveToLocalStorage()
    this.notifyListeners()

    return newNotification
  }

  /**
   * Notificar nuevo registro de aliado
   */
  notifyNewRegistration(allyId: string, businessName: string, businessType: string): Notification {
    return this.createNotification({
      type: 'registration',
      title: '🎉 Nuevo Aliado Registrado',
      message: `${businessName} (${businessType}) ha completado su registro.`,
      priority: 'high',
      allyId,
      action: {
        label: 'Ver Detalles',
        handler: () => {
          console.log('Navegar a detalles del aliado:', allyId)
          // Aquí se podría navegar al dashboard del aliado
        }
      }
    })
  }

  /**
   * Notificar solicitud de verificación
   */
  notifyVerificationRequest(allyId: string, businessName: string): Notification {
    return this.createNotification({
      type: 'verification',
      title: '📋 Solicitud de Verificación',
      message: `${businessName} ha enviado documentos para verificación.`,
      priority: 'high',
      allyId,
      action: {
        label: 'Revisar Documentos',
        handler: () => {
          console.log('Navegar a verificación del aliado:', allyId)
          // Aquí se podría abrir el modal de verificación
        }
      }
    })
  }

  /**
   * Notificar verificación exitosa
   */
  notifyVerificationSuccess(allyId: string, businessName: string): Notification {
    return this.createNotification({
      type: 'verification',
      title: '✅ Verificación Aprobada',
      message: `${businessName} ha sido verificado exitosamente.`,
      priority: 'medium',
      allyId,
      action: {
        label: 'Ver Dashboard',
        handler: () => {
          console.log('Navegar al dashboard del aliado:', allyId)
          // Aquí se podría abrir el dashboard personal
        }
      }
    })
  }

  /**
   * Notificar rechazo de verificación
   */
  notifyVerificationRejected(allyId: string, businessName: string, reason: string): Notification {
    return this.createNotification({
      type: 'verification',
      title: '❌ Verificación Rechazada',
      message: `${businessName}: ${reason}`,
      priority: 'high',
      allyId,
      action: {
        label: 'Ver Detalles',
        handler: () => {
          console.log('Navegar a detalles del rechazo:', allyId)
          // Aquí se podría mostrar detalles del rechazo
        }
      }
    })
  }

  /**
   * Notificar actualización de perfil
   */
  notifyProfileUpdate(allyId: string, businessName: string): Notification {
    return this.createNotification({
      type: 'profile_update',
      title: '📝 Perfil Actualizado',
      message: `${businessName} ha actualizado su información.`,
      priority: 'low',
      allyId
    })
  }

  /**
   * Notificar actividad de backlinks
   */
  notifyBacklinkActivity(allyId: string, businessName: string, clicks: number): Notification {
    return this.createNotification({
      type: 'backlink',
      title: '🔗 Actividad de Backlinks',
      message: `${businessName}: ${clicks} nuevos clics en backlinks.`,
      priority: 'medium',
      allyId
    })
  }

  /**
   * Notificar evento del sistema
   */
  notifySystemEvent(title: string, message: string, priority: 'low' | 'medium' | 'high' = 'low'): Notification {
    return this.createNotification({
      type: 'system',
      title,
      message,
      priority
    })
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveToLocalStorage()
      this.notifyListeners()
      return true
    }
    return false
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.saveToLocalStorage()
    this.notifyListeners()
  }

  /**
   * Eliminar notificación
   */
  deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      this.notifications.splice(index, 1)
      this.saveToLocalStorage()
      this.notifyListeners()
      return true
    }
    return false
  }

  /**
   * Obtener todas las notificaciones
   */
  getAllNotifications(): Notification[] {
    return [...this.notifications]
  }

  /**
   * Obtener notificaciones no leídas
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read)
  }

  /**
   * Obtener notificaciones por tipo
   */
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type)
  }

  /**
   * Obtener notificaciones por prioridad
   */
  getNotificationsByPriority(priority: Notification['priority']): Notification[] {
    return this.notifications.filter(n => n.priority === priority)
  }

  /**
   * Obtener notificaciones por aliado
   */
  getNotificationsByAlly(allyId: string): Notification[] {
    return this.notifications.filter(n => n.allyId === allyId)
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  /**
   * Limpiar notificaciones antiguas (más de 30 días)
   */
  clearOldNotifications(): void {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    this.notifications = this.notifications.filter(
      n => new Date(n.timestamp) > thirtyDaysAgo
    )

    this.saveToLocalStorage()
    this.notifyListeners()
  }

  /**
   * Limpiar todas las notificaciones
   */
  clearAllNotifications(): void {
    this.notifications = []
    this.saveToLocalStorage()
    this.notifyListeners()
  }

  /**
   * Guardar en localStorage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Error guardando notificaciones en localStorage:', error)
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Obtener resumen de notificaciones
   */
  getNotificationSummary(): {
    total: number
    unread: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  } {
    const total = this.notifications.length
    const unread = this.notifications.filter(n => !n.read).length

    const byType: Record<string, number> = {}
    const byPriority: Record<string, number> = {}

    this.notifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1
      byPriority[n.priority] = (byPriority[n.priority] || 0) + 1
    })

    return {
      total,
      unread,
      byType,
      byPriority
    }
  }
}

// Exportar instancia singleton
export const notificationsService = new NotificationsService()
export default notificationsService