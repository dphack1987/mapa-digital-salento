// Servicio de datos de seguridad y clima para Salento.
// Lee /data/safety-data.json (same-origin), generado en build por
// scripts/fetch-safety-data.mjs desde Open-Meteo (clima).
// Sin llamadas a terceros en runtime: sin CORS, funciona offline via SW.

export interface SafetyWeatherCurrent {
  time: string | null;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  precipitation: number | null;
  weatherCode: number | null;
  windSpeed: number | null;
  windGusts: number | null;
}

export interface SafetyWeatherHour {
  time: string;
  temp: number | null;
  precipProb: number | null;
  weatherCode: number | null;
}

export interface SafetyWeatherDay {
  date: string;
  weatherCode: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipProbMax: number | null;
}

export interface SafetyWeather {
  current: SafetyWeatherCurrent;
  hourly: SafetyWeatherHour[];
  daily: SafetyWeatherDay[];
}

export interface SafetyData {
  generatedAt: string;
  location: { name: string; lat: number; lng: number };
  weather: SafetyWeather | null;
}

const EMPTY: SafetyData = {
  generatedAt: '',
  location: { name: 'Salento, Quindío, Colombia', lat: 4.636, lng: -75.567 },
  weather: null,
};

let cached: SafetyData | null = null;

export async function getSafetyData(): Promise<SafetyData> {
  if (cached) return cached;
  try {
    const res = await fetch('/data/safety-data.json');
    if (!res.ok) return EMPTY;
    cached = (await res.json()) as SafetyData;
    return cached;
  } catch {
    return EMPTY;
  }
}

/** Descripción legible de un weather_code WMO */
export function weatherCodeLabel(code: number | null, lang: string = 'es'): string {
  const labels: Record<number, Record<string, string>> = {
    0: { es: 'despejado', en: 'clear sky', de: 'klar', fr: 'ciel dégagé', pt: 'céu limpo', it: 'sereno' },
    1: { es: 'mayormente despejado', en: 'mainly clear', de: 'überwiegend klar', fr: 'plutôt dégagé', pt: 'majoritariamente limpo', it: 'prevalentemente sereno' },
    2: { es: 'parcialmente nublado', en: 'partly cloudy', de: 'teilweise bewölkt', fr: 'partiellement nuageux', pt: 'parcialmente nublado', it: 'parzialmente nuvoloso' },
    3: { es: 'nublado', en: 'overcast', de: 'bedeckt', fr: 'couvert', pt: 'nublado', it: 'coperto' },
    45: { es: 'niebla', en: 'fog', de: 'Nebel', fr: 'brouillard', pt: 'nevoeiro', it: 'nebbia' },
    48: { es: 'niebla con escarcha', en: 'depositing rime fog', de: 'Reifnebel', fr: 'brouillard givrant', pt: 'nevoeiro congelante', it: 'nebbia gelata' },
    51: { es: 'llovizna ligera', en: 'light drizzle', de: 'leichter Nieselregen', fr: 'bruine légère', pt: 'garoa leve', it: 'pioviggine leggera' },
    53: { es: 'llovizna', en: 'drizzle', de: 'Nieselregen', fr: 'bruine', pt: 'garoa', it: 'pioviggine' },
    55: { es: 'llovizna intensa', en: 'heavy drizzle', de: 'starker Nieselregen', fr: 'bruine forte', pt: 'garoa forte', it: 'pioviggine intensa' },
    61: { es: 'lluvia ligera', en: 'light rain', de: 'leichter Regen', fr: 'pluie légère', pt: 'chuva leve', it: 'pioggia leggera' },
    63: { es: 'lluvia', en: 'rain', de: 'Regen', fr: 'pluie', pt: 'chuva', it: 'pioggia' },
    65: { es: 'lluvia intensa', en: 'heavy rain', de: 'starker Regen', fr: 'forte pluie', pt: 'chuva forte', it: 'pioggia intensa' },
    71: { es: 'nieve ligera', en: 'light snow', de: 'leichter Schnee', fr: 'neige légère', pt: 'neve leve', it: 'neve leggera' },
    73: { es: 'nieve', en: 'snow', de: 'Schnee', fr: 'neige', pt: 'neve', it: 'neve' },
    80: { es: 'chubascos ligeros', en: 'light showers', de: 'leichte Schauer', fr: 'légères averses', pt: 'aguaceiros leves', it: 'rovesci leggeri' },
    81: { es: 'chubascos', en: 'showers', de: 'Schauer', fr: 'averses', pt: 'aguaceiros', it: 'rovesci' },
    82: { es: 'chubascos intensos', en: 'heavy showers', de: 'starke Schauer', fr: 'fortes averses', pt: 'aguaceiros fortes', it: 'forti rovesci' },
    95: { es: 'tormenta eléctrica', en: 'thunderstorm', de: 'Gewitter', fr: 'orage', pt: 'trovoada', it: 'temporale' },
    96: { es: 'tormenta con granizo', en: 'thunderstorm with hail', de: 'Gewitter mit Hagel', fr: 'orage avec grêle', pt: 'trovoada com granizo', it: 'temporale con grandine' },
    99: { es: 'tormenta con granizo fuerte', en: 'thunderstorm with heavy hail', de: 'Gewitter mit starkem Hagel', fr: 'orage avec forte grêle', pt: 'trovoada com granizo forte', it: 'temporale con forte grandine' },
  };
  const entry = labels[code ?? -1];
  if (entry) return entry[lang] || entry.es;
  if (code == null) return lang === 'es' ? 'sin datos' : 'no data';
  return `${lang === 'es' ? 'condición' : 'condition'} ${code}`;
}

/** Horas con probabilidad de lluvia >= umbral en las próximas N horas */
export function rainyHours(data: SafetyData, hours = 48, minProb = 50): SafetyWeatherHour[] {
  if (!data.weather) return [];
  return data.weather.hourly.filter(h => (h.precipProb ?? 0) >= minProb).slice(0, hours);
}

/** Días de la semana con prob. de lluvia alta */
export function rainyDays(data: SafetyData, minProb = 60): SafetyWeatherDay[] {
  if (!data.weather) return [];
  return data.weather.daily.filter(d => (d.precipProbMax ?? 0) >= minProb);
}

/** Formatea fecha ISO a "4 nov" según idioma */
export function formatDay(dateStr: string, lang: string = 'es'): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(lang === 'es' ? 'es-CO' : lang, { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export function timeAgo(iso: string | null, lang: string = 'es'): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600_000);
  if (hours < 1) return lang === 'es' ? 'hace minutos' : 'minutes ago';
  if (hours < 24) return lang === 'es' ? `hace ${hours} h` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === 'es' ? `hace ${days} día${days > 1 ? 's' : ''}` : `${days}d ago`;
}
