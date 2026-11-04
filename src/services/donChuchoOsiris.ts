/**
 * Respuestas de Don Chucho con datos reales de clima para Salento.
 * Los datos vienen de /data/safety-data.json (generado en build desde
 * Open-Meteo; ver scripts/fetch-safety-data.mjs).
 * Sin servicios de terceros en runtime: sin CORS y funciona offline via SW.
 * Don Chucho solo habla de cosas positivas: clima agradable, planes y recomendaciones.
 */
import {
  getSafetyData,
  weatherCodeLabel,
  rainyDays,
  formatDay,
  SafetyData,
} from './safetyDataService';

type Lang = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it';

function t(lang: string, msgs: Partial<Record<Lang, string>>): string {
  return msgs[(lang as Lang)] || msgs.es || '';
}

function updatedNote(data: SafetyData, lang: string): string {
  const updated = data.generatedAt ? new Date(data.generatedAt).toLocaleDateString(lang === 'es' ? 'es-CO' : lang) : '';
  return t(lang, {
    es: `Datos del ${updated}.`,
    en: `Data from ${updated}.`,
    de: `Daten vom ${updated}.`,
    fr: `Données du ${updated}.`,
    pt: `Dados de ${updated}.`,
    it: `Dati del ${updated}.`,
  });
}

/** Condiciones actuales resumidas en una frase positiva */
function currentMood(data: SafetyData, lang: string): string {
  const w = data.weather?.current;
  if (!w || w.temperature == null) return '';
  const condition = weatherCodeLabel(w.weatherCode, lang);
  const raining = (w.precipitation ?? 0) > 0.2 || (w.weatherCode != null && ((w.weatherCode >= 51 && w.weatherCode <= 67) || w.weatherCode >= 80));

  if (raining) {
    return t(lang, {
      es: `está lloviendo suavemente (${w.temperature}°C)`,
      en: `it's drizzling softly (${w.temperature}°C)`,
      de: `es rieselt sanft (${w.temperature}°C)`,
      fr: `il bruine doucement (${w.temperature}°C)`,
      pt: `está garoando suavemente (${w.temperature}°C)`,
      it: `sta piovigginando dolcemente (${w.temperature}°C)`,
    });
  }
  return t(lang, {
    es: `hace ${condition.toLowerCase()} y ${w.temperature}°C`,
    en: `it's ${condition} and ${w.temperature}°C`,
    de: `es ist ${condition} und ${w.temperature}°C`,
    fr: `il fait ${condition} et ${w.temperature}°C`,
    pt: `está ${condition} e ${w.temperature}°C`,
    it: `c'è ${condition} e ${w.temperature}°C`,
  });
}

