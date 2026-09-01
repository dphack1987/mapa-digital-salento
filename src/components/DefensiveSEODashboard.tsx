// Componente Dashboard de SEO Defensivo
// Muestra el estado del plan de contrataque contra desinformación
// Optimizado para mapa-digital-salento.vercel.app y marca Salento a la Mano

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Globe, FileText, Download, RefreshCw, ExternalLink, Search, BarChart, Chrome, SearchIcon } from 'lucide-react'
import defensiveSEOGService from '../services/defensiveSEOG.service'
import internationalSEOService from '../services/internationalSEO.service'
import GoogleVerificationModal from './GoogleVerificationModal'
import SearchEngineIndexingModal from './SearchEngineIndexingModal'

interface DefensiveSEODashboardProps {
  onClose?: () => void
}

const DefensiveSEODashboard: React.FC<DefensiveSEODashboardProps> = ({ onClose }) => {
  const [defensivePages, setDefensivePages] = useState<any[]>([])
  const [misinformationClaims, setMisinformationClaims] = useState<any[]>([])
  const [strategicKeywords, setStrategicKeywords] = useState<string[]>([])
  const [sitemap, setSitemap] = useState<string>('')
  const [metaTags, setMetaTags] = useState<string>('')
  const [brandSchema, setBrandSchema] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pages' | 'claims' | 'keywords' | 'sitemap' | 'advanced'>('pages')
  const [showGoogleVerification, setShowGoogleVerification] = useState(false)
  const [showSearchEngineIndexing, setShowSearchEngineIndexing] = useState(false)
  const targetDomain = 'https://mapa-digital-salento.vercel.app'
  const brandName = 'Salento a la Mano'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)

    try {
      defensiveSEOGService.initialize()
      internationalSEOService.initialize()

      const pages = defensiveSEOGService.getDefensivePages()
      const claims = defensiveSEOGService.getMisinformationClaims()
      const keywords = defensiveSEOGService.getStrategicKeywords()
      const generatedSitemap = defensiveSEOGService.generateDefensiveSitemap()
      const generatedMetaTags = internationalSEOService.generateMetaTags()
      const generatedBrandSchema = internationalSEOService.generateBrandSchema()

      setDefensivePages(pages)
      setMisinformationClaims(claims)
      setStrategicKeywords(keywords)
      setSitemap(generatedSitemap)
      setMetaTags(generatedMetaTags)
      setBrandSchema(generatedBrandSchema)
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
    a.download = 'salentoalamano-defensive-sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadMetaTags = () => {
    const blob = new Blob([metaTags], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salentoalamano-meta-tags.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadSchema = () => {
    const blob = new Blob([brandSchema], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salentoalamano-schema.json'
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
            <h2>🛡️ Plan de Contrataque SEO - {brandName}</h2>
            <p>Estrategia defensiva para {targetDomain}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="google-verification-button" onClick={() => setShowGoogleVerification(true)}>
            <Chrome size={18} />
            Verificar en Google
          </button>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
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
        <button
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          <BarChart size={16} />
          SEO Avanzado
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
              <h3>Sitemap Defensivo - {brandName}</h3>
              <button className="download-button" onClick={handleDownloadSitemap}>
                <Download size={16} />
                Descargar XML
              </button>
            </div>
            <pre className="sitemap-content">{sitemap}</pre>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="advanced-seo-section">
            <div className="advanced-seo-header">
              <h3>🚀 SEO Avanzado - {brandName}</h3>
              <p>Meta tags, Schema.org y optimización para {targetDomain}</p>
            </div>

            <div className="advanced-seo-grid">
              <div className="advanced-seo-card">
                <div className="card-header">
                  <Search size={20} className="text-blue-600" />
                  <h4>Meta Tags SEO</h4>
                </div>
                <p className="card-description">Meta tags optimizados para posicionamiento en motores de búsqueda y redes sociales.</p>
                <button className="download-button" onClick={handleDownloadMetaTags}>
                  <Download size={16} />
                  Descargar Meta Tags
                </button>
                <pre className="code-preview">{metaTags.substring(0, 200)}...</pre>
              </div>

              <div className="advanced-seo-card">
                <div className="card-header">
                  <ExternalLink size={20} className="text-green-600" />
                  <h4>Schema.org JSON-LD</h4>
                </div>
                <p className="card-description">Datos estructurados para Google Rich Snippets y Knowledge Graph.</p>
                <button className="download-button" onClick={handleDownloadSchema}>
                  <Download size={16} />
                  Descargar Schema
                </button>
                <pre className="code-preview">{brandSchema.substring(0, 200)}...</pre>
              </div>

              <div className="advanced-seo-card">
                <div className="card-header">
                  <Globe size={20} className="text-purple-600" />
                  <h4>SEO Internacional</h4>
                </div>
                <p className="card-description">Hreflang tags y contenido multi-idioma para mercados globales.</p>
                <div className="seo-stats">
                  <div className="stat-item">
                    <span className="stat-label">Idiomas:</span>
                    <span className="stat-value">5 (ES, EN, DE, FR, IT)</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Dominio:</span>
                    <span className="stat-value">{targetDomain}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Marca:</span>
                    <span className="stat-value">{brandName}</span>
                  </div>
                </div>
              </div>

              <div className="advanced-seo-card">
                <div className="card-header">
                  <SearchIcon size={20} className="text-green-600" />
                  <h4>Indexación Múltiple</h4>
                </div>
                <p className="card-description">Configurar indexación en Google, Bing, DuckDuckGo, Yahoo, Baidu y Yandex.</p>
                <button className="download-button" onClick={() => setShowSearchEngineIndexing(true)}>
                  <Globe size={16} />
                  Configurar Motores de Búsqueda
                </button>
              </div>

              <div className="advanced-seo-card">
                <div className="card-header">
                  <BarChart size={20} className="text-orange-600" />
                  <h4>Keywords Estratégicas</h4>
                </div>
                <p className="card-description">Palabras clave optimizadas para dominar búsquedas relacionadas con Salento.</p>
                <div className="keywords-preview">
                  {strategicKeywords.slice(0, 5).map((keyword, index) => (
                    <span key={index} className="keyword-badge">{keyword}</span>
                  ))}
                  {strategicKeywords.length > 5 && (
                    <span className="keyword-more">+{strategicKeywords.length - 5} más</span>
                  )}
                </div>
              </div>
            </div>

            <div className="implementation-guide">
              <h4>📋 Guía de Implementación</h4>
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <strong>Implementar Meta Tags</strong>
                    <p>Copia los meta tags en el <code>&lt;head&gt;</code> de tu index.html</p>
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <strong>Agregar Schema.org</strong>
                    <p>Inserta el JSON-LD antes de cerrar el <code>&lt;body&gt;</code></p>
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <strong>Submit Sitemap</strong>
                    <p>Envía el sitemap a Google Search Console y Bing Webmaster Tools</p>
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-number">4</span>
                  <div className="step-content">
                    <strong>Verificar Indexación</strong>
                    <p>Usa la herramienta "URL Inspection" en Google Search Console</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="defensive-seo-footer">
        <p>
          <Shield size={14} className="text-green-600" />
          Este plan neutraliza desinformación mediante autoridad técnica y datos oficiales verificables.
        </p>
      </div>

      {showGoogleVerification && (
        <GoogleVerificationModal
          isOpen={showGoogleVerification}
          onClose={() => setShowGoogleVerification(false)}
        />
      )}

      {showSearchEngineIndexing && (
        <SearchEngineIndexingModal
          isOpen={showSearchEngineIndexing}
          onClose={() => setShowSearchEngineIndexing(false)}
        />
      )}
    </div>
  )
}

export default DefensiveSEODashboard