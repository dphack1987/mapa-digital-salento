import React, { useState } from 'react'
import searchEngineIndexingService from '../services/searchEngineIndexing.service'
import BingVerificationModal from './BingVerificationModal'
import BaiduVerificationModal from './BaiduVerificationModal'
import YandexVerificationModal from './YandexVerificationModal'

interface SearchEngineIndexingModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchEngineIndexingModal: React.FC<SearchEngineIndexingModalProps> = ({ isOpen, onClose }) => {
  const [showBingModal, setShowBingModal] = useState(false)
  const [showBaiduModal, setShowBaiduModal] = useState(false)
  const [showYandexModal, setShowYandexModal] = useState(false)
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null)

  if (!isOpen) return null

  const indexingStatus = searchEngineIndexingService.getIndexingStatus()
  const engines = indexingStatus.engines

  const handleEngineClick = (engineName: string) => {
    if (engineName.includes('Bing')) {
      setShowBingModal(true)
    } else if (engineName.includes('Baidu')) {
      setShowBaiduModal(true)
    } else if (engineName.includes('Yandex')) {
      setShowYandexModal(true)
    } else if (engineName.includes('Google')) {
      setSelectedEngine('Google')
    } else {
      setSelectedEngine(engineName)
    }
  }

  const getEngineIcon = (engineName: string): string => {
    if (engineName.includes('Google')) return '🔍'
    if (engineName.includes('Bing')) return '🔎'
    if (engineName.includes('DuckDuckGo')) return '🦆'
    if (engineName.includes('Yahoo')) return '📧'
    if (engineName.includes('Baidu')) return '🇨🇳'
    if (engineName.includes('Yandex')) return '🇷🇺'
    return '🌐'
  }

  const getEngineStatus = (engine: any): string => {
    if (engine.verified) return '✅ Verificado'
    if (engine.verificationCode) return '⏳ Pendiente de verificación'
    return '❌ No configurado'
  }

  const getEnginePriority = (engineName: string): string => {
    if (engineName.includes('Google') || engineName.includes('Bing')) return 'Alta'
    if (engineName.includes('DuckDuckGo') || engineName.includes('Yahoo')) return 'Media'
    return 'Baja (Opcional)'
  }

  return (
    <div className="search-engine-indexing-modal-overlay">
      <div className="search-engine-indexing-modal">
        <div className="modal-header">
          <h2>🌐 Indexación en Motores de Búsqueda</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="indexing-overview">
            <div className="status-card">
              <h3>Estado General</h3>
              <p className="status-text">{indexingStatus.indexingStatus}</p>
              <p className="engines-count">
                {indexingStatus.verifiedEngines}/{indexingStatus.totalEngines} motores configurados
              </p>
            </div>

            <div className="domain-info">
              <h3>Dominio</h3>
              <p>{indexingStatus.domain}</p>
            </div>
          </div>

          <div className="search-engines-list">
            <h3>Motores de Búsqueda</h3>
            {engines.map((engine, index) => (
              <div key={index} className="engine-card">
                <div className="engine-header">
                  <span className="engine-icon">{getEngineIcon(engine.name)}</span>
                  <h4>{engine.name}</h4>
                  <span className="engine-priority">Prioridad: {getEnginePriority(engine.name)}</span>
                </div>

                <div className="engine-status">
                  <span className="status-badge">{getEngineStatus(engine)}</span>
                </div>

                <div className="engine-details">
                  <p><strong>URL:</strong> <a href={engine.url} target="_blank" rel="noopener noreferrer">{engine.url}</a></p>
                  <p><strong>Sitemap:</strong> <a href={engine.sitemapUrl} target="_blank" rel="noopener noreferrer">{engine.sitemapUrl}</a></p>
                  {engine.lastIndexed && <p><strong>Última indexación:</strong> {engine.lastIndexed}</p>}
                </div>

                <div className="engine-actions">
                  <a href={engine.webmasterUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Ir a Webmaster Tools
                  </a>
                  {!engine.verified && (
                    <button
                      className="btn-primary"
                      onClick={() => handleEngineClick(engine.name)}
                    >
                      {engine.verificationCode ? 'Completar Verificación' : 'Configurar'}
                    </button>
                  )}
                </div>

                <div className="engine-instructions">
                  <details>
                    <summary>Instrucciones</summary>
                    <ol>
                      {engine.instructions.map((instruction: string, i: number) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              </div>
            ))}
          </div>

          <div className="recommendations">
            <h3>📋 Recomendaciones</h3>
            <ul>
              {indexingStatus.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="sitemap-submission">
            <h3>📤 Envío de Sitemap</h3>
            <p>URL del sitemap: <a href={indexingStatus.engines[0].sitemapUrl} target="_blank" rel="noopener noreferrer">{indexingStatus.engines[0].sitemapUrl}</a></p>
            <div className="sitemap-buttons">
              <a href="https://search.google.com/search-console/sitemaps" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Enviar a Google
              </a>
              <a href="https://www.bing.com/webmasters/sitemaps.aspx" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Enviar a Bing
              </a>
            </div>
          </div>
        </div>
      </div>

      <BingVerificationModal
        isOpen={showBingModal}
        onClose={() => setShowBingModal(false)}
        onVerify={(code) => console.log('Bing verification code:', code)}
      />

      <BaiduVerificationModal
        isOpen={showBaiduModal}
        onClose={() => setShowBaiduModal(false)}
        onVerify={(code) => console.log('Baidu verification code:', code)}
      />

      <YandexVerificationModal
        isOpen={showYandexModal}
        onClose={() => setShowYandexModal(false)}
        onVerify={(code) => console.log('Yandex verification code:', code)}
      />
    </div>
  )
}

export default SearchEngineIndexingModal