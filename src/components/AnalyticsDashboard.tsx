import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Star, MessageSquare, Phone, Mail, Globe, ArrowUp, ArrowDown, Calendar, Download } from 'lucide-react'
import analyticsService from '../services/analyticsService'

interface AnalyticsDashboardProps {
  placeId: string
  placeName: string
  onClose: () => void
  language: 'es' | 'en'
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ placeId, placeName, onClose, language }) => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [showInsights, setShowInsights] = useState(true)

  useEffect(() => {
    analyticsService.initialize()
    const data = analyticsService.getAnalytics(placeId)
    setAnalytics(data)
    setLoading(false)
  }, [placeId])

  const texts = {
    es: {
      title: 'Panel de Analytics',
      overview: 'Resumen General',
      views: 'Vistas',
      orders: 'Pedidos',
      reviews: 'Reseñas',
      rating: 'Calificación',
      clicks: 'Clics de Contacto',
      trends: 'Tendencias',
      insights: 'Insights y Recomendaciones',
      performance: 'Rendimiento',
      conversion: 'Tasa de Conversión',
      benchmark: 'Comparación con Categoría',
      daily: 'Últimos 7 días',
      weekly: 'Últimas 4 semanas',
      monthly: 'Últimos 6 meses',
      whatsapp: 'WhatsApp',
      phone: 'Teléfono',
      email: 'Email',
      website: 'Sitio Web',
      topPerformers: 'Top Lugares',
      downloadReport: 'Descargar Reporte',
      close: 'Cerrar'
    },
    en: {
      title: 'Analytics Dashboard',
      overview: 'General Overview',
      views: 'Views',
      orders: 'Orders',
      reviews: 'Reviews',
      rating: 'Rating',
      clicks: 'Contact Clicks',
      trends: 'Trends',
      insights: 'Insights & Recommendations',
      performance: 'Performance',
      conversion: 'Conversion Rate',
      benchmark: 'Category Benchmark',
      daily: 'Last 7 days',
      weekly: 'Last 4 weeks',
      monthly: 'Last 6 months',
      whatsapp: 'WhatsApp',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      topPerformers: 'Top Places',
      downloadReport: 'Download Report',
      close: 'Close'
    }
  }

  const t = texts[language]

  if (loading) {
    return (
      <div className="analytics-overlay">
        <div className="analytics-modal">
          <div className="analytics-loading">Cargando analytics...</div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="analytics-overlay">
        <div className="analytics-modal">
          <div className="analytics-empty">No hay datos disponibles para este lugar</div>
          <button className="analytics-close" onClick={onClose}>{t.close}</button>
        </div>
      </div>
    )
  }

  const conversionRate = ((analytics.orders / analytics.views) * 100).toFixed(1)
  const totalClicks = Object.values(analytics.clicks).reduce((a: number, b: number) => a + b, 0)
  const clickRate = ((totalClicks / analytics.views) * 100).toFixed(1)
  const insights = analyticsService.getInsights(placeId)
  const topPerformers = analyticsService.getTopPerformers(5)

  const currentTrend = analytics.trends[selectedPeriod === 'daily' ? 'daily' : selectedPeriod === 'weekly' ? 'weekly' : 'monthly']
  const trendKey = selectedPeriod === 'daily' ? 'date' : selectedPeriod === 'weekly' ? 'week' : 'month'

  return (
    <div className="analytics-overlay">
      <div className="analytics-modal">
        <div className="analytics-header">
          <div>
            <h2>{t.title}</h2>
            <p>{placeName}</p>
          </div>
          <div className="analytics-actions">
            <button className="analytics-action-btn" onClick={() => console.log('Download report')}>
              <Download size={16} />
              {t.downloadReport}
            </button>
            <button className="analytics-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="analytics-tabs">
          <button
            className={`analytics-tab ${selectedPeriod === 'daily' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('daily')}
          >
            {t.daily}
          </button>
          <button
            className={`analytics-tab ${selectedPeriod === 'weekly' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('weekly')}
          >
            {t.weekly}
          </button>
          <button
            className={`analytics-tab ${selectedPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            {t.monthly}
          </button>
        </div>

        <div className="analytics-content">
          {/* Main Stats */}
          <div className="analytics-stats-grid">
            <div className="analytics-stat-card primary">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.views}</p>
                <h3 className="stat-value">{analytics.views.toLocaleString()}</h3>
                <p className="stat-change positive">
                  <ArrowUp size={12} /> +12.5%
                </p>
              </div>
            </div>

            <div className="analytics-stat-card success">
              <div className="stat-icon">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.orders}</p>
                <h3 className="stat-value">{analytics.orders}</h3>
                <p className="stat-change positive">
                  <ArrowUp size={12} /> +8.3%
                </p>
              </div>
            </div>

            <div className="analytics-stat-card warning">
              <div className="stat-icon">
                <Star size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.rating}</p>
                <h3 className="stat-value">{analytics.reviews.averageRating.toFixed(1)}</h3>
                <p className="stat-sub">({analytics.reviews.total} {t.reviews})</p>
              </div>
            </div>

            <div className="analytics-stat-card info">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.conversion}</p>
                <h3 className="stat-value">{conversionRate}%</h3>
                <p className="stat-sub">{clickRate}% clics</p>
              </div>
            </div>
          </div>

          {/* Contact Clicks */}
          <div className="analytics-section">
            <h3>{t.clicks}</h3>
            <div className="contact-clicks-grid">
              <div className="contact-click-item">
                <MessageSquare className="contact-icon whatsapp" size={20} />
                <div className="contact-info">
                  <p className="contact-label">{t.whatsapp}</p>
                  <h4 className="contact-value">{analytics.clicks.whatsapp}</h4>
                </div>
              </div>
              <div className="contact-click-item">
                <Phone className="contact-icon phone" size={20} />
                <div className="contact-info">
                  <p className="contact-label">{t.phone}</p>
                  <h4 className="contact-value">{analytics.clicks.phone}</h4>
                </div>
              </div>
              <div className="contact-click-item">
                <Mail className="contact-icon email" size={20} />
                <div className="contact-info">
                  <p className="contact-label">{t.email}</p>
                  <h4 className="contact-value">{analytics.clicks.email}</h4>
                </div>
              </div>
              <div className="contact-click-item">
                <Globe className="contact-icon website" size={20} />
                <div className="contact-info">
                  <p className="contact-label">{t.website}</p>
                  <h4 className="contact-value">{analytics.clicks.website}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Trends Chart */}
          <div className="analytics-section">
            <h3>{t.trends}</h3>
            <div className="trends-chart">
              {currentTrend.map((trend: any, index: number) => (
                <div key={index} className="trend-bar">
                  <div className="trend-label">{trend[trendKey]}</div>
                  <div className="trend-bars">
                    <div
                      className="trend-bar-views"
                      style={{ height: `${(trend.views / Math.max(...currentTrend.map((t: any) => t.views))) * 100}%` }}
                      title={`${trend.views} vistas`}
                    />
                    <div
                      className="trend-bar-orders"
                      style={{ height: `${(trend.orders / Math.max(...currentTrend.map((t: any) => t.orders))) * 100}%` }}
                      title={`${trend.orders} pedidos`}
                    />
                  </div>
                  <div className="trend-values">
                    <span className="trend-views">{trend.views}</span>
                    <span className="trend-orders">{trend.orders}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="trends-legend">
              <div className="legend-item">
                <div className="legend-color views" />
                <span>{t.views}</span>
              </div>
              <div className="legend-item">
                <div className="legend-color orders" />
                <span>{t.orders}</span>
              </div>
            </div>
          </div>

          {/* Benchmark */}
          <div className="analytics-section">
            <h3>{t.benchmark}</h3>
            <div className="benchmark-comparison">
              <div className="benchmark-bar">
                <div className="benchmark-label">Tu lugar</div>
                <div className="benchmark-track">
                  <div
                    className="benchmark-fill primary"
                    style={{ width: `${analytics.benchmarks.relativePosition}%` }}
                  />
                </div>
                <div className="benchmark-value">{analytics.benchmarks.relativePosition}%</div>
              </div>
              <div className="benchmark-bar">
                <div className="benchmark-label">Promedio categoría</div>
                <div className="benchmark-track">
                  <div
                    className="benchmark-fill secondary"
                    style={{ width: '50%' }}
                  />
                </div>
                <div className="benchmark-value">50%</div>
              </div>
              <div className="benchmark-bar">
                <div className="benchmark-label">Top performer</div>
                <div className="benchmark-track">
                  <div
                    className="benchmark-fill accent"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="benchmark-value">100%</div>
              </div>
            </div>
          </div>

          {/* Insights */}
          {showInsights && insights.length > 0 && (
            <div className="analytics-section insights-section">
              <div className="insights-header">
                <h3>{t.insights}</h3>
                <button
                  className="insights-toggle"
                  onClick={() => setShowInsights(!showInsights)}
                >
                  {showInsights ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <div className="insights-list">
                {insights.map((insight: string, index: number) => (
                  <div key={index} className="insight-item">
                    <div className="insight-bullet">💡</div>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Performers */}
          <div className="analytics-section">
            <h3>{t.topPerformers}</h3>
            <div className="top-performers-list">
              {topPerformers.map((performer: any, index: number) => (
                <div key={performer.placeId} className="performer-item">
                  <div className="performer-rank">{index + 1}</div>
                  <div className="performer-info">
                    <h4>{performer.placeName}</h4>
                    <p>{performer.views.toLocaleString()} {t.views}</p>
                  </div>
                  <div className="performer-rating">
                    <Star size={14} fill="currentColor" />
                    {performer.reviews.averageRating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard