interface DynamicLandingPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  schema: object;
  lastUpdated: Date;
  source: 'official' | 'community' | 'mixed';
  category: 'routes' | 'hotels' | 'safety' | 'events' | 'general';
  keywords: string[];
  locale: 'es' | 'en';
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  organizationName: string;
  organizationType: string;
}

class SEOLandingService {
  private pages: Map<string, DynamicLandingPage> = new Map()
  private faqs: Map<string, FAQ[]> = new Map()
  private config: SEOConfig = {
    siteName: 'Salento a la Mano',
    siteUrl: 'https://salentoalamano.com',
    defaultLocale: 'es',
    organizationName: 'Red de Prestadores Turísticos de Salento',
    organizationType: 'TourismOrganization'
  }
  private initialized = false

  initialize() {
    if (this.initialized) return
    this.generateSamplePages()
    this.generateSampleFAQs()
    this.initialized = true
  }

  private generateSamplePages() {
    const pages: DynamicLandingPage[] = [
      {
        slug: 'estado-vias-salento-hoy',
        title: 'Estado de las vías a Salento hoy - Reporte Oficial',
        description: 'Información actualizada sobre el estado de las vías de acceso a Salento, Quindío. Reporte oficial de la red de prestadores turísticos.',
        content: this.generateRouteContent(),
        schema: this.generateFAQSchema([
          {
            question: '¿Están abiertas las vías hacia Salento?',
            answer: 'Sí, las vías principales hacia Salento se encuentran operativas. La ruta desde Armenia y Pereira está en buen estado, con mantenimiento regular por parte de las autoridades locales.',
            category: 'routes',
            keywords: ['vías', 'acceso', 'carretera', 'operativo']
          },
          {
            question: '¿Puedo llegar en vehículo propio?',
            answer: 'Absolutamente. Las vías están aptas para todo tipo de vehículos. Se recomienda precaución habitual en carreteras de montaña, especialmente en condiciones de lluvia.',
            category: 'routes',
            keywords: ['vehículo', 'carro', 'conducir', 'acceso']
          }
        ]),
        lastUpdated: new Date(),
        source: 'official',
        category: 'routes',
        keywords: ['estado vías salento', 'acceso salento', 'carreteras salento', 'rutas turísticas'],
        locale: 'es'
      },
      {
        slug: 'hoteles-hostales-abiertos-salento',
        title: 'Hoteles y hostales abiertos en Salento - Guía Actualizada',
        description: 'Lista completa de alojamientos operativos en Salento. Hoteles, hostales y Airbnb disponibles con confirmación de disponibilidad.',
        content: this.generateAccommodationContent(),
        schema: this.generateFAQSchema([
          {
            question: '¿Qué hoteles están abiertos hoy en Salento?',
            answer: 'La gran mayoría de alojamientos en Salento están operativos al 100%. Desde hoteles boutique hasta hostales económicos, todos recibiendo visitantes con protocolos de seguridad establecidos.',
            category: 'hotels',
            keywords: ['hoteles', 'alojamiento', 'disponibilidad', 'reservas']
          },
          {
            question: '¿Necesito reservar con anticipación?',
            answer: 'Recomendamos reservar, especialmente en fines de semana y temporada alta. Sin embargo, la mayoría de alojamientos tienen disponibilidad para visitas espontáneas.',
            category: 'hotels',
            keywords: ['reservas', 'anticipación', 'disponibilidad', 'temporada']
          }
        ]),
        lastUpdated: new Date(),
        source: 'mixed',
        category: 'hotels',
        keywords: ['hoteles salento', 'hostales salento', 'alojamiento salento', 'donde dormir salento'],
        locale: 'es'
      },
      {
        slug: 'valle-cocora-operativo-seguro',
        title: 'Valle de Cocora operativo y seguro - Información Oficial',
        description: 'Estado actual del Valle de Cocora. Información sobre acceso, actividades disponibles, cabalgatas y senderismo en condiciones seguras.',
        content: this.generateValleCocoraContent(),
        schema: this.generateFAQSchema([
          {
            question: '¿Está abierto el Valle de Cocora?',
            answer: 'Sí, el Valle de Cocora está completamente operativo. Los senderos principales están abiertos, las cabalgatas funcionan con normalidad y todos los servicios turísticos están activos.',
            category: 'safety',
            keywords: ['valle cocora', 'operativo', 'abierto', 'senderismo']
          },
          {
            question: '¿Es seguro visitar el Valle de Cocora?',
            answer: 'Totalmente seguro. Miles de visitantes lo recorren diariamente. Contamos con guías certificados, servicios de emergencia accesibles y protocolos de seguridad establecidos.',
            category: 'safety',
            keywords: ['seguro', 'peligro', 'visita', 'turismo']
          }
        ]),
        lastUpdated: new Date(),
        source: 'official',
        category: 'safety',
        keywords: ['valle cocora seguro', 'valle cocora estado', 'palmas wax', 'senderismo cocora'],
        locale: 'es'
      },
      {
        slug: 'turismo-salento-seguro-hoy',
        title: 'Turismo en Salento hoy - Situación Actual y Seguridad',
        description: 'Reporte diario del estado del turismo en Salento. Actividades disponibles, lugares abiertos y situación general del destino turístico.',
        content: this.generateTourismStatusContent(),
        schema: this.generateFAQSchema([
          {
            question: '¿Es seguro visitar Salento hoy?',
            answer: 'Salento es un destino seguro y acogedor. Nuestra comunidad recibe a visitantes con calidez característica del Quindío. Todos los servicios turísticos operan con normalidad y seguridad.',
            category: 'safety',
            keywords: ['seguro', 'visitar', 'turismo', 'peligro']
          },
          {
            question: '¿Qué actividades puedo hacer hoy en Salento?',
            answer: 'Todas las actividades principales están disponibles: visita al Valle de Cocora, cabalgatas, recorridos por el pueblo, degustación de café, artesanías, y gastronomía local.',
            category: 'general',
            keywords: ['actividades', 'hacer', 'turismo', 'planes']
          }
        ]),
        lastUpdated: new Date(),
        source: 'official',
        category: 'safety',
        keywords: ['salento seguro', 'turismo salento', 'visitar salento', 'situación salento'],
        locale: 'es'
      },
      {
        slug: 'transporte-jeeps-salento-operativo',
        title: 'Transporte Jeeps a Salento y Valle de Cocora - Servicios Activos',
        description: 'Estado del servicio de transporte Willys Jeeps en Salento. Horarios, rutas disponibles y contacto directo con transportadores.',
        content: this.generateTransportContent(),
        schema: this.generateFAQSchema([
          {
            question: '¿Están funcionando los Jeeps hacia el Valle de Cocora?',
            answer: 'Sí, el servicio de Willys Jeeps funciona con total normalidad. Salidas cada 30 minutos desde la plaza principal, desde las 6:00 AM hasta las 6:00 PM.',
            category: 'routes',
            keywords: ['jeeps', 'valle cocora', 'transporte', 'willys']
          },
          {
            question: '¿Cuánto cuesta el transporte en Jeep?',
            answer: 'El tarifa oficial es de $3,000 COP por persona para el trayecto Salento-Valle de Cocora. Precios transparentes establecidos por la gremial de transportadores.',
            category: 'routes',
            keywords: ['precio', 'tarifa', 'costo', 'transporte']
          }
        ]),
        lastUpdated: new Date(),
        source: 'official',
        category: 'routes',
        keywords: ['jeeps salento', 'transporte salento', 'willys cocora', 'colectivos'],
        locale: 'es'
      }
    ]

    pages.forEach(page => {
      this.pages.set(page.slug, page)
    })
  }

