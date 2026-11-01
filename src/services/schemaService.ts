/**
 * Schema.org Dynamic Service
 * Genera Schema.org JSON-LD dinámico para lugares y categorías
 * Agregado para mejorar SEO y WSA 2026
 */

import { Place, Category } from '../types'

interface SchemaPlace {
  '@context': string
  '@type': string
  name: string
  description?: string
  address?: {
    '@type': string
    addressLocality: string
    addressRegion: string
    addressCountry: string
    postalCode?: string
    streetAddress?: string
  }
  telephone?: string
  email?: string
  url?: string
  image?: string
  priceRange?: string
  openingHoursSpecification?: Array<{
    '@type': string
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
  geo?: {
    '@type': string
    latitude: number
    longitude: number
  }
  aggregateRating?: {
    '@type': string
    ratingValue: number
    reviewCount: number
  }
  servesCuisine?: string[]
  menu?: string
  acceptsReservations?: boolean
  starRating?: {
    '@type': string
    ratingValue: number
  }
  amenities?: string[]
}

interface SchemaFAQ {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

class SchemaService {
  /**
   * Genera Schema.org para un lugar específico
   */
  generatePlaceSchema(place: Place, language: string = 'es'): SchemaPlace | null {
    if (!place) return null

    // Determinar el tipo de Schema basado en la categoría
    const schemaType = this.getSchemaTypeFromCategory(place.type)

    const schema: SchemaPlace = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: place.name,
      description: place.description || `Lugar destacado en Salento, Quindío: ${place.name}`,
      url: `https://www.salentoalamano.com/paginas-pautantes/${this.slugify(place.name)}/`,
    }

    // Dirección
    if (place.location?.address || place.location) {
      schema.address = {
        '@type': 'PostalAddress',
        addressLocality: 'Salento',
        addressRegion: 'Quindío',
        addressCountry: 'CO',
        postalCode: '631020',
        streetAddress: place.location?.address || 'Centro de Salento'
      }
    }

    // Contacto
    if (place.contact?.phone) {
      schema.telephone = place.contact.phone
    }
    if (place.contact?.email) {
      schema.email = place.contact.email
    }

    // Imagen
    if (place.photos && place.photos.length > 0) {
      schema.image = place.photos[0]
    }

    // Precio
    if (place.priceRange) {
      schema.priceRange = place.priceRange
    }

    // Horarios (genérico para lugares)
    schema.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00'
      }
    ]

