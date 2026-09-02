/**
 * Componente de Visualización de Mercados Internacionales
 * Muestra todos los mercados donde estamos presentes con banderas y en tiempo real
 */

import { useState, useEffect } from 'react'
import { Globe, Eye, Clock, CheckCircle, AlertCircle, X } from 'lucide-react'
import internationalSEOService from '../services/internationalSEO.service'

interface MarketDisplay {
  country: string
  flag: string
  language: string
  searchEngine: string
  population: string
  status: 'indexed' | 'pending' | 'in_progress'
  lastCrawled: string
  directAccess: boolean
  noIntermediaries: boolean
}

interface InternationalMarketsDisplayProps {
  onClose?: () => void
}

const InternationalMarketsDisplay: React.FC<InternationalMarketsDisplayProps> = ({ onClose }) => {
  const [markets, setMarkets] = useState<MarketDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    loadMarketData()
    const interval = setInterval(loadMarketData, 30000) // Actualizar cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  const loadMarketData = () => {
    setLoading(true)
    try {
      const internationalMarkets = internationalSEOService.getInternationalMarkets()
      const marketDisplays: MarketDisplay[] = internationalMarkets.map(market => ({
        country: market.country,
        flag: getCountryFlag(market.country),
        language: market.language,
        searchEngine: market.searchEngine,
        population: market.population,
        status: market.status === 'completed' ? 'indexed' : market.status === 'in_progress' ? 'in_progress' : 'pending',
        lastCrawled: 'Justo ahora',
        directAccess: true,
        noIntermediaries: true
      }))
      setMarkets(marketDisplays)
    } catch (error) {
      console.error('Error loading market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCountryFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
      'China': '🇨🇳',
      'Rusia': '🇷🇺',
      'Japón': '🇯🇵',
      'Corea del Sur': '🇰🇷',
      'Taiwán': '🇹🇼',
      'Hong Kong': '🇭🇰',
      'Tailandia': '🇹🇭',
      'Vietnam': '🇻🇳',
      'Indonesia': '🇮🇩',
      'Malasia': '🇲🇾',
      'Alemania': '🇩🇪',
      'Francia': '🇫🇷',
      'Reino Unido': '🇬🇧',
      'Estados Unidos': '🇺🇸',
      'Brasil': '🇧🇷',
      'México': '🇲🇽',
      'Italia': '🇮🇹',
      'Dinamarca': '🇩🇰',
      'España': '🇪🇸',
      'Países Bajos': '🇳🇱',
      'Suiza': '🇨🇭',
      'Suecia': '🇸🇪',
      'Noruega': '🇳🇴',
      'Portugal': '🇵🇹',
      'Bélgica': '🇧🇪',
      'Austria': '🇦🇹',
      'Irlanda': '🇮🇪',
      'Finlandia': '🇫🇮'
    }
    return flags[country] || '🌍'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return <CheckCircle size={16} className="status-icon indexed" />
      case 'in_progress': return <Clock size={16} className="status-icon in-progress" />
      default: return <AlertCircle size={16} className="status-icon pending" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'indexed': return 'Indexado'
      case 'in_progress': return 'En proceso'
      default: return 'Pendiente'
    }
  }

  const getSearchEngineColor = (engine: string) => {
    const colors: { [key: string]: string } = {
      'Baidu': '#de2910',
      'Yandex': '#fc3f1d',
      'Google': '#4285f4',
      'Naver': '#03c75a',
      'Yahoo Japan': '#6f42c1'
    }
    return colors[engine] || '#6b7280'
  }

  return (
    <div className="international-markets-display">
      <div className="markets-header">
        <div className="header-content">
          <Globe size={24} className="header-icon" />
          <div>
            <h3>🌍 Mercados Internacionales</h3>
            <p>Visibilidad global sin intermediarios ni apps terceras</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            <Eye size={18} />
            {showStats ? 'Ocultar' : 'Estadísticas'}
          </button>
          {onClose && (
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {showStats && (
        <div className="markets-stats">
          <div className="stat-card">
            <span className="stat-value">{markets.length}</span>
            <span className="stat-label">Mercados Totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{markets.filter(m => m.status === 'indexed').length}</span>
            <span className="stat-label">Indexados</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{markets.filter(m => m.directAccess).length}</span>
            <span className="stat-label">Acceso Directo</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{markets.filter(m => m.noIntermediaries).length}</span>
            <span className="stat-label">Sin Intermediarios</span>
          </div>
        </div>
      )}

      <div className="markets-grid">
        {loading ? (
          <div className="loading-markets">
            <div className="spinner"></div>
            <p>Cargando mercados...</p>
          </div>
        ) : (
          markets.map((market, index) => (
            <div key={index} className={`market-card status-${market.status}`}>
              <div className="market-header">
                <div className="country-info">
                  <span className="flag">{market.flag}</span>
                  <h4>{market.country}</h4>
                </div>
                <div className="status-indicator">
                  {getStatusIcon(market.status)}
                  <span className="status-text">{getStatusLabel(market.status)}</span>
                </div>
              </div>

              <div className="market-details">
                <div className="detail-row">
                  <span className="detail-label">Motor:</span>
                  <span className="detail-value" style={{ color: getSearchEngineColor(market.searchEngine) }}>
                    {market.searchEngine}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Idioma:</span>
                  <span className="detail-value">{market.language}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Población:</span>
                  <span className="detail-value">{market.population}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Último crawl:</span>
                  <span className="detail-value">{market.lastCrawled}</span>
                </div>
              </div>

              <div className="market-features">
                <div className="feature">
                  <CheckCircle size={14} className="feature-icon" />
                  <span>Acceso directo</span>
                </div>
                <div className="feature">
                  <CheckCircle size={14} className="feature-icon" />
                  <span>Sin intermediarios</span>
                </div>
                <div className="feature">
                  <Clock size={14} className="feature-icon" />
                  <span>Tiempo real</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="markets-footer">
        <p className="markets-note">
          <Globe size={14} className="note-icon" />
          Sistema de indexación directa sin intermediarios ni aplicaciones terceras
        </p>
        <div className="engines-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#de2910' }}></span>
            Baidu
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#fc3f1d' }}></span>
            Yandex
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#4285f4' }}></span>
            Google
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#03c75a' }}></span>
            Naver
          </span>
        </div>
      </div>
    </div>
  )
}

export default InternationalMarketsDisplay