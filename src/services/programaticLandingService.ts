/**
 * Servicio de Generación de Landing Pages Programáticas
 * Sistema para crear páginas SEO optimizadas para keywords relacionadas con Salento
 */

interface LandingPageConfig {
  slug: string
  keywords: string[]
  title: string
  description: string
  h1: string
  content: LandingPageContent
  meta: MetaTags
}

interface LandingPageContent {
  hero: HeroSection
  sections: ContentSection[]
  cta: CallToAction
  faq: FAQSection
  related: RelatedPages
}

interface HeroSection {
  title: string
  subtitle: string
  image: string
  cta: string
}

interface ContentSection {
  heading: string
  content: string
  subsections?: SubSection[]
}

interface SubSection {
  heading: string
  content: string
}

interface CallToAction {
  primary: string
  secondary: string
  whatsapp: boolean
}

interface FAQSection {
  items: Array<{
    question: string
    answer: string
  }>
}

interface RelatedPages {
  title: string
  pages: Array<{
    title: string
    url: string
    description: string
  }>
}

interface MetaTags {
  keywords: string[]
  canonical: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
}

class ProgrammaticLandingService {
  private static instance: ProgrammaticLandingService
  private landingPages: Map<string, LandingPageConfig> = new Map()

  private constructor() {
    this.initializeLandingPages()
  }

  static getInstance(): ProgrammaticLandingService {
    if (!ProgrammaticLandingService.instance) {
      ProgrammaticLandingService.instance = new ProgrammaticLandingService()
    }
    return ProgrammaticLandingService.instance
  }