/** Planes recomendados según el clima, siempre en tono positivo */
function positivePlans(data: SafetyData, lang: string): string {
  const w = data.weather?.current;
  const raining = w ? ((w.precipitation ?? 0) > 0.2 || (w.weatherCode != null && ((w.weatherCode >= 51 && w.weatherCode <= 67) || w.weatherCode >= 80))) : false;

  const outdoor = {
    es: 'Cabalgatas en el Valle de Cocora entre palmas de cera, caminatas a las Cascadas de Santa Rita y atardeceres en los miradores',
    en: 'Horseback rides in the Valle de Cocora among wax palms, hikes to Santa Rita Waterfalls and sunsets at the viewpoints',
    de: 'Reitausflüge im Valle de Cocora zwischen Wachspalmen, Wanderungen zu den Santa-Rita-Wasserfällen und Sonnenuntergänge an den Aussichtspunkten',
    fr: 'Balades à cheval dans la Vallée de Cocora parmi les palmiers à cire, randonnées aux Cascades de Santa Rita et couchers de soleil aux belvédères',
    pt: 'Cavalgadas no Vale de Cocora entre palmeiras de cera, trilhas das Cachoeiras de Santa Rita e pores do sol nos mirantes',
    it: 'Escursioni a cavallo nella Valle de Cocora tra palme da cera, trekking alle Cascate di Santa Rita e tramonti sui belvedere',
  };
  const indoor = {
    es: 'el mágico tour cafetero por las fincas, los museos del pueblo y los restaurantes con vista a la cordillera',
    en: 'the magical coffee tours through the farms, the town museums and the restaurants with mountain views',
    de: 'die magischen Kaffeetouren durch die Farmen, die Dorfmuseen und die Restaurants mit Bergblick',
    fr: 'les magiques tours du café dans les fermes, les musées du village et les restaurants avec vue sur la cordillère',
    pt: 'os mágicos tours de café pelas fazendas, os museus da cidade e os restaurantes com vista para a cordilheira',
    it: 'le magiche tour del caffè nelle fattorie, i musei del paese e i ristoranti con vista sulla cordigliera',
  };

  return raining
    ? t(lang, {
        es: `☔ Día perfecto para ${indoor[lang as Lang] || indoor.es} — en Salento llueve con encanto.`,
        en: `☔ Perfect day for ${indoor[lang as Lang] || indoor.es} — in Salento it rains with charm.`,
        de: `☔ Perfekter Tag für ${indoor[lang as Lang] || indoor.es} — in Salento regnet es mit Charme.`,
        fr: `☔ Journée parfaite pour ${indoor[lang as Lang] || indoor.es} — à Salento, il pleut avec charme.`,
        pt: `☔ Dia perfeito para ${indoor[lang as Lang] || indoor.es} — em Salento chove com charme.`,
        it: `☔ Giornata perfetta per ${indoor[lang as Lang] || indoor.es} — a Salento piove con fascino.`,
      })
    : t(lang, {
        es: `☀️ Día ideal para ${outdoor[lang as Lang] || outdoor.es} — el clima acompaña.`,
        en: `☀️ Ideal day for ${outdoor[lang as Lang] || outdoor.es} — the weather is on your side.`,
        de: `☀️ Idealer Tag für ${outdoor[lang as Lang] || outdoor.es} — das Wetter spielt mit.`,
        fr: `☀️ Journée idéale pour ${outdoor[lang as Lang] || outdoor.es} — la météo joue pour vous.`,
        pt: `☀️ Dia ideal para ${outdoor[lang as Lang] || outdoor.es} — o clima joga a seu favor.`,
        it: `☀️ Giornata ideale per ${outdoor[lang as Lang] || outdoor.es} — il meteo gioca a tuo favore.`,
      });
}