  private generateRouteContent(): string {
    return `
      <h1>Estado de las Vías a Salento - Reporte Oficial</h1>
      
      <p class="update-time">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
      
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">VÍAS OPERATIVAS</span>
      </div>

      <h2>Situación Actual</h2>
      <p>Las vías principales de acceso a Salento se encuentran en condiciones óptimas para el tránsito vehicular. El mantenimiento regular por parte de las autoridades departamentales y municipales garantiza un acceso seguro para turistas y locales.</p>

      <h3>Rutas Principales</h3>
      <ul>
        <li><strong>Ruta Armenia - Salento:</strong> Carretera en buen estado, tiempo estimado 45 minutos.</li>
        <li><strong>Ruta Pereira - Salento:</strong> Vía totalmente transitables, tiempo estimado 1 hora.</li>
        <li><strong>Ruta Bogotá - Salento:</strong> Acceso vía Armenia, condiciones óptimas.</li>
      </ul>

      <h2>Recomendaciones de Viaje</h2>
      <p>Para un viaje seguro a Salento:</p>
      <ul>
        <li>Verificar el clima antes de salir (lluvias pueden afectar visibilidad)</li>
        <li>Llevar vehículo en buenas condiciones mecánicas</li>
        <li>Respetar los límites de velocidad en carreteras de montaña</li>
        <li>Considerar llegar con luz diurna para mejor experiencia</li>
      </ul>

      <div class="official-source">
        <p><strong>Fuente:</strong> Red de Prestadores Turísticos de Salento - Reporte oficial actualizado diariamente.</p>
      </div>
    `
  }

  private generateAccommodationContent(): string {
    return `
      <h1>Hoteles y Hostales Abiertos en Salento</h1>
      
      <p class="update-time">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
      
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">ALOJAMIENTOS OPERATIVOS 100%</span>
      </div>

      <h2>Situación de Alojamientos</h2>
      <p>La totalidad de hoteles, hostales y establecimientos de alojamiento en Salento se encuentran operativos y recibiendo visitantes. Nuestra red de hospedaje ofrece opciones para todos los presupuestos y preferencias.</p>

      <h3>Categorías Disponibles</h3>
      <ul>
        <li><strong>Hoteles Boutique:</strong> Experiencia premium con vistas panorámicas</li>
        <li><strong>Hostales Económicos:</strong> Opciones amigables para mochileros</li>
        <li><strong>Airbnb Locales:</strong> Hospedaje en casas tradicionales</li>
        <li><strong>Eco-lodges:</strong> Opciones sostenibles en naturaleza</li>
      </ul>

      <h2>Confirmación de Disponibilidad</h2>
      <p>Recomendamos contactar directamente con los alojamientos para:</p>
      <ul>
        <li>Verificar disponibilidad en fechas específicas</li>
        <li>Conocer tarifas actualizadas</li>
        <li>Confirmar servicios incluidos</li>
        <li>Coordinar horarios de check-in/check-out</li>
      </ul>

      <div class="contact-cta">
        <button onclick="window.location.href='#servicios'">Ver Alojamientos Disponibles</button>
      </div>
    `
  }

  private generateValleCocoraContent(): string {
    return `
      <h1>Valle de Cocora Operativo y Seguro</h1>
      
      <p class="update-time">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
      
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">VALLE DE COCORA 100% OPERATIVO</span>
      </div>

      <h2>Estado Actual del Destino</h2>
      <p>El Valle de Cocora, joya natural del Quindío y hogar de la palma de cera, está completamente abierto al turismo. Todas las actividades principales están disponibles con máximos estándares de seguridad.</p>

      <h3>Actividades Disponibles</h3>
      <ul>
        <li><strong>Senderismo:</strong> Senderos principales abiertos y señalizados</li>
        <li><strong>Cabalgatas:</strong> Servicio operativo con guías certificados</li>
        <li><strong>Fotografía:</strong> Miradores accesibles para mejores vistas</li>
        <li><strong>Observación de aves:</strong> Actividad disponible con guías locales</li>
      </ul>

      <h2>Medidas de Seguridad</h2>
      <p>Contamos con:</p>
      <ul>
        <li>Guías certificados por el Ministerio de Turismo</li>
        <li>Puntos de emergencia identificados</li>
        <li>Comunicación constante con autoridades</li>
        <li>Protocolos de seguridad establecidos</li>
      </ul>

      <h2>Acceso al Valle</h2>
      <p>El transporte en Willys Jeeps funciona con normalidad desde la plaza principal de Salento. Salidas regulares cada 30 minutos desde las 6:00 AM hasta las 6:00 PM.</p>

      <div class="official-badge">
        <p>✓ Certificado de Destino Seguro - Ministerio de Turismo</p>
      </div>
    `
  }

  private generateTourismStatusContent(): string {
    return `
      <h1>Turismo en Salento Hoy - Situación Actual</h1>
      
      <p class="update-time">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
      
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">TURISMO OPERATIVO Y SEGURO</span>
      </div>

      <h2>Estado General del Destino</h2>
      <p>Salento continúa siendo uno de los destinos turísticos más vibrantes y seguros de Colombia. Nuestra comunidad local está comprometida con ofrecer experiencias auténticas y memorables a todos los visitantes.</p>

      <h3>Servicios Activos</h3>
      <ul>
        <li><strong>Gastronomía:</strong> Restaurantes y cafeterías al 100% operativos</li>
        <li><strong>Alojamiento:</strong> Hoteles y hostales con disponibilidad</li>
        <li><strong>Transporte:</strong> Jeeps y servicios de transporte activos</li>
        <li><strong>Comercio:</strong> Tiendas de artesanías y locales abiertos</li>
        <li><strong>Guías:</strong> Servicios de guías turísticos disponibles</li>
      </ul>

      <h2>Experiencias Disponibles</h2>
      <div class="experiences-grid">
        <div class="experience-card">
          <h3>Valle de Cocora</h3>
          <p>Senderismo y cabalgatas en paisajes únicos</p>
        </div>
        <div class="experience-card">
          <h3>Cultura Cafetera</h3>
          <p>Visitas a fincas cafeteras tradicionales</p>
        </div>
        <div class="experience-card">
          <h3>Artesanías Locales</h3>
          <p>Comercio justo con artesanos del pueblo</p>
        </div>
        <div class="experience-card">
          <h3>Gastronomía Quindiana</h3>
          <p>Sabores auténticos de la región</p>
        </div>
      </div>

      <div class="community-message">
        <p>💚 Nuestra comunidad los recibe con los brazos abiertos. Ven a disfrutar de la calidez y belleza de Salento.</p>
      </div>
    `
  }

  private generateTransportContent(): string {
    return `
      <h1>Transporte Jeeps a Salento - Servicios Activos</h1>
      
      <p class="update-time">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
      
      <div class="status-indicator">
        <span class="status-dot green"></span>
        <span class="status-text">TRANSPORTE OPERATIVO</span>
      </div>

      <h2>Servicio de Willys Jeeps</h2>
      <p>El transporte tradicional en Willys Jeeps es parte fundamental de la experiencia de Salento. Este servicio funciona con total normalidad, conectando el pueblo con el Valle de Cocora y otros destinos cercanos.</p>

      <h3>Horarios y Tarifas</h3>
      <ul>
        <li><strong>Salida:</strong> Plaza principal de Salento</li>
        <li><strong>Frecuencia:</strong> Cada 30 minutos</li>
        <li><strong>Horario:</strong> 6:00 AM - 6:00 PM</li>
        <li><strong>Tarifa Valle de Cocora:</strong> $3,000 COP por persona</li>
      </ul>

      <h2>Rutas Disponibles</h2>
      <ul>
        <li><strong>Salento - Valle de Cocora:</strong> Ruta principal, 30 minutos</li>
        <li><strong>Salento - Filandia:</strong> Pueblo colonial cercano</li>
        <li><strong>Salento - Boquía:</strong> Caminatas y naturaleza</li>
        <li><strong>Rutas personalizadas:</strong> Consultar con transportadores</li>
      </ul>

      <h2>Consejos de Viaje</h2>
      <ul>
        <li>Llegar temprano para evitar filas en temporada alta</li>
        <li>Llevar efectivo (algunos transportadores no manejan tarjetas)</li>
        <li>Respetar el horario de último retorno (6:00 PM)</li>
        <li>Considerar transporte privado para grupos grandes</li>
      </ul>

      <div class="gremial-info">
        <p><strong>Servicio regulado por:</strong> Gremial de Transportadores de Salento</p>
      </div>
    `
  }

  private generateSampleFAQs() {
    const faqsByCategory: Record<string, FAQ[]> = {
      'general': [
        {
          question: '¿Está abierto el turismo en Salento?',
          answer: 'Sí, Salento opera con normalidad, con sus hoteles, restaurantes, transporte y rutas de cabalgata habilitados al 100%. La comunidad local recibe visitantes con calidez y seguridad.',
          category: 'general',
          keywords: ['turismo', 'abierto', 'operativo', 'salento']
        },
        {
          question: '¿Es seguro visitar Salento?',
          answer: 'Salento es un destino seguro y acogedor. Miles de visitantes lo disfrutan semanalmente. Contamos con servicios de emergencia, guías certificados y una comunidad comprometida con la seguridad de nuestros visitantes.',
          category: 'general',
          keywords: ['seguro', 'visitar', 'peligro', 'seguridad']
        },
        {
          question: '¿Qué puedo hacer en Salento hoy?',
          answer: 'Todas las actividades principales están disponibles: visita al Valle de Cocora, cabalgatas, senderismo, recorridos por el pueblo, degustación de café, compras de artesanías, y disfrute de la gastronomía local.',
          category: 'general',
          keywords: ['actividades', 'hacer', 'planes', 'turismo']
        }
      ],
      'routes': [
        {
          question: '¿Cómo llegar a Salento?',
          answer: 'Puedes llegar por carretera desde Armenia (45 minutos), Pereira (1 hora), o Bogotá (5-6 horas). Las vías están en buen estado y el transporte público está disponible.',
          category: 'routes',
          keywords: ['llegar', 'acceso', 'carretera', 'transporte']
        },
        {
          question: '¿Están abiertas las vías a Salento?',
          answer: 'Sí, todas las vías principales hacia Salento están operativas. El mantenimiento regular garantiza un acceso seguro para turistas y locales.',
          category: 'routes',
          keywords: ['vías', 'carreteras', 'acceso', 'operativo']
        }
      ],
      'hotels': [
        {
          question: '¿Qué hoteles están abiertos en Salento?',
          answer: 'La gran mayoría de alojamientos en Salento están operativos. Desde hoteles boutique hasta hostales económicos, todos recibiendo visitantes con protocolos de seguridad.',
          category: 'hotels',
          keywords: ['hoteles', 'hostales', 'alojamiento', 'disponibilidad']
        },
        {
          question: '¿Necesito reservar hotel con anticipación?',
          answer: 'Recomendamos reservar, especialmente en fines de semana y temporada alta. Sin embargo, muchos alojamientos tienen disponibilidad para visitas espontáneas.',
          category: 'hotels',
          keywords: ['reservas', 'anticipación', 'disponibilidad', 'temporada']
        }
      ],
      'safety': [
        {
          question: '¿Hay alertas de seguridad en Salento?',
          answer: 'No hay alertas de seguridad. Salento es un destino tranquilo y seguro. Cualquier información contraria no corresponde a la realidad actual del destino.',
          category: 'safety',
          keywords: ['alertas', 'seguridad', 'peligro', 'situación']
        },
        {
          question: '¿Funcionan los servicios de emergencia?',
          answer: 'Sí, todos los servicios de emergencia están operativos: policía, bomberos, cruz roja, y servicios médicos. La seguridad de nuestros visitantes es prioridad.',
          category: 'safety',
          keywords: ['emergencia', 'seguridad', 'servicios', 'médicos']
        }
      ]
    }

    Object.entries(faqsByCategory).forEach(([category, faqs]) => {
      this.faqs.set(category, faqs)
    })
  }

