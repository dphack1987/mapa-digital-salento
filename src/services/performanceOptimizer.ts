// Servicio de optimización de performance y Core Web Vitals
// Monitorea y optimiza métricas clave de rendimiento web

interface PerformanceMetrics {
  LCP: number // Largest Contentful Paint
  FID: number // First Input Delay
  CLS: number // Cumulative Layout Shift
  FCP: number // First Contentful Paint
  TTFB: number // Time to First Byte
  INP: number // Interaction to Next Paint
}

interface PerformanceThresholds {
  good: number
  needsImprovement: number
  poor: number
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    LCP: 0,
    FID: 0,
    CLS: 0,
    FCP: 0,
    TTFB: 0,
    INP: 0
  }

  private thresholds: Record<keyof PerformanceMetrics, PerformanceThresholds> = {
    LCP: { good: 2500, needsImprovement: 4000, poor: Infinity },
    FID: { good: 100, needsImprovement: 300, poor: Infinity },
    CLS: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
    FCP: { good: 1800, needsImprovement: 3000, poor: Infinity },
    TTFB: { good: 800, needsImprovement: 1800, poor: Infinity },
    INP: { good: 200, needsImprovement: 500, poor: Infinity }
  }

  private observers: any[] = []
  private initialized = false

  /**
   * Inicializar el monitoreo de performance
   */
  initialize() {
    if (this.initialized || typeof window === 'undefined') return

    this.initialized = true
    this.setupLCP()
    this.setupFID()
    this.setupCLS()
    this.setupFCP()
    this.setupTTFB()
    this.setupINP()
    this.setupResourceTiming()
  }

  /**
   * Largest Contentful Paint - Métrica principal de carga
   */
  private setupLCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list: any) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.LCP = lastEntry.startTime
        this.logMetric('LCP', this.metrics.LCP)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('LCP observer not supported')
    }
  }

  /**
   * First Input Delay - Interactividad de la página
   */
  private setupFID() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list: any) => {
        const entries = list.getEntries()
        const firstInput = entries[0]
        this.metrics.FID = firstInput.processingStart - firstInput.startTime
        this.logMetric('FID', this.metrics.FID)
      })
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('FID observer not supported')
    }
  }

  /**
   * Cumulative Layout Shift - Estabilidad visual
   */
  private setupCLS() {
    if (!('PerformanceObserver' in window)) return

    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        this.metrics.CLS = clsValue
        this.logMetric('CLS', this.metrics.CLS)
      })
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('CLS observer not supported')
    }
  }

  /**
   * First Contentful Paint - Primer contenido pintado
   */
  private setupFCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list: any) => {
        const entries = list.getEntries()
        const firstContentfulPaint = entries[0]
        this.metrics.FCP = firstContentfulPaint.startTime
        this.logMetric('FCP', this.metrics.FCP)
      })
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('FCP observer not supported')
    }
  }

  /**
   * Time to First Byte - Tiempo de respuesta del servidor
   */
  private setupTTFB() {
    if (typeof performance === 'undefined' || !performance.timing) return

    const navigation = performance.getEntriesByType('navigation')[0] as any
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart
      this.logMetric('TTFB', this.metrics.TTFB)
    }
  }

  /**
   * Interaction to Next Paint - Responsividad de interacciones
   */
  private setupINP() {
    if (!('PerformanceObserver' in window)) return

    try {
      let inpValue = 0
      const observer = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          inpValue = Math.max(inpValue, entry.duration)
        }
        this.metrics.INP = inpValue
        this.logMetric('INP', this.metrics.INP)
      })
      observer.observe({ entryTypes: ['event'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('INP observer not supported')
    }
  }

  /**
   * Monitorear tiempos de recursos
   */
  private setupResourceTiming() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list: any) => {
        const resources = list.getEntries()
        const slowResources = resources.filter((r: any) => r.duration > 1000)
        
        if (slowResources.length > 0) {
          console.warn('Slow resources detected:', slowResources.map((r: any) => ({
            name: r.name,
            duration: r.duration,
            size: r.transferSize
          })))
        }
      })
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('Resource timing observer not supported')
    }
  }

  /**
   * Evaluar el estado de una métrica
   */
  private evaluateMetric(metricName: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metricName]
    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Registrar métrica en consola
   */
  private logMetric(name: keyof PerformanceMetrics, value: number) {
    const status = this.evaluateMetric(name, value)
    const emoji = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌'
    console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${status})`)
  }

  /**
   * Obtener todas las métricas actuales
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Obtener evaluación general de performance
   */
  getPerformanceScore(): {
    overall: 'good' | 'needs-improvement' | 'poor'
    metrics: Record<keyof PerformanceMetrics, 'good' | 'needs-improvement' | 'poor'>
    recommendations: string[]
  } {
    const evaluation: any = {}
    let poorCount = 0
    let needsImprovementCount = 0

    for (const [key, value] of Object.entries(this.metrics)) {
      evaluation[key] = this.evaluateMetric(key as keyof PerformanceMetrics, value)
      if (evaluation[key] === 'poor') poorCount++
      if (evaluation[key] === 'needs-improvement') needsImprovementCount++
    }

    const overall = poorCount > 0 ? 'poor' : needsImprovementCount > 2 ? 'needs-improvement' : 'good'

    const recommendations = this.generateRecommendations(evaluation)

    return {
      overall,
      metrics: evaluation,
      recommendations
    }
  }

  /**
   * Generar recomendaciones basadas en métricas
   */
  private generateRecommendations(evaluation: any): string[] {
    const recommendations: string[] = []

    if (evaluation.LCP === 'poor' || evaluation.LCP === 'needs-improvement') {
      recommendations.push('Optimizar imágenes - usar WebP y lazy loading')
      recommendations.push('Reducir JavaScript blocking')
      recommendations.push('Implementar preloading de recursos críticos')
    }

    if (evaluation.FID === 'poor' || evaluation.FID === 'needs-improvement') {
      recommendations.push('Reducir tiempo de ejecución de JavaScript')
      recommendations.push('Dividir código largo en chunks más pequeños')
      recommendations.push('Usar web workers para tareas pesadas')
    }

    if (evaluation.CLS === 'poor' || evaluation.CLS === 'needs-improvement') {
      recommendations.push('Reservar espacio para imágenes y iframes')
      recommendations.push('Evitar inyección de contenido dinámico arriba del fold')
      recommendations.push('Usar transformaciones CSS en lugar de propiedades que causan layout shift')
    }

    if (evaluation.TTFB === 'poor' || evaluation.TTFB === 'needs-improvement') {
      recommendations.push('Optimizar tiempo de respuesta del servidor')
      recommendations.push('Usar CDN para contenido estático')
      recommendations.push('Implementar caché del lado del servidor')
    }

    if (evaluation.INP === 'poor' || evaluation.INP === 'needs-improvement') {
      recommendations.push('Optimizar event handlers')
      recommendations.push('Reducir tiempo de ejecución de callbacks')
      recommendations.push('Usar requestIdleCallback para tareas no críticas')
    }

    return recommendations
  }

  /**
   * Optimizar carga de imágenes con lazy loading
   */
  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }

  /**
   * Preload de recursos críticos
   */
  preloadCriticalResources() {
    const criticalResources = [
      // Logo principal
      '/logo_salento2026.png',
      // Estilos críticos
      '/assets/index-*.css',
      // Fuentes principales
      // 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.css') ? 'style' : 'image'
      document.head.appendChild(link)
    })
  }

  /**
   * Implementar defer de JavaScript no crítico
   */
  deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script:not([defer]):not([async])')
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src
      if (src && !src.includes('critical')) {
        script.setAttribute('defer', '')
      }
    })
  }

  /**
   * Limpiar observers cuando ya no se necesiten
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.initialized = false
  }

  /**
   * Ejecutar optimizaciones automáticas
   */
  runAutoOptimizations() {
    this.setupLazyLoading()
    this.preloadCriticalResources()
    this.deferNonCriticalJS()
  }
}

// Exportar instancia singleton
export const performanceOptimizer = new PerformanceOptimizer()
export default performanceOptimizer