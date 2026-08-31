// Componente Dashboard de SEO Defensivo
// Muestra el estado del plan de contrataque contra desinformación

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Globe, FileText, Download, RefreshCw } from 'lucide-react'
import defensiveSEOGService from '../services/defensiveSEOG.service'

interface DefensiveSEODashboardProps {
  onClose?: () => void
}

const DefensiveSEODashboard: React.FC<DefensiveSEODashboardProps> = ({ onClose }) => {
  const [defensivePages, setDefensivePages] = useState<any[]>([])
  const [misinformationClaims, setMisinformationClaims] = useState<any[]>([])
  const [strategicKeywords, setStrategicKeywords] = useState<string[]>([])
  const [sitemap, setSitemap] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pages' | 'claims' | 'keywords' | 'sitemap'>('pages')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    
    try {
      const pages = defensiveSEOGService.getDefensivePages()
      const claims = defensiveSEOGService.getMisinformationClaims()
      const keywords = defensiveSEOGService.getStrategicKeywords()
      const generatedSitemap = defensiveSEOGService.generateDefensiveSitemap()
      
      setDefensivePages(pages)
      setMisinformationClaims(claims)
      setStrategicKeywords(keywords)
      setSitemap(generatedSitemap)
    } catch (error) {
      console.error('Error loading defensive SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSitemap = () => {
    const blob = new Blob([sitemap], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'defensive-seo-sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'ALTA'
      case 'medium': return 'MEDIA'
      case 'low': return 'BAJA'
      default: return 'NORMAL'
    }
  }

  if (loading) {
    return (
      <div className="defensive-seo-loading">
        <div className="loading-spinner">
          <RefreshCw className="animate-spin" size={24} />
        </div>
        <p>Cargando plan de contrataque SEO...</p>
      </div>
    )
  }

  return (
    <div className="defensive-seo-dashboard">
      <div className="defensive-seo-header">
        <div className="defensive-seo-title">
          <Shield className="text-red-600" size={24} />
          <div>
            <h2>🛡️ Plan de Contrataque SEO</h2>
            <p>Estrategia defensiva contra desinformación</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className="defensive-seo-stats">
        <div className="stat-card">
          <FileText className="text-blue-600" size={20} />
          <div>
            <strong>{defensivePages.length}</strong>
            <span>Páginas Defensivas</span>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle className="text-red-600" size={20} />
          <div>
            <strong>{misinformationClaims.length}</strong>
            <span>Claims Desmentidos</span>
          </div>
        </div>
        <div className="stat-card">
          <Globe className="text-green-600" size={20} />
          <div>
            <strong>{strategicKeywords.length}</strong>
            <span>Keywords Estratégicas</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="text-purple-600" size={20} />
          <div>
            <strong>100%</strong>
            <span>Fuentes Verificadas</span>
          </div>
        </div>
      </div>

      <div className="defensive-seo-tabs">
        <button 
          className={`tab-button ${activeTab === 'pages' ? 'active' : ''}`}
          onClick={() => setActiveTab('pages')}
        >
          <FileText size={16} />
          Páginas Defensivas
        </button>
        <button 
          className={`tab-button ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          <AlertTriangle size={16} />
          Claims Desmentidos
        </button>
        <button 
          className={`tab-button ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          <Globe size={16} />
          Keywords
        </button>
        <button 
          className={`tab-button ${activeTab === 'sitemap' ? 'active' : ''}`}
          onClick={() => setActiveTab('sitemap')}
        >
          <Download size={16} />
          Sitemap
        </button>
      </div>

      <div className="defensive-seo-content">
        {activeTab === 'pages' && (
          <div className="defensive-pages-list">
            {defensivePages.map((page, index) => (
              <div key={index} className="defensive-page-card">
                <div className="page-header">
                  <div className="page-title">
                    <h3>{page.title}</h3>
                    <span className={`urgency-badge ${getUrgencyColor(page.urgency)}`}>
                      {getUrgencyLabel(page.urgency)}
                    </span>
                  </div>
                  <div className="page-meta">
                    <span className="schema-type">{page.schemaType}</span>
                    <span className="verified-badge">
                      <CheckCircle size={12} /> Verificado
                    </span>
                  </div>
                </div>
                <p className="page-description">{page.description}</p>
                <div className="page-keywords">
                  {page.keywords.slice(0, 3).map((keyword: string, i: number) => (
                    <span key={i} className="keyword-tag">{keyword}</span>
                  ))}
                  {page.keywords.length > 3 && (
                    <span className="keyword-more">+{page.keywords.length - 3} más</span>
                  )}
                </div>
                <div className="page-footer">
                  <span className="page-slug">/{page.slug}</span>
                  <span className="page-updated">
                    Actualizado: {new Date(page.lastUpdated).toLocaleDateString('es-CO')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="misinformation-claims-list">
            {misinformationClaims.map((claim, index) => (
              <div key={index} className="claim-card">
                <div className="claim-header">
                  <AlertTriangle className="text-red-600" size={20} />
                  <div>
                    <h3>RUMOR: {claim.claim}</h3>
                    <p className="claim-truth">
                      <CheckCircle className="text-green-600" size={16} />
                      <strong>VERDAD:</strong> {claim.truth}
                    </p>
                  </div>
                </div>
                <div className="claim-evidence">
                  <h4>Evidencia:</h4>
                  <ul>
                    {claim.evidence.map((evidence: string, i: number) => (
                      <li key={i}>{evidence}</li>
                    ))}
                  </ul>
                </div>
                <div className="claim-sources">
                  <h4>Fuentes Oficiales:</h4>
                  <div className="sources-list">
                    {claim.officialSources.map((source: string, i: number) => (
                      <span key={i} className="source-badge">{source}</span>
                    ))}
                  </div>
                </div>
                <div className="claim-footer">
                  <span className="fact-checked">
                    Verificado: {new Date(claim.lastFactChecked).toLocaleDateString('es-CO')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="strategic-keywords-list">
            <div className="keywords-grid">
              {strategicKeywords.map((keyword, index) => (
                <div key={index} className="keyword-card">
                  <Globe size={16} className="text-blue-600" />
                  <span>{keyword}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sitemap' && (
          <div className="sitemap-section">
            <div className="sitemap-header">
              <h3>Sitemap Defensivo</h3>
              <button className="download-button" onClick={handleDownloadSitemap}>
                <Download size={16} />
                Descargar XML
              </button>
            </div>
            <pre className="sitemap-content">{sitemap}</pre>
          </div>
        )}
      </div>

      <div className="defensive-seo-footer">
        <p>
          <Shield size={14} className="text-green-600" />
          Este plan neutraliza desinformación mediante autoridad técnica y datos oficiales verificables.
        </p>
      </div>
    </div>
  )
}

export default DefensiveSEODashboard