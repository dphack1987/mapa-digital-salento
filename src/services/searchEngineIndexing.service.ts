// Servicio de Indexación Múltiple para Motores de Búsqueda
// Soporta Google, Bing, DuckDuckGo, Yahoo, Baidu, Yandex

interface SearchEngine {
  name: string
  url: string
  webmasterUrl: string
  verificationCode: string | null
  verified: boolean
  sitemapUrl: string
  lastIndexed: string | null
  instructions: string[]
}

class SearchEngineIndexingService {
  private readonly domain = 'https://mapa-digital-salento.vercel.app'
  private readonly brandName = 'Salento a la Mano'
  private readonly sitemapUrl = this.domain + '/sitemap.xml'

  // Códigos de verificación (deben ser reemplazados con los reales)
  private readonly verificationCodes = {
    google: 'googleac76b27847921d06', // Ya configurado
    bing: null, // Pendiente de configuración
    baidu: null, // Opcional
    yandex: null // Opcional
  }

  /**
   * Obtener todos los motores de búsqueda soportados
   */
  getAllSearchEngines(): SearchEngine[] {
    return [
      this.getGoogleConfig(),
      this.getBingConfig(),
      this.getDuckDuckGoConfig(),
      this.getYahooConfig(),
      this.getBaiduConfig(),
      this.getYandexConfig()
    ]
  }