export const OsirisEnhancedResponses = {
  clima: async (language: string = 'es') => {
    const data = await getSafetyData();
    const mood = currentMood(data, language);

    if (!mood) {
      return t(language, {
        es: '🌤️ Salento siempre tiene un clima de montaña encantador. ¡Pregunta por los planes del día!',
        en: '🌤️ Salento always has charming mountain weather. Ask about today\'s plans!',
        de: '🌤️ Salento hat immer charmantes Bergwetter. Fragen Sie nach den heutigen Plänen!',
        fr: '🌤️ Salento a toujours un temps de montagne charmant. Demandez les plans du jour !',
        pt: '🌤️ Salento sempre tem um clima de montanha encantador. Pergunte pelos planos do dia!',
        it: '🌤️ Salento ha sempre un meteo di montagna incantevole. Chiedi i programmi del giorno!',
      });
    }

    return t(language, {
      es: `🌤️ En Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
      en: `🌤️ In Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
      de: `🌤️ In Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
      fr: `🌤️ À Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
      pt: `🌤️ Em Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
      it: `🌤️ A Salento ${mood}. ${positivePlans(data, language)} ${updatedNote(data, language)}`,
    });
  },

  offlineResponse: async (language: string = 'es') => {
    const data = await getSafetyData();
    const mood = currentMood(data, language);
    return t(language, {
      es: `📦 Sin conexión: estos son los datos guardados en el sitio${mood ? ` — en Salento ${mood}` : ''}. Conéctate para ver el clima más reciente al publicar el sitio.`,
      en: `📦 Offline: this is the data saved on the site${mood ? ` — in Salento ${mood}` : ''}. Connect to see the latest weather when the site is published.`,
      de: `📦 Offline: Dies sind die auf der Seite gespeicherten Daten${mood ? ` — in Salento ${mood}` : ''}.`,
      fr: `📦 Hors ligne : voici les données enregistrées sur le site${mood ? ` — à Salento ${mood}` : ''}.`,
      pt: `📦 Offline: estes são os dados salvos no site${mood ? ` — em Salento ${mood}` : ''}.`,
      it: `📦 Offline: questi sono i dati salvati sul sito${mood ? ` — a Salento ${mood}` : ''}.`,
    });
  },
};

/** Detecta si una pregunta es sobre el clima */
export function shouldUseOsirisData(query: string): boolean {
  const keywords = [
    'clima', 'weather', 'lluvia', 'llover', 'lloviendo', 'tormenta',
    'temperatura', 'pronóstico', 'pronostico', 'forecast', 'weather forecast',
    'hace calor', 'hace frío', 'hace frio'
  ];
  const lowerQuery = query.toLowerCase();
  return keywords.some(keyword => lowerQuery.includes(keyword));
}

/** Obtiene respuesta de clima real para una consulta */
export async function getOsirisResponse(query: string, language: string = 'es'): Promise<string | null> {
  if (!shouldUseOsirisData(query)) return null;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('clima') || lowerQuery.includes('weather') || lowerQuery.includes('lluvia') || lowerQuery.includes('llover') || lowerQuery.includes('lloviendo') || lowerQuery.includes('tormenta') || lowerQuery.includes('temperatura') || lowerQuery.includes('pronóstico') || lowerQuery.includes('pronostico') || lowerQuery.includes('forecast') || lowerQuery.includes('hace calor') || lowerQuery.includes('hace frío') || lowerQuery.includes('hace frio')) {
    return await OsirisEnhancedResponses.clima(language);
  }

  if (!navigator.onLine) {
    return await OsirisEnhancedResponses.offlineResponse(language);
  }

  return null;
}

/**
 * Respuestas turísticas positivas con datos reales de clima
 */
export const TourismEnhancedResponses = {
  actividadesAhora: async (language: string = 'es') => {
    const data = await getSafetyData();
    return t(language, {
      es: `🎯 Plan perfecto para ahora en Salento:\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
      en: `🎯 Perfect plan for right now in Salento:\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
      de: `🎯 Perfekter Plan für jetzt in Salento:\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
      fr: `🎯 Plan parfait pour maintenant à Salento :\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
      pt: `🎯 Plano perfeito para agora em Salento:\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
      it: `🎯 Piano perfetto per adesso a Salento:\n\n${positivePlans(data, language)}\n\n${updatedNote(data, language)}`,
    });
  },

  planVisita: async (language: string = 'es') => {
    const data = await getSafetyData();
    const wetDays = rainyDays(data, 50);
    const daily = data.weather?.daily || [];
    const bestDays = daily
      .filter(d => (d.weatherCode ?? 99) < 51)
      .sort((a, b) => (a.precipProbMax ?? 0) - (b.precipProbMax ?? 0))
      .slice(0, 3);

    const bestList = bestDays.length > 0
      ? bestDays.map(d => `${formatDay(d.date, language)} (${Math.round(d.tempMax ?? 0)}°C)`).join(', ')
      : t(language, {
          es: 'los próximos días del pronóstico',
          en: 'the upcoming days in the forecast',
          de: 'die kommenden Tage der Vorhersage',
          fr: 'les prochains jours des prévisions',
          pt: 'os próximos dias da previsão',
          it: 'i prossimi giorni delle previsioni',
        });

    return t(language, {
      es: `🌿 Salento te espera con los brazos abiertos. Para tu visita:\n\n📅 Los días más soleados de esta semana: ${bestList}\n🏔️ Climatología: la estación seca va de diciembre a marzo (ideal para el Valle de Cocora); la época lluviosa (abril-mayo y octubre-noviembre) tiene su encanto con cafetales verdes y cascadas caudalosas.\n\n${wetDays.length > 0 ? `☔ Días con lluvia probable: ${wetDays.map(d => formatDay(d.date, 'es')).join(', ')} — perfectos para el tour cafetero y los museos.` : '☀️ Semana mayormente despejada: agenda las caminatas y cabalgatas.'} ${updatedNote(data, language)}`,
      en: `🌿 Salento awaits you with open arms. For your visit:\n\n📅 The sunniest days this week: ${bestList}\n🏔️ Climate: the dry season runs December to March (ideal for the Valle de Cocora); the rainy season (April-May and October-November) has its own charm with green coffee fields and full waterfalls.\n\n${wetDays.length > 0 ? `☔ Days with likely rain: ${wetDays.map(d => formatDay(d.date, 'en')).join(', ')} — perfect for the coffee tour and museums.` : '☀️ Mostly sunny week: schedule the hikes and horseback rides.'} ${updatedNote(data, language)}`,
      de: `🌿 Salento erwartet Sie mit offenen Armen. Für Ihren Besuch:\n\n📅 Die sonnigsten Tage dieser Woche: ${bestList}\n🏔️ Klima: Die Trockenzeit läuft von Dezember bis März (ideal für das Valle de Cocora); die Regenzeit (April-Mai und Oktober-November) hat ihren eigenen Charme mit grünen Kaffeefeldern und wasserreichen Wasserfällen.\n\n${wetDays.length > 0 ? `☔ Tage mit wahrscheinlichem Regen: ${wetDays.map(d => formatDay(d.date, 'de')).join(', ')} — perfekt für die Kaffeetour und die Museen.` : '☀️ Überwiegend sonnige Woche: Planen Sie die Wanderungen und Reitausflüge.'} ${updatedNote(data, language)}`,
      fr: `🌿 Salento vous attend les bras ouverts. Pour votre visite :\n\n📅 Les jours les plus ensoleillés de cette semaine : ${bestList}\n🏔️ Climat : la saison sèche va de décembre à mars (idéal pour la Vallée de Cocora) ; la saison des pluies (avril-mai et octobre-novembre) a son charme avec ses caféiers verts et ses cascades puissantes.\n\n${wetDays.length > 0 ? `☔ Jours avec pluie probable : ${wetDays.map(d => formatDay(d.date, 'fr')).join(', ')} — parfaits pour le tour du café et les musées.` : '☀️ Semaine majoritairement ensoleillée : planifiez les randonnées et les balades à cheval.'} ${updatedNote(data, language)}`,
      pt: `🌿 Salento espera por você de braços abertos. Para a sua visita:\n\n📅 Os dias mais ensolarados desta semana: ${bestList}\n🏔️ Climatologia: a estação seca vai de dezembro a março (ideal para o Vale de Cocora); a época chuvosa (abril-maio e outubro-novembro) tem seu charme com cafezais verdes e cachoeiras caudalosas.\n\n${wetDays.length > 0 ? `☔ Dias com chuva provável: ${wetDays.map(d => formatDay(d.date, 'pt')).join(', ')} — perfeitos para o tour do café e os museus.` : '☀️ Semana majoritariamente ensolarada: agende as trilhas e cavalgadas.'} ${updatedNote(data, language)}`,
      it: `🌿 Salento ti aspetta a braccia aperte. Per la tua visita:\n\n📅 I giorni più soleggiati di questa settimana: ${bestList}\n🏔️ Climatologia: la stagione secca va da dicembre a marzo (ideale per la Valle de Cocora); la stagione piovosa (aprile-maggio e ottobre-novembre) ha il suo fascino con piantagioni verdi e cascate impetuose.\n\n${wetDays.length > 0 ? `☔ Giorni con pioggia probabile: ${wetDays.map(d => formatDay(d.date, 'it')).join(', ')} — perfetti per il tour del caffè e i musei.` : '☀️ Settimana prevalentemente soleggiata: programma trekking ed escursioni a cavallo.'} ${updatedNote(data, language)}`,
    });
  },
};

