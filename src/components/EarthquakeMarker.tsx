/**
 * Componente EarthquakeMarker - Marcador para terremotos en el mapa Leaflet
 * Se integra con el mapa existente sin modificar código destructivamente
 * Mejorado con impacto turístico (Fase 2)
 */
import { CircleMarker, Popup } from 'react-leaflet';
import { OsirisEarthquake, TourismImpact } from '../services/osirisTypes';
import osirisTourismEngine from '../services/osirisTourismEngine';

interface EarthquakeMarkerProps {
  earthquake: OsirisEarthquake;
}

export default function EarthquakeMarker({ earthquake }: EarthquakeMarkerProps) {
  // Calcular impacto turístico
  const tourismImpact: TourismImpact = osirisTourismEngine.interpretEarthquakeForTourism(earthquake);

  // Color según magnitud
  const getColorByMagnitude = (magnitude: number): string => {
    if (magnitude >= 6.0) return '#dc2626'; // Rojo - severo
    if (magnitude >= 5.0) return '#ea580c'; // Naranja oscuro
    if (magnitude >= 4.0) return '#f59e0b'; // Naranja
    if (magnitude >= 3.0) return '#eab308'; // Amarillo
    return '#84cc16'; // Verde - menor
  };

  // Radio según magnitud
  const getRadiusByMagnitude = (magnitude: number): number => {
    return magnitude * 3; // Escala visual
  };

  const color = getColorByMagnitude(earthquake.magnitude);
  const radius = getRadiusByMagnitude(earthquake.magnitude);

  const timeAgo = () => {
    const now = new Date();
    const eqTime = new Date(earthquake.time);
    const diffMs = now.getTime() - eqTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return 'Hace menos de 1 hora';
  };

  const getRiskLevelBadge = () => {
    const badges = {
      none: { text: 'Sin riesgo', color: '#84cc16' },
      low: { text: 'Riesgo bajo', color: '#eab308' },
      moderate: { text: 'Riesgo moderado', color: '#f59e0b' },
      high: { text: 'Riesgo alto', color: '#ea580c' },
      severe: { text: 'Riesgo severo', color: '#dc2626' }
    };
    return badges[tourismImpact.riskLevel];
  };

  return (
    <CircleMarker
      center={[earthquake.lat, earthquake.lng]}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2
      }}
      radius={radius}
    >
      <Popup>
        <div className="earthquake-popup">
          <div className="popup-header">
            <span className="popup-icon">⚠️</span>
            <strong>Terremoto</strong>
          </div>
          <div className="popup-content">
            <div className="popup-row">
              <span className="label">Magnitud:</span>
              <span className={`magnitude magnitude-${earthquake.magnitude >= 5 ? 'high' : 'medium'}`}>
                M{earthquake.magnitude.toFixed(1)}
              </span>
            </div>
            <div className="popup-row">
              <span className="label">Ubicación:</span>
              <span className="value">{earthquake.place}</span>
            </div>
            <div className="popup-row">
              <span className="label">Profundidad:</span>
              <span className="value">{earthquake.depth} km</span>
            </div>
            <div className="popup-row">
              <span className="label">Hora:</span>
              <span className="value">{timeAgo()}</span>
            </div>
            <div className="popup-row">
              <span className="label">Fecha:</span>
              <span className="value">{new Date(earthquake.time).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* SECCIÓN TURÍSTICA - Fase 2 */}
          <div className="tourism-impact-section">
            <div className="tourism-impact-header">
              <span className="tourism-icon">🎯</span>
              <strong>Impacto Turístico</strong>
            </div>
            <div className="risk-badge" style={{ backgroundColor: getRiskLevelBadge().color }}>
              {getRiskLevelBadge().text}
            </div>
            <p className="tourism-impact-text">{tourismImpact.impact}</p>
            
            {tourismImpact.affectedAreas.length > 0 && (
              <div className="affected-areas">
                <span className="areas-label">Zonas afectadas:</span>
                <ul>
                  {tourismImpact.affectedAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="tourism-recommendation">
              <strong>Recomendación:</strong>
              <p>{tourismImpact.recommendation}</p>
            </div>
            
            {tourismImpact.alternativeRoutes.length > 0 && (
              <div className="alternatives">
                <strong>Alternativas:</strong>
                <ul>
                  {tourismImpact.alternativeRoutes.map((route, index) => (
                    <li key={index}>{route}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="popup-footer">
            <small>Datos: OSIRIS AI</small>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
