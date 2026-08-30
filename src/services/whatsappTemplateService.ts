// Servicio de plantillas de mensajes para WhatsApp Business
// Genera mensajes estructurados para pedidos, reservas y consultas

interface OrderItem {
  name: string
  quantity: number
  price: number
  notes?: string
}

interface OrderDetails {
  orderId: string
  customerName: string
  hotel: string
  roomNumber?: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta'
  deliveryAddress?: string
  specialInstructions?: string
  timestamp: Date
}

interface ReservationDetails {
  reservationId: string
  customerName: string
  checkIn: Date
  checkOut: Date
  guests: number
  roomType: string
  specialRequests?: string
  contactPhone: string
}

class WhatsAppTemplateService {
  /**
   * Generar mensaje de pedido estructurado
   */
  generateOrderMessage(order: OrderDetails, language: 'es' | 'en' = 'es'): string {
    const isSpanish = language === 'es'
    
    const header = isSpanish 
      ? `📦 *PEDIDO #${order.orderId}*`
      : `📦 *ORDER #${order.orderId}*`
    
    const customerInfo = isSpanish
      ? `👤 *Cliente:* ${order.customerName}`
      : `👤 *Customer:* ${order.customerName}`
    
    const locationInfo = order.roomNumber
      ? (isSpanish 
        ? `🏨 *Hostal:* ${order.hotel} - Habitación: ${order.roomNumber}`
        : `🏨 *Hotel:* ${order.hotel} - Room: ${order.roomNumber}`)
      : (isSpanish
        ? `🏨 *Hostal:* ${order.hotel}`
        : `🏨 *Hotel:* ${order.hotel}`)
    
    const itemsHeader = isSpanish ? '\n🛒 *Ítems:*' : '\n🛒 *Items:*'
    const itemsList = order.items.map((item, index) => {
      const itemText = isSpanish
        ? `${index + 1}. ${item.name} x${item.quantity} - $${item.price.toLocaleString()}`
        : `${index + 1}. ${item.name} x${item.quantity} - $${item.price.toLocaleString()}`
      return itemText + (item.notes ? ` (${item.notes})` : '')
    }).join('\n')
    
    const total = isSpanish
      ? `\n💰 *Total:* $${order.totalAmount.toLocaleString()}`
      : `\n💰 *Total:* $${order.totalAmount.toLocaleString()}`
    
    const payment = isSpanish
      ? `💳 *Método de Pago:* ${this.translatePaymentMethod(order.paymentMethod, language)}`
      : `💳 *Payment Method:* ${this.translatePaymentMethod(order.paymentMethod, language)}`
    
    const timestamp = isSpanish
      ? `⏰ *Hora:* ${order.timestamp.toLocaleTimeString()}`
      : `⏰ *Time:* ${order.timestamp.toLocaleTimeString()}`
    
    let message = `${header}\n${customerInfo}\n${locationInfo}${itemsHeader}\n${itemsList}${total}\n${payment}\n${timestamp}`
    
    if (order.specialInstructions) {
      const instructions = isSpanish
        ? `\n📝 *Instrucciones:* ${order.specialInstructions}`
        : `\n📝 *Instructions:* ${order.specialInstructions}`
      message += instructions
    }
    
    if (order.deliveryAddress) {
      const address = isSpanish
        ? `\n📍 *Dirección de entrega:* ${order.deliveryAddress}`
        : `\n📍 *Delivery Address:* ${order.deliveryAddress}`
      message += address
    }
    
    const footer = isSpanish
      ? '\n\n✅ *Por favor confirmar recepción de este pedido*'
      : '\n\n✅ *Please confirm receipt of this order*'
    
    return message + footer
  }

  /**
   * Generar mensaje de reserva
   */
  generateReservationMessage(reservation: ReservationDetails, language: 'es' | 'en' = 'es'): string {
    const isSpanish = language === 'es'
    
    const header = isSpanish
      ? `🏨 *RESERVA #${reservation.reservationId}*`
      : `🏨 *RESERVATION #${reservation.reservationId}*`
    
    const customerInfo = isSpanish
      ? `👤 *Cliente:* ${reservation.customerName}`
      : `👤 *Customer:* ${reservation.customerName}`
    
    const dates = isSpanish
      ? `📅 *Fechas:* ${reservation.checkIn.toLocaleDateString()} - ${reservation.checkOut.toLocaleDateString()}`
      : `📅 *Dates:* ${reservation.checkIn.toLocaleDateString()} - ${reservation.checkOut.toLocaleDateString()}`
    
    const guests = isSpanish
      ? `👥 *Huéspedes:* ${reservation.guests}`
      : `👥 *Guests:* ${reservation.guests}`
    
    const room = isSpanish
      ? `🛏️ *Tipo de habitación:* ${reservation.roomType}`
      : `🛏️ *Room Type:* ${reservation.roomType}`
    
    const contact = isSpanish
      ? `📞 *Contacto:* ${reservation.contactPhone}`
      : `📞 *Contact:* ${reservation.contactPhone}`
    
    let message = `${header}\n${customerInfo}\n${dates}\n${guests}\n${room}\n${contact}`
    
    if (reservation.specialRequests) {
      const requests = isSpanish
        ? `\n📝 *Solicitudes especiales:* ${reservation.specialRequests}`
        : `\n📝 *Special Requests:* ${reservation.specialRequests}`
      message += requests
    }
    
    const footer = isSpanish
      ? '\n\n✅ *Por favor confirmar disponibilidad*'
      : '\n\n✅ *Please confirm availability*'
    
    return message + footer
  }