  /**
   * Configuración de Google Search Console
   */
  private getGoogleConfig(): SearchEngine {
    return {
      name: 'Google Search Console',
      url: 'https://search.google.com/search-console',
      webmasterUrl: 'https://search.google.com/search-console',
      verificationCode: this.verificationCodes.google,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. Ya configurado con código: ' + this.verificationCodes.google,
        '2. Meta tag agregado a index.html',
        '3. Archivo de verificación creado en public/',
        '4. Verificar en Google Search Console',
        '5. Enviar sitemap: ' + this.sitemapUrl
      ]
    }
  }

  /**
   * Configuración de Bing Webmaster Tools
   */
  private getBingConfig(): SearchEngine {
    return {
      name: 'Bing Webmaster Tools',
      url: 'https://www.bing.com/webmasters',
      webmasterUrl: 'https://www.bing.com/webmasters/about',
      verificationCode: this.verificationCodes.bing,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. Ve a Bing Webmaster Tools',
        '2. Agrega tu propiedad: ' + this.domain,
        '3. Obtén el código de verificación',
        '4. Implementa uno de los métodos:',
        '   - Meta tag: <meta name="msvalidate.01" content="TU_CODIGO" />',
        '   - Archivo XML: BingSiteAuth.xml',
        '5. Verifica la propiedad',
        '6. Enviar sitemap: ' + this.sitemapUrl
      ]
    }
  }

  /**
   * Configuración de DuckDuckGo
   */
  private getDuckDuckGoConfig(): SearchEngine {
    return {
      name: 'DuckDuckGo',
      url: 'https://duckduckgo.com',
      webmasterUrl: 'https://help.duckduckgo.com/duckduckgo-help-pages/results/submit-website/',
      verificationCode: null,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. DuckDuckGo no requiere verificación específica',
        '2. Envía tu URL: ' + this.domain,
        '3. Asegúrate de tener sitemap.xml configurado',
        '4. DuckDuckGo indexa automáticamente sitios bien optimizados',
        '5. Usa SEO estándar y contenido de calidad'
      ]
    }
  }

  /**
   * Configuración de Yahoo Search
   */
  private getYahooConfig(): SearchEngine {
    return {
      name: 'Yahoo Search',
      url: 'https://search.yahoo.com',
      webmasterUrl: 'https://search.yahoo.com/webmaster-tools',
      verificationCode: null,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. Yahoo usa Bing para sus resultados de búsqueda',
        '2. Configura Bing Webmaster Tools',
        '3. Yahoo indexará automáticamente desde Bing',
        '4. Enviar sitemap: ' + this.sitemapUrl,
        '5. Verificar configuración en Bing'
      ]
    }
  }

  /**
   * Configuración de Baidu (China)
   */
  private getBaiduConfig(): SearchEngine {
    return {
      name: 'Baidu (China)',
      url: 'https://www.baidu.com',
      webmasterUrl: 'https://ziyuan.baidu.com/',
      verificationCode: this.verificationCodes.baidu,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. Ve a Baidu Webmaster Tools (en chino)',
        '2. Agrega tu propiedad: ' + this.domain,
        '3. Obtén el código de verificación',
        '4. Implementa meta tag: <meta name="baidu-site-verification" content="TU_CODIGO" />',
        '5. Verifica la propiedad',
        '6. Enviar sitemap: ' + this.sitemapUrl,
        'Nota: Opcional, solo si tienes audiencia en China'
      ]
    }
  }

  /**
   * Configuración de Yandex (Rusia)
   */
  private getYandexConfig(): SearchEngine {
    return {
      name: 'Yandex (Rusia)',
      url: 'https://yandex.com',
      webmasterUrl: 'https://webmaster.yandex.com/',
      verificationCode: this.verificationCodes.yandex,
      verified: false,
      sitemapUrl: this.sitemapUrl,
      lastIndexed: null,
      instructions: [
        '1. Ve a Yandex Webmaster',
        '2. Agrega tu propiedad: ' + this.domain,
        '3. Obtén el código de verificación',
        '4. Implementa meta tag: <meta name="yandex-verification" content="TU_CODIGO" />',
        '5. Verifica la propiedad',
        '6. Enviar sitemap: ' + this.sitemapUrl,
        'Nota: Opcional, solo si tienes audiencia en Rusia'
      ]
    }
  }

  /**
   * Generar meta tags para todos los motores
   */
  generateAllMetaTags(): string {
    let metaTags = ''

    // Google (ya configurado)
    metaTags += '<meta name="google-site-verification" content="' + this.verificationCodes.google + '" />\n'

    // Bing (pendiente)
    if (this.verificationCodes.bing) {
      metaTags += '<meta name="msvalidate.01" content="' + this.verificationCodes.bing + '" />\n'
    }

    // Baidu (opcional)
    if (this.verificationCodes.baidu) {
      metaTags += '<meta name="baidu-site-verification" content="' + this.verificationCodes.baidu + '" />\n'
    }

    // Yandex (opcional)
    if (this.verificationCodes.yandex) {
      metaTags += '<meta name="yandex-verification" content="' + this.verificationCodes.yandex + '" />\n'
    }

    return metaTags
  }

  /**
   * Generar archivo de verificación para Bing
   */
  generateBingVerificationFile(): {
    fileName: string
    content: string
    instructions: string[]
  } {
    return {
      fileName: 'BingSiteAuth.xml',
      content: '<?xml version="1.0"?>\n'
        + '<users>\n'
        + '  <user>YOUR_BING_VERIFICATION_CODE</user>\n'
        + '</users>',
      instructions: [
        '1. Ve a Bing Webmaster Tools',
        '2. Obtén el código de verificación',
        '3. Reemplaza YOUR_BING_VERIFICATION_CODE con el código real',
        '4. Guarda el archivo como public/BingSiteAuth.xml',
        '5. Despliega en Vercel',
        '6. Verifica en Bing Webmaster Tools'
      ]
    }
  }

  /**
   * Generar robots.txt optimizado para todos los motores
   */
  generateRobotsTxt(): string {
    return '# Robots.txt para ' + this.domain + '\n'
      + '# Generado para ' + this.brandName + '\n'
      + '# Compatible con Google, Bing, DuckDuckGo, Yahoo, Baidu, Yandex\n\n'
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
      + '# Sitemaps para todos los motores\n'
      + 'Sitemap: ' + this.sitemapUrl + '\n'
      + 'Sitemap: ' + this.domain + '/salentoalamano-defensive-sitemap.xml\n\n'
      + '# Crawl-delay para sobrecarga\n'
      + 'Crawl-delay: 1\n\n'
      + '# Google-specific\n'
      + 'User-agent: Googlebot\n'
      + 'Allow: /\n\n'
      + '# Bing-specific\n'
      + 'User-agent: Bingbot\n'
      + 'Allow: /\n\n'
      + '# DuckDuckGo-specific\n'
      + 'User-agent: DuckDuckBot\n'
      + 'Allow: /\n\n'
      + '# Yahoo-specific (usa Bing)\n'
      + 'User-agent: Slurp\n'
      + 'Allow: /\n\n'
      + '# Baidu-specific\n'
      + 'User-agent: Baiduspider\n'
      + 'Allow: /\n\n'
      + '# Yandex-specific\n'
      + 'User-agent: YandexBot\n'
      + 'Allow: /'
  }

  /**
   * Generar instrucciones de envío de sitemap
   */
  generateSitemapSubmissionInstructions(): string {
    return '# Instrucciones de Envío de Sitemap a Motores de Búsqueda\n\n'
      + '## Dominio: ' + this.domain + '\n'
      + '## Sitemap URL: ' + this.sitemapUrl + '\n\n'
      + '## Google Search Console\n'
      + '1. Ve a Google Search Console\n'
      + '2. Selecciona tu propiedad\n'
      + '3. Ve a "Sitemaps"\n'
      + '4. Ingresa: ' + this.sitemapUrl + '\n'
      + '5. Haz clic en "Enviar"\n\n'
      + '## Bing Webmaster Tools\n'
      + '1. Ve a Bing Webmaster Tools\n'
      + '2. Selecciona tu propiedad\n'
      + '3. Ve a "Sitemaps"\n'
      + '4. Ingresa: ' + this.sitemapUrl + '\n'
      + '5. Haz clic en "Enviar"\n\n'
      + '## DuckDuckGo\n'
      + '1. DuckDuckGo no tiene webmaster tools\n'
      + '2. Asegúrate de tener sitemap.xml accesible\n'
      + '3. Envía tu URL: https://duckduckgo.com/duckduckgo-help-pages/results/submit-website/\n\n'
      + '## Yahoo Search\n'
      + '1. Yahoo usa Bing para resultados\n'
      + '2. Enviar sitemap en Bing Webmaster Tools\n'
      + '3. Yahoo indexará automáticamente\n\n'
      + '## Baidu (Opcional)\n'
      + '1. Ve a Baidu Webmaster Tools\n'
      + '2. Selecciona tu propiedad\n'
      + '3. Ve a "Sitemaps"\n'
      + '4. Ingresa: ' + this.sitemapUrl + '\n'
      + '5. Haz clic en "Enviar"\n\n'
      + '## Yandex (Opcional)\n'
      + '1. Ve a Yandex Webmaster\n'
      + '2. Selecciona tu propiedad\n'
      + '3. Ve a "Sitemaps"\n'
      + '4. Ingresa: ' + this.sitemapUrl + '\n'
      + '5. Haz clic en "Enviar"\n\n'
      + '## Recomendaciones\n'
      + '- Enviar sitemap a Google y Bing es suficiente para la mayoría del tráfico\n'
      + '- Baidu y Yandex son opcionales según tu audiencia\n'
      + '- Verificar que el sitemap sea accesible manualmente\n'
      + '- Actualizar sitemap regularmente cuando agregues contenido nuevo'
  }

  /**
   * Obtener estado de indexación actual
   */
  getIndexingStatus(): {
    domain: string
    engines: SearchEngine[]
    totalEngines: number
    verifiedEngines: number
    indexingStatus: string
    recommendations: string[]
  } {
    const engines = this.getAllSearchEngines()
    const verifiedCount = engines.filter(e => e.verified).length

    return {
      domain: this.domain,
      engines: engines,
      totalEngines: engines.length,
      verifiedEngines: verifiedCount,
      indexingStatus: verifiedCount === 0 ? 'No verificado' : verifiedCount === engines.length ? 'Completamente indexado' : 'Parcialmente indexado',
      recommendations: [
        'Configurar Google Search Console (prioridad alta)',
        'Configurar Bing Webmaster Tools (prioridad alta)',
        'Verificar que el sitemap sea accesible',
        'Enviar sitemap a Google y Bing',
        'Monitorear estado de indexación regularmente',
        'Baidu y Yandex son opcionales según audiencia'
      ]
    }
  }
}

export default new SearchEngineIndexingService()