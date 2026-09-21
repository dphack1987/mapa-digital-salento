import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import './ARMapController.css'

interface ARPlace {
  id: number
  name: string
  type: string
  description: string
  rating?: string
  photos?: string[]
  location: {
    lat?: number
    lng?: number
    address?: string
    landmark?: string
  }
  contact?: {
    phone?: string
    whatsapp?: string
  }
  verified?: boolean
  active?: boolean
}

interface ARMapControllerProps {
  places: ARPlace[]
  userLocation?: { lat: number; lng: number } | null
  onPlaceSelect?: (place: ARPlace) => void
}

function ARMapController({ places, userLocation, onPlaceSelect }: ARMapControllerProps) {
  const [arMode, setARMode] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<ARPlace | null>(null)
  const [donChuchoSpeaking, setDonChuchoSpeaking] = useState(false)

  const speakPlaceInfo = (place: ARPlace) => {
    if ('speechSynthesis' in window) {
      const info = `${place.name}. ${place.description} Ubicado en ${place.location?.address || 'Salento'}. Rating: ${place.rating || 'sin rating'} estrellas.`
      const utterance = new SpeechSynthesisUtterance(info)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      setDonChuchoSpeaking(true)
      utterance.onend = () => setDonChuchoSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleARModeToggle = () => {
    setARMode(!arMode)
    if (!arMode) {
      setSelectedPlace(null)
    }
  }

  const handlePlaceClick = (place: ARPlace) => {
    setSelectedPlace(place)
    if (onPlaceSelect) {
      onPlaceSelect(place)
    }
    if (arMode) {
      speakPlaceInfo(place)
    }
  }

  const getDistance = (place: ARPlace) => {
    if (!userLocation || !place.location?.lat || !place.location?.lng) return null
    const R = 6371 // Radio de la Tierra en km
    const dLat = (place.location.lat - userLocation.lat) * Math.PI / 180
    const dLon = (place.location.lng - userLocation.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(place.location.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Filtrar solo lugares verificados y activos para AR
  const arPlaces = places.filter(place => 
    place.verified && 
    place.active && 
    place.location?.lat && 
    place.location?.lng
  )

  return (
    <div className="ar-map-container">
      <div className="ar-controls">
        <button 
          className={`ar-toggle ${arMode ? 'active' : ''}`}
          onClick={handleARModeToggle}
          aria-label={arMode ? 'Desactivar modo AR' : 'Activar modo AR'}
        >
          {arMode ? '🥽 AR Activo' : '🎯 Activar AR'}
        </button>
        {arMode && userLocation && (
          <div className="ar-info">
            <span>📍 Tu ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>
        )}
        {donChuchoSpeaking && (
          <div className="don-chucho-ar">
            🔊 Don Chucho explicando...
          </div>
        )}
      </div>

      <MapContainer 
        center={[4.65746762702703, -75.5727757405405]} 
        zoom={16} 
        scrollWheelZoom={false} 
        className={`leaflet-map ${arMode ? 'ar-mode' : ''}`}
      >
        <TileLayer 
          attribution="&copy; OpenStreetMap" 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        
        {arPlaces.map((place) => (
          <CircleMarker
            key={place.id}
            center={[place.location.lat!, place.location.lng!]}
            radius={arMode ? 15 : 10}
            pathOptions={{
              color: arMode ? '#e76c52' : '#56755b',
              fillColor: arMode ? '#e76c52' : '#56755b',
              fillOpacity: arMode ? 0.8 : 0.6,
              weight: arMode ? 3 : 2
            }}
            eventHandlers={{
              click: () => handlePlaceClick(place)
            }}
          >
            <Popup>
              <div className="ar-popup">
                <strong>{place.name}</strong>
                <span className="ar-badge">AR Info</span>
                <p>{place.description.substring(0, 100)}...</p>
                <div className="ar-details">
                  <span>⭐ {place.rating || 'sin rating'} estrellas</span>
                  <span>📍 {place.location?.address || 'Salento'}</span>
                  {userLocation && getDistance(place) && (
                    <span>📏 {getDistance(place)!.toFixed(2)} km</span>
                  )}
                </div>
                {arMode && place.photos && place.photos.length > 0 && (
                  <div className="ar-photos">
                    <strong>Fotos AR:</strong>
                    <img 
                      src={place.photos[0]} 
                      alt={place.name}
                      className="ar-photo-preview"
                    />
                  </div>
                )}
                <button 
                  className="ar-action-btn"
                  onClick={() => speakPlaceInfo(place)}
                >
                  🔊 Don Chucho explica
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {userLocation && arMode && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{
              color: '#e76c52',
              fillColor: '#e76c52',
              fillOpacity: 0.8,
              weight: 3
            }}
          >
            <Popup>
              <strong>📍 Tu ubicación</strong>
              <p>Coordenadas: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {selectedPlace && arMode && (
        <div className="ar-overlay">
          <div className="ar-info-panel">
            <button 
              className="ar-close-btn"
              onClick={() => setSelectedPlace(null)}
              aria-label="Cerrar info AR"
            >
              ✕
            </button>
            <h3>{selectedPlace.name}</h3>
            <div className="ar-rating">⭐ {selectedPlace.rating || 'sin rating'} estrellas</div>
            <p>{selectedPlace.description}</p>
            <div className="ar-location">
              <strong>📍 Ubicación:</strong> {selectedPlace.location?.address || 'Salento'}
            </div>
            <div className="ar-landmark">
              <strong>🎯 Referencia:</strong> {selectedPlace.location?.landmark || 'Centro de Salento'}
            </div>
            {selectedPlace.photos && selectedPlace.photos.length > 0 && (
              <div className="ar-photos-panel">
                <strong>📷 Fotos:</strong>
                {selectedPlace.photos.slice(0, 3).map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`${selectedPlace.name} foto ${index + 1}`}
                    className="ar-place-photo"
                  />
                ))}
              </div>
            )}
            <div className="ar-actions">
              {selectedPlace.contact?.whatsapp && (
                <a 
                  href={`https://wa.me/${selectedPlace.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ar-whatsapp-btn"
                >
                  WhatsApp Directo
                </a>
              )}
              {selectedPlace.contact?.phone && (
                <a 
                  href={`tel:${selectedPlace.contact.phone}`}
                  className="ar-phone-btn"
                >
                  Llamar
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARMapController