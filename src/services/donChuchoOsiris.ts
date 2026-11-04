/**
 * Respuestas de Don Chucho con datos reales de seguridad y clima para Salento.
 * Los datos vienen de /data/safety-data.json (generado en build desde
 * USGS - sismos y Open-Meteo - clima; ver scripts/fetch-safety-data.mjs).
 * Sin servicios de terceros en runtime: sin CORS y funciona offline via SW.
 */
import {
  getSafetyData,
  weatherCodeLabel,
  significantQuakes,
  rainyDays,
  formatDay,
  timeAgo,
  SafetyData,
} from './safetyDataService';

type Lang = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it';

function t(lang: string, msgs: Partial<Record<Lang, string>>): string {
  return msgs[(lang as Lang)] || msgs.es || '';
}

function updatedNote(data: SafetyData, lang: string): string {
  return t(lang, {
    es: `Datos actualizados ${timeAgo(data.generatedAt, 'es')}.`,
    en: `Data updated ${timeAgo(data.generatedAt, 'en')}.`,
    de: `Daten aktualisiert ${timeAgo(data.generatedAt, 'de')}.`,
    fr: `Données mises à jour ${timeAgo(data.generatedAt, 'fr')}.`,
    pt: `Dados atualizados ${timeAgo(data.generatedAt, 'pt')}.`,
    it: `Dati aggiornati ${timeAgo(data.generatedAt, 'it')}.`,
  });
}

/** Estado de una actividad al aire libre según clima actual */
function outdoorStatus(data: SafetyData): { status: 'recommended' | 'cautious' | 'not_recommended'; reason: string } {
  const w = data.weather;
  if (!w?.current) return { status: 'recommended', reason: '' };
  const { weatherCode, precipitation, windGusts } = w.current;
  const raining = (precipitation ?? 0) > 0.2 || (weatherCode != null && weatherCode >= 51 && weatherCode <= 67) || (weatherCode != null && weatherCode >= 80);
  const storm = weatherCode != null && weatherCode >= 95;
  const windy = (windGusts ?? 0) >= 60;

  if (storm) return { status: 'not_recommended', reason: 'tormenta eléctrica' };
  if (raining) return { status: 'cautious', reason: 'lluvia' };
  if (windy) return { status: 'cautious', reason: 'viento fuerte' };
  return { status: 'recommended', reason: 'condiciones despejadas' };
}

function outdoorActivitiesStatus(data: SafetyData, lang: string): string {
  const { status, reason } = outdoorStatus(data);
  const icon = status === 'recommended' ? '✅' : status === 'cautious' ? '⚠️' : '❌';
  const names = {
    es: ['Cabalgatas en Valle de Cocora', 'Caminata a Cascadas de Santa Rita', 'Visita a miradores'],
    en: ['Horseback riding in Valle de Cocora', 'Hike to Santa Rita Waterfalls', 'Visit to viewpoints'],
    de: ['Reitausflüge im Valle de Cocora', 'Wanderung zu den Santa-Rita-Wasserfällen', 'Aussichtspunkte'],
    fr: ['Balades à cheval dans la Vallée de Cocora', 'Randonnée aux Cascades de Santa Rita', 'Visite des belvédères'],
    pt: ['Cavalgadas no Vale de Cocora', 'Trilha das Cachoeiras de Santa Rita', 'Visita a mirantes'],
    it: ['Escursioni a cavallo nella Valle de Cocora', 'Trekking alle Cascate di Santa Rita', 'Visita ai belvedere'],
  };
  const reasonText = t(lang, {
    es: reason === 'condiciones despejadas' ? 'condiciones despejadas' : reason,
    en: reason,
    de: reason,
    fr: reason,
    pt: reason,
    it: reason,
  });
  return names[(lang as Lang)]?.map(a => `• ${a}: ${icon} ${reasonText}`).join('\n') || '';
}

