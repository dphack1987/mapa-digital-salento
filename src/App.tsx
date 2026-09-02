import { useMemo, useState, useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bike,
  Bell,
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
  ChevronRight
} from 'lucide-react'
import { Category, Language, Currency, Place, MapMarker, Hotel as HotelType } from './types'
import dataService from './services/dataService'
import translationService from './services/translationService'
import orderSyncService from './services/orderSyncService'
import donChuchoKnowledge from './services/donChuchoKnowledge'
import internationalSEOService from './services/internationalSEO.service'
import InternationalMarketsDisplay from './components/InternationalMarketsDisplay'
import LandingPageEstadoActual from './components/LandingPageEstadoActual'
import LandingPageValleCocora from './components/LandingPageValleCocora'
import LandingPageSalentoSeguro from './components/LandingPageSalentoSeguro'
import LandingPageHoteles from './components/LandingPageHoteles'
import LandingPageVias from './components/LandingPageVias'
import currencyService from './services/currencyService'
import weatherService from './services/weatherService'
import eventsService from './services/eventsService'
import hotelQRService from './services/qrHotelService'
import donationService from './services/donationService'
import gamificationService from './services/gamificationService'
import notificationService from './services/notificationService'
import offlineStorage from './services/offlineStorage'
import NotificationsPanel from './components/NotificationsPanel'
import horsebackRidingService from './services/horsebackRidingService'
import HorsebackRiding from './components/HorsebackRiding'
import reviewsService from './services/reviewsService'
import Reviews from './components/Reviews'
import analyticsService from './services/analyticsService'
import supportService from './services/supportService'
import SupportCenter from './components/SupportCenter'
import seoLandingService from './services/seoLandingService'
import DynamicLandingPage from './components/DynamicLandingPage'
import SEODashboard from './components/SEODashboard'
import HotelInfoModal from './components/HotelInfoModal'
import QRShare from './components/QRShare'
import performanceOptimizer from './services/performanceOptimizer'
import defensiveSEOGService from './services/defensiveSEOG.service'
import DefensiveSEODashboard from './components/DefensiveSEODashboard'
import urgencySchemaService from './services/urgencySchema.service'
import localBacklinksService from './services/localBacklinks.service'
import AllyBacklinksDashboard from './components/AllyBacklinksDashboard'
import allyRegistrationService from './services/allyRegistration.service'
import AllyRegistrationForm from './components/AllyRegistrationForm'
import AllyVerification from './components/AllyVerification'
import notificationsService from './services/notifications.service'
import ProviderSelectionModal from './components/ProviderSelectionModal'

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
  }
  return flags[country] || 'un'
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
    (place as any).commerceDetails?.productTypes?.join(' '),
    (place as any).commerceDetails?.mainProducts?.join(' '),
    (place as any).accommodationDetails?.categoryLabel,
  ].filter(Boolean).join(' ')

  const normalized = normalizePlaceText(searchableText)
  return keywords.some(keyword => normalized.includes(normalizePlaceText(keyword)))
}

function countMatchingPlaces(list: Place[], keywords: string[]): number {
  return list.filter((place) => matchesKeywords(place, keywords)).length
}

// Inicializar servicios
currencyService.initialize()
weatherService.initialize()
eventsService.initialize()
donationService.initialize()
gamificationService.initialize()
horsebackRidingService.initialize()
reviewsService.generateSampleReviews()
analyticsService.initialize()
supportService.initialize()
seoLandingService.initialize()
performanceOptimizer.initialize()
performanceOptimizer.runAutoOptimizations()
defensiveSEOGService.initialize()
urgencySchemaService.initialize()
urgencySchemaService.injectSchemasIntoDOM()
localBacklinksService.initialize()
internationalSEOService.initialize()
allyRegistrationService.initialize()
notificationsService.initialize()

// Inicializar sistema QR con hoteles existentes
hotelQRService.initializeWithHotels([
  { id: '5', name: 'Hotel Camino Nacional' },
  { id: '9', name: 'Finca Hotel El Ocaso' }
])

