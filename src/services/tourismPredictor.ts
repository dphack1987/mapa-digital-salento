/**
 * TourismPredictor - Motor de predicción turística (Fase 3)
 * Predice ventanas de tiempo seguro y mejores momentos para actividades
 * NOTA: Usa análisis estadístico simple, no ML complejo
 */
import osirisDataService from './osirisDataService';
import { OsirisData, SafeWindowPrediction, TimeRecommendation } from './osirisTypes';

const SALENTO_COORDS = { lat: 4.636, lng: -75.567 };

/**
 * Servicio de predicción turística
 */
class TourismPredictor {
  /**
   * Predice ventanas de tiempo seguro para actividades
   * Analiza datos históricos y patrones estacionales
   */
  async predictSafeVisitWindow(
    activity: string,
    startDate: Date,
    duration: number // en días
  ): Promise<SafeWindowPrediction> {
    try {
      // Obtener datos actuales de OSIRIS
      const currentData = await osirisDataService.getExpandedSalentoData();
      
      // Simular datos históricos (en producción, esto vendría de OSIRIS histórico)
      const historicalPatterns = this.getHistoricalPatterns();
      
      // Calcular ventanas de riesgo basado en condiciones actuales
      const riskWindows = this.calculateRiskWindows(currentData, startDate, duration);
      
      // Calcular ventanas seguras (complemento de riesgo)
      const safeWindows = this.calculateSafeWindows(startDate, duration, riskWindows);
      
      // Calcular confianza basada en calidad de datos
      const confidence = this.calculateConfidence(currentData);
      
      // Identificar factores principales
      const factors = this.identifyFactors(currentData, historicalPatterns);
      
      return {
        safeWindows,
        riskWindows,
        confidence,
        factors
      };
    } catch (error) {
      console.error('Error predicting safe visit window:', error);
      // Retornar predicción conservadora
      return {
        safeWindows: [{ from: startDate, to: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000) }],
        riskWindows: [],
        confidence: 0.3,
        factors: ['Datos limitados', 'Usando predicción conservadora']
      };
    }
  }

  /**
   * Predice el mejor momento para una actividad específica
   */
  async predictBestTimeForActivity(activity: string): Promise<TimeRecommendation> {
    // Definir condiciones ideales por actividad
    const activityConditions = this.getActivityConditions(activity);
    
    try {
      const currentData = await osirisDataService.getExpandedSalentoData();
      const historicalPatterns = this.getHistoricalPatterns();
      
      // Analizar cuándo es mejor según clima sísmico
      const bestMonths = this.findBestMonths(activityConditions, historicalPatterns);
      const bestHours = this.findBestHours(activityConditions);
      const avoidPeriods = this.findAvoidPeriods(activityConditions, historicalPatterns);
      
      return {
        bestMonths,
        bestHours,
        avoidPeriods,
        reason: this.generateTimeRecommendationReason(activityConditions, currentData)
      };
    } catch (error) {
      console.error('Error predicting best time for activity:', error);
      return {
        bestMonths: ['Enero', 'Febrero', 'Diciembre'],
        bestHours: ['6:00 AM - 10:00 AM', '3:00 PM - 6:00 PM'],
        avoidPeriods: ['Temporada de lluvias (abril-mayo, octubre-noviembre)'],
        reason: 'Predicción basada en patrones históricos generales'
      };
    }
  }

  /**
   * Predice riesgo para el próximo período
   */
  async predictRiskForPeriod(days: number): Promise<{
    overallRisk: 'low' | 'moderate' | 'high';
    risks: { type: string; level: string; probability: number }[];
  }> {
    try {
      const currentData = await osirisDataService.getExpandedSalentoData();
      
      const risks = [];
      
      // Riesgo sísmico
      const seismicRisk = this.assessSeismicRisk(currentData.earthquakes);
      if (seismicRisk.level !== 'none') {
        risks.push({
          type: 'sísmico',
          level: seismicRisk.level,
          probability: seismicRisk.probability
        });
      }
      
      // Riesgo climático
      const weatherRisk = this.assessWeatherRisk(currentData.weather);
      if (weatherRisk.level !== 'none') {
        risks.push({
          type: 'climático',
          level: weatherRisk.level,
          probability: weatherRisk.probability
        });
      }
      
      // Riesgo de incendios
      const fireRisk = this.assessFireRisk(currentData.fires);
      if (fireRisk.level !== 'none') {
        risks.push({
          type: 'incendios',
          level: fireRisk.level,
          probability: fireRisk.probability
        });
      }
      
      // Calcular riesgo general
      const overallRisk = this.calculateOverallRisk(risks);
      
      return {
        overallRisk,
        risks
      };
    } catch (error) {
      console.error('Error predicting risk for period:', error);
      return {
        overallRisk: 'moderate',
        risks: [{ type: 'general', level: 'moderate', probability: 0.5 }]
      };
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Obtiene patrones históricos (simulado)
   */
  private getHistoricalPatterns(): any {
    return {
      seismic: {
        // Salento está en zona sísmica moderada
        activity: 'moderate',
        seasonality: 'none'
      },
      weather: {
        // Temporada seca: diciembre-marzo, julio-agosto
        drySeasons: ['dic-mar', 'jul-ago'],
        // Temporada lluviosa: abril-mayo, octubre-noviembre
        rainySeasons: ['abr-may', 'oct-nov']
      },
      fires: {
        // Mayor riesgo en temporada seca
        highRiskMonths: ['enero', 'febrero', 'marzo', 'julio', 'agosto']
      }
    };
  }

  /**
   * Calcula ventanas de riesgo
   */
  private calculateRiskWindows(currentData: OsirisData, startDate: Date, duration: number): Array<{from: Date, to: Date, reason: string}> {
    const riskWindows = [];
    const startTimestamp = startDate.getTime();
    const endTimestamp = startTimestamp + duration * 24 * 60 * 60 * 1000;
    
    // Si hay terremotos significativos recientes, ventana de riesgo
    const significantQuakes = currentData.earthquakes.filter(eq => eq.magnitude >= 4.5);
    if (significantQuakes.length > 0) {
      const lastQuake = significantQuakes[0];
      const quakeTime = new Date(lastQuake.time).getTime();
      const riskEnd = quakeTime + 24 * 60 * 60 * 1000; // 24h después
      
      if (riskEnd > startTimestamp && riskEnd < endTimestamp) {
        riskWindows.push({
          from: new Date(quakeTime),
          to: new Date(riskEnd),
          reason: `Actividad sísmica reciente (M${lastQuake.magnitude})`
        });
      }
    }
    
    // Si hay clima severo activo
    const severeWeather = currentData.weather.filter(w => w.severity === 'high');
    if (severeWeather.length > 0) {
      riskWindows.push({
        from: new Date(startTimestamp),
        to: new Date(startTimestamp + 6 * 60 * 60 * 1000), // 6h de riesgo
        reason: 'Clima severo activo en la región'
      });
    }
    
    // Si hay incendios cercanos
    const nearbyFires = currentData.fires.filter(f => this.calculateDistance(f.lat, f.lng, SALENTO_COORDS.lat, SALENTO_COORDS.lng) < 100);
    if (nearbyFires.length > 0) {
      riskWindows.push({
        from: new Date(startTimestamp),
        to: new Date(endTimestamp),
        reason: 'Incendios forestales en región cercana'
      });
    }
    
    return riskWindows;
  }

  /**
   * Calcula ventanas seguras
   */
  private calculateSafeWindows(startDate: Date, duration: number, riskWindows: Array<{from: Date, to: Date, reason: string}>): Array<{from: Date, to: Date}> {
    if (riskWindows.length === 0) {
      return [{ from: startDate, to: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000) }];
    }
    
    // Intersección negativa: momentos que NO están en ventanas de riesgo
    const safeWindows = [];
    const startTimestamp = startDate.getTime();
    const endTimestamp = startTimestamp + duration * 24 * 60 * 60 * 1000;
    
    let currentStart = startTimestamp;
    
    riskWindows.sort((a, b) => a.from.getTime() - b.from.getTime());
    
    for (const risk of riskWindows) {
      if (risk.from.getTime() > currentStart) {
        safeWindows.push({
          from: new Date(currentStart),
          to: new Date(risk.from.getTime())
        });
      }
      currentStart = Math.max(currentStart, risk.to.getTime());
    }
    
    if (currentStart < endTimestamp) {
      safeWindows.push({
        from: new Date(currentStart),
        to: new Date(endTimestamp)
      });
    }
    
    return safeWindows;
  }

  /**
   * Calcula confianza de la predicción
   */
  private calculateConfidence(currentData: OsirisData): number {
    let confidence = 0.7; // Base
    
    // Más datos = más confianza
    if (currentData.earthquakes.length > 0) confidence += 0.1;
    if (currentData.weather.length > 0) confidence += 0.1;
    if (currentData.airQuality) confidence += 0.05;
    
    // Datos frescos = más confianza
    const lastUpdate = new Date(currentData.lastUpdate);
    const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate < 1) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  /**
   * Identifica factores principales
   */
  private identifyFactors(currentData: OsirisData, historicalPatterns: any): string[] {
    const factors = [];
    
    if (currentData.earthquakes.some(eq => eq.magnitude >= 4.0)) {
      factors.push('Actividad sísmica moderada en la región');
    }
    
    if (currentData.weather.some(w => w.severity === 'high')) {
      factors.push('Condiciones climáticas adversas');
    }
    
    if (currentData.airQuality && currentData.airQuality.aqi > 100) {
      factors.push('Calidad del aire moderada');
    }
    
    if (currentData.fires.length > 0) {
      factors.push('Incendios forestales reportados');
    }
    
    if (factors.length === 0) {
      factors.push('Condiciones ambientales favorables');
    }
    
    return factors;
  }

  /**
   * Obtiene condiciones ideales por actividad
   */
  private getActivityConditions(activity: string): any {
    const activities: any = {
      'cabalgatas': {
        idealConditions: { weather: 'clear', airQuality: 'good', seismic: 'low' },
        riskFactors: ['rain', 'high_seismic', 'poor_visibility'],
        description: 'Actividades ecuestres en Valle de Cocora'
      },
      'senderismo': {
        idealConditions: { weather: 'clear', visibility: 'high', seismic: 'low' },
        riskFactors: ['rain', 'fog', 'landslides', 'high_seismic'],
        description: 'Caminatas y senderismo'
      },
      'tour_cafe': {
        idealConditions: { weather: 'any', airQuality: 'moderate' },
        riskFactors: ['extreme_heat'],
        description: 'Tour cafetero bajo techo'
      },
      'visita_pueblo': {
        idealConditions: { weather: 'any' },
        riskFactors: ['extreme_weather'],
        description: 'Visita al pueblo de Salento'
      },
      'fotografia': {
        idealConditions: { weather: 'clear', visibility: 'high' },
        riskFactors: ['rain', 'fog'],
        description: 'Fotografía de paisajes'
      }
    };
    
    return activities[activity] || activities['visita_pueblo'];
  }

  /**
   * Encuentra mejores meses según condiciones
   */
  private findBestMonths(conditions: any, patterns: any): string[] {
    // Basado en patrones históricos de Salento
    const allMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Temporada seca (mejor para actividades al aire libre)
    const drySeasonMonths = ['Enero', 'Febrero', 'Marzo', 'Julio', 'Agosto', 'Diciembre'];
    
    if (conditions.idealConditions.weather === 'clear') {
      return drySeasonMonths;
    }
    
    return allMonths;
  }

  /**
   * Encuentra mejores horas del día
   */
  private findBestHours(conditions: any): string[] {
    if (conditions.idealConditions.weather === 'clear') {
      return ['6:00 AM - 10:00 AM', '3:00 PM - 6:00 PM'];
    }
    
    return ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'];
  }

  /**
   * Encuentra períodos a evitar
   */
  private findAvoidPeriods(conditions: any, patterns: any): string[] {
    const avoid = [];
    
    if (conditions.idealConditions.weather === 'clear') {
      avoid.push('Temporada de lluvias (abril-mayo, octubre-noviembre)');
    }
    
    if (conditions.riskFactors.includes('high_seismic')) {
      avoid.push('Períodos de alta actividad sísmica histórica');
    }
    
    return avoid;
  }

  /**
   * Genera razón de recomendación
   */
  private generateTimeRecommendationReason(conditions: any, currentData: OsirisData): string {
    const reasons = [];
    
    if (currentData.weather.some(w => w.severity === 'low')) {
      reasons.push('Clima actual favorable');
    }
    
    if (currentData.earthquakes.every(eq => eq.magnitude < 4.0)) {
      reasons.push('Actividad sísmica baja');
    }
    
    if (currentData.airQuality && currentData.airQuality.aqi <= 50) {
      reasons.push('Excelente calidad del aire');
    }
    
    return reasons.join('. ') || 'Condiciones generales favorables';
  }

  /**
   * Evalúa riesgo sísmico
   */
  private assessSeismicRisk(earthquakes: any[]): { level: string; probability: number } {
    const significant = earthquakes.filter(eq => eq.magnitude >= 4.0);
    
    if (significant.length === 0) {
      return { level: 'none', probability: 0.1 };
    }
    
    if (significant.some(eq => eq.magnitude >= 5.0)) {
      return { level: 'high', probability: 0.7 };
    }
    
    return { level: 'moderate', probability: 0.4 };
  }

  /**
   * Evalúa riesgo climático
   */
  private assessWeatherRisk(weather: any[]): { level: string; probability: number } {
    const severe = weather.filter(w => w.severity === 'high');
    
    if (severe.length === 0) {
      return { level: 'none', probability: 0.2 };
    }
    
    return { level: 'high', probability: 0.6 };
  }

  /**
   * Evalúa riesgo de incendios
   */
  private assessFireRisk(fires: any[]): { level: string; probability: number } {
    const nearby = fires.filter(f => this.calculateDistance(f.lat, f.lng, SALENTO_COORDS.lat, SALENTO_COORDS.lng) < 100);
    
    if (nearby.length === 0) {
      return { level: 'none', probability: 0.1 };
    }
    
    if (nearby.some(f => f.distance < 50)) {
      return { level: 'high', probability: 0.5 };
    }
    
    return { level: 'moderate', probability: 0.3 };
  }

  /**
   * Calcula riesgo general
   */
  private calculateOverallRisk(risks: any[]): 'low' | 'moderate' | 'high' {
    if (risks.length === 0) return 'low';
    
    const hasHigh = risks.some(r => r.level === 'high');
    const hasModerate = risks.some(r => r.level === 'moderate');
    
    if (hasHigh) return 'high';
    if (hasModerate) return 'moderate';
    return 'low';
  }

  /**
   * Calcula distancia entre dos puntos (Haversine)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

// Exportar instancia singleton
export default new TourismPredictor();
