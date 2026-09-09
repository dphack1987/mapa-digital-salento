// Tipos base del sistema
export type Category = 'Todo' | 'Alojamientos' | 'Restaurantes' | 'Restaurante Bar' | 'Cafés' | 'Coffee Tours' | 'Artesanías' | 'Tiendas' | 'Experiencias' | 'Eventos' | 'Atractivos Turísticos' | 'Servicios'

// String literal type para idiomas (evita inconsistencias de tipos)
export type Language = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it';

// Objeto de idioma para compatibilidad con código existente
export const LanguageConst = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  it: 'it'
} as const;

export type Currency = 'COP' | 'USD' | 'EUR'
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'
export type DeliveryAvailability = 'Disponible' | 'Solo_pickup' | 'No_disponible' | 'Consultar'

// Información de contacto
export type ContactInfo = {
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  instagram?: string
  facebook?: string
}

// Ubicación geográfica
export type Location = {
  lat: number
  lng: number
  address?: string
  landmark?: string // Referencia cercana
}

// Horarios de operación
export type OperatingHours = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
  notes?: string
}

// Información específica para alojamientos
export type AccommodationDetails = {
  categoryLabel: string
  stars?: number
  roomTypes: string[]
  services: string[]
  roomFeatures: string[]
  nearby: string[]
  policies: string[]
  checkIn: string
  checkOut: string
  amenities: string[]
  capacity?: string
  bookingNotes?: string
}

// Información específica para restaurantes/cafés
export type FoodServiceDetails = {
  cuisineType: string[]
  specialties: string[]
  menuHighlights: string[]
  dietaryOptions?: string[]
  averagePrice: string
  reservationRequired?: boolean
  deliveryInfo?: {
    available: boolean
    areas: string[]
    minimumOrder?: string
    deliveryTime: string
    deliveryFee?: string
  }
}

// Información específica para experiencias turísticas
export type ExperienceDetails = {
  duration: string
  difficulty: 'Fácil' | 'Moderada' | 'Difícil'
  groupSize: string
  included: string[]
  notIncluded: string[]
  requirements: string[]
  languages: string[]
  meetingPoint: string
  cancellationPolicy: string
}

// Información específica para comercios
export type CommerceDetails = {
  productTypes: string[]
  mainProducts: string[]
  brands?: string[]
  paymentMethods: string[]
  deliveryInfo?: {
    available: boolean
    areas: string[]
    minimumOrder?: string
    deliveryTime: string
  }
}

// Información específica para transporte (Jeeps Willys, motos, taxis locales)
export type TransportDetails = {
  transportType: 'Jeep Willys' | 'Moto Aventura' | 'Taxi Local' | 'Shuttle' | 'Bus'
  routes: string[]
  vehicleCount?: number
  languages: string[]
  capacity: string
  meetingPoint: string
  pricingNotes?: string
  included: string[]
  notIncluded: string[]
  operatingDays?: string[]
  advanceBookingRequired?: boolean
}

// Información específica para cabalgatas
export type HorsebackRidingDetails = {
  trails: string[]
  horseBreeds: string[]
  guidesCount?: number
  difficulty: 'Fácil' | 'Moderada' | 'Difícil'
  minAge?: number
  maxWeightKg?: number
  safetyGearIncluded: boolean
  safetyGearList?: string[]
  routeDuration: string
  departureTimes: string[]
  included: string[]
  notIncluded: string[]
  languages: string[]
  requirements?: string[]
}

// Información específica para servicios turísticos generales
export type TourismDetails = {
  attractions: string[]
  languages: string[]
  guidedAvailable: boolean
  bestVisitTime: string
  tips: string[]
  accessibilityInfo?: string[]
  tourDuration?: string
  includesGuide: boolean
  meetingPoint?: string
  capacity?: string
  photoStops?: string[]
}

// Tipos extendidos Fase2 — SEO voz/IA, guías, FAQs, internacionalización
export type I18nLocale = 'ES' | 'EN' | 'DE' | 'FR' | 'PT' | 'IT' | 'ZH' | 'JA' | 'KO' | 'TH' | 'VI' | 'ID' | 'MS' | 'EN_GB'

export type HowToStep = {
  stepNumber: number
  name: string
  text: string
  imageUrl?: string
}

export type MiniFAQ = {
  question: string
  answer: string
}

export type GuidePage = {
  slug: string
  title: string
  locale: I18nLocale
  description: string
  heroLead: string
  travelDuration?: string
  bestSeason?: string
  difficulty?: 'Fácil' | 'Moderada' | 'Difícil'
  itineraryItems: Array<{ day: number | string; title: string; description: string }>
  howToSteps?: HowToStep[]
  miniFaqs: MiniFAQ[]
  relatedLandingsSlugs: string[]
  relatedCategories: Array<Exclude<Category, 'Todo'>>
}

export type FAQCategory = 'General' | 'Alojamiento' | 'Transporte' | 'Clima' | 'Gastronomía' | 'Experiencias' | 'Presupuesto' | 'Accesibilidad' | 'Voz'

export type FAQ = {
  id: number | string
  category: FAQCategory
  keywords: string[]
  question: string
  answer: string
  speakable: boolean
  speakableCss?: { question: string; answer: string }
}