/** Detecta si una pregunta es una consulta turística */
export function isTourismQuery(query: string): boolean {
  const tourismKeywords = [
    'actividades', 'activities', 'hacer', 'visitar', 'safe',
    'seguro', 'peligro', 'recommend', 'recomendar', 'mejor momento',
    'impacto', 'afecta', 'clima turismo', 'weather tourism'
  ];
  const lowerQuery = query.toLowerCase();
  return tourismKeywords.some(keyword => lowerQuery.includes(keyword));
}

/** Obtiene respuesta turística positiva con datos reales */
export async function getTourismResponse(query: string, language: string = 'es'): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('actividades') || lowerQuery.includes('activities') || lowerQuery.includes('hacer')) {
    return await TourismEnhancedResponses.actividadesAhora(language);
  }

  const wantsVisitPlan = lowerQuery.includes('visitar') || lowerQuery.includes('safe') || lowerQuery.includes('seguro') || lowerQuery.includes('peligro');

  if (wantsVisitPlan) {
    return await TourismEnhancedResponses.planVisita(language);
  }

  if (lowerQuery.includes('afecta') || lowerQuery.includes('impacto') || (lowerQuery.includes('clima') && lowerQuery.includes('visita'))) {
    return await TourismEnhancedResponses.planVisita(language);
  }

  return null;
}

/**
 * Respuestas predictivas positivas con pronóstico real de 7 días (Open-Meteo)
 */
