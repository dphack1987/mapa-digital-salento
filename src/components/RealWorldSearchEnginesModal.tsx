import React, { useState } from 'react'
import realWorldSearchEnginesService from '../services/realWorldSearchEngines.service'
import { Globe, TrendingUp, AlertTriangle, CheckCircle, Target, BarChart } from 'lucide-react'

interface RealWorldSearchEnginesModalProps {
  isOpen: boolean
  onClose: () => void
}

const RealWorldSearchEnginesModal: React.FC<RealWorldSearchEnginesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'engines' | 'analysis' | 'strategy'>('engines')

  if (!isOpen) return null

  const realEngines = realWorldSearchEnginesService.getRealSearchEngines()
  const visibilityAnalysis = realWorldSearchEnginesService.getSalentoVisibilityAnalysis()
  const optimizationStrategy = realWorldSearchEnginesService.getOptimizationStrategy()

  const getPriorityColor = (priority: number): string => {
    if (priority <= 2) return 'red'
    if (priority === 3) return 'yellow'
    return 'green'
  }

  const getPriorityBadge = (priority: number): string => {
    if (priority <= 2) return '🔴 CRÍTICO'
    if (priority === 3) return '🟡 IMPORTANTE'
    return '🟢 OPCIONAL'
  }

  const renderEnginesTab = () => (
    <div className="real-engines-tab">
      <div className="market-reality">
        <h3>🎯 Realidad del Mercado: Competencia y Disrupción</h3>
        <div className="reality-grid">
          <div className="reality-card">
            <Target size={24} className="text-blue-600" />
            <h4>Modelo de Comisiones</h4>
            <p className="reality-stat">3-25%</p>
            <p className="reality-label">Booking, Airbnb, KAYAK</p>
          </div>
          <div className="reality-card">
            <TrendingUp size={24} className="text-green-600" />
            <h4>Nuestra Ventaja</h4>
            <p className="reality-stat">0%</p>
            <p className="reality-label">Sin comisiones para comerciantes</p>
          </div>
          <div className="reality-card">
            <Globe size={24} className="text-orange-600" />
            <h4>Estrategia</h4>
            <p className="reality-stat">Disrupción</p>
            <p className="reality-label">Igualar herramientas, eliminar comisiones</p>
          </div>
        </div>
      </div>

      <div className="engines-list">
        <h3>Motores de Búsqueda del Mundo Real</h3>
        {realEngines.map((engine, index) => (
          <div key={index} className="engine-card-real">
            <div className="engine-header-real">
              <div className="engine-info">
                <h4>{engine.name}</h4>
                <span className="engine-market-share">{engine.marketShareColombia}</span>
              </div>
              <div className="engine-badges">
                <span className="priority-badge">{getPriorityBadge(engine.optimizationPriority)}</span>
                {engine.colombian && <span className="colombian-badge">🇨🇴 Colombiano</span>}
                {engine.tourismSpecialized && <span className="tourism-badge">🏨 Turismo</span>}
              </div>
            </div>

            <div className="engine-details-real">
              <div className="detail-row">
                <span className="detail-label">Visibilidad actual:</span>
                <span className="detail-value">{engine.currentSalentoVisibility}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Relevancia turismo:</span>
                <span className="detail-value">{engine.relevanceForTourism}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Webmaster Tools:</span>
                <a href={engine.webmasterUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                  {engine.webmasterUrl}
                </a>
              </div>
            </div>

            <div className="engine-instructions-real">
              <details>
                <summary>Instrucciones de optimización</summary>
                <ol>
                  {engine.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAnalysisTab = () => (
    <div className="analysis-tab">
      <div className="visibility-analysis">
        <h3>📊 Análisis de Visibilidad de Salento Quindío</h3>
        <div className="analysis-card">
          <div className="analysis-header">
            <Target size={20} className="text-blue-600" />
            <h4>Destino: {visibilityAnalysis.destination}</h4>
          </div>
          <div className="analysis-content">
            <p><strong>Visibilidad general:</strong> {visibilityAnalysis.overallVisibility}</p>
            <p><strong>Realidad del mercado:</strong> {visibilityAnalysis.marketReality}</p>
            <p><strong>Ventaja competitiva:</strong> {visibilityAnalysis.competitiveAdvantage}</p>
          </div>
        </div>

        <div className="competitors-section">
          <h4>⚔️ Principales Competidores (Modelo de Comisiones)</h4>
          <div className="competitors-list">
            {visibilityAnalysis.topCompetitors.map((competitor, index) => (
              <div key={index} className="competitor-item competitive">
                <span className="competitor-rank competitive">⚔️</span>
                <span className="competitor-name">{competitor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="opportunities-section">
          <h4>🚀 Oportunidades de Disrupción</h4>
          <ul className="opportunities-list">
            {visibilityAnalysis.disruptionOpportunity.map((opportunity, index) => (
              <li key={index} className="opportunity-item">
                <CheckCircle size={16} className="text-green-600" />
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  const renderStrategyTab = () => (
    <div className="strategy-tab">
      <div className="optimization-strategy">
        <h3>🎯 Estrategia de Optimización Basada en Realidad</h3>

        <div className="strategy-section">
          <h4>🎯 Estrategia de Disrupción</h4>
          <div className="strategy-card">
            <p>{optimizationStrategy.disruptionStrategy}</p>
          </div>
        </div>

        <div className="strategy-section">
          <h4>🔴 Prioridad 1 (Competencia Principal - 90% del presupuesto)</h4>
          <div className="priority-engines">
            {optimizationStrategy.priority1.map((engine, index) => (
              <div key={index} className="priority-engine competitive">
                <h5>{engine.name}</h5>
                <p>{engine.marketShareColombia} del mercado</p>
                <p className="reason">{engine.instructions[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="strategy-section">
          <h4>🟡 Prioridad 2 (Importante - 15% del presupuesto)</h4>
          <div className="priority-engines">
            {optimizationStrategy.priority2.map((engine, index) => (
              <div key={index} className="priority-engine important">
                <h5>{engine.name}</h5>
                <p>{engine.marketShareColombia} del mercado</p>
                <p className="reason">{engine.instructions[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="strategy-section">
          <h4>🟢 Prioridad 3 (Opcional - 5% del presupuesto)</h4>
          <div className="priority-engines">
            {optimizationStrategy.priority3.map((engine, index) => (
              <div key={index} className="priority-engine optional">
                <h5>{engine.name}</h5>
                <p>{engine.marketShareColombia} del mercado</p>
                <p className="reason">{engine.instructions[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="strategy-recommendations">
          <div className="recommendation-card">
            <BarChart size={20} className="text-blue-600" />
            <div>
              <h4>Recomendación de Presupuesto</h4>
              <p>{optimizationStrategy.budgetRecommendation}</p>
            </div>
          </div>
          <div className="recommendation-card">
            <TrendingUp size={20} className="text-green-600" />
            <div>
              <h4>Cronograma</h4>
              <p>{optimizationStrategy.timeline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="real-world-search-engines-modal-overlay">
      <div className="real-world-search-engines-modal">
        <div className="modal-header">
          <h2>🌍 Motores de Búsqueda del Mundo Real - Salento Quindío</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === 'engines' ? 'active' : ''}`}
            onClick={() => setActiveTab('engines')}
          >
            <Globe size={16} />
            Motores Reales
          </button>
          <button
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart size={16} />
            Análisis
          </button>
          <button
            className={`tab-button ${activeTab === 'strategy' ? 'active' : ''}`}
            onClick={() => setActiveTab('strategy')}
          >
            <Target size={16} />
            Estrategia
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'engines' && renderEnginesTab()}
          {activeTab === 'analysis' && renderAnalysisTab()}
          {activeTab === 'strategy' && renderStrategyTab()}
        </div>
      </div>
    </div>
  )
}

export default RealWorldSearchEnginesModal