// Producto para catálogo
export type Product = {
  id: string
  name: string
  description: string
  price: number
  currency: Currency
  category: string
  available: boolean
  image?: string
  preparationTime?: string
}

// Catálogo de productos por comercio
export type ProductCatalog = {
  commerceId: number
  commerceName: string
  products: Product[]
  lastUpdated: string
}

// Pedido
export type Order = {
  id: string
  commerceId: number
  commerceName: string
  items: OrderItem[]
  total: number
  currency: Currency
  delivery: DeliveryInfo
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled'
  createdAt: string
  estimatedDelivery?: string
}

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export type DeliveryInfo = {
  hotel: string
  room: string
  phone: string
  directions?: string
  deliveryType: 'reception' | 'room' | 'agreed_point'
}

// Hotel para formulario de pedidos
export type Hotel = {
  id: string
  name: string
  address: string
  phone: string
  isPartner: boolean
}

// Lugar genérico (base para todos los tipos)
export type Place = {
  id: number
  name: string
  type: Exclude<Category, 'Todo'>
  description: string
  priceRange: PriceRange
  rating: string
  timeInfo: string
  badge: string
  color: string
  icon: any // Se mantendrá como any por compatibilidad con Lucide React
  contact: ContactInfo
  location?: Location
  photos?: string[]
  operatingHours?: OperatingHours
  tags?: string[]
  verified: boolean // Indica si los datos están validados comercialmente
  active: boolean // Indica si el lugar está activo en el sistema
  isFree?: boolean // Indica si la actividad es gratuita / sin costo de entrada
  
  // Detalles específicos según tipo
  accommodationDetails?: AccommodationDetails
  foodServiceDetails?: FoodServiceDetails
  experienceDetails?: ExperienceDetails
  commerceDetails?: CommerceDetails
  transportDetails?: TransportDetails
  horsebackRidingDetails?: HorsebackRidingDetails
  tourismDetails?: TourismDetails

  // Campos extendidos Fase2 — SEO voz/IA y SERP features
  aggregateRating?: { ratingValue: number | string; reviewCount?: number }
  actionTarget?: { reserveUrl?: string; orderUrl?: string; viewUrl?: string }
  speakable?: string[]
}

// Marcador para el mapa
export type MapMarker = {
  id: number
  label: string
  type: 'Turístico' | 'Gastronómico' | 'Comercial'
  coord: [number, number] // [lat, lng]
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'coral' | 'green' | 'yellow'
  placeId?: number // Referencia al lugar completo
  note?: string
}

// Datos del sistema
export type SystemData = {
  places: Place[]
  mapMarkers: MapMarker[]
  hotels: Hotel[]
  productCatalogs: ProductCatalog[]
  lastUpdated: string
  version: string
}

// Catálogo 14 locales internacionales Fase2 — SEO i18n
export const LOCALES_14: Record<I18nLocale, {
  code: I18nLocale
  hreflang: string
  inLanguage: string
  ogLocale: string
  label: string
  isDefault?: boolean
  xDefault?: boolean
}> = {
  ES: { code: 'ES', hreflang: 'es-CO', inLanguage: 'es', ogLocale: 'es_CO', label: 'Español (Colombia)', isDefault: true, xDefault: true },
  EN: { code: 'EN', hreflang: 'en-US', inLanguage: 'en', ogLocale: 'en_US', label: 'English (US)' },
  EN_GB: { code: 'EN_GB', hreflang: 'en-GB', inLanguage: 'en', ogLocale: 'en_GB', label: 'English (UK)' },
  DE: { code: 'DE', hreflang: 'de-DE', inLanguage: 'de', ogLocale: 'de_DE', label: 'Deutsch' },
  FR: { code: 'FR', hreflang: 'fr-FR', inLanguage: 'fr', ogLocale: 'fr_FR', label: 'Français' },
  PT: { code: 'PT', hreflang: 'pt-BR', inLanguage: 'pt', ogLocale: 'pt_BR', label: 'Português (Brasil)' },
  IT: { code: 'IT', hreflang: 'it-IT', inLanguage: 'it', ogLocale: 'it_IT', label: 'Italiano' },
  ZH: { code: 'ZH', hreflang: 'zh-CN', inLanguage: 'zh', ogLocale: 'zh_CN', label: '简体中文' },
  JA: { code: 'JA', hreflang: 'ja-JP', inLanguage: 'ja', ogLocale: 'ja_JP', label: '日本語' },
  KO: { code: 'KO', hreflang: 'ko-KR', inLanguage: 'ko', ogLocale: 'ko_KR', label: '한국어' },
  TH: { code: 'TH', hreflang: 'th-TH', inLanguage: 'th', ogLocale: 'th_TH', label: 'ไทย' },
  VI: { code: 'VI', hreflang: 'vi-VN', inLanguage: 'vi', ogLocale: 'vi_VN', label: 'Tiếng Việt' },
  ID: { code: 'ID', hreflang: 'id-ID', inLanguage: 'id', ogLocale: 'id_ID', label: 'Bahasa Indonesia' },
  MS: { code: 'MS', hreflang: 'ms-MY', inLanguage: 'ms', ogLocale: 'ms_MY', label: 'Bahasa Melayu' },
} as const