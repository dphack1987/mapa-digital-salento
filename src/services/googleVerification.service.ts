// Servicio de Verificación de Propiedad de Google Search Console
// Genera métodos de verificación para mapa-digital-salento.vercel.app

interface VerificationMethod {
  name: string
  description: string
  code: string
  instructions: string[]
  priority: 'recommended' | 'alternative'
}

class GoogleVerificationService {
  private readonly domain = 'https://mapa-digital-salento.vercel.app'
  private readonly brandName = 'Salento a la Mano'
  private readonly verificationCode = 'googleac76b27847921d06' // Código real de Google Search Console

  /**
   * Generar todos los métodos de verificación disponibles
   */
  generateAllVerificationMethods(): VerificationMethod[] {
    return [
      this.generateHTMLFileMethod(),
      this.generateMetaTagMethod(),
      this.generateDNSMethod()
    ]
  }

  /**
   * Método 1: Archivo HTML de verificación (Recomendado)
   */
  private generateHTMLFileMethod(): VerificationMethod {
    const fileName = 'google' + this.verificationCode + '.html'

    return {
      name: 'Archivo HTML de Verificación',
      description: 'El archivo ya está creado en public/' + fileName + ' y se desplegará en Vercel',
      code: this.verificationCode,
      instructions: [
        '1. El archivo de verificación ya está creado: public/' + fileName,
        '2. Vercel lo desplegará automáticamente en: ' + this.domain + '/' + fileName,
        '3. Verifica que el archivo esté accesible visitando la URL',
        '4. Ve a Google Search Console y haz clic en "Verificar"',
        '5. Google buscará el archivo en: ' + this.domain + '/' + fileName
      ],
      priority: 'recommended'
    }
  }

  /**
   * Método 2: Meta tag de verificación (Recomendado)
   */
  private generateMetaTagMethod(): VerificationMethod {
    const metaTag = '<meta name="google-site-verification" content="' + this.verificationCode + '" />'

    return {
      name: 'Meta Tag de Verificación',
      description: 'El meta tag ya está agregado a index.html para verificación más rápida',
      code: this.verificationCode,
      instructions: [
        '1. El meta tag ya está agregado al <head> de index.html:',
        metaTag,
        '2. Despliega los cambios en Vercel',
        '3. Ve a Google Search Console y haz clic en "Verificar"',
        '4. Google verificará el meta tag en tu página principal'
      ],
      priority: 'recommended'
    }
  }

  /**
   * Método 3: Registro DNS (Alternativo)
   */
  private generateDNSMethod(): VerificationMethod {
    const txtRecord = 'google-site-verification=' + this.verificationCode

    return {
      name: 'Registro DNS TXT',
      description: 'Agrega un registro TXT a la configuración DNS de tu dominio',
      code: this.verificationCode,
      instructions: [
        '1. Ve a tu proveedor de DNS (Vercel, GoDaddy, etc.)',
        '2. Agrega un registro TXT con:',
        '   Nombre: @',
        '   Valor: ' + txtRecord,
        '3. Espera la propagación DNS (puede tomar hasta 48 horas)',
        '4. Ve a Google Search Console y haz clic en "Verificar"'
      ],
      priority: 'alternative'
    }
  }

  /**
   * Generar archivo HTML de verificación
   */
  generateVerificationHTMLFile(): {
    fileName: string
    content: string
    verificationCode: string
    url: string
  } {
    const fileName = 'google' + this.verificationCode + '.html'

    // Google espera un archivo HTML básico con el meta tag en el head
    const htmlContent = '<html>\n<head>\n<meta name="google-site-verification" content="' + this.verificationCode + '" />\n</head>\n<body>\n</body>\n</html>'

    return {
      fileName: fileName,
      content: htmlContent,
      verificationCode: this.verificationCode,
      url: this.domain + '/' + fileName
    }
  }

