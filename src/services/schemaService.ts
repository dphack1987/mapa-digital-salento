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
    if (language === 'en') {
      return [
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
      ]
    }

    return [
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
