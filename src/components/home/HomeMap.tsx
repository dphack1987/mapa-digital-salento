import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Minus, Plus } from 'lucide-react'
import type { MapMarker, Place } from '../../types'
import { markerCtaLabel } from '../../utils/placeCta'

type MapLabels = {
  viewMenu: string
  viewReserve: string
  viewInfo: string
}

type HomeMapProps = {
  markers: MapMarker[]
  places: Place[]
  labels: MapLabels
  ariaLabel: string
  onSelectPlace: (place: Place) => void
}

function MapControls() {
  const map = useMap()

  function locateUser() {
    map.locate({ setView: true, maxZoom: 17 })
  }

  return (
    <div className="map-controls">
      <button onClick={() => map.zoomIn()} aria-label="Acercar mapa"><Plus size={17} /></button>
      <button onClick={() => map.zoomOut()} aria-label="Alejar mapa"><Minus size={17} /></button>
      <button onClick={locateUser} aria-label="Usar mi ubicación"><MapPin size={17} /></button>
    </div>
  )
}

export default function HomeMap({ markers, places, labels, ariaLabel, onSelectPlace }: HomeMapProps) {
  return (
    <div className="map-visual" aria-label={ariaLabel}>
      <MapContainer center={[4.65746762702703, -75.5727757405405]} zoom={16} scrollWheelZoom={false} className="leaflet-map">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <CircleMarker
            key={marker.label}
            center={marker.coord}
            radius={10}
            pathOptions={{
              color: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#ba8a25' : '#e76c52',
              fillColor: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#e8bb58' : '#e76c52',
              fillOpacity: 0.9
            }}
          >
            <Popup>
              <strong>{marker.label}</strong><br />
              <span>{marker.type} · Salento</span><br />
              <button
                className="popup-action"
                onClick={() => {
                  const found = marker.placeId != null ? places.find((p) => p.id === marker.placeId) : undefined
                  if (found) onSelectPlace(found)
                }}
              >
                {markerCtaLabel(marker.type) === 'Ver menú'
                  ? labels.viewMenu
                  : markerCtaLabel(marker.type) === 'Reservar ya'
                    ? labels.viewReserve
                    : labels.viewInfo}{' '}
                <span aria-hidden="true">→</span>
              </button>
            </Popup>
          </CircleMarker>
        ))}
        <MapControls />
      </MapContainer>
    </div>
  )
}