  private initializeLandingPages(): void {
    // Landing Page Principal: Salento
    this.landingPages.set('salento', {
      slug: 'salento',
      keywords: ['salento', 'salento quindio', 'salento colombia', 'turismo salento', 'viajar a salento'],
      title: 'Salento a la Mano | La guía definitiva de Salento, Quindío 2026',
      description: 'Descubre Salento, Quindío con Salento a la Mano: hoteles, Valle de Cocora, coffee tours, gastronomía y experiencias locales. Guía turística #1 de Salento.',
      h1: 'Salento a la Mano: Tu guía definitiva de Salento, Quindío',
      content: {
        hero: {
          title: 'Salento a la Mano',
          subtitle: 'La guía turística oficial de Salento, Quindío 2026',
          image: '/imagenes-salento/1326163558.webp',
          cta: 'Explorar Salento'
        },
        sections: [
          {
            heading: 'Descubre Salento, el corazón del Eje Cafetero',
            content: 'Salento es uno de los destinos más emblemáticos de Colombia, ubicado en el departamento del Quindío. Conocido por su arquitectura tradicional colorida, el majestuoso Valle de Cocora con sus palmas de cera, fincas cafeteras auténticas y una rica cultura paisa, Salento ofrece experiencias únicas para viajeros de todo el mundo.',
            subsections: [
              {
                heading: 'Ubicación y acceso',
                content: 'Salento se encuentra a 24 km de Armenia, capital del Quindío. Es accesible por carretera desde las principales ciudades del Eje Cafetero: Armenia (30 minutos), Pereira (45 minutos) y Manizales (1 hora).'
              },
              {
                heading: 'Clima y mejor época para visitar',
                content: 'El clima de Salento es templado con temperaturas entre 16°C y 24°C durante todo el año. La mejor época para visitar es de diciembre a marzo (temporada seca) y julio-agosto (verano).'
              }
            ]
          },
          {
            heading: '3 razones principales para visitar Salento',
            content: 'Salento combina naturaleza, cultura y experiencias auténticas que lo hacen único en Colombia.',
            subsections: [
              {
                heading: 'Valle de Cocora y sus palmas de cera',
                content: 'El Valle de Cocora es hogar de la palma de cera, árbol nacional de Colombia, que puede alcanzar hasta 60 metros de altura. Es uno de los paisajes más espectaculares del país.'
              },
              {
                heading: 'Cultura cafetera auténtica',
                content: 'Visita fincas cafeteras tradicionales donde aprenderás sobre el proceso del café desde la planta hasta la taza, con degustaciones incluidas.'
              },
              {
                heading: 'Arquitectura y gastronomía tradicional',
                content: 'Las casas coloridas de Salento con balcones decorados, la Calle Real y platos típicos como la trucha con patacón son parte de la experiencia cultural única.'
              }
            ]
          },
          {
            heading: 'Atracciones principales de Salento',
            content: 'Salento ofrece una variedad de atracciones para todos los gustos y presupuestos.',
            subsections: [
              {
                heading: 'Valle de Cocora',
                content: 'Senderismo, fotografía de palmas de cera, cabalgatas y paisajes espectaculares. El sendero principal es de acceso libre y toma 2-4 horas completarlo.'
              },
              {
                heading: 'Calle Real y Plaza de Bolívar',
                content: 'El corazón histórico de Salento con arquitectura tradicional, tiendas de artesanías, cafés y ambiente local auténtico.'
              },
              {
                heading: 'Mirador Alto de la Cruz',
                content: 'Vistas panorámicas de Salento y los valles circundantes. Caminata de 30-45 minutos desde el centro del pueblo.'
              },
              {
                heading: 'Coffee Tours',
                content: 'Fincas cafeteras como Finca Don Elías y Finca Don Eduardo ofrecen tours educativos con degustación de café.'
              }
            ]
          },
          {
            heading: 'Hoteles destacados en Salento',
            content: 'Salento ofrece opciones de alojamiento para todos los presupuestos, desde hoteles boutique hasta fincas cafeteras rurales.',
            subsections: [
              {
                heading: 'Hotel Camino Nacional Salento',
                content: 'Ubicación central en la Calle Real, ideal para explorar el pueblo. Hotel 2 estrellas con habitaciones confortables y seguridad 24 horas.'
              },
              {
                heading: 'Boki Mall - Hotel El Mirador de Boquía',
                content: 'Complejo turístico premium en Boquía con hotel, restaurante, café y experiencias locales. Premio al mejor hotel rural 2024.'
              },
              {
                heading: 'Finca Hotel El Ocaso',
                content: 'Experiencia rural auténtica en entorno cafetero, a 10-15 minutos del centro. Habitaciones con vistas panorámicas y desayuno tradicional incluido.'
              }
            ]
          },
          {
            heading: 'Restaurantes recomendados en Salento',
            content: 'La gastronomía de Salento se centra en la trucha arcoíris y el patacón, platos típicos de la región.',
            subsections: [
              {
                heading: 'Trucha con patacón',
                content: 'El plato insignia de Salento. Trucha arcoíris criada en aguas locales, servida con patacón, ensalada y arepa.'
              },
              {
                heading: 'Restaurantes destacados',
                content: 'Restaurantes como El Rincón de Lucy y diversos locales en la Calle Real ofrecen trucha y platos tradicionales con vistas panorámicas.'
              }
            ]
          },
          {
            heading: 'Cómo llegar a Salento',
            content: 'Existen varias opciones para llegar a Salento desde diferentes puntos de Colombia.',
            subsections: [
              {
                heading: 'Desde Bogotá',
                content: 'Vuelo a Armenia (1 hora) + transporte terrestre (30 minutos) o viaje en bus directo (6-7 horas).'
              },
              {
                heading: 'Desde Medellín',
                content: 'Vuelo a Pereira (30 minutos) + transporte terrestre (45 minutos) o viaje en bus directo (4-5 horas).'
              },
              {
                heading: 'Desde Cali',
                content: 'Viaje en bus directo (5-6 horas) o vuelo a Armenia + transporte terrestre.'
              }
            ]
          }
        ],
        cta: {
          primary: 'Explorar hoteles en Salento',
          secondary: 'Ver experiencias turísticas',
          whatsapp: true
        },
        faq: {
          items: [
            {
              question: '¿Cuál es la mejor época para visitar Salento?',
              answer: 'La mejor época es de diciembre a marzo (temporada seca) y julio-agosto (verano). Sin embargo, Salento puede visitarse durante todo el año gracias a su clima templado.'
            },
            {
              question: '¿Cuánto tiempo necesito para visitar Salento?',
              answer: 'Mínimo 2 días para explorar el pueblo y el Valle de Cocora. Idealmente 3-4 días para disfrutar de coffee tours, otros senderos y experiencias locales.'
            },
            {
              question: '¿Es seguro visitar Salento?',
              answer: 'Salento es considerado un destino seguro para turistas. Es un pueblo turístico bien establecido con infraestructura adecuada y comunidad local acogedora.'
            },
            {
              question: '¿Cuánto cuesta un viaje a Salento?',
              answer: 'Presupuesto aproximado por persona por día: $50-80 USD para alojamiento medio, comida y transporte. Actividades adicionales como coffee tours ($15-25 USD) y cabalgatas ($30-50 USD).'
            },
            {
              question: '¿Necesito guía para el Valle de Cocora?',
              answer: 'El sendero principal del Valle de Cocora es de acceso libre y puede hacerse sin guía. Sin embargo, se recomienda guía para rutas más largas, cabalgatas y para aprender sobre la flora y fauna local.'
            }
          ]
        },
        related: {
          title: 'Páginas relacionadas con Salento',
          pages: [
            {
              title: 'Turismo en Salento',
              url: '/salento-turismo/',
              description: 'Guía completa de turismo, tours y experiencias en Salento'
            },
            {
              title: 'Hoteles en Salento',
              url: '/hoteles-en-salento/',
              description: 'Encuentra los mejores alojamientos y reservas directas'
            },
            {
              title: 'Valle de Cocora',
              url: '/valle-de-cocora-salento/',
              description: 'Guía completa del Valle de Cocora y sus palmas de cera'
            },
            {
              title: 'Qué hacer en Salento',
              url: '/que-hacer-en-salento/',
              description: '50+ actividades y experiencias para tu viaje perfecto'
            }
          ]
        }
      },
      meta: {
        keywords: ['salento', 'salento quindio', 'salento colombia', 'turismo salento', 'viajar a salento', 'guia salento', 'salento turismo'],
        canonical: 'https://salentoalamano.com/salento/',
        ogTitle: 'Salento a la Mano | La guía definitiva de Salento, Quindío',
        ogDescription: 'Descubre Salento, Quindío con Salento a la Mano: hoteles, Valle de Cocora, coffee tours, gastronomía y experiencias locales.',
        ogImage: 'https://salentoalamano.com/imagenes-salento/1326163558.webp',
        twitterTitle: 'Salento a la Mano | Guía turística de Salento, Quindío',
        twitterDescription: 'Tu guía completa para viajar a Salento: hoteles, restaurantes, experiencias y todo lo que necesitas saber.'
      }
    })

    // Landing Page: Turismo en Salento
    this.landingPages.set('salento-turismo', {
      slug: 'salento-turismo',
      keywords: ['turismo salento', 'salento turismo', 'viajes salento', 'turismo eje cafetero', 'turismo quindio'],
      title: 'Turismo en Salento | Guía completa de viajes y experiencias 2026',
      description: 'Planifica tu turismo en Salento: tours, excursiones, hoteles, restaurantes y experiencias locales. Todo lo que necesitas para tu viaje a Salento, Quindío.',
      h1: 'Turismo en Salento: Experiencias auténticas en el corazón del Eje Cafetero',
      content: {
        hero: {
          title: 'Turismo en Salento',
          subtitle: 'Experiencias auténticas en el corazón del Eje Cafetero',
          image: '/imagenes-salento/631032744.webp',
          cta: 'Planificar mi viaje'
        },
        sections: [
          {
            heading: 'Tipos de turismo disponibles en Salento',
            content: 'Salento ofrece una variedad de experiencias turísticas para diferentes tipos de viajeros.',
            subsections: [
              {
                heading: 'Ecoturismo',
                content: 'Valle de Cocora, senderismo, observación de aves, cascadas y naturaleza. Ideal para amantes de la naturaleza y la fotografía.'
              },
              {
                heading: 'Turismo cultural',
                content: 'Arquitectura tradicional, cultura cafetera, gastronomía local, artesanías y patrimonio histórico. Perfecto para conocer la cultura paisa.'
              },
              {
                heading: 'Turismo de aventura',
                content: 'Cabalgatas, senderismo challenging, jeeps willys, rutas de montaña y experiencias extremas. Para viajeros aventureros.'
              },
              {
                heading: 'Turismo rural',
                content: 'Fincas cafeteras, experiencias de campo, agricultura tradicional, vida rural y conexiones auténticas con locales.'
              }
            ]
          },
          {
            heading: 'Experiencias turísticas destacadas',
            content: 'Las actividades más recomendadas por visitantes locales y turistas internacionales.',
            subsections: [
              {
                heading: 'Coffee Tours',
                content: 'Visitas a fincas cafeteras donde aprenderás sobre el proceso del café. Tours de 2-4 horas con degustación incluida. Precios: $15-25 USD por persona.'
              },
              {
                heading: 'Valle de Cocora',
                content: 'Senderismo principal (2-4 horas), cabalgatas (1-2 horas), fotografía de palmas de cera. Acceso libre al sendero principal. Guías disponibles.'
              },
              {
                heading: 'Jeeps Willys',
                content: 'Transporte tradicional hacia el Valle de Cocora y otros destinos. Experiencia cultural única. $5-10 USD por persona cada viaje.'
              },
              {
                heading: 'Caminata Calle Real - Alto de la Cruz',
                content: 'Sendero escénico de 30-45 minutos con vistas progresivas de Salento. Gratis, acceso libre desde el centro del pueblo.'
              }
            ]
          },
          {
            heading: 'Mejores épocas para turismo en Salento',
            content: 'Salento tiene microclimas que permiten visitar durante todo el año, pero hay épocas especiales.',
            subsections: [
              {
                heading: 'Temporada seca (diciembre - marzo)',
                content: 'Mejor clima para senderismo y actividades al aire libre. Mayor turistas, precios más altos en alojamiento.'
              },
              {
                heading: 'Verano (julio - agosto)',
                content: 'Excelente clima, menor temporada turística que diciembre-enero. Buenos precios y disponibilidad.'
              },
              {
                heading: 'Temporada de lluvias (abril - junio, septiembre - noviembre)',
                content: 'Clima más lluvioso, pero senderos siguen accesibles. Menos turistas, mejores precios, paisajes más verdes.'
              }
            ]
          },
          {
            heading: 'Presupuesto estimado para turismo en Salento',
            content: 'Planificación financiera para diferentes tipos de viajeros y duraciones.',
            subsections: [
              {
                heading: 'Viajero económico (2 días)',
                content: 'Hostal ($15-20/ noche), comida local ($10-15/ día), transporte público, actividades gratuitas. Total: $50-70 USD.'
              },
              {
                heading: 'Viajero medio (3 días)',
                content: 'Hotel medio ($30-50/ noche), restaurantes ($20-30/ día), tours ($30-50), transporte privado. Total: $150-250 USD.'
              },
              {
                heading: 'Viajero premium (4 días)',
                content: 'Hotel boutique ($80-120/ noche), gastronomía premium ($40-60/ día), experiencias exclusivas ($100-150), transporte privado. Total: $400-600 USD.'
              }
            ]
          }
        ],
        cta: {
          primary: 'Ver paquetes turísticos',
          secondary: 'Reservar experiencias',
          whatsapp: true
        },
        faq: {
          items: [
            {
              question: '¿Es necesario reservar tours con anticipación?',
              answer: 'Recomendamos reservar coffee tours y cabalgatas con anticipación, especialmente en temporadas altas. Otros tours pueden coordinarse upon arrival.'
            },
            {
              question: '¿Necesito seguro de viaje para Salento?',
              answer: 'No es obligatorio, pero recomendamos tener seguro que cubra actividades al aire libre y transporte terrestre.'
            },
            {
              question: '¿Puedo hacer turismo en Salento sin guía?',
              answer: 'Sí, muchas actividades como el sendero principal del Valle de Cocora, caminata al Alto de la Cruz y explorar el pueblo pueden hacerse sin guía.'
            },
            {
              question: '¿Cuál es la mejor forma de moverse en Salento?',
              answer: 'Caminando para explorar el pueblo, jeeps willys para el Valle de Cocora, y taxis/motos para distancias cortas.'
            }
          ]
        },
        related: {
          title: 'Más información sobre turismo en Salento',
          pages: [
            {
              title: 'Qué hacer en Salento',
              url: '/que-hacer-en-salento/',
              description: '50+ actividades y experiencias detalladas'
            },
            {
              title: 'Hoteles en Salento',
              url: '/hoteles-en-salento/',
              description: 'Alojamiento para todos los presupuestos'
            },
            {
              title: 'Valle de Cocora',
              url: '/valle-de-cocora-salento/',
              description: 'Guía completa del Valle de Cocora'
            },
            {
              title: 'Salento',
              url: '/salento/',
              description: 'Guía general de Salento'
            }
          ]
        }
      },
      meta: {
        keywords: ['turismo salento', 'salento turismo', 'viajes salento', 'turismo eje cafetero', 'turismo quindio', 'tours salento'],
        canonical: 'https://salentoalamano.com/salento-turismo/',
        ogTitle: 'Turismo en Salento | Guía completa de viajes y experiencias',
        ogDescription: 'Planifica tu turismo en Salento: tours, excursiones, hoteles, restaurantes y experiencias locales.',
        ogImage: 'https://salentoalamano.com/imagenes-salento/631032744.webp',
        twitterTitle: 'Turismo en Salento | Experiencias auténticas',
        twitterDescription: 'Descubre todo el turismo disponible en Salento con nuestra guía completa.'
      }
    })

    // Landing Page: Hoteles en Salento
    this.landingPages.set('hoteles-en-salento', {
      slug: 'hoteles-en-salento',
      keywords: ['hoteles salento', 'hoteles en salento', 'alojamiento salento', 'hospedaje salento', 'donde quedarse en salento'],
      title: 'Hoteles en Salento | Guía completa de alojamiento 2026',
      description: 'Encuentra los mejores hoteles en Salento: desde hoteles boutique hasta fincas cafeteras. Reserva directa, sin intermediarios, con información actualizada.',
      h1: 'Hoteles en Salento: Tu guía completa de alojamiento en el Eje Cafetero',
      content: {
        hero: {
          title: 'Hoteles en Salento',
          subtitle: 'Encuentra el alojamiento perfecto para tu viaje',
          image: '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.png',
          cta: 'Ver hoteles disponibles'
        },
        sections: [
          {
            heading: 'Tipos de alojamiento en Salento',
            content: 'Salento ofrece opciones para todos los gustos y presupuestos.',
            subsections: [
              {
                heading: 'Hoteles boutique y de lujo',
                content: 'Hoteles con diseño único, servicios premium y experiencias exclusivas. Ideal para viajeros que buscan confort y atención personalizada.'
              },
              {
                heading: 'Hoteles tradicionales',
                content: 'Hoteles establecidos con buena ubicación, servicios completos y precios razonables. Perfecto para familias y viajeros de negocios.'
              },
              {
                heading: 'Fincas cafeteras',
                content: 'Experiencia rural auténtica en entornos cafeteros. Alojamiento con desayuno incluido, tours de café y naturaleza. Ideal para conexión con la cultura local.'
              },
              {
                heading: 'Hostales y backpackers',
                content: 'Opciones económicas para viajeros mochileros. Atmosfera social, compartidas y precios accesibles. Perfecto para conocer otros viajeros.'
              }
            ]
          },
          {
            heading: 'Hoteles destacados en Salento',
            content: 'Nuestras recomendaciones basadas en ubicación, servicios y valor.',
            subsections: [
              {
                heading: 'Hotel Camino Nacional Salento',
                content: 'Ubicación central en la Calle Real, hotel 2 estrellas con habitaciones confortables, seguridad 24 horas y recepción 24h. Ideal para explorar el pueblo a pie.'
              },
              {
                heading: 'Boki Mall - Hotel El Mirador de Boquía',
                content: 'Complejo turístico premium en Boquía (5 min de Salento). Hotel 4 estrellas con restaurante, café, eventos y experiencias locales. Premio mejor hotel rural 2024.'
              },
              {
                heading: 'Finca Hotel El Ocaso',
                content: 'Experiencia rural auténtica a 10-15 min del centro. Habitaciones con vistas panorámicas, desayuno tradicional incluido, jardines y chimenea.'
              },
              {
                heading: 'Hotel La Floresta Salento',
                content: 'Hotel boutique a 400m de la plaza con café gratuito, Coffee Spa, coworking y suites con jacuzzi. Habitaciones inspiradas en aves de la región.'
              }
            ]
          },
          {
            heading: 'Hoteles por zona en Salento',
            content: 'Elige la ubicación ideal según tus planes de viaje.',
            subsections: [
              {
                heading: 'Centro de Salento',
                content: 'Cerca de Calle Real, Plaza de Bolívar y restaurantes. Ideal para explorar el pueblo a pie. Más ruido y actividad.'
              },
              {
                heading: 'Zona rural',
                content: 'Entorno tranquilo, vistas panorámicas, conexión con naturaleza. Ideal para descanso y experiencias rurales. Requiere transporte.'
              },
              {
                heading: 'Cerca del Valle de Cocora',
                content: 'Acceso rápido al Valle de Cocora y actividades de naturaleza. Vistas espectaculares. Mayor distancia del centro.'
              }
            ]
          },
          {
            heading: 'Tips para reservar hoteles en Salento',
            content: 'Consejos prácticos para encontrar el mejor alojamiento.',
            subsections: [
              {
                heading: 'Reserva con anticipación',
                content: 'Especialmente en temporadas altas (diciembre-enero, julio-agosto). Mejores precios y disponibilidad.'
              },
              {
                heading: 'Verifica la ubicación',
                content: 'Considera la distancia al centro, al Valle de Cocora y otras atracciones que planeas visitar.'
              },
              {
                heading: 'Lee reviews reales',
                content: 'Busca opiniones recientes de huéspedes para tener expectativas realistas sobre el alojamiento.'
              },
              {
                heading: 'Contacta directamente',
                content: 'Reservar directamente con el hotel puede ofrecer mejores precios y flexibilidad con cancelaciones.'
              }
            ]
          }
        ],
        cta: {
          primary: 'Comparar hoteles',
          secondary: 'Ver availability',
          whatsapp: true
        },
        faq: {
          items: [
            {
              question: '¿Cuál es el precio promedio de hoteles en Salento?',
              answer: 'Hostales: $15-25 USD/ noche. Hoteles 2-3 estrellas: $30-60 USD/ noche. Hoteles boutique: $70-120 USD/ noche. Fincas cafeteras: $50-100 USD/ noche.'
            },
            {
              question: '¿Es necesario reservar hotel con anticipación?',
              answer: 'Recomendado en temporadas altas (diciembre-enero, julio-agosto, feriados). En temporada baja, pueden encontrar disponibilidad upon arrival.'
            },
            {
              question: '¿Los hoteles en Salento incluyen desayuno?',
              answer: 'Muchos hoteles y fincas cafeteras incluyen desayuno tradicional. Verifica cada propiedad específica al reservar.'
            },
            {
              question: '¿Los hoteles aceptan mascotas?',
              answer: 'Algunos hoteles y fincas aceptan mascotas con políticas específicas. Contacta directamente con el alojamiento para confirmar.'
            }
          ]
        },
        related: {
          title: 'Más información sobre alojamiento en Salento',
          pages: [
            {
              title: 'Turismo en Salento',
              url: '/salento-turismo/',
              description: 'Experiencias para complementar tu alojamiento'
            },
            {
              title: 'Valle de Cocora',
              url: '/valle-de-cocora-salento/',
              description: 'Alojamiento cerca del Valle de Cocora'
            },
            {
              title: 'Salento',
              url: '/salento/',
              description: 'Guía general de Salento'
            }
          ]
        }
      },
      meta: {
        keywords: ['hoteles salento', 'hoteles en salento', 'alojamiento salento', 'hospedaje salento', 'donde quedarse en salento', 'reservas salento'],
        canonical: 'https://salentoalamano.com/hoteles-en-salento/',
        ogTitle: 'Hoteles en Salento | Guía completa de alojamiento',
        ogDescription: 'Encuentra los mejores hoteles en Salento: desde hoteles boutique hasta fincas cafeteras. Reserva directa.',
        ogImage: 'https://salentoalamano.com/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.png',
        twitterTitle: 'Hoteles en Salento | Alojamiento completo',
        twitterDescription: 'Descubre todos los hoteles disponibles en Salento con nuestra guía completa.'
      }
    })
  }

  getLandingPage(slug: string): LandingPageConfig | undefined {
    return this.landingPages.get(slug)
  }

  getAllLandingPages(): LandingPageConfig[] {
    return Array.from(this.landingPages.values())
  }

  generateSitemapEntries(): Array<{ url: string; lastmod: string; priority: string }> {
    const today = new Date().toISOString().split('T')[0]
    return this.getAllLandingPages().map(page => ({
      url: `https://salentoalamano.com/${page.slug}/`,
      lastmod: today,
      priority: page.slug === 'salento' ? '1.0' : '0.8'
    }))
  }

  generateRobotsTxtAdditions(): string {
    const pages = this.getAllLandingPages()
    let additions = '\n# Landing pages programáticas\n'
    pages.forEach(page => {
      additions += `Allow: /${page.slug}/\n`
    })
    return additions
  }
}

export default ProgrammaticLandingService.getInstance()