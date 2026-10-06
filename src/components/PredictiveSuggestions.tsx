/**
 * PredictiveSuggestions - Componente de sugerencias predictivas (Fase 3)
 * Muestra predicciones de ventanas seguras, mejores momentos y riesgos
 */
import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import tourismPredictor from '../services/tourismPredictor';
import itineraryGenerator from '../services/itineraryGenerator';
import { TimeRecommendation } from '../services/osirisTypes';

interface PredictiveSuggestionsProps {
  className?: string;
}

export default function PredictiveSuggestions({ className = '' }: PredictiveSuggestionsProps) {
  const [bestTime, setBestTime] = useState<TimeRecommendation | null>(null);
  const [riskPrediction, setRiskPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      // Cargar mejores momentos para actividades
      const timeRec = await tourismPredictor.predictBestTimeForActivity('cabalgatas');
      setBestTime(timeRec);

      // Cargar predicción de riesgo
      const riskPred = await tourismPredictor.predictRiskForPeriod(1);
      setRiskPrediction(riskPred);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskLabel = (level: string): string => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'moderate': return 'Moderado';
      case 'high': return 'Alto';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className={`predictive-suggestions loading ${className}`}>
        <div className="suggestions-header">
          <Calendar size={18} />
          <span>Cargando predicciones...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`predictive-suggestions ${className}`}>
      <div 
        className="suggestions-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="header-left">
          <TrendingUp size={18} className="icon-blue" />
          <span>Inteligencia Predictiva</span>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {expanded && (
        <div className="suggestions-content">
          {/* Mejor momento para visitar */}
          {bestTime && (
            <div className="prediction-card">
              <div className="card-header">
                <Clock size={16} className="icon-green" />
                <strong>Mejor momento para visitar</strong>
              </div>
              <div className="card-body">
                <div className="prediction-item">
                  <span className="label">Mejores meses:</span>
                  <span className="value">{bestTime.bestMonths.slice(0, 3).join(', ')}...</span>
                </div>
                <div className="prediction-item">
                  <span className="label">Mejores horas:</span>
                  <span className="value">{bestTime.bestHours[0]}</span>
                </div>
                <div className="prediction-item">
                  <span className="label">Evitar:</span>
                  <span className="value">{bestTime.avoidPeriods[0]}</span>
                </div>
                <p className="prediction-reason">{bestTime.reason}</p>
              </div>
            </div>
          )}

          {/* Predicción de riesgo */}
          {riskPrediction && (
            <div className="prediction-card">
              <div className="card-header">
                <AlertTriangle size={16} className={riskPrediction.overallRisk === 'high' ? 'icon-red' : riskPrediction.overallRisk === 'moderate' ? 'icon-yellow' : 'icon-green'} />
                <strong>Predicción de riesgo (24h)</strong>
              </div>
              <div className="card-body">
                <div className="risk-badge" style={{ backgroundColor: getRiskColor(riskPrediction.overallRisk) }}>
                  Riesgo: {getRiskLabel(riskPrediction.overallRisk)}
                </div>
                {riskPrediction.risks.length > 0 && (
                  <div className="risk-list">
                    {riskPrediction.risks.map((risk: any, index: number) => (
                      <div key={index} className="risk-item">
                        <span className="risk-type">{risk.type}</span>
                        <span className="risk-level" style={{ color: getRiskColor(risk.level) }}>
                          {getRiskLabel(risk.level)}
                        </span>
                        <span className="risk-prob">{Math.round(risk.probability * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sugerencia de actividad */}
          <div className="prediction-card highlight">
            <div className="card-header">
              <TrendingUp size={16} className="icon-blue" />
              <strong>Sugerencia basada en condiciones</strong>
            </div>
            <div className="card-body">
              {riskPrediction?.overallRisk === 'low' ? (
                <p className="suggestion-text">
                  ✅ Las condiciones son favorables para actividades al aire libre. 
                  Recomendamos visitar Valle de Cocora o hacer cabalgatas.
                </p>
              ) : riskPrediction?.overallRisk === 'moderate' ? (
                <p className="suggestion-text">
                  ⚠️ Condiciones moderadas. Recomendamos actividades bajo techo 
                  (tour cafetero, museos) con opción a actividades al aire libre.
                </p>
              ) : (
                <p className="suggestion-text">
                  ⚠️ Condiciones adversas. Recomendamos priorizar actividades 
                  urbanas en el pueblo de Salento.
                </p>
              )}
            </div>
          </div>

          <div className="prediction-footer">
            <small>Predicciones basadas en datos históricos y condiciones actuales</small>
          </div>
        </div>
      )}
    </div>
  );
}