  /**
   * Generar instrucciones completas para Vercel
   */
  generateVercelInstructions(): string {
    const instructions = '# Instrucciones de Verificación para Vercel\n\n'
      + '## Dominio: ' + this.domain + '\n'
      + '## Marca: ' + this.brandName + '\n'
      + '## Código de Verificación: ' + this.verificationCode + '\n\n'
      + '## Archivo de Verificación HTML\n\n'
      + 'El archivo ya está creado en: public/google' + this.verificationCode + '.html\n\n'
      + 'URL de verificación: ' + this.domain + '/google' + this.verificationCode + '.html\n\n'
      + '## Meta Tag de Verificación\n\n'
      + 'El meta tag ya está agregado a index.html para verificación más rápida:\n\n'
      + '<meta name="google-site-verification" content="' + this.verificationCode + '" />\n\n'
      + '## Pasos para Verificar\n\n'
      + '1. **Despliega los cambios en Vercel**\n'
      + '   - El archivo public/google' + this.verificationCode + '.html se desplegará automáticamente\n'
      + '   - El meta tag en index.html también se desplegará\n'
      + '   - Vercel hará que ambos estén disponibles en producción\n\n'
      + '2. **Verifica en Google Search Console**\n'
      + '   - Ve a Google Search Console\n'
      + '   - Haz clic en "Verificar"\n'
      + '   - Google verificará usando el meta tag o el archivo HTML\n\n'
      + '## Verificación Manual\n\n'
      + 'Puedes verificar que los archivos están accesibles visitando:\n'
      + '- Sitio principal: ' + this.domain + '\n'
      + '- Archivo de verificación: ' + this.domain + '/google' + this.verificationCode + '.html\n\n'
      + '## Recomendaciones\n\n'
      + '- El meta tag es el método más rápido y ya está implementado\n'
      + '- El archivo HTML es un método alternativo ya disponible\n'
      + '- Asegúrate de que Vercel haya terminado el despliegue antes de verificar\n'
      + '- Verifica que ambos métodos estén accesibles manualmente antes de verificar en Google\n'

    return instructions
  }

  /**
   * Generar robots.txt optimizado
   */
  generateRobotsTxt(): string {
    return '# Robots.txt para ' + this.domain + '\n'
      + '# Generado automáticamente para ' + this.brandName + '\n\n'
      + 'User-agent: *\n'
      + 'Allow: /\n\n'
      + '# Priorizar páginas importantes\n'
      + 'Allow: /estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100\n'
      + 'Allow: /salento-abierto-hoy-turismo-seguro-valle-cocora-accesible\n'
      + 'Allow: /paso-valle-cocora-abierto-acceso-total-jeeps-willys-operativos\n\n'
      + '# Bloquear archivos temporales y de sistema\n'
      + 'Disallow: /api/\n'
      + 'Disallow: /admin/\n'
      + 'Disallow: /private/\n'
      + 'Disallow: /*.json$\n'
      + 'Disallow: /*.xml$\n\n'
      + '# Sitemap\n'
      + 'Sitemap: ' + this.domain + '/sitemap.xml\n'
      + 'Sitemap: ' + this.domain + '/salentoalamano-defensive-sitemap.xml\n\n'
      + '# Crawl-delay para sobrecarga\n'
      + 'Crawl-delay: 1'
  }

  /**
   * Verificar estado de verificación actual
   */
  checkVerificationStatus(): {
    domain: string
    verified: boolean
    method: string | null
    lastChecked: string
    recommendations: string[]
  } {
    return {
      domain: this.domain,
      verified: false,
      method: null,
      lastChecked: new Date().toISOString(),
      recommendations: [
        'Verifica la propiedad en Google Search Console usando el meta tag o archivo HTML',
        'El meta tag ya está agregado a index.html',
        'El archivo de verificación ya está creado en public/google' + this.verificationCode + '.html',
        'Despliega los cambios en Vercel antes de verificar',
        'Envía tu sitemap a Google después de verificar',
        'Monitorea el rendimiento de búsqueda en Search Console'
      ]
    }
  }
}

export default new GoogleVerificationService()