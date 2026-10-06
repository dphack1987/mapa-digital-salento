/**
 * Extensión de Don Chucho con datos de OSIRIS AI
 * Este archivo enriches las respuestas de Don Chucho con datos sísmicos y climáticos en tiempo real
 * NO modifica el archivo original donChuchoKnowledge.ts
 * Fase 2: Transformación Turística - Consultas turísticas mejoradas
 */
import osirisDataService from './osirisDataService';
import osirisOfflineService from './osirisOfflineService';
import osirisTourismEngine from './osirisTourismEngine';
import tourismPredictor from './tourismPredictor';

/**
 * Respuestas de Don Chucho potenciadas con datos de OSIRIS
 */
export const OsirisEnhancedResponses = {
  /**
   * Preguntas sobre seguridad sísmica
   */
  seguridad: async (language: string = 'es') => {
    try {
      const earthquakes = await osirisDataService.getEarthquakesNearSalento();
      const significant = earthquakes.filter(eq => eq.magnitude >= 4.0);

      const responses = {
        es: significant.length === 0
          ? "✅ Según datos sísmicos en tiempo real de OSIRIS, no hay actividad sísmica significativa en la región de Salento. Es seguro visitar. Última verificación: hace menos de 10 minutos."
          : `⚠️ Se han registrado ${significant.length} evento${significant.length > 1 ? 's' : ''} sísmico${significant.length > 1 ? 's' : ''} recientes en la región. El más reciente fue de magnitud ${significant[0].magnitude.toFixed(1)} en ${significant[0].place}. Se recomienda precaución pero no es motivo de cancelar viajes.`,
        en: significant.length === 0
          ? "✅ According to real-time seismic data from OSIRIS, there is no significant seismic activity in the Salento region. It is safe to visit. Last check: less than 10 minutes ago."
          : `⚠️ ${significant.length} recent seismic event${significant.length > 1 ? 's' : ''} ha${significant.length > 1 ? 've' : 's'} been recorded in the region. The most recent was magnitude ${significant[0].magnitude.toFixed(1)} in ${significant[0].place}. Caution is recommended but not a reason to cancel trips.`,
        de: significant.length === 0
          ? "✅ Laut Echtzeit-Seismikdaten von OSIRIS gibt es keine signifikante seismische Aktivität in der Region Salento. Es ist sicher zu besuchen. Letzte Prüfung: vor weniger als 10 Minuten."
          : `⚠️ ${significant.length} kürzliche seismische Ereignis${significant.length > 1 ? 'se' : ''} wurden in der Region registriert. Das jüngste hatte eine Stärke von ${significant[0].magnitude.toFixed(1)} in ${significant[0].place}. Vorsicht wird empfohlen, aber kein Grund, Reisen abzusagen.`,
        fr: significant.length === 0
          ? "✅ Selon les données sismiques en temps réel d'OSIRIS, il n'y a pas d'activité sismique significative dans la région de Salento. Il est sûr de visiter. Dernière vérification: il y a moins de 10 minutes."
          : `⚠️ ${significant.length} événement${significant.length > 1 ? 's' : ''} sismique${significant.length > 1 ? 's' : ''} récent${significant.length > 1 ? 's' : ''} ont été enregistrés dans la région. Le plus récent était de magnitude ${significant[0].magnitude.toFixed(1)} à ${significant[0].place}. La prudence est recommandée mais ce n'est pas une raison d'annuler les voyages.`,
        pt: significant.length === 0
          ? "✅ De acordo com dados sísmicos em tempo real da OSIRIS, não há atividade sísmica significativa na região de Salento. É seguro visitar. Última verificação: há menos de 10 minutos."
          : `⚠️ ${significant.length} evento${significant.length > 1 ? 's' : ''} sísmico${significant.length > 1 ? 's' : ''} recente${significant.length > 1 ? 's' : ''} foram registrados na região. O mais recente foi de magnitude ${significant[0].magnitude.toFixed(1)} em ${significant[0].place}. Recomenda-se cautela, mas não é motivo para cancelar viagens.`,
        it: significant.length === 0
          ? "✅ Secondo i dati sismici in tempo reale di OSIRIS, non c'è attività sismica significativa nella regione di Salento. È sicuro visitare. Ultimo controllo: meno di 10 minuti fa."
          : `⚠️ ${significant.length} recente${significant.length > 1 ? 'i' : ''} eventi sismici sono stati registrati nella regione. Il più recente era di magnitudo ${significant[0].magnitude.toFixed(1)} a ${significant[0].place}. Si raccomanda cautela ma non è un motivo per annullare i viaggi.`
      };

      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching earthquake data for Don Chucho:', error);
      return "No pude obtener datos sísmicos en este momento. Por favor intenta más tarde.";
    }
  },

  /**
   * Preguntas sobre clima
   */
  clima: async (language: string = 'es') => {
    try {
      const weather = await osirisDataService.getWeatherForRegion();

      if (weather.length === 0) {
        const responses = {
          es: "🌤️ No hay alertas climáticas activas en la región. El clima es favorable para actividades al aire libre.",
          en: "🌤️ No active weather alerts in the region. Weather is favorable for outdoor activities.",
          de: "🌤️ Keine aktiven Wetterwarnungen in der Region. Das Wetter ist günstig für Outdoor-Aktivitäten.",
          fr: "🌤️ Aucune alerte météorologique active dans la région. Le temps est favorable aux activités de plein air.",
          pt: "🌤️ Não há alertas climáticas ativas na região. O clima é favorável para atividades ao ar livre.",
          it: "🌤️ Nessun avviso meteorologico attivo nella regione. Il tempo è favorevole per le attività all'aperto."
        };
        return responses[language as keyof typeof responses] || responses.es;
      }

      const latestEvent = weather[0];
      const responses = {
        es: `🌤️ El clima actual en la región: ${latestEvent.event} - ${latestEvent.description}. Severidad: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Se recomienda precaución para actividades al aire libre.' : 'Es favorable para turismo.'}`,
        en: `🌤️ Current weather in the region: ${latestEvent.event} - ${latestEvent.description}. Severity: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Caution recommended for outdoor activities.' : 'Favorable for tourism.'}`,
        de: `🌤️ Aktuelles Wetter in der Region: ${latestEvent.event} - ${latestEvent.description}. Schwere: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Vorsicht für Outdoor-Aktivitäten empfohlen.' : 'Günstig für Tourismus.'}`,
        fr: `🌤️ Météo actuelle dans la région: ${latestEvent.event} - ${latestEvent.description}. Gravité: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Prudence recommandée pour les activités de plein air.' : 'Favorable pour le tourisme.'}`,
        pt: `🌤️ Clima atual na região: ${latestEvent.event} - ${latestEvent.description}. Severidade: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Recomenda-se cautela para atividades ao ar livre.' : 'Favorável para turismo.'}`,
        it: `🌤️ Meteo attuale nella regione: ${latestEvent.event} - ${latestEvent.description}. Gravità: ${latestEvent.severity}. ${latestEvent.severity === 'high' || latestEvent.severity === 'extreme' ? 'Cautela raccomandata per attività all\'aperto.' : 'Favorabile per il turismo.'}`
      };

      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching weather data for Don Chucho:', error);
      return "No pude obtener datos climáticos en este momento. Por favor intenta más tarde.";
    }
  },

  /**
   * Preguntas sobre calidad del aire
   */
  calidadAire: async (language: string = 'es') => {
    try {
      const airQuality = await osirisDataService.getAirQuality();

      if (!airQuality) {
        const responses = {
          es: "💨 No hay datos de calidad del aire disponibles en este momento.",
          en: "💨 Air quality data not available at this time.",
          de: "💨 Luftqualitätsdaten derzeit nicht verfügbar.",
          fr: "💨 Données sur la qualité de l'air non disponibles pour le moment.",
          pt: "💨 Dados de qualidade do ar não disponíveis neste momento.",
          it: "💨 Dati sulla qualità dell'aria non disponibili al momento."
        };
        return responses[language as keyof typeof responses] || responses.es;
      }

      const aqiStatus = airQuality.aqi <= 50 ? 'buena' : airQuality.aqi <= 100 ? 'moderada' : 'no saludable';
      const responses = {
        es: `💨 Calidad del aire: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Es seguro para actividades al aire libre.' : 'Se recomienda precaución para personas sensibles.'}`,
        en: `💨 Air quality: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Safe for outdoor activities.' : 'Caution recommended for sensitive individuals.'}`,
        de: `💨 Luftqualität: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Sicher für Outdoor-Aktivitäten.' : 'Vorsicht für empfindliche Personen empfohlen.'}`,
        fr: `💨 Qualité de l'air: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Sûr pour les activités de plein air.' : 'Prudence recommandée pour les personnes sensibles.'}`,
        pt: `💨 Qualidade do ar: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Seguro para atividades ao ar livre.' : 'Recomenda-se cautela para pessoas sensíveis.'}`,
        it: `💨 Qualità dell\'aria: AQI ${airQuality.aqi} (${aqiStatus}). ${airQuality.aqi <= 100 ? 'Sicuro per attività all\'aperto.' : 'Cautela raccomandata per persone sensibili.'}`
      };

      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching air quality data for Don Chucho:', error);
      return "No pude obtener datos de calidad del aire en este momento.";
    }
  },

  /**
   * Respuesta offline (cuando no hay conexión)
   */
  offlineResponse: async (language: string = 'es') => {
    try {
      const cachedData = await osirisOfflineService.getCachedData();
      const lastUpdate = osirisOfflineService.getLastUpdateFormatted();

      const significantEarthquakes = cachedData.earthquakes.filter(eq => eq.magnitude >= 4.0);

      const responses = {
        es: `📦 Modo offline - Datos cacheados (actualizados: ${lastUpdate}). Terremotos recientes: ${significantEarthquakes.length}. Clima: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'No disponible'}. Conéctate a WiFi para actualizar.`,
        en: `📦 Offline mode - Cached data (updated: ${lastUpdate}). Recent earthquakes: ${significantEarthquakes.length}. Weather: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'Not available'}. Connect to WiFi to update.`,
        de: `📦 Offline-Modus - Zwischengespeicherte Daten (aktualisiert: ${lastUpdate}). Kürzliche Erdbeben: ${significantEarthquakes.length}. Wetter: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'Nicht verfügbar'}. Verbinde dich mit WLAN zum Aktualisieren.`,
        fr: `📦 Mode hors ligne - Données en cache (mis à jour: ${lastUpdate}). Tremblements de terre récents: ${significantEarthquakes.length}. Météo: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'Non disponible'}. Connectez-vous au WiFi pour mettre à jour.`,
        pt: `📦 Modo offline - Dados em cache (atualizados: ${lastUpdate}). Terremotos recentes: ${significantEarthquakes.length}. Clima: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'Não disponível'}. Conecte-se ao WiFi para atualizar.`,
        it: `📦 Modalità offline - Dati memorizzati nella cache (aggiornati: ${lastUpdate}). Terremoti recenti: ${significantEarthquakes.length}. Meteo: ${cachedData.weather.length > 0 ? cachedData.weather[0].event : 'Non disponibile'}. Connettiti al WiFi per aggiornare.`
      };

      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching offline data for Don Chucho:', error);
      return "No hay datos cacheados disponibles.";
    }
  }
};

