import { useMemo, useState } from 'react'
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
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  Star,
  Send,
  MessageCircle,
  Utensils,
  X,
} from 'lucide-react'

type Category = 'Todo' | 'Comer' | 'Comprar' | 'Experiencias'
type Language = 'es' | 'en'
type Currency = 'COP' | 'USD' | 'EUR'

type Place = {
  id: number
  name: string
  type: Exclude<Category, 'Todo'>
  description: string
  price: string
  rating: string
  time: string
  badge: string
  color: string
  icon: typeof Utensils
}

const places: Place[] = [
  {
    id: 1,
    name: 'Brunch de la Plaza',
    type: 'Comer',
    description: 'Café de origen, arepas y desayunos con vista al parque.',
    price: '$$',
    rating: '4.9',
    time: '20–30 min',
    badge: 'Muy pedido',
    color: 'terracotta',
    icon: Coffee,
  },
  {
    id: 2,
    name: 'Canasto Quindiano',
    type: 'Comprar',
    description: 'Artesanías, café y detalles hechos por manos locales.',
    price: '$$',
    rating: '4.8',
    time: 'Entrega hoy',
    badge: 'Local',
    color: 'sage',
    icon: ShoppingBasket,
  },
  {
    id: 3,
    name: 'Valle en Bicicleta',
    type: 'Experiencias',
    description: 'Recorre el paisaje cultural cafetero con guías de Salento.',
    price: '$$$',
    rating: '5.0',
    time: 'Desde 8:00 am',
    badge: 'Imperdible',
    color: 'yellow',
    icon: Bike,
  },
  {
    id: 4,
    name: 'La Fogata Salentina',
    type: 'Comer',
    description: 'Trucha, patacón y sabores de montaña para compartir.',
    price: '$$$',
    rating: '4.7',
    time: '35–45 min',
    badge: 'Domicilio',
    color: 'mustard',
    icon: Utensils,
  },
]

const mapMarkers = [
  { label: 'Plaza Principal', type: 'Turístico', lat: 4.6371, lng: -75.5706, tone: 'coral' },
  { label: 'Café Quindío', type: 'Gastronómico', lat: 4.6364, lng: -75.5718, tone: 'green' },
  { label: 'Artesanías del Camino', type: 'Comercial', lat: 4.6381, lng: -75.5695, tone: 'yellow' },
  { label: 'Mirador Alto de la Cruz', type: 'Turístico', lat: 4.6393, lng: -75.5725, tone: 'coral' },
]

const copy = {
  es: { explore: 'Mapa digital', order: 'Pide local', experiences: 'Planes', guide: 'Mapa digital, pedidos y planes', title: 'Salento, a tu ritmo.', description: 'Encuentra lugares, pide a tu hospedaje y descubre Salento desde un mapa digital pensado para viajeros.', search: '¿Qué buscas en Salento?', nearby: 'Lugares y servicios cercanos', today: 'Descubre Salento', map: 'Mapa digital de Salento', orderTitle: 'Mi pedido' },
  en: { explore: 'Digital map', order: 'Order local', experiences: 'Things to do', guide: 'Digital map, orders and plans', title: 'Salento, your way.', description: 'Find local places, order to your hotel and discover Salento through a digital map made for travelers.', search: 'What are you looking for in Salento?', nearby: 'Nearby places and services', today: 'Discover Salento', map: 'Salento digital map', orderTitle: 'My order' },
} as const

const currencyRates: Record<Currency, number> = { COP: 1, USD: 0.00025, EUR: 0.00021 }
const currencySymbols: Record<Currency, string> = { COP: '$', USD: '$', EUR: '€' }

function formatPrice(cop: number, currency: Currency) {
  const converted = Math.round(cop * currencyRates[currency])
  return `${currencySymbols[currency]}${converted.toLocaleString(currency === 'COP' ? 'es-CO' : 'en-US')}`
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todo')
  const [cartCount, setCartCount] = useState(2)
  const [showCart, setShowCart] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [language, setLanguage] = useState<Language>(() => navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es')
  const [currency, setCurrency] = useState<Currency>('COP')
  const text = copy[language]

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()
    return places.filter((place) => {
      const matchesCategory = activeCategory === 'Todo' || place.type === activeCategory
      const matchesSearch = !normalizedSearch || `${place.name} ${place.description}`.toLowerCase().includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const visibleMarkers = useMemo(() => mapMarkers.filter((marker) => activeCategory === 'Todo' || marker.type === categoryToMapType(activeCategory)), [activeCategory])

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
          <a className="active" href="#explora" onClick={() => setMobileNav(false)}>{text.explore}</a>
          <a href="#pedidos" onClick={() => setMobileNav(false)}>{text.order}</a>
          <a href="#experiencias" onClick={() => setMobileNav(false)}>{text.experiences}</a>
          <a href="#pautas" onClick={() => setMobileNav(false)}>Pautas locales</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button mobile-menu" aria-label="Abrir menú" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
          <div className="locale-tools"><button className="locale-button" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}>{language.toUpperCase()}</button><select aria-label="Cambiar moneda" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="COP">COP</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div><button className="cart-button" onClick={() => setShowCart(true)}><ShoppingBag size={18} /><span>{text.orderTitle}</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero" id="explora">
          <div className="hero-copy">
            <img className="hero-logo" src="/logo_salento2026.png" alt="Mapa turístico, comercial y gastronómico de Salento" />
            <p className="eyebrow"><span /> {text.guide}</p>
            <h1>{text.title}</h1>
            <p className="hero-description">{text.description}</p>
            <div className="search-box">
              <Search size={19} />
              <input aria-label="Buscar en Salento" placeholder={text.search} value={search} onChange={(event) => setSearch(event.target.value)} />
              <button aria-label="Buscar"><ArrowRight size={18} /></button>
            </div>
            <div className="trust-line"><span className="avatars"><b>J</b><b>M</b><b>A</b></span><span><strong>+1.200 viajeros</strong> ya exploraron Salento</span></div>
          </div>
          <div className="hero-art" aria-label="Ilustración del paisaje de Salento">
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
          <div className="section-heading"><div><p className="eyebrow">{text.nearby}</p><h2>{text.today}</h2></div><button className="text-button">Ver todo <ArrowRight size={16} /></button></div>
          <div className="category-row">
            {(['Todo', 'Comer', 'Comprar', 'Experiencias'] as Category[]).map((category) => (
              <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => setActiveCategory(category)}>
                {category === 'Todo' && <Sparkles size={17} />}{category === 'Comer' && <Utensils size={17} />}{category === 'Comprar' && <ShoppingBasket size={17} />}{category === 'Experiencias' && <Compass size={17} />}
                {category}
              </button>
            ))}
          </div>
          <div className="place-grid">
            {filteredPlaces.map((place) => <PlaceCard key={place.id} place={place} currency={currency} onAdd={addToCart} />)}
            {filteredPlaces.length === 0 && <div className="empty-state">No encontramos ese plan todavía. Prueba con “café”, “artesanía” o “trucha”.</div>}
          </div>
        </section>

        <section className="principles-strip"><div><MapPin size={20} /><strong>Mapa ligero</strong><span>Encuentra sin perderte</span></div><div><Bike size={20} /><strong>Entrega local</strong><span>Directo a tu hospedaje</span></div><div><MessageCircle size={20} /><strong>Sin barreras</strong><span>Idioma y moneda a tu medida</span></div><div><Sparkles size={20} /><strong>Economía local</strong><span>Compra directo en Salento</span></div></section>

        <section className="map-section" id="mapa">
          <div className="map-copy"><p className="eyebrow">Orienta tu paseo</p><h2>{text.map}</h2><p>Descubre rutas a pie, lugares favoritos y recomendaciones de quienes hacen de Salento su casa.</p><button className="dark-button">Abrir mapa completo <ArrowRight size={17} /></button><div className="map-legend"><span><i className="legend-dot coral" />Favoritos locales</span><span><i className="legend-dot green" />Para descubrir</span></div></div>
          <div className="map-visual" aria-label="Mapa interactivo de Salento con lugares destacados"><MapContainer center={[4.6371, -75.5706]} zoom={16} scrollWheelZoom={false} className="leaflet-map"><TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{visibleMarkers.map((marker) => <CircleMarker key={marker.label} center={[marker.lat, marker.lng]} radius={10} pathOptions={{ color: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#ba8a25' : '#e76c52', fillColor: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#e8bb58' : '#e76c52', fillOpacity: 0.9 }}><Popup><strong>{marker.label}</strong><br /><span>{marker.type} · Salento</span><br /><button className="popup-action">Ver ficha <ArrowRight size={13} /></button></Popup></CircleMarker>)}<MapControls /></MapContainer></div>
        </section>

            <section className="advertising-section" id="pautas"><div><p className="eyebrow">Hazte visible en Salento</p><h2>Pautas que llegan<br /><i>al lugar correcto.</i></h2><p>Tu negocio aparece en el mapa digital, en las búsquedas y frente a turistas listos para comprar o reservar.</p></div><div className="advertising-cards"><article><span className="ad-tag">Gastronomía</span><strong>Tu sabor, en el mapa.</strong><small>Ficha + ubicación + pedidos</small></article><article><span className="ad-tag green-tag">Comercio local</span><strong>Lo local se encuentra.</strong><small>Ficha + ubicación + contacto</small></article><article><span className="ad-tag yellow-tag">Experiencias</span><strong>El plan empieza aquí.</strong><small>Ficha + reservas + rutas</small></article></div><button className="dark-button ad-button">Conoce las pautas <ArrowRight size={17} /></button></section>

        <section className="stay-banner" id="experiencias"><div><p className="eyebrow">Para tu estadía</p><h2>Que no te cuenten<br /><i>el plan completo.</i></h2></div><div className="stay-actions"><p>Recibe recomendaciones según tu hospedaje, tus gustos y el tiempo que tienes.</p><button className="outline-button">Personalizar mi visita <ArrowRight size={16} /></button></div></section>
      </main>

      <footer><span>Salento a la mano · Guía comercial y gastronómica</span><span>Hecho con cariño en el Quindío</span></footer>
      {showCart && <Cart count={cartCount} currency={currency} onClose={() => setShowCart(false)} onAdd={addToCart} />}
      <DonChucho language={language} />
      <div className="offline-status"><span /> Información local disponible</div>
    </div>
  )
}

function DonChucho({ language }: { language: Language }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(language === 'en' ? 'Hi! I can help you find coffee, food, local shops or plans in Salento.' : '¡Hola! Te ayudo a encontrar café, comida, tiendas locales o planes en Salento.')
  const isEnglish = language === 'en'

  function ask(text: string) {
    setQuestion(text)
    const normalized = text.toLowerCase()
    if (normalized.includes('cafe') || normalized.includes('coffee')) setAnswer(isEnglish ? 'Try Café Quindío near the main square, or choose Comer to see delivery options.' : 'Prueba Café Quindío cerca de la plaza, o elige Comer para ver opciones con domicilio.')
    else if (normalized.includes('cocora') || normalized.includes('horse') || normalized.includes('caballo')) setAnswer(isEnglish ? 'For Cocora, book a local guide and confirm transport before leaving town.' : 'Para Cocora, reserva un guía local y confirma el transporte antes de salir del pueblo.')
    else setAnswer(isEnglish ? 'I can guide you to local food, crafts, coffee, viewpoints and hotel delivery.' : 'Puedo guiarte hacia comida local, artesanías, café, miradores y domicilios al hotel.')
  }

  return <div className={open ? 'chucho-widget open' : 'chucho-widget'}>{open && <div className="chucho-panel"><div className="chucho-head"><div><strong>Don Chucho</strong><span>{isEnglish ? 'Your local guide' : 'Tu guía local'}</span></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={16} /></button></div><div className="chucho-answer"><MessageCircle size={16} />{answer}</div><div className="chucho-suggestions"><button onClick={() => ask(isEnglish ? 'Where is the best coffee?' : '¿Dónde hay buen café?')}>{isEnglish ? 'Best coffee' : 'Buen café'}</button><button onClick={() => ask(isEnglish ? 'How do I get to Cocora?' : '¿Cómo voy a Cocora?')}>{isEnglish ? 'Cocora' : 'Valle de Cocora'}</button></div><form onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={isEnglish ? 'Ask Don Chucho...' : 'Pregúntale a Don Chucho...'} /><button aria-label="Enviar pregunta"><Send size={15} /></button></form></div>}<button className="chucho-trigger" onClick={() => setOpen(!open)} aria-label="Abrir asistente Don Chucho"><span className="chucho-face">☕</span><span>{isEnglish ? 'Ask Don Chucho' : 'Pregúntale a Don Chucho'}</span><MessageCircle size={17} /></button></div>
}

function categoryToMapType(category: Category) {
  if (category === 'Comer') return 'Gastronómico'
  if (category === 'Comprar') return 'Comercial'
  return 'Turístico'
}

function PlaceCard({ place, currency, onAdd }: { place: Place; currency: Currency; onAdd: () => void }) {
  const Icon = place.icon
  return <article className="place-card"><div className={`place-image ${place.color}`}><div className="image-pattern" /><span className="place-badge">{place.badge}</span><button className="heart-button" aria-label={`Guardar ${place.name}`}><Heart size={17} /></button><Icon className="place-icon" size={45} strokeWidth={1.2} /></div><div className="place-info"><div className="place-topline"><span>{place.type}</span><span className="rating"><Star size={13} fill="currentColor" /> {place.rating}</span></div><h3>{place.name}</h3><p>{place.description}</p><div className="place-bottom"><span><strong>{place.price}</strong> · <Clock3 size={13} /> {place.time}</span><button className="add-button" onClick={onAdd} aria-label={`Añadir ${place.name}`}><Plus size={18} /></button></div><small className="currency-hint">Desde {formatPrice(35000, currency)} · tasa de referencia</small></div></article>
}

function MapControls() {
  const map = useMap()

  function locateUser() {
    map.locate({ setView: true, maxZoom: 17 })
  }

  return <div className="map-controls"><button onClick={() => map.zoomIn()} aria-label="Acercar mapa"><Plus size={17} /></button><button onClick={() => map.zoomOut()} aria-label="Alejar mapa"><Minus size={17} /></button><button onClick={locateUser} aria-label="Usar mi ubicación"><MapPin size={17} /></button></div>
}

function Cart({ count, currency, onClose, onAdd }: { count: number; currency: Currency; onClose: () => void; onAdd: () => void }) {
  const [checkout, setCheckout] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return <div className="cart-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>{submitted ? <div className="order-success"><div className="success-mark"><Bike size={28} /></div><p className="eyebrow">Pedido recibido</p><h2>Ya vamos en camino.</h2><p>Tu solicitud fue registrada. El comercio confirmará la hora exacta de entrega en tu hospedaje.</p><strong className="order-code">PEDIDO #SAL-024</strong><button className="checkout-button" onClick={onClose}>Volver a explorar <ArrowRight size={18} /></button></div> : <><div className="drawer-head"><div><p className="eyebrow">Tu selección</p><h2>{checkout ? '¿Dónde te lo llevamos?' : 'Mi pedido'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar pedido"><X size={20} /></button></div>{checkout ? <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label>Hotel aliado<select required defaultValue=""><option value="" disabled>Selecciona tu hospedaje</option><option>Hotel Salento Real</option><option>Hotel Kawa Mountain Retreat</option><option>Villas del Cocora</option><option>Otro hospedaje</option></select></label><label>Habitación<input required placeholder="Ej. 204" /></label><label>Celular de contacto<input required type="tel" placeholder="300 000 0000" /></label><label>Indicaciones para llegar<textarea placeholder="Recepción, cabaña o punto de encuentro" rows={3} /></label><div className="delivery-note"><Bike size={19} /><span><strong>Pago al recibir</strong><br />El domicilio se confirma contigo antes de salir.</span></div><button className="checkout-button" type="submit">Confirmar pedido <ArrowRight size={18} /></button><button className="back-button" type="button" onClick={() => setCheckout(false)}>Volver al resumen</button></form> : <><div className="cart-place"><div className="mini-thumb terracotta"><Coffee size={24} /></div><div><strong>Brunch de la Plaza</strong><span>Arepa de chocolo · Café filtrado</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="cart-place"><div className="mini-thumb sage"><ShoppingBasket size={24} /></div><div><strong>Canasto Quindiano</strong><span>Selección de café local</span></div><div className="quantity"><button aria-label="Restar"><Minus size={13} /></button><span>1</span><button onClick={onAdd} aria-label="Sumar"><Plus size={13} /></button></div></div><div className="delivery-note"><Bike size={19} /><span><strong>Entrega en tu hospedaje</strong><br />Calcularemos la tarifa al confirmar tu dirección.</span></div><div className="cart-total"><span>Total estimado</span><strong>{formatPrice(48000, currency)}</strong></div><button className="checkout-button" onClick={() => setCheckout(true)}>Continuar con el pedido <ArrowRight size={18} /></button><p className="cart-footnote">{count} productos seleccionados · Pago al recibir</p></>}</>}</aside></div>
}

export default App
