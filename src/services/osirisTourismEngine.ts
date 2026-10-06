/**
 * Motor de Interpretación Turística - OSIRIS
 * Convierte datos genéricos de OSIRIS en información útil para turismo
 * Fase 2: Transformación Turística
 */
import { OsirisEarthquake, OsirisWeather, OsirisAirQuality, OsirisFire, OsirisNews, TourismImpact, ActivityRecommendation, GroupRecommendation, TourismAlert } from './osirisTypes';

const SALENTO_COORDS = { lat: 4.636, lng: -75.567 };

class OsirisTourismEngine {
  /**
   * Interpreta terremoto en contexto turístico
   */
  interpretEarthquakeForTourism(eq: OsirisEarthquake): TourismImpact {
    const distance = this.calculateDistance(SALENTO_COORDS.lat, SALENTO_COORDS.lng, eq.lat, eq.lng);
    const riskLevel = this.calculateRiskLevel(eq.magnitude, distance);
    
    const affectedAreas = this.identifyAffectedTouristAreas(eq.lat, eq.lng, distance);
    const alternativeRoutes = this.suggestAlternativeRoutes(eq.lat, eq.lng, distance);
    
    return {
      riskLevel,
      impact: this.determineImpact(riskLevel, distance),
      recommendation: this.generateRecommendation(riskLevel, distance),
      affectedAreas,
      alternativeRoutes
    };
  }

  /**
   * Interpreta clima para actividades turísticas
   */
  interpretWeatherForActivities(weather: OsirisWeather[]): ActivityRecommendation[] {
    const activities = [
      {
        activity: 'Cabalgatas en Valle de Cocora',
        status: this.determineActivityStatus(weather, 'outdoor'),
        reason: this.getWeatherReason(weather),
        alternatives: this.getWeatherAlternatives(weather, 'outdoor')
      },
      {
        activity: 'Caminata a Cascadas de Santa Rita',
        status: this.determineActivityStatus(weather, 'hiking'),
        reason: this.getWeatherReason(weather),
        alternatives: this.getWeatherAlternatives(weather, 'hiking')
      },
      {
        activity: 'Tour cafetero',
        status: this.determineActivityStatus(weather, 'indoor'),
        reason: this.getWeatherReason(weather),
        alternatives: this.getWeatherAlternatives(weather, 'indoor')
      },
      {
        activity: 'Visita a miradores',
        status: this.determineActivityStatus(weather, 'outdoor'),
        reason: this.getWeatherReason(weather),
        alternatives: this.getWeatherAlternatives(weather, 'outdoor')
      }
    ];
    
    return activities;
  }

  /**
   * Interpreta calidad del aire para grupos vulnerables
   */
  interpretAirQualityForGroups(aq: OsirisAirQuality | null): GroupRecommendation {
    if (!aq) {
      return {
        general: 'safe',
        elderly: 'safe',
        children: 'safe',
        asthma: 'safe'
      };
    }

    return {
      general: aq.aqi <= 100 ? 'safe' : aq.aqi <= 150 ? 'caution' : 'avoid',
      elderly: aq.aqi <= 50 ? 'safe' : aq.aqi <= 100 ? 'limit_exercise' : 'avoid',
      children: aq.aqi <= 75 ? 'safe' : aq.aqi <= 100 ? 'limit_exposure' : 'avoid',
      asthma: aq.aqi <= 30 ? 'safe' : aq.aqi <= 50 ? 'limit' : 'avoid'
    };
  }

  /**
   * Genera alertas turísticas basadas en datos OSIRIS
   */
  generateTourismAlerts(data: any): TourismAlert[] {
    const alerts: TourismAlert[] = [];
    const now = new Date();

    // Alerta de terremotos significativos
    const significantEarthquakes = data.earthquakes?.filter((eq: OsirisEarthquake) => eq.magnitude >= 4.0) || [];
    if (significantEarthquakes.length > 0) {
      alerts.push({
        type: 'earthquake',
        severity: significantEarthquakes.some((eq: OsirisEarthquake) => eq.magnitude >= 5.0) ? 'danger' : 'warning',
        title: 'Actividad sísmica detectada',
        description: `${significantEarthquakes.length} terremoto(s) significativo(s) detectado(s) en la región. Magnitud máxima: M${Math.max(...significantEarthquakes.map((eq: OsirisEarthquake) => eq.magnitude)).toFixed(1)}.`,
        affectedActivities: ['Cabalgatas', 'Senderismo', 'Visitas a miradores'],
        recommendation: 'Preferir actividades urbanas en el pueblo de Salento. Mantenerse informado.',
        validUntil: new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 horas
      });
    }

    // Alerta de clima severo
    const severeWeather = data.weather?.filter((w: OsirisWeather) => w.severity === 'high' || w.severity === 'extreme') || [];
    if (severeWeather.length > 0) {
      alerts.push({
        type: 'weather',
        severity: severeWeather.some((w: OsirisWeather) => w.severity === 'extreme') ? 'danger' : 'warning',
        title: 'Clima adverso en la región',
        description: `${severeWeather.length} evento(s) climático(s) severo(s) detectado(s). ${severeWeather.map((w: OsirisWeather) => w.event).join(', ')}.`,
        affectedActivities: ['Actividades al aire libre', 'Cabalgatas', 'Senderismo'],
        recommendation: 'Preferir actividades bajo techo (tour cafetero, museos, restaurantes).',
        validUntil: new Date(now.getTime() + 4 * 60 * 60 * 1000) // 4 horas
      });
    }

    // Alerta de incendios cercanos
    const nearbyFires = data.fires?.filter((f: OsirisFire) => f.brightness >= 350) || [];
    if (nearbyFires.length > 0) {
      alerts.push({
        type: 'fire',
        severity: nearbyFires.some((f: OsirisFire) => f.brightness >= 450) ? 'danger' : 'warning',
        title: 'Incendios forestales activos',
        description: `${nearbyFires.length} incendio(s) forestal(es) activo(s) detectado(s) en la región.`,
        affectedActivities: ['Valle de Cocora', 'Senderismo en zona boscosa'],
        recommendation: 'Evitar zona norte del Valle de Cocora. Consultar autoridades locales.',
        validUntil: new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6 horas
      });
    }

    // Alerta de calidad del aire
    if (data.airQuality && data.airQuality.aqi > 100) {
      alerts.push({
        type: 'air_quality',
        severity: data.airQuality.aqi > 150 ? 'danger' : 'warning',
        title: 'Calidad del aire moderada',
        description: `AQI actual: ${data.airQuality.aqi}. Nivel de contaminación superior al recomendado.`,
        affectedActivities: ['Actividades físicas intensas', 'Ejercicio al aire libre'],
        recommendation: 'Limitar actividades físicas intensas. Grupos vulnerables (niños, adultos mayores, asmáticos) deben tomar precauciones.',
        validUntil: new Date(now.getTime() + 3 * 60 * 60 * 1000) // 3 horas
      });
    }

    return alerts;
  }

