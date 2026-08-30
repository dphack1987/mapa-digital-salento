// Servicio de generación real de QR codes
// Utiliza la librería qrcode para generar códigos QR reales

import QRCode from 'qrcode'

interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

class QRCodeGenerator {
  /**
   * Generar QR code como Data URL (para usar en img src)
   */
  async generateQRCodeDataURL(text: string, options: QRCodeOptions = {}): Promise<string> {
    const qrOptions = {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M'
    }
    
    return await QRCode.toDataURL(text, qrOptions)
  }

  /**
   * Generar QR code como base64 (para descargar)
   */
  async generateQRCodeBase64(text: string, options: QRCodeOptions = {}): Promise<string> {
    const dataURL = await this.generateQRCodeDataURL(text, options)
    return dataURL.split(',')[1] // Remover el prefijo "data:image/png;base64,"
  }

  /**
   * Generar QR code como SVG
   */
  async generateQRCodeSVG(text: string, options: QRCodeOptions = {}): Promise<string> {
    const qrOptions = {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M'
    }
    
    return await QRCode.toSVG(text, qrOptions)
  }

  /**
   * Descargar QR code como imagen
   */
  async downloadQRCode(text: string, filename: string = 'qrcode.png', options: QRCodeOptions = {}): Promise<void> {
    const dataURL = await this.generateQRCodeDataURL(text, options)
    
    const link = document.createElement('a')
    link.href = dataURL
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Generar QR code placeholder (cuando la librería no está disponible)
   */
  private generatePlaceholderQR(text: string): string {
    // Generar un QR code visual simple usando Canvas
    const canvas = document.createElement('canvas')
    const size = 300
    canvas.width = size
    canvas.height = size
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    
    // Generar patrón basado en el texto
    const seed = this.hashString(text)
    const moduleSize = size / 25 // 25x25 módulos
    
    ctx.fillStyle = '#000000'
    
    // Esquinas (patrón de posicionamiento)
    this.drawPositionPattern(ctx, 0, 0, moduleSize)
    this.drawPositionPattern(ctx, size - 7 * moduleSize, 0, moduleSize)
    this.drawPositionPattern(ctx, 0, size - 7 * moduleSize, moduleSize)
    
    // Módulos de datos basados en el hash del texto
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Evitar áreas de patrones de posicionamiento
        if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
          continue
        }
        
        // Determinar si el módulo está "activo" basado en el hash
        const index = (i * 25 + j) % 32
        const bit = (seed >> index) & 1
        
        if (bit) {
          ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    
    return canvas.toDataURL('image/png')
  }

  /**
   * Dibujar patrón de posicionamiento de QR
   */
  private drawPositionPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number): void {
    const size = 7 * moduleSize
    
    // Cuadrado exterior
    ctx.fillRect(x, y, size, size)
    
    // Cuadrado interior blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + moduleSize, y + moduleSize, size - 2 * moduleSize, size - 2 * moduleSize)
    
    // Cuadrado central negro
    ctx.fillStyle = '#000000'
    const centerSize = 3 * moduleSize
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, centerSize, centerSize)
  }

  /**
   * Generar SVG placeholder
   */
  private generatePlaceholderSVG(text: string): string {
    const seed = this.hashString(text)
    const size = 300
    const moduleSize = size / 25
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
    svg += `<rect width="${size}" height="${size}" fill="white"/>`
    
    // Función para dibujar módulo
    const drawModule = (x: number, y: number, active: boolean) => {
      if (active) {
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`
      }
    }
    
    // Esquinas
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const active = i === 0 || i === 6 || j === 0 || j === 6 || 
                     (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        drawModule(j * moduleSize, i * moduleSize, active)
      }
    }
    
    // Datos
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
          continue
        }
        
        const index = (i * 25 + j) % 32
        const bit = (seed >> index) & 1
        drawModule(j * moduleSize, i * moduleSize, bit === 1)
      }
    }
    
    svg += '</svg>'
    return svg
  }

  /**
   * Hash simple de string para generar patrón determinista
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convertir a 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Generar QR code con logo en el centro
   */
  async generateQRCodeWithLogo(text: string, logoUrl: string, options: QRCodeOptions = {}): Promise<string> {
    const qrDataURL = await this.generateQRCodeDataURL(text, options)
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No se pudo crear canvas'))
        return
      }

      const img = new Image()
      img.onload = () => {
        const size = options.width || 300
        canvas.width = size
        canvas.height = size
        
        // Dibujar QR code
        ctx.drawImage(img, 0, 0, size, size)
        
        // Dibujar logo en el centro
        const logoSize = size * 0.2 // 20% del tamaño
        const logoX = (size - logoSize) / 2
        const logoY = (size - logoSize) / 2
        
        // Fondo blanco para el logo
        ctx.fillStyle = 'white'
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)
        
        // Logo (aquí se cargaría la imagen real del logo)
        ctx.fillStyle = '#e76c52' // Color del logo placeholder
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2)
        ctx.fill()
        
        resolve(canvas.toDataURL('image/png'))
      }
      
      img.onerror = () => reject(new Error('Error al cargar imagen del QR'))
      img.src = qrDataURL
    })
  }

  /**
   * Validar si un texto es apropiado para QR code
   */
  validateQRText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'El texto no puede estar vacío' }
    }
    
    if (text.length > 2000) {
      return { valid: false, error: 'El texto es demasiado largo para un QR code' }
    }
    
    return { valid: true }
  }

  /**
   * Obtener información sobre la capacidad del QR code
   */
  getQRCodeInfo(text: string): {
    version: number
    modules: number
    dataCapacity: number
    recommendedSize: number
  } {
    const length = text.length
    
    // Estimación simplificada de versión y capacidad
    let version = 1
    if (length > 25) version = 2
    if (length > 47) version = 3
    if (length > 77) version = 4
    if (length > 114) version = 5
    if (length > 154) version = 6
    if (length > 202) version = 7
    if (length > 253) version = 8
    if (length > 308) version = 9
    if (length > 368) version = 10
    
    const modules = 17 + (version * 4)
    const dataCapacity = Math.floor((modules * modules) * 0.7) // Aproximación
    
    return {
      version,
      modules,
      dataCapacity,
      recommendedSize: Math.max(200, modules * 8)
    }
  }
}

// Exportar instancia singleton
export const qrCodeGenerator = new QRCodeGenerator()
export default qrCodeGenerator