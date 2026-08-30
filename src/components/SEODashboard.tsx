import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Target, 
  Globe, 
  Clock,
  Download,
  RefreshCw,
  Eye,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import seoMonitoringService from '../services/seoMonitoringService'

interface SEODashboardProps {
  onClose?: () => void
  language?: 'es' | 'en'
}

const SEODashboard: React.FC<SEODashboardProps> = ({ onClose, language = 'es' }) => {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  useEffect(() => {
    seoMonitoringService.initialize()
    loadReport()
  }, [timeRange])

  const loadReport = () => {
    setLoading(true)
    setTimeout(() => {
      const data = seoMonitoringService.generateWeeklyReport()
      setReport(data)
      setLoading(false)
    }, 1000)
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp size={16} className="trend-up" /> : 
           trend === 'down' ? <TrendingDown size={16} className="trend-down" /> : 
           <Activity size={16} className="trend-stable" />
  }

  const getSeverityColor = (severity: string) => {
    return severity === 'critical' ? '#dc2626' : 
           severity === 'high' ? '#ea580c' : 
           severity === 'medium' ? '#ca8a04' : '#65a30d'
  }

  const exportReport = () => {
    const csv = seoMonitoringService.exportToCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="seo-dashboard-loading">
        <RefreshCw className="spinner" size={32} />
        <p>{language === 'es' ? 'Cargando datos SEO...' : 'Loading SEO data...'}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="seo-dashboard-error">
        <AlertTriangle size={48} />
        <h2>{language === 'es' ? 'Error al cargar datos' : 'Error loading data'}</h2>
        <button onClick={loadReport}>{language === 'es' ? 'Reintentar' : 'Retry'}</button>
      </div>
    )
  }

  return (
    <div className="seo-dashboard">
      <div className="seo-header">
        <div className="header-content">
          <h2>{language === 'es' ? 'Dashboard SEO' : 'SEO Dashboard'}</h2>
          <p>{language === 'es' ? 'Monitoreo de posicionamiento y rendimiento' : 'Positioning and performance monitoring'}</p>
        </div>
        <div className="header-actions">
          <button className="action-button secondary" onClick={loadReport}>
            <RefreshCw size={16} />
            {language === 'es' ? 'Actualizar' : 'Refresh'}
          </button>
          <button className="action-button primary" onClick={exportReport}>
            <Download size={16} />
            {language === 'es' ? 'Exportar' : 'Export'}
          </button>
          {onClose && <button className="close-button" onClick={onClose}>✕</button>}
        </div>
      </div>

      {/* Score General */}
      <div className="score-section">
        <div className="score-card">
          <div className="score-content">
            <h3>{language === 'es' ? 'Puntuación SEO General' : 'Overall SEO Score'}</h3>
            <div className="score-value">{Math.round(report.overallScore)}</div>
            <div className="score-label">/ 100</div>
          </div>
          <div className="score-visual">
            <div 
              className="score-circle" 
              style={{ 
                background: `conic-gradient(var(--green) ${report.overallScore}%, #e1ddd0 ${report.overallScore}%)` 
              }}
            >
              <div className="score-inner">
                <BarChart3 size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Clave */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Target size={20} />
            <span>{language === 'es' ? 'Keywords Top 3' : 'Top 3 Keywords'}</span>
          </div>
          <div className="metric-value">
            {report.keywords.filter((k: any) => k.position <= 3).length}
          </div>
          <div className="metric-label">
            {language === 'es' ? 'de' : 'of'} {report.keywords.length} {language === 'es' ? 'total' : 'total'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <TrendingUp size={20} />
            <span>{language === 'es' ? 'Tendencia Positiva' : 'Positive Trend'}</span>
          </div>
          <div className="metric-value">
            {report.keywords.filter((k: any) => k.trend === 'up').length}
          </div>
          <div className="metric-label">
            {language === 'es' ? 'keywords mejorando' : 'keywords improving'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Globe size={20} />
            <span>{language === 'es' ? 'Backlinks Totales' : 'Total Backlinks'}</span>
          </div>
          <div className="metric-value">
            {report.backlinkMetrics.totalBacklinks}
          </div>
          <div className="metric-label">
            +{report.backlinkMetrics.newBacklinks} {language === 'es' ? 'nuevos' : 'new'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Eye size={20} />
            <span>{language === 'es' ? 'Vistas Contenido' : 'Content Views'}</span>
          </div>
          <div className="metric-value">
            {report.contentPerformance.reduce((sum: number, cp: any) => sum + cp.views, 0).toLocaleString()}
          </div>
          <div className="metric-label">
            {language === 'es' ? 'última semana' : 'last week'}
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="keywords-section">
        <div className="section-header">
          <h3>{language === 'es' ? 'Posicionamiento de Keywords' : 'Keyword Rankings'}</h3>
          <div className="time-selector">
            <button 
              className={timeRange === 'week' ? 'active' : ''}
              onClick={() => setTimeRange('week')}
            >
              {language === 'es' ? 'Semana' : 'Week'}
            </button>
            <button 
              className={timeRange === 'month' ? 'active' : ''}
              onClick={() => setTimeRange('month')}
            >
              {language === 'es' ? 'Mes' : 'Month'}
            </button>
          </div>
        </div>

        <div className="keywords-table">
          <div className="table-header">
            <div className="col-keyword">{language === 'es' ? 'Keyword' : 'Keyword'}</div>
            <div className="col-position">{language === 'es' ? 'Posición' : 'Position'}</div>
            <div className="col-volume">{language === 'es' ? 'Volumen' : 'Volume'}</div>
            <div className="col-trend">{language === 'es' ? 'Tendencia' : 'Trend'}</div>
            <div className="col-competition">{language === 'es' ? 'Competencia' : 'Competition'}</div>
          </div>

          {report.keywords.map((keyword: any, index: number) => (
            <div 
              key={index} 
              className={`table-row ${selectedKeyword === keyword.keyword ? 'selected' : ''}`}
              onClick={() => setSelectedKeyword(keyword.keyword)}
            >
              <div className="col-keyword">
                <span className="keyword-text">{keyword.keyword}</span>
                <span className="keyword-page">{keyword.targetLandingPage}</span>
              </div>
              <div className="col-position">
                <span className={`position-badge position-${keyword.position <= 3 ? 'top' : keyword.position <= 5 ? 'mid' : 'low'}`}>
                  #{keyword.position}
                </span>
              </div>
              <div className="col-volume">{keyword.searchVolume.toLocaleString()}</div>
              <div className="col-trend">
                {getTrendIcon(keyword.trend)}
              </div>
              <div className="col-competition">
                <span className={`competition-badge competition-${keyword.competition}`}>
                  {keyword.competition}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {report.alerts.length > 0 && (
        <div className="alerts-section">
          <div className="section-header">
            <h3>{language === 'es' ? 'Alertas y Recomendaciones' : 'Alerts and Recommendations'}</h3>
          </div>

          <div className="alerts-grid">
            {report.alerts.map((alert: any, index: number) => (
              <div 
                key={index} 
                className="alert-card"
                style={{ borderLeftColor: getSeverityColor(alert.severity) }}
              >
                <div className="alert-header">
                  <AlertTriangle size={18} style={{ color: getSeverityColor(alert.severity) }} />
                  <span className="alert-type">{alert.type}</span>
                  <span className="alert-severity" style={{ color: getSeverityColor(alert.severity) }}>
                    {alert.severity}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <p className="alert-recommendation">{alert.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance de Contenido */}
      <div className="content-section">
        <div className="section-header">
          <h3>{language === 'es' ? 'Performance de Contenido' : 'Content Performance'}</h3>
        </div>

        <div className="content-grid">
          {report.contentPerformance.map((content: any, index: number) => (
            <div key={index} className="content-card">
              <div className="content-header">
                <h4>{content.title}</h4>
                <span className="content-url">{content.url}</span>
              </div>
              
              <div className="content-metrics">
                <div className="content-metric">
                  <Eye size={16} />
                  <div>
                    <div className="metric-value">{content.views.toLocaleString()}</div>
                    <div className="metric-label">{language === 'es' ? 'Vistas' : 'Views'}</div>
                  </div>
                </div>
                
                <div className="content-metric">
                  <MousePointerClick size={16} />
                  <div>
                    <div className="metric-value">{content.conversions}</div>
                    <div className="metric-label">{language === 'es' ? 'Conversiones' : 'Conversions'}</div>
                  </div>
                </div>
                
                <div className="content-metric">
                  <Clock size={16} />
                  <div>
                    <div className="metric-value">{Math.round(content.avgTimeOnPage / 60)}m</div>
                    <div className="metric-label">{language === 'es' ? 'Tiempo promedio' : 'Avg time'}</div>
                  </div>
                </div>
              </div>

              <div className="content-bounce">
                <span className="bounce-label">{language === 'es' ? 'Tasa rebote:' : 'Bounce rate:'}</span>
                <span className={`bounce-value ${content.bounceRate > 0.5 ? 'high' : 'good'}`}>
                  {(content.bounceRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="recommendations-section">
        <div className="section-header">
          <h3>{language === 'es' ? 'Recomendaciones Automáticas' : 'Automatic Recommendations'}</h3>
        </div>

        <div className="recommendations-list">
          {report.recommendations.map((rec: string, index: number) => (
            <div key={index} className="recommendation-item">
              <CheckCircle size={18} className="recommendation-icon" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SEODashboard