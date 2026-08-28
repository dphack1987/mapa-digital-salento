import { useMemo, useState, useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ArrowRight,
  Bike,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  Heart,
  Hotel,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  Star,
  Store,
  Utensils,
  X,
} from 'lucide-react'
import { Category, Language, Currency, Place, MapMarker, Hotel as HotelType } from './types'
import dataService from './services/dataService'
import translationService from './services/translationService'
import orderSyncService from './services/orderSyncService'
import donChuchoKnowledge from './services/donChuchoKnowledge'
import currencyService from './services/currencyService'
import weatherService from './services/weatherService'
import eventsService from './services/eventsService'
import hotelQRService from './services/qrHotelService'

// Mapeo de iconos para compatibilidad con estructura JSON
const iconMap: Record<string, any> = {
  Coffee,
  Utensils,
  Hotel,
  ShoppingBasket,
  Bike,
  Store,
  Compass,
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

// Inicializar servicios
currencyService.initialize()
weatherService.initialize()
eventsService.initialize()

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
  
  // Función helper para obtener traducciones
  const t = (key: string, fallback?: string) => translationService.translate(key, fallback)

  // Cargar datos al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
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

    // Cleanup al desmontar
    return () => {
      orderSyncService.stop()
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

  const visibleMarkers = useMemo(() => mapMarkers.filter((marker) => activeCategory === 'Todo' || marker.type === categoryToMapType(activeCategory)), [activeCategory, mapMarkers])

  // Manejar cambio de idioma
  function handleLanguageChange(newLanguage: Language) {
    setLanguage(newLanguage)
    translationService.setLanguage(newLanguage as any)
  }

  function addToCart() {
    setCartCount((count) => count + 1)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Salento a la mano">
          <img src="/logo_salento2026.png" alt="" />
          <span>Salento <em>a la mano</em></span>
        </a>
          <nav className={mobileNav ? 'main-nav open' : 'main-nav'}>
          <a className="active" href="#explora" onClick={() => setMobileNav(false)}>{t('explore')}</a>
          <a href="#pedidos" onClick={() => setMobileNav(false)}>{t('order')}</a>
          <a href="#experiencias" onClick={() => setMobileNav(false)}>{t('experiences')}</a>
          <a href="#pautas" onClick={() => setMobileNav(false)}>Pautas locales</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button mobile-menu" aria-label="Abrir menú" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
          <div className="locale-tools"><button className="locale-button" onClick={() => handleLanguageChange(language === 'es' ? 'en' : 'es')}>{language.toUpperCase()}</button><select aria-label="Cambiar moneda" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="COP">COP</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div><button className="cart-button" onClick={() => setShowCart(true)}><ShoppingBag size={18} /><span>{t('orderTitle')}</span><b>{cartCount}</b></button>
        </div>
      </header>

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
        ) : selectedPlace ? <PlaceDetail place={selectedPlace} currency={currency} onBack={() => setSelectedPlace(null)} language={language} t={t} /> : <>
        <section className="hero" id="explora">
          <div className="hero-copy">
            <img className="hero-logo" src="/logo_salento2026.png" alt="Mapa turístico, comercial y gastronómico de Salento" />
            <p className="eyebrow"><span /> {t('guide')}</p>
            <h1>{t('title')}</h1>
            <p className="hero-description">{t('description')}</p>
            <div className="search-box">
              <Search size={19} />
              <input aria-label="Buscar en Salento" placeholder={t('search')} value={search} onChange={(event) => setSearch(event.target.value)} />
              <button aria-label="Buscar"><ArrowRight size={18} /></button>
            </div>
            <div className="trust-line"><span className="avatars"><b>J</b><b>M</b><b>A</b></span><span><strong>+1.200 viajeros</strong> ya exploraron Salento</span></div>
          </div>
          <div className="hero-art" aria-label="Ilustración del paisaje de Salento">
            <img className="hero-photo" src="/salento/653410779.webp?v=2" alt="Palmas de cera en el Valle de Cocora" />
            <div className="sun" />
            <div className="mountain mountain-back" />
            <div className="mountain mountain-front" />
            <div className="cable cable-one" /><div className="cable cable-two" />
            <div className="house house-one"><span /></div><div className="house house-two"><span /></div>
            <div className="hero-note"><Compass size={17} /><span><strong>Estás aquí</strong><br />Salento, Quindío</span></div>
            <div className="stamp">Pueblo<br /><strong>bonito</strong></div>
          </div>
        </section>

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
            {filteredPlaces.map((place) => <PlaceCard key={place.id} place={adaptPlaceForCompatibility(place)} currency={currency} onAdd={addToCart} onOpen={() => { window.history.pushState({}, '', `#pautante-${place.id}`); setSelectedPlace(place) }} />)}
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
        </>}
      </main>

      <footer><span>Salento a la mano · Guía comercial y gastronómica</span><span>Hecho con cariño en el Quindío</span></footer>
      {showCart && <Cart count={cartCount} currency={currency} onClose={() => setShowCart(false)} onAdd={addToCart} hotels={hotels} />}
      <DonChucho language={language} t={t} places={places} />
      <div className="offline-status"><span /> {t('offline')}</div>
    </div>
  )
}

