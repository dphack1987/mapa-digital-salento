/**
 * ItineraryGenerator - Generador de itinerarios adaptativos (Fase 3)
 * Genera itinerarios basados en condiciones actuales y preferencias del usuario
 */
import osirisDataService from './osirisDataService';
import osirisTourismEngine from './osirisTourismEngine';
import tourismPredictor from './tourismPredictor';
import { OsirisData, AdaptiveItinerary } from './osirisTypes';

interface UserPreferences {
  outdoorPreference: boolean;
  adventureLevel: 'low' | 'medium' | 'high';
  groupType: 'solo' | 'couple' | 'family' | 'group';
  duration: number; // horas
}

/**
 * Servicio de generación de itinerarios
 */
class ItineraryGenerator {
  /**
   * Genera itinerario adaptado a condiciones actuales
   */
  async generateAdaptiveItinerary(
    preferences: UserPreferences,
    currentConditions: OsirisData
  ): Promise<AdaptiveItinerary> {
    const itinerary = [];
    
    // Analizar condiciones actuales
    const seismicActivity = this.assessSeismicActivity(currentConditions.earthquakes);
    const weatherConditions = this.assessWeatherConditions(currentConditions.weather);
    const airQuality = this.assessAirQuality(currentConditions.airQuality);
    
    // Generar actividades según condiciones
    itinerary.push(...this.generateMorningActivities(preferences, seismicActivity, weatherConditions, airQuality));
    itinerary.push(...this.generateAfternoonActivities(preferences, seismicActivity, weatherConditions, airQuality));
    itinerary.push(...this.generateEveningActivities(preferences, seismicActivity, weatherConditions, airQuality));
    
    // Generar alternativas
    const alternatives = this.generateAlternatives(preferences, currentConditions);
    
    // Calcular score de riesgo total
    const totalRiskScore = this.calculateRiskScore(itinerary, currentConditions);
    
    return {
      day: itinerary,
      alternatives,
      totalRiskScore
    };
  }

  /**
   * Genera itinerario optimizado para el día siguiente
   */
  async generateTomorrowItinerary(preferences: UserPreferences): Promise<AdaptiveItinerary> {
    try {
      // Obtener predicción de riesgo para mañana
      const riskPrediction = await tourismPredictor.predictRiskForPeriod(1);
      
      // Obtener condiciones actuales como base
      const currentConditions = await osirisDataService.getExpandedSalentoData();
      
      // Ajustar condiciones según predicción
      const adjustedConditions = this.adjustConditionsBasedOnPrediction(currentConditions, riskPrediction);
      
      return await this.generateAdaptiveItinerary(preferences, adjustedConditions);
    } catch (error) {
      console.error('Error generating tomorrow itinerary:', error);
      // Fallback a itinerario genérico
      return this.generateGenericItinerary(preferences);
    }
  }

  /**
   * Genera itinerario para múltiples días
   */
  async generateMultiDayItinerary(
    preferences: UserPreferences,
    days: number
  ): Promise<{ day: number; itinerary: AdaptiveItinerary }[]> {
    const multiDayItinerary = [];
    
    for (let i = 0; i < days; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + i);
      
      try {
        const riskPrediction = await tourismPredictor.predictRiskForPeriod(1);
        const currentConditions = await osirisDataService.getExpandedSalentoData();
        const adjustedConditions = this.adjustConditionsBasedOnPrediction(currentConditions, riskPrediction);
        
        const itinerary = await this.generateAdaptiveItinerary(preferences, adjustedConditions);
        multiDayItinerary.push({ day: i + 1, itinerary });
      } catch (error) {
        console.error(`Error generating itinerary for day ${i + 1}:`, error);
        multiDayItinerary.push({ day: i + 1, itinerary: this.generateGenericItinerary(preferences) });
      }
    }
    
