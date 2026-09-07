// Servicio de QR público infinito para Salento a la Mano
// Genera un QR permanente que redirige a la app web sin costo ni límites

class PublicQRService {
  private static readonly APP_URL = 'https://mapa-digital-salento.vercel.app/'
  private static readonly QR_VERSION = '1.0'
  
  /**
   * Generar QR público que redirige a la app web Salento a la Mano
   * Este QR es infinito, sin costo y puede ser escaneado cualquier cantidad de veces
   */
  generatePublicQR(): string {
    // QR simple que contiene la URL directa de la app
    const qrData = {
      url: PublicQRService.APP_URL,
      app: 'Salento a la Mano',
      version: PublicQRService.QR_VERSION,
      type: 'public-web',
      infinite: true
    }
    
    return JSON.stringify(qrData)
  }

  /**
   * Obtener la URL directa de la app para el QR
   */
  getAppURL(): string {
    return PublicQRService.APP_URL
  }

  /**
   * Generar código QR para impresión o uso en materiales
   * Retorna la URL que se puede usar con cualquier generador de QR
   */
  getQRCodeURL(): string {
    // Usamos API pública de QR Server para generar el código
    const encodedURL = encodeURIComponent(PublicQRService.APP_URL)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedURL}&color=000000&bgcolor=FFFFFF`
  }

  /**
   * Generar QR con tamaño personalizado
   */
  getQRCodeURLWithSize(size: number = 300): string {
    const encodedURL = encodeURIComponent(PublicQRService.APP_URL)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedURL}&color=000000&bgcolor=FFFFFF`
  }

  /**
   * Generar QR con colores personalizados (para materiales de marca)
   */
  getStyledQRCodeURL(options: {
    size?: number
    foregroundColor?: string
    backgroundColor?: string
  } = {}): string {
    const {
      size = 300,
      foregroundColor = '000000',
      backgroundColor = 'FFFFFF'
    } = options

    const encodedURL = encodeURIComponent(PublicQRService.APP_URL)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedURL}&color=${foregroundColor}&bgcolor=${backgroundColor}`
  }

  /**
   * Validar que un QR escaneado es el QR público oficial
   */
  validatePublicQR(scannedData: string): boolean {
    try {
      const data = JSON.parse(scannedData)
      return (
        data.type === 'public-web' &&
        data.app === 'Salento a la Mano' &&
        data.url === PublicQRService.APP_URL &&
        data.infinite === true
      )
    } catch {
      // Si no es JSON, verificar si es la URL directa
      return scannedData === PublicQRService.APP_URL
    }
  }

  /**
   * Obtener información del QR público
   */
  getQRInfo(): {
    url: string
    app: string
    type: string
    infinite: boolean
    cost: string
    description: string
  } {
    return {
      url: PublicQRService.APP_URL,
      app: 'Salento a la Mano',
      type: 'public-web',
      infinite: true,
      cost: 'Gratis',
      description: 'QR público infinito para acceso directo a la app web Salento a la Mano'
    }
  }
}

// Exportar instancia singleton
export const publicQRService = new PublicQRService()
export default publicQRService