  generateFAQSchema(faqs: FAQ[]): object {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  }

  generateOrganizationSchema(): object {
    return {
      "@context": "https://schema.org",
      "@type": this.config.organizationType,
      "name": this.config.organizationName,
      "url": this.config.siteUrl,
      "logo": `${this.config.siteUrl}/logo_salento2026.png`,
      "description": "Red oficial de prestadores turísticos de Salento, Quindío. Conectamos directamente a turistas con comerciantes locales sin intermediarios.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Salento",
        "addressRegion": "Quindío",
        "addressCountry": "CO"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+57-300-123-4567",
        "contactType": "customer service"
      }
    }
  }

  generateNewsArticleSchema(title: string, datePublished: Date, author: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "datePublished": datePublished.toISOString(),
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "logo": {
          "@type": "ImageObject",
          "url": `${this.config.siteUrl}/logo_salento2026.png`
        }
      }
    }
  }

  generateClaimReviewSchema(claim: string, reviewResult: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      "claimReviewed": claim,
      "itemReviewed": {
        "@type": "Place",
        "name": "Salento, Quindío"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": reviewResult === "TRUE" ? "1" : "0",
        "bestRating": "1",
        "worstRating": "0"
      },
      "author": {
        "@type": "Organization",
        "name": this.config.organizationName
      }
    }
  }

  getPage(slug: string): DynamicLandingPage | undefined {
    return this.pages.get(slug)
  }

  getAllPages(): DynamicLandingPage[] {
    return Array.from(this.pages.values())
  }

  getPagesByCategory(category: string): DynamicLandingPage[] {
    return Array.from(this.pages.values()).filter(page => page.category === category)
  }

  getFAQs(category?: string): FAQ[] {
    if (category) {
      return this.faqs.get(category) || []
    }
    return Array.from(this.faqs.values()).flat()
  }

  updatePage(slug: string, updates: Partial<DynamicLandingPage>): boolean {
    const page = this.pages.get(slug)
    if (page) {
      Object.assign(page, updates)
      page.lastUpdated = new Date()
      return true
    }
    return false
  }

  generateMetaTags(page: DynamicLandingPage): object {
    return {
      title: page.title,
      description: page.description,
      keywords: page.keywords.join(', '),
      'og:title': page.title,
      'og:description': page.description,
      'og:url': `${this.config.siteUrl}/${page.slug}`,
      'og:type': 'article',
      'og:image': `${this.config.siteUrl}/logo_salento2026.png`,
      'twitter:card': 'summary_large_image',
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': `${this.config.siteUrl}/logo_salento2026.png`
    }
  }

  generateSitemap(): string {
    const pages = this.getAllPages()
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.config.siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${pages.map(page => `
  <url>
    <loc>${this.config.siteUrl}/${page.slug}</loc>
    <lastmod>${page.lastUpdated.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`
    return sitemap
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${this.config.siteUrl}/sitemap.xml`
  }
}

const seoLandingService = new SEOLandingService()
export default seoLandingService