    return multiDayItinerary;
  }

  /**
   * Reajusta itinerario si cambian las condiciones
   */
  async reajustItinerary(
    currentItinerary: AdaptiveItinerary,
    newConditions: OsirisData
  ): Promise<AdaptiveItinerary> {
    // Evaluar si las nuevas condiciones invalidan actividades actuales
    const invalidActivities = currentItinerary.day.filter(item => {
      return this.isActivityInvalid(item.activity, newConditions);
    });
    
    if (invalidActivities.length === 0) {
      return currentItinerary; // No necesita reajuste
    }
    
    // Regenerar itinerario con nuevas condiciones
    const preferences = this.inferPreferencesFromItinerary(currentItinerary);
    return await this.generateAdaptiveItinerary(preferences, newConditions);
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Genera actividades de la mañana
   */
  private generateMorningActivities(
    preferences: UserPreferences,
    seismicActivity: any,
    weatherConditions: any,
    airQuality: any
  ): Array<{time: string; activity: string; reason: string; priority: 'high' | 'medium' | 'low'}> {
    const activities = [];
    
    // Si hay actividad sísmica alta, priorizar actividades urbanas
    if (seismicActivity.level === 'high') {
      activities.push({
        time: 'mañana',
        activity: 'Visita al pueblo de Salento',
        reason: 'Actividad sísmica detectada - actividades urbanas recomendadas',
        priority: 'high' as const
      });
      activities.push({
        time: 'mañana',
        activity: 'Tour cafetero en el pueblo',
        reason: 'Actividad bajo techo segura',
        priority: 'high' as const
      });
      return activities;
    }
    
    // Si el clima es bueno, actividades al aire libre
    if (weatherConditions.level === 'low' && preferences.outdoorPreference) {
      if (preferences.adventureLevel === 'high') {
        activities.push({
          time: 'mañana',
          activity: 'Caminata temprano a Valle de Cocora',
          reason: 'Clima favorable para actividades al aire libre',
          priority: 'high' as const
        });
      } else {
        activities.push({
          time: 'mañana',
          activity: 'Visita guiada a miradores',
          reason: 'Clima favorable para vistas panorámicas',
          priority: 'medium' as const
        });
      }
    }
    
    // Actividades siempre disponibles
    activities.push({
      time: 'mañana',
      activity: 'Desayuno tradicional en el pueblo',
      reason: 'Experiencia gastronómica local',
      priority: 'medium' as const
    });
    
    return activities;
  }

  /**
   * Genera actividades de la tarde
   */
  private generateAfternoonActivities(
    preferences: UserPreferences,
    seismicActivity: any,
    weatherConditions: any,
    airQuality: any
  ): Array<{time: string; activity: string; reason: string; priority: 'high' | 'medium' | 'low'}> {
    const activities = [];
    
    // Si la calidad del aire es mala, actividades bajo techo
    if (airQuality.level === 'high') {
      activities.push({
        time: 'tarde',
        activity: 'Tour cafetero bajo techo',
        reason: 'Calidad del aire moderada - actividades interiores recomendadas',
        priority: 'high' as const
      });
      activities.push({
        time: 'tarde',
        activity: 'Visita a museos locales',
        reason: 'Actividad interior con aire filtrado',
        priority: 'medium' as const
      });
      return activities;
    }
    
    // Si hay lluvia, actividades bajo techo
    if (weatherConditions.level === 'moderate' || weatherConditions.level === 'high') {
      activities.push({
        time: 'tarde',
        activity: 'Taller de artesanías',
        reason: 'Actividad bajo techo durante lluvia',
        priority: 'medium' as const
      });
      activities.push({
        time: 'tarde',
        activity: 'Cata de café en cafetería local',
        reason: 'Experiencia interior recomendada',
        priority: 'medium' as const
      });
      return activities;
    }
    
    // Si el clima es bueno y el usuario prefiere outdoor
    if (weatherConditions.level === 'low' && preferences.outdoorPreference) {
      if (preferences.adventureLevel === 'high') {
        activities.push({
          time: 'tarde',
          activity: 'Cabalgata en Valle de Cocora',
          reason: 'Clima favorable para actividad ecuestre',
          priority: 'high' as const
        });
      } else {
        activities.push({
          time: 'tarde',
          activity: 'Paseo en Jeep Willys por el valle',
          reason: 'Experiencia tradicional con vistas panorámicas',
          priority: 'medium' as const
        });
      }
    }
    
    return activities;
  }

  /**
   * Genera actividades de la noche
   */
  private generateEveningActivities(
    preferences: UserPreferences,
    seismicActivity: any,
    weatherConditions: any,
    airQuality: any
  ): Array<{time: string; activity: string; reason: string; priority: 'high' | 'medium' | 'low'}> {
    const activities = [];
    
    // Actividades nocturnas siempre seguras
    if (preferences.groupType === 'couple' || preferences.groupType === 'solo') {
      activities.push({
        time: 'noche',
        activity: 'Cena en restaurante con vista',
        reason: 'Experiencia gastronómica nocturna',
        priority: 'medium' as const
      });
    } else if (preferences.groupType === 'family') {
      activities.push({
        time: 'noche',
        activity: 'Cena familiar en plaza principal',
        reason: 'Ambiente familiar acogedor',
        priority: 'medium' as const
      });
    } else {
      activities.push({
        time: 'noche',
        activity: 'Experiencia nocturna en grupo',
        reason: 'Actividad grupal recomendada',
        priority: 'medium' as const
      });
    }
    
    return activities;
  }

  /**
   * Genera alternativas
   */
  private generateAlternatives(preferences: UserPreferences, conditions: OsirisData): string[] {
    const alternatives = [];
    
    // Alternativas si hay riesgo sísmico
    if (conditions.earthquakes.some(eq => eq.magnitude >= 4.0)) {
      alternatives.push('Tour completo del pueblo de Salento');
      alternatives.push('Visita a haciendas cafeteras cercanas');
      alternatives.push('Experiencia gastronómica local');
    }
    
    // Alternativas si hay mal clima
    if (conditions.weather.some(w => w.severity === 'high')) {
      alternatives.push('Museo de cultura cafetera');
      alternatives.push('Taller de artesanías');
      alternatives.push('Degustación de café especializado');
    }
    
    // Alternativas según preferencias
    if (preferences.adventureLevel === 'low') {
      alternatives.push('Paseo relajado por el pueblo');
      alternatives.push('Visita a galerías de arte');
    }
    
    return alternatives;
  }

  /**
   * Calcula score de riesgo total
   */
  private calculateRiskScore(itinerary: any[], conditions: OsirisData): number {
    let score = 0;
    
    // Riesgo sísmico
    const maxQuake = conditions.earthquakes.reduce((max, eq) => Math.max(max, eq.magnitude), 0);
    if (maxQuake >= 5.0) score += 5;
    else if (maxQuake >= 4.0) score += 3;
    else if (maxQuake >= 3.0) score += 1;
    
    // Riesgo climático
    const severeWeather = conditions.weather.filter(w => w.severity === 'high').length;
    score += severeWeather * 2;
    
    // Riesgo de calidad del aire
    if (conditions.airQuality && conditions.airQuality.aqi > 150) score += 3;
    else if (conditions.airQuality && conditions.airQuality.aqi > 100) score += 1;
    
    // Riesgo de incendios
    const nearbyFires = conditions.fires.filter(f => this.calculateDistance(f.lat, f.lng, 4.636, -75.567) < 100).length;
    score += nearbyFires * 2;
    
    return Math.min(score, 10); // Máximo 10
  }

  /**
   * Evalúa actividad sísmica
   */
  private assessSeismicActivity(earthquakes: any[]): { level: string; maxMagnitude: number } {
    const maxMagnitude = earthquakes.reduce((max, eq) => Math.max(max, eq.magnitude), 0);
    
    if (maxMagnitude >= 5.0) return { level: 'high', maxMagnitude };
    if (maxMagnitude >= 4.0) return { level: 'moderate', maxMagnitude };
    if (maxMagnitude >= 3.0) return { level: 'low', maxMagnitude };
    return { level: 'none', maxMagnitude };
  }

  /**
   * Evalúa condiciones climáticas
   */
  private assessWeatherConditions(weather: any[]): { level: string; conditions: string[] } {
    const severe = weather.filter(w => w.severity === 'high');
    const moderate = weather.filter(w => w.severity === 'moderate');
    
    if (severe.length > 0) return { level: 'high', conditions: severe.map(w => w.event) };
    if (moderate.length > 0) return { level: 'moderate', conditions: moderate.map(w => w.event) };
    return { level: 'low', conditions: [] };
  }

  /**
   * Evalúa calidad del aire
   */
  private assessAirQuality(airQuality: any): { level: string; aqi: number } {
    if (!airQuality) return { level: 'none', aqi: 0 };
    
    if (airQuality.aqi > 150) return { level: 'high', aqi: airQuality.aqi };
    if (airQuality.aqi > 100) return { level: 'moderate', aqi: airQuality.aqi };
    return { level: 'low', aqi: airQuality.aqi };
  }

  /**
   * Ajusta condiciones basado en predicción
   */
  private adjustConditionsBasedOnPrediction(conditions: OsirisData, prediction: any): OsirisData {
    // Si la predicción indica alto riesgo, marcar condiciones para reflejarlo
    // No modificamos el array de weather directamente, solo usamos la predicción
    return conditions;
  }

  /**
   * Genera itinerario genérico
   */
  private generateGenericItinerary(preferences: UserPreferences): AdaptiveItinerary {
    return {
      day: [
        {
          time: 'mañana',
          activity: 'Visita al pueblo de Salento',
          reason: 'Itinerario genérico',
          priority: 'medium'
        },
        {
          time: 'tarde',
          activity: 'Tour cafetero',
          reason: 'Itinerario genérico',
          priority: 'medium'
        },
        {
          time: 'noche',
          activity: 'Cena en restaurante local',
          reason: 'Itinerario genérico',
          priority: 'medium'
        }
      ],
      alternatives: ['Visita a miradores', 'Paseo en Jeep Willys'],
      totalRiskScore: 2
    };
  }

  /**
   * Infiere preferencias desde itinerario existente
   */
  private inferPreferencesFromItinerary(itinerary: AdaptiveItinerary): UserPreferences {
    const outdoorActivities = itinerary.day.filter(item =>
      item.activity.includes('Valle') || item.activity.includes('mirador') || item.activity.includes('Cabalgata')
    );
    
    return {
      outdoorPreference: outdoorActivities.length > 0,
      adventureLevel: outdoorActivities.length > 1 ? 'high' : 'medium',
      groupType: 'solo',
      duration: 8
    };
  }

  /**
   * Verifica si una actividad es inválida según condiciones
   */
  private isActivityInvalid(activity: string, conditions: OsirisData): boolean {
    // Si hay terremotos significativos, actividades al aire libre son inválidas
    if (conditions.earthquakes.some(eq => eq.magnitude >= 4.5)) {
      if (activity.includes('Valle') || activity.includes('Cabalgata') || activity.includes('Caminata')) {
        return true;
      }
    }
    
    // Si hay clima severo, actividades al aire libre son inválidas
    if (conditions.weather.some(w => w.severity === 'high')) {
      if (activity.includes('Valle') || activity.includes('mirador') || activity.includes('Cabalgata')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Calcula distancia entre dos puntos
   */
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
}

// Exportar instancia singleton
export default new ItineraryGenerator();