function formatPrice(cop: number, currency: Currency) {
  return currencyService.formatAmount(currencyService.convertFromCOP(cop, currency), currency)
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todo')
  const [cartCount, setCartCount] = useState(2)
  const [showCart, setShowCart] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [language, setLanguage] = useState<Language>(() => translationService.initialize() as Language)
  const [currency, setCurrency] = useState<Currency>('COP')
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
  const [showDirectOrder, setShowDirectOrder] = useState<string | null>(null) // Para pedidos directos
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [pendingOrderCategory, setPendingOrderCategory] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showQRShare, setShowQRShare] = useState(false)
  const [showDefensiveSEODashboard, setShowDefensiveSEODashboard] = useState(false)
  const [showAllyBacklinksDashboard, setShowAllyBacklinksDashboard] = useState(false)
  const [showAllyRegistrationForm, setShowAllyRegistrationForm] = useState(false)
  const [showInternationalMarkets, setShowInternationalMarkets] = useState(false)
  const [showLandingPageEstadoActual, setShowLandingPageEstadoActual] = useState(false)
  const [showLandingPageValleCocora, setShowLandingPageValleCocora] = useState(false)
  const [showLandingPageSalentoSeguro, setShowLandingPageSalentoSeguro] = useState(false)
  const [showLandingPageHoteles, setShowLandingPageHoteles] = useState(false)
  const [showLandingPageVias, setShowLandingPageVias] = useState(false)
  const [showAllyVerification, setShowAllyVerification] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Función para manejar acciones del modal de pautantes
  const handleProviderAction = (providerId: number, action: 'reserve' | 'order' | 'contact') => {
    const provider = places.find(p => p.id === providerId)
    if (!provider) return

    switch (action) {
      case 'reserve':
        if (provider.contact.whatsapp) {
          const message = isEnglish 
            ? `Hello! I want to make a reservation at ${provider.name}. What availability do you have?`
            : `¡Hola! Quiero hacer una reserva en ${provider.name}. ¿Qué disponibilidad tienen?`
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
      case 'order':
        if (provider.contact.whatsapp) {
          const message = isEnglish
            ? `Hello! I want to place an order with ${provider.name}. What's available?`
            : `¡Hola! Quiero hacer un pedido con ${provider.name}. ¿Qué tienen disponible?`
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
      case 'contact':
        if (provider.contact.whatsapp) {
          const message = isEnglish
            ? `Hello! I'm interested in your services. Can you provide more information?`
            : `¡Hola! Me interesan sus servicios. ¿Pueden proporcionar más información?`
          window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
        }
        break
    }
  }

  const handleProviderSelect = (providerId: number) => {
    const provider = places.find(p => p.id === providerId)
    if (provider) {
      setSelectedPlace(provider)
    }
  }
  const [selectedAllyForVerification, setSelectedAllyForVerification] = useState<string | null>(null)
  
  // Función helper para obtener traducciones
  const t = (key: string, fallback?: string) => translationService.translate(key, fallback)

  // Cargar datos al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Inicializar sistema offline primero
        await offlineStorage.initialize()
        
        // Intentar cargar datos desde offline primero
        const offlinePlaces = await offlineStorage.getPlaces()
        const offlineHotels = await offlineStorage.getHotels()
        
        if (offlinePlaces.length > 0 && offlineHotels.length > 0) {
          console.log('Loading data from offline storage')
          setPlaces(offlinePlaces)
          setHotels(offlineHotels)
        }
        
        // Cargar datos frescos si hay conexión
        const [loadedPlaces, loadedMarkers, loadedHotels, weatherData, eventsData] = await Promise.all([
          dataService.getPlaces(),
          dataService.getMapMarkers(),
          dataService.getHotels(),
          weatherService.getWeatherComparison(),
          Promise.resolve(eventsService.getTodayEvents())
        ])
        
        setPlaces(loadedPlaces)
        setMapMarkers(loadedMarkers)
        setHotels(loadedHotels)
        setWeather(weatherData)
        setTodayEvents(eventsData)
        
        // Guardar datos en caché offline
        await offlineStorage.savePlaces(loadedPlaces)
        await offlineStorage.saveHotels(loadedHotels)
        
        // Generar alertas inteligentes
        if (weatherData) {
          notificationService.generateWeatherAlert(weatherData)
        }
        
        eventsData.forEach((event: any) => {
          notificationService.generateEventAlert(event)
        })
        
        // Iniciar servicio de sincronización de pedidos
        orderSyncService.start()
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback a datos vacíos si falla la carga
        setPlaces([])
        setMapMarkers([])
        setHotels([])
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Check for landing page in URL
    const hash = window.location.hash.replace('#', '')
    if (hash && (hash.startsWith('estado-') || hash.startsWith('hoteles-') || hash.startsWith('valle-') || hash.startsWith('turismo-') || hash.startsWith('transporte-'))) {
      setShowLandingPage(hash)
    }

    // Monitorear estado de conexión
    const cleanupConnectionListener = offlineStorage.onConnectionChange((online) => {
      setIsOffline(!online)
      if (online) {
        console.log('Connection restored, syncing data...')
        // Volver a cargar datos cuando se recupere la conexión
        loadData()
      }
    })

    // Cleanup al desmontar
    return () => {
      orderSyncService.stop()
      cleanupConnectionListener()
    }
  }, [])

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()
    return places.filter((place) => {
      const matchesCategory = activeCategory === 'Todo' || place.type === activeCategory
      const matchesSearch = !normalizedSearch || `${place.name} ${place.description} ${place.tags?.join(' ') || ''}`.toLowerCase().includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search, places])

  const internationalMarketsPreview = useMemo(() => {
    return internationalSEOService.getInternationalMarkets().slice(0, 8)
  }, [])

  const visibleMarkers = useMemo(() => mapMarkers.filter((marker) => activeCategory === 'Todo' || marker.type === categoryToMapType(activeCategory)), [activeCategory, mapMarkers])

  // Manejar cambio de idioma
  function handleLanguageChange(newLanguage: Language) {
    setLanguage(newLanguage)
    translationService.setLanguage(newLanguage as any)
  }

  function addToCart() {
    setCartCount((count) => count + 1)
  }

  function scrollToSection(id: string) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileNav(false)
  }

  function scrollToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileNav(false)
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="mobile-header site-header">
        <div className="identity-header">
          <div className="brand-mobile">
            <img src="/logo_salento2026.png" alt="Salento a la Mano" className="mobile-logo" />
            <div className="brand-text">
              <h1>Salento a la Mano 🇨🇴</h1>
              <p className="subtitle">Tu red de servicios directos en el corazón del Quindío</p>
              <p className="no-intermediaries">Sin intermediarios, trato directo con locales</p>
            </div>
          </div>
          <div className="location-indicator">
            <MapPin size={16} />
            <span>📍 Estás en Salento</span>
            <span className="connection-status">Conexión activa con aliados oficiales</span>
          </div>
        </div>
        <div className="header-actions-mobile">
          <button className="icon-button notification-trigger" aria-label="Notificaciones" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={18} />
            <span className="button-label">Notificaciones</span>
            {notificationService.getUnreadNotifications().length > 0 && (
              <span className="notification-dot" />
            )}
          </button>
          <button className="icon-button support-trigger" aria-label="Centro de Soporte" onClick={() => setShowSupport(true)}>
            <LifeBuoy size={18} />
            <span className="button-label">Soporte</span>
          </button>
          <button className="icon-button notifications-trigger" aria-label="Notificaciones" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={18} />
            <span className="button-label">Notificaciones</span>
            {notificationsService.getUnreadCount() > 0 && (
              <span className="notification-badge">{notificationsService.getUnreadCount()}</span>
            )}
          </button>
          <button className="icon-button qr-share-trigger" aria-label="Compartir QR" onClick={() => setShowQRShare(true)}>
            <Share2 size={18} />
            <span className="button-label">Compartir QR</span>
          </button>
          <button className="cart-button" onClick={() => setShowCart(true)} aria-label="Carrito">
            <ShoppingBag size={16} />
            <b>{cartCount}</b>
            <span>Carrito</span>
          </button>
          <button className="icon-button mobile-menu" aria-label="Abrir menú" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
          <div className="locale-tools-mobile">
            <select aria-label="Cambiar idioma" value={language} onChange={(event) => handleLanguageChange(event.target.value as Language)}>
              <option value={Language.ES}>ES</option>
              <option value={Language.EN}>EN</option>
              <option value={Language.FR}>FR</option>
              <option value={Language.DE}>DE</option>
              <option value={Language.PT}>PT</option>
              <option value={Language.IT}>IT</option>
            </select>
            <select aria-label="Cambiar moneda" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="COP">COP</option><option value="USD">USD</option><option value="EUR">EUR</option></select>
          </div>
        </div>

        {mobileNav && (
          <nav className="mobile-nav-panel" aria-label="Navegación móvil">
            <button onClick={() => scrollToSection('inicio')}>Inicio</button>
            <button onClick={() => scrollToSection('servicios')}>Servicios</button>
            <button onClick={() => scrollToSection('pedidos')}>Directorio</button>
            <button onClick={() => scrollToSection('mapa')}>Mapa</button>
            <button onClick={() => scrollToSection('pautas')}>Pautas</button>
            <button onClick={() => scrollToSection('guia-offline')}>Guía offline</button>
          </nav>
        )}
      </header>

      <nav className="main-nav sticky-nav" aria-label="Navegación principal">
        <button onClick={scrollToHome}>Inicio</button>
        <button onClick={() => scrollToSection('servicios')}>Servicios</button>
        <button onClick={() => scrollToSection('pedidos')}>Directorio</button>
        <button onClick={() => scrollToSection('mapa')}>Mapa</button>
        <button onClick={() => scrollToSection('pautas')}>Pautas</button>
        <button onClick={() => scrollToSection('guia-offline')}>Guía offline</button>
      </nav>

      <div className="international-presence-banner" aria-label="Mercados internacionales">
        <div className="presence-copy">
          <span className="presence-tag">Marketing global</span>
          <strong>Salento llega a más mercados</strong>
        </div>
        <div className="presence-flags" aria-label="Banderas de mercados internacionales">
          {internationalMarketsPreview.map((market) => (
            <div key={market.country} className="flag-pill" title={`${market.country} · ${market.language}`} aria-label={market.country}>
              <img
                className="flag-emoji"
                src={`https://flagcdn.com/w40/${getCountryFlag(market.country)}.png`}
                alt={market.country}
                loading="lazy"
              />
            </div>
          ))}
          <span className="presence-more" aria-label="Más mercados internacionales">
            +{Math.max(0, internationalSEOService.getInternationalMarkets().length - internationalMarketsPreview.length)}
          </span>
        </div>
      </div>

      {showWeatherBanner && weather && (
        <div className={`weather-events-banner ${weather.color}`}>
          <div className="weather-info">
            <span className="weather-icon">{weather.valleCocora.icon}</span>
            <div className="weather-details">
              <span className="weather-temp">Salento: {weatherService.formatTemperature(weather.salento.temperature)} | Valle: {weatherService.formatTemperature(weather.valleCocora.temperature)}</span>
              <span className="weather-recommendation">{weather.recommendation}</span>
            </div>
          </div>
          <div className="events-info">
            {todayEvents.length > 0 && (
              <span className="events-count">🎭 {todayEvents.length} eventos hoy</span>
            )}
            <button className="close-banner" onClick={() => setShowWeatherBanner(false)}><X size={16} /></button>
          </div>
        </div>
      )}

      <main id="inicio">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">{t('loading')}</div>
          </div>
        ) : selectedPlace ? <PlaceDetail place={selectedPlace} currency={currency} onBack={() => setSelectedPlace(null)} language={language} t={t} /> : (
          <>
        <section className="mobile-dashboard" id="servicios">
          <div className="services-grid">
            <button className="service-card gastronomy" onClick={() => { setSelectedCategory('Restaurantes'); setShowProviderModal(true) }}>
              <div className="service-icon">🍽️</div>
              <div className="service-content">
                <h3>Gastronomía</h3>
                <p>Restaurantes y cafés</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['restaurante', 'cafe', 'cafeteria', 'gastronomia', 'brunch', 'comida', 'coffee', 'bar'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card transport" onClick={() => { setSelectedCategory('Servicios'); setShowProviderModal(true) }}>
              <div className="service-icon">🚖</div>
              <div className="service-content">
                <h3>Transporte</h3>
                <p>Jeeps y movilidad</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['transporte', 'moto', 'jeep', 'taxi', 'movilidad', 'transfer', 'transport', 'vehicle'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card horseback-riding featured" onClick={() => { setSelectedCategory('Experiencias'); setShowProviderModal(true) }}>
              <div className="service-badge">⭐ {language === 'es' ? 'ESPECIAL' : 'FEATURED'}</div>
              <div className="service-icon">🐎</div>
              <div className="service-content">
                <h3>Cabalgatas</h3>
                <p>Valle de Cocora</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['cabalgata', 'caballo', 'equitacion', 'horse', 'ride'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card guides" onClick={() => { setSelectedCategory('Experiencias'); setShowProviderModal(true) }}>
              <div className="service-icon">🧭</div>
              <div className="service-content">
                <h3>Guías</h3>
                <p>Tours locales</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['guia', 'guia turistico', 'tour', 'ruta', 'senderismo', 'adventure', 'guide'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card accommodation" onClick={() => { setSelectedCategory('Alojamientos'); setShowProviderModal(true) }}>
              <div className="service-icon">🏨</div>
              <div className="service-content">
                <h3>Alojamientos</h3>
                <p>Hoteles y hostales</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['alojamiento', 'hotel', 'hostal', 'hospedaje', 'resort', 'lodging'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card artisan" onClick={() => { setSelectedCategory('Artesanías'); setShowProviderModal(true) }}>
              <div className="service-icon">🎨</div>
              <div className="service-content">
                <h3>Artesanías</h3>
                <p>Productos locales</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['artesania', 'artesanias', 'manualidades', 'tejido', 'fibras', 'craft', 'handmade'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="service-card commerce" onClick={() => { setSelectedCategory('Tiendas'); setShowProviderModal(true) }}>
              <div className="service-icon">🛒</div>
              <div className="service-content">
                <h3>Tiendas</h3>
                <p>Comercios locales</p>
              </div>
              <div className="service-info">
                <span className="provider-count">{countMatchingPlaces(places, ['tienda', 'shop', 'comercio', 'mercado', 'venta', 'boutique', 'store'])} {language === 'es' ? 'pautantes' : 'providers'}</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </section>

          <div className="official-info-section">
            <h3>🛡️ Información Oficial</h3>
            <p>Reportes actualizados del estado de Salento</p>
            <div className="official-links">
              <button 
                className="official-link" 
                onClick={() => setShowLandingPage('estado-vias-salento-hoy')}
              >
                <MapPin size={16} />
                Estado de Vías
              </button>
              <button 
                className="official-link" 
                onClick={() => setShowLandingPage('hoteles-hostales-abiertos-salento')}
              >
                <Hotel size={16} />
                Alojamientos
              </button>
              <button 
                className="official-link" 
                onClick={() => setShowLandingPage('valle-cocora-operativo-seguro')}
              >
                <Mountain size={16} />
                Valle de Cocora
              </button>
              <button 
                className="official-link" 
                onClick={() => setShowLandingPage('turismo-salento-seguro-hoy')}
              >
                <Shield size={16} />
                Seguridad
              </button>
            </div>
          </div>

        <section className="quick-section" id="pedidos">
          <div className="section-heading"><div><p className="eyebrow">{t('nearby')}</p><h2>{t('today')}</h2></div><button className="text-button">Ver todo <ArrowRight size={16} /></button></div>
          <div className="category-row">
            {(['Todo', 'Alojamientos', 'Restaurantes', 'Cafés', 'Artesanías', 'Tiendas', 'Experiencias', 'Servicios'] as Category[]).map((category) => (
              <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => setActiveCategory(category)}>
                {category === 'Todo' && <Sparkles size={17} />}{category === 'Alojamientos' && <Hotel size={17} />}{category === 'Restaurantes' && <Utensils size={17} />}{category === 'Cafés' && <Coffee size={17} />}{category === 'Artesanías' && <ShoppingBasket size={17} />}{category === 'Tiendas' && <Store size={17} />}{category === 'Experiencias' && <Compass size={17} />}{category === 'Servicios' && <Bike size={17} />}
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
          <div className="directory-intro"><span><MapPin size={16} /> Directorio local</span><small>{filteredPlaces.length} lugares para descubrir</small></div>
          <div className="place-grid">
            {filteredPlaces.map((place) => <PlaceCard key={place.id} place={adaptPlaceForCompatibility(place)} currency={currency} onAdd={addToCart} onOpen={() => { window.history.pushState({}, '', `#pautante-${place.id}`); setSelectedPlace(place) }} onReviews={() => { setShowReviews(place.id); setSelectedPlaceForReviews({ id: place.id, name: place.name, type: place.type }) }} />)}
            {filteredPlaces.length === 0 && <div className="empty-state">No encontramos ese plan todavía. Prueba con “café”, “artesanía” o “trucha”.</div>}
          </div>
        </section>

        <section className="principles-strip"><div><MapPin size={20} /><strong>Mapa ligero</strong><span>Encuentra sin perderte</span></div><div><Bike size={20} /><strong>Entrega local</strong><span>Directo a tu hospedaje</span></div><div><MessageCircle size={20} /><strong>Sin barreras</strong><span>Idioma y moneda a tu medida</span></div><div><Sparkles size={20} /><strong>Economía local</strong><span>Compra directo en Salento</span></div></section>

        <section className="offline-guide" id="guia-offline">
          <div className="offline-guide-intro"><p className="eyebrow">Cuando baja la señal</p><h2>Salento también<br /><i>se lleva guardado.</i></h2><p>Consulta estas recomendaciones aunque estés camino al valle y la conexión sea intermitente.</p></div>
          <div className="offline-guide-grid"><article><span className="offline-number">01</span><strong>Valle de Cocora</strong><p>Sal temprano, lleva agua y confirma el transporte antes de salir.</p></article><article><span className="offline-number">02</span><strong>Cascada Santa Rita</strong><p>Está a unos minutos a pie desde el pueblo. Usa calzado cómodo.</p></article><article><span className="offline-number">03</span><strong>Ayuda local</strong><p><a href="tel:123">Emergencias 123</a><br /><a href="tel:132">Cruz Roja 132</a></p></article></div>
        </section>

        <section className="salento-photo-strip" aria-label="Paisajes de Salento">
          <div className="photo-strip-intro"><p className="eyebrow">Postales del territorio</p><h2>Salento se<br /><i>camina despacio.</i></h2></div>
          <div className="salento-photo-grid">
            <img src="/salento/1326163558.webp" alt="Tejados tradicionales de Salento" />
            <img src="/salento/1326163759.webp" alt="Monumento entre palmas en Salento" />
            <img src="/salento/631026720.webp" alt="Calle colorida de Salento" />
            <img src="/salento/631032744.webp" alt="Iglesia y plaza de Salento" />
            <img src="/salento/653410779.webp" alt="Palmas de cera en el Valle de Cocora" />
          </div>
        </section>

        <section className="map-section" id="mapa">
          <div className="map-copy"><p className="eyebrow">Orienta tu paseo</p><h2>{t('map')}</h2><p>Descubre rutas a pie, lugares favoritos y recomendaciones de quienes hacen de Salento su casa.</p><button className="dark-button">Abrir mapa completo <ArrowRight size={17} /></button><div className="map-legend"><span><i className="legend-dot coral" />Favoritos locales</span><span><i className="legend-dot green" />Para descubrir</span></div></div>
          <div className="map-visual" aria-label="Mapa interactivo de Salento con lugares destacados"><MapContainer center={[4.6371, -75.5706]} zoom={16} scrollWheelZoom={false} className="leaflet-map"><TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{visibleMarkers.map((marker) => <CircleMarker key={marker.label} center={[marker.lat, marker.lng]} radius={10} pathOptions={{ color: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#ba8a25' : '#e76c52', fillColor: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#e8bb58' : '#e76c52', fillOpacity: 0.9 }}><Popup><strong>{marker.label}</strong><br /><span>{marker.type} · Salento</span><br /><button className="popup-action">Ver ficha <ArrowRight size={13} /></button></Popup></CircleMarker>)}<MapControls /></MapContainer></div>
        </section>

            <section className="advertising-section" id="pautas"><div><p className="eyebrow">Hazte visible en Salento</p><h2>Pautas que llegan<br /><i>al lugar correcto.</i></h2><p>Tu negocio aparece en el mapa digital, en las búsquedas y frente a turistas listos para comprar o reservar.</p></div><div className="advertising-cards"><article><span className="ad-tag">Gastronomía</span><strong>Tu sabor, en el mapa.</strong><small>Ficha + ubicación + pedidos</small></article><article><span className="ad-tag green-tag">Comercio local</span><strong>Lo local se encuentra.</strong><small>Ficha + ubicación + contacto</small></article><article><span className="ad-tag yellow-tag">Experiencias</span><strong>El plan empieza aquí.</strong><small>Ficha + reservas + rutas</small></article></div><button className="dark-button ad-button">Conoce las pautas <ArrowRight size={17} /></button></section>

        <section className="stay-banner" id="experiencias"><div><p className="eyebrow">Para tu estadía</p><h2>Que no te cuenten<br /><i>el plan completo.</i></h2></div><div className="stay-actions"><p>Recibe recomendaciones según tu hospedaje, tus gustos y el tiempo que tienes.</p><button className="outline-button">Personalizar mi visita <ArrowRight size={16} /></button></div></section>
          </>
        )}
      </main>

      <footer className="trust-footer">
        <div className="footer-message">
          <p className="footer-title">Apoyamos la economía circular de Salento</p>
          <p className="footer-subtitle">Precios justos, trato directo y sin comisiones abusivas</p>
        </div>
        <div className="footer-brand">
          <span>Salento a la mano · Guía comercial y gastronómica</span>
          <span>Hecho con cariño en el Quindío</span>
        </div>
      </footer>
      {showCart && <Cart count={cartCount} currency={currency} onClose={() => setShowCart(false)} onAdd={addToCart} hotels={hotels} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
      {showHorsebackRiding && <HorsebackRiding onClose={() => setShowHorsebackRiding(false)} language={language as 'es' | 'en'} />}
      {showReviews && selectedPlaceForReviews && <Reviews placeId={showReviews} placeName={selectedPlaceForReviews.name} placeType={selectedPlaceForReviews.type} onClose={() => setShowReviews(null)} language={language as 'es' | 'en'} />}
      {showSupport && <SupportCenter onClose={() => setShowSupport(false)} language={language as 'es' | 'en'} />}
      {showLandingPage && <DynamicLandingPage slug={showLandingPage} onClose={() => setShowLandingPage(null)} />}
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
      {showAllyRegistrationForm && <AllyRegistrationForm onClose={() => setShowAllyRegistrationForm(false)} />}
      {showInternationalMarkets && <InternationalMarketsDisplay onClose={() => setShowInternationalMarkets(false)} />}
      {showLandingPageEstadoActual && <LandingPageEstadoActual onClose={() => setShowLandingPageEstadoActual(false)} />}
      {showLandingPageValleCocora && <LandingPageValleCocora onClose={() => setShowLandingPageValleCocora(false)} />}
      {showLandingPageSalentoSeguro && <LandingPageSalentoSeguro onClose={() => setShowLandingPageSalentoSeguro(false)} />}
      {showLandingPageHoteles && <LandingPageHoteles onClose={() => setShowLandingPageHoteles(false)} />}
      {showLandingPageVias && <LandingPageVias onClose={() => setShowLandingPageVias(false)} />}
      {showProviderModal && selectedCategory && (
        <ProviderSelectionModal
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          category={selectedCategory}
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
            // Actualizar el dashboard de backlinks después de verificación
            console.log('Aliado verificado:', allyId)
          }}
        />
      )}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
      <div className="floating-nav-toolbar" aria-label="Navegación rápida">
        <button className="floating-nav-button" onClick={scrollToHome} aria-label="Volver al inicio">
          <Home size={18} />
        </button>
        <button className="floating-nav-button" onClick={() => setShowLandingPageEstadoActual(true)} aria-label="Estado actual Salento">
          <Shield size={18} />
        </button>
        <button className="floating-nav-button" onClick={() => setShowLandingPageValleCocora(true)} aria-label="Valle de Cocora">
          <Mountain size={18} />
        </button>
        <button className="floating-nav-button" onClick={() => setShowLandingPageHoteles(true)} aria-label="Hoteles">
          <Hotel size={18} />
        </button>
        <button className="floating-nav-button" onClick={() => setShowInternationalMarkets(true)} aria-label="Mercados internacionales">
          <Globe size={18} />
        </button>
        <button className="floating-nav-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Subir arriba">
          <ArrowUp size={18} />
        </button>
        <button className="floating-nav-button" onClick={scrollToBottom} aria-label="Bajar abajo">
          <ArrowDown size={18} />
        </button>
      </div>
      <DonChucho language={language} t={t} places={places} weather={weather} todayEvents={todayEvents} />
      <div className="offline-status">
        <span className={isOffline ? 'offline-indicator' : 'online-indicator'} />
        {isOffline ? t('offline', 'Modo Offline - Valle de Cocora') : t('online', 'Conectado')}
      </div>
    </div>
  )
}

function DonChucho({ language, t, places, weather, todayEvents }: { language: Language; t: (key: string, fallback?: string) => string; places: Place[]; weather: any; todayEvents: any[] }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(t('donChucho.welcome', '¡Hola, pues! ¿Buscando dónde comer una buena trucha o un transporte para el Cocora? Pregúnteme lo que quiera.'))
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showGreeting, setShowGreeting] = useState(true)
  const [relatedPlace, setRelatedPlace] = useState<Place | null>(null)
  const isEnglish = language === 'en'

  // Agregar alerta contextual en el mensaje de bienvenida
  useEffect(() => {
    if (weather && todayEvents.length > 0) {
      const contextualGreeting = isEnglish
        ? `Hello there! Looking for a good trout meal or transport to Cocora? Ask me anything you want. 🌡️ Today: ${weatherService.formatTemperature(weather.salento.temperature)} | 🎭 ${todayEvents.length} events today`
        : `¡Hola, pues! ¿Buscando dónde comer una buena trucha o un transporte para el Cocora? Pregúnteme lo que quiera. 🌡️ Hoy: ${weatherService.formatTemperature(weather.salento.temperature)} | 🎭 ${todayEvents.length} eventos hoy`
      setAnswer(contextualGreeting)
    }
  }, [weather, todayEvents, isEnglish])

  function decorateDonChuchoReply(text: string, baseReply: string): string {
    const query = text.toLowerCase()
    const reply = baseReply.trim()

    if (!reply) return reply

    const naturalOpeners = [
      'Pues mira,',
      'Ay, hermano,',
      'Mira nomás,',
      'Eso sí te lo digo,',
      'Con toda sinceridad,',
      'Pues sí,',
      'Aja, y aquí va la verdad,'
    ]

    const closers = [
      '¿Te armo la ruta del día?',
      '¿Quieres que te diga qué te conviene más?',
      'Si quieres, te lo dejo más sencillo.',
      '¿Te ayudo a elegir entre varias opciones?'
    ]

    const opener = naturalOpeners[Math.floor(Math.random() * naturalOpeners.length)]
    const closer = closers[Math.floor(Math.random() * closers.length)]

    const recomendacion = query.includes('recomi') || query.includes('suger') || query.includes('conviene') || query.includes('dónde me conviene')
    const plan = query.includes('plan') || query.includes('qué hacer') || query.includes('ruta') || query.includes('itinerario')
    const busquedaLugar = /hotel|restaurante|mirador|cascada|finca|cabalgata|moto|boquía|salento/.test(query)

    if (!isEnglish) {
      if (recomendacion) {
        return `${opener} en Salento yo te diría: ${reply} ${closer}`
      }

      if (plan) {
        return `${opener} para un plan bien rico en Salento, ${reply} ${closer}`
      }

      if (busquedaLugar) {
        return `${opener} ${reply} ${closer}`
      }
    }

    return `${reply} ${isEnglish ? 'Want me to build a simple plan for you?' : closer}`
  }

  function buildNaturalSuggestions(text: string, isDefensive: boolean): string[] {
    const query = text.toLowerCase()
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

    if (isDefensive) {
      return isEnglish ? ['Need a safe route?', 'Want hotel options?', 'Prefer a relaxed plan?'] : ['¿Te ayudo con la ruta segura?', '¿Quieres ver opciones de hoteles?', '¿Prefieres plan tranquilo?']
    }

    if (isEnglish) {
      if (query.includes('hotel') || query.includes('stay')) return englishSuggestions.hotel
      if (query.includes('eat') || query.includes('restaurant') || query.includes('trout') || query.includes('lunch')) return englishSuggestions.food
      if (query.includes('mirador') || query.includes('photo') || query.includes('view')) return englishSuggestions.viewpoint
      if (query.includes('waterfall') || query.includes('trail') || query.includes('boquia')) return englishSuggestions.waterfall
      if (query.includes('farm') || query.includes('coffee')) return englishSuggestions.farm
      return englishSuggestions.default
    }

    if (query.includes('hotel') || query.includes('hospedaje')) return spanishSuggestions.hotel
    if (query.includes('comer') || query.includes('restaurante') || query.includes('trucha') || query.includes('almuerzo')) return spanishSuggestions.comida
    if (query.includes('mirador') || query.includes('fotos') || query.includes('vista')) return spanishSuggestions.mirador
    if (query.includes('cascada') || query.includes('sendero') || query.includes('boquía')) return spanishSuggestions.cascada
    if (query.includes('finca') || query.includes('cafe') || query.includes('café')) return spanishSuggestions.finca

    return spanishSuggestions.default
  }

  function ask(text: string) {
    setQuestion(text)
    setShowGreeting(false)
    setRelatedPlace(null)
    
    // Verificar si pregunta sobre clima
    const weatherKeywords = ['clima', 'tiempo', 'lluvia', 'frío', 'calor', 'weather', 'rain', 'cold', 'hot']
    const isWeatherQuestion = weatherKeywords.some(keyword => text.toLowerCase().includes(keyword))
    
    if (isWeatherQuestion && weather) {
      const weatherAnswer = isEnglish 
        ? `Currently in Salento: ${weatherService.formatTemperature(weather.salento.temperature)}. In Cocora Valley: ${weatherService.formatTemperature(weather.valleCocora.temperature)}. ${weather.recommendation}`
        : `Pues mira, el clima por aquí va así: en Salento ${weatherService.formatTemperature(weather.salento.temperature)} y en el Valle de Cocora ${weatherService.formatTemperature(weather.valleCocora.temperature)}. ${weather.recommendation}`
      setAnswer(weatherAnswer)
      setSuggestions(['¿Para el valle?', '¿Qué ropa llevar?', '¿Mejor hora para salir?'])
      return
    }
    
    // Verificar si pregunta sobre eventos
    const eventKeywords = ['evento', 'festival', 'actividad', 'qué hacer', 'plan', 'event', 'festival', 'activity', 'what to do', 'plan']
    const isEventQuestion = eventKeywords.some(keyword => text.toLowerCase().includes(keyword))
    
    if (isEventQuestion && todayEvents.length > 0) {
      const eventsList = todayEvents.map(event => event.name).join(', ')
      const eventAnswer = isEnglish
        ? `Today there are ${todayEvents.length} events: ${eventsList}. I recommend checking them out!`
        : `Hoy hay ${todayEvents.length} eventos: ${eventsList}. ¡Te recomiendo revisarlos!`
      setAnswer(eventAnswer)
      setSuggestions(['¿Más detalles?', '¿Dónde son?', '¿Horarios?'])
      return
    }
    
    // Usar base de conocimiento local mejorada
    const knowledgeAnswer = donChuchoKnowledge.getAnswer(text, isEnglish ? 'en' : 'es')
    const naturalAnswer = decorateDonChuchoReply(text, knowledgeAnswer)
    
    // Verificar si es una respuesta defensiva
    const isDefensive = donChuchoKnowledge.isDefensiveResponse(text)
    const defensiveActions = donChuchoKnowledge.getDefensiveActions(text)
    
    setAnswer(naturalAnswer)
    
    // Si es defensiva, mostrar acciones específicas
    if (isDefensive) {
      const actionSuggestions = defensiveActions.includes('redirect_routes_landing') 
        ? ['Estado de vías', 'Hoteles disponibles', 'Valle de Cocora']
        : defensiveActions.includes('redirect_safety_landing')
        ? ['Información seguridad', 'Contactos emergencia', 'Turismo activo']
        : ['Ver servicios', 'Contactar comercios', 'Planear visita']
      
      setSuggestions(isEnglish ? ['Official info', 'Available services', 'Plan visit'] : actionSuggestions)
    } else {
      // Obtener sugerencias de seguimiento normales
      const followUpSuggestions = donChuchoKnowledge.getFollowUpSuggestions(text, isEnglish ? 'en' : 'es')
      setSuggestions(followUpSuggestions.length > 0 ? followUpSuggestions : buildNaturalSuggestions(text, false))
    }
    
    // Obtener lugares relacionados
    const relatedPlaceIds = donChuchoKnowledge.getRelatedPlaces(text)
    if (relatedPlaceIds.length > 0) {
      const relatedPlaces = places.filter(p => relatedPlaceIds.includes(p.id))
      if (relatedPlaces.length > 0) {
        const placeNames = relatedPlaces.map(p => p.name).join(', ')
        const enhancedAnswer = naturalAnswer + (isEnglish ? ` Related places: ${placeNames}` : ` Lugares relacionados: ${placeNames}`)
        setAnswer(enhancedAnswer)
        setRelatedPlace(relatedPlaces[0]) // Tomar el primer lugar relacionado
      }
    }
  }

  function handleWhatsAppClick(place: Place) {
    const message = isEnglish
      ? `Hello! I'm interested in ${place.name}. Can you help me?`
      : `¡Hola! Estoy interesado en ${place.name}. ¿Me pueden ayudar?`
    const whatsappNumber = place.whatsapp || place.contact?.whatsapp
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  // Función mejorada para pedidos directos por WhatsApp
  function handleDirectOrder(category: string, hotelInfo?: { name: string; room: string }) {
    const deliveryCategories = ['restaurantes', 'supermercados']
    
    // Si es una categoría que requiere entrega a hotel y no hay info de hotel, mostrar modal
    if (deliveryCategories.includes(category) && !hotelInfo) {
      setPendingOrderCategory(category)
      setShowHotelModal(true)
      return
    }

    const categoryMessages = {
      'restaurantes': isEnglish 
        ? `Hello! I want to order food delivery to my hotel. Hotel: ${hotelInfo?.name || 'Not specified'}, Room: ${hotelInfo?.room || 'Not specified'}. What's available?`
        : `¡Hola! Quiero hacer un pedido de comida a mi hotel. Hotel: ${hotelInfo?.name || 'No especificado'}, Habitación: ${hotelInfo?.room || 'No especificada'}. ¿Qué tienen disponible?`,
      'supermercados': isEnglish
        ? `Hello! I need groceries/supplies delivered to my hotel. Hotel: ${hotelInfo?.name || 'Not specified'}, Room: ${hotelInfo?.room || 'Not specified'}. What can you deliver?`
        : `¡Hola! Necesito que me lleven víveres/tiendas a mi hotel. Hotel: ${hotelInfo?.name || 'No especificado'}, Habitación: ${hotelInfo?.room || 'No especificada'}. ¿Qué pueden llevarme?`,
      'transporte': isEnglish
        ? `Hello! I need transportation. Where are you located and what are your rates?`
        : `¡Hola! Necesito transporte. ¿Dónde están ubicados y cuáles son sus tarifas?`,
      'caballos': isEnglish
        ? `Hello! I'm interested in horseback riding tours in Cocora Valley. What are your options and prices?`
        : `¡Hola! Me interesa hacer cabalgatas en el Valle de Cocora. ¿Qué opciones tienen y cuáles son los precios?`,
      'guias': isEnglish
        ? `Hello! I need a tour guide for Salento. What tours do you offer?`
        : `¡Hola! Necesito un guía turístico para Salento. ¿Qué tours ofrecen?`,
      'operadoras': isEnglish
        ? `Hello! I'm interested in tourism activities in Salento. What packages do you have?`
        : `¡Hola! Me interesa hacer actividades turísticas en Salento. ¿Qué paquetes tienen?`
    }

    const message = categoryMessages[category as keyof typeof categoryMessages] || categoryMessages['restaurantes']
    
    // Buscar el primer contacto disponible de esa categoría
    const categoryPlaces = places.filter(p => p.type.toLowerCase().includes(category.toLowerCase()))
    const contactPlace = categoryPlaces[0]
    
    if (contactPlace?.contact.whatsapp) {
      const whatsappUrl = `https://wa.me/${contactPlace.contact.whatsapp}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else {
      // Fallback a número genérico si no hay contacto específico
      const whatsappUrl = `https://wa.me/573000000000?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  // Manejar el envío del modal de hotel
  const handleHotelInfoSubmit = (hotelInfo: { name: string; room: string; phone?: string }) => {
    if (pendingOrderCategory) {
      handleDirectOrder(pendingOrderCategory, hotelInfo)
      setPendingOrderCategory(null)
    }
    setShowHotelModal(false)
  }

  return <div className={open ? 'chucho-widget open' : 'chucho-widget'}>{open && <div className="chucho-panel"><div className="chucho-head"><img src="/avatar-don-chucho.png" alt="Don Chucho" className="chucho-avatar-image" /><div><strong>{t('donChucho.title')}</strong><span>{t('donChucho.subtitle')}</span></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={16} /></button></div><div className="chucho-answer"><MessageCircle size={16} />{answer}</div>{relatedPlace && relatedPlace.contact.whatsapp && <div className="chucho-whatsapp"><button className="whatsapp-button" onClick={() => handleWhatsAppClick(relatedPlace)}><Phone size={16} />{isEnglish ? `Contact ${relatedPlace.name}` : `Contactar a ${relatedPlace.name}`}</button></div>}{suggestions.length > 0 && <div className="chucho-suggestions">{suggestions.map((suggestion, index) => <button key={index} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>}<form onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t('donChucho.placeholder')} /><button aria-label="Enviar pregunta"><Send size={15} /></button></form></div>}<button className="chucho-trigger" onClick={() => setOpen(!open)} aria-label="Abrir asistente Don Chucho"><img src="/don-chucho-boton.png" alt="Don Chucho" className="chucho-button-image" />{showGreeting && <span className="chucho-greeting">¡Hola, pues!</span>}</button></div>
}

function categoryToMapType(category: Category) {
  if (category === 'Restaurantes' || category === 'Cafés') return 'Gastronómico'
  if (category === 'Artesanías' || category === 'Tiendas' || category === 'Alojamientos') return 'Comercial'
  return 'Turístico'
}

function PlaceCard({ place, currency, onAdd, onOpen, onReviews }: { place: Place; currency: Currency; onAdd: () => void; onOpen: () => void; onReviews?: () => void }) {
  const Icon = place.icon
  const stats = reviewsService.getPlaceStats(place.id)
  
  return (
    <article className="place-card">
      <div className={`place-image ${place.color}`}>
        {place.photos?.[0] && <img className="place-photo" src={place.photos[0]} alt={`Hotel ${place.name}`} />}
        <div className="image-pattern" />
        <span className="place-badge">{place.badge}</span>
        <button className="heart-button" aria-label={`Guardar ${place.name}`}>
          <Heart size={17} />
        </button>
        <Icon className="place-icon" size={45} strokeWidth={1.2} />
      </div>
      <div className="place-info">
        <div className="place-topline">
          <span>{place.type}</span>
          <span className="rating">
            <Star size={13} fill="currentColor" /> {stats.averageRating || place.rating}
            {stats.totalReviews > 0 && <span className="review-count">({stats.totalReviews})</span>}
          </span>
        </div>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <div className="place-bottom">
          <span>
            <strong>{place.price}</strong> · <Clock3 size={13} /> {place.time}
          </span>
          <button className="add-button" onClick={onAdd} aria-label={`Añadir ${place.name}`}>
            <Plus size={18} />
          </button>
        </div>
        <small className="currency-hint">
          Desde {formatPrice(35000, currency)} · tasa de referencia
        </small>
        <button className="detail-button" onClick={onOpen}>Ampliar información <ArrowRight size={14} /></button>
        {onReviews && (
          <button className="reviews-button" onClick={onReviews} aria-label={`Ver reseñas de ${place.name}`}>
            <Star size={14} />
            {stats.totalReviews} {stats.totalReviews === 1 ? 'reseña' : 'reseñas'}
          </button>
        )}
        <div className="contact-actions">
          {place.whatsapp && (
            <a
              href={`https://wa.me/${place.whatsapp}?text=Hola%20${encodeURIComponent(place.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn whatsapp"
              aria-label={`Contactar ${place.name} por WhatsApp`}
              onClick={() => analyticsService.trackClick(place.id, 'whatsapp')}
            >
              <MessageSquare size={15} />
            </a>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="contact-btn phone"
              aria-label={`Llamar a ${place.name}`}
              onClick={() => analyticsService.trackClick(place.id, 'phone')}
            >
              <Phone size={15} />
            </a>
          )}
          {place.email && (
            <a
              href={`mailto:${place.email}`}
              className="contact-btn email"
              aria-label={`Enviar correo a ${place.name}`}
              onClick={() => analyticsService.trackClick(place.id, 'email')}
            >
              <Mail size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function PlaceDetail({ place, currency, onBack, language, t }: { place: Place; currency: Currency; onBack: () => void; language: Language; t: (key: string, fallback?: string) => string }) {
  const adaptedPlace = adaptPlaceForCompatibility(place)
  const photos = place.photos ?? []
  return (
    <section className="place-detail" id={`pautante-${place.id}`}>
      <div className="detail-topbar">
        <button className="back-button detail-back" onClick={() => { window.history.pushState({}, '', '#pedidos'); onBack() }}><ArrowRight size={16} /> Volver al directorio</button>
        <span>{place.type}</span>
      </div>
      <div className="detail-heading">
        <div><p className="eyebrow"><span /> {place.verified ? 'Ficha del pautante verificado' : 'Ficha del lugar'}</p><h1>{place.name}</h1><p>{place.accommodationDetails?.categoryLabel ?? place.foodServiceDetails?.cuisineType?.join(', ') ?? place.type}</p></div>
        <span className="detail-rating"><Star size={15} fill="currentColor" /> {place.rating}</span>
      </div>
      {photos.length > 0 && <div className="detail-gallery">{photos.map((photo, index) => <img key={photo} src={photo} alt={`${place.name}, foto ${index + 1}`} />)}</div>}
      <div className="detail-content">
        <div>
          <p className="eyebrow">Información</p><h2>Conoce este lugar</h2>
          <p className="detail-description">{place.accommodationDetails?.description ?? place.description}</p>
          <div className="detail-meta"><span><Clock3 size={16} /> {place.timeInfo}</span><span><MapPin size={16} /> Salento, Quindío</span></div>
        </div>
        <aside className="price-panel">
          <p className="eyebrow">Precios y servicios</p><h2>Opciones disponibles</h2>
          <div className="price-line"><span>Servicio principal</span><strong>Consultar tarifa</strong></div>
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
        <InfoList title="Servicios y comodidades" items={place.accommodationDetails.services} />
        <InfoList title="En la habitación" items={place.accommodationDetails.roomFeatures} />
        <InfoList title="Lugares cercanos" items={place.accommodationDetails.nearby} />
        <InfoList title="Horarios y políticas" items={place.accommodationDetails.policies} />
      </div>}
    </section>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <section className="info-list"><p className="eyebrow">Información detallada</p><h2>{title}</h2><div className="info-list-items">{items.map((item) => <span key={item}>{item}</span>)}</div></section>
}

function MapControls() {
  const map = useMap()

  function locateUser() {
    map.locate({ setView: true, maxZoom: 17 })
  }

  return <div className="map-controls"><button onClick={() => map.zoomIn()} aria-label="Acercar mapa"><Plus size={17} /></button><button onClick={() => map.zoomOut()} aria-label="Alejar mapa"><Minus size={17} /></button><button onClick={locateUser} aria-label="Usar mi ubicación"><MapPin size={17} /></button></div>
}

function Cart({ count, currency, onClose, onAdd, hotels }: { count: number; currency: Currency; onClose: () => void; onAdd: () => void; hotels: HotelType[] }) {
  const [checkout, setCheckout] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [syncStatus, setSyncStatus] = useState<{ pending: number }>({ pending: 0 })
  const [showDonation, setShowDonation] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null)
  const [donationCause, setDonationCause] = useState<string | null>(null)

  // Escuchar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar estado inicial de sincronización
    orderSyncService.getSyncStatus().then(setSyncStatus)

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
      // Modo offline: guardar en cola y enviar por WhatsApp como fallback
      await orderSyncService.queueOrder(orderData)
      await orderSyncService.sendOrderViaWhatsApp(orderData)
      
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
      window.open(`https://wa.me/573164567890?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
      setSubmitted(true)
    }
  }

  return <div className="cart-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>{submitted ? <div className="order-success"><div className="success-mark"><Bike size={28} /></div><p className="eyebrow">Pedido recibido</p><h2>Ya vamos en camino.</h2><p>{isOffline ? 'Pedido guardado en modo offline. Se sincronizará cuando haya conexión.' : 'Se abrió WhatsApp con el pedido listo para enviar al comercio.'}</p>{isOffline && syncStatus.pending > 0 && <p className="cart-footnote">{syncStatus.pending} pedidos pendientes de sincronización</p>}<strong className="order-code">PEDIDO #SAL-024</strong><button className="checkout-button" onClick={onClose}>Volver a explorar <ArrowRight size={18} /></button></div> : <><div className="drawer-head"><div><p className="eyebrow">Tu selección</p><h2>{checkout ? '¿Dónde te lo llevamos?' : 'Mi pedido'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar pedido"><X size={20} /></button></div>{isOffline && <div className="offline-warning"><span>⚠️</span>Modo offline activo. El pedido se guardará y sincronizará cuando haya conexión.</div>}{checkout ? <form className="checkout-form" onSubmit={submitOrder}><label>Hotel aliado<select name="hotel" required defaultValue=""><option value="" disabled>Selecciona tu hospedaje</option>{hotels.map(hotel => <option key={hotel.id} value={hotel.name}>{hotel.name}</option>)}</select></label><label>Habitación<input name="room" required placeholder="Ej. 204" /></label><label>Celular de contacto<input name="phone" required type="tel" placeholder="300 000 0000" /></label><label>Indicaciones para llegar<textarea name="directions" placeholder="Recepción, cabaña o punto de encuentro" rows={3} /></label><div className="delivery-note"><Bike size={19} /><span><strong>Pago al recibir</strong><br />El domicilio se confirma contigo antes de salir.</span></div><button className="checkout-button" type="submit">{isOffline ? 'Guardar pedido (offline)' : 'Enviar pedido por WhatsApp'} <MessageSquare size={18} /></button><button className="back-button" type="button" onClick={() => setCheckout(false)}>Volver al resumen</button></form> : <><div className="cart-place"><div className="mini-thumb terracotta"><Coffee size={24} /></div><div><strong>Brunch de la Plaza</strong><span>Arepa de chocolo · Café filtrado</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="cart-place"><div className="mini-thumb sage"><ShoppingBasket size={24} /></div><div><strong>Canasto Quindiano</strong><span>Selección de café local</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="delivery-note"><Bike size={19} /><span><strong>Entrega en tu hospedaje</strong><br />Calcularemos la tarifa al confirmar tu dirección.</span></div><div className="cart-total"><span>Total estimado</span><strong>{formatPrice(48000, currency)}</strong></div><button className="checkout-button" onClick={() => setCheckout(true)}>Continuar con el pedido <ArrowRight size={18} /></button><p className="cart-footnote">{count} productos seleccionados · Pago al recibir</p></>}</>}</aside></div>
}

export default App
