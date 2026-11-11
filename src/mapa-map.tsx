import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { dataService } from './services/dataService'
import type { MapMarker } from './types'

function MapaInteractivoMap() {
  const [markers, setMarkers] = useState<MapMarker[]>([])

  useEffect(() => {
    let alive = true
    dataService.getMapMarkers()
      .then((data) => {
        if (!alive) return
        setMarkers(Array.isArray(data) ? data : [])
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  return (
    <MapContainer center={[4.65746762702703, -75.5727757405405]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="mapa-interactivo-leaflet">
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={marker.coord}
          radius={10}
          pathOptions={{
            color: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#ba8a25' : '#e76c52',
            fillColor: marker.tone === 'green' ? '#56755b' : marker.tone === 'yellow' ? '#ba8a25' : '#e76c52',
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <strong>{marker.label}</strong>
            <br />
            <span>{marker.type} · Salento</span>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

export default function MapaInteractivo() {
  return (
    <div style={{ height: '485px', width: '100%', borderRadius: '18px', overflow: 'hidden', border: '1px solid #d9d0bf', background: '#b1c69f' }}>
      <MapaInteractivoMap />
    </div>
  )
}
