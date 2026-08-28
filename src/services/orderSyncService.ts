// Servicio de sincronización de pedidos offline
// Gestiona la cola de pedidos y los sincroniza cuando hay conexión

import offlineStorage, { OfflineOrder } from './offlineStorage'

interface SyncResult {
  success: boolean
  orderId: string
  error?: string
  syncedAt?: Date
}

class OrderSyncService {
  private syncInterval: number | null = null
  private isSyncing = false
  private maxRetries = 3
  private retryDelay = 5000 // 5 segundos

  /**
   * Iniciar el servicio de sincronización
   */
  start(): void {
    if (this.syncInterval) return

    // Sincronizar pedidos pendientes cada 30 segundos
    this.syncInterval = window.setInterval(() => {
      this.syncPendingOrders()
    }, 30000)

    // Sincronizar inmediatamente cuando se recupera la conexión
    const cleanupConnectionListener = offlineStorage.onConnectionChange((online) => {
      if (online) {
        console.log('Connection restored, syncing pending orders...')
        this.syncPendingOrders()
      }
    })

    console.log('Order sync service started')
  }

  /**
   * Detener el servicio de sincronización
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    console.log('Order sync service stopped')
  }

  /**
   * Agregar pedido a la cola de sincronización
   */
  async queueOrder(orderData: any): Promise<string> {
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const offlineOrder: OfflineOrder = {
      id: orderId,
      timestamp: Date.now(),
      status: 'pending',
      orderData,
      retryCount: 0
    }

    await offlineStorage.saveOrder(offlineOrder)
    console.log('Order queued for sync:', orderId)

    // Intentar sincronizar inmediatamente si hay conexión
    if (offlineStorage.isOnline()) {
      this.syncOrder(orderId)
    }

    return orderId
  }

  /**
   * Sincronizar todos los pedidos pendientes
   */
  async syncPendingOrders(): Promise<SyncResult[]> {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...')
      return []
    }

    this.isSyncing = true

    try {
      const pendingOrders = await offlineStorage.getPendingOrders()
      console.log(`Found ${pendingOrders.length} pending orders to sync`)

      const results: SyncResult[] = []

      for (const order of pendingOrders) {
        const result = await this.syncOrder(order.id)
        results.push(result)
      }

      return results
    } catch (error) {
      console.error('Error syncing pending orders:', error)
      return []
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Sincronizar un pedido específico
   */
  private async syncOrder(orderId: string): Promise<SyncResult> {
    try {
      // Obtener el pedido de IndexedDB
      const pendingOrders = await offlineStorage.getPendingOrders()
      const order = pendingOrders.find(o => o.id === orderId)

      if (!order) {
        return {
          success: false,
          orderId,
          error: 'Order not found in pending queue'
        }
      }

      // Verificar si hemos excedido el número máximo de reintentos
      if (order.retryCount >= this.maxRetries) {
        await offlineStorage.updateOrderStatus(orderId, 'failed')
        return {
          success: false,
          orderId,
          error: 'Max retries exceeded'
        }
      }

      // Simular envío del pedido (en producción esto sería una llamada real a la API)
      const syncResult = await this.sendOrderToBackend(order.orderData)

      if (syncResult.success) {
        await offlineStorage.updateOrderStatus(orderId, 'synced')
        console.log('Order synced successfully:', orderId)
        
        return {
          success: true,
          orderId,
          syncedAt: new Date()
        }
      } else {
        // Incrementar contador de reintentos
        order.retryCount++
        await offlineStorage.saveOrder(order)
        
        return {
          success: false,
          orderId,
          error: syncResult.error || 'Sync failed'
        }
      }
    } catch (error) {
      console.error('Error syncing order:', orderId, error)
      return {
        success: false,
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Enviar pedido al backend (simulado)
   * En producción esto sería una llamada real a la API
   */
  private async sendOrderToBackend(orderData: any): Promise<{ success: boolean; error?: string }> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular éxito 90% de las veces
        const success = Math.random() > 0.1
        
        if (success) {
          resolve({ success: true })
        } else {
          resolve({ 
            success: false, 
            error: 'Backend temporarily unavailable' 
          })
        }
      }, 1000) // Simular latencia de red
    })
  }

  /**
   * Enviar pedido por WhatsApp (fallback cuando no hay backend)
   */
  async sendOrderViaWhatsApp(orderData: any): Promise<void> {
    const { hotel, room, phone, directions, items, total } = orderData
    
    const message = [
      '📱 *NUEVO PEDIDO OFFLINE*',
      '',
      `🏨 Hotel: ${hotel}`,
      `🚪 Habitación: ${room}`,
      `📱 Celular: ${phone}`,
      directions ? `📍 Indicaciones: ${directions}` : '',
      '',
      '📦 *Productos:*',
      ...items.map((item: any) => `- ${item.name} x${item.quantity}`),
      '',
      `💰 Total: ${total}`,
      '',
      '📅 Enviado desde modo offline - Salento a la mano'
    ].filter(Boolean).join('\n')

    const whatsappUrl = `https://wa.me/573164567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  /**
   * Obtener estado de sincronización
   */
  async getSyncStatus(): Promise<{
    pending: number
    synced: number
    failed: number
    lastSync?: Date
  }> {
    const pendingOrders = await offlineStorage.getPendingOrders()
    
    // En una implementación completa, obtendríamos también los synced y failed
    return {
      pending: pendingOrders.length,
      synced: 0, // Se implementaría con un índice adicional
      failed: 0,  // Se implementaría con un índice adicional
      lastSync: undefined // Se podría guardar en userPreferences
    }
  }

  /**
   * Limpiar pedidos antiguos sincronizados
   */
  async cleanupOldSyncedOrders(): Promise<void> {
    // Implementación futura para limpiar pedidos ya sincronizados
    console.log('Cleaning up old synced orders...')
  }

  /**
   * Reintentar un pedido fallido manualmente
   */
  async retryFailedOrder(orderId: string): Promise<SyncResult> {
    // Resetear el contador de reintentos
    const pendingOrders = await offlineStorage.getPendingOrders()
    const order = pendingOrders.find(o => o.id === orderId)
    
    if (order) {
      order.retryCount = 0
      order.status = 'pending'
      await offlineStorage.saveOrder(order)
    }

    return this.syncOrder(orderId)
  }
}

// Exportar instancia singleton
export const orderSyncService = new OrderSyncService()
export default orderSyncService