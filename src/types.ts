// Tipos base del sistema
export type Category = 'Todo' | 'Alojamientos' | 'Restaurantes' | 'Cafés' | 'Artesanías' | 'Tiendas' | 'Experiencias' | 'Servicios'
export type Language = 'es' | 'en'
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
  
  // Detalles específicos según tipo
  accommodationDetails?: AccommodationDetails
  foodServiceDetails?: FoodServiceDetails
  experienceDetails?: ExperienceDetails
  commerceDetails?: CommerceDetails
}

// Marcador para el mapa
export type MapMarker = {
  id: number
  label: string
  type: 'Turístico' | 'Gastronómico' | 'Comercial'
  lat: number
  lng: number
  tone: 'coral' | 'green' | 'yellow'
  placeId?: number // Referencia al lugar completo
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