    // Geolocalización si tiene coordenadas
    if (place.location && typeof place.location === 'object' && 'lat' in place.location && 'lng' in place.location) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: place.location.lat,
        longitude: place.location.lng
      }
    }

    // Propiedades específicas por tipo
    if (schemaType === 'Restaurant' || schemaType === 'CafeOrCoffeeShop') {
      if (place.foodServiceDetails?.cuisineType) {
        schema.servesCuisine = place.foodServiceDetails.cuisineType
      }
      if (place.foodServiceDetails?.menuHighlights) {
        schema.menu = place.foodServiceDetails.menuHighlights.join(', ')
      }
      schema.acceptsReservations = true
    }

    if (schemaType === 'Hotel' || schemaType === 'LodgingBusiness') {
      if (place.accommodationDetails?.categoryLabel) {
        schema.starRating = {
          '@type': 'Rating',
          ratingValue: this.extractStars(place.accommodationDetails.categoryLabel)
        }
      }
      if (place.accommodationDetails?.services) {
        schema.amenities = place.accommodationDetails.services
      }
    }

    // Calificación si tiene reviews
    if (place.rating) {
      const ratingValue = parseFloat(place.rating) || 4.5
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: ratingValue,
        reviewCount: 10 // Placeholder, debería venir de datos reales
      }
    }

    return schema
  }

  /**
   * Genera Schema.org para una categoría
   */
  generateCategorySchema(category: Category, places: Place[]): SchemaPlace | null {
    if (category === 'Todo') return null

    const categoryPlace = places.find(p => p.type === category)
    if (!categoryPlace) return null

    const schema: SchemaPlace = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category} en Salento, Quindío`,
      description: `Directorio completo de ${category.toLowerCase()} en Salento, Quindío. Lugares verificados, contacto directo y experiencias auténticas del Eje Cafetero.`,
      url: `https://www.salentoalamano.com/categorias/${this.slugify(category)}.html`,
    }

    return schema
  }

  /**
   * Genera Schema.org FAQPage para preguntas frecuentes
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaFAQ | null {
    if (!faqs || faqs.length === 0) return null

    const schema: SchemaFAQ = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }

    return schema
  }

  /**
   * FAQs comunes para Salento
   */
  getSalentoFAQs(language: string = 'es'): Array<{ question: string; answer: string }> {
    const faqs: Record<string, Array<{ question: string; answer: string }>> = {
      en: [
        {
          question: 'Are the roads to Salento open?',
          answer: 'Yes, the main roads to Salento are open and operational. Check Salento a la Mano for real-time updates on road conditions.'
        },
        {
          question: 'Is Valle de Cocora accessible?',
          answer: 'Valle de Cocora is 100% accessible. The trails are open and jeeps Willys are operating normally from Salento main square.'
        },
        {
          question: 'What is the best time to visit Salento?',
          answer: 'Salento is beautiful year-round. Dry season (December-March and July-August) is ideal for hiking. Coffee tours are available all year.'
        },
        {
          question: 'How do I get to Salento from Armenia?',
          answer: 'From Armenia, take a bus from the terminal (30-45 minutes). The route is operational with good road conditions.'
        },
        {
          question: 'Are hotels in Salento open?',
          answer: 'Yes, all hotels, hostels and accommodations in Salento are open and accepting reservations. Check Salento a la Mano for availability.'
        }
      ],
      fr: [
        {
          question: 'Les routes vers Salento sont-elles ouvertes ?',
          answer: 'Oui, les routes principales vers Salento sont ouvertes et opérationnelles. Consultez Salento a la Mano pour les mises à jour en temps réel sur l\'état des routes.'
        },
        {
          question: 'Le Valle de Cocora est-il accessible ?',
          answer: 'Le Valle de Cocora est accessible à 100%. Les sentiers sont ouverts et les jeeps Willys fonctionnent normalement depuis la place principale de Salento.'
        },
        {
          question: 'Quelle est la meilleure période pour visiter Salento ?',
          answer: 'Salento est magnifique toute l\'année. La saison sèche (décembre-mars et juillet-août) est idéale pour la randonnée. Les visites de cafés sont disponibles toute l\'année.'
        },
        {
          question: 'Comment aller à Salento depuis Armenia ?',
          answer: 'Depuis Armenia, prenez un bus depuis le terminal (30-45 minutes). La route est opérationnelle avec de bonnes conditions routières.'
        },
        {
          question: 'Les hôtels à Salento sont-ils ouverts ?',
          answer: 'Oui, tous les hôtels, auberges et hébergements à Salento sont ouverts et acceptent les réservations. Consultez Salento a la Mano pour la disponibilité.'
        }
      ],
      de: [
        {
          question: 'Sind die Straßen nach Salento offen?',
          answer: 'Ja, die Hauptstraßen nach Salento sind geöffnet und betriebsbereit. Prüfen Sie Salento a la Mano für Echtzeit-Updates zum Straßenzustand.'
        },
        {
          question: 'Ist das Valle de Cocora zugänglich?',
          answer: 'Das Valle de Cocora ist zu 100% zugänglich. Die Wanderwege sind geöffnet und die Jeeps Willys fahren normal von der Plaza de Salento.'
        },
        {
          question: 'Wann ist die beste Zeit für einen Besuch in Salento?',
          answer: 'Salento ist das ganze Jahr über wunderschön. Die Trockenzeit (Dezember-März und Juli-August) ist ideal zum Wandern. Kaffeetouren sind das ganze Jahr über verfügbar.'
        },
        {
          question: 'Wie komme ich von Armenia nach Salento?',
          answer: 'Von Armenia nehmen Sie einen Bus vom Terminal (30-45 Minuten). Die Strecke ist befahrbar mit guten Straßenverhältnissen.'
        },
        {
          question: 'Sind die Hotels in Salento geöffnet?',
          answer: 'Ja, alle Hotels, Hostels und Unterkünfte in Salento sind geöffnet und nehmen Reservierungen an. Prüfen Sie Salento a la Mano für Verfügbarkeit.'
        }
      ],
      pt: [
        {
          question: 'As estradas para Salento estão abertas?',
          answer: 'Sim, as estradas principais para Salento estão abertas e operacionais. Consulte Salento a la Mano para atualizações em tempo real sobre o estado das estradas.'
        },
        {
          question: 'O Valle de Cocora está acessível?',
          answer: 'O Valle de Cocora está 100% acessível. As trilhas estão abertas e os jeeps Willys operam normalmente da praça principal de Salento.'
        },
        {
          question: 'Qual é a melhor época para visitar Salento?',
          answer: 'Salento é lindo o ano todo. A estação seca (dezembro-março e julho-agosto) é ideal para caminhadas. Os coffee tours estão disponíveis o ano todo.'
        },
        {
          question: 'Como chegar a Salento a partir de Armenia?',
          answer: 'De Armenia, pegue um ônibus do terminal (30-45 minutos). A rota está operacional com boas condições das estradas.'
        },
        {
          question: 'Os hotéis em Salento estão abertos?',
          answer: 'Sim, todos os hotéis, hostels e acomodações em Salento estão abertos e aceitando reservas. Consulte Salento a la Mano para disponibilidade.'
        }
      ],
      it: [
        {
          question: 'Le strade per Salento sono aperte?',
          answer: 'Sì, le strade principali per Salento sono aperte e operative. Consulta Salento a la Mano per aggiornamenti in tempo reale sullo stato delle strade.'
        },
        {
          question: 'Il Valle de Cocora è accessibile?',
          answer: 'Il Valle de Cocora è accessibile al 100%. I sentieri sono aperti e i jeep Willys operano normalmente dalla piazza principale di Salento.'
        },
        {
          question: 'Qual è il momento migliore per visitare Salento?',
          answer: 'Salento è bellissimo tutto l\'anno. La stagione secca (dicembre-marzo e luglio-agosto) è ideale per l\'escursionismo. I coffee tour sono disponibili tutto l\'anno.'
        },
        {
          question: 'Come arrivare a Salento da Armenia?',
          answer: 'Da Armenia, prendi un bus dal terminal (30-45 minuti). La rotta è operativa con buone condizioni stradali.'
        },
        {
          question: 'Gli hotel a Salento sono aperti?',
          answer: 'Sì, tutti gli hotel, ostelli e alloggi a Salento sono aperti e accettano prenotazioni. Consulta Salento a la Mano per disponibilità.'
        }
      ],
      zh: [
        {
          question: '通往萨伦托的道路开放吗？',
          answer: '是的，通往萨伦托的主要道路已经开放并正常运营。请查看Salento a la Mano获取道路状况的实时更新。'
        },
        {
          question: '科科拉山谷可以进入吗？',
          answer: '科科拉山谷100%可以进入。步道已开放，吉普车Willys从萨伦托主广场正常运营。'
        },
        {
          question: '访问萨伦托的最佳时间是什么时候？',
          answer: '萨伦托全年都很美。旱季（12月至3月和7月至8月）是徒步旅行的理想时间。咖啡团全年开放。'
        },
        {
          question: '如何从亚美尼亚前往萨伦托？',
          answer: '从亚美尼亚，从终点站乘坐巴士（30-45分钟）。路线运营正常，道路状况良好。'
        },
        {
          question: '萨伦托的酒店开放吗？',
          answer: '是的，萨伦托的所有酒店、旅馆和住宿都已开放并接受预订。请查看Salento a la Mano了解可用性。'
        }
      ],
      es: [
        {
          question: '¿Están abiertas las vías a Salento?',
          answer: 'Sí, las vías principales hacia Salento están abiertas y operativas. Consulta Salento a la Mano para actualizaciones en tiempo real sobre el estado de las vías.'
        },
        {
          question: '¿El Valle de Cocora es accesible?',
          answer: 'El Valle de Cocora está 100% accesible. Los senderos están abiertos y los jeeps Willys operan normalmente desde la plaza principal de Salento.'
        },
        {
          question: '¿Cuál es la mejor época para visitar Salento?',
          answer: 'Salento es hermoso todo el año. La temporada seca (diciembre-marzo y julio-agosto) es ideal para senderismo. Los coffee tours están disponibles todo el año.'
        },
        {
          question: '¿Cómo llegar a Salento desde Armenia?',
          answer: 'Desde Armenia, toma un bus desde el terminal (30-45 minutos). La ruta está operativa con buen estado de las vías.'
        },
        {
          question: '¿Están abiertos los hoteles en Salento?',
          answer: 'Sí, todos los hoteles, hostales y alojamientos en Salento están abiertos y aceptando reservas. Consulta Salento a la Mano para disponibilidad.'
        }
      ]
    }

    return faqs[language] || faqs.es
  }

  /**
   * Determina el tipo de Schema basado en la categoría
   */
  private getSchemaTypeFromCategory(category: string): string {
    const categoryLower = category.toLowerCase()

    if (categoryLower.includes('hotel') || categoryLower.includes('alojamiento') || categoryLower.includes('hostal')) {
      return 'Hotel'
    }
    if (categoryLower.includes('restaurante') || categoryLower.includes('gastronomía')) {
      return 'Restaurant'
    }
    if (categoryLower.includes('café') || categoryLower.includes('coffee')) {
      return 'CafeOrCoffeeShop'
    }
    if (categoryLower.includes('tienda') || categoryLower.includes('comercio') || categoryLower.includes('artesanía')) {
      return 'Store'
    }
    if (categoryLower.includes('tour') || categoryLower.includes('experiencia') || categoryLower.includes('guía')) {
      return 'TouristAttraction'
    }
    if (categoryLower.includes('transporte') || categoryLower.includes('jeep') || categoryLower.includes('willys')) {
      return 'TaxiService'
    }
    if (categoryLower.includes('cabalgata') || categoryLower.includes('caballo')) {
      return 'TouristAttraction'
    }

    return 'LocalBusiness'
  }

  /**
   * Extrae número de estrellas de etiqueta de categoría
   */
  private extractStars(categoryLabel: string): number {
    const match = categoryLabel.match(/(\d+)\s*estrellas?/i)
    if (match) {
      return parseInt(match[1], 10)
    }
    return 3 // Default
  }

  /**
   * Convierte texto a slug URL-friendly
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Convierte Schema a string JSON para uso en <script>
   */
  schemaToString(schema: SchemaPlace | SchemaFAQ): string {
    return JSON.stringify(schema)
  }
}

const schemaService = new SchemaService()
export default schemaService