export const OsirisEnhancedResponses = {
  seguridad: async (language: string = 'es') => {
    const data = await getSafetyData();
    const significant = significantQuakes(data, 4.0, 30);

    if (significant.length === 0) {
      return t(language, {
        es: `✅ Según el catálogo sísmico del USGS, no hay sismos de magnitud 4.0+ en los últimos 30 días a menos de 300 km de Salento. ${updatedNote(data, language)}`,
        en: `✅ According to the USGS earthquake catalog, there have been no magnitude 4.0+ quakes within 300 km of Salento in the last 30 days. ${updatedNote(data, language)}`,
        de: `✅ Laut USGS-Erdbebenkatalog gab es in den letzten 30 Tagen keine Beben der Stärke 4,0+ innerhalb von 300 km um Salento. ${updatedNote(data, language)}`,
        fr: `✅ Selon le catalogue sismique de l'USGS, aucun séisme de magnitude 4,0+ dans un rayon de 300 km de Salento au cours des 30 derniers jours. ${updatedNote(data, language)}`,
        pt: `✅ Segundo o catálogo sísmico do USGS, não houve sismos de magnitude 4,0+ nos últimos 30 dias a menos de 300 km de Salento. ${updatedNote(data, language)}`,
        it: `✅ Secondo il catalogo sismico USGS, nessun sisma di magnitudo 4,0+ negli ultimi 30 giorni entro 300 km da Salento. ${updatedNote(data, language)}`,
      });
    }

    const latest = significant[0];
    const dateStr = latest.time ? new Date(latest.time).toLocaleDateString(language === 'es' ? 'es-CO' : language) : '';
    return t(language, {
      es: `⚠️ El USGS registró ${significant.length} sismo${significant.length > 1 ? 's' : ''} de magnitud 4.0+ cerca de Salento en los últimos 30 días. El más reciente: M${latest.magnitude.toFixed(1)} cerca de ${latest.place} (${dateStr}). Es actividad normal de la región andina; no es motivo para cancelar el viaje, pero mantente atento a recomendaciones oficiales. ${updatedNote(data, language)}`,
      en: `⚠️ USGS recorded ${significant.length} magnitude 4.0+ quake${significant.length > 1 ? 's' : ''} near Salento in the last 30 days. Most recent: M${latest.magnitude.toFixed(1)} near ${latest.place} (${dateStr}). This is normal activity for the Andean region; not a reason to cancel your trip, but stay alert to official recommendations. ${updatedNote(data, language)}`,
      de: `⚠️ Das USGS hat in den letzten 30 Tagen ${significant.length} Beben der Stärke 4,0+ nahe Salento registriert. Das jüngste: M${latest.magnitude.toFixed(1)} nahe ${latest.place} (${dateStr}). Das ist normale Aktivität für die Andenregion; kein Grund, die Reise abzubrechen, aber… achte auf offizielle Empfehlungen. ${updatedNote(data, language)}`,
      fr: `⚠️ L'USGS a enregistré ${significant.length} séisme${significant.length > 1 ? 's' : ''} de magnitude 4,0+ près de Salento au cours des 30 derniers jours. Le plus récent : M${latest.magnitude.toFixed(1)} près de ${latest.place} (${dateStr}). C'est une activité normale pour la région andine ; ce n'est pas une raison d'annuler le voyage, mais restez attentif aux recommandations officielles. ${updatedNote(data, language)}`,
      pt: `⚠️ O USGS registrou ${significant.length} sismo${significant.length > 1 ? 's' : ''} de magnitude 4,0+ perto de Salento nos últimos 30 dias. O mais recente: M${latest.magnitude.toFixed(1)} perto de ${latest.place} (${dateStr}). É atividade normal da região andina; não é motivo para cancelar a viagem, mas fique atento às recomendações oficiais. ${updatedNote(data, language)}`,
      it: `⚠️ L'USGS ha registrato ${significant.length} sisma${significant.length > 1 ? 'i' : ''} di magnitudo 4,0+ vicino a Salento negli ultimi 30 giorni. Il più recente: M${latest.magnitude.toFixed(1)} vicino a ${latest.place} (${dateStr}). È attività normale per la regione andina; non è un motivo per annullare il viaggio, ma resta attento alle raccomandazioni ufficiali. ${updatedNote(data, language)}`,
    });
  },

  clima: async (language: string = 'es') => {
    const data = await getSafetyData();
    const w = data.weather?.current;

    if (!w || w.temperature == null) {
      return t(language, {
        es: `🌤️ No tengo el pronóstico actualizado en este momento. ${updatedNote(data, language)}`,
        en: `🌤️ I don't have the updated forecast right now. ${updatedNote(data, language)}`,
        de: `🌤️ Ich habe die aktuelle Vorhersage gerade nicht. ${updatedNote(data, language)}`,
        fr: `🌤️ Je n'ai pas les prévisions à jour pour le moment. ${updatedNote(data, language)}`,
        pt: `🌤️ Não tenho a previsão atualizada no momento. ${updatedNote(data, language)}`,
        it: `🌤️ Non ho le previsioni aggiornate al momento. ${updatedNote(data, language)}`,
      });
    }

    const condition = weatherCodeLabel(w.weatherCode, language);
    const raining = (w.precipitation ?? 0) > 0.2 || (w.weatherCode != null && ((w.weatherCode >= 51 && w.weatherCode <= 67) || w.weatherCode >= 80));
    const verb = t(language, {
      es: raining ? 'Está lloviendo' : 'El clima está',
      en: raining ? 'It is raining' : 'The weather is',
      de: raining ? 'Es regnet' : 'Das Wetter ist',
      fr: raining ? 'Il pleut' : 'Le temps est',
      pt: raining ? 'Está chovendo' : 'O tempo está',
      it: raining ? 'Sta piovendo' : 'Il tempo è',
    });

    return t(language, {
      es: `🌤️ Clima actual en Salento: ${verb} ${condition}. Temperatura ${w.temperature}°C (sensación ${w.feelsLike ?? w.temperature}°C), humedad ${w.humidity ?? '—'}%, viento ${w.windSpeed ?? '—'} km/h.${raining ? ' Para hoy conviene llevar impermeable; las actividades bajo techo (tour cafetero, museos, restaurantes) son buena alternativa.' : ' Condiciones favorables para actividades al aire libre.'} ${updatedNote(data, language)}`,
      en: `🌤️ Current weather in Salento: ${verb} ${condition}. Temperature ${w.temperature}°C (feels like ${w.feelsLike ?? w.temperature}°C), humidity ${w.humidity ?? '—'}%, wind ${w.windSpeed ?? '—'} km/h.${raining ? ' Bring a raincoat today; indoor activities (coffee tour, museums, restaurants) are a good alternative.' : ' Conditions are favorable for outdoor activities.'} ${updatedNote(data, language)}`,
      de: `🌤️ Aktuelles Wetter in Salento: ${verb} ${condition}. Temperatur ${w.temperature}°C (gefühlt ${w.feelsLike ?? w.temperature}°C), Luftfeuchtigkeit ${w.humidity ?? '—'}%, Wind ${w.windSpeed ?? '—'} km/h.${raining ? ' Nehmen Sie heute einen Regenschutz mit; Aktivitäten unter Dach (Kaffeetour, Museen, Restaurants) sind eine gute Alternative.' : ' Bedingungen sind günstig für Outdoor-Aktivitäten.'} ${updatedNote(data, language)}`,
      fr: `🌤️ Météo actuelle à Salento : ${verb} ${condition}. Température ${w.temperature}°C (ressenti ${w.feelsLike ?? w.temperature}°C), humidité ${w.humidity ?? '—'}%, vent ${w.windSpeed ?? '—'} km/h.${raining ? ' Prévoyez un imperméable aujourd\'hui ; les activités en intérieur (tour du café, musées, restaurants) sont une bonne alternative.' : ' Conditions favorables aux activités de plein air.'} ${updatedNote(data, language)}`,
      pt: `🌤️ Clima atual em Salento: ${verb} ${condition}. Temperatura ${w.temperature}°C (sensação ${w.feelsLike ?? w.temperature}°C), umidade ${w.humidity ?? '—'}%, vento ${w.windSpeed ?? '—'} km/h.${raining ? ' Leve um impermeável hoje; atividades cobertas (tour do café, museus, restaurantes) são uma boa alternativa.' : ' Condições favoráveis para atividades ao ar livre.'} ${updatedNote(data, language)}`,
      it: `🌤️ Meteo attuale a Salento: ${verb} ${condition}. Temperatura ${w.temperature}°C (percepita ${w.feelsLike ?? w.temperature}°C), umidità ${w.humidity ?? '—'}%, vento ${w.windSpeed ?? '—'} km/h.${raining ? ' Porta un impermeabile oggi; le attività al coperto (tour del caffè, musei, ristoranti) sono una buona alternativa.' : ' Condizioni favorevoli per attività all\'aperto.'} ${updatedNote(data, language)}`,
    });
  },

  offlineResponse: async (language: string = 'es') => {
    const data = await getSafetyData();
    const significant = significantQuakes(data, 4.0, 30);
    return t(language, {
      es: `📦 Sin conexión: usando los últimos datos guardados en el sitio (actualizados ${timeAgo(data.generatedAt, 'es')}). Sismos 4.0+ recientes en la región: ${significant.length}. Clima registrado: ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'es')}` : 'sin datos'}. Conéctate para ver datos más recientes al publicar el sitio.`,
      en: `📦 Offline: using the latest data saved on the site (updated ${timeAgo(data.generatedAt, 'en')}). Recent 4.0+ quakes in the region: ${significant.length}. Recorded weather: ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'en')}` : 'no data'}. Connect to see newer data when the site is published.`,
      de: `📦 Offline: Es werden die letzten auf der Seite gespeicherten Daten verwendet (aktualisiert ${timeAgo(data.generatedAt, 'de')}). Jüngste Beben 4,0+ in der Region: ${significant.length}. Erfasstes Wetter: ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'de')}` : 'keine Daten'}.`,
      fr: `📦 Hors ligne : utilisation des dernières données enregistrées sur le site (mises à jour ${timeAgo(data.generatedAt, 'fr')}). Séismes 4,0+ récents dans la région : ${significant.length}. Météo enregistrée : ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'fr')}` : 'pas de données'}.`,
      pt: `📦 Offline: usando os últimos dados salvos no site (atualizados ${timeAgo(data.generatedAt, 'pt')}). Sismos 4.0+ recentes na região: ${significant.length}. Clima registrado: ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'pt')}` : 'sem dados'}.`,
      it: `📦 Offline: utilizzo degli ultimi dati salvati sul sito (aggiornati ${timeAgo(data.generatedAt, 'it')}). Sismi 4.0+ recenti nella regione: ${significant.length}. Meteo registrato: ${data.weather?.current ? `${Math.round(data.weather.current.temperature ?? 0)}°C, ${weatherCodeLabel(data.weather.current.weatherCode, 'it')}` : 'nessun dato'}.`,
    });
  },
};

/** Detecta si una pregunta debería usar datos de seguridad/clima */
export function shouldUseOsirisData(query: string): boolean {
  const keywords = [
    'terremoto', 'sismo', 'sísmico', 'seismic', 'temblor',
    'clima', 'weather', 'tiempo', 'lluvia', 'tormenta',
    'seguridad', 'safe', 'peligro', 'danger',
    'alerta', 'warning', 'emergencia'
  ];
  const lowerQuery = query.toLowerCase();
  return keywords.some(keyword => lowerQuery.includes(keyword));
}

/** Obtiene respuesta con datos reales para una consulta de seguridad/clima */
export async function getOsirisResponse(query: string, language: string = 'es'): Promise<string | null> {
  if (!shouldUseOsirisData(query)) return null;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('terremoto') || lowerQuery.includes('sismo') || lowerQuery.includes('sísmico') || lowerQuery.includes('seismic') || lowerQuery.includes('temblor')) {
    return await OsirisEnhancedResponses.seguridad(language);
  }

  if (lowerQuery.includes('clima') || lowerQuery.includes('weather') || lowerQuery.includes('tiempo') || lowerQuery.includes('lluvia') || lowerQuery.includes('tormenta')) {
    return await OsirisEnhancedResponses.clima(language);
  }

  if (!navigator.onLine) {
    return await OsirisEnhancedResponses.offlineResponse(language);
  }

  return null;
}

/**
 * Respuestas turísticas con datos reales (actividades según clima)
 */
export const TourismEnhancedResponses = {
  actividadesAhora: async (language: string = 'es') => {
    const data = await getSafetyData();
    const { status } = outdoorStatus(data);
    const w = data.weather?.current;

    const condition = w ? weatherCodeLabel(w.weatherCode, language) : '';
    return t(language, {
      es: `🎯 Condiciones actuales en Salento: ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Buen día para actividades al aire libre como cabalgatas en el Valle de Cocora o caminatas a cascadas.' : status === 'cautious' ? '⚠️ Lluvia o viento: las caminatas son posibles pero con precaución; el tour cafetero y los museos son alternativas perfectas.' : '❌ Tormenta: prioriza actividades bajo techo. El tour cafetero en Salento es una experiencia excelente con cualquier clima.'}\n\n${updatedNote(data, language)}`,
      en: `🎯 Current conditions in Salento: ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Good day for outdoor activities like horseback riding in Valle de Cocora or waterfall hikes.' : status === 'cautious' ? '⚠️ Rain or wind: hikes are possible but with caution; the coffee tour and museums are perfect alternatives.' : '❌ Storm: prioritize indoor activities. The coffee tour in Salento is an excellent experience in any weather.'}\n\n${updatedNote(data, language)}`,
      de: `🎯 Aktuelle Bedingungen in Salento: ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Guter Tag für Outdoor-Aktivitäten wie Reitausflüge im Valle de Cocora oder Wasserfallwanderungen.' : status === 'cautious' ? '⚠️ Regen oder Wind: Wanderungen sind mit Vorsicht möglich; Kaffeetour und Museen sind perfekte Alternativen.' : '❌ Gewitter: Priorisieren Sie Aktivitäten unter Dach. Die Kaffeetour in Salento ist bei jedem Wetter ein toller Tipp.'}\n\n${updatedNote(data, language)}`,
      fr: `🎯 Conditions actuelles à Salento : ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Bonne journée pour les activités de plein air comme les balades à cheval dans la Vallée de Cocora ou les randonnées vers les cascades.' : status === 'cautious' ? '⚠️ Pluie ou vent : les randonnées sont possibles avec prudence ; le tour du café et les musées sont d\'excellentes alternatives.' : '❌ Orage : privilégiez les activités en intérieur. Le tour du café à Salento est une excellente expérience quel que soit le temps.'}\n\n${updatedNote(data, language)}`,
      pt: `🎯 Condições atuais em Salento: ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Bom dia para atividades ao ar livre como cavalgadas no Vale de Cocora ou trilhas para cachoeiras.' : status === 'cautious' ? '⚠️ Chuva ou vento: as trilhas são possíveis com cautela; o tour do café e os museus são alternativas perfeitas.' : '❌ Tempestade: priorize atividades cobertas. O tour do café em Salento é uma excelente experiência com qualquer clima.'}\n\n${updatedNote(data, language)}`,
      it: `🎯 Condizioni attuali a Salento: ${condition}, ${w?.temperature ?? '—'}°C.\n\n${outdoorActivitiesStatus(data, language)}\n\n${status === 'recommended' ? '✅ Buona giornata per attività all\'aperto come escursioni a cavallo nella Valle de Cocora o trekking alle cascate.' : status === 'cautious' ? '⚠️ Pioggia o vento: le escursioni sono possibili con cautela; il tour del caffè e i musei sono alternative perfette.' : '❌ Temporale: privilegia le attività al coperto. Il tour del caffè a Salento è un\'ottima esperienza con qualsiasi meteo.'}\n\n${updatedNote(data, language)}`,
    });
  },

  seguridadTuristica: async (language: string = 'es') => {
    const data = await getSafetyData();
    const significant = significantQuakes(data, 4.5, 7);
    const rainDays = rainyDays(data, 60);

    const quakeLine = significant.length > 0
      ? t(language, {
          es: `Sismos 4.5+ en la última semana cerca de Salento: ${significant.length} (el más reciente M${significant[0].magnitude.toFixed(1)}).`,
          en: `Magnitude 4.5+ quakes near Salento in the last week: ${significant.length} (most recent M${significant[0].magnitude.toFixed(1)}).`,
          de: `Beben 4,5+ nahe Salento in der letzten Woche: ${significant.length} (jüngstes M${significant[0].magnitude.toFixed(1)}).`,
          fr: `Séismes 4,5+ près de Salento la semaine dernière : ${significant.length} (le plus récent M${significant[0].magnitude.toFixed(1)}).`,
          pt: `Sismos 4.5+ perto de Salento na última semana: ${significant.length} (o mais recente M${significant[0].magnitude.toFixed(1)}).`,
          it: `Sismi 4.5+ vicino a Salento nell\'ultima settimana: ${significant.length} (il più recente M${significant[0].magnitude.toFixed(1)}).`,
        })
      : t(language, {
          es: 'Sin sismos 4.5+ en la última semana cerca de Salento.',
          en: 'No magnitude 4.5+ quakes near Salento in the last week.',
          de: 'Keine Beben 4,5+ nahe Salento in der letzten Woche.',
          fr: 'Aucun séisme 4,5+ près de Salento la semaine dernière.',
          pt: 'Sem sismos 4.5+ perto de Salento na última semana.',
          it: 'Nessun sisma 4.5+ vicino a Salento nell\'ultima settimana.',
        });

    const rainLine = rainDays.length > 0
      ? t(language, {
          es: `Días con lluvia probable esta semana: ${rainDays.map(d => formatDay(d.date, 'es')).join(', ')}.`,
          en: `Days with likely rain this week: ${rainDays.map(d => formatDay(d.date, 'en')).join(', ')}.`,
          de: `Tage mit wahrscheinlichem Regen diese Woche: ${rainDays.map(d => formatDay(d.date, 'de')).join(', ')}.`,
          fr: `Jours avec pluie probable cette semaine : ${rainDays.map(d => formatDay(d.date, 'fr')).join(', ')}.`,
          pt: `Dias com chuva provável esta semana: ${rainDays.map(d => formatDay(d.date, 'pt')).join(', ')}.`,
          it: `Giorni con pioggia probabile questa settimana: ${rainDays.map(d => formatDay(d.date, 'it')).join(', ')}.`,
        })
      : t(language, {
          es: 'Sin lluvia significativa pronosticada esta semana.',
          en: 'No significant rain forecast this week.',
          de: 'Kein nennenswerter Regen diese Woche prognostiziert.',
          fr: 'Pas de pluie significative prévue cette semaine.',
          pt: 'Sem chuva significativa prevista esta semana.',
          it: 'Nessuna pioggia significativa prevista questa settimana.',
        });

    return t(language, {
      es: `🛡️ Estado de seguridad para visitar Salento:\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ En general es un momento tranquilo para visitar: actividad sísmica dentro de lo normal para la región andina y clima sin alertas severas. ${updatedNote(data, language)}`,
      en: `🛡️ Safety status for visiting Salento:\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ Overall it is a calm time to visit: seismic activity within normal range for the Andean region and no severe weather alerts. ${updatedNote(data, language)}`,
      de: `🛡️ Sicherheitsstatus für einen Besuch in Salento:\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ Insgesamt ist es eine ruhige Zeit für einen Besuch: seismische Aktivität im normalen Bereich für die Andenregion und keine schweren Wetterwarnungen. ${updatedNote(data, language)}`,
      fr: `🛡️ État de sécurité pour visiter Salento :\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ Dans l'ensemble, c'est un moment calme pour visiter : activité sismique dans la norme pour la région andine et aucune alerte météo sévère. ${updatedNote(data, language)}`,
      pt: `🛡️ Estado de segurança para visitar Salento:\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ No geral é um momento tranquilo para visitar: atividade sísmica dentro do normal para a região andina e sem alertas climáticas severas. ${updatedNote(data, language)}`,
      it: `🛡️ Stato di sicurezza per visitare Salento:\n\n• ${quakeLine}\n• ${rainLine}\n\n✅ Nel complesso è un momento tranquillo per visitare: attività sismica nella norma per la regione andina e nessun allerta meteo severo. ${updatedNote(data, language)}`,
    });
  },

  impactoClima: async (language: string = 'es') => {
    const data = await getSafetyData();
    const w = data.weather?.current;
    const { status, reason } = outdoorStatus(data);
    const icon = status === 'recommended' ? '✅' : status === 'cautious' ? '⚠️' : '❌';

    return t(language, {
      es: `🌤️ El clima actual (${w ? weatherCodeLabel(w.weatherCode, 'es') : 'sin datos'}, ${w?.temperature ?? '—'}°C) afecta tus actividades así:\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Alternativas bajo techo: tour cafetero, museos, restaurantes.' : '💡 Prioriza todo lo que sea bajo techo: el tour cafetero en Salento es la experiencia estrella con cualquier clima.'}\n\n${updatedNote(data, language)}`,
      en: `🌤️ Current weather (${w ? weatherCodeLabel(w.weatherCode, 'en') : 'no data'}, ${w?.temperature ?? '—'}°C) affects your activities as follows:\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Indoor alternatives: coffee tour, museums, restaurants.' : '💡 Prioritize everything indoors: the coffee tour in Salento is the star experience in any weather.'}\n\n${updatedNote(data, language)}`,
      de: `🌤️ Das aktuelle Wetter (${w ? weatherCodeLabel(w.weatherCode, 'de') : 'keine Daten'}, ${w?.temperature ?? '—'}°C) beeinflusst Ihre Aktivitäten wie folgt:\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Alternativen drinnen: Kaffeetour, Museen, Restaurants.' : '💡 Priorisieren Sie alles unter Dach: Die Kaffeetour in Salento ist bei jedem Wetter das Star-Erlebnis.'}\n\n${updatedNote(data, language)}`,
      fr: `🌤️ La météo actuelle (${w ? weatherCodeLabel(w.weatherCode, 'fr') : 'pas de données'}, ${w?.temperature ?? '—'}°C) affecte vos activités comme suit :\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Alternatives en intérieur : tour du café, musées, restaurants.' : '💡 Privilégiez tout ce qui est en intérieur : le tour du café à Salento est l\'expérience phare par tous les temps.'}\n\n${updatedNote(data, language)}`,
      pt: `🌤️ O clima atual (${w ? weatherCodeLabel(w.weatherCode, 'pt') : 'sem dados'}, ${w?.temperature ?? '—'}°C) afeta suas atividades assim:\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Alternativas cobertas: tour do café, museus, restaurantes.' : '💡 Priorize tudo que é coberto: o tour do café em Salento é a experiência estrela com qualquer clima.'}\n\n${updatedNote(data, language)}`,
      it: `🌤️ Il meteo attuale (${w ? weatherCodeLabel(w.weatherCode, 'it') : 'nessun dato'}, ${w?.temperature ?? '—'}°C) influisce sulle tue attività così:\n\n${outdoorActivitiesStatus(data, language)}\n\n${status !== 'not_recommended' ? '💡 Alternative al coperto: tour del caffè, musei, ristoranti.' : '💡 Dai priorità a tutto ciò che è al coperto: il tour del caffè a Salento è l\'esperienza forte con qualsiasi meteo.'}\n\n${updatedNote(data, language)}`,
    });
  },
};

/** Detecta si una pregunta es una consulta turística */
export function isTourismQuery(query: string): boolean {
  const tourismKeywords = [
    'actividades', 'activities', 'hacer', 'visitar', 'safe',
    'seguro', 'recommend', 'recomendar', 'mejor momento',
    'impacto', 'afecta', 'clima turismo', 'weather tourism'
  ];
  const lowerQuery = query.toLowerCase();
  return tourismKeywords.some(keyword => lowerQuery.includes(keyword));
}

/** Obtiene respuesta turística con datos reales */
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
 * Respuestas predictivas con pronóstico real de 7 días (Open-Meteo)
 */
export const PredictiveEnhancedResponses = {
  mejorMomentoVisitar: async (language: string = 'es') => {
    const data = await getSafetyData();
    const rainDays = rainyDays(data, 50);
    const daily = data.weather?.daily || [];
    const bestDays = daily
      .filter(d => (d.precipProbMax ?? 100) < 40)
      .sort((a, b) => (a.precipProbMax ?? 0) - (b.precipProbMax ?? 0))
      .slice(0, 3);

    const bestList = bestDays.length > 0
      ? bestDays.map(d => `${formatDay(d.date, language)} (${Math.round(d.tempMax ?? 0)}°C)`).join(', ')
      : t(language, {
          es: 'los próximos días secos del pronóstico',
          en: 'the upcoming dry days in the forecast',
          de: 'die kommenden trockenen Tage der Vorhersage',
          fr: 'les prochains jours secs des prévisions',
          pt: 'os próximos dias secos da previsão',
          it: 'i prossimi giorni asciutti delle previsioni',
        });

    return t(language, {
      es: `📅 Mejor momento para visitar Salento:\n\n✅ Esta semana los días más secos son: ${bestList}\n📊 Climatología de la región: la estación seca va de diciembre a marzo (ideal para Valle de Cocora y caminatas); abril-mayo y octubre-noviembre son más lluviosos.\n\n${rainDays.length > 0 ? `⚠️ Posible lluvia esta semana: ${rainDays.map(d => formatDay(d.date, 'es')).join(', ')}.` : '✅ Esta semana se ve mayormente seca.'} ${updatedNote(data, language)}`,
      en: `📅 Best time to visit Salento:\n\n✅ The driest days this week are: ${bestList}\n📊 Regional climate: the dry season runs December to March (ideal for Valle de Cocora and hikes); April-May and October-November are rainier.\n\n${rainDays.length > 0 ? `⚠️ Possible rain this week: ${rainDays.map(d => formatDay(d.date, 'en')).join(', ')}.` : '✅ This week looks mostly dry.'} ${updatedNote(data, language)}`,
      de: `📅 Beste Zeit für einen Besuch in Salento:\n\n✅ Die trockensten Tage dieser Woche sind: ${bestList}\n📊 Regionales Klima: Die Trockenzeit läuft von Dezember bis März (ideal für Valle de Cocora und Wanderungen); April-Mai und Oktober-November sind regnerischer.\n\n${rainDays.length > 0 ? `⚠️ Möglicher Regen diese Woche: ${rainDays.map(d => formatDay(d.date, 'de')).join(', ')}.` : '✅ Diese Woche sieht überwiegend trocken aus.'} ${updatedNote(data, language)}`,
      fr: `📅 Meilleur moment pour visiter Salento :\n\n✅ Les jours les plus secs de cette semaine sont : ${bestList}\n📊 Climat régional : la saison sèche va de décembre à mars (idéal pour la Vallée de Cocora et les randonnées) ; avril-mai et octobre-novembre sont plus pluvieux.\n\n${rainDays.length > 0 ? `⚠️ Pluie possible cette semaine : ${rainDays.map(d => formatDay(d.date, 'fr')).join(', ')}.` : '✅ Cette semaine semble majoritairement sèche.'} ${updatedNote(data, language)}`,
      pt: `📅 Melhor momento para visitar Salento:\n\n✅ Os dias mais secos desta semana são: ${bestList}\n📊 Climatologia da região: a estação seca vai de dezembro a março (ideal para o Vale de Cocora e trilhas); abril-maio e outubro-novembro são mais chuvosos.\n\n${rainDays.length > 0 ? `⚠️ Chuva possível esta semana: ${rainDays.map(d => formatDay(d.date, 'pt')).join(', ')}.` : '✅ Esta semana parece majoritariamente seca.'} ${updatedNote(data, language)}`,
      it: `📅 Momento migliore per visitare Salento:\n\n✅ I giorni più asciutti di questa settimana sono: ${bestList}\n📊 Climatologia della regione: la stagione secca va da dicembre a marzo (ideale per la Valle de Cocora e le escursioni); aprile-maggio e ottobre-novembre sono più piovosi.\n\n${rainDays.length > 0 ? `⚠️ Pioggia possibile questa settimana: ${rainDays.map(d => formatDay(d.date, 'it')).join(', ')}.` : '✅ Questa settimana sembra prevalentemente asciutta.'} ${updatedNote(data, language)}`,
    });
  },

  prediccionClima: async (language: string = 'es') => {
    const data = await getSafetyData();
    const hourly = data.weather?.hourly || [];
    const next24 = hourly.filter(h => new Date(h.time).getTime() <= Date.now() + 24 * 3600_000);

    const rainHours = next24.filter(h => (h.precipProb ?? 0) >= 50);
    const temps = next24.map(h => h.temp).filter((x): x is number => x != null);
    const maxTemp = temps.length ? Math.max(...temps) : null;
    const minTemp = temps.length ? Math.min(...temps) : null;

    const rainPart = rainHours.length > 0
      ? t(language, {
          es: `Lluvia probable en ${rainHours.length} de las próximas 24 horas (pico ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% de probabilidad).`,
          en: `Rain likely in ${rainHours.length} of the next 24 hours (peak ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% probability).`,
          de: `Regen wahrscheinlich in ${rainHours.length} der nächsten 24 Stunden (Spitze ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% Wahrscheinlichkeit).`,
          fr: `Pluie probable pendant ${rainHours.length} des prochaines 24 heures (pic ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% de probabilité).`,
          pt: `Chuva provável em ${rainHours.length} das próximas 24 horas (pico ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% de probabilidade).`,
          it: `Pioggia probabile in ${rainHours.length} delle prossime 24 ore (picco ~${Math.max(...rainHours.map(h => h.precipProb ?? 0))}% di probabilità).`,
        })
      : t(language, {
          es: 'Sin lluvia significativa en las próximas 24 horas.',
          en: 'No significant rain in the next 24 hours.',
          de: 'Kein nennenswerter Regen in den nächsten 24 Stunden.',
          fr: 'Pas de pluie significative dans les prochaines 24 heures.',
          pt: 'Sem chuva significativa nas próximas 24 horas.',
          it: 'Nessuna pioggia significativa nelle prossime 24 ore.',
        });

    return t(language, {
      es: `🌤️ Pronóstico para las próximas 24 horas en Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'sin datos'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Condiciones favorables para actividades al aire libre mañana.' : '⚠️ Ten un plan bajo techo por si acaso (tour cafetero, museos).'} ${updatedNote(data, language)}`,
      en: `🌤️ Forecast for the next 24 hours in Salento:\n\n🌡️ Temperature: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'no data'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Favorable conditions for outdoor activities tomorrow.' : '⚠️ Keep an indoor backup plan just in case (coffee tour, museums).'} ${updatedNote(data, language)}`,
      de: `🌤️ Vorhersage für die nächsten 24 Stunden in Salento:\n\n🌡️ Temperatur: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'keine Daten'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Günstige Bedingungen für Outdoor-Aktivitäten morgen.' : '⚠️ Halten Sie einen Plan B unter Dach bereit (Kaffeetour, Museen).'} ${updatedNote(data, language)}`,
      fr: `🌤️ Prévisions pour les prochaines 24 heures à Salento :\n\n🌡️ Température : ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'pas de données'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Conditions favorables pour les activités de plein air demain.' : '⚠️ Prévoyez un plan de repli en intérieur (tour du café, musées).'} ${updatedNote(data, language)}`,
      pt: `🌤️ Previsão para as próximas 24 horas em Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'sem dados'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Condições favoráveis para atividades ao ar livre amanhã.' : '⚠️ Tenha um plano coberto como alternativa (tour do café, museus).'} ${updatedNote(data, language)}`,
      it: `🌤️ Previsione per le prossime 24 ore a Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'nessun dato'}\n${rainPart}\n\n${rainHours.length === 0 ? '✅ Condizioni favorevoli per attività all\'aperto domani.' : '⚠️ Tieni un piano al coperto come alternativa (tour del caffè, musei).'} ${updatedNote(data, language)}`,
    });
  },

  prediccionSeguridad: async (language: string = 'es') => {
    const data = await getSafetyData();
    const significant = significantQuakes(data, 4.5, 7);
    const rainDays = rainyDays(data, 60);
    const hasRisk = significant.length > 0 || rainDays.length >= 4;

    const quakePart = significant.length > 0
      ? t(language, {
          es: `${significant.length} sismo${significant.length > 1 ? 's' : ''} 4.5+ esta semana (normal para la región andina)`,
          en: `${significant.length} magnitude 4.5+ quakes this week (normal for the Andean region)`,
          de: `${significant.length} Beben 4,5+ diese Woche (normal für die Andenregion)`,
          fr: `${significant.length} séisme${significant.length > 1 ? 's' : ''} 4,5+ cette semaine (normal pour la région andine)`,
          pt: `${significant.length} sismo${significant.length > 1 ? 's' : ''} 4.5+ esta semana (normal para a região andina)`,
          it: `${significant.length} sisma${significant.length > 1 ? 'i' : ''} 4.5+ questa settimana (normale per la regione andina)`,
        })
      : '';

    const rainPart = rainDays.length > 0
      ? t(language, {
          es: `${rainDays.length} día${rainDays.length > 1 ? 's' : ''} con lluvia probable`,
          en: `${rainDays.length} day${rainDays.length > 1 ? 's' : ''} with likely rain`,
          de: `${rainDays.length} Tag${rainDays.length > 1 ? 'e' : ''} mit wahrscheinlichem Regen`,
          fr: `${rainDays.length} jour${rainDays.length > 1 ? 's' : ''} avec pluie probable`,
          pt: `${rainDays.length} dia${rainDays.length > 1 ? 's' : ''} com chuva provável`,
          it: `${rainDays.length} giorn${rainDays.length > 1 ? 'i' : 'o'} con pioggia probabile`,
        })
      : '';

    const factors = [quakePart, rainPart].filter(Boolean).join(' + ') || t(language, {
      es: 'sin factores de riesgo significativos',
      en: 'no significant risk factors',
      de: 'keine bedeutenden Risikofaktoren',
      fr: 'aucun facteur de risque significatif',
      pt: 'sem fatores de risco significativos',
      it: 'nessun fattore di rischio significativo',
    });

    return t(language, {
      es: hasRisk
        ? `⚠️ Para la próxima semana: condiciones aceptables pero con algunos factores a considerar.\n\nFactores: ${factors}.\n\n💡 Recomendación: programa actividades flexibles y ten alternativas bajo techo por si hay lluvia. ${updatedNote(data, language)}`
        : `✅ Sí, es seguro y recomendable visitar la próxima semana según el pronóstico.\n\nFactores: ${factors}.\n\nCondiciones estables esperadas para turismo. ${updatedNote(data, language)}`,
      en: hasRisk
        ? `⚠️ For next week: acceptable conditions with some factors to consider.\n\nFactors: ${factors}.\n\n💡 Recommendation: plan flexible activities and keep indoor alternatives in case of rain. ${updatedNote(data, language)}`
        : `✅ Yes, it is safe and recommended to visit next week according to the forecast.\n\nFactors: ${factors}.\n\nStable conditions expected for tourism. ${updatedNote(data, language)}`,
      de: hasRisk
        ? `⚠️ Für nächste Woche: akzeptable Bedingungen mit einigen zu beachtenden Faktoren.\n\nFaktoren: ${factors}.\n\n💡 Empfehlung: Planen Sie flexible Aktivitäten und haben Sie Alternativen unter Dach bereit. ${updatedNote(data, language)}`
        : `✅ Ja, ein Besuch nächste Woche ist laut Vorhersage sicher und empfehlenswert.\n\nFaktoren: ${factors}.\n\nStabile Bedingungen für den Tourismus erwartet. ${updatedNote(data, language)}`,
      fr: hasRisk
        ? `⚠️ Pour la semaine prochaine : conditions acceptables avec quelques facteurs à considérer.\n\nFacteurs : ${factors}.\n\n💡 Recommandation : programmez des activités flexibles et prévoyez des alternatives en intérieur en cas de pluie. ${updatedNote(data, language)}`
        : `✅ Oui, il est sûr et recommandé de visiter la semaine prochaine selon les prévisions.\n\nFacteurs : ${factors}.\n\nConditions stables attendues pour le tourisme. ${updatedNote(data, language)}`,
      pt: hasRisk
        ? `⚠️ Para a próxima semana: condições aceitáveis com alguns fatores a considerar.\n\nFatores: ${factors}.\n\n💡 Recomendação: programe atividades flexíveis e tenha alternativas cobertas caso chova. ${updatedNote(data, language)}`
        : `✅ Sim, é seguro e recomendado visitar na próxima semana segundo a previsão.\n\nFatores: ${factors}.\n\nCondições estáveis esperadas para turismo. ${updatedNote(data, language)}`,
      it: hasRisk
        ? `⚠️ Per la prossima settimana: condizioni accettabili con alcuni fattori da considerare.\n\nFattori: ${factors}.\n\n💡 Raccomandazione: programma attività flessibili e tieni alternative al coperto in caso di pioggia. ${updatedNote(data, language)}`
        : `✅ Sì, è sicuro e consigliato visitare la prossima settimana secondo le previsioni.\n\nFattori: ${factors}.\n\nCondizioni stabili previste per il turismo. ${updatedNote(data, language)}`,
    });
  },
};

/** Detecta si una pregunta es una consulta predictiva */
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

/** Obtiene respuesta predictiva con pronóstico real */
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
