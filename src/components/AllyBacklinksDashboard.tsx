// Componente Dashboard de Backlinks para Aliados
// Permite a los negocios locales generar e implementar backlinks hacia la plataforma oficial

import { useState, useEffect } from 'react'
import { Link, Copy, Download, Share2, Users, TrendingUp, Shield, Code, CheckCircle, AlertCircle } from 'lucide-react'
import localBacklinksService from '../services/localBacklinks.service'

interface AllyBacklinksDashboardProps {
  onClose?: () => void
  allyId?: string
}

const AllyBacklinksDashboard: React.FC<AllyBacklinksDashboardProps> = ({ onClose, allyId = 'hotel-1' }) => {
  const [backlinkOptions, setBacklinkOptions] = useState<any[]>([])
  const [allyDashboard, setAllyDashboard] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [customCode, setCustomCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'options' | 'stats' | 'social' | 'impact'>('options')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [allyId])

  const loadData = () => {
    setLoading(true)
    
    try {
      const options = localBacklinksService.getBacklinkOptions()
      const dashboard = localBacklinksService.generateAllyDashboard(allyId)
      
      setBacklinkOptions(options)
      setAllyDashboard(dashboard)
      
      // Seleccionar primera opción por defecto
      if (options.length > 0) {
        handleSelectOption(options[0])
      }
    } catch (error) {
      console.error('Error loading backlinks data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (option: any) => {
    setSelectedOption(option)
    const code = localBacklinksService.getCustomBacklinkCode(allyId, option.type)
    setCustomCode(code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    const blob = new Blob([customCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backlink-${selectedOption?.type || 'code'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSocialIntegration = () => {
    return localBacklinksService.generateSocialMediaIntegration(allyId)
  }

  const getSEOImpactReport = () => {
    return localBacklinksService.generateSEOImpactReport()
  }

  if (loading) {
    return (
      <div className="ally-backlinks-loading">
        <div className="loading-spinner">Cargando sistema de backlinks...</div>
      </div>
    )
  }

  const socialIntegration = getSocialIntegration()
  const seoImpact = getSEOImpactReport()

  return (
    <div className="ally-backlinks-dashboard">
      <div className="ally-backlinks-header">
        <div className="ally-backlinks-title">
          <Link className="text-blue-600" size={24} />
          <div>
            <h2>🔗 Sistema de Backlinks para Aliados</h2>
            <p>Genera enlaces oficiales hacia la plataforma de turismo de Salento</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className="ally-info-section">
        <div className="ally-card">
          <div className="ally-header">
            <div className="ally-name">
              <h3>{allyDashboard?.ally?.name}</h3>
              <span className={`ally-type ${allyDashboard?.ally?.type}`}>
                {allyDashboard?.ally?.type?.toUpperCase()}
              </span>
            </div>
            <div className="ally-status">
              {allyDashboard?.ally?.verified ? (
                <span className="verified-badge">
                  <CheckCircle size={16} /> Verificado
                </span>
              ) : (
                <span className="pending-badge">
                  <AlertCircle size={16} /> Pendiente
                </span>
              )}
            </div>
          </div>
          <div className="ally-stats">
            <div className="stat-item">
              <Users size={16} />
              <div>
                <strong>{allyDashboard?.stats?.clicks || 0}</strong>
                <span>Clics</span>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp size={16} />
              <div>
                <strong>{allyDashboard?.stats?.conversionRate?.toFixed(1) || 0}%</strong>
                <span>Conversión</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ally-backlinks-tabs">
        <button 
          className={`tab-button ${activeTab === 'options' ? 'active' : ''}`}
          onClick={() => setActiveTab('options')}
        >
          <Code size={16} />
          Opciones de Backlinks
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <TrendingUp size={16} />
          Estadísticas
        </button>
        <button 
          className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <Share2 size={16} />
          Redes Sociales
        </button>
        <button 
          className={`tab-button ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          <Shield size={16} />
          Impacto SEO
        </button>
      </div>

      <div className="ally-backlinks-content">
        {activeTab === 'options' && (
          <div className="backlinks-options-section">
            <div className="options-grid">
              {backlinkOptions.map((option, index) => (
                <div 
                  key={index} 
                  className={`option-card ${selectedOption?.type === option.type ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(option)}
                >
                  <div className="option-header">
                    <span className="option-type">{option.type}</span>
                    <span className="option-size">{option.size}</span>
                  </div>
                  <h4>{option.name}</h4>
                  <p>{option.description}</p>
                  <div className="option-preview">
                    <span>Vista previa:</span>
                    <code>{option.preview}</code>
                  </div>
                </div>
              ))}
            </div>

            {selectedOption && (
              <div className="code-section">
                <div className="code-header">
                  <h3>Código Personalizado para {selectedOption.name}</h3>
                  <div className="code-actions">
                    <button 
                      className="code-action-button"
                      onClick={handleCopyCode}
                      disabled={copied}
                    >
                      <Copy size={16} />
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                    <button 
                      className="code-action-button"
                      onClick={handleDownloadCode}
                    >
                      <Download size={16} />
                      Descargar
                    </button>
                  </div>
                </div>
                <pre className="code-content">{customCode}</pre>
                <div className="code-instructions">
                  <h4>📋 Instrucciones de instalación:</h4>
                  <ol>
                    <li>Copia el código de arriba</li>
                    <li>Pégalo en tu sitio web donde quieras que aparezca el backlink</li>
                    <li>El código incluye tracking automático de clics e impresiones</li>
                    <li>El backlink se actualizará automáticamente con información oficial</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card-large">
                <Users className="text-blue-600" size={24} />
                <div>
                  <strong>{allyDashboard?.stats?.clicks || 0}</strong>
                  <span>Total de Clics</span>
                </div>
              </div>
              <div className="stat-card-large">
                <TrendingUp className="text-green-600" size={24} />
                <div>
                  <strong>{allyDashboard?.stats?.impressions || 0}</strong>
                  <span>Impresiones</span>
                </div>
              </div>
              <div className="stat-card-large">
                <Shield className="text-purple-600" size={24} />
                <div>
                  <strong>{allyDashboard?.stats?.conversionRate?.toFixed(2) || 0}%</strong>
                  <span>Tasa de Conversión</span>
                </div>
              </div>
            </div>

            {allyDashboard?.stats?.topReferrers && allyDashboard.stats.topReferrers.length > 0 && (
              <div className="top-referrers">
                <h4>🔝 Top Fuentes de Tráfico</h4>
                <div className="referrers-list">
                  {allyDashboard.stats.topReferrers.map((referrer: string, index: number) => (
                    <div key={index} className="referrer-item">
                      <span>{index + 1}. {referrer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="social-section">
            <h3>📱 Integración para Redes Sociales</h3>
            <p>Copia estos textos para compartir en tus redes sociales con backlinks a la plataforma oficial:</p>

            <div className="social-card">
              <div className="social-header">
                <span className="social-platform">Facebook</span>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(socialIntegration.facebook)
                    alert('¡Copiado al portapapeles!')
                  }}
                >
                  <Copy size={14} />
                </button>
              </div>
              <p>{socialIntegration.facebook}</p>
            </div>

            <div className="social-card">
              <div className="social-header">
                <span className="social-platform">Instagram</span>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(socialIntegration.instagram)
                    alert('¡Copiado al portapapeles!')
                  }}
                >
                  <Copy size={14} />
                </button>
              </div>
              <p>{socialIntegration.instagram}</p>
            </div>

            <div className="social-card">
              <div className="social-header">
                <span className="social-platform">WhatsApp</span>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(socialIntegration.whatsapp)
                    alert('¡Copiado al portapapeles!')
                  }}
                >
                  <Copy size={14} />
                </button>
              </div>
              <p style={{ whiteSpace: 'pre-line' }}>{socialIntegration.whatsapp}</p>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="impact-section">
            <h3>🛡️ Impacto SEO Defensivo</h3>
            <div className="impact-grid">
              <div className="impact-card">
                <Users className="text-blue-600" size={20} />
                <div>
                  <strong>{seoImpact.totalAllies}</strong>
                  <span>Aliados Totales</span>
                </div>
              </div>
              <div className="impact-card">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <strong>{seoImpact.verifiedAllies}</strong>
                  <span>Aliados Verificados</span>
                </div>
              </div>
              <div className="impact-card">
                <Link className="text-purple-600" size={20} />
                <div>
                  <strong>{seoImpact.totalBacklinks}</strong>
                  <span>Backlinks Totales</span>
                </div>
              </div>
              <div className="impact-card">
                <TrendingUp className="text-orange-600" size={20} />
                <div>
                  <strong>{seoImpact.estimatedDAImpact.toFixed(1)}</strong>
                  <span>Impacto DA Estimado</span>
                </div>
              </div>
            </div>

            <div className="keywords-coverage">
              <h4>🎯 Cobertura de Keywords Estratégicas</h4>
              <div className="keywords-list">
                {seoImpact.keywordCoverage.map((keyword, index) => (
                  <span key={index} className="keyword-badge">{keyword}</span>
                ))}
              </div>
            </div>

            {seoImpact.topPerformingAllies.length > 0 && (
              <div className="top-allies">
                <h4>🏆 Top Aliados por Performance</h4>
                <div className="allies-list">
                  {seoImpact.topPerformingAllies.map((ally, index) => (
                    <div key={index} className="ally-performance-item">
                      <span>{index + 1}. {ally.name}</span>
                      <div className="performance-metrics">
                        <span>{ally.clicks} clics</span>
                        <span>{ally.conversionRate.toFixed(1)}% conversión</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ally-backlinks-footer">
        <p>
          <Shield size={14} className="text-green-600" />
          Los backlinks oficiales ayudan a combatir la desinformación y fortalecen la autoridad de la red de turismo de Salento.
        </p>
      </div>
    </div>
  )
}

export default AllyBacklinksDashboard