import { createRoot } from 'react-dom/client'
import MapaInteractivo from './mapa-map'

const container = document.getElementById('mapa-interactivo-leaflet')
if (container) {
  createRoot(container).render(<MapaInteractivo />)
}