/**
 * Detecta si una pregunta debería usar datos de OSIRIS
 */
export function shouldUseOsirisData(query: string): boolean {
  const osirisKeywords = [
    'terremoto', 'sismo', 'sísmico', 'seismic', 'temblor',
    'clima', 'weather', 'tiempo', 'lluvia', 'tormenta',
    'calidad aire', 'air quality', 'contaminación',
    'seguridad', 'safe', 'peligro', 'danger',
    'alerta', 'warning', 'emergencia'
  ];

  const lowerQuery = query.toLowerCase();
  return osirisKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Obtiene respuesta de OSIRIS para una consulta
 */
export async function getOsirisResponse(query: string, language: string = 'es'): Promise<string | null> {
  if (!shouldUseOsirisData(query)) {
    return null;
  }

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('terremoto') || lowerQuery.includes('sismo') || lowerQuery.includes('sísmico') || lowerQuery.includes('seismic') || lowerQuery.includes('temblor')) {
    return await OsirisEnhancedResponses.seguridad(language);
  }

  if (lowerQuery.includes('clima') || lowerQuery.includes('weather') || lowerQuery.includes('tiempo') || lowerQuery.includes('lluvia') || lowerQuery.includes('tormenta')) {
    return await OsirisEnhancedResponses.clima(language);
  }

  if (lowerQuery.includes('calidad aire') || lowerQuery.includes('air quality') || lowerQuery.includes('contaminación')) {
    return await OsirisEnhancedResponses.calidadAire(language);
  }

  if (!navigator.onLine) {
    return await OsirisEnhancedResponses.offlineResponse(language);
  }

  return null;
}

