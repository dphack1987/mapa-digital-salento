import { useMemo, useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import NotFound from './pages/NotFound'
// Leaflet se carga bajo demanda al acercarse a la sección del mapa
import './components/map/ARMapControllerApp.css'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bike,
  Bell,
  Flame,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  Heart,
  Home,
  LifeBuoy,
  Hotel,
  Mail,
  MapPin,
  Menu,
  Mountain,
  ShoppingBag,
  MessageCircle,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  Shield,
  Globe,
  Eye,
  ShoppingBasket,
  Sparkles,
  Star,
  Store,
  Utensils,
  X,
  Zap,
  Share2,
  Link,
  Building2,
  ChevronRight,
  Volume2,
  VolumeX,
  BarChart3
} from 'lucide-react'
import { Category, Language, Place, MapMarker, Hotel as HotelType, LanguageConst, Currency } from './types'
import dataService from './services/dataService'
import { useTravelContext, getContextualMessage } from './hooks/useTravelContext'
// Integración de Don Chucho IA mejorado — carga diferida
import { GenerativeUI, detectIntent, UserIntent } from './components/GenerativeUI'
import { VoiceInput, useSpeechSynthesis, SPEECH_LOCALES } from './components/VoiceInput'
import { useDetailLevel, adaptDetail } from './components/LODControl'
import { generateAgenticResponse, executeAction, AgentAction } from './services/agenticDonChucho'
// Temporada navideña: sombrero en el logo, banner y nieve (nov–ene)
import { isChristmasSeason } from './utils/season'
import ChristmasHat from './components/ChristmasHat'
import ChristmasSnow from './components/ChristmasSnow'
import ChristmasBanner from './components/ChristmasBanner'

const salentoImageGallery = [
  ['destinos-75.webp', 'Paisaje del Valle de Cocora y Salento'],
  ['colombia-palms.webp', 'Palmas de cera del Eje Cafetero'],
  ['valle-cocora-palmas-2.webp', 'Valle de Cocora con palmas de cera'],
  ['1326163759.webp', 'Palmas de cera entre la niebla del Valle de Cocora'],
  ['631026720.webp', 'Arquitectura tradicional de Salento'],
  ['631032744.webp', 'Palmas de cera en las laderas del Quindío'],
  ['1326163558.webp', 'Calle empedrada con casas de colores de Salento'],
  ['653410779.webp', 'Torre de la iglesia sobre los tejados de Salento'],
  ['calle.webp', 'Calle colorida de Salento'],
  ['pueblo.webp', 'Pueblo de Salento'],
  ['iglesia.webp', 'Iglesia de Salento'],
  ['pueblo.webp', 'Calle del pueblo de Salento'],
  ['salento-landscape.webp', 'Centro de Salento con casas de colores'],
  ['trucha y patacon.webp', 'Trucha con patacón'],
  ['Trucha-con-camarones-Salento-Quindio-1024x768.jpeg.webp', 'Trucha con camarones'],
  ['trucha1.webp', 'Trucha de la cocina salentina'],
  ['truite-a-la-plancha.webp', 'Trucha a la plancha'],
  ['patacon 3.webp', 'Patacón de la cocina local'],
  ['patacon.webp', 'Patacón tradicional'],
  ['patacon2.webp', 'Plato local con patacón'],
  ['patacon4.webp', 'Gastronomía local'],
]

const serviceCardImageSets = {
  gastronomy: [
    '/pautas/restaurante_bar_fonda_boquia/imagenes/480508481_1169835038167384_4932382570318530100_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/481970368_1182179880266233_2620181488091833302_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/30411747_1017613001720886_1046791999434260480_n.webp',
    '/imagenes-salento/Trucha-con-camarones-Salento-Quindio-1024x768.jpeg.webp'
  ],
  restaurantBar: [
    '/pautas/restaurante_bar_fonda_boquia/fonda-arte-publicitario.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/29389126_1005353112946875_6049563033867386880_n.webp'
  ],
  coffeeTour: [
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/724493520_18074799854670095_3547519742275705982_n.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/Plantation.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/recuerdo1casa.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.webp'
  ],
  transport: [
    '/pautas/cootracocora_ltda/imagenes/willys.webp',
    '/pautas/cootracocora_ltda/cootracocora-arte-publicitario.webp'
  ],
  horseback: [
    '/pautas/cabalgatas_cocora_magica/imagenes/cabalgata-rio.webp',
    '/pautas/cabalgatas_cocora_magica/imagenes/cruzando-rio.webp',
    '/pautas/cabalgatas_cocora_magica/imagenes/Caballos.webp'
  ],
  guides: [
    '/imagenes-salento/valle-cocora-palmas-2.webp',
    '/pautas/mirador_mano_de_dios/imagenes/dios2.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0769.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-1.webp'
  ],
  accommodation: [
    '/pautas/hotel_la_floresta_salento/imagenes/lafloresta-fachada.webp',
    '/pautas/mahalo_hostel/imagenes/hab-1.1.webp',
    '/pautas/hotel_camino_nacional/imagenes/1326164875.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.webp'
  ],
  artisan: [
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/631026720.webp'
  ],
  commerce: [
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163558.webp',
    '/imagenes-salento/pueblo.webp'
  ],
  events: [
    '/imagenes-salento/631032744.webp',
    '/imagenes-salento/653410779.webp'
  ],
  camping: [
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-1.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/monte1.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/casa1.webp'
  ]
} as const

function rotateServiceImage(set: readonly string[], tick: number): string {
  const src = set[tick % set.length]
  // Variante 400 px: las tarjetas se muestran a ~190 px (2x en móvil).
  return src.replace(/\.webp$/i, '-400.webp')
}

function providerSlug(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function placePageHref(place: Place): string {
  if (place.actionTarget?.viewUrl) return place.actionTarget.viewUrl
  const slug = place.brandSlug || providerSlug(place.name)
  return `/paginas-pautantes/${slug}/`
}
import { placeCtaLabel, markerCtaLabel } from './utils/placeCta'
import translationService from './services/translationService'
import donChuchoKnowledge from './services/donChuchoKnowledge'
import internationalSEOService from './services/internationalSEO.service'
import currencyService from './services/currencyService'
import hotelQRService from './services/qrHotelService'

import offlineStorage from './services/offlineStorage'
import horsebackRidingService from './services/horsebackRidingService'
import reviewsService from './services/reviewsService'
import analyticsService from './services/analyticsService'
import supportService from './services/supportService'
import seoLandingService from './services/seoLandingService'
import defensiveSEOGService from './services/defensiveSEOG.service'
import localBacklinksService from './services/localBacklinks.service'
import allyRegistrationService from './services/allyRegistration.service'
import notificationsService from './services/notifications.service'
import ga4Service from './services/ga4Service'
import schemaService from './services/schemaService'
// Integración Open Source para turismo
// Buscando alternativas a OSIRIS específicas para turismo

// Lazy loaded components - optimización de bundle
const ARCameraView = lazy(() => import('./components/ar/ARCameraView'))
const HomeMap = lazy(() => import('./components/home/HomeMap'))
const EnhancedDonChucho = lazy(() => import('./components/enhanced/EnhancedDonChucho'))
const InternationalMarketsDisplay = lazy(() => import('./components/InternationalMarketsDisplay'))
const LandingPageEstadoActual = lazy(() => import('./components/LandingPageEstadoActual'))
const LandingPageValleCocora = lazy(() => import('./components/LandingPageValleCocora'))
const LandingPageSalentoSeguro = lazy(() => import('./components/LandingPageSalentoSeguro'))
const LandingPageHoteles = lazy(() => import('./components/LandingPageHoteles'))
const LandingPageVias = lazy(() => import('./components/LandingPageVias'))
const NotificationsPanel = lazy(() => import('./components/NotificationsPanel'))
const HorsebackRiding = lazy(() => import('./components/HorsebackRiding'))
const Reviews = lazy(() => import('./components/Reviews'))
const SupportCenter = lazy(() => import('./components/SupportCenter'))
const DynamicLandingPage = lazy(() => import('./components/DynamicLandingPage'))
const HotelInfoModal = lazy(() => import('./components/HotelInfoModal'))
const PhotoGallery = lazy(() => import('./components/PhotoGallery'))
const QRShare = lazy(() => import('./components/QRShare'))
const SocialProofTicker = lazy(() => import('./components/SocialProofTicker'))
const DefensiveSEODashboard = lazy(() => import('./components/DefensiveSEODashboard'))
const AllyBacklinksDashboard = lazy(() => import('./components/AllyBacklinksDashboard'))
const BusinessDashboard = lazy(() => import('./components/BusinessDashboard'))
const AllyRegistrationForm = lazy(() => import('./components/AllyRegistrationForm'))
const AllyVerification = lazy(() => import('./components/AllyVerification'))
const ProviderSelectionModal = lazy(() => import('./components/ProviderSelectionModal'))
const FeatureCards = lazy(() => import('./components/FeatureCards'))
const FeaturedHomeMenus = lazy(() => import('./components/FeaturedHomeMenus'))
const HomeBanners = lazy(() => import('./components/HomeBanners'))
const InteractiveMenu = lazy(() => import('./components/InteractiveMenu'))

function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner">Cargando...</div>
    </div>
  )
}

// Mapeo de iconos para compatibilidad con estructura JSON
const iconMap: Record<string, any> = {
  Coffee,
  Utensils,
  Hotel,
  ShoppingBasket,
  Bike,
  Store,
  Compass,
  Zap,
  Mountain,
  MapPin,
  Sparkles,
  Heart,
  Star,
  Home,
  Menu,
  X,
  Search,
  Bell,
  Phone,
  Share2,
  Link,
  Building2,
  ChevronDown,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  LifeBuoy,
  Mail,
  MessageCircle,
  MessageSquare,
  Minus,
  Plus,
  Send,
  Shield,
  Globe,
  Eye,
  ShoppingBag,
  Clock3,
}

// Función para convertir iconos de string a componentes Lucide
function getIconComponent(iconName: string): any {
  return iconMap[iconName] || Coffee // Fallback a Coffee
}

// Función de adaptación para compatibilidad con componente existente
function adaptPlaceForCompatibility(place: Place): any {
  return {
    ...place,
    price: place.priceRange,
    time: place.timeInfo,
    icon: getIconComponent(place.icon),
    phone: place.contact.phone,
    whatsapp: place.contact.whatsapp,
    email: place.contact.email,
    detailInfo: place.accommodationDetails ? {
      categoryLabel: place.accommodationDetails.categoryLabel,
      description: place.description,
      services: place.accommodationDetails.services,
      roomFeatures: place.accommodationDetails.roomFeatures,
      nearby: place.accommodationDetails.nearby,
      policies: place.accommodationDetails.policies
    } : undefined
  }
}

function normalizePlaceText(value: string | undefined): string {
  return (value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    China: 'cn',
    Rusia: 'ru',
    Japón: 'jp',
    'Corea del Sur': 'kr',
    Taiwán: 'tw',
    'Hong Kong': 'hk',
    Tailandia: 'th',
    Vietnam: 'vn',
    Indonesia: 'id',
    Malasia: 'my',
    Alemania: 'de',
    Francia: 'fr',
    'Reino Unido': 'gb',
    'Estados Unidos': 'us',
    Brasil: 'br',
    México: 'mx',
    Italia: 'it',
    Dinamarca: 'dk',
    España: 'es',
    'Países Bajos': 'nl',
    Suiza: 'ch',
    Suecia: 'se',
    Noruega: 'no',
    Portugal: 'pt',
    Bélgica: 'be',
    Austria: 'at',
    Irlanda: 'ie',
    Finlandia: 'fi',
  }
  return flags[country] || 'un'
}

function placePriority(place: Place): number {
  // Pautantes con assets en /pautas/ son lo más importante del catálogo
  const hasPautas = (place.photos || []).some((src) => String(src).startsWith('/pautas/'))
  if (hasPautas) return 4
  if (place.isPautante) return 3
  if (place.actionTarget?.viewUrl || place.actionTarget?.reserveUrl) return 2
  if (place.verified) return 1
  return 0
}

function matchesKeywords(place: Place, keywords: string[]): boolean {
  const searchableText = [
    place.type,
    place.name,
    place.description,
    place.badge,
    place.tags?.join(' '),
    (place as any).experienceDetails?.activityType,
    (place as any).experienceDetails?.meetingPoint,
    (place as any).foodServiceDetails?.cuisineType?.join(' '),
    (place as any).foodServiceDetails?.specialties?.join(' '),
    (place as any).foodServiceDetails?.menuHighlights?.join(' '),
    (place as any).commerceDetails?.productTypes?.join(' '),
    (place as any).commerceDetails?.mainProducts?.join(' '),
    (place as any).accommodationDetails?.categoryLabel,
  ].filter(Boolean).join(' ')

  const normalized = normalizePlaceText(searchableText)
  return keywords.some(keyword => normalized.includes(normalizePlaceText(keyword)))
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Todo: [],
  Alojamientos: ['alojamiento', 'hotel', 'hostal', 'hospedaje', 'resort', 'lodging', 'cabin', 'cabaña', 'hostel', 'finca hotel'],
  Restaurantes: ['restaurante', 'gastronomia', 'brunch', 'comida', 'trucha', 'pizza', 'burger', 'fonda', 'cocina'],
  'Restaurante Bar': ['restaurante bar', 'bar', 'cafe bar', 'cocktail', 'bebida', 'lounge', 'bar-cafe', 'cerveza', 'coctel'],
  'Cafés': ['cafe', 'cafeteria', 'coffee', 'espresso', 'brunch', 'cafetera'],
  'Coffee Tours': ['coffee tour', 'tour cafe', 'finca cafetera', 'cafeteria tour', 'coffee farm', 'tour de cafe'],
  Artesanías: ['artesania', 'artesanias', 'manualidad', 'tejido', 'fibras', 'craft', 'handmade', 'regalo', 'souvenir'],
  Tiendas: ['tienda', 'shop', 'comercio', 'mercado', 'venta', 'boutique', 'store', 'souvenir'],
  Experiencias: ['cabalgata', 'caballo', 'equitacion', 'horse', 'ride', 'guia', 'tour', 'ruta', 'senderismo', 'adventure', 'guide', 'experiencia'],
  Eventos: ['evento', 'eventos', 'boda', 'celebracion', 'corporativo', 'matrimonio', 'fiesta', 'salon de eventos', 'reunion'],
  'Atractivos Turísticos': ['atractivo', 'atractivos', 'mirador', 'miradores', 'cascada', 'sendero', 'parque', 'natural', 'reserva', 'turistico', 'vista', 'attraction', 'cabalgata', 'cabalgatas', 'caballo', 'caballos', 'moto', 'motos', 'alquiler de moto', 'minimoto', 'jeep', 'willys', 'cocora', 'iglesia', 'plaza', 'calle real', 'puente', 'palmas', 'oficina', 'terminal'],
  Servicios: ['transporte', 'moto', 'jeep', 'taxi', 'movilidad', 'transfer', 'transport', 'vehicle', 'servicio'],
  Camping: ['camping', 'campamento', 'carpa', 'tienda de campaña', 'glamping', 'al aire libre', 'outdoor', 'campsite', 'cabin']
}

function placeMatchesSearch(place: Place, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true
  const text = normalizePlaceText([
    place.name,
    place.description,
    place.type,
    place.tags?.join(' '),
    place.badge,
    (place as any).foodServiceDetails?.cuisineType?.join(' '),
    (place as any).foodServiceDetails?.specialties?.join(' '),
    (place as any).foodServiceDetails?.menuHighlights?.join(' '),
  ].filter(Boolean).join(' '))
  const words = normalizedQuery.split(/\s+/).filter(Boolean)
  return words.every((word) => {
    if (text.includes(word)) return true
    const singular = word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word
    if (text.includes(singular)) return true
    if (singular.length > 3 && word.length > 3) {
      const stem = singular.slice(0, Math.max(4, singular.length - 2))
      return stem.length >= 4 && text.includes(stem)
    }
    return false
  })
}

function initializeAllServicesSafely() {
  try { currencyService.initialize() } catch (e: any) { console.warn('[init] currencyService:', e?.message || e) }
  try { horsebackRidingService.initialize() } catch (e: any) { console.warn('[init] horsebackRidingService:', e?.message || e) }
  try { reviewsService.generateSampleReviews() } catch (e: any) { console.warn('[init] reviewsService:', e?.message || e) }
  try { analyticsService.initialize() } catch (e: any) { console.warn('[init] analyticsService:', e?.message || e) }
  try { supportService.initialize() } catch (e: any) { console.warn('[init] supportService:', e?.message || e) }
  try { seoLandingService.initialize() } catch (e: any) { console.warn('[init] seoLandingService:', e?.message || e) }
  try { defensiveSEOGService.initialize() } catch (e: any) { console.warn('[init] defensiveSEOGService:', e?.message || e) }
  try { localBacklinksService.initialize() } catch (e: any) { console.warn('[init] localBacklinksService:', e?.message || e) }
  try { internationalSEOService.initialize() } catch (e: any) { console.warn('[init] internationalSEOService:', e?.message || e) }
  try { allyRegistrationService.initialize() } catch (e: any) { console.warn('[init] allyRegistrationService:', e?.message || e) }
  try { notificationsService.initialize() } catch (e: any) { console.warn('[init] notificationsService:', e?.message || e) }
  try { ga4Service.initialize() } catch (e: any) { console.warn('[init] ga4Service:', e?.message || e) }
  try {
    hotelQRService.initializeWithHotels([
      { id: '5', name: 'Hotel Camino Nacional' },
      { id: '9', name: 'Finca Hotel El Ocaso' }
    ])
  } catch (e: any) { console.warn('[init] hotelQRService:', e?.message || e) }
}

function cleanupAllServicesSafely() {
  try { currencyService.cleanup() } catch (e: any) { console.warn('[cleanup] currencyService:', e?.message || e) }
}

// Función para formatear precios - movida fuera del componente App para ser accesible
function formatPrice(cop: number, currency: Currency) {
  return currencyService.formatAmount(currencyService.convertFromCOP(cop, currency), currency)
}

// Validador de WhatsApp Colombia (57 + 9-10 dígitos). Solo observa: avisa en
// consola sin romper el flujo, para detectar datos de contacto corruptos.
function isValidWhatsAppCO(value?: string): boolean {
  return /^57\d{9,10}$/.test((value ?? '').replace(/\D/g, ''))
}