export const PredictiveEnhancedResponses = {
  mejorMomentoVisitar: async (language: string = 'es') => {
    const data = await getSafetyData();
    const daily = data.weather?.daily || [];
    const bestDays = daily
      .filter(d => (d.weatherCode ?? 99) < 51)
      .sort((a, b) => (a.precipProbMax ?? 0) - (b.precipProbMax ?? 0))
      .slice(0, 3);

    const bestList = bestDays.length > 0
      ? bestDays.map(d => `${formatDay(d.date, language)} (${Math.round(d.tempMax ?? 0)}°C)`).join(', ')
      : t(language, {
          es: 'los próximos días del pronóstico',
          en: 'the upcoming days in the forecast',
          de: 'die kommenden Tage der Vorhersage',
          fr: 'les prochains jours des prévisions',
          pt: 'os próximos dias da previsão',
          it: 'i prossimi giorni delle previsioni',
        });

    return t(language, {
      es: `📅 El mejor momento para visitar Salento:\n\n✅ Esta semana los días más soleados son: ${bestList}\n📊 Climatología de la región: la estación seca va de diciembre a marzo (ideal para Valle de Cocora y caminatas); la época lluviosa tiene su encanto con cafetales verdes y cascadas caudalosas.\n\n¡Salento te espera con los brazos abiertos! ${updatedNote(data, language)}`,
      en: `📅 The best time to visit Salento:\n\n✅ The sunniest days this week are: ${bestList}\n📊 Regional climate: the dry season runs December to March (ideal for Valle de Cocora and hikes); the rainy season has its own charm with green coffee fields and full waterfalls.\n\nSalento awaits you with open arms! ${updatedNote(data, language)}`,
      de: `📅 Die beste Zeit für einen Besuch in Salento:\n\n✅ Die sonnigsten Tage dieser Woche sind: ${bestList}\n📊 Regionales Klima: Die Trockenzeit läuft von Dezember bis März (ideal für Valle de Cocora und Wanderungen); die Regenzeit hat ihren eigenen Charme mit grünen Kaffeefeldern und wasserreichen Wasserfällen.\n\nSalento erwartet Sie mit offenen Armen! ${updatedNote(data, language)}`,
      fr: `📅 Le meilleur moment pour visiter Salento :\n\n✅ Les jours les plus ensoleillés de cette semaine sont : ${bestList}\n📊 Climat régional : la saison sèche va de décembre à mars (idéal pour la Vallée de Cocora et les randonnées) ; la saison des pluies a son charme avec ses caféiers verts et ses cascades puissantes.\n\nSalento vous attend les bras ouverts ! ${updatedNote(data, language)}`,
      pt: `📅 O melhor momento para visitar Salento:\n\n✅ Os dias mais ensolarados desta semana são: ${bestList}\n📊 Climatologia da região: a estação seca vai de dezembro a março (ideal para o Vale de Cocora e trilhas); a época chuvosa tem seu charme com cafezais verdes e cachoeiras caudalosas.\n\nSalento espera por você de braços abertos! ${updatedNote(data, language)}`,
      it: `📅 Il momento migliore per visitare Salento:\n\n✅ I giorni più soleggiati di questa settimana sono: ${bestList}\n📊 Climatologia della regione: la stagione secca va da dicembre a marzo (ideale per la Valle de Cocora e le escursioni); la stagione piovosa ha il suo fascino con piantagioni verdi e cascate impetuose.\n\nSalento ti aspetta a braccia aperte! ${updatedNote(data, language)}`,
    });
  },

  prediccionClima: async (language: string = 'es') => {
    const data = await getSafetyData();
    const hourly = data.weather?.hourly || [];
    const next24 = hourly.filter(h => new Date(h.time).getTime() <= Date.now() + 24 * 3600_000);

    const temps = next24.map(h => h.temp).filter((x): x is number => x != null);
    const maxTemp = temps.length ? Math.max(...temps) : null;
    const minTemp = temps.length ? Math.min(...temps) : null;
    const rainHours = next24.filter(h => (h.precipProb ?? 0) >= 50);

    const climateLine = rainHours.length > 0
      ? t(language, {
          es: `Con algunas lluvias suaves — el momento ideal para el tour cafetero, los museos y una buena taza de café de origen Quindío.`,
          en: `With some soft showers — the ideal time for the coffee tour, the museums and a good cup of Quindío origin coffee.`,
          de: `Mit einigen sanften Schauen — die ideale Zeit für die Kaffeetour, die Museen und eine gute Tasse Quindío-Kaffee.`,
          fr: `Avec quelques averses douces — le moment idéal pour le tour du café, les musées et une bonne tasse de café d'origine Quindío.`,
          pt: `Com algumas chuvas suaves — o momento ideal para o tour do café, os museus e uma boa xícara de café de origem Quindío.`,
          it: `Con qualche rovescio leggero — il momento ideale per il tour del caffè, i musei e una buona tazza di caffè d'origine Quindío.`,
        })
      : t(language, {
          es: `Despejado y soleado — perfecto para cabalgatas, caminatas a cascadas y miradores con la mejor vista.`,
          en: `Clear and sunny — perfect for horseback rides, waterfall hikes and viewpoints with the best views.`,
          de: `Klar und sonnig — perfekt für Reitausflüge, Wasserfallwanderungen und Aussichtspunkte mit der besten Aussicht.`,
          fr: `Dégagé et ensoleillé — parfait pour les balades à cheval, les randonnées vers les cascades et les belvédères avec les plus belles vues.`,
          pt: `Céu limpo e ensolarado — perfeito para cavalgadas, trilhas para cachoeiras e mirantes com as melhores vistas.`,
          it: `Sereno e soleggiato — perfetto per escursioni a cavallo, trekking alle cascate e belvedere con le viste migliori.`,
        });

    return t(language, {
      es: `🌤️ Pronóstico para las próximas 24 horas en Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'cálida de montaña'}\n${climateLine}\n\n${updatedNote(data, language)}`,
      en: `🌤️ Forecast for the next 24 hours in Salento:\n\n🌡️ Temperature: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'warm mountain weather'}\n${climateLine}\n\n${updatedNote(data, language)}`,
      de: `🌤️ Vorhersage für die nächsten 24 Stunden in Salento:\n\n🌡️ Temperatur: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'warmes Bergwetter'}\n${climateLine}\n\n${updatedNote(data, language)}`,
      fr: `🌤️ Prévisions pour les prochaines 24 heures à Salento :\n\n🌡️ Température : ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'temps de montagne doux'}\n${climateLine}\n\n${updatedNote(data, language)}`,
      pt: `🌤️ Previsão para as próximas 24 horas em Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'clima de montanha ameno'}\n${climateLine}\n\n${updatedNote(data, language)}`,
      it: `🌤️ Previsioni per le prossime 24 ore a Salento:\n\n🌡️ Temperatura: ${minTemp != null && maxTemp != null ? `${Math.round(minTemp)}–${Math.round(maxTemp)}°C` : 'meteo di montagna mite'}\n${climateLine}\n\n${updatedNote(data, language)}`,
    });
  },

  outlookSemana: async (language: string = 'es') => {
    return await TourismEnhancedResponses.planVisita(language);
  },
};

/** Detecta si una pregunta es una consulta predictiva */
export function isPredictiveQuery(query: string): boolean {
  const predictiveKeywords = [
    'mejor momento', 'best time', 'cuándo visitar', 'cuándo venir', 'cuándo ir',
    'when to visit', 'when should i visit',
    'predicción', 'prediction', 'mañana', 'tomorrow',
    'próxima semana', 'next week'
  ];
  const lowerQuery = query.toLowerCase();
  return predictiveKeywords.some(keyword => lowerQuery.includes(keyword));
}

/** Obtiene respuesta predictiva positiva con pronóstico real */
export async function getPredictiveResponse(query: string, language: string = 'es'): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('mejor momento') || lowerQuery.includes('best time') || lowerQuery.includes('cuándo visitar') || lowerQuery.includes('cuándo venir') || lowerQuery.includes('cuándo ir') || lowerQuery.includes('when to visit') || lowerQuery.includes('when should i visit')) {
    return await PredictiveEnhancedResponses.mejorMomentoVisitar(language);
  }

  if (lowerQuery.includes('mañana') || lowerQuery.includes('tomorrow') || (lowerQuery.includes('clima') && (lowerQuery.includes('será') || lowerQuery.includes('estará')))) {
    return await PredictiveEnhancedResponses.prediccionClima(language);
  }

  if (lowerQuery.includes('próxima semana') || lowerQuery.includes('next week')) {
    return await PredictiveEnhancedResponses.outlookSemana(language);
  }

  return null;
}