function DonChucho({ language, t, places }: { language: Language; t: (key: string, fallback?: string) => string; places: Place[] }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(t('donChucho.welcome', '¡Hola! Te ayudo a encontrar café, comida, tiendas locales o planes en Salento.'))
  const [suggestions, setSuggestions] = useState<string[]>([])
  const isEnglish = language === 'en'

  function ask(text: string) {
    setQuestion(text)
    
    // Usar base de conocimiento local mejorada
    const knowledgeAnswer = donChuchoKnowledge.getAnswer(text, isEnglish ? 'en' : 'es')
    setAnswer(knowledgeAnswer)
    
    // Obtener sugerencias de seguimiento
    const followUpSuggestions = donChuchoKnowledge.getFollowUpSuggestions(text, isEnglish ? 'en' : 'es')
    setSuggestions(followUpSuggestions.length > 0 ? followUpSuggestions : [])
    
    // Obtener lugares relacionados
    const relatedPlaceIds = donChuchoKnowledge.getRelatedPlaces(text)
    if (relatedPlaceIds.length > 0) {
      const relatedPlaces = places.filter(p => relatedPlaceIds.includes(p.id))
      if (relatedPlaces.length > 0) {
        const placeNames = relatedPlaces.map(p => p.name).join(', ')
        const enhancedAnswer = knowledgeAnswer + (isEnglish ? ` Related places: ${placeNames}` : ` Lugares relacionados: ${placeNames}`)
        setAnswer(enhancedAnswer)
      }
    }
  }

  return <div className={open ? 'chucho-widget open' : 'chucho-widget'}>{open && <div className="chucho-panel"><div className="chucho-head"><div><strong>{t('donChucho.title')}</strong><span>{t('donChucho.subtitle')}</span></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={16} /></button></div><div className="chucho-answer"><MessageCircle size={16} />{answer}</div>{suggestions.length > 0 && <div className="chucho-suggestions">{suggestions.map((suggestion, index) => <button key={index} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>}<form onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t('donChucho.placeholder')} /><button aria-label="Enviar pregunta"><Send size={15} /></button></form></div>}<button className="chucho-trigger" onClick={() => setOpen(!open)} aria-label="Abrir asistente Don Chucho"><span className="chucho-face">☕</span><span>{t('donChucho.title')}</span><MessageCircle size={17} /></button></div>
}

function categoryToMapType(category: Category) {
  if (category === 'Restaurantes' || category === 'Cafés') return 'Gastronómico'
  if (category === 'Artesanías' || category === 'Tiendas' || category === 'Alojamientos') return 'Comercial'
  return 'Turístico'
}

function PlaceCard({ place, currency, onAdd, onOpen }: { place: Place; currency: Currency; onAdd: () => void; onOpen: () => void }) {
  const Icon = place.icon
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
            <Star size={13} fill="currentColor" /> {place.rating}
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
        <div className="contact-actions">
          {place.whatsapp && (
            <a
              href={`https://wa.me/${place.whatsapp}?text=Hola%20${encodeURIComponent(place.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn whatsapp"
              aria-label={`Contactar ${place.name} por WhatsApp`}
            >
              <MessageSquare size={15} />
            </a>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="contact-btn phone"
              aria-label={`Llamar a ${place.name}`}
            >
              <Phone size={15} />
            </a>
          )}
          {place.email && (
            <a
              href={`mailto:${place.email}`}
              className="contact-btn email"
              aria-label={`Enviar correo a ${place.name}`}
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