function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°C`
}

function App() {
  useEffect(() => {
    const prerender = document.getElementById('prerender')
    if (prerender) prerender.remove()
  }, [])

  // Temporada navideña: activa de noviembre a enero, se apaga en febrero
  const isChristmas = isChristmasSeason()
  useEffect(() => {
    document.documentElement.setAttribute('data-season', isChristmas ? 'christmas' : 'default')
  }, [isChristmas])

  // GA4: evidencia de visualización de la sección de nominación WSA (para el jurado).
  // La sección se monta después del loading inicial: se reintenta hasta encontrarla.
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let attempts = 0
    let timer: number | undefined
    const attach = () => {
      const section = document.getElementById('wsa-nominacion')
      if (section) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            ga4Service.trackEvent('wsa_nomination_view', { section_id: 'wsa-nominacion' })
            observer?.disconnect()
          }
        }, { threshold: 0.25 })
        observer.observe(section)
        return
      }
      if (attempts++ < 40) timer = window.setTimeout(attach, 500)
    }
    attach()
    return () => {
      observer?.disconnect()
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/' || path === '/index.html') return
    const validPrefixes = ['/categorias/', '/paginas-pautantes/', '/imagenes-salento/', '/landing/', '/en/', '/de/', '/fr/', '/pt/', '/it/', '/pautas/']
    const validPages = [
      '/mapa-interactivo-salento.html', '/seguridad-salento-emergencias.html',
      '/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html',
      '/landing/mejor-trucha-salento/', '/landing/hotel-barato-salento/',
      '/landing/coffee-tour-salento-precio/', '/landing/valle-de-cocora-guia/',
      '/landing/que-hacer-salento-fin-de-semana/', '/agenda-eventos-salento.html',
      '/vias-salento-libres-acceso.html', '/hoteles-abiertos-salento.html',
      '/valle-cocora-accesible-100.html', '/conservacion-salento.html',
      '/registro-aliados.html', '/don-chucho-asistente.html',
      '/restaurantes-salento-abiertos-servicio-gastronomico-operativo.html',
      '/robots.txt', '/sitemap.xml', '/b00529ac43b44c15a0d1a45101a8ac41.txt',
      '/naver1820d4dce5511b63defe80c50a86ab77.html'
    ]
    const isValid = validPages.includes(path) || validPrefixes.some(p => path.startsWith(p))
    if (!isValid) setNotFound(true)
  }, [])

  const [activeCategory, setActiveCategory] = useState<Category>('Todo')
  const [cartCount, setCartCount] = useState(0)

  // Rotación de imágenes de las service cards: todos los pautantes reciben el mismo tiempo en pantalla
  const [serviceTick, setServiceTick] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setServiceTick((prev) => prev + 1), 5000)
    return () => window.clearInterval(id)
  }, [])

  const [showCart, setShowCart] = useState(false)
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState<'all' | 'whatsapp' | 'pautante'>('all')
  const [directoryLimit, setDirectoryLimit] = useState(12)
  const [mobileNav, setMobileNav] = useState(false)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      // Primero el parámetro ?lang= (enlaces compartibles sin carpeta estática)
      if (typeof window !== 'undefined') {
        const queryLang = new URLSearchParams(window.location.search).get('lang')
        if (queryLang && (Object.values(LanguageConst) as string[]).includes(queryLang)) {
          return queryLang as Language
        }
        // Luego la ruta con locale (e.g., /en/, /de/)
        const path = window.location.pathname
        const localeMatch = path.match(/^\/(en|de|fr|pt|it|zh|ja|ko|th|vi|id|ms|ar)\//)
        if (localeMatch) {
          const localeCode = localeMatch[1].toUpperCase()
          return localeCode as Language
        }
      }
      return translationService.initialize() as Language
    } catch (e) { console.warn('[init] translation lazy fallback es:', e); return 'es' as Language }
  })
  const [currency, setCurrency] = useState<Currency>('COP')

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([])
  const [hotels, setHotels] = useState<HotelType[]>([])
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState<any>(null)
  const [todayEvents, setTodayEvents] = useState<any[]>([])
  const [showWeatherBanner, setShowWeatherBanner] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHorsebackRiding, setShowHorsebackRiding] = useState(false)
  const [showReviews, setShowReviews] = useState<string | null>(null)
  const [selectedPlaceForReviews, setSelectedPlaceForReviews] = useState<{ id: string; name: string; type: string } | null>(null)
  const [showSupport, setShowSupport] = useState(false)
  const [showLandingPage, setShowLandingPage] = useState<string | null>(null)
  const [showHotelModal, setShowHotelModal] = useState(false)
  // Estado para Don Chucho IA mejorado
  const [showDonChuchoAI, setShowDonChuchoAI] = useState(() => {
    try { return sessionStorage.getItem('salento_don_chucho_auto_opened') !== '1' }
    catch { return true }
  })
  const [donChuchoLocalOpen, setDonChuchoLocalOpen] = useState(false)
  useEffect(() => {
    try { sessionStorage.setItem('salento_don_chucho_auto_opened', '1') } catch {}
  }, [])
  // Estado para modo AR en mapa
  const [arMapMode, setARMapMode] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null)
  const [pendingOrderCategory, setPendingOrderCategory] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    try { return !navigator.onLine } catch (e) { return false }
  })
  const [showQRShare, setShowQRShare] = useState(false)
  const [showDefensiveSEODashboard, setShowDefensiveSEODashboard] = useState(false)
  const [showAllyBacklinksDashboard, setShowAllyBacklinksDashboard] = useState(false)
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false)
  const [showAllyRegistrationForm, setShowAllyRegistrationForm] = useState(false)
  const [showInternationalMarkets, setShowInternationalMarkets] = useState(false)

  // Solicitar ubicación del usuario para AR
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation no disponible:', error)
        }
      )
    }
  }

  // Activar modo AR cuando usuario lo solicita
  const toggleARMode = () => {
    setARMapMode(!arMapMode)
    if (!arMapMode) {
      requestUserLocation()
    } else {
      setUserLocation(null)
    }
  }
  const [showLandingPageEstadoActual, setShowLandingPageEstadoActual] = useState(false)
  const [showLandingPageValleCocora, setShowLandingPageValleCocora] = useState(false)
  const [showLandingPageSalentoSeguro, setShowLandingPageSalentoSeguro] = useState(false)
  const [showLandingPageHoteles, setShowLandingPageHoteles] = useState(false)
  const [showLandingPageVias, setShowLandingPageVias] = useState(false)
  const [showAllyVerification, setShowAllyVerification] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [selectedCategoryPage, setSelectedCategoryPage] = useState<Category | null>(null)
  const [selectedAllyForVerification, setSelectedAllyForVerification] = useState<string | null>(null)

  const isEnglish = language === 'en' || language === 'en-gb'

  // Mapeo de locales para Open Graph y hreflang
  const localeMap: Record<string, string> = {
    es: 'es_CO',
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    pt: 'pt_BR',
    it: 'it_IT',
    zh: 'zh_CN',
    ja: 'ja_JP',
    ko: 'ko_KR',
    th: 'th_TH',
    vi: 'vi_VN',
    id: 'id_ID',
    ms: 'ms_MY',
    ar: 'ar_AR',
    'en-gb': 'en_GB'
  }
  const currentLocale = localeMap[language] || 'es_CO'

  const helmetTitle = useMemo(() => {
    try {
      if (selectedPlace) {
        const cat = selectedPlace.type || t('services.transport', 'Servicios locales')
        return t('meta.placeTitle', `${selectedPlace.name} | Salento a la Mano 2026 - ${cat} directo en Salento, Quindío`).replace('{name}', selectedPlace.name).replace('{cat}', cat)
      }
      const effectiveCategory = selectedCategoryPage
      if (effectiveCategory && effectiveCategory !== 'Todo') {
        return t('meta.categoryTitle', `${effectiveCategory} en Salento, Quindío 2026 | Salento a la Mano`).replace('{cat}', effectiveCategory)
      }
      return translationService.translate('meta.homeTitle')
    } catch (e) {
      return t('meta.fallbackTitle', 'Salento a la Mano | Mapa turístico de Salento, Quindío')
    }
  }, [selectedPlace, selectedCategoryPage, language])

  const helmetDescription = useMemo(() => {
    try {
      if (selectedPlace) {
        const desc = (selectedPlace.description || '').slice(0, 140)
        const extras = [selectedPlace.contact?.phone, selectedPlace.contact?.whatsapp ? t('meta.whatsappAvailable', 'WhatsApp disponible') : null, selectedPlace.priceRange].filter(Boolean).join(' · ')
        return t('meta.placeDesc', `${desc || selectedPlace.name} en Salento, Quindío. ${extras}. Reserva directa, sin intermediarios.`).replace('{name}', selectedPlace.name).replace('{desc}', desc || selectedPlace.name).replace('{extras}', extras)
      }
      const effectiveCategory = selectedCategoryPage
      if (effectiveCategory && effectiveCategory !== 'Todo') {
        return t('meta.categoryDesc', `Encuentra y reserva los mejores ${effectiveCategory.toLowerCase()} en Salento, Quindío 2026. Aliados locales verificados, contacto directo, Valle de Cocora, tours de café, cabalgatas y jeeps Willys.`).replace('{cat}', effectiveCategory.toLowerCase())
      }
      return translationService.translate('meta.homeDesc')
    } catch (e) {
      return 'Mapa turístico interactivo de Salento, Quindío. Alojamientos, gastronomía, experiencias y comercio local verificados.'
    }
  }, [selectedPlace, selectedCategoryPage, language])

  const helmetCanonical = useMemo(() => {
    const base = 'https://www.salentoalamano.com'
    const cleanPath = (p: string) => p.split('?')[0].split('#')[0]
    const currentPath = typeof window !== 'undefined' ? cleanPath(window.location.pathname) : '/'
    if (currentPath.startsWith('/paginas-pautantes/') || currentPath.startsWith('/pautantes/')) {
      if (currentPath.endsWith('.html')) return `${base}${currentPath}`
      if (currentPath.endsWith('/')) return `${base}${currentPath}`
      return `${base}${currentPath}/`
    }
    if (selectedPlace) {
      const slug = selectedPlace.name?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return `${base}/paginas-pautantes/${slug}/`
    }
    if (selectedCategoryPage && selectedCategoryPage !== 'Todo') {
      const catSlug = selectedCategoryPage.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return `${base}/categorias/${catSlug}.html`
    }
    if (currentPath === '/' || currentPath === '' || currentPath === '/index.html') return `${base}/`
    if (currentPath.endsWith('/')) return `${base}${currentPath}`
    if (currentPath.endsWith('.html')) return `${base}${currentPath}`
    return `${base}${currentPath.replace(/\/$/, '')}/`
  }, [selectedPlace, selectedCategoryPage])

  // Schema.org dinámico para SEO - Agregado para WSA 2026
  const dynamicSchema = useMemo(() => {
    if (selectedPlace) {
      return schemaService.generatePlaceSchema(selectedPlace, language)
    }
    if (selectedCategoryPage && selectedCategoryPage !== 'Todo') {
      return schemaService.generateCategorySchema(selectedCategoryPage, places)
    }
    return null
  }, [selectedPlace, selectedCategoryPage, language, places])

  // Open Graph dinámico para SEO - Agregado para WSA 2026
  const ogImage = useMemo(() => {
    if (selectedPlace && selectedPlace.photos && selectedPlace.photos.length > 0) {
      return selectedPlace.photos[0]
    }
    if (selectedCategoryPage) {
      // Imágenes por categoría
      const categoryImages: Record<string, string> = {
        'Alojamientos': '/imagenes-salento/1326163558.webp',
        'Restaurantes': '/imagenes-salento/trucha y patacon.webp',
        'Cafés': '/imagenes-salento/destinos-75.webp',
        'Coffee Tours': '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/724493520_18074799854670095_3547519742275705982_n.webp',
        'Experiencias': '/imagenes-salento/valle-cocora-palmas-2.webp',
      }
      return categoryImages[selectedCategoryPage] || '/imagenes-salento/destinos-75.webp'
    }
    return 'https://www.salentoalamano.com/imagenes-salento/destinos-75.webp'
  }, [selectedPlace, selectedCategoryPage])

  const handleProviderSelect = useCallback((providerId: number) => {
    const provider = places.find(p => p.id === providerId)
    if (provider) {
      setSelectedPlace(provider)
    }
  }, [places])
  
  // Función helper para obtener traducciones
  const t = (key: string, fallback?: string) => translationService.translate(key, fallback)

  // Funciones que dependen de 't' - movidas aquí después de su declaración
  // Función para manejar acciones del modal de pautantes - useCallback para performance
  const handleProviderAction = useCallback((providerId: number, action: 'reserve' | 'order' | 'contact') => {
    const provider = places.find(p => p.id === providerId)
    if (!provider) return
    if (!isValidWhatsAppCO(provider?.contact?.whatsapp)) {
      console.warn(`[App][whatsapp] número inválido para ${provider.name}:`, provider.contact.whatsapp)
    }

    switch (action) {
      case 'reserve':
        if (provider.contact.whatsapp) {
          const message = t('wa.reserve', `¡Hola! Quiero hacer una reserva en ${provider.name}. ¿Qué disponibilidad tienen?`).replace('{name}', provider.name)
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
      case 'order':
        if (provider.contact.whatsapp) {
          const message = t('wa.order', `¡Hola! Quiero hacer un pedido con ${provider.name}. ¿Qué tienen disponible?`).replace('{name}', provider.name)
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
      case 'contact':
        if (provider.contact.whatsapp) {
          const message = t('wa.contact', `¡Hola! Me interesan sus servicios. ¿Pueden proporcionar más información?`)
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
    }
  }, [places, t])

  // Pedidos directos por WhatsApp con datos de hotel (flujo de domicilios a hotel) - useCallback para performance
  const handleDirectOrder = useCallback((category: string, hotelInfo?: { name: string; room: string }) => {
    const deliveryCategories = ['restaurantes', 'supermercados']

    // Si es una categoría que requiere entrega a hotel y no hay info de hotel, mostrar modal
    if (deliveryCategories.includes(category) && !hotelInfo) {
      setPendingOrderCategory(category)
      setShowHotelModal(true)
      return
    }

    const categoryMessages = {
      'restaurantes': t('wa.restaurantes', `¡Hola! Quiero hacer un pedido de comida a mi hotel. Hotel: ${hotelInfo?.name || 'No especificado'}, Habitación: ${hotelInfo?.room || 'No especificada'}. ¿Qué tienen disponible?`).replace('{hotel}', hotelInfo?.name || 'No especificado').replace('{room}', hotelInfo?.room || 'No especificada'),
      'supermercados': t('wa.supermercados', `¡Hola! Necesito que me lleven víveres/tiendas a mi hotel. Hotel: ${hotelInfo?.name || 'No especificado'}, Habitación: ${hotelInfo?.room || 'No especificada'}. ¿Qué pueden llevarme?`).replace('{hotel}', hotelInfo?.name || 'No especificado').replace('{room}', hotelInfo?.room || 'No especificada'),
      'transporte': t('wa.transporte', `¡Hola! Necesito transporte. ¿Dónde están ubicados y cuáles son sus tarifas?`),
      'caballos': t('wa.caballos', `¡Hola! Me interesa hacer cabalgatas en el Valle de Cocora. ¿Qué opciones tienen y cuáles son los precios?`),
      'guias': t('wa.guias', `¡Hola! Necesito un guía turístico para Salento. ¿Qué tours ofrecen?`),
      'operadoras': t('wa.operadoras', `¡Hola! Me interesa hacer actividades turísticas en Salento. ¿Qué paquetes tienen?`)
    }

    const message = categoryMessages[category as keyof typeof categoryMessages] || categoryMessages['restaurantes']

    // Buscar el primer contacto disponible de esa categoría
    const categoryPlaces = places.filter(p => p.type.toLowerCase().includes(category.toLowerCase()))
    const contactPlace = categoryPlaces[0]

    if (contactPlace?.contact.whatsapp) {
      if (!isValidWhatsAppCO(contactPlace.contact.whatsapp)) {
        console.warn(`[App][whatsapp] número inválido para ${contactPlace.name}:`, contactPlace.contact.whatsapp)
      }
      const whatsappUrl = `https://wa.me/${contactPlace.contact.whatsapp}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else {
      // Sin número válido — no enviar
      alert(t('wa.noContact'))
    }
  }, [places, t])

  // Manejar el envío del modal de hotel - useCallback para performance
  const handleHotelInfoSubmit = useCallback((hotelInfo: { name: string; room: string; phone?: string }) => {
    if (pendingOrderCategory) {
      handleDirectOrder(pendingOrderCategory, hotelInfo)
      setPendingOrderCategory(null)
    }
    setShowHotelModal(false)
  }, [pendingOrderCategory, handleDirectOrder])

  // Función para cargar datos - movida fuera del useEffect y con useCallback
  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      try { await offlineStorage.initialize() } catch (e) { console.warn('[App] offline init skip:', e) }

      let offlinePlaces: Place[] = []
      let offlineHotels: HotelType[] = []
      try {
        offlinePlaces = await offlineStorage.getPlaces()
        offlineHotels = await offlineStorage.getHotels()
      } catch (e) { console.warn('[App] offline read skip:', e) }

      if (offlinePlaces.length > 0 && offlineHotels.length > 0) {
        console.log('Loading data from offline storage')
        setPlaces(offlinePlaces)
        setHotels(offlineHotels)
      }

      let loadedPlaces: Place[] = offlinePlaces
      let loadedMarkers: MapMarker[] = []
      let loadedHotels: HotelType[] = offlineHotels
      let weatherData: any = null
      let eventsData: any[] = []

      try {
        ;[loadedPlaces, loadedMarkers, loadedHotels, weatherData, eventsData] = await Promise.all([
          dataService.getPlaces(),
          dataService.getMapMarkers(),
          dataService.getHotels(),
          Promise.resolve().then(() => null),
          Promise.resolve().then(() => [] as any[])
        ])
      } catch (e) { console.warn('[App] data fetch partial fail:', e) }

      if (loadedPlaces?.length) setPlaces(loadedPlaces)
      if (loadedMarkers?.length) setMapMarkers(loadedMarkers)
      if (loadedHotels?.length) setHotels(loadedHotels)
      if (weatherData) setWeather(weatherData)
      if (eventsData?.length) setTodayEvents(eventsData)

      try {
        if (loadedPlaces?.length) await offlineStorage.savePlaces(loadedPlaces)
        if (loadedHotels?.length) await offlineStorage.saveHotels(loadedHotels)
      } catch (e) { console.warn('[App] offline save skip:', e) }

      try {
        if (weatherData) notificationsService.generateWeatherAlert(weatherData)
        ;(eventsData || []).forEach((event: any) => notificationsService.generateEventAlert(event))
      } catch (e) { console.warn('[App] notifications skip:', e) }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    initializeAllServicesSafely()
    loadData()

    // Check for landing page in URL
    try {
      const hash = window.location.hash.replace('#', '')
      if (hash && (hash.startsWith('estado-') || hash.startsWith('hoteles-') || hash.startsWith('valle-') || hash.startsWith('turismo-') || hash.startsWith('transporte-'))) {
        setShowLandingPage(hash)
      }
    } catch (e) { console.warn('[App] URL parse skip:', e) }

    // Monitorear estado de conexión
    let cleanupConnectionListener: (() => void) | null = null
    try {
      cleanupConnectionListener = offlineStorage.onConnectionChange((online) => {
        setIsOffline(!online)
        if (online) {
          console.log('Connection restored, syncing data...')
          // Sincronizar datos frescos del servidor cuando vuelve la conexión
          loadData().then(() => {
            // Forzar actualización de marcadores del mapa
            dataService.getMapMarkers().then(markers => {
              setMapMarkers(markers)
            }).catch(() => {})
          }).catch(() => {})
        }
      })
    } catch (e) { console.warn('[App] connection listener skip:', e) }

    // Cleanup al desmontar
    return () => {
      try { if (cleanupConnectionListener) cleanupConnectionListener() } catch (e) { console.warn('[App] conn cleanup skip:', e) }
      try { cleanupAllServicesSafely() } catch (e) { console.warn('[App] services cleanup skip:', e) }
    }
  }, [loadData])

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const matchesQuick = (place: Place) =>
      quickFilter === 'all'
        || (quickFilter === 'whatsapp' && Boolean(place.contact?.whatsapp))
        || (quickFilter === 'pautante' && Boolean(place.isPautante))
    const matchesCategory = (place: Place) =>
      activeCategory === 'Todo'
        || place.type === activeCategory
        || matchesKeywords(place, CATEGORY_KEYWORDS[activeCategory] || [])
    const matchesSearch = (place: Place) => placeMatchesSearch(place, normalizedSearch)

    const filtered = places.filter((place) => matchesCategory(place) && matchesSearch(place) && matchesQuick(place))
    if (filtered.length === 0 && normalizedSearch && activeCategory !== 'Todo') {
      return places
        .filter((place) => matchesSearch(place) && matchesQuick(place))
        .sort((a, b) => placePriority(b) - placePriority(a))
    }
    return filtered.sort((a, b) => placePriority(b) - placePriority(a))
  }, [activeCategory, search, places, quickFilter])

  useEffect(() => {
    setDirectoryLimit(12)
  }, [activeCategory, search, quickFilter])

  const internationalMarketsPreview = useMemo(() => {
    return internationalSEOService.getInternationalMarkets().slice(0, 8)
  }, [])

  const hoyDateLabel = useMemo(() => {
    try {
      return new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return new Date().toISOString().slice(0, 10)
    }
  }, [])

  const hoyStats = useMemo(() => {
    const count = (type: string) => places.filter(p => p.type === type).length
    return [
      { icon: '☕', label: t('hoy.statCoffee', 'coffee tours'), value: count('Coffee Tours') },
      { icon: '🌿', label: t('hoy.statAttractions', 'atractivos'), value: count('Atractivos Turísticos') },
      { icon: '🍽️', label: t('hoy.statFood', 'lugares para comer'), value: count('Restaurantes') + count('Restaurante Bar') + count('Cafés') },
      { icon: '🏨', label: t('hoy.statStay', 'alojamientos'), value: count('Alojamientos') },
    ]
  }, [places, t])

  const featuredPautantes = useMemo(() => {
    // Prioridad: assets en /pautas/ > orden editorial > resto de pautantes (todos, sin cortar)
    const wanted = ['CocoraTrek', 'Cabalgatas Cocora Magic', 'Moto Aventura 110', 'Finca Don Eduardo Coffee Tour', 'Fonda Boquía', 'Reserva Natural Cascadas de Santa Rita', 'El Recuerdo Coffee Tour']
    const withPautasAssets = places.filter(p => p.isPautante && (p.photos || []).some(src => String(src).startsWith('/pautas/')))
    const byName = withPautasAssets.filter(p => wanted.includes(p.name))
    const byNameRest = withPautasAssets.filter(p => !wanted.includes(p.name))
    const order = [...byName, ...byNameRest]
    const rest = places.filter(p => p.isPautante && !withPautasAssets.includes(p))
    // Home: mostrar un top curado (los de /pautas/ primero) para no saturar.
    // El resto de pautantes se descubre en el Directorio local con el filtro "Verificados".
    const HOME_PAUTANTES_LIMIT = 8
    return [...order, ...rest].slice(0, HOME_PAUTANTES_LIMIT)
  }, [places])

  const todayPlans = useMemo(() => {
    const pick = (types: string[], n: number) =>
      places
        .filter(p => types.includes(p.type))
        .slice()
        .sort((a, b) => (b.isPautante ? 1 : 0) - (a.isPautante ? 1 : 0))
        .slice(0, n)

    return [
      {
        id: 'manana',
        icon: '☕',
        title: t('hoy.morningTitle', 'Mañana activa'),
        desc: t('hoy.morningDesc', 'Coffee tours y miradores con buena luz.'),
        items: pick(['Coffee Tours', 'Atractivos Turísticos'], 3),
        href: '/categorias/coffee-tours.html',
        cta: t('hoy.morningCta', 'Ver coffee tours'),
      },
      {
        id: 'tarde',
        icon: '🌿',
        title: t('hoy.afternoonTitle', 'Tarde de naturaleza'),
        desc: t('hoy.afternoonDesc', 'Senderos, cascadas y experiencias guiadas.'),
        items: pick(['Atractivos Turísticos', 'Experiencias', 'Camping'], 3),
        href: '/categorias/atractivos-turisticos.html',
        cta: t('hoy.afternoonCta', 'Explorar atractivos'),
      },
      {
        id: 'noche',
        icon: '🍽️',
        title: t('hoy.eveningTitle', 'Cierre sabroso'),
        desc: t('hoy.eveningDesc', 'Restaurantes, cafés y bars de la Calle Real.'),
        items: pick(['Restaurantes', 'Restaurante Bar', 'Cafés'], 3),
        href: '/categorias/restaurantes.html',
        cta: t('hoy.eveningCta', 'Dónde comer hoy'),
      },
    ]
  }, [places, t])

  const visibleMarkers = useMemo(() => mapMarkers.filter((marker) => activeCategory === 'Todo' || marker.type === categoryToMapType(activeCategory)), [activeCategory, mapMarkers])

  // Carga diferida del mapa: Leaflet solo se descarga al acercarse a la sección.
  const mapSectionRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)
  useEffect(() => {
    const element = mapSectionRef.current
    if (!element || mapReady) return
    if (typeof IntersectionObserver === 'undefined') {
      setMapReady(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setMapReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '400px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [mapReady])

  const categoryPagePlaces = useMemo(() => {
    if (!selectedCategoryPage || selectedCategoryPage === 'Todo') {
      return places
    }

    const result = places.filter((place) => matchesKeywords(place, CATEGORY_KEYWORDS[selectedCategoryPage] || []))
    return result.sort((a, b) => placePriority(b) - placePriority(a))
  }, [places, selectedCategoryPage])

  // Manejar cambio de idioma — actualiza URL para SEO y shareability - useCallback para performance
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage)
    translationService.setLanguage(newLanguage as any)
    // Update URL to reflect language (SPA-friendly, no full navigation)
    // Las claves de `Language` son minúsculas y solo los locales con carpeta
    // estática propia actualizan la URL (evita 404 en locales sin páginas).
    const localeMap: Partial<Record<Language, string>> = {
      es: '/', en: '/en/', de: '/de/', fr: '/fr/', pt: '/pt/', it: '/it/', zh: '/zh/'
    }
    const newPath = localeMap[newLanguage]
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (newPath) {
        if (url.pathname !== newPath) {
          url.pathname = newPath
          url.searchParams.delete('lang')
          window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
        }
      } else {
        // Sin carpeta estática: enlace compartible vía ?lang=xx
        url.pathname = '/'
        url.searchParams.set('lang', newLanguage)
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
      }
    }
    // GA4 Tracking - Agregado para WSA 2026
    ga4Service.trackLanguageChange(newLanguage, language)
  }, [language])

  const addToCart = useCallback(() => {
    setCartCount((count) => count + 1)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileNav(false)
  }, [])

  const searchService = useCallback((term: string) => {
    setActiveCategory('Todo')
    setSelectedCategoryPage(null)
    setSelectedPlace(null)
    setSearch(term)
    setQuickFilter('all')
    setTimeout(() => scrollToSection('pedidos'), 0)
    // GA4 Tracking - Agregado para WSA 2026
    ga4Service.trackSearch(term, 0, 'all')
  }, [scrollToSection])

  const applyHeroFilter = useCallback((category: Category, term: string, filter: 'all' | 'whatsapp' | 'pautante' = 'all') => {
    setActiveCategory(category)
    setSelectedCategoryPage(null)
    setSelectedPlace(null)
    setSearch(term)
    setQuickFilter(filter)
    setTimeout(() => scrollToSection('pedidos'), 0)
    // GA4 Tracking - Agregado para WSA 2026
    ga4Service.trackCategoryFilter(category)
  }, [scrollToSection])

  // GA4 Tracking wrapper para categoría - Agregado para WSA 2026 - useCallback para performance
  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category)
    ga4Service.trackCategoryFilter(category)
  }, [])

  function scrollToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileNav(false)
    setSelectedCategoryPage(null)
  }

  function goToCategory(category: Category) {
    const categoryPaths: Partial<Record<Category, string>> = {
      Alojamientos: 'alojamientos',
      Restaurantes: 'restaurantes',
      'Restaurante Bar': 'restaurante-bar',
      Cafés: 'cafes',
      Artesanías: 'artesanias',
      Tiendas: 'tiendas',
      'Coffee Tours': 'coffee-tours',
      Experiencias: 'experiencias',
      Eventos: 'eventos',
      'Atractivos Turísticos': 'atractivos-turisticos',
      Servicios: 'servicios',
      Camping: 'camping'
    }
    const categoryPath = categoryPaths[category]
    if (categoryPath) {
      window.location.assign(`/categorias/${categoryPath}.html`)
      return
    }
    setActiveCategory(category)
    setSelectedCategoryPage(category)
    setSelectedPlace(null)
    setMobileNav(false)
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      {/* Skip Links para accesibilidad - navegación por teclado */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <a href="#don-chucho-ai" className="skip-link">
        Ir a Don Chucho IA
      </a>
      <a href="#map-container" className="skip-link">
        Ir al mapa
      </a>
      
      {notFound && <NotFound />}
      {!notFound && (<>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={helmetCanonical} />
        <meta property="og:title" content={helmetTitle} />
        <meta property="og:description" content={helmetDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={helmetCanonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={selectedPlace?.name || 'Salento a la Mano - Mapa turístico de Salento, Quindío'} />
        <meta property="og:site_name" content="Salento a la Mano" />
        <meta property="og:locale" content={currentLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={helmetTitle} />
        <meta name="twitter:description" content={helmetDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={selectedPlace?.name || 'Salento a la Mano - Mapa turístico de Salento, Quindío'} />
        {helmetCanonical === 'https://www.salentoalamano.com/' && (<>
          <link rel="alternate" hrefLang="es-CO" href="https://www.salentoalamano.com/" />
          <link rel="alternate" hrefLang="en" href="https://www.salentoalamano.com/en/" />
          <link rel="alternate" hrefLang="de" href="https://www.salentoalamano.com/de/" />
          <link rel="alternate" hrefLang="fr" href="https://www.salentoalamano.com/fr/" />
          <link rel="alternate" hrefLang="pt-BR" href="https://www.salentoalamano.com/pt/" />
          <link rel="alternate" hrefLang="it" href="https://www.salentoalamano.com/it/" />
          <link rel="alternate" hrefLang="zh-CN" href="https://www.salentoalamano.com/zh/" />
          <link rel="alternate" hrefLang="ja" href="https://www.salentoalamano.com/?lang=ja" />
          <link rel="alternate" hrefLang="ko" href="https://www.salentoalamano.com/?lang=ko" />
          <link rel="alternate" hrefLang="th" href="https://www.salentoalamano.com/?lang=th" />
          <link rel="alternate" hrefLang="vi" href="https://www.salentoalamano.com/?lang=vi" />
          <link rel="alternate" hrefLang="id" href="https://www.salentoalamano.com/?lang=id" />
          <link rel="alternate" hrefLang="ms" href="https://www.salentoalamano.com/?lang=ms" />
          <link rel="alternate" hrefLang="ar" href="https://www.salentoalamano.com/?lang=ar" />
          <link rel="alternate" hrefLang="en-GB" href="https://www.salentoalamano.com/?lang=en-gb" />
          <link rel="alternate" hrefLang="x-default" href="https://www.salentoalamano.com/" />
        </>)}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": helmetTitle,
          "description": helmetDescription,
          "url": helmetCanonical,
          "inLanguage": language,
          "isPartOf": { "@type": "WebSite", "name": "Salento a la Mano", "url": "https://www.salentoalamano.com/" }
        })}</script>
        {/* Schema.org dinámico para SEO - Agregado para WSA 2026 */}
        {dynamicSchema && (
          <script type="application/ld+json">
            {schemaService.schemaToString(dynamicSchema)}
          </script>
        )}
      </Helmet>
      <header className="mobile-header site-header">
        <div className="identity-header">
          <div className="brand-mobile">
            <div className="logo-with-hat">
              <img src="/logo_salento2026.webp" alt="Salento a la Mano - Mapa turístico digital de Salento, Quindío" className="mobile-logo" />
              {isChristmas && <ChristmasHat className="mobile-logo-hat" />}
            </div>
            <div className="brand-text">
              <h1>Salento a la Mano 🇨🇴 - Guía Turística Oficial de Salento, Quindío 2026</h1>
              <p className="subtitle">Descubre hoteles abiertos, restaurantes auténticos, coffee tours, Valle de Cocora, palmas de cera y experiencias únicas con el mapa turístico digital más completo de Salento, Quindío. Tu guía oficial para turismo responsable y directo con locales.</p>
              <p className="no-intermediaries">Información oficial actualizada 2026: Hoteles operativos, vías libres, Valle de Cocora accesible 100%, coffee tours funcionando, senderismo disponible. Turismo seguro y verificado por Salento a la Mano.</p>
            </div>
          </div>
          <div className="location-indicator">
            <MapPin size={16} />
            <span>📍 {t('header.location', 'Estás en Salento')}</span>
            <span className="connection-status">{t('header.connection', 'Conexión activa con aliados oficiales')}</span>
          </div>
        </div>
        <div className="header-actions-mobile">
          <button className="icon-button notifications-trigger" aria-label={t('aria.notifications', 'Notificaciones')} onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={18} />
            <span className="button-label">{t('btn.notifications', 'Notificaciones')}</span>
            {notificationsService.getUnreadCount() > 0 && (
              <span className="notification-badge">{notificationsService.getUnreadCount()}</span>
            )}
          </button>
          <button className="icon-button support-trigger" aria-label={t('aria.support', 'Centro de Soporte')} onClick={() => setShowSupport(true)}>
            <LifeBuoy size={18} />
            <span className="button-label">{t('btn.support', 'Soporte')}</span>
          </button>
          <button className="icon-button qr-share-trigger" aria-label={t('aria.shareQR', 'Compartir QR')} onClick={() => setShowQRShare(true)}>
            <Share2 size={18} />
            <span className="button-label">{t('btn.shareQR', 'Compartir QR')}</span>
          </button>
          <button className="cart-button" onClick={() => setShowCart(true)} aria-label={t('aria.cart', 'Carrito')}>
            <ShoppingBag size={16} />
            <b>{cartCount}</b>
            <span>{t('btn.cart', 'Carrito')}</span>
          </button>
          <button className="header-home-button" onClick={scrollToHome} aria-label={t('aria.home', 'Volver al inicio')}>
            <Home size={18} />
          </button>
          {/* Don Chucho movido al botón flotante */}
          <button className="icon-button mobile-menu" aria-label={t('aria.menu', 'Abrir menú')} onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
          <div className="locale-tools-mobile">
            <select aria-label="Cambiar idioma" value={language} onChange={(event) => handleLanguageChange(event.target.value as Language)}>
              <option value={LanguageConst.es}>ES</option>
              <option value={LanguageConst.en}>EN</option>
              <option value={LanguageConst.fr}>FR</option>
              <option value={LanguageConst.de}>DE</option>
              <option value={LanguageConst.pt}>PT</option>
              <option value={LanguageConst.it}>IT</option>
              <option value={LanguageConst.zh}>中文</option>
              <option value={LanguageConst.ja}>日本語</option>
              <option value={LanguageConst.ko}>한국어</option>
              <option value={LanguageConst.th}>ไทย</option>
              <option value={LanguageConst.vi}>Tiếng Việt</option>
              <option value={LanguageConst.id}>Indonesia</option>
              <option value={LanguageConst.ms}>Melayu</option>
              <option value={LanguageConst.ar}>العربية</option>
              <option value={LanguageConst['en-gb']}>EN-GB</option>
            </select>
            <select aria-label="Cambiar moneda" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="COP">COP</option><option value="USD">USD</option><option value="EUR">EUR</option></select>
          </div>
        </div>

        {mobileNav && (
          <nav className="mobile-nav-panel" aria-label="Navegación móvil">
            <button onClick={() => scrollToSection('inicio')}>{t('nav.home')}</button>
            <button onClick={() => scrollToSection('servicios')}>{t('nav.services')}</button>
            <button onClick={() => goToCategory('Alojamientos')}>{t('nav.lodging')}</button>
            <button onClick={() => scrollToSection('pedidos')}>{t('nav.directory')}</button>
            <button onClick={() => scrollToSection('cafe-premium')}>{t('nav.coffeePremium', 'Café premium')}</button>
            <button onClick={() => scrollToSection('mapa')}>{t('nav.map')}</button>
            <button onClick={() => scrollToSection('pautas')}>{t('nav.ads')}</button>
            <button onClick={() => scrollToSection('guia-offline')}>{t('nav.guideOffline')}</button>
            <button onClick={() => searchService('cabalgata')}>{t('nav.horseback')}</button>
            <button onClick={() => searchService('willys')}>{t('nav.willys')}</button>
            <button onClick={() => searchService('jeep')}>{t('nav.ruralTransport')}</button>
            <button onClick={() => searchService('moto')}>{t('nav.motoRental')}</button>
            <button onClick={() => searchService('cocora')}>{t('nav.cocora')}</button>
          </nav>
        )}
      </header>

      <nav className="tourist-nav sticky-nav" aria-label="Navegación para turistas">
        <button onClick={() => goToCategory('Alojamientos')}>{t('nav.lodging')}</button>
        <button onClick={() => goToCategory('Restaurantes')}>{t('nav.eat')}</button>
        <button onClick={() => goToCategory('Experiencias')}>{t('nav.see')}</button>
        <button onClick={() => scrollToSection('mapa')}>{t('nav.map')}</button>
        <button onClick={() => scrollToSection('cafe-premium')}>{t('nav.coffeePremium', 'Café premium')}</button>
        <button onClick={() => goToCategory('Alojamientos')}>{t('nav.book')}</button>
      </nav>

      {isChristmas && <ChristmasSnow />}

      <div className="international-presence-banner" aria-label={t('intl.aria', 'Mercados internacionales')}>
        <div className="presence-copy">
          <span className="presence-tag">{t('intl.tag', 'Marketing global')}</span>
          <strong>{t('intl.title', 'Salento llega a más mercados')}</strong>
        </div>
        <div className="presence-flags-viewport" aria-label={t('intl.flagsAria', 'Banderas de mercados internacionales')}>
          <div className="presence-flags-track">
            {[0, 1].map((copy) => (
              <div className="presence-flags-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                {internationalMarketsPreview.map((market, index) => (
                  <div key={`${market.country}-${index}`} className="flag-pill" title={`${market.country} · ${market.language}`} aria-label={market.country}>
                    <img
                      className="flag-emoji"
                      src={`https://flagcdn.com/w40/${getCountryFlag(market.country)}.png`}
                      alt={market.country}
                    />
                  </div>
                ))}
                <span className="presence-more" aria-label={copy === 0 ? t('intl.moreAria', 'Más mercados internacionales') : undefined}>
                  +{Math.max(0, internationalSEOService.getInternationalMarkets().length - internationalMarketsPreview.length)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

        <section className={`home-hero ${isChristmas ? 'home-hero--christmas' : ''}`} id="inicio" aria-labelledby="home-hero-title">
          <div className="home-hero-media">
            <img src="/imagenes-salento/destinos-75.webp" srcSet="/imagenes-salento/destinos-75-400.webp 400w, /imagenes-salento/destinos-75-800.webp 800w" sizes="(max-width: 800px) 100vw, 50vw" width={1056} height={760} alt={t('hero.imgAlt', 'Paisaje de Salento y el Valle de Cocora, Quindío')} {...{ fetchpriority: 'high' }} />
            <div className="home-hero-scrim" aria-hidden="true" />
          </div>
          <div className="home-hero-content">
            <p className="eyebrow">{t('hero.eyebrow', 'Guía digital · Salento, Quindío')}</p>
            <h1 id="home-hero-title">
              {(() => {
                const raw = t('hero.title', 'Todo Salento\n<i>en un solo lugar.</i>')
                const [line1, line2] = raw.split('\n')
                return <>{line1}{line2 ? <><br /><em dangerouslySetInnerHTML={{ __html: line2 }} /></> : null}</>
              })()}
            </h1>
            <p className="home-hero-lead">{t('hero.lead', 'Mapa, directorio local y WhatsApp directo con negocios verificados. Sin comisiones, sin intermediarios.')}</p>

            <Suspense fallback={null}>
              <SocialProofTicker />
            </Suspense>

            {/* Banner promocional de función AR */}
            <div className="ar-promo-banner">
              <div className="ar-promo-content">
                <span className="ar-promo-badge">🎯 NUEVO</span>
                <h3>Realidad Aumentada en Salento</h3>
                <p>Apunta tu celular y descubre lugares turísticos en tiempo real con brújula inteligente</p>
              </div>
              <button className="ar-promo-button" onClick={() => scrollToSection('mapa')}>
                Probar AR ahora
              </button>
            </div>

            <form className="home-hero-search search-box" onSubmit={(e) => { e.preventDefault(); searchService(search) }} role="search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('hero.searchPlaceholder', '¿Qué buscas hoy? café, trucha, artesanía…')}
                aria-label={t('hero.searchAria', 'Buscar lugares en Salento')}
              />
              <button type="submit" aria-label={t('hero.searchBtn', 'Buscar')}><ArrowRight size={16} /></button>
            </form>
            <div className="home-hero-chips" role="list" aria-label={t('hero.chipsAria', 'Filtros rápidos')}>
              <button type="button" role="listitem" className={quickFilter === 'all' && activeCategory === 'Todo' && !search ? 'is-active' : ''} onClick={() => applyHeroFilter('Todo', '', 'all')}>{t('hero.chipAll', 'Todo')}</button>
              <button type="button" role="listitem" className={quickFilter === 'whatsapp' ? 'is-active' : ''} onClick={() => applyHeroFilter('Todo', '', 'whatsapp')}>💬 {t('hero.chipWhats', 'Con WhatsApp')}</button>
              <button type="button" role="listitem" onClick={() => applyHeroFilter('Todo', 'café', 'all')}>{t('hero.chipCoffee', 'Café')}</button>
              <button type="button" role="listitem" onClick={() => applyHeroFilter('Todo', 'cocora', 'all')}>{t('hero.chipCocora', 'Valle de Cocora')}</button>
              <button type="button" role="listitem" onClick={() => applyHeroFilter('Restaurantes', '', 'all')}>{t('hero.chipEat', 'Comer')}</button>
              <button type="button" role="listitem" onClick={() => applyHeroFilter('Alojamientos', '', 'all')}>{t('hero.chipStay', 'Dormir')}</button>
            </div>
            <div className="home-hero-actions">
              <button type="button" className="dark-button" onClick={() => scrollToSection('pedidos')}>{t('hero.ctaExplore', 'Explorar directorio')} <ArrowRight size={16} /></button>
              <button type="button" className="outline-button" onClick={() => scrollToSection('mapa')}>{t('hero.ctaMap', 'Ver mapa')}</button>
            </div>
            <div className="home-hero-services" role="list" aria-label={t('hero.servicesAria', 'Servicios rápidos')}>
              <a role="listitem" href="/servicios/pedidos-domicilio.html">🛵 {t('hero.svcDelivery', 'Solicitar domicilios')}</a>
              <a role="listitem" href="/servicios/transporte-salento.html">🚐 {t('hero.svcTransport', 'Necesitas transporte')}</a>
              <a role="listitem" href="/servicios/reservas-hoteles.html">🛏️ {t('hero.svcBooking', 'Realiza tus reservas')}</a>
            </div>
          </div>
        </section>

        {isChristmas && <ChristmasBanner onExploreMap={() => scrollToSection('mapa')} />}

        {showWeatherBanner && weather && (
        <div className={`weather-events-banner ${weather.color}`}>

          <div className="weather-info">
            <span className="weather-icon">{weather.valleCocora.icon}</span>
            <div className="weather-details">
              <span className="weather-temp">Salento: {formatTemp(weather.salento.temperature)} | Valle: {formatTemp(weather.valleCocora.temperature)}</span>
              <span className="weather-recommendation">{weather.recommendation}</span>
            </div>
          </div>
          <div className="events-info">
            {todayEvents.length > 0 && (
              <span className="events-count">🎭 {todayEvents.length} {t('events.available', 'eventos disponibles')}</span>
            )}
            <button className="close-banner" onClick={() => setShowWeatherBanner(false)}><X size={16} /></button>
          </div>
        </div>
      )}

      <main id="main-content">
        {selectedCategoryPage === 'Eventos' ? (
          <section className="category-page-shell" id="category-page" aria-labelledby="events-title">
            <div className="category-page-header">
              <div>
                <p className="eyebrow">{t('events.agenda', 'Agenda Cultural')}</p>
                <h2 id="events-title">{t('events.title', 'Eventos en Salento')}</h2>
              </div>
              <button className="text-button" onClick={() => setSelectedCategoryPage(null)}>{t('events.back', 'Volver al directorio')}</button>
            </div>

            <div className="category-page-summary">
              <span>{todayEvents.length} {t('events.count', 'eventos programados')}</span>
              <strong>{t('events.upcoming', 'Próximos eventos')}</strong>
            </div>

            <div className="place-grid category-page-grid">
              {todayEvents.map((event) => (
                <div key={event.id} className="place-card event-card">
                  <div className="place-image">
                    <div className="place-badge">{event.category === 'food' ? '🍽️' : event.category === 'music' ? '🎵' : event.category === 'culture' ? '🎭' : event.category === 'community' ? '👥' : '🌿'}</div>
                    <div className="image-pattern"></div>
                  </div>
                  <div className="place-info">
                    <h3>{event.title}</h3>
                    <p className="place-description">{event.description}</p>
                    <div className="place-details">
                      <span className="place-meta">📅 {event.date.toLocaleDateString('es-CO', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      <span className="place-meta">⏰ {event.time}</span>
                      <span className="place-meta">📍 {event.location}</span>
                      <span className="place-meta">💰 {event.price}</span>
                    </div>
                    <div className="place-highlights">
                      {event.highlights.map((highlight: string, idx: number) => (
                        <span key={idx} className="highlight-tag">{highlight}</span>
                      ))}
                    </div>
                    <div className="place-actions">
                      <span className="organizer-info">🏢 {event.organizer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : selectedCategoryPage ? (
          <section className="category-page-shell" id="category-page">
            <div className="category-page-header">
              <div>
                <p className="eyebrow">{t('category.label', 'Categoría')}</p>
                <h2>{selectedCategoryPage}</h2>
              </div>
              <button className="text-button" onClick={() => setSelectedCategoryPage(null)}>{t('category.back', 'Volver al directorio')}</button>
            </div>

            <div className="category-page-summary">
              <span>{categoryPagePlaces.length} {t('category.available', 'lugares disponibles')}</span>
              <strong>{selectedCategoryPage}</strong>
            </div>

            <div className="place-grid category-page-grid">
              {categoryPagePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={adaptPlaceForCompatibility(place)}
                  onAdd={addToCart}
                  onOpen={() => window.location.assign(placePageHref(place))}
                  onReviews={() => { setShowReviews(String(place.id)); setSelectedPlaceForReviews({ id: String(place.id), name: place.name, type: place.type }) }}
                />
              ))}
            </div>

            {categoryPagePlaces.length === 0 && (
              <div className="empty-state">{t('category.empty', 'Todavía no hay servicios disponibles en esta categoría. Prueba otra opción del mapa.')}</div>
            )}
          </section>
        ) : loading ? (
          <div className="loading-container">
            <div className="loading-spinner">{t('loading')}</div>
          </div>
        ) : selectedPlace ? <PlaceDetail place={selectedPlace} currency={currency} onBack={() => setSelectedPlace(null)} t={t} onReserveHorseback={() => setShowHorsebackRiding(true)} /> : (
          <>
        <section className="wsa-nomination" id="wsa-nominacion" aria-labelledby="wsa-nomination-title">
          <div className="wsa-nomination-inner">
            <div className="wsa-nomination-media">
              <img
                src="/imagenes-salento/nominacion-wsa-2026.webp"
                alt={t('wsa.imgAlt', 'Sello oficial de nominación de Salento a la Mano a los WSA 2026')}
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="wsa-nomination-body">
              <p className="eyebrow">{t('wsa.eyebrow', 'Orgullo local · WSA 2026')}</p>
              <h2 id="wsa-nomination-title">{t('wsa.title', 'Nominados a los World Summit Awards 2026')}</h2>
              <p>{t('wsa.desc', 'Salento a la Mano fue nominado por Colombia en la categoría Negocios y Comercio de los WSA 2026, el certamen de innovación digital más importante del mundo.')}</p>
              <p className="wsa-nomination-note">{t('wsa.note', 'Tecnología hecha en el Quindío para el mundo.')}</p>
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingFallback />}>
          <HomeBanners />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <FeaturedHomeMenus places={places} />
        </Suspense>

        <section className="direct-orders-banner" id="pedidos-directos" aria-labelledby="direct-orders-title">
          <div className="direct-orders-copy">
            <p className="eyebrow">{t('orders.eyebrow', 'Compra local, directo')}</p>
            <h2 id="direct-orders-title">{t('orders.title', 'Pide, reserva y solicita servicios desde aquí.')}</h2>
            <p>{t('orders.desc', 'Encuentra negocios de Salento, arma tu pedido o reserva y contacta directamente al comerciante por WhatsApp, sin intermediarios ni comisiones por venta.')}</p>
            <div className="direct-orders-actions">
              <button className="dark-button" onClick={() => scrollToSection('pedidos')}><ShoppingBag size={17} /> {t('orders.explore', 'Explorar pedidos')}</button>
              <button className="outline-button" onClick={() => setShowProviderModal(true)}><MessageCircle size={17} /> {t('orders.find', 'Buscar un servicio')}</button>
            </div>
            <small className="cta-microcopy">{t('banner.microcopy')}</small>
            <div className="trust-strip" aria-label={t('trust.aria')}>
              <div className="trust-item"><span className="trust-icon"><Shield size={16} /></span><div><strong>{t('trust.t1t')}</strong><small>{t('trust.t1s')}</small></div></div>
              <div className="trust-item"><span className="trust-icon"><Zap size={16} /></span><div><strong>{t('trust.t2t')}</strong><small>{t('trust.t2s')}</small></div></div>
              <div className="trust-item"><span className="trust-icon"><Star size={16} /></span><div><strong>{t('trust.t3t')}</strong><small>{t('trust.t3s')}</small></div></div>
              <div className="trust-item"><span className="trust-icon"><MessageCircle size={16} /></span><div><strong>{t('trust.t4t')}</strong><small>{t('trust.t4s')}</small></div></div>
            </div>
            <p className="money-promise"><Heart size={13} /> {t('money.promise')}</p>
          </div>
          <div className="direct-orders-points" aria-label={t('orders.aria', 'Beneficios del servicio directo')}>
            <div><span className="direct-orders-icon"><ShoppingBag size={18} /></span><strong>{t('orders.pedidos', 'Pedidos')}</strong><small>{t('orders.pedidosDesc', 'Comida y productos')}</small></div>
            <div><span className="direct-orders-icon"><Clock3 size={18} /></span><strong>{t('orders.reservas', 'Reservas')}</strong><small>{t('orders.reservasDesc', 'Experiencias y hospedaje')}</small></div>
            <div><span className="direct-orders-icon"><Bike size={18} /></span><strong>{t('orders.domicilios', 'Domicilios')}</strong><small>{t('orders.domiciliosDesc', 'Cabecera y alrededores')}</small></div>
          </div>
        </section>

        <Suspense fallback={<LoadingFallback />}>
          <FeatureCards />
        </Suspense>

        <section className="hoy-salento" id="hoy-salento" aria-labelledby="hoy-salento-title">
          <div className="hoy-salento-inner">
            <header className="hoy-salento-header">
              <div>
                <p className="eyebrow">{t('hoy.eyebrow', 'Plan del día · Salento, Quindío')}</p>
                <h2 id="hoy-salento-title">{t('today', 'Hoy en Salento')}</h2>
                <p className="hoy-date">{hoyDateLabel}</p>
                <p className="hoy-subtitle">
                  {weather?.temp != null
                    ? `🌤️ ${Math.round(weather.temp)}°C · ${weather.description || t('hoy.weatherOk', 'Clima apto para salir')}`
                    : t('hoy.weatherTip', 'Llega temprano al Valle, lleva chaqueta ligera y confirma jeeps en la plaza.')}
                </p>
              </div>
              <div className="hoy-actions">
                <a className="dark-button" href="/agenda-eventos-salento.html">{t('events.viewAgenda', 'Ver agenda completa')} <ArrowRight size={16} /></a>
                <button className="outline-button" onClick={() => scrollToSection('pedidos')}>{t('hoy.exploreDirectory', 'Explorar directorio')}</button>
                <button className="outline-button" onClick={() => setShowBusinessDashboard(true)}>{t('hoy.impactDashboard', 'Impacto de la plataforma')} <BarChart3 size={14} /></button>
              </div>
            </header>

            <div className="hoy-stats" aria-label={t('hoy.statsAria', 'Resumen de lugares disponibles hoy')}>
              {hoyStats.map((s) => (
                <div key={s.label} className="hoy-stat">
                  <span className="hoy-stat-icon" aria-hidden="true">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="hoy-plans">
              {todayPlans.map((plan) => (
                <article key={plan.id} className={`hoy-plan hoy-plan-${plan.id}`}>
                  <div className="hoy-plan-top">
                    <span className="hoy-plan-emoji" aria-hidden="true">{plan.icon}</span>
                    <div>
                      <h3>{plan.title}</h3>
                      <p>{plan.desc}</p>
                    </div>
                  </div>
                  <ul className="hoy-plan-list">
                    {plan.items.map((item) => (
                      <li key={item.id}>
                        <span className="hoy-plan-name">{item.name}</span>
                        <small>{item.type}</small>
                      </li>
                    ))}
                    {plan.items.length === 0 && <li className="hoy-plan-empty">{t('hoy.emptyPlan', 'Pronto sumaremos más planes aquí.')}</li>}
                  </ul>
                  <a className="hoy-plan-link" href={plan.href}>{plan.cta} <ArrowRight size={14} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mobile-dashboard" id="servicios">
          <div className="services-grid">
            <button className="service-card accommodation" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.accommodation, serviceTick + 0)})` }} onClick={() => goToCategory('Alojamientos')}>
              <div className="service-icon">🏨</div>
              <div className="service-content">
                <h3>{t('services.accommodation', 'Alojamientos')}</h3>
                <p>{t('services.accommodationDesc', 'Hoteles y hostales')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Alojamientos').length} {t('services.accommodationCount', 'alojamientos')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card gastronomy" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.gastronomy, serviceTick + 1)})` }} onClick={() => goToCategory('Restaurantes')}>
              <div className="service-icon">🍽️</div>
              <div className="service-content">
                <h3>{t('services.gastronomy', 'Gastronomía')}</h3>
                <p>{t('services.gastronomyDesc', 'Restaurantes y cafés')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Restaurantes').length} {t('services.gastronomyCount', 'restaurantes')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card coffee-tour" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.coffeeTour, serviceTick + 10)})` }} onClick={() => goToCategory('Coffee Tours')}>
              <div className="service-badge">☕ {t('services.coffeeTourBadge', 'ESPECIAL')}</div>
              <div className="service-icon">☕</div>
              <div className="service-content">
                <h3>{t('services.coffeeTour', 'Coffee Tour')}</h3>
                <p>{t('services.coffeeTourDesc', 'Fincas y tours de café')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Coffee Tours').length} {t('services.coffeeTourCount', 'coffee tours')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card restaurant-bar" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.restaurantBar, serviceTick + 2)})` }} onClick={() => goToCategory('Restaurante Bar')}>
              <div className="service-icon">🍸</div>
              <div className="service-content">
                <h3>{t('services.restaurantBar', 'Restaurante Bar')}</h3>
                <p>{t('services.restaurantBarDesc', 'Café-bar y coctelería')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Restaurante Bar').length} {t('services.restaurantBarCount', 'restaurantes bar')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card events" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.events, serviceTick + 3)})` }} onClick={() => goToCategory('Eventos')}>
              <div className="service-icon">🎉</div>
              <div className="service-content">
                <h3>{t('services.events', 'Eventos')}</h3>
                <p>{t('services.eventsDesc', 'Salones y celebraciones')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Eventos').length} {t('services.eventsCount', 'eventos')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card horseback-riding featured" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.horseback, serviceTick + 4)})` }} onClick={() => goToCategory('Experiencias')}>
              <div className="service-badge">⭐ {t('services.featured', 'ESPECIAL')}</div>
              <div className="service-icon">🐎</div>
              <div className="service-content">
                <h3>{t('services.horseback', 'Cabalgatas')}</h3>
                <p>{t('services.horsebackDesc', 'Valle de Cocora')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Experiencias').length} {t('services.horsebackCount', 'experiencias')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card guides" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.guides, serviceTick + 5)})` }} onClick={() => goToCategory('Atractivos Turísticos')}>
              <div className="service-icon">🧭</div>
              <div className="service-content">
                <h3>{t('services.attractions', 'Atractivos Turísticos')}</h3>
                <p>{t('services.attractionsDesc', 'Naturaleza y miradores')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Atractivos Turísticos').length} {t('services.attractionsCount', 'atractivos')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card artisan" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.artisan, serviceTick + 6)})` }} onClick={() => goToCategory('Artesanías')}>
              <div className="service-icon">🎨</div>
              <div className="service-content">
                <h3>{t('services.crafts', 'Artesanías')}</h3>
                <p>{t('services.craftsDesc', 'Productos locales')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Artesanías').length} {t('services.craftsCount', 'artesanías')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card commerce" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.commerce, serviceTick + 7)})` }} onClick={() => goToCategory('Tiendas')}>
              <div className="service-icon">🛒</div>
              <div className="service-content">
                <h3>{t('services.shops', 'Tiendas')}</h3>
                <p>{t('services.shopsDesc', 'Comercios locales')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Tiendas').length} {t('services.shopsCount', 'tiendas')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card transport" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.transport, serviceTick + 8)})` }} onClick={() => goToCategory('Servicios')}>
              <div className="service-icon">🚖</div>
              <div className="service-content">
                <h3>{t('services.transport', 'Transporte')}</h3>
                <p>{t('services.transportDesc', 'Jeeps y movilidad')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Servicios').length} {t('services.transportCount', 'servicios')}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card camping" style={{ backgroundImage: `url(${rotateServiceImage(serviceCardImageSets.camping, serviceTick + 9)})` }} onClick={() => goToCategory('Camping')}>
              <div className="service-icon">⛺</div>
              <div className="service-content">
                <h3>{t('services.camping', 'Camping')}</h3>
                <p>{t('services.campingDesc', 'Al aire libre y glamping')}</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{places.filter(p => p.type === 'Camping').length} {t('services.campingCount', 'campings')}</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </section>

        {todayEvents.length > 0 && (
          <section className="events-showcase" id="eventos-showcase">
            <div className="events-showcase-inner">
              <div className="events-showcase-header">
                <div>
                  <p className="eyebrow">{t('events.whatToDo', 'Qué hacer en Salento')}</p>
                  <h2>{t('events.showcaseTitle', 'Eventos en Salento')}</h2>
                  <p className="events-showcase-subtitle">{todayEvents.length} {t('events.upcomingCount', 'eventos próximos')} · {t('events.dateRange', 'Septiembre - Diciembre 2026')}</p>
                </div>
                <a className="dark-button" href="/agenda-eventos-salento.html">{t('events.viewAgenda', 'Ver agenda completa')} <ArrowRight size={17} /></a>
              </div>
              <div className="events-showcase-grid">
                {todayEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="events-showcase-card">
                    <div className={`events-showcase-emoji ${event.category}`}>
                      {event.category === 'food' ? '🍽️' : event.category === 'music' ? '🎵' : event.category === 'culture' ? '🎭' : event.category === 'crafts' ? '🧶' : event.category === 'nature' ? '🌿' : '👥'}
                    </div>
                    <div className="events-showcase-card-body">
                      <span className={`events-showcase-tag ${event.category}`}>
                        {event.category === 'food' ? t('eventCat.food', 'Gastronomía') : event.category === 'music' ? t('eventCat.music', 'Música') : event.category === 'culture' ? t('eventCat.culture', 'Cultura') : event.category === 'crafts' ? t('eventCat.crafts', 'Artesanías') : event.category === 'nature' ? t('eventCat.nature', 'Naturaleza') : t('eventCat.community', 'Comunidad')}
                      </span>
                      <h3>{event.title}</h3>
                      <p>{event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}</p>
                      <div className="events-showcase-meta">
                        <span>📅 {event.date.toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>⏰ {event.time}</span>
                        <span>📍 {event.location.split(',')[0]}</span>
                      </div>
                      <div className="events-showcase-highlights">
                        {event.highlights.slice(0, 2).map((h: string, i: number) => <span key={i}>{h}</span>)}
                      </div>
                    </div>
                    <div className="events-showcase-footer">
                      <span className="organizer-info">🏢 {event.organizer}</span>
                      <span className={`events-showcase-price ${event.isFree ? 'free' : ''}`}>{event.isFree ? `✓ ${t('events.free', 'Gratis')}` : event.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="events-showcase-cta">
                <a className="outline-button" href="/agenda-eventos-salento.html">{t('events.exploreAll', 'Explorar todos los eventos →')}</a>
              </div>
            </div>
          </section>
        )}

          <div className="official-info-section">
            <h3>🛡️ {t('official.title', 'Información Oficial')}</h3>
            <p>{t('official.desc', 'Reportes actualizados del estado de Salento')}</p>
            <div className="official-links">
              <a 
                className="official-link" 
                href="/vias-salento-libres-acceso.html"
              >
                <MapPin size={16} />
                {t('official.vias', 'Estado de Vías')}
              </a>
              <a 
                className="official-link" 
                href="/hoteles-abiertos-salento.html"
              >
                <Hotel size={16} />
                {t('official.alojamientos', 'Alojamientos')}
              </a>
              <a 
                className="official-link" 
                href="/valle-cocora-accesible-100.html"
              >
                <Mountain size={16} />
                {t('official.cocora', 'Valle de Cocora')}
              </a>
              <a 
                className="official-link" 
                href="/seguridad-salento-emergencias.html"
              >
                <Shield size={16} />
                {t('official.security', 'Seguridad')}
              </a>
            </div>
            <p className="authority-note"><Shield size={13} /> {t('authority.note')}</p>
          </div>

        <section className="pautantes-band" id="pautantes" aria-labelledby="pautantes-title">
          <div className="pautantes-band-inner">
            <div className="hoy-pautantes-head">
              <div>
                <p className="eyebrow">{t('hoy.pautantesEyebrow', 'Negocios locales verificados')}</p>
                <h2 id="pautantes-title">{t('hoy.pautantesTitle', 'Reserva directo con pautantes')}</h2>
              </div>
              <p className="hoy-pautantes-note">{t('hoy.pautantesNote', '✓ WhatsApp directo · Sin comisiones · Información verificada en el catálogo local')}</p>
            </div>
            <a className="pautantes-hero-banner" href="/servicios/pedidos-domicilio.html" aria-label="Pedidos a domicilio en Salento">
              <span className="pautantes-hero-banner-badge">Domicilios</span>
              <span className="pautantes-hero-banner-title">Tu comida favorita, en tu hotel</span>
              <span className="pautantes-hero-banner-sub">Entrega directa a alojamientos y puntos turísticos. Sin intermediarios.</span>
              <span className="pautantes-hero-banner-cta">Pedir ahora →</span>
            </a>
            <div className="hoy-pautantes-grid">
              {featuredPautantes.map((place) => {
                const href = placePageHref(place)
                const wa = place.contact?.whatsapp
                const photo = place.photos?.[0]

                return (
                  <article key={place.id} className="hoy-pautante-card">
                    <div className={`hoy-pautante-media ${photo ? 'has-photo' : place.color || 'sage'}`}>
                      {photo && <img src={photo} alt={place.name} loading="lazy" />}
                      {!photo && <span className="hoy-pautante-icon" aria-hidden="true">{place.type === 'Alojamientos' ? '🏨' : place.type === 'Coffee Tours' ? '☕' : place.type === 'Experiencias' ? '🐎' : place.type === 'Camping' ? '⛺' : place.type === 'Restaurantes' || place.type === 'Restaurante Bar' ? '🍽️' : '📍'}</span>}
                      <span className="hoy-pautante-tag">{place.type}</span>
                      {place.parentBrand && <span className="hoy-pautante-parent">{place.parentBrand}</span>}
                    </div>
                    <div className="hoy-pautante-body">
                      <h3>{place.name}</h3>
                      <p>{(place.description || '').slice(0, 110)}{(place.description || '').length > 110 ? '…' : ''}</p>
                      <div className="hoy-pautante-highlights">
                        {place.rating && <span>★ {place.rating}</span>}
                        {place.priceRange && <span>{place.priceRange}</span>}
                        {place.location?.landmark && <span>{place.location.landmark.slice(0, 28)}</span>}
                      </div>
                      <div className="hoy-pautante-actions">
                        <a className="button primary" href={href} onClick={(e) => { if (!place.actionTarget?.viewUrl) { e.preventDefault(); window.location.assign(href) } }}>{t('hoy.viewPautante', placeCtaLabel(place.type))}</a>
                        {wa && (
                          <a className="button" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="directory-load-more">
              <button type="button" className="load-more-button ghost" onClick={() => { setActiveCategory('Todo'); setSearch(''); setQuickFilter('pautante'); scrollToSection('pedidos') }}>
                Ver todos los negocios verificados <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="coffee-premium-banner" id="cafe-premium" aria-labelledby="cafe-premium-title">
          <div className="coffee-premium-inner">
            <div className="coffee-premium-copy">
              <p className="eyebrow">Café · venta directa</p>
              <h2 id="cafe-premium-title">Café premium de Salento, del productor a tu casa</h2>
              <p>Catálogo y precios oficiales de las fincas cafeteras. Pedido directo por WhatsApp, sin intermediarios ni comisiones.</p>
            </div>
            <div className="coffee-premium-products" role="list">
              <span role="listitem"><strong>Café Premium · Don Elías</strong> $50.000</span>
              <span role="listitem"><strong>250 g · El Ocaso</strong> $28.000</span>
              <span role="listitem"><strong>De la finca · El Recuerdo</strong> Consultar</span>
            </div>
            <div className="coffee-premium-actions">
              <a className="button primary" href="/landing/cafe-premium-salento/">Ver catálogo</a>
              <a className="button" href="https://wa.me/573156061113?text=Hola%2C%20quiero%20pedir%20café%20de%20Salento" target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
            </div>
          </div>
        </section>

        <section className="quick-section" id="pedidos">
          <div className="section-heading"><div><p className="eyebrow">{t('nearby')}</p><h2>{t('directory.heading', 'Directorio local')}</h2></div><button className="text-button" onClick={() => { setActiveCategory('Todo'); setSearch(''); setQuickFilter('all'); scrollToSection('pedidos') }}>Ver todo <ArrowRight size={16} /></button></div>
          <div className="directory-search search-box">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('hero.searchPlaceholder', '¿Qué buscas hoy? café, trucha, artesanía…')}
              aria-label={t('hero.searchAria', 'Buscar lugares en Salento')}
            />
            {search && (
              <button type="button" className="directory-search-clear" onClick={() => setSearch('')} aria-label={t('hero.clearSearch', 'Limpiar búsqueda')}><X size={15} /></button>
            )}
          </div>
          <div className="directory-quick-chips" role="list">
            <button type="button" role="listitem" className={quickFilter === 'all' ? 'is-active' : ''} onClick={() => setQuickFilter('all')}>{t('hero.chipAll', 'Todo')}</button>
            <button type="button" role="listitem" className={quickFilter === 'whatsapp' ? 'is-active' : ''} onClick={() => setQuickFilter('whatsapp')}>💬 {t('hero.chipWhats', 'Con WhatsApp')}</button>
            <button type="button" role="listitem" className={quickFilter === 'pautante' ? 'is-active' : ''} onClick={() => setQuickFilter('pautante')}>✓ {t('hero.chipVerified', 'Verificados')}</button>
          </div>
          <div className="category-row">
            {(['Todo', 'Alojamientos', 'Restaurantes', 'Restaurante Bar', 'Cafés', 'Coffee Tours', 'Artesanías', 'Tiendas', 'Experiencias', 'Eventos', 'Atractivos Turísticos', 'Servicios', 'Camping'] as Category[]).map((category) => (
              <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => handleCategoryChange(category)}>
                {category === 'Todo' && <Sparkles size={17} />}{category === 'Alojamientos' && <Hotel size={17} />}{category === 'Restaurantes' && <Utensils size={17} />}{category === 'Restaurante Bar' && <MessageSquare size={17} />}{category === 'Cafés' && <Coffee size={17} />}{category === 'Coffee Tours' && <Coffee size={17} />}{category === 'Artesanías' && <ShoppingBasket size={17} />}{category === 'Tiendas' && <Store size={17} />}{category === 'Experiencias' && <Compass size={17} />}{category === 'Eventos' && <Bell size={17} />}{category === 'Atractivos Turísticos' && <Mountain size={17} />}{category === 'Servicios' && <Bike size={17} />}{category === 'Camping' && <Flame size={17} />}
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
          <div className="directory-intro"><span><MapPin size={16} /> {t('directory.title', 'Directorio local')}</span><small>{filteredPlaces.length} {t('directory.places', 'lugares para descubrir')}</small></div>
          <div className="place-grid">
            {filteredPlaces.slice(0, directoryLimit).map((place) => <PlaceCard key={place.id} place={adaptPlaceForCompatibility(place)} onAdd={addToCart} onOpen={() => window.location.assign(placePageHref(place))} onReviews={() => { setShowReviews(String(place.id)); setSelectedPlaceForReviews({ id: String(place.id), name: place.name, type: place.type }) }} />)}
            {filteredPlaces.length === 0 && <div className="empty-state">{t('directory.empty', 'No encontramos ese plan todavía. Prueba con “café”, “artesanía” o “trucha”.')}</div>}
          </div>
          {filteredPlaces.length > directoryLimit && (
            <div className="directory-load-more">
              <button type="button" className="load-more-button" onClick={() => setDirectoryLimit((limit) => limit + 12)}>
                Ver más lugares ({filteredPlaces.length - directoryLimit} restantes) <ArrowRight size={16} />
              </button>
              <button type="button" className="load-more-button ghost" onClick={() => setDirectoryLimit(filteredPlaces.length)}>
                Ver los {filteredPlaces.length} lugares
              </button>
            </div>
          )}
        </section>

        <section className="home-content-guide" id="guia-salento" aria-labelledby="guia-salento-title">
          <div className="home-content-guide-inner">
            <header className="home-guide-cover">
              <div className="home-guide-cover-copy">
                <p className="eyebrow">Guía práctica de viaje <span>· Quindío, Colombia</span></p>
                <h2 id="guia-salento-title">Salento,<br />a tu manera.</h2>
                <p className="home-content-lead">La guía local para descubrir Cocora, el café y la vida del pueblo. Planea tu visita con información directa y recomendaciones de la comunidad.</p>
                <a className="home-guide-cover-link" href="#como-llegar">Planifica tu visita <span aria-hidden="true">↓</span></a>
              </div>
              <figure className="home-guide-cover-image">
                <img src="/imagenes-salento/colombia-palms.webp" alt="Palmas de cera y paisaje del Valle de Cocora en Salento, Quindío" loading="lazy" width="1200" height="675" />
                <figcaption>Valle de Cocora · Quindío</figcaption>
              </figure>
            </header>
            <div className="home-guide-intro-copy">
            <p>
              El gran reclamo de Salento es el <strong>Valle de Cocora</strong>, a pocos minutos en jeep: un paisaje de selva de niebla atravesado por el río Quindío y flanqueado por las <strong>palmas de cera</strong>, el árbol nacional de Colombia, que superan los 60 metros de altura. En el pueblo, el ritmo lo marcan los <a href="/paginas-pautantes/punto-de-encuentro-jeeps-willys-plaza/">jeeps Willys</a> que parten desde la plaza, los fogones con trucha arcoíris, las fincas cafeteras familiares y una agenda viva de experiencias: coffee tours, cabalgatas, senderismo, cascadas, artesanía y gastronomía de raíz. Además de la ruta clásica al valle, muchos visitantes combinan el mirador del Alto de la Cruz al atardecer, una mañana de siembra y cata en finca, y una tarde lenta por la Calle Real, donde las tiendas de artesanía conviven con heladerías de sabores locales y cafés de especialidad. El clima de altura suaviza las jornadas: mañanas frescas, tardes templadas y noches ideales para cenar con vistas al valle.
            </p>
            <p>
              Esta página reúne lo esencial —cómo llegar, qué hacer y cuándo ir— con enlaces directos a nuestras <a href="/paginas-pautantes/calle-real-de-salento/">páginas de pautantes</a> y a las <a href="/landing/valle-de-cocora-guia/">guías extendidas</a> del sitio para que armes un itinerario claro, real y sin vueltas. También encontrarás referencias a <a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/">fincas de coffee tour verificadas</a>, <a href="/paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre/">senderos con entrada libre</a> al Valle de Cocora y opciones de hospedaje y gastronomía con contacto directo por WhatsApp, sin comisiones de intermediarios. La idea es simple: que llegues con expectativas realistas, vuelvas con historias propias y apoyes a los negocios locales que hacen de Salento un destino con identidad. Si es tu primera visita, empieza por las secciones de transporte y actividades; si ya conoces el pueblo, usa los enlaces a categorías y landings para descubrir rincones menos transitados y planes de temporada baja.
            </p>
            </div>
            <nav className="home-guide-nav" aria-label="Secciones de la guía de Salento">
              <a href="#como-llegar"><span>01</span> Cómo llegar</a>
              <a href="#que-hacer"><span>02</span> Qué hacer</a>
              <a href="#mejor-epoca"><span>03</span> Cuándo visitar</a>
            </nav>

            <section className="home-guide-chapter" aria-labelledby="como-llegar">
            <h2 id="como-llegar">Cómo llegar a Salento</h2>
            <p>
              Salento no tiene aeropuerto comercial propio: la puerta aérea más cercana es el aeropuerto El Edén, en Armenia, y desde allí se llega por carretera en unos 45 a 60 minutos. También se llega por carretera desde los demás puertos aéreos del Eje Cafetero o desde grandes ciudades. Abajo, las rutas más usadas por viajeros y locales, con el aeropuerto El Edén como primera opción.
            </p>

            <h3>Desde el aeropuerto El Edén (Armenia)</h3>
            <p>
              El aeropuerto El Edén (AXM), en Armenia, es la puerta aérea más cercana a Salento: unos 45 a 60 minutos por carretera. La opción más directa es el traslado privado en taxi desde el aeropuerto hasta Salento, con un costo aproximado de $180.000; también puedes tomar transporte hacia el terminal de Armenia y continuar en bus intermunicipal, que dura entre 30 y 45 minutos. Consulta antes de salir el estado de vías en nuestras <a href="/vias-salento-libres-acceso.html">actualizaciones de carreteras</a>.
            </p>

            <h3>Desde Armenia en bus o transporte local</h3>
            <p>
              Desde el terminal de Armenia el trayecto dura entre 30 y 45 minutos según el tráfico de fin de semana. Hay buses y combis frecuentes durante el día; el último regreso conviene confirmarlo en terminal porque varía en temporada alta. Si viajas con maleta grande, reserva espacio con anticipación o considera un traslado privado. Enlace útil: <a href="/landing/hotel-barato-salento/">hoteles y hospedaje económico en Salento</a>.
            </p>

            <h3>En jeep Willys desde la plaza</h3>
            <p>
              Los jeeps Willys son el sistema público de movilidad hacia el Valle de Cocora, Filadelfia y veredas cercanas. Salen desde la Plaza de Bolívar cuando llenan cupo, con tarifas populares por persona. Es la forma más auténtica de moverse y también el mejor preámbulo para el día de senderismo. Puntos de referencia y horarios orientativos en <a href="/paginas-pautantes/punto-de-encuentro-jeeps-willys-plaza/">punto de encuentro de jeeps</a>.
            </p>

            <h3>Desde Bogotá o Medellín</h3>
            <p>
              La opción más práctica es volar a Armenia (AXM) o Pereira (PEI) y continuar por tierra. En bus nocturno o diurno desde Bogotá se suma el trayecto al Eje Cafetero; desde Medellín, buses y vans operan con frecuencia hacia Armenia. Una vez en el corredor cafetero, el resto del viaje es corto y escénico. Planifica alojamiento con tiempo en temporada de puentes: revisa <a href="/hoteles-abiertos-salento.html">hoteles abiertos en Salento</a>.
            </p>
            <figure className="home-content-figure">
              <img src="/imagenes-salento/calle.webp" alt="Calle empedrada del centro histórico de Salento con casas de colores y balcones de guadua" loading="lazy" width="1200" height="800" />
              <figcaption>Centro histórico de Salento: calles empedradas y arquitectura tradicional</figcaption>
            </figure>
            <a className="home-guide-banner" href="/servicios/transporte-salento.html" aria-label="Consulta opciones de transporte en Salento">
              <img src="/banners/banner-servicio-transporte.webp" alt="Transporte en Salento: jeeps, buses y bicicletas con contacto directo" loading="lazy" width="1440" height="900" />
            </a>

            </section>
            <section className="home-guide-chapter" aria-labelledby="que-hacer">
            <h2 id="que-hacer">Qué hacer en Salento</h2>
            <p>
              Con dos o tres días bien distribuidos se combinan naturaleza, café, cultura y descanso. Estas son las experiencias que no deberían faltar en tu ruta, con enlaces a operadores locales verificados del directorio.
            </p>

            <h3>Valle de Cocora y las palmas de cera</h3>
            <p>
              El sendero clásico rodea el río Quindío, cruza puentes colgantes y asciende entre niebla hasta el bosque de los Robles. Completa la vuelta en 4 a 6 horas con ritmo pausado, calzado con agarre y agua. Lleva impermeable ligero: la lluvia corta es parte del paisaje. Opciones guiadas y de entrada libre: <a href="/paginas-pautantes/valle-de-cocora-sendero-de-entrada-libre/">Valle de Cocora por entrada libre</a> y la <a href="/landing/valle-de-cocora-guia/">guía completa del Valle de Cocora</a>.
            </p>
            <a className="home-guide-banner" href="/landing/valle-de-cocora-guia/" aria-label="Explora atractivos y opciones de reserva en Salento">
              <img src="/banners/banner-reservas-atractivos.webp" alt="Reserva con anticipación miradores, reservas naturales y coffee tours en Salento" loading="lazy" width="1440" height="900" />
            </a>

            <h3>Coffee tours en fincas cafeteras</h3>
            <p>
              Un coffee tour de media mañana enseña siembra, cosecha, despulpado y cata, casi siempre en fincas familiares de la zona. Ideal para viajeros que quieren entender el origen del café colombiano más allá de la taza. Reserva directa con pautantes como <a href="/paginas-pautantes/finca-don-eduardo-coffee-tour/">Finca Don Eduardo</a> o explora más opciones en <a href="/landing/coffee-tour-salento-precio/">la guía de coffee tours</a>.
            </p>
            <a className="home-guide-banner" href="/landing/coffee-tour-salento-precio/" aria-label="Descubre coffee tours de origen en Salento">
              <img src="/banners/banner-experiencia-cafe.webp" alt="Experiencia de café de origen en fincas tradicionales de Salento" loading="lazy" width="1440" height="900" />
            </a>

            <h3>Calle Real, Plaza de Bolívar y miradores</h3>
            <p>
              La Calle Real concentra artesanías, heladerías de sabores locales y fachadas fotogénicas. Desde la plaza sube al <a href="/paginas-pautantes/mirador-alto-de-la-cruz/">Alto de la Cruz</a> al atardecer: es la vista clásica de tejados, valle y montañas. Recorre también la <a href="/paginas-pautantes/plaza-de-bolivar-de-salento/">Plaza de Bolívar</a> y la iglesia; la ruta a pie toma menos de una hora si no te detienes en tiendas.
            </p>

            <h3>Gastronomía local y vida nocturna</h3>
            <p>
              Prueba trucha arcoíris, patacones, arepas de queso, sancocho y el café de la región. Para reservar o pedir sin intermediarios, usa las fichas de <a href="/categorias/restaurantes.html">restaurantes en Salento</a> y destinos como <a href="/paginas-pautantes/restaurante-don-elias/">Al Sabor de la Leña</a> o <a href="/paginas-pautantes/fonda-boquia/">Fonda Boquia</a>. La noche es tranquila: bares con música en vivo y terrazas, sin el ruido de las grandes ciudades. Más ideas en <a href="/landing/mejor-trucha-salento/">dónde comer la mejor trucha</a>.
            </p>
            <figure className="home-content-figure">
              <img src="/imagenes-salento/valle-cocora-palmas-2.webp" alt="Palmas de cera gigantes en el Valle de Cocora, árbol nacional de Colombia, entre neblina" loading="lazy" width="1200" height="800" />
              <figcaption>Palmas de cera en el Valle de Cocora, atravesadas por senderos de niebla</figcaption>
            </figure>

            </section>
            <section className="home-guide-chapter" aria-labelledby="mejor-epoca">
            <h2 id="mejor-epoca">Mejores épocas para visitar Salento</h2>
            <p>
              Salento se puede visitar todo el año; lo que cambia es el clima, la densidad de viajeros y el estado de los senderos. Estas ventanas de tiempo ayudan a elegir según tu prioridad: fotos, festival o tranquilidad.
            </p>

            <h3>Diciembre a marzo: temporada seca y claro de estrellas</h3>
            <p>
              Los meses secos suelen dar las mañanas más despejadas para el Valle de Cocora y los miradores. Es alta temporada navideña y de vacaciones colombianas: reserva alojamiento con anticipación y espera más movimiento en el centro. Buen momento para combinar trekking y fotos largas al atardecer. Opciones de hospedaje: <a href="/landing/hotel-barato-salento/">guía de hoteles</a>.
            </p>

            <h3>Julio y agosto: vacaciones y ambiente local</h3>
            <p>
              En julio y agosto el pueblo se llena de familias colombianas; los jeeps trabajan a full y las fincas ofrecen más cupos. Las lluvias de la tarde son habituales pero cortas. Ideal si te gusta el bullicio, los grupos de coffee tour completos y la vida de plaza al anochecer. Consulta el estado de los atractivos en <a href="/valle-cocora-accesible-100.html">Valle de Cocora accesible</a>.
            </p>

            <h3>Temporada de lluvias: verde intenso y menos gente</h3>
            <p>
              Abril–mayo y octubre–noviembre traen más precipitación. El paisaje se vuelve más verde, las cascadas ganan caudal y hay menos filas en los senderos. Lleva funda impermeable para el celular, capas técnicas y un plan B de museo, cafés o <a href="/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/">Cascadas de Santa Rita</a> cuando el aguacero es fuerte.
            </p>

            <h3>Puentes, Semana Santa y ferias</h3>
            <p>
              En Semana Santa, puentes largos y ferias de artesanía el centro se satura; perfecto si buscas ambiente y eventos, menos ideal si quieres senderos en solitario. Revisa la <a href="/categorias/eventos.html">agenda de eventos</a> y llega temprano a la plaza para jeeps y estacionamiento. Para escapadas cortas de fin de semana, usa el plan de <a href="/landing/que-hacer-salento-fin-de-semana/">qué hacer en un fin de semana en Salento</a>.
            </p>
            <a className="home-guide-banner" href="/servicios/reservas-hoteles.html" aria-label="Encuentra hospedajes y reserva directamente en Salento">
              <img src="/banners/banner-reservas.webp" alt="Reserva hoteles y hostales de Salento directamente por WhatsApp" loading="lazy" width="1440" height="900" />
            </a>
            <figure className="home-content-figure">
              <img src="/imagenes-salento/iglesia.webp" alt="Iglesia de Nuestra Señora del Carmen y plaza principal de Salento bajo cielo despejado" loading="lazy" width="1200" height="800" />
              <figcaption>Iglesia y plaza de Salento, punto de partida de la mayoría de rutas</figcaption>
            </figure>

            <div className="home-content-cta">
              <h3>¿Listo para armar tu ruta?</h3>
              <p>
                Explora el <a href="/mapa-interactivo-salento.html">mapa interactivo</a>, filtra por categoría en el directorio de esta misma página o visita directamente las fichas de pautantes con WhatsApp de contacto. Si buscas profundidad, empieza por nuestras guías: <a href="/landing/valle-de-cocora-guia/">Valle de Cocora</a>, <a href="/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html">preguntas frecuentes</a> y <a href="/seguridad-salento-emergencias.html">seguridad y emergencias</a>.
              </p>
            </div>
            </section>
          </div>
        </section>

        <section className="principles-strip"><div><MapPin size={20} /><strong>{t('principles.mapTitle', 'Mapa ligero')}</strong><span>{t('principles.mapDesc', 'Encuentra sin perderte')}</span></div><div><Bike size={20} /><strong>{t('principles.deliveryTitle', 'Entrega local')}</strong><span>{t('principles.deliveryDesc', 'Directo a tu hospedaje')}</span></div><div><MessageCircle size={20} /><strong>{t('principles.barrierTitle', 'Sin barreras')}</strong><span>{t('principles.barrierDesc', 'Idioma y moneda a tu medida')}</span></div><div><Sparkles size={20} /><strong>{t('principles.economyTitle', 'Economía local')}</strong><span>{t('principles.economyDesc', 'Compra directo en Salento')}</span></div></section>

        <section className="offline-guide" id="guia-offline">
          <div className="offline-guide-intro"><p className="eyebrow">{t('offline.signal', 'Cuando baja la señal')}</p><h2>{t('offline.title', 'Salento también\n<i>se lleva guardado.</i>')}</h2><p>{t('offline.desc', 'Consulta estas recomendaciones aunque estés camino al valle y la conexión sea intermitente.')}</p></div>
          <div className="offline-guide-grid"><article><span className="offline-number">01</span><strong>{t('offline.place1Title', 'Valle de Cocora')}</strong><p>{t('offline.place1Desc', 'Sal temprano, lleva agua y confirma el transporte antes de salir.')}</p></article><article><span className="offline-number">02</span><strong>{t('offline.place2Title', 'Cascada Santa Rita')}</strong><p>{t('offline.place2Desc', 'Está a unos minutos a pie desde el pueblo. Usa calzado cómodo.')}</p></article><article><span className="offline-number">03</span><strong>{t('offline.place3Title', 'Ayuda local')}</strong><p><a href="tel:123">{t('offline.emergency1', 'Emergencias 123')}</a><br /><a href="tel:132">{t('offline.emergency2', 'Cruz Roja 132')}</a></p></article></div>
        </section>

        <section className="salento-photo-strip" aria-label={t('photos.aria', 'Paisajes de Salento')}>
          <div className="photo-strip-intro"><p className="eyebrow">{t('photos.eyebrow', 'Postales del territorio')}</p><h2>{t('photos.title', 'Salento se\n<i>camina despacio.</i>')}</h2></div>
          <Suspense fallback={<LoadingFallback />}>
            <PhotoGallery
              label="Paisajes de Salento"
              photos={[
                { src: '/imagenes-salento/destinos-75.webp', alt: 'Valle de Cocora y paisaje de Salento' },
                { src: '/imagenes-salento/colombia-palms.webp', alt: 'Palmas de cera del Eje Cafetero' },
                { src: '/imagenes-salento/valle-cocora-palmas-2.webp', alt: 'Palmas gigantes en el Valle de Cocora' },
                { src: '/imagenes-salento/1326163759.webp', alt: 'Vista panorámica de Salento' },
                { src: '/imagenes-salento/631026720.webp', alt: 'Calle colorida del centro de Salento' },
                { src: '/imagenes-salento/631032744.webp', alt: 'Iglesia y Plaza de Bolívar' },
                { src: '/imagenes-salento/1326163558.webp', alt: 'Tejados tradicionales de Salento' },
                { src: '/imagenes-salento/653410779.webp', alt: 'Palmas de cera del Quindío' },
                { src: '/imagenes-salento/pueblo.webp', alt: 'El pueblo de Salento' },
                { src: '/imagenes-salento/calle.webp', alt: 'Calle empedrada del casco histórico' },
              ]}
            />
          </Suspense>
        </section>

        <section className="image-inventory-section" aria-label={t('gallery.aria', 'Galería de imágenes de Salento')}>
          <div className="section-heading"><div><p className="eyebrow">{t('gallery.eyebrow', 'Imágenes del territorio')}</p><h2>{t('gallery.title', 'Salento en\ncada detalle.')}</h2></div><small>{t('gallery.subtitle', 'Destino, cultura y sabores locales')}</small></div>
          <Suspense fallback={<LoadingFallback />}>
            <PhotoGallery
              label="Galería de imágenes de Salento"
              initialLimit={12}
              photos={salentoImageGallery.map(([file, alt]) => ({ src: `/imagenes-salento/${encodeURIComponent(file)}`, alt }))}
            />
          </Suspense>
        </section>

        <section className="map-section" id="mapa">
          <div className="map-copy"><p className="eyebrow">{t('map.eyebrow', 'Orienta tu paseo')}</p><h2>{t('map')}</h2><p>{t('map.desc', 'Descubre rutas a pie, lugares favoritos y recomendaciones de quienes hacen de Salento su casa.')}</p>
          
          <div className="map-actions">
            <button className="dark-button" onClick={() => window.location.assign('/mapa-interactivo-salento.html')}><span>{t('map.open', 'Abrir mapa completo')}</span> <ArrowRight size={17} /></button>
            <button className="ar-toggle-button" onClick={toggleARMode} aria-label={arMapMode ? 'Desactivar modo AR' : 'Activar modo AR'}>
              {arMapMode ? '🗺️ AR activo' : '🎯 Activar AR'}
            </button>
          </div>
          
          <div className="map-legend"><span><i className="legend-dot coral" />{t('map.favorites', 'Favoritos locales')}</span><span><i className="legend-dot green" />{t('map.discover', 'Para descubrir')}</span></div></div>

          <a href="/servicios/realidad-aumentada.html" className="map-section-banner">
            <img src="/banners/banner-realidad-aumentada.webp" alt="Realidad Aumentada" />
            <div className="map-section-banner-content">
              <h3>🎯 Prueba la Realidad Aumentada</h3>
              <p>Apunta tu celular y descubre lugares turísticos en tiempo real</p>
            </div>
          </a>
          
          {mapReady ? (
            <Suspense fallback={<div className="map-visual map-placeholder" aria-hidden="true">Cargando mapa…</div>}>
              <HomeMap
                markers={visibleMarkers}
                places={places}
                labels={{
                  viewMenu: t('map.viewMenu', 'Ver menú'),
                  viewReserve: t('map.viewReserve', 'Reservar ya'),
                  viewInfo: t('map.viewInfo', 'Ver información')
                }}
                ariaLabel={t('map.visualAria', 'Mapa interactivo de Salento con lugares destacados')}
                onSelectPlace={(place) => {
                  setSelectedPlace(place)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </Suspense>
          ) : (
            <div className="map-visual map-placeholder" ref={mapSectionRef} aria-hidden="true">
              <span>Cargando mapa…</span>
            </div>
          )}
          {arMapMode && (
            <Suspense fallback={<LoadingFallback />}>
              <ARCameraView
                places={places}
                userLocation={userLocation}
                onRequestLocation={requestUserLocation}
                onClose={() => {
                  setARMapMode(false)
                  setUserLocation(null)
                }}
                onPlaceSelect={(place) => {
                  setSelectedPlace(place)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </Suspense>
          )}
        </section>

            <section className="advertising-section" id="pautas"><div><p className="eyebrow">{t('ads.eyebrow', 'Hazte visible en Salento')}</p><h2>{t('ads.title', 'Pautas que llegan\n<i>al lugar correcto.</i>')}</h2><p>{t('ads.desc', 'Tu negocio aparece en el mapa digital, en las búsquedas y frente a turistas listos para comprar o reservar.')}</p></div><div className="advertising-cards"><article><span className="ad-tag">{t('ads.tag1', 'Gastronomía')}</span><strong>{t('ads.card1Title', 'Tu sabor, en el mapa.')}</strong><small>{t('ads.card1Desc', 'Ficha + ubicación + pedidos')}</small></article><article><span className="ad-tag green-tag">{t('ads.tag2', 'Comercio local')}</span><strong>{t('ads.card2Title', 'Lo local se encuentra.')}</strong><small>{t('ads.card2Desc', 'Ficha + ubicación + contacto')}</small></article><article><span className="ad-tag yellow-tag">{t('ads.tag3', 'Experiencias')}</span><strong>{t('ads.card3Title', 'El plan empieza aquí.')}</strong><small>{t('ads.card3Desc', 'Ficha + reservas + rutas')}</small></article></div><button className="dark-button ad-button" onClick={() => alert('Para registrar tu negocio, escríbenos por WhatsApp al +57 317 442 6044')}>{t('ads.register', 'Registra tu negocio')} <ArrowRight size={17} /></button></section>

        <section className="partner-sites-section" aria-label={t('partners.aria', 'Sitios aliados')}>
          <div className="section-heading"><div><p className="eyebrow">{t('partners.eyebrow', 'Red turística del Quindío')}</p><h2>{t('partners.title', 'Sitios aliados\n<i>que complementan tu viaje.</i>')}</h2></div></div>
          <div className="partner-cards">
            <a href="https://www.mapaturisticodelquindio.com" target="_blank" rel="noopener noreferrer" className="partner-card">
              <span className="partner-icon">🗺️</span>
              <strong>{t('partners.mapaTitle', 'Mapa Turístico del Quindío')}</strong>
              <small>{t('partners.mapaDesc', '70+ negocios en todo el departamento · Armenia, Circasia, Calarcá, Filandia y más')}</small>
              <span className="partner-cta">{t('partners.mapaCta', 'Visitar sitio →')}</span>
            </a>
            <a href="https://www.salentoalamano.com" target="_blank" rel="noopener noreferrer" className="partner-card partner-card-active">
              <span className="partner-icon">📍</span>
              <strong>{t('partners.salentoTitle', 'Salento a la Mano')}</strong>
              <small>{t('partners.salentoDesc', 'Foco en Salento · Hoteles, restaurantes, coffee tours y experiencias locales')}</small>
              <span className="partner-cta">{t('partners.salentoCta', 'Estás aquí')}</span>
            </a>
          </div>
        </section>

        <section className="stay-banner" id="experiencias"><div><p className="eyebrow">{t('stay.eyebrow', 'Para tu estadía')}</p><h2>{t('stay.title', 'Que no te cuenten\n<i>el plan completo.</i>')}</h2></div><div className="stay-actions"><p>{t('stay.desc', 'Recibe recomendaciones según tu hospedaje, tus gustos y el tiempo que tienes.')}</p><button className="outline-button" onClick={() => { setActiveCategory('Todo'); scrollToSection('pedidos') }}>{t('stay.cta', 'Personalizar mi visita')} <ArrowRight size={16} /></button></div></section>

        <section className="conservation-section" id="conservacion" style={{background:'linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%)',borderRadius:'16px',padding:'40px 28px',margin:'32px 0'}}>
          <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'center'}}>
            <p className="eyebrow" style={{color:'var(--green,#56755b)'}}>🌿 {t('conservation.eyebrow', 'Tu turismo conserva Salento')}</p>
            <h2 style={{fontSize:'clamp(1.5rem,4vw,2.2rem)',margin:'12px 0 8px'}}>{t('conservation.title', 'Cada visita ayuda a proteger\n<i>el Valle de Cocora y nuestros monumentos.</i>')}</h2>
            <p style={{color:'#697568',lineHeight:'1.7',marginBottom:'24px'}}>{t('conservation.desc', 'Salento es un territorio que depende del turismo responsable. Tu contribución directa financia la conservación del Valle de Cocora, el mantenimiento de la plaza principal y la preservación de la iglesia colonial. Sin intermediarios, sin comisiones.')}</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px',marginBottom:'28px'}}>
              <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e0e0e0'}}>
                <div style={{fontSize:'28px',marginBottom:'8px'}}>🌳</div>
                <strong>{t('conservation.cocora', 'Valle de Cocora')}</strong>
                <p style={{color:'#697568',fontSize:'13px',margin:'4px 0 0'}}>{t('conservation.cocoraDesc', 'Protección de palmas de cera y senderos')}</p>
              </div>
              <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e0e0e0'}}>
                <div style={{fontSize:'28px',marginBottom:'8px'}}>⛪</div>
                <strong>{t('conservation.church', 'Iglesia Colonial')}</strong>
                <p style={{color:'#697568',fontSize:'13px',margin:'4px 0 0'}}>{t('conservation.churchDesc', 'Restauración y mantenimiento histórico')}</p>
              </div>
              <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e0e0e0'}}>
                <div style={{fontSize:'28px',marginBottom:'8px'}}>🏛️</div>
                <strong>{t('conservation.plaza', 'Plaza de Bolívar')}</strong>
                <p style={{color:'#697568',fontSize:'13px',margin:'4px 0 0'}}>{t('conservation.plazaDesc', 'Espacios públicos y mobiliario urbano')}</p>
              </div>
            </div>
            <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
              <button className="dark-button" onClick={() => window.open('https://wa.me/573174426044?text=' + encodeURIComponent(t('conservation.waMessage', 'Quiero contribuir a la conservación de Salento. ¿Cómo puedo donar?')), '_blank')} style={{background:'var(--green,#56755b)',display:'flex',alignItems:'center',gap:'8px'}}>
                <Heart size={17} /> {t('conservation.donate', 'Contribuir ahora')}
              </button>
              <a href="/conservacion-salento.html" className="outline-button" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                {t('conservation.learnMore', 'Conoce más')} <ArrowRight size={16} />
              </a>
            </div>
            <p style={{fontSize:'12px',color:'#999',marginTop:'16px'}}>{t('conservation.note', '100% de tu contribución va directo a la conservación. Salento a la Mano no recibe comisión.')}</p>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="trust-footer">
        <div className="footer-message">
          <p className="footer-title">{t('footer.title', 'Apoyamos la economía circular de Salento')}</p>
          <p className="footer-subtitle">{t('footer.subtitle', 'Precios justos, trato directo y sin comisiones abusivas')}</p>
        </div>
        <div className="footer-brand">
          <span>{t('footer.brand', 'Salento a la mano · Guía comercial y gastronómica')}</span>
          <span>{t('footer.ally', 'Página aliada: ')}<a href="https://www.mapaturisticodelquindio.com" target="_blank" rel="noopener noreferrer" style={{color:'var(--green)',textDecoration:'underline'}}>Mapa Turístico del Quindío</a></span>
          <span>{t('footer.made', 'Hecho con cariño en el Quindío')}</span>
        </div>
      </footer>
      {showCart && <Cart count={cartCount} currency={currency} onClose={() => setShowCart(false)} onAdd={addToCart} hotels={hotels} />}
      <Suspense fallback={<LoadingFallback />}>
        {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
        {showHorsebackRiding && <HorsebackRiding onClose={() => setShowHorsebackRiding(false)} language={language as 'es' | 'en'} />}
        {showReviews && selectedPlaceForReviews && <Reviews placeId={showReviews} placeName={selectedPlaceForReviews.name} placeType={selectedPlaceForReviews.type} onClose={() => setShowReviews(null)} language={language as 'es' | 'en'} />}
        {showSupport && <SupportCenter onClose={() => setShowSupport(false)} language={language as 'es' | 'en'} />}
        {showLandingPage && <DynamicLandingPage slug={showLandingPage} onClose={() => setShowLandingPage(null)} />}
        {/* Don Chucho IA mejorado - producción (fallback al chat local si no hay backend) */}
        {showDonChuchoAI && (
          <EnhancedDonChucho
            language={language}
            t={t}
            places={places}
            onClose={() => setShowDonChuchoAI(false)}
            onFallback={() => {
              setShowDonChuchoAI(false)
              setDonChuchoLocalOpen(true)
            }}
          />
        )}
        {showHotelModal && (
          <HotelInfoModal 
            isOpen={showHotelModal}
            onClose={() => setShowHotelModal(false)}
            onSubmit={handleHotelInfoSubmit}
            hotels={hotels}
            language={language as 'es' | 'en'}
          />
        )}
        {showQRShare && <QRShare onClose={() => setShowQRShare(false)} />}
        {showDefensiveSEODashboard && <DefensiveSEODashboard onClose={() => setShowDefensiveSEODashboard(false)} />}
        {showAllyBacklinksDashboard && <AllyBacklinksDashboard onClose={() => setShowAllyBacklinksDashboard(false)} />}
        {showBusinessDashboard && <Suspense fallback={null}><BusinessDashboard places={places} onClose={() => setShowBusinessDashboard(false)} /></Suspense>}
        {showAllyRegistrationForm && <AllyRegistrationForm onClose={() => setShowAllyRegistrationForm(false)} />}
        {showInternationalMarkets && <InternationalMarketsDisplay onClose={() => setShowInternationalMarkets(false)} />}
        {showLandingPageEstadoActual && <LandingPageEstadoActual onClose={() => setShowLandingPageEstadoActual(false)} />}
        {showLandingPageValleCocora && <LandingPageValleCocora onClose={() => setShowLandingPageValleCocora(false)} />}
        {showLandingPageSalentoSeguro && <LandingPageSalentoSeguro onClose={() => setShowLandingPageSalentoSeguro(false)} />}
        {showLandingPageHoteles && <LandingPageHoteles onClose={() => setShowLandingPageHoteles(false)} />}
        {showLandingPageVias && <LandingPageVias onClose={() => setShowLandingPageVias(false)} />}
        {showProviderModal && selectedCategoryPage && (
          <ProviderSelectionModal
            isOpen={showProviderModal}
            onClose={() => setShowProviderModal(false)}
            category={selectedCategoryPage}
            places={places}
            onDirectOrder={handleProviderAction}
            onProviderSelect={handleProviderSelect}
            language={language as 'es' | 'en'}
          />
        )}
        {showAllyVerification && selectedAllyForVerification && (
          <AllyVerification 
            allyId={selectedAllyForVerification} 
            onClose={() => {
              setShowAllyVerification(false)
              setSelectedAllyForVerification(null)
            }}
            onVerified={(allyId) => {
              console.log('Aliado verificado:', allyId)
            }}
        />
      )}
      </Suspense>
      <div className="floating-nav-toolbar" aria-label={t('aria.quickNav', 'Navegación rápida')}>
        <button className="floating-nav-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={t('aria.scrollTop', 'Subir arriba')}>
          <ArrowUp size={14} />
        </button>
        <button className="floating-nav-button" onClick={scrollToBottom} aria-label={t('aria.scrollBottom', 'Bajar abajo')}>
          <ArrowDown size={14} />
        </button>
      </div>
      <DonChucho
        language={language}
        t={t}
        places={places}
        weather={weather}
        todayEvents={todayEvents}
        open={donChuchoLocalOpen}
        onOpenChange={setDonChuchoLocalOpen}
        onOpenEnhanced={() => {
          setDonChuchoLocalOpen(false)
          setShowDonChuchoAI(true)
        }}
      />
      {isOffline && <div className="offline-status">
        <span className="offline-indicator" />
        {t('offline', 'Modo Offline - Valle de Cocora')}
      </div>}
      </>)}
    </div>
  )
}

function DonChucho({ language, t, places, weather, todayEvents, open: openProp, onOpenChange, onOpenEnhanced }: { language: Language; t: (key: string, fallback?: string) => string; places: Place[]; weather: any; todayEvents: any[]; open?: boolean; onOpenChange?: (open: boolean) => void; onOpenEnhanced?: () => void }) {
  const [openInternal, setOpenInternal] = useState(false)
  const open = openProp ?? openInternal
  const setOpen = (value: boolean) => {
    if (onOpenChange) onOpenChange(value)
    setOpenInternal(value)
  }
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(t('donChucho.welcome', '¡Hola! Soy Don Chucho, arriero quindiano y tu guía local especializado en Salento. Puedo orientarte sobre el Valle de Cocora, los caminos, el café, la cultura y lo práctico para tu visita. ¿Qué quieres descubrir?'))
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showGreeting, setShowGreeting] = useState(true)
  const [relatedPlace, setRelatedPlace] = useState<Place | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', text: string}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [currentIntent, setCurrentIntent] = useState<UserIntent>('general-info')
  const [pendingActions, setPendingActions] = useState<AgentAction[]>([])
  const isEnglish = language === 'en' || language === 'en-gb'
  const kbLang: Language = language
  
  // Nuevos hooks para UX avanzado
  const travelContext = useTravelContext()
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
  const [detailLevel] = useDetailLevel()
  const [showGenerativeUI, setShowGenerativeUI] = useState(false)
  const [speechOn, setSpeechOn] = useState(true)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const quickActionsLabels: Record<string, { label: string; emoji: string; category: string }[]> = {
    es: [
      { label: 'Gastronomía', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Historia', emoji: '📜', category: 'historia' },
      { label: 'Municipios', emoji: '🏘️', category: 'municipios' },
      { label: 'Experiencias', emoji: '🌄', category: 'experiencias' },
      { label: 'Consejos', emoji: '💡', category: 'consejos' },
      { label: 'Festivales', emoji: '🎉', category: 'festivales' }
    ],
    en: [
      { label: 'Gastronomy', emoji: '🍽️', category: 'gastronomia' },
      { label: 'History', emoji: '📜', category: 'historia' },
      { label: 'Municipalities', emoji: '🏘️', category: 'municipios' },
      { label: 'Experiences', emoji: '🌄', category: 'experiencias' },
      { label: 'Practical Tips', emoji: '💡', category: 'consejos' },
      { label: 'Festivals', emoji: '🎉', category: 'festivales' }
    ],
    de: [
      { label: 'Gastronomie', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Geschichte', emoji: '📜', category: 'historia' },
      { label: 'Gemeinden', emoji: '🏘️', category: 'municipios' },
      { label: 'Erlebnisse', emoji: '🌄', category: 'experiencias' },
      { label: 'Tipps', emoji: '💡', category: 'consejos' },
      { label: 'Festivals', emoji: '🎉', category: 'festivales' }
    ],
    fr: [
      { label: 'Gastronomie', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Histoire', emoji: '📜', category: 'historia' },
      { label: 'Communes', emoji: '🏘️', category: 'municipios' },
      { label: 'Expériences', emoji: '🌄', category: 'experiencias' },
      { label: 'Conseils', emoji: '💡', category: 'consejos' },
      { label: 'Festivals', emoji: '🎉', category: 'festivales' }
    ],
    pt: [
      { label: 'Gastronomia', emoji: '🍽️', category: 'gastronomia' },
      { label: 'História', emoji: '📜', category: 'historia' },
      { label: 'Municípios', emoji: '🏘️', category: 'municipios' },
      { label: 'Experiências', emoji: '🌄', category: 'experiencias' },
      { label: 'Dicas', emoji: '💡', category: 'consejos' },
      { label: 'Festivais', emoji: '🎉', category: 'festivales' }
    ],
    it: [
      { label: 'Gastronomia', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Storia', emoji: '📜', category: 'historia' },
      { label: 'Comuni', emoji: '🏘️', category: 'municipios' },
      { label: 'Esperienze', emoji: '🌄', category: 'experiencias' },
      { label: 'Consigli', emoji: '💡', category: 'consejos' },
      { label: 'Festival', emoji: '🎉', category: 'festivales' }
    ],
    ja: [
      { label: 'グルメ', emoji: '🍽️', category: 'gastronomia' },
      { label: '歴史', emoji: '📜', category: 'historia' },
      { label: '町々', emoji: '🏘️', category: 'municipios' },
      { label: '体験', emoji: '🌄', category: 'experiencias' },
      { label: '旅のヒント', emoji: '💡', category: 'consejos' },
      { label: '祭り', emoji: '🎉', category: 'festivales' }
    ],
    ko: [
      { label: '미식', emoji: '🍽️', category: 'gastronomia' },
      { label: '역사', emoji: '📜', category: 'historia' },
      { label: '마을', emoji: '🏘️', category: 'municipios' },
      { label: '체험', emoji: '🌄', category: 'experiencias' },
      { label: '여행 팁', emoji: '💡', category: 'consejos' },
      { label: '축제', emoji: '🎉', category: 'festivales' }
    ],
    ar: [
      { label: 'المأكولات', emoji: '🍽️', category: 'gastronomia' },
      { label: 'التاريخ', emoji: '📜', category: 'historia' },
      { label: 'البلديات', emoji: '🏘️', category: 'municipios' },
      { label: 'التجارب', emoji: '🌄', category: 'experiencias' },
      { label: 'نصائح السفر', emoji: '💡', category: 'consejos' },
      { label: 'المهرجانات', emoji: '🎉', category: 'festivales' }
    ],
    th: [
      { label: 'อาหาร', emoji: '🍽️', category: 'gastronomia' },
      { label: 'ประวัติศาสตร์', emoji: '📜', category: 'historia' },
      { label: 'เมืองต่าง ๆ', emoji: '🏘️', category: 'municipios' },
      { label: 'ประสบการณ์', emoji: '🌄', category: 'experiencias' },
      { label: 'เคล็ดลับการเดินทาง', emoji: '💡', category: 'consejos' },
      { label: 'เทศกาล', emoji: '🎉', category: 'festivales' }
    ],
    vi: [
      { label: 'Ẩm thực', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Lịch sử', emoji: '📜', category: 'historia' },
      { label: 'Các thị trấn', emoji: '🏘️', category: 'municipios' },
      { label: 'Trải nghiệm', emoji: '🌄', category: 'experiencias' },
      { label: 'Mẹo du lịch', emoji: '💡', category: 'consejos' },
      { label: 'Lễ hội', emoji: '🎉', category: 'festivales' }
    ],
    id: [
      { label: 'Kuliner', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Sejarah', emoji: '📜', category: 'historia' },
      { label: 'Kota-kota', emoji: '🏘️', category: 'municipios' },
      { label: 'Pengalaman', emoji: '🌄', category: 'experiencias' },
      { label: 'Tips perjalanan', emoji: '💡', category: 'consejos' },
      { label: 'Festival', emoji: '🎉', category: 'festivales' }
    ],
    ms: [
      { label: 'Masakan', emoji: '🍽️', category: 'gastronomia' },
      { label: 'Sejarah', emoji: '📜', category: 'historia' },
      { label: 'Bandar-bandar', emoji: '🏘️', category: 'municipios' },
      { label: 'Pengalaman', emoji: '🌄', category: 'experiencias' },
      { label: 'Tip perjalanan', emoji: '💡', category: 'consejos' },
      { label: 'Festival', emoji: '🎉', category: 'festivales' }
    ]
  }
  const quickActions = quickActionsLabels[language] || quickActionsLabels.es

  useEffect(() => {
    if (weather && todayEvents.length > 0) {
      const contextualGreeting = getContextualMessage(travelContext)
      setAnswer(contextualGreeting)
    }
  }, [weather, todayEvents, isEnglish, travelContext])

  // Lectura en voz alta de la última respuesta del asistente (texto → voz).
  // Se controla con `speechOn` y respeta el idioma activo de la interfaz.
  // El ref evita repetir la lectura cuando cambian dependencias no ligadas
  // al contenido (p. ej. cuando el navegador termina de cargar las voces).
  const spokenCountRef = useRef(0)
  useEffect(() => {
    if (!speechOn) return
    if (conversationHistory.length <= spokenCountRef.current) return
    const last = conversationHistory[conversationHistory.length - 1]
    spokenCountRef.current = conversationHistory.length
    if (last && last.role === 'assistant' && last.text.trim()) {
      speak(last.text, SPEECH_LOCALES[language])
    }
  }, [conversationHistory, speechOn, language, speak])

  function decorateDonChuchoReply(text: string, baseReply: string): string {
    const query = text.toLowerCase()
    const reply = baseReply.trim()
    if (!reply) return reply

    const naturalOpeners = ['Pues mira,', 'Ay, hermano,', 'Mira nomás,', 'Eso sí te lo digo,', 'Con toda sinceridad,', 'Pues sí,', 'Aja, y aquí va la verdad,']
    const closers = ['¿Te armo la ruta del día?', '¿Quieres que te diga qué te conviene más?', 'Si quieres, te lo dejo más sencillo.', '¿Te ayudo a elegir entre varias opciones?']
    const localizedOpeners: Record<Language, string[]> = {
      es: naturalOpeners,
      en: ['Of course,', 'Here in Salento,', 'Let me help you with that,'],
      fr: ['Bien sûr,', 'À Salento,', 'Je peux vous aider,'],
      de: ['Gern,', 'Hier in Salento,', 'Ich helfe dir gern,'],
      pt: ['Claro,', 'Aqui em Salento,', 'Posso te ajudar,'],
      it: ['Certo,', 'A Salento,', 'Posso aiutarti,'],
      zh: ['当然可以，', '在萨伦托，', '我来为你介绍，'],
      ja: ['はい、', 'サレントでは、', 'お手伝いします、'],
      ko: ['물론이죠,', '살렌토에서는,', '도와드릴게요,'],
      th: ['ได้เลยครับ,', 'ที่ซาเลนโต,', 'ผมช่วยได้ครับ,'],
      vi: ['Tất nhiên,', 'Ở Salento,', 'Tôi có thể giúp bạn,'],
      id: ['Tentu,', 'Di Salento,', 'Saya bisa membantu,'],
      ms: ['Sudah tentu,', 'Di Salento,', 'Saya boleh membantu,'],
      'en-gb': ['Of course,', 'Here in Salento,', 'Let me help you with that,'],
      ar: ['بالطبع،', 'هنا في سالينتو،', 'يمكنني مساعدتك،']
    }
    const localizedClosers: Record<Language, string[]> = {
      es: closers,
      en: ['Would you like help planning your day?', 'Would you like a few options?', 'Can I help with anything else?'],
      fr: ['Souhaitez-vous préparer votre journée ?', 'Voulez-vous quelques options ?', 'Puis-je vous aider autrement ?'],
      de: ['Möchtest du deinen Tag planen?', 'Möchtest du ein paar Optionen?', 'Kann ich dir noch weiterhelfen?'],
      pt: ['Quer planejar seu dia?', 'Quer ver algumas opções?', 'Posso ajudar em mais alguma coisa?'],
      it: ['Vuoi organizzare la tua giornata?', 'Vuoi vedere alcune opzioni?', 'Posso aiutarti con altro?'],
      zh: ['需要我帮你规划一天吗？', '想看看几个选择吗？', '还需要了解其他信息吗？'],
      ja: ['一日のプランをお手伝いしましょうか？', 'いくつか選択肢を見てみますか？', '他に何かお手伝いしましょうか？'],
      ko: ['하루 일정을 도와드릴까요?', '몇 가지 옵션을 볼까요?', '더 도와드릴 게 있을까요?'],
      th: ['ให้ผมช่วยวางแผนวันของคุณไหม?', 'อยากดูตัวเลือกสักสองสามอย่างไหม?', 'มีอะไรให้ช่วยเพิ่มไหม?'],
      vi: ['Bạn có muốn tôi giúp lên kế hoạch cho ngày của bạn không?', 'Bạn có muốn xem vài lựa chọn không?', 'Tôi có thể giúp gì thêm không?'],
      id: ['Ingin saya bantu merencanakan hari Anda?', 'Ingin melihat beberapa pilihan?', 'Ada lagi yang bisa saya bantu?'],
      ms: ['Mahu saya bantu merancang hari anda?', 'Mahu lihat beberapa pilihan?', 'Ada lagi yang boleh saya bantu?'],
      'en-gb': ['Would you like help planning your day?', 'Would you like a few options?', 'Can I help with anything else?'],
      ar: ['هل تريد مساعدة في تخطيط يومك؟', 'هل تريد رؤية بعض الخيارات؟', 'هل أساعدك في شيء آخر؟']
    }
    const openers = localizedOpeners[language]
    const localizedCloserOptions = localizedClosers[language]
    const opener = openers[Math.floor(Math.random() * openers.length)]
    const closer = localizedCloserOptions[Math.floor(Math.random() * localizedCloserOptions.length)]
    const recomendacion = query.includes('recomi') || query.includes('suger') || query.includes('conviene')
    const plan = query.includes('plan') || query.includes('qué hacer') || query.includes('ruta')
    const busquedaLugar = /hotel|restaurante|mirador|cascada|finca|cabalgata|moto|boquía|salento/.test(query)

    if (recomendacion) return `${opener} ${reply} ${closer}`
    if (plan) return `${opener} ${reply} ${closer}`
    if (busquedaLugar) return `${opener} ${reply} ${closer}`
    return `${reply} ${closer}`
  }

  function buildNaturalSuggestions(text: string, isDefensive: boolean): string[] {
    const query = text.toLowerCase()
    if (isDefensive) {
      return [t('donChucho.sugSafeRoute', '¿Te ayudo con la ruta segura?'), t('donChucho.sugHotelOptions', '¿Quieres ver opciones de hoteles?'), t('donChucho.sugRelaxed', '¿Prefieres plan tranquilo?')]
    }
    const spanishSuggestions = {
      hotel: ['¿Te sirve algo más cerca del centro?', '¿Quieres opción con desayuno?', '¿Prefieres algo más tranquilo?'],
      comida: ['¿Te gusta trucha o cocina local?', '¿Quieres algo para almuerzo?', '¿Te conviene algo tipo típico?'],
      mirador: ['¿Te interesa ir al atardecer?', '¿Te lo combino con Cocora?', '¿Quieres ruta corta o más caminata?'],
      cascada: ['¿Quieres la ruta más fácil?', '¿Te interesa ir desde Boquía?', '¿Te sirve algo para ir temprano?'],
      finca: ['¿Te interesa el tour del café?', '¿Quieres reserva o sugerencia?', '¿Te sirve algo más educativo?'],
      default: ['¿Te ayudo con la ruta?', '¿Quieres plan del día?', '¿Quieres algo más tranquilo?']
    }
    const englishSuggestions = {
      hotel: ['Need something closer to town?', 'Would you like breakfast included?', 'Prefer a quieter stay?'],
      food: ['Do you want trout or local dishes?', 'Planning lunch?', 'Interested in something traditional?'],
      viewpoint: ['Do you want sunset?', 'Shall I combine it with Cocora?', 'Short route or a longer walk?'],
      waterfall: ['Want the easiest trail?', 'Do you want a Boquía route?', 'Would you like an early departure?'],
      farm: ['Interested in a coffee tour?', 'Need a reservation tip?', 'Want something more educational?'],
      default: ['Need help with the route?', 'Want a day plan?', 'Prefer a quieter option?']
    }
    if (isEnglish) {
      if (query.includes('hotel') || query.includes('stay')) return englishSuggestions.hotel
      if (query.includes('eat') || query.includes('restaurant') || query.includes('trout')) return englishSuggestions.food
      if (query.includes('mirador') || query.includes('photo') || query.includes('view')) return englishSuggestions.viewpoint
      if (query.includes('waterfall') || query.includes('trail') || query.includes('boquia')) return englishSuggestions.waterfall
      if (query.includes('farm') || query.includes('coffee')) return englishSuggestions.farm
      return englishSuggestions.default
    }
    if (query.includes('hotel') || query.includes('hospedaje')) return spanishSuggestions.hotel
    if (query.includes('comer') || query.includes('restaurante') || query.includes('trucha')) return spanishSuggestions.comida
    if (query.includes('mirador') || query.includes('fotos') || query.includes('vista')) return spanishSuggestions.mirador
    if (query.includes('cascada') || query.includes('sendero') || query.includes('boquía')) return spanishSuggestions.cascada
    if (query.includes('finca') || query.includes('cafe') || query.includes('café')) return spanishSuggestions.finca
    return spanishSuggestions.default
  }

  function ask(text: string, userMessageAlreadyAdded = false) {
    setQuestion(text)
    setShowGreeting(false)
    setRelatedPlace(null)
    setShowQuickActions(false)
    setIsTyping(true)
    if (!userMessageAlreadyAdded) {
      setConversationHistory(prev => [...prev, { role: 'user', text }])
    }
    
    // Track interaction for context-aware UI
    travelContext.trackInteraction(text, detectIntent(text))

    setTimeout(() => {
      // Detectar intención para Generative UI
      const intent = detectIntent(text)
      setCurrentIntent(intent)
      setShowGenerativeUI(intent !== 'general-info' && intent !== 'get-weather')

      // Intentar respuesta agente primero
      const agenticResponse = generateAgenticResponse(text, places, language)
      if (agenticResponse.text && agenticResponse.actions.length > 0) {
        const naturalAnswer = decorateDonChuchoReply(text, agenticResponse.text)
        setAnswer(naturalAnswer)
        setPendingActions(agenticResponse.actions)
        setSuggestions(agenticResponse.followUp || [])
        setIsTyping(false)
        setQuestion('')
        setConversationHistory(prev => [...prev, { role: 'assistant', text: naturalAnswer }])
        return
      }

      const categoryMatch = quickActions.find(a => a.label.toLowerCase() === text.toLowerCase())
      if (categoryMatch) {
        const items = donChuchoKnowledge.getByCategory(categoryMatch.category)
        if (items.length > 0) {
          const randomItem = items[Math.floor(Math.random() * items.length)]
          const answerText = randomItem.answer[kbLang] || randomItem.answer.es
          const adaptedAnswer = adaptDetail(answerText, detailLevel)
          setAnswer(adaptedAnswer)
          setSuggestions(items.slice(0, 3).map(i => i.keywords[0]))
          setIsTyping(false)
          setQuestion('')
          setConversationHistory(prev => [...prev, { role: 'assistant', text: adaptedAnswer }])
          return
        }
      }

      const weatherKeywords = ['clima', 'tiempo', 'lluvia', 'frío', 'calor', 'weather', 'rain', 'cold', 'hot']
      if (weatherKeywords.some(kw => text.toLowerCase().includes(kw)) && weather) {
        const weatherAnswer = t('donChucho.weatherAnswer', `Pues mira, el clima: Salento ${formatTemp(weather.salento.temperature)}, Valle de Cocora ${formatTemp(weather.valleCocora.temperature)}. ${weather.recommendation}`).replace('{temp}', formatTemp(weather.salento.temperature)).replace('{valleTemp}', formatTemp(weather.valleCocora.temperature)).replace('{recommendation}', weather.recommendation)
        setAnswer(weatherAnswer)
        setSuggestions([t('donChucho.sugValle', '¿Para el valle?'), t('donChucho.sugClothes', '¿Qué ropa llevar?'), t('donChucho.sugBestTime', '¿Mejor hora?')])
        setIsTyping(false)
        setQuestion('')
        setConversationHistory(prev => [...prev, { role: 'assistant', text: weatherAnswer }])
        return
      }

      const eventKeywords = ['evento', 'festival', 'actividad', 'qué hacer', 'plan', 'event', 'activity', 'what to do']
      if (eventKeywords.some(kw => text.toLowerCase().includes(kw)) && todayEvents.length > 0) {
        const eventsList = todayEvents.map(event => event.title).join(', ')
        const eventAnswer = t('donChucho.eventAnswer', `Hoy hay ${todayEvents.length} eventos: ${eventsList}. ¡Te recomiendo revisarlos!`).replace('{count}', String(todayEvents.length)).replace('{list}', eventsList)
        setAnswer(eventAnswer)
        setSuggestions([t('donChucho.sugDetails', '¿Más detalles?'), t('donChucho.sugWhere', '¿Dónde son?'), t('donChucho.sugTimes', '¿Horarios?')])
        setIsTyping(false)
        setQuestion('')
        setConversationHistory(prev => [...prev, { role: 'assistant', text: eventAnswer }])
        return
      }

      const contextHints = conversationHistory.slice(-4).map(h => h.text).join(' ').toLowerCase()
      let enrichedQuery = text
      if ((contextHints.includes('comer') || contextHints.includes('trucha')) && (text.includes('también') || text.includes('otro'))) {
        enrichedQuery = text + ' restaurante'
      }
      if ((contextHints.includes('hotel') || contextHints.includes('hospedaje')) && (text.includes('y') || text.includes('cerca'))) {
        enrichedQuery = text + ' hospedaje'
      }

      const knowledgeAnswer = donChuchoKnowledge.getAnswer(enrichedQuery, kbLang)
      if (knowledgeAnswer) {
        const naturalAnswer = decorateDonChuchoReply(text, knowledgeAnswer)
        const adaptedAnswer = adaptDetail(naturalAnswer, detailLevel)
        const isDefensive = donChuchoKnowledge.isDefensiveResponse(text)
        const defensiveActions = donChuchoKnowledge.getDefensiveActions(text)

        // Calcular el texto final (con lugares relacionados) ANTES de
        // mostrarlo y de leerlo en voz alta: display y TTS usan el mismo
        // string, así lo que se ve es lo que se oye.
        let finalAnswer = adaptedAnswer
        const relatedPlaceIds = donChuchoKnowledge.getRelatedPlaces(text)
        if (relatedPlaceIds.length > 0) {
          const relatedPlaces = places.filter(p => relatedPlaceIds.includes(p.id))
          if (relatedPlaces.length > 0) {
            const placeNames = relatedPlaces.map(p => p.name).join(', ')
            finalAnswer = `${adaptedAnswer} ${t('donChucho.relatedPlaces', 'Lugares relacionados:')} ${placeNames}`
            setRelatedPlace(relatedPlaces[0])
          }
        }

        setAnswer(finalAnswer)
        setConversationHistory(prev => [...prev, { role: 'assistant', text: finalAnswer }])

        if (isDefensive) {
          const actionSuggestions = defensiveActions.includes('redirect_routes_landing')
            ? ['Estado de vías', 'Hoteles disponibles', 'Valle de Cocora']
            : ['Ver servicios', 'Contactar comercios', 'Planear visita']
          setSuggestions(isEnglish ? ['Official info', 'Available services', 'Plan visit'] : actionSuggestions)
        } else {
          const followUpSuggestions = donChuchoKnowledge.getFollowUpSuggestions(text, kbLang)
          setSuggestions(followUpSuggestions.length > 0 ? followUpSuggestions : buildNaturalSuggestions(text, false))
        }

        setIsTyping(false)
        setQuestion('')
        return
      }

      // Fallback si no hay respuesta en base de conocimiento
      const fallbackAnswer = isEnglish 
        ? "I'm your local guide. Ask me about food, hotels, tours, or anything about Salento!"
        : "Soy tu guía local de Salento. Pregúntame sobre comida, hoteles, tours o cualquier cosa sobre Salento!"
      setAnswer(fallbackAnswer)
      setSuggestions(['Gastronomía', 'Hoteles', 'Coffee tours', 'Transporte'])
      setIsTyping(false)
      setQuestion('')
      setConversationHistory(prev => [...prev, { role: 'assistant', text: fallbackAnswer }])
    }, 500)
  }

  function handleWhatsAppClick(place: Place) {
    const message = t('donChucho.whatsappMessage', `¡Hola! Estoy interesado en ${place.name}. ¿Me pueden ayudar?`).replace('{name}', place.name)
    const whatsappNumber = place.contact?.whatsapp
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <div className={open ? 'chucho-widget open' : 'chucho-widget'}>
      {open && (
        <div className="chucho-panel">
          <div className="chucho-head">
            <img src="/avatar-don-chucho.webp" alt="Don Chucho" className="chucho-avatar-image" />
            <div>
              <strong>{t('donChucho.title', 'Don Chucho')}</strong>
              <span>{t('donChucho.subtitle', 'Tu guía local en Salento')}</span>
            </div>
            <button
              className="chucho-close"
              onClick={() => {
                setSpeechOn(prev => {
                  if (prev) stopSpeaking()
                  return !prev
                })
              }}
              aria-label={speechOn ? t('donChucho.mute', 'Silenciar voz') : t('donChucho.unmute', 'Activar voz')}
              aria-pressed={speechOn}
            >
              {speechOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="chucho-close" onClick={() => setOpen(false)} aria-label={t('donChucho.close', 'Cerrar asistente')}>
              <X size={18} />
            </button>
          </div>

          <div className="chucho-messages" ref={messagesRef} aria-live="polite" role="log">
            {conversationHistory.length === 0 && answer && (
              <div className="chucho-msg chucho-msg-assistant">
                <MessageCircle size={14} className="chucho-msg-icon" />
                <div className="chucho-bubble chucho-bubble-assistant">{answer}</div>
              </div>
            )}

            {conversationHistory.length === 0 && showQuickActions && (
              <div className="chucho-quick-actions">
                <p className="chucho-quick-title">{isEnglish ? 'What interests you?' : '¿Qué te interesa?'}</p>
                <div className="chucho-quick-grid">
                  {quickActions.map((action, i) => (
                    <button key={i} className="chucho-quick-btn" onClick={() => ask(action.label)}>
                      <span className="chucho-quick-emoji">{action.emoji}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {conversationHistory.map((msg, i) => (
              <div key={i} className={`chucho-msg chucho-msg-${msg.role}`}>
                {msg.role === 'assistant' && <MessageCircle size={14} className="chucho-msg-icon" />}
                <div className={`chucho-bubble chucho-bubble-${msg.role}`}>{msg.text}</div>
              </div>
            ))}

            {showGenerativeUI && conversationHistory.length > 0 && (
              <GenerativeUI
                intent={currentIntent}
                places={places}
                language={language}
                phase={travelContext.phase}
                onPlaceSelect={(place) => {
                  setRelatedPlace(place)
                  ask(place.name)
                }}
                onWhatsApp={(phone, msg) => {
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
                }}
              />
            )}

            {pendingActions.length > 0 && (
              <div className="chucho-actions">
                {pendingActions.map((action, i) => (
                  <button key={i} className="chucho-action-btn" onClick={() => executeAction(action)}>
                    {action.type === 'whatsapp' && <><Phone size={14} /> WhatsApp</>}
                    {action.type === 'call' && <><Phone size={14} /> Llamar</>}
                    {action.type === 'open-map' && <><MapPin size={14} /> Cómo llegar</>}
                    {action.type === 'navigate' && <><Compass size={14} /> Navegar</>}
                    {action.type === 'share' && <><Share2 size={14} /> Compartir</>}
                    {action.type === 'save-favorite' && <><Heart size={14} /> Guardar</>}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="chucho-msg chucho-msg-assistant">
                <MessageCircle size={14} className="chucho-msg-icon" />
                <div className="chucho-bubble chucho-bubble-assistant chucho-typing">
                  <span className="chucho-dot"></span>
                  <span className="chucho-dot"></span>
                  <span className="chucho-dot"></span>
                </div>
              </div>
            )}
          </div>

          {relatedPlace && relatedPlace.contact?.whatsapp && (
            <div className="chucho-whatsapp">
              <button className="whatsapp-button" onClick={() => handleWhatsAppClick(relatedPlace)}>
                <Phone size={16} />{t('donChucho.contact', 'Contactar a')} {relatedPlace.name}
              </button>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="chucho-suggestions">
              {suggestions.map((suggestion, index) => (
                <button key={index} onClick={() => { setConversationHistory(prev => [...prev, { role: 'user', text: suggestion }]); ask(suggestion, true) }}>{suggestion}</button>
              ))}
            </div>
          )}

          <form className="chucho-input-form" onSubmit={(event) => { event.preventDefault(); if (question.trim()) { setConversationHistory(prev => [...prev, { role: 'user', text: question }]); ask(question, true); setQuestion('') } }}>
            <VoiceInput onTranscript={(text) => { setQuestion(text); if (text.trim()) { setConversationHistory(prev => [...prev, { role: 'user', text }]); ask(text, true) } }} language={SPEECH_LOCALES[language]} />
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t('donChucho.placeholder', 'Escribe tu pregunta...')} />
            <button aria-label="Enviar pregunta"><Send size={15} /></button>
          </form>
        </div>
      )}
      <button
        className="chucho-trigger"
        onClick={() => {
          if (onOpenEnhanced) onOpenEnhanced()
          else setOpen(!open)
        }}
        aria-label="Abrir asistente Don Chucho"
      >
        <img src="/don-chucho-boton-128.webp" alt="Don Chucho" width={38} height={38} className="chucho-button-image" />
        {showGreeting && <span className="chucho-greeting">¡Hola, pues!</span>}
      </button>
    </div>
  )
}

function categoryToMapType(category: Category) {
  if (category === 'Restaurantes' || category === 'Restaurante Bar' || category === 'Cafés') return 'Gastronómico'
  if (category === 'Artesanías' || category === 'Tiendas' || category === 'Alojamientos' || category === 'Camping') return 'Comercial'
  return 'Turístico'
}

function PlaceCard({ place, onOpen, onReviews }: { place: Place; onAdd?: () => void; onOpen: () => void; onReviews?: () => void }) {
  const Icon = place.icon
  const stats = reviewsService.getPlaceStats(String(place.id))
  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(place.location?.address || `${place.name} Salento`)}`
  const ctaLabel = placeCtaLabel(place.type)
  const priceFrom = place.priceRange && place.priceRange !== 'Gratis' ? place.priceRange : place.price

  return (
    <article className={`place-card${place.isPautante ? ' is-pautante' : ''}${place.verified ? ' is-verified' : ''}`}>
      <div className={`place-image ${place.color}`}>
        {place.photos?.[0] && <img className="place-photo" src={place.photos[0]} alt={`${place.name} en Salento, Quindío - ${place.type || 'turismo'}`} loading="lazy" />}
        {!place.photos?.[0] && <Icon className="place-icon" size={45} strokeWidth={1.2} aria-hidden="true" />}
        <div className="image-pattern" />
        <span className="place-badge">{place.badge}</span>
        <div className="place-card-flags">
          {place.parentBrand && <span className="place-flag brand-family">{place.parentBrand}</span>}
          {place.isPautante && <span className="place-flag pautante">Pautante</span>}
          {place.verified && !place.isPautante && <span className="place-flag verified">✓ Verificado</span>}
        </div>
        <button className="heart-button" aria-label={`Guardar ${place.name}`}>
          <Heart size={17} />
        </button>
      </div>
      <div className="place-info">
        <div className="place-topline">
          <span>{place.type}</span>
          <span className="rating">
            <Star size={12} fill="currentColor" /> {stats.averageRating || place.rating}
          </span>
        </div>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <div className="place-bottom">
          <span className="place-price">
            <strong>{priceFrom}</strong>
            {place.time && <em> · {place.time}</em>}
          </span>
        </div>
        <button className="detail-button" onClick={onOpen}>{ctaLabel} <ArrowRight size={16} /></button>
        <div className="card-actions-row">
          <a className="map-link-button" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Cómo llegar a ${place.name}`}><MapPin size={14} /> <span className="map-link-label">Cómo llegar</span></a>
          {onReviews && (
            <button className="reviews-button" onClick={onReviews} aria-label={`Ver reseñas de ${place.name}`}>
              <Star size={14} />
              {stats.totalReviews === 0 ? '' : stats.totalReviews}
            </button>
          )}
          <div className="contact-actions">
            {place.contact.whatsapp && (
              <a
                href={`https://wa.me/${place.contact.whatsapp}?text=Hola%20${encodeURIComponent(place.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn whatsapp"
                aria-label={`Contactar ${place.name} por WhatsApp`}
                onClick={() => analyticsService.trackClick(String(place.id), 'whatsapp')}
              >
                <MessageSquare size={15} />
              </a>
            )}
            {place.contact.phone && (
              <a
                href={`tel:${place.contact.phone}`}
                className="contact-btn phone"
                aria-label={`Llamar a ${place.name}`}
                onClick={() => analyticsService.trackClick(String(place.id), 'phone')}
              >
                <Phone size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function PlaceDetail({ place, currency, onBack, t, onReserveHorseback }: { place: Place; currency: Currency; onBack: () => void; t: (key: string, fallback?: string) => string; onReserveHorseback?: () => void }) {
  const photos = place.photos ?? []
  return (
    <section className="place-detail" id={`pautante-${place.id}`}>
      <div className="detail-topbar">
        <button className="back-button detail-back" onClick={() => { window.history.pushState({}, '', '#pedidos'); onBack() }}><ArrowRight size={16} /> {t('detail.back')}</button>
        <span>{place.type}</span>
      </div>
      <div className="detail-heading">
        <div><p className="eyebrow"><span /> {place.verified ? t('detail.verifiedFile') : 'Ficha del lugar'}</p><h1>{place.name}</h1><p>{place.accommodationDetails?.categoryLabel ?? place.foodServiceDetails?.cuisineType?.join(', ') ?? place.type}</p></div>
        <span className="detail-rating"><Star size={15} fill="currentColor" /> {place.rating}</span>
      </div>
      {photos.length > 0 && <Suspense fallback={<LoadingFallback />}><PhotoGallery label={`Fotos de ${place.name}`} photos={photos.map((photo, index) => ({ src: photo, alt: `${place.name}, foto ${index + 1}` }))} /></Suspense>}
      <div className="detail-content">
        <div>
          <p className="eyebrow">Información</p><h2>{t('detail.knowPlace')}</h2>
          <p className="detail-description">{place.accommodationDetails?.description ?? place.description}</p>
          <div className="detail-meta"><span><Clock3 size={16} /> {place.timeInfo}</span><span><MapPin size={16} /> Salento, Quindío</span></div>
        </div>
        <aside className="price-panel">
          <p className="eyebrow">Precios y servicios</p><h2>Opciones disponibles</h2>
          {place.experienceDetails?.tariff && <div className="price-line"><span>Tarifas verificadas</span><strong>{place.experienceDetails.tariff}</strong></div>}
          {place.foodServiceDetails?.averagePrice && <div className="price-line"><span>Precio promedio</span><strong>{place.foodServiceDetails.averagePrice}</strong></div>}
          {place.accommodationDetails?.bookingNotes && <div className="price-line"><span>Tarifas</span><strong>{place.accommodationDetails.bookingNotes}</strong></div>}
          {place.accommodationDetails && <div className="price-line"><span>Check-in / Check-out</span><strong>{place.accommodationDetails.checkIn} / {place.accommodationDetails.checkOut}</strong></div>}
          {place.experienceDetails?.duration && <div className="price-line"><span>Duración</span><strong>{place.experienceDetails.duration}</strong></div>}
          <div className="price-line"><span>Rango de precios</span><strong>{place.priceRange}</strong></div>
          <div className="price-line"><span>Moneda seleccionada</span><strong>{currency}</strong></div>
          <small>El pautante confirma disponibilidad y precio final directamente contigo.</small>
          <div className="detail-actions">
            {place.contact.whatsapp && <a className="dark-button" href={`https://wa.me/${place.contact.whatsapp}?text=Hola%20${encodeURIComponent(place.name)}`} target="_blank" rel="noopener noreferrer"><MessageSquare size={16} /> Consultar por WhatsApp</a>}
            {place.contact.phone && <a className="outline-button" href={`tel:${place.contact.phone}`}><Phone size={16} /> Llamar</a>}
            {place.contact.email && <a className="outline-button" href={`mailto:${place.contact.email}`}><Mail size={16} /> Enviar correo</a>}
          </div>
        </aside>
      </div>
      {place.accommodationDetails && <div className="detail-sections">
        <InfoList title="Servicios y comodidades" items={place.accommodationDetails.services ?? []} />
        <InfoList title="En la habitación" items={place.accommodationDetails.roomFeatures ?? []} />
        <InfoList title="Lugares cercanos" items={place.accommodationDetails.nearby ?? []} />
        <InfoList title="Horarios y políticas" items={place.accommodationDetails.policies ?? []} />
      </div>}
      {place.foodServiceDetails && (
        <div className="detail-sections">
          <Suspense fallback={<LoadingFallback />}>
            <InteractiveMenu
              placeName={place.name}
              whatsapp={place.contact.whatsapp}
              menuHighlights={place.foodServiceDetails.menuHighlights ?? []}
              menuItems={place.foodServiceDetails.menuItems}
              specialties={place.foodServiceDetails.specialties ?? []}
              currency={currency}
            />
          </Suspense>
          <div className="detail-menu-cta">
            <a className="dark-button" href={placePageHref(place)}>{placeCtaLabel(place.type)} <ArrowRight size={15} /></a>
            <small>La carta completa está en la página del restaurante.</small>
          </div>
        </div>
      )}
      {place.experienceDetails && <div className="detail-sections">
        {place.type === 'Experiencias' && onReserveHorseback && (
          <button className="dark-button" onClick={onReserveHorseback}>Reservar experiencia <ArrowRight size={14} /></button>
        )}
        <InfoList title="Incluye" items={place.experienceDetails.included ?? []} />
        <InfoList title="Requisitos" items={place.experienceDetails.requirements ?? []} />
        <InfoList title="Idiomas" items={place.experienceDetails.languages ?? []} />
      </div>}
      {place.sustainability && place.sustainability.length > 0 && <div className="detail-sections">
        <InfoList title="Sostenibilidad verificada" items={place.sustainability} />
      </div>}
    </section>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <section className="info-list"><p className="eyebrow">Información detallada</p><h2>{title}</h2><div className="info-list-items">{items.map((item) => <span key={item}>{item}</span>)}</div></section>
}

function Cart({ count, currency, onClose, onAdd, hotels }: { count: number; currency: Currency; onClose: () => void; onAdd: () => void; hotels: HotelType[] }) {
  const [checkout, setCheckout] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [syncStatus, setSyncStatus] = useState<{ pending: number }>({ pending: 0 })

  // Escuchar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar estado inicial de sincronización

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const hotel = String(data.get('hotel') ?? '')
    const room = String(data.get('room') ?? '')
    const phone = String(data.get('phone') ?? '')
    const directions = String(data.get('directions') ?? '')

    const orderData = {
      hotel,
      room,
      phone,
      directions,
      items: [
        { name: 'Arepa de chocolo con café filtrado', quantity: 1 },
        { name: 'Selección de café local', quantity: 1 }
      ],
      total: formatPrice(48000, currency),
      currency,
      timestamp: new Date().toISOString()
    }

    if (isOffline) {
      // Modo offline: guardar en IndexedDB para sincronizar después
      offlineStorage.saveOrder({
        id: `PEDIDO-SAL-${Date.now()}`,
        timestamp: Date.now(),
        status: 'pending',
        orderData,
        retryCount: 0
      }).catch(err => console.error('Error saving offline order:', err))
      setSubmitted(true)
    } else {
      // Modo online: enviar por WhatsApp directamente
      const message = [
        'Hola, quiero hacer este pedido:',
        '2 productos: 1x Arepa de chocolo con café filtrado y 1x Selección de café local',
        `Entrega: ${hotel} - Habitación ${room}`,
        `Celular: ${phone}`,
        directions ? `Indicaciones: ${directions}` : '',
        `Total estimado: ${formatPrice(48000, currency)}`,
      ].filter(Boolean).join('\n')
      alert('Pedido guardado. Próximamente podrás enviar tu pedido directamente por WhatsApp.')
      setSubmitted(true)
    }
  }

  return <div className="cart-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>{submitted ? <div className="order-success"><div className="success-mark"><Bike size={28} /></div><p className="eyebrow">Pedido recibido</p><h2>Ya vamos en camino.</h2><p>{isOffline ? 'Pedido guardado en modo offline. Se sincronizará cuando haya conexión.' : 'Se abrió WhatsApp con el pedido listo para enviar al comercio.'}</p>{isOffline && syncStatus.pending > 0 && <p className="cart-footnote">{syncStatus.pending} pedidos pendientes de sincronización</p>}<strong className="order-code">PEDIDO #SAL-024</strong><button className="checkout-button" onClick={onClose}>Volver a explorar <ArrowRight size={18} /></button></div> : <><div className="drawer-head"><div><p className="eyebrow">Tu selección</p><h2>{checkout ? '¿Dónde te lo llevamos?' : 'Mi pedido'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar pedido"><X size={20} /></button></div>{isOffline && <div className="offline-warning"><span>⚠️</span>Modo offline activo. El pedido se guardará y sincronizará cuando haya conexión.</div>}{checkout ? <form className="checkout-form" onSubmit={submitOrder}><label>Hotel aliado<select name="hotel" required defaultValue=""><option value="" disabled>Selecciona tu hospedaje</option>{hotels.map(hotel => <option key={hotel.id} value={hotel.name}>{hotel.name}</option>)}</select></label><label>Habitación<input name="room" required placeholder="Ej. 204" /></label><label>Celular de contacto<input name="phone" required type="tel" placeholder="300 000 0000" /></label><label>Indicaciones para llegar<textarea name="directions" placeholder="Recepción, cabaña o punto de encuentro" rows={3} /></label><div className="delivery-note"><Bike size={19} /><span><strong>Pago al recibir</strong><br />El domicilio se confirma contigo antes de salir.</span></div><button className="checkout-button" type="submit">{isOffline ? 'Guardar pedido (offline)' : 'Enviar pedido por WhatsApp'} <MessageSquare size={18} /></button><button className="back-button" type="button" onClick={() => setCheckout(false)}>Volver al resumen</button></form> : <><div className="cart-place"><div className="mini-thumb terracotta"><Coffee size={24} /></div><div><strong>Brunch de Salento</strong><span>Arepa de chocolo · Café filtrado</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="cart-place"><div className="mini-thumb sage"><ShoppingBasket size={24} /></div><div><strong>Canasto Quindiano</strong><span>Selección de café local</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="delivery-note"><Bike size={19} /><span><strong>Entrega en tu hospedaje</strong><br />Calcularemos la tarifa al confirmar tu dirección.</span></div><div className="cart-total"><span>Total estimado</span><strong>{formatPrice(48000, currency)}</strong></div><button className="checkout-button" onClick={() => setCheckout(true)}>Continuar con el pedido <ArrowRight size={18} /></button><p className="cart-footnote">{count} productos seleccionados · Pago al recibir</p></>}</>}</aside></div>
}


// ---------- TIPOS PARA PEDIDO DIRECTO POR WHATSAPP ----------
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta'

export interface OrderItem {
  name: string
  quantity: number
  priceCop: number
  currency: Currency
}

export interface OrderDetails {
  items: OrderItem[]
  totalCop: number
  totalUsd: number
  totalEur: number
  currency: Currency
  address?: string
  paymentMethod?: PaymentMethod
  recipientName?: string
}

// Tipo para el selector de moneda
const currencyLabels: Record<Currency, string> = {
  COP: 'Pesos Colombianos (COP)',
  USD: 'Dólares (USD)',
  EUR: 'Euros (EUR)',
}

// ---------- GENERADOR DE MENSAJE WHATSAPP ----------
function generateWhatsAppMessage(details: OrderDetails): string {
  const { items, totalCop, totalUsd, totalEur, currency, address, paymentMethod, recipientName } = details

  // Buscar el tipo de cambio correspondiente
  let totalDisplay = totalCop
  let currencySymbol = 'COP'

  if (currency === 'USD') {
    totalDisplay = totalUsd
    currencySymbol = 'USD'
  } else if (currency === 'EUR') {
    totalDisplay = totalEur
    currencySymbol = 'EUR'
  }

  // Construir lista de items (solo precio en COP, pero nota sobre moneda)
  const itemsList = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${item.priceCop} ${currencyLabels[item.currency]})`
    )
    .join('\n')

  // Formato del mensaje
  let message = `¡Hola! Quiero hacer un pedido:\n\n`

  message += `🍽️ PEDIDO:\n${itemsList}\n\n`

  message += `💰 TOTAL: ${totalDisplay} ${currencySymbol}\n\n`

  // Dirección
  if (address) {
    message += `📍 DIRECCIÓN: ${address}\n\n`
  }

  // Método de pago
  if (paymentMethod) {
    const methodLabels: Record<PaymentMethod, string> = {
      efectivo: 'Efectivo',
      transferencia: 'Transferencia',
      tarjeta: 'Tarjeta',
    }
    message += `💳 METODO PAGO: ${methodLabels[paymentMethod]}\n\n`
  }

  // A nombre de
  if (recipientName) {
    message += `👤 A NOMBRE DE: ${recipientName}\n`
  }

  return message
}

// ---------- ABRIR WHATSAPP CON MENSAJE PRE-LLENADO ----------
function openWhatsAppWithOrder(place: Place, details: OrderDetails): void {
  const whatsappNumber = place.contact?.whatsapp
  if (!whatsappNumber) {
    console.warn('No hay número de WhatsApp configurado para este lugar')
    return
  }

  const message = generateWhatsAppMessage(details)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

// ---------- ORDENES PARA RESTAURANTES (MENÚ SIMPLE EN COP) ----------
// Definir items de menú por tipo de lugar - precio en COP solo
const getMenuItems = (placeType: string): OrderItem[] => {
  if (placeType.includes('Restaurante') || placeType.includes('Bar')) {
    return [
      { name: 'Trucha frita', priceCop: 28000, currency: 'COP', quantity: 1 },
      { name: 'Trucha a la plancha', priceCop: 28000, currency: 'COP', quantity: 1 },
      { name: 'Mojarra', priceCop: 38000, currency: 'COP', quantity: 1 },
      { name: 'Porción de arroz', priceCop: 4000, currency: 'COP', quantity: 1 },
      { name: 'Porción de ensalada', priceCop: 5000, currency: 'COP', quantity: 1 },
    ]
  } else if (placeType.includes('Café') || placeType.includes('Coffee')) {
    return [
      { name: 'Café negro', priceCop: 3000, currency: 'COP', quantity: 1 },
      { name: 'Café con leche', priceCop: 4000, currency: 'COP', quantity: 1 },
      { name: 'Torta de guayaba', priceCop: 8000, currency: 'COP', quantity: 1 },
      { name: 'Pastel de queso', priceCop: 10000, currency: 'COP', quantity: 1 },
    ]
  } else if (placeType.includes('Alojamiento') || placeType.includes('Hotel')) {
    return [
      { name: 'Habitación doble', priceCop: 50000, currency: 'COP', quantity: 1 },
      { name: 'Desayuno incluido', priceCop: 15000, currency: 'COP', quantity: 1 },
    ]
  }
  return []
}

// ---------- EXPORTAR PARA USO EN COMPONENTES ----------
export { generateWhatsAppMessage, openWhatsAppWithOrder, getMenuItems, currencyLabels }

export default App