/**
 * Respuestas turísticas mejoradas (Fase 2)
 * Consultas específicas para turismo con contexto OSIRIS
 */
export const TourismEnhancedResponses = {
  /**
   * "¿Qué actividades puedo hacer ahora?"
   */
  actividadesAhora: async (language: string = 'es') => {
    try {
      const weather = await osirisDataService.getWeatherForRegion();
      const activityRecommendations = osirisTourismEngine.interpretWeatherForActivities(weather);
      
      const recommended = activityRecommendations.filter(a => a.status === 'recommended').map(a => a.activity);
      const cautious = activityRecommendations.filter(a => a.status === 'cautious').map(a => a.activity);
      const notRecommended = activityRecommendations.filter(a => a.status === 'not_recommended').map(a => a.activity);
      
      const responses = {
        es: `🎯 Basado en las condiciones actuales:\n\n✅ Recomendado: ${recommended.join(', ') || 'Todas las actividades normales'}\n${cautious.length > 0 ? `⚠️ Con precaución: ${cautious.join(', ')}` : ''}\n${notRecommended.length > 0 ? `❌ No recomendado: ${notRecommended.join(', ')}` : ''}`,
        en: `🎯 Based on current conditions:\n\n✅ Recommended: ${recommended.join(', ') || 'All normal activities'}\n${cautious.length > 0 ? `⚠️ With caution: ${cautious.join(', ')}` : ''}\n${notRecommended.length > 0 ? `❌ Not recommended: ${notRecommended.join(', ')}` : ''}`
      };
      
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching tourism activities:', error);
      return "No pude obtener información de actividades en este momento.";
    }
  },

  /**
   * "¿Es seguro visitar ahora?"
   */
  seguridadTuristica: async (language: string = 'es') => {
    try {
      const data = await osirisDataService.getExpandedSalentoData();
      const alerts = osirisTourismEngine.generateTourismAlerts(data);
      
      const dangerAlerts = alerts.filter(a => a.severity === 'danger');
      const warningAlerts = alerts.filter(a => a.severity === 'warning');
      
      if (dangerAlerts.length > 0) {
        const responses = {
          es: `⚠️ No es seguro visitar en este momento. Alertas activas: ${dangerAlerts.map(a => a.title).join(', ')}. ${dangerAlerts[0].recommendation}`,
          en: `⚠️ It is not safe to visit at this time. Active alerts: ${dangerAlerts.map(a => a.title).join(', ')}. ${dangerAlerts[0].recommendation}`
        };
        return responses[language as keyof typeof responses] || responses.es;
      }
      
      if (warningAlerts.length > 0) {
        const responses = {
          es: `⚠️ Se recomienda precaución. Alertas: ${warningAlerts.map(a => a.title).join(', ')}. ${warningAlerts[0].recommendation}`,
          en: `⚠️ Caution recommended. Alerts: ${warningAlerts.map(a => a.title).join(', ')}. ${warningAlerts[0].recommendation}`
        };
        return responses[language as keyof typeof responses] || responses.es;
      }
      
      const responses = {
        es: "✅ Es seguro visitar Salento en este momento. No hay alertas activas. Las condiciones son favorables para turismo.",
        en: "✅ It is safe to visit Salento at this time. No active alerts. Conditions are favorable for tourism."
      };
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching tourism safety:', error);
      return "No pude verificar la seguridad turística en este momento.";
    }
  },

  /**
   * "¿Cómo afecta el clima mi visita?"
   */
  impactoClima: async (language: string = 'es') => {
    try {
      const weather = await osirisDataService.getWeatherForRegion();
      const activityRecommendations = osirisTourismEngine.interpretWeatherForActivities(weather);
      
      const outdoorActivities = activityRecommendations.filter(a => 
        ['Cabalgatas en Valle de Cocora', 'Caminata a Cascadas de Santa Rita', 'Visita a miradores'].includes(a.activity)
      );
      
      const responses = {
        es: `🌤️ El clima actual afecta tus actividades así:\n\n${outdoorActivities.map(a => `• ${a.activity}: ${a.status === 'recommended' ? '✅' : a.status === 'cautious' ? '⚠️' : '❌'} ${a.reason}`).join('\n')}\n\nAlternativas bajo techo: Tour cafetero, museos, restaurantes.`,
        en: `🌤️ Current weather affects your activities as follows:\n\n${outdoorActivities.map(a => `• ${a.activity}: ${a.status === 'recommended' ? '✅' : a.status === 'cautious' ? '⚠️' : '❌'} ${a.reason}`).join('\n')}\n\nIndoor alternatives: Coffee tour, museums, restaurants.`
      };
      
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching climate impact:', error);
      return "No pude obtener información del impacto climático.";
    }
  }
};