  // ==================== Métodos Privados ====================

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateRiskLevel(magnitude: number, distance: number): TourismImpact['riskLevel'] {
    if (magnitude >= 6.0 && distance < 50) return 'severe';
    if (magnitude >= 5.0 && distance < 100) return 'high';
    if (magnitude >= 4.0 && distance < 150) return 'moderate';
    if (magnitude >= 3.0 && distance < 200) return 'low';
    return 'none';
  }

  private determineImpact(riskLevel: TourismImpact['riskLevel'], distance: number): string {
    const impacts = {
      severe: 'Impacto severo en la región. Posibles daños estructurales y riesgo para actividades al aire libre.',
      high: 'Impacto alto en la región. Vibraciones perceptibles. Precaución recomendada.',
      moderate: 'Impacto moderado. Vibraciones leves. Actividades normales pueden continuar con precaución.',
      low: 'Impacto bajo. Vibraciones mínimas. Sin interrupción significativa de actividades.',
      none: 'Sin impacto perceptible. Actividades normales pueden continuar.'
    };
    return impacts[riskLevel];
  }

  private generateRecommendation(riskLevel: TourismImpact['riskLevel'], distance: number): string {
    const recommendations = {
      severe: 'Evitar actividades al aire libre. Mantenerse en zonas urbanas. Prepararse para réplicas. Alejarse de edificios antiguos.',
      high: 'Preferir actividades bajo techo. Mantenerse informado. Tener plan de evacuación.',
      moderate: 'Actividades normales con precaución. Evitar zonas de riesgo. Estar atento a actualizaciones.',
      low: 'Sin restricciones mayores. Mantenerse informado.',
      none: 'Todas las actividades son seguras.'
    };
    return recommendations[riskLevel];
  }

  private identifyAffectedTouristAreas(lat: number, lng: number, distance: number): string[] {
    const areas = [];
    
    if (distance < 50) {
      areas.push('Centro de Salento', 'Valle de Cocora', 'Cascadas de Santa Rita');
    } else if (distance < 100) {
      areas.push('Valle de Cocora', 'Miradores cercanos');
    } else if (distance < 150) {
      areas.push('Zonas rurales alrededor de Salento');
    }
    
    return areas;
  }

  private suggestAlternativeRoutes(lat: number, lng: number, distance: number): string[] {
    if (distance < 50) {
      return [
        'Visita al pueblo de Salento (calles principales)',
        'Tour cafetero bajo techo',
        'Museos y galerías locales'
      ];
    } else if (distance < 100) {
      return [
        'Rutas turísticas en el pueblo',
        'Visitas a hoteles y restaurantes',
        'Actividades comerciales en el centro'
      ];
    }
    return [];
  }

  private determineActivityStatus(weather: OsirisWeather[], activityType: string): ActivityRecommendation['status'] {
    const hasSevere = weather.some(w => w.severity === 'high' || w.severity === 'extreme');
    const hasRain = weather.some(w => w.event.toLowerCase().includes('rain') || w.event.toLowerCase().includes('lluvia'));
    
    if (hasSevere) return 'not_recommended';
    if (hasRain && activityType === 'outdoor') return 'cautious';
    return 'recommended';
  }

  private getWeatherReason(weather: OsirisWeather[]): string {
    if (weather.length === 0) return 'Sin eventos climáticos reportados';
    
    const severe = weather.filter(w => w.severity === 'high' || w.severity === 'extreme');
    if (severe.length > 0) {
      return `Eventos severos: ${severe.map(w => w.event).join(', ')}`;
    }
    
    return `Clima normal con ${weather.length} evento(s) menor(es)`;
  }

  private getWeatherAlternatives(weather: OsirisWeather[], activityType: string): string[] {
    if (activityType === 'outdoor') {
      return ['Tour cafetero bajo techo', 'Visita a museos locales', 'Gastronomía en restaurantes'];
    }
    if (activityType === 'hiking') {
      return ['Caminata por el pueblo', 'Visita a miradores cercanos con protección'];
    }
    return ['Actividades regulares disponibles'];
  }
}

export const osirisTourismEngine = new OsirisTourismEngine();
export default osirisTourismEngine;
