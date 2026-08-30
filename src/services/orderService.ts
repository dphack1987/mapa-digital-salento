// Servicio de pedidos estructurados con formato estándar
// Integra con WhatsApp Template Service para comunicación automática

import whatsappTemplateService from './whatsappTemplateService'

interface OrderItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
}

interface Order {
  orderId: string
  customerInfo: {
    name: string
    phone: string
    email?: string
  }
  locationInfo: {
    hotelName: string
    roomNumber?: string
    deliveryAddress?: string
  }
  items: OrderItem[]
  paymentInfo: {
    method: 'efectivo' | 'transferencia' | 'tarjeta'
    amount: number
    currency: 'COP' | 'USD' | 'EUR'
  }
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  timestamps: {
    created: Date
    confirmed?: Date
    preparing?: Date
    delivered?: Date
    cancelled?: Date
  }
  businessId: string
  businessName: string
  specialInstructions?: string
  language: 'es' | 'en'
}

class OrderService {
  private orders: Map<string, Order> = new Map()
  private orderCounter = 0

  /**
   * Crear nuevo pedido con formato estándar
   */
  createOrder(orderData: {
    customerInfo: Order['customerInfo']
    locationInfo: Order['locationInfo']
    items: Omit<OrderItem, 'totalPrice'>[]
    paymentInfo: Omit<Order['paymentInfo'], 'amount'>
    businessId: string
    businessName: string
    specialInstructions?: string
    language?: 'es' | 'en'
  }): Order {
    this.orderCounter++
    const orderId = this.generateOrderId()
    
    // Calcular precios totales por ítem
    const itemsWithTotal: OrderItem[] = orderData.items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }))
    
    // Calcular monto total
    const totalAmount = itemsWithTotal.reduce((sum, item) => sum + item.totalPrice, 0)
    
    const order: Order = {
      orderId,
      customerInfo: orderData.customerInfo,
      locationInfo: orderData.locationInfo,
      items: itemsWithTotal,
      paymentInfo: {
        ...orderData.paymentInfo,
        amount: totalAmount
      },
      status: 'pending',
      timestamps: {
        created: new Date()
      },
      businessId: orderData.businessId,
      businessName: orderData.businessName,
      specialInstructions: orderData.specialInstructions,
      language: orderData.language || 'es'
    }
    
    this.orders.set(orderId, order)
    return order
  }

  /**
   * Obtener pedido por ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId)
  }

  /**
   * Actualizar estado de pedido
   */
  updateOrderStatus(orderId: string, newStatus: Order['status']): boolean {
    const order = this.orders.get(orderId)
    if (!order) return false
    
    order.status = newStatus
    order.timestamps[newStatus as keyof Order['timestamps']] = new Date()
    this.orders.set(orderId, order)
    return true
  }

  /**
   * Generar mensaje de WhatsApp para el negocio
   */
  generateWhatsAppMessage(orderId: string): string | null {
    const order = this.orders.get(orderId)
    if (!order) return null
    
    const whatsappOrder = {
      orderId: order.orderId,
      customerName: order.customerInfo.name,
      hotel: order.locationInfo.hotelName,
      roomNumber: order.locationInfo.roomNumber,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.totalPrice,
        notes: item.notes
      })),
      totalAmount: order.paymentInfo.amount,
      paymentMethod: order.paymentInfo.method,
      deliveryAddress: order.locationInfo.deliveryAddress,
      specialInstructions: order.specialInstructions,
      timestamp: order.timestamps.created
    }
    
    return whatsappTemplateService.generateOrderMessage(whatsappOrder, order.language)
  }

  /**
   * Generar resumen de pedido para el cliente
   */
  generateCustomerSummary(orderId: string): string | null {
    const order = this.orders.get(orderId)
    if (!order) return null
    
    const isSpanish = order.language === 'es'
    
    let summary = isSpanish
      ? `📋 *RESUMEN DE PEDIDO #${order.orderId}*\n\n`
      : `📋 *ORDER SUMMARY #${order.orderId}*\n\n`
    
    summary += isSpanish
      ? `🏢 *Negocio:* ${order.businessName}\n`
      : `🏢 *Business:* ${order.businessName}\n`
    
    summary += isSpanish
      ? `👤 *Cliente:* ${order.customerInfo.name}\n`
      : `👤 *Customer:* ${order.customerInfo.name}\n`
    
    summary += isSpanish
      ? `📍 *Ubicación:* ${order.locationInfo.hotelName}`
      : `📍 *Location:* ${order.locationInfo.hotelName}`
    
    if (order.locationInfo.roomNumber) {
      summary += isSpanish ? ` - Habitación ${order.locationInfo.roomNumber}` : ` - Room ${order.locationInfo.roomNumber}`
    }
    
    summary += '\n\n'
    
    summary += isSpanish ? '🛒 *Ítems:*\n' : '🛒 *Items:*\n'
    order.items.forEach((item, index) => {
      summary += `${index + 1}. ${item.name} x${item.quantity} - $${item.totalPrice.toLocaleString()}\n`
      if (item.notes) {
        summary += `   📝 ${item.notes}\n`
      }
    })
    
    summary += '\n'
    summary += isSpanish
      ? `💰 *Total:* $${order.paymentInfo.amount.toLocaleString()} ${order.paymentInfo.currency}\n`
      : `💰 *Total:* $${order.paymentInfo.amount.toLocaleString()} ${order.paymentInfo.currency}\n`
    
    summary += isSpanish
      ? `💳 *Pago:* ${order.paymentInfo.method}\n`
      : `💳 *Payment:* ${order.paymentInfo.method}\n`
    
    summary += isSpanish
      ? `📊 *Estado:* ${this.translateStatus(order.status, order.language)}\n`
      : `📊 *Status:* ${this.translateStatus(order.status, order.language)}\n`
    
    if (order.specialInstructions) {
      summary += '\n'
      summary += isSpanish
        ? `📝 *Instrucciones:* ${order.specialInstructions}\n`
        : `📝 *Instructions:* ${order.specialInstructions}\n`
    }
    
    return summary
  }

  /**
   * Obtener pedidos por negocio
   */
  getOrdersByBusiness(businessId: string): Order[] {
    return Array.from(this.orders.values()).filter(order => order.businessId === businessId)
  }

  /**
   * Obtener pedidos por cliente
   */
  getOrdersByCustomer(customerPhone: string): Order[] {
    return Array.from(this.orders.values()).filter(order => 
      order.customerInfo.phone === customerPhone
    )
  }

  /**
   * Obtener pedidos por rango de fechas
   */
  getOrdersByDateRange(startDate: Date, endDate: Date): Order[] {
    return Array.from(this.orders.values()).filter(order => 
      order.timestamps.created >= startDate && order.timestamps.created <= endDate
    )
  }

  /**
   * Calcular estadísticas de pedidos
   */
  getOrderStatistics(businessId?: string): {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    statusBreakdown: Record<string, number>
    paymentMethodBreakdown: Record<string, number>
  } {
    const orders = businessId 
      ? this.getOrdersByBusiness(businessId)
      : Array.from(this.orders.values())
    
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.paymentInfo.amount, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    const statusBreakdown: Record<string, number> = {}
    const paymentMethodBreakdown: Record<string, number> = {}
    
    orders.forEach(order => {
      statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1
      paymentMethodBreakdown[order.paymentInfo.method] = (paymentMethodBreakdown[order.paymentInfo.method] || 0) + 1
    })
    
    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      paymentMethodBreakdown
    }
  }

  /**
   * Validar pedido antes de crear
   */
  validateOrder(orderData: {
    customerInfo: Order['customerInfo']
    items: Omit<OrderItem, 'totalPrice'>[]
    paymentInfo: Omit<Order['paymentInfo'], 'amount'>
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!orderData.customerInfo.name || orderData.customerInfo.name.trim() === '') {
      errors.push('El nombre del cliente es requerido')
    }
    
    if (!orderData.customerInfo.phone || orderData.customerInfo.phone.trim() === '') {
      errors.push('El teléfono del cliente es requerido')
    }
    
    if (orderData.items.length === 0) {
      errors.push('El pedido debe tener al menos un ítem')
    }
    
    orderData.items.forEach((item, index) => {
      if (!item.name || item.name.trim() === '') {
        errors.push(`El ítem ${index + 1} debe tener un nombre`)
      }
      if (item.quantity <= 0) {
        errors.push(`La cantidad del ítem ${index + 1} debe ser mayor a 0`)
      }
      if (item.unitPrice < 0) {
        errors.push(`El precio del ítem ${index + 1} no puede ser negativo`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Cancelar pedido
   */
  cancelOrder(orderId: string, reason?: string): boolean {
    const order = this.orders.get(orderId)
    if (!order || order.status === 'delivered') return false
    
    order.status = 'cancelled'
    order.timestamps.cancelled = new Date()
    
    if (reason) {
      order.specialInstructions = (order.specialInstructions || '') + `\nCANCELACIÓN: ${reason}`
    }
    
    this.orders.set(orderId, order)
    return true
  }

  /**
   * Traducir estado de pedido
   */
  private translateStatus(status: string, language: 'es' | 'en'): string {
    const translations = {
      es: {
        'pending': 'Pendiente',
        'confirmed': 'Confirmado',
        'preparing': 'Preparando',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
      },
      en: {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }
    }
    return translations[language][status as keyof typeof translations.es] || status
  }

  /**
   * Generar ID de pedido
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `ORD-${timestamp}-${random}`
  }

  /**
   * Exportar pedidos para análisis
   */
  exportOrders(businessId?: string): Order[] {
    return businessId 
      ? this.getOrdersByBusiness(businessId)
      : Array.from(this.orders.values())
  }
}

// Exportar instancia singleton
export const orderService = new OrderService()
export default orderService