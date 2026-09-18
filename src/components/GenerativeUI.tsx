// Generative UI - Renderiza componentes dinámicos según intención del usuario
// Cada intención genera una UI diferente y optimizada

import React from 'react'
import { Place, Language } from '../types'
import { TravelPhase } from '../hooks/useTravelContext'

export type UserIntent = 
  | 'explore-restaurants'
  | 'explore-hotels'
  | 'explore-activities'
  | 'plan-route'
  | 'get-weather'
  | 'find-transport'
  | 'order-food'
  | 'book-tour'
  | 'emergency'
  | 'general-info'

interface GenerativeUIProps {
  intent: UserIntent
  places: Place[]
  language: Language
  phase: TravelPhase
  onPlaceSelect: (place: Place) => void
  onWhatsApp: (phone: string, message: string) => void
}

// Componente: Cards de restaurantes optimizadas
function RestaurantCards({ places, language, onPlaceSelect }: { places: Place[]; language: Language; onPlaceSelect: (p: Place) => void }) {
  const restaurants = places.filter(p => 
    p.type === 'Restaurantes' || p.type === 'Restaurante Bar' || p.type === 'Cafés'
  ).slice(0, 4)
  
  if (restaurants.length === 0) return null
  
  return (
    <div className="gen-ui-restaurant-cards">
      <h4>{language === 'es' ? '🍽️ Restaurantes cerca' : '🍽️ Restaurants nearby'}</h4>
      <div className="gen-ui-grid">
        {restaurants.map(r => (
          <div key={r.id} className="gen-ui-card" onClick={() => onPlaceSelect(r)}>
            {r.photos?.[0] && <img src={r.photos[0]} alt={r.name} className="gen-ui-card-img" />}
            <div className="gen-ui-card-body">
              <strong>{r.name}</strong>
              <span className="gen-ui-card-meta">{r.type}</span>
              {r.priceRange && <span className="gen-ui-card-price">{r.priceRange}</span>}
              {r.contact?.whatsapp && (
                <button className="gen-ui-card-action" onClick={(e) => { e.stopPropagation(); }}>
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente: Cards de hoteles optimizadas
function HotelCards({ places, language, onPlaceSelect }: { places: Place[]; language: Language; onPlaceSelect: (p: Place) => void }) {
  const hotels = places.filter(p => 
    p.type === 'Alojamientos'
  ).slice(0, 3)
  
  if (hotels.length === 0) return null
  
  return (
    <div className="gen-ui-hotel-cards">
      <h4>{language === 'es' ? '🏨 Alojamientos disponibles' : '🏨 Available accommodations'}</h4>
      <div className="gen-ui-grid">
        {hotels.map(h => (
          <div key={h.id} className="gen-ui-card" onClick={() => onPlaceSelect(h)}>
            {h.photos?.[0] && <img src={h.photos[0]} alt={h.name} className="gen-ui-card-img" />}
            <div className="gen-ui-card-body">
              <strong>{h.name}</strong>
              {h.rating && <span className="gen-ui-card-rating">⭐ {h.rating}</span>}
              {h.priceRange && <span className="gen-ui-card-price">{h.priceRange}</span>}
              {h.contact?.whatsapp && (
                <button className="gen-ui-card-action" onClick={(e) => { e.stopPropagation(); }}>
                  Reservar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente: Ruta del día optimizada
function RoutePlanner({ places, language, phase }: { places: Place[]; language: Language; phase: TravelPhase }) {
  const morningPlaces = places.filter(p => 
    p.type === 'Coffee Tours'
  ).slice(0, 2)
  
  const afternoonPlaces = places.filter(p => 
    p.type === 'Atractivos Turísticos' || p.type === 'Experiencias'
  ).slice(0, 2)
  
  const eveningPlaces = places.filter(p => 
    p.type === 'Restaurantes' || p.type === 'Restaurante Bar'
  ).slice(0, 2)
  
  return (
    <div className="gen-ui-route">
      <h4>{language === 'es' ? '📍 Tu ruta del día' : '📍 Your day route'}</h4>
      <div className="gen-ui-timeline">
        <div className="gen-ui-timeline-item">
          <span className="gen-ui-timeline-time">🌅 8:00 AM</span>
          <span className="gen-ui-timeline-activity">
            {language === 'es' ? 'Café y desayuno' : 'Coffee & breakfast'}
          </span>
        </div>
        {morningPlaces.map(p => (
          <div key={p.id} className="gen-ui-timeline-item gen-ui-timeline-place">
            <span className="gen-ui-timeline-time">☕ 9:00 AM</span>
            <span className="gen-ui-timeline-activity">{p.name}</span>
          </div>
        ))}
        <div className="gen-ui-timeline-item">
          <span className="gen-ui-timeline-time">🍽️ 12:30 PM</span>
          <span className="gen-ui-timeline-activity">
            {language === 'es' ? 'Almuerzo' : 'Lunch'}
          </span>
        </div>
        {afternoonPlaces.map(p => (
          <div key={p.id} className="gen-ui-timeline-item gen-ui-timeline-place">
            <span className="gen-ui-timeline-time">🌄 2:00 PM</span>
            <span className="gen-ui-timeline-activity">{p.name}</span>
          </div>
        ))}
        {eveningPlaces.map(p => (
          <div key={p.id} className="gen-ui-timeline-item gen-ui-timeline-place">
            <span className="gen-ui-timeline-time">🌙 6:00 PM</span>
            <span className="gen-ui-timeline-activity">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente: Buscador de transporte
function TransportFinder({ language }: { language: Language }) {
  return (
    <div className="gen-ui-transport">
      <h4>{language === 'es' ? '🚗 Cómo llegar' : '🚗 How to get there'}</h4>
      <div className="gen-ui-transport-options">
        <div className="gen-ui-transport-option">
          <span className="gen-ui-transport-icon">🚙</span>
          <div>
            <strong>{language === 'es' ? 'Willy / Jeep' : 'Willy / Jeep'}</strong>
            <p>{language === 'es' ? 'Desde la plaza principal. ~$4.000-$6.000 COP' : 'From main square. ~$4,000-$6,000 COP'}</p>
          </div>
        </div>
        <div className="gen-ui-transport-option">
          <span className="gen-ui-transport-icon">🚕</span>
          <div>
            <strong>{language === 'es' ? 'Taxi / Transporte privado' : 'Taxi / Private transport'}</strong>
            <p>{language === 'es' ? 'Disponible 24/7. Reservar con anticipación' : 'Available 24/7. Book in advance'}</p>
          </div>
        </div>
        <div className="gen-ui-transport-option">
          <span className="gen-ui-transport-icon">🚌</span>
          <div>
            <strong>{language === 'es' ? 'Buso / Colectivo' : 'Bus / Shared'}</strong>
            <p>{language === 'es' ? 'Ruta Armenia-Salento. ~$8.000 COP' : 'Armenia-Salento route. ~$8,000 COP'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente: Pedido rápido por WhatsApp
function QuickOrder({ places, language, onWhatsApp }: { places: Place[]; language: Language; onWhatsApp: (phone: string, msg: string) => void }) {
  const foodPlaces = places.filter(p => 
    p.type === 'Restaurantes' || p.type === 'Restaurante Bar' || p.type === 'Cafés'
  ).filter(p => p.contact?.whatsapp).slice(0, 3)
  
  if (foodPlaces.length === 0) return null
  
  return (
    <div className="gen-ui-quick-order">
      <h4>{language === 'es' ? '📱 Pedido rápido' : '📱 Quick order'}</h4>
      <div className="gen-ui-order-list">
        {foodPlaces.map(p => (
          <div key={p.id} className="gen-ui-order-item">
            <span>{p.name}</span>
            <button 
              className="gen-ui-order-btn"
              onClick={() => onWhatsApp(p.contact!.whatsapp!, `¡Hola! Me gustaría hacer un pedido. ¿Me pueden enviar el menú?`)}
            >
              {language === 'es' ? 'Pedir' : 'Order'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente principal GenerativeUI
export function GenerativeUI({ intent, places, language, phase, onPlaceSelect, onWhatsApp }: GenerativeUIProps) {
  switch (intent) {
    case 'explore-restaurants':
      return <RestaurantCards places={places} language={language} onPlaceSelect={onPlaceSelect} />
    case 'explore-hotels':
      return <HotelCards places={places} language={language} onPlaceSelect={onPlaceSelect} />
    case 'plan-route':
      return <RoutePlanner places={places} language={language} phase={phase} />
    case 'find-transport':
      return <TransportFinder language={language} />
    case 'order-food':
      return <QuickOrder places={places} language={language} onWhatsApp={onWhatsApp} />
    case 'explore-activities':
      return (
        <div className="gen-ui-activities">
          <h4>{language === 'es' ? '🌄 Experiencias' : '🌄 Experiences'}</h4>
          <div className="gen-ui-grid">
            {places.filter(p => p.type === 'Experiencias').slice(0, 4).map(p => (
              <div key={p.id} className="gen-ui-card" onClick={() => onPlaceSelect(p)}>
                {p.photos?.[0] && <img src={p.photos[0]} alt={p.name} className="gen-ui-card-img" />}
                <div className="gen-ui-card-body">
                  <strong>{p.name}</strong>
                  {p.priceRange && <span className="gen-ui-card-price">{p.priceRange}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return null
  }
}

// Función para detectar intención del usuario desde texto
export function detectIntent(text: string): UserIntent {
  const lower = text.toLowerCase()
  
  if (/restaurante|comer|trucha|almuerzo|cena|desayuno|food|restaurant|eat/.test(lower)) {
    if (/pedir|ordenar|domicilio|order/.test(lower)) return 'order-food'
    return 'explore-restaurants'
  }
  if (/hotel|hospedaje|dormir|habitación|alojamiento|stay|hotel|room/.test(lower)) {
    return 'explore-hotels'
  }
  if (/ruta|plan|qué hacer|itinerario|day|route|plan/.test(lower)) {
    return 'plan-route'
  }
  if (/clima|tiempo|lluvia|frío|calor|weather|rain/.test(lower)) {
    return 'get-weather'
  }
  if (/transporte|llegar|cómo|taxi|willy|jeep|bus|transport|how to/.test(lower)) {
    return 'find-transport'
  }
  if (/tour|cabalgata|experiencia|aventura|tour|horseback|adventure/.test(lower)) {
    return 'book-tour'
  }
  if (/emergencia|policía|hospital|ambulancia|emergency|police|hospital/.test(lower)) {
    return 'emergency'
  }
  
  return 'general-info'
}
