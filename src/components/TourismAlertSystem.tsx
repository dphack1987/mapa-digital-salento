/**
 * Sistema de Alertas Turísticas - OSIRIS
 * Muestra alertas personalizadas basadas en condiciones ambientales
 * Fase 2: Transformación Turística
 */
import { useState, useMemo } from 'react';
import { AlertTriangle, Cloud, Flame, Wind, X, Clock } from 'lucide-react';
import { useOsirisData } from '../hooks/useOsirisData';
import { TourismAlert } from '../services/osirisTypes';
import osirisTourismEngine from '../services/osirisTourismEngine';

function AlertCard({ alert, onDismiss }: { alert: TourismAlert; onDismiss: () => void }) {
  const getIcon = () => {
    switch (alert.type) {
      case 'earthquake': return <AlertTriangle size={20} />;
      case 'weather': return <Cloud size={20} />;
      case 'fire': return <Flame size={20} />;
      case 'air_quality': return <Wind size={20} />;
    }
  };

  const getSeverityClass = () => {
    switch (alert.severity) {
      case 'danger': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = alert.validUntil.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}min`;
  };

  return (
    <div className={`tourism-alert ${getSeverityClass()}`}>
      <div className="alert-header">
        <div className="alert-icon">{getIcon()}</div>
        <div className="alert-title-group">
          <h4>{alert.title}</h4>
          <span className="alert-severity">{alert.severity}</span>
        </div>
        <button className="alert-dismiss" onClick={onDismiss} aria-label="Cerrar alerta">
          <X size={16} />
        </button>
      </div>
      
      <p className="alert-description">{alert.description}</p>
      
      <div className="alert-activities">
        <span className="activities-label">Actividades afectadas:</span>
        <div className="activities-list">
          {alert.affectedActivities.map((activity, index) => (
            <span key={index} className="activity-tag">{activity}</span>
          ))}
        </div>
      </div>
      
      <div className="alert-recommendation">
        <strong>Recomendación:</strong> {alert.recommendation}
      </div>
      
      <div className="alert-footer">
        <span className="alert-time">
          <Clock size={12} />
          Válido por {getTimeRemaining()}
        </span>
      </div>
    </div>
  );
}

export default function TourismAlertSystem() {
  const { data } = useOsirisData(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
  const alerts = useMemo(() => {
    if (!data) return [];
    return osirisTourismEngine.generateTourismAlerts(data);
  }, [data]);
  
  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.title));
  
  const handleDismiss = (alert: TourismAlert) => {
    setDismissedAlerts(prev => new Set([...prev, alert.title]));
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="tourism-alerts-container">
      <div className="tourism-alerts-header">
        <h3>🔔 Alertas Turísticas</h3>
        <span className="alert-count">{activeAlerts.length}</span>
      </div>
      
      <div className="tourism-alerts-list">
        {activeAlerts.map((alert, index) => (
          <AlertCard
            key={`${alert.type}-${index}`}
            alert={alert}
            onDismiss={() => handleDismiss(alert)}
          />
        ))}
      </div>
    </div>
  );
}
