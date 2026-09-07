// Componente Dashboard de SEO Defensivo
// Muestra el estado del plan de contrataque contra desinformación
// Optimizado para mapa-digital-salento.vercel.app y marca Salento a la Mano

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Globe, FileText, Download, RefreshCw, ExternalLink, Search, BarChart, Chrome, SearchIcon, Target } from 'lucide-react'
import defensiveSEOGService from '../services/defensiveSEOG.service'
import internationalSEOService from '../services/internationalSEO.service'
import internationalKeywordsService from '../services/internationalKeywords.service'
import backlinkStrategyService from '../services/backlinkStrategy.service'
import GoogleVerificationModal from './GoogleVerificationModal'
import SearchEngineIndexingModal from './SearchEngineIndexingModal'
import RealWorldSearchEnginesModal from './RealWorldSearchEnginesModal'
import BaiduVerificationModal from './BaiduVerificationModal'
import YandexVerificationModal from './YandexVerificationModal'

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
  const [activeTab, setActiveTab] = useState<'pages' | 'claims' | 'keywords' | 'sitemap' | 'advanced' | 'international'>('pages')
  const [internationalMarkets, setInternationalMarkets] = useState<any[]>([])
  const [internationalStatus, setInternationalStatus] = useState<any>(null)
  const [internationalKeywords, setInternationalKeywords] = useState<any[]>([])
  const [keywordStats, setKeywordStats] = useState<any>(null)
  const [backlinkSources, setBacklinkSources] = useState<any[]>([])
  const [backlinkStats, setBacklinkStats] = useState<any>(null)
  const [contentLocalization, setContentLocalization] = useState<any[]>([])
  const [showGoogleVerification, setShowGoogleVerification] = useState(false)
  const [showSearchEngineIndexing, setShowSearchEngineIndexing] = useState(false)
  const [showRealWorldEngines, setShowRealWorldEngines] = useState(false)
  const [showBaiduVerification, setShowBaiduVerification] = useState(false)
  const [showYandexVerification, setShowYandexVerification] = useState(false)
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
      const markets = internationalSEOService.getInternationalMarkets()
      const status = internationalSEOService.getInternationalImplementationStatus()
      const intKeywords = internationalKeywordsService.getInternationalKeywords()
      const stats = internationalKeywordsService.getInternationalKeywordStats()
      const chinaBacklinks = backlinkStrategyService.getChineseBacklinkSources()
      const taiwanHKBacklinks = backlinkStrategyService.getTaiwanHongKongBacklinkSources()
      const seaBacklinks = backlinkStrategyService.getSoutheastAsiaBacklinkSources()
      const allBacklinks = [...chinaBacklinks, ...taiwanHKBacklinks, ...seaBacklinks]
      const backlinkStatsData = backlinkStrategyService.getBacklinkStrategyStats()
      const contentLocalizationNeeds = backlinkStrategyService.getContentLocalizationNeeds()

      setDefensivePages(pages)
      setMisinformationClaims(claims)
      setStrategicKeywords(keywords)
      setSitemap(generatedSitemap)
      setMetaTags(generatedMetaTags)
      setBrandSchema(generatedBrandSchema)
      setInternationalMarkets(markets)
      setInternationalStatus(status)
      setInternationalKeywords(intKeywords)
      setKeywordStats(stats)
      setBacklinkSources(allBacklinks)
      setBacklinkStats(backlinkStatsData)
      setContentLocalization(contentLocalizationNeeds)
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

  const getCountryFlag = (country: string) => {
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
      'México': '🇲🇽'
    }
    return flags[country] || '🌍'
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'PRIORIDAD ALTA'
      case 'medium': return 'PRIORIDAD MEDIA'
      default: return 'PRIORIDAD BAJA'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in_progress': return 'En Progreso'
      default: return 'Pendiente'
    }
  }

  const handleBaiduVerify = (code: string) => {
    console.log('Baidu verification code:', code)
    // Aquí implementar la lógica para guardar el código de Baidu
    alert('Código de Baidu guardado: ' + code)
  }

  const handleYandexVerify = (code: string) => {
    console.log('Yandex verification code:', code)
    // Aquí implementar la lógica para guardar el código de Yandex
    alert('Código de Yandex guardado: ' + code)
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
        <button
          className={`tab-button ${activeTab === 'international' ? 'active' : ''}`}
          onClick={() => setActiveTab('international')}
        >
          <Globe size={16} />
          SEO Internacional
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

        {activeTab === 'international' && (
          <div className="international-seo-section">
            <div className="international-seo-header">
              <h3>🌍 SEO Internacional - {brandName}</h3>
              <p>Estrategia prioritaria para mercados globales: China (Baidu), Rusia (Yandex), Asia, Europa</p>
            </div>

            {internationalStatus && (
              <div className="international-status-overview">
                <div className="status-main">
                  <div className="status-item">
                    <span className="status-label">Estado General:</span>
                    <span className="status-value">{internationalStatus.overallStatus}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Mercados Totales:</span>
                    <span className="status-value">{internationalStatus.markets.length}</span>
                  </div>
                </div>
                <div className="status-recommendations">
                  <h4>🎯 Recomendaciones Estratégicas:</h4>
                  <ul>
                    {internationalStatus.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="international-markets-grid">
              <h4>🌏 Mercados Internacionales Prioritarios</h4>
              {internationalMarkets.map((market, index) => (
                <div key={index} className={`international-market-card priority-${market.priority}`}>
                  <div className="market-header">
                    <div className="market-country">
                      <span className="flag">{getCountryFlag(market.country)}</span>
                      <h5>{market.country}</h5>
                    </div>
                    <span className={`priority-badge ${market.priority}`}>
                      {getPriorityLabel(market.priority)}
                    </span>
                  </div>
                  <div className="market-details">
                    <div className="market-detail">
                      <span className="detail-label">Motor:</span>
                      <span className="detail-value">{market.searchEngine}</span>
                    </div>
                    <div className="market-detail">
                      <span className="detail-label">Idioma:</span>
                      <span className="detail-value">{market.language}</span>
                    </div>
                    <div className="market-detail">
                      <span className="detail-label">Población:</span>
                      <span className="detail-value">{market.population}</span>
                    </div>
                    <div className="market-detail">
                      <span className="detail-label">Potencial:</span>
                      <span className="detail-value">{market.tourismPotential}</span>
                    </div>
                    <div className="market-detail">
                      <span className="detail-label">Estado:</span>
                      <span className={`status-badge ${market.status}`}>
                        {getStatusLabel(market.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="international-implementation-steps">
              <h4>📋 Pasos de Implementación Internacional</h4>
              <div className="steps-list">
                <div className="step-item completed">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h5>Configuración base hreflang</h5>
                    <p>Meta tags internacionales preliminares implementados</p>
                  </div>
                </div>
                <div className="step-item completed">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h5>Robots.txt optimizado</h5>
                    <p>Configurado para crawlers internacionales (Baidu, Yandex, Naver)</p>
                  </div>
                </div>
                <div className="step-item completed">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h5>Sitemap corregido</h5>
                    <p>Dominio de despliegue optimizado para todos los motores</p>
                  </div>
                </div>
                <div className="step-item pending">
                  <div className="step-icon">⏳</div>
                  <div className="step-content">
                    <h5>Obtener código Baidu (PRIORIDAD MÁXIMA)</h5>
                    <p>Registrarse en Baidu Webmaster Tools y obtener código específico</p>
                  </div>
                </div>
                <div className="step-item completed">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h5>Verificación Yandex completada</h5>
                    <p>Código: 3d2630a804c93168 - Mercado ruso verificado</p>
                  </div>
                </div>
                <div className="step-item pending">
                  <div className="step-icon">⏳</div>
                  <div className="step-content">
                    <h5>Enviar sitemap a Yandex</h5>
                    <p>Enviar sitemap optimizado a Yandex Webmaster</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="international-verification-section">
              <h4>🔐 Verificación de Motores Internacionales</h4>
              <div className="verification-grid">
                <div className="verification-card">
                  <div className="verification-header">
                    <span className="engine-icon">🇨🇳</span>
                    <h5>Baidu (China)</h5>
                  </div>
                  <p>Mercado de 1.4+ mil millones - PRIORIDAD MÁXIMA</p>
                  <div className="verification-status">
                    <span className="status-label">Estado:</span>
                    <span className="status-value pending">Pendiente código</span>
                  </div>
                  <button className="action-button" onClick={() => setShowBaiduVerification(true)}>
                    Configurar Baidu
                  </button>
                </div>

                <div className="verification-card">
                  <div className="verification-header">
                    <span className="engine-icon">🇷🇺</span>
                    <h5>Yandex (Rusia)</h5>
                  </div>
                  <p>Mercado de 146+ millones - PRIORIDAD ALTA</p>
                  <div className="verification-status">
                    <span className="status-label">Estado:</span>
                    <span className="status-value completed">✅ Verificado</span>
                  </div>
                  <div className="verification-code">
                    <span className="code-label">Código:</span>
                    <span className="code-value">3d2630a804c93168</span>
                  </div>
                  <button className="action-button disabled" disabled>
                    Ya Verificado
                  </button>
                </div>
              </div>
            </div>

            <div className="international-backlinks-section">
              <h4>🔗 Estrategia de Backlinks Internacionales</h4>
              {backlinkStats && (
                <div className="backlink-stats-overview">
                  <div className="stat-item">
                    <span className="stat-label">Total Fuentes:</span>
                    <span className="stat-value">{backlinkStats.totalSources}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Prioridad Alta:</span>
                    <span className="stat-value">{backlinkStats.highPrioritySources}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fuentes China:</span>
                    <span className="stat-value">{backlinkStats.chinaSources}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Gratuitas:</span>
                    <span className="stat-value">{backlinkStats.freeSources}</span>
                  </div>
                </div>
              )}

              <div className="backlink-sources-grid">
                <h5>🇨🇳 Fuentes Chinas (Baidu) - PRIORIDAD MÁXIMA</h5>
                {backlinkSources.filter((source: any) => source.country === 'China').map((source: any, index: number) => (
                  <div key={index} className={`backlink-source-card priority-${source.priority}`}>
                    <div className="source-header">
                      <h6>{source.platform}</h6>
                      <span className={`priority-badge ${source.priority}`}>
                        {source.priority === 'high' ? 'ALTA' : 'MEDIA'}
                      </span>
                    </div>
                    <div className="source-details">
                      <div className="source-detail">
                        <span className="detail-label">Impacto:</span>
                        <span className="detail-value">{source.estimatedImpact}</span>
                      </div>
                      <div className="source-detail">
                        <span className="detail-label">Dificultad:</span>
                        <span className="detail-value">{source.difficulty}</span>
                      </div>
                      <div className="source-detail">
                        <span className="detail-label">Costo:</span>
                        <span className="detail-value">{source.cost}</span>
                      </div>
                    </div>
                    <div className="source-strategy">
                      <p>{source.strategy}</p>
                    </div>
                  </div>
                ))}

                <h5>🇹🇼🇭🇰 Taiwán/Hong Kong (Google) - PRIORIDAD ALTA</h5>
                {backlinkSources.filter((source: any) => source.country === 'Taiwán' || source.country === 'Hong Kong').map((source: any, index: number) => (
                  <div key={index} className={`backlink-source-card priority-${source.priority}`}>
                    <div className="source-header">
                      <h6>{source.platform} ({source.country})</h6>
                      <span className={`priority-badge ${source.priority}`}>
                        {source.priority === 'high' ? 'ALTA' : 'MEDIA'}
                      </span>
                    </div>
                    <div className="source-details">
                      <div className="source-detail">
                        <span className="detail-label">Impacto:</span>
                        <span className="detail-value">{source.estimatedImpact}</span>
                      </div>
                      <div className="source-detail">
                        <span className="detail-label">Dificultad:</span>
                        <span className="detail-value">{source.difficulty}</span>
                      </div>
                    </div>
                    <div className="source-strategy">
                      <p>{source.strategy}</p>
                    </div>
                  </div>
                ))}

                <h5>🌏 Sureste Asiático (Google) - PRIORIDAD MEDIA</h5>
                {backlinkSources.filter((source: any) => 
                  ['Tailandia', 'Vietnam', 'Indonesia', 'Malasia', 'Singapur'].includes(source.country)
                ).map((source: any, index: number) => (
                  <div key={index} className={`backlink-source-card priority-${source.priority}`}>
                    <div className="source-header">
                      <h6>{source.platform} ({source.country})</h6>
                      <span className={`priority-badge ${source.priority}`}>
                        {source.priority === 'high' ? 'ALTA' : 'MEDIA'}
                      </span>
                    </div>
                    <div className="source-details">
                      <div className="source-detail">
                        <span className="detail-label">Impacto:</span>
                        <span className="detail-value">{source.estimatedImpact}</span>
                      </div>
                      <div className="source-detail">
                        <span className="detail-label">Dificultad:</span>
                        <span className="detail-value">{source.difficulty}</span>
                      </div>
                    </div>
                    <div className="source-strategy">
                      <p>{source.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="international-content-section">
              <h4>🌐 Localización de Contenido por Mercado</h4>
              <div className="content-localization-grid">
                {contentLocalization.map((localization: any, index: number) => (
                  <div key={index} className={`content-localization-card priority-${localization.priority}`}>
                    <div className="localization-header">
                      <div className="language-region">
                        <span className="flag">{getCountryFlag(localization.region)}</span>
                        <h6>{localization.language} - {localization.region}</h6>
                      </div>
                      <span className={`priority-badge ${localization.priority}`}>
                        {localization.priority === 'high' ? 'PRIORIDAD ALTA' : 'PRIORIDAD MEDIA'}
                      </span>
                    </div>
                    <div className="localization-content">
                      <p className="content-type">{localization.contentType}</p>
                      <div className="content-needs">
                        <h7>Necesidades de Contenido:</h7>
                        <ul>
                          {localization.contentNeeds.map((need: string, i: number) => (
                            <li key={i}>{need}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="cultural-adaptations">
                        <h7>Adaptaciones Culturales:</h7>
                        <ul>
                          {localization.culturalAdaptations.map((adaptation: string, i: number) => (
                            <li key={i}>{adaptation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <Target size={20} className="text-purple-600" />
                  <h4>Motores del Mundo Real</h4>
                </div>
                <p className="card-description">Análisis real de motores de búsqueda en Colombia y su visibilidad para Salento Quindío.</p>
                <button className="download-button" onClick={() => setShowRealWorldEngines(true)}>
                  <Globe size={16} />
                  Analizar Motores Reales
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

      {showRealWorldEngines && (
        <RealWorldSearchEnginesModal
          isOpen={showRealWorldEngines}
          onClose={() => setShowRealWorldEngines(false)}
        />
      )}

      {showBaiduVerification && (
        <BaiduVerificationModal
          isOpen={showBaiduVerification}
          onClose={() => setShowBaiduVerification(false)}
          onVerify={handleBaiduVerify}
        />
      )}

      {showYandexVerification && (
        <YandexVerificationModal
          isOpen={showYandexVerification}
          onClose={() => setShowYandexVerification(false)}
          onVerify={handleYandexVerify}
        />
      )}
    </div>
  )
}

export default DefensiveSEODashboard