  /**
   * Generar mensaje de consulta simple
   */
  generateInquiryMessage(inquiry: {
    customerName: string
    businessName: string
    inquiryType: 'producto' | 'servicio' | 'general'
    message: string
    language: 'es' | 'en'
  }): string {
    const isSpanish = inquiry.language === 'es'
    
    const header = isSpanish
      ? `❓ *CONSULTA - ${inquiry.businessName}*`
      : `❓ *INQUIRY - ${inquiry.businessName}*`
    
    const customerInfo = isSpanish
      ? `👤 *Cliente:* ${inquiry.customerName}`
      : `👤 *Customer:* ${inquiry.customerName}`
    
    const type = isSpanish
      ? `📋 *Tipo:* ${this.translateInquiryType(inquiry.inquiryType, inquiry.language)}`
      : `📋 *Type:* ${this.translateInquiryType(inquiry.inquiryType, inquiry.language)}`
    
    const message = isSpanish
      ? `💬 *Mensaje:* ${inquiry.message}`
      : `💬 *Message:* ${inquiry.message}`
    
    const fullMessage = `${header}\n${customerInfo}\n${type}\n${message}`
    
    const footer = isSpanish
      ? '\n\n📞 *Gracias por su atención*'
      : '\n\n📞 *Thank you for your attention*'
    
    return fullMessage + footer
  }

  /**
   * Generar mensaje de confirmación automática
   */
  generateAutoConfirmationMessage(orderId: string, businessName: string, language: 'es' | 'en' = 'es'): string {
    const isSpanish = language === 'es'
    
    return isSpanish
      ? `✅ *CONFIRMACIÓN AUTOMÁTICA*\n\nSu pedido #${orderId} ha sido recibido por ${businessName}.\n\n⏱️ Tiempo estimado de respuesta: 5-10 minutos\n\n📍 Si necesita modificar algo, por favor responda este mensaje.`
      : `✅ *AUTOMATIC CONFIRMATION*\n\nYour order #${orderId} has been received by ${businessName}.\n\n⏱️ Estimated response time: 5-10 minutes\n\n📍 If you need to modify anything, please reply to this message.`
  }

  /**
   * Traducir método de pago
   */
  private translatePaymentMethod(method: string, language: 'es' | 'en'): string {
    const translations = {
      es: {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia',
        'tarjeta': 'Tarjeta'
      },
      en: {
        'efectivo': 'Cash',
        'transferencia': 'Transfer',
        'tarjeta': 'Card'
      }
    }
    return translations[language][method as keyof typeof translations.es] || method
  }

  /**
   * Traducir tipo de consulta
   */
  private translateInquiryType(type: string, language: 'es' | 'en'): string {
    const translations = {
      es: {
        'producto': 'Producto',
        'servicio': 'Servicio',
        'general': 'General'
      },
      en: {
        'producto': 'Product',
        'servicio': 'Service',
        'general': 'General'
      }
    }
    return translations[language][type as keyof typeof translations.es] || type
  }

  /**
   * Generar código QR para seguimiento de pedido
   */
  generateOrderTrackingQR(orderId: string): string {
    // En producción, esto generaría un QR real con la URL de seguimiento
    const trackingUrl = `https://salento-alamano.com/track/${orderId}`
    return trackingUrl
  }

  /**
   * Validar formato de mensaje antes de enviar
   */
  validateMessage(message: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (message.length > 1000) {
      errors.push('El mensaje excede el límite de 1000 caracteres')
    }
    
    if (!message.includes('*')) {
      errors.push('El mensaje debe incluir formato con negritas (*)')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Exportar instancia singleton
export const whatsappTemplateService = new WhatsAppTemplateService()
export default whatsappTemplateService