/**
 * Componente SafetyWidget - Muestra datos de seguridad y clima de OSIRIS
 * Se integra en la UI existente sin modificar código destructivamente
 * Expandido para mostrar incendios y noticias
 */
import { AlertTriangle, Cloud, Wind, RefreshCw, Signal, Flame, Newspaper } from 'lucide-react';
import { useOsirisData } from '../hooks/useOsirisData';

export default function SafetyWidget() {
  const { data, loading, error, refresh, isOnline, lastUpdate } = useOsirisData(true);

  const significantEarthquakes = data.earthquakes.filter(eq => eq.magnitude >= 4.0);
  const hasHighRisk = significantEarthquakes.length > 0;

  const significantFires = data.fires.filter(fire => fire.brightness >= 350);
  const hasFires = significantFires.length > 0;

  const highRiskNews = data.news.filter(news => news.risk_score >= 5);
  const hasHighRiskNews = highRiskNews.length > 0;

  return (
    <div className="safety-widget">
      {/* Header */}
      <div className="safety-widget-header">
        <div className="header-left">
          <h4>🛡️ Seguridad y Clima</h4>
        </div>
        <div className="header-right">
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            <Signal size={12} />
            {isOnline ? 'En línea' : 'Offline'}
          </span>
          <button
            onClick={refresh}
            disabled={!isOnline || loading}
            className="refresh-button"
            title="Actualizar datos"
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="safety-loading">
          <p>Cargando datos de seguridad...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="safety-error">
          <AlertTriangle size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="safety-content">
          {/* Earthquake Section */}
          <div className="safety-section">
            <div className="section-title">
              <AlertTriangle size={16} />
              <span>Sísmico</span>
            </div>

            {hasHighRisk ? (
              <div className="safety-warning">
                <p className="warning-text">
                  ⚠️ {significantEarthquakes.length} evento{significantEarthquakes.length > 1 ? 's' : ''} significativo{significantEarthquakes.length > 1 ? 's' : ''}
                </p>
                {significantEarthquakes.slice(0, 2).map(eq => (
                  <div key={eq.id} className="earthquake-item">
                    <span className="magnitude-badge">M{eq.magnitude.toFixed(1)}</span>
                    <span className="location-text">{eq.place}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="safety-safe">
                <p className="safe-text">✅ Sin actividad significativa</p>
                {data.earthquakes.length > 0 && (
                  <small className="info-text">
                    {data.earthquakes.length} evento{data.earthquakes.length > 1 ? 's' : ''} menor{data.earthquakes.length > 1 ? 'es' : ''}
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Weather Section */}
          {data.weather.length > 0 && (
            <div className="safety-section">
              <div className="section-title">
                <Cloud size={16} />
                <span>Clima</span>
              </div>

              <div className="weather-list">
                {data.weather.slice(0, 2).map((event, index) => (
                  <div key={index} className="weather-item">
                    <span className="event-type">{event.event}</span>
                    <span className={`severity-badge severity-${event.severity}`}>
                      {event.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Air Quality Section */}
          {data.airQuality && (
            <div className="safety-section">
              <div className="section-title">
                <Wind size={16} />
                <span>Calidad del Aire</span>
              </div>

              <div className="air-quality-display">
                <span className="aqi-value">AQI: {data.airQuality.aqi}</span>
                <span className={`aqi-label aqi-${data.airQuality.aqi <= 50 ? 'good' : data.airQuality.aqi <= 100 ? 'moderate' : 'unhealthy'}`}>
                  {data.airQuality.aqi <= 50 ? 'Bueno' :
                   data.airQuality.aqi <= 100 ? 'Moderado' :
                   'No saludable'}
                </span>
              </div>
            </div>
          )}

          {/* Fires Section */}
          {hasFires && (
            <div className="safety-section">
              <div className="section-title">
                <Flame size={16} />
                <span>Incendios</span>
              </div>

              <div className="safety-warning">
                <p className="warning-text">
                  🔥 {significantFires.length} incendio{significantFires.length > 1 ? 's' : ''} activo{significantFires.length > 1 ? 's' : ''}
                </p>
                {significantFires.slice(0, 2).map(fire => (
                  <div key={fire.id} className="fire-item">
                    <span className="fire-brightness">Brillo: {fire.brightness}</span>
                    <span className="fire-type">{fire.type === 'wildfire' ? 'Forestal' : 'Volcán'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Section */}
          {hasHighRiskNews && (
            <div className="safety-section">
              <div className="section-title">
                <Newspaper size={16} />
                <span>Noticias Relevantes</span>
              </div>

              <div className="news-list">
                {highRiskNews.slice(0, 2).map((news, index) => (
                  <div key={index} className="news-item">
                    <span className="news-title">{news.title}</span>
                    <span className="news-source">{news.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="safety-footer">
            <small>Actualizado: {lastUpdate}</small>
            <small className="data-source">Datos: OSIRIS AI</small>
          </div>
        </div>
      )}
    </div>
  );
}