/**
 * Detecta si una pregunta es una consulta turística mejorada (Fase 2)
 */
export function isTourismQuery(query: string): boolean {
  const tourismKeywords = [
    'actividades', 'activities', 'hacer', 'visitar', 'safe',
    'seguro', 'recommend', 'recomendar', 'mejor momento',
    'impacto', 'afecta', 'clima turismo', 'weather tourism'
  ];

  const lowerQuery = query.toLowerCase();
  return tourismKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Obtiene respuesta turística mejorada de OSIRIS (Fase 2)
 */
export async function getTourismResponse(query: string, language: string = 'es'): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('actividades') || lowerQuery.includes('activities') || lowerQuery.includes('hacer')) {
    return await TourismEnhancedResponses.actividadesAhora(language);
  }

  if (lowerQuery.includes('seguro') || lowerQuery.includes('safe') || lowerQuery.includes('visitar')) {
    return await TourismEnhancedResponses.seguridadTuristica(language);
  }

  if (lowerQuery.includes('afecta') || lowerQuery.includes('impacto') || (lowerQuery.includes('clima') && lowerQuery.includes('visita'))) {
    return await TourismEnhancedResponses.impactoClima(language);
  }

  return null;
}

/**
 * Respuestas predictivas mejoradas (Fase 3)
 * Consultas de predicción con inteligencia anticipada
 */
export const PredictiveEnhancedResponses = {
  /**
   * "¿Cuál es el mejor momento para visitar?"
   */
  mejorMomentoVisitar: async (language: string = 'es') => {
    try {
      const prediction = await tourismPredictor.predictBestTimeForActivity('general');
      
      const responses = {
        es: `📅 El mejor momento para visitar Salento según datos históricos y predicciones:\n\n✅ Mejores meses: ${prediction.bestMonths.slice(0, 4).join(', ')}\n⏰ Mejores horas: ${prediction.bestHours[0]}\n⚠️ Evitar: ${prediction.avoidPeriods.join(', ')}\n\n${prediction.reason}`,
        en: `📅 The best time to visit Salento based on historical data and predictions:\n\n✅ Best months: ${prediction.bestMonths.slice(0, 4).join(', ')}\n⏰ Best hours: ${prediction.bestHours[0]}\n⚠️ Avoid: ${prediction.avoidPeriods.join(', ')}\n\n${prediction.reason}`
      };
      
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching best time prediction:', error);
      return "No pude obtener predicciones del mejor momento para visitar.";
    }
  },

  /**
   * "¿Cómo estará el clima mañana?"
   */
  prediccionClima: async (language: string = 'es') => {
    try {
      const riskPrediction = await tourismPredictor.predictRiskForPeriod(1);
      
      const riskLabels = {
        low: 'bajo',
        moderate: 'moderado',
        high: 'alto'
      };
      
      const responses = {
        es: `🌤️ Predicción para las próximas 24 horas:\n\nRiesgo general: ${riskLabels[riskPrediction.overallRisk as keyof typeof riskLabels]}\n\n${riskPrediction.risks.map((r: any) => `• ${r.type}: ${r.level} (${Math.round(r.probability * 100)}%)`).join('\n')}\n\n${riskPrediction.overallRisk === 'low' ? '✅ Condiciones favorables para actividades al aire libre.' : riskPrediction.overallRisk === 'moderate' ? '⚠️ Condiciones moderadas - considerar alternativas bajo techo.' : '⚠️ Condiciones adversas - priorizar actividades urbanas.'}`,
        en: `🌤️ Prediction for the next 24 hours:\n\nOverall risk: ${riskPrediction.overallRisk}\n\n${riskPrediction.risks.map((r: any) => `• ${r.type}: ${r.level} (${Math.round(r.probability * 100)}%)`).join('\n')}\n\n${riskPrediction.overallRisk === 'low' ? '✅ Favorable conditions for outdoor activities.' : riskPrediction.overallRisk === 'moderate' ? '⚠️ Moderate conditions - consider indoor alternatives.' : '⚠️ Adverse conditions - prioritize urban activities.'}`
      };
      
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching climate prediction:', error);
      return "No pude obtener predicciones climáticas.";
    }
  },

  /**
   * "¿Es seguro visitar la próxima semana?"
   */
  prediccionSeguridad: async (language: string = 'es') => {
    try {
      const riskPrediction = await tourismPredictor.predictRiskForPeriod(7);
      
      const responses = {
        es: riskPrediction.overallRisk === 'low' 
          ? `✅ Sí, es seguro visitar la próxima semana según predicciones. Riesgo general bajo.\n\nFactores: ${riskPrediction.risks.length > 0 ? riskPrediction.risks.map((r: any) => r.type).join(', ') : 'Sin factores de riesgo significativos'}.`
          : riskPrediction.overallRisk === 'moderate'
          ? `⚠️ Se recomienda precaución para la próxima semana. Riesgo general moderado.\n\nFactores: ${riskPrediction.risks.map((r: any) => `${r.type} (${Math.round(r.probability * 100)}%)`).join(', ')}.`
          : `⚠️ No es recomendable visitar la próxima semana según predicciones. Riesgo general alto.\n\nFactores: ${riskPrediction.risks.map((r: any) => `${r.type} (${Math.round(r.probability * 100)}%)`).join(', ')}.`,
        en: riskPrediction.overallRisk === 'low'
          ? `✅ Yes, it is safe to visit next week according to predictions. Overall low risk.\n\nFactors: ${riskPrediction.risks.length > 0 ? riskPrediction.risks.map((r: any) => r.type).join(', ') : 'No significant risk factors'}.`
          : riskPrediction.overallRisk === 'moderate'
          ? `⚠️ Caution recommended for next week. Overall moderate risk.\n\nFactors: ${riskPrediction.risks.map((r: any) => `${r.type} (${Math.round(r.probability * 100)}%)`).join(', ')}.`
          : `⚠️ Not recommended to visit next week according to predictions. Overall high risk.\n\nFactors: ${riskPrediction.risks.map((r: any) => `${r.type} (${Math.round(r.probability * 100)}%)`).join(', ')}.`
      };
      
      return responses[language as keyof typeof responses] || responses.es;
    } catch (error) {
      console.error('Error fetching safety prediction:', error);
      return "No pude obtener predicciones de seguridad.";
    }
  }
};

/**
 * Detecta si una pregunta es una consulta predictiva (Fase 3)
 */
export function isPredictiveQuery(query: string): boolean {
  const predictiveKeywords = [
    'mejor momento', 'best time', 'cuándo', 'when',
    'predicción', 'prediction', 'mañana', 'tomorrow',
    'próxima semana', 'next week', 'futuro', 'future',
    'será', 'will be', 'estará', 'anticipado'
  ];

  const lowerQuery = query.toLowerCase();
  return predictiveKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Obtiene respuesta predictiva de OSIRIS (Fase 3)
 */
export async function getPredictiveResponse(query: string, language: string = 'es'): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('mejor momento') || lowerQuery.includes('best time') || lowerQuery.includes('cuándo')) {
    return await PredictiveEnhancedResponses.mejorMomentoVisitar(language);
  }

  if (lowerQuery.includes('mañana') || lowerQuery.includes('tomorrow') || (lowerQuery.includes('clima') && (lowerQuery.includes('será') || lowerQuery.includes('estará')))) {
    return await PredictiveEnhancedResponses.prediccionClima(language);
  }

  if (lowerQuery.includes('próxima semana') || lowerQuery.includes('next week') || (lowerQuery.includes('seguro') && (lowerQuery.includes('futuro') || lowerQuery.includes('semana')))) {
    return await PredictiveEnhancedResponses.prediccionSeguridad(language);
  }

  return null;
}
