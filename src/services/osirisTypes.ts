// Tipos para datos de OSIRIS AI
// Fuente: https://osirisai.live/api
// 57 endpoints disponibles - expandiendo para más datos

export interface OsirisEarthquake {
  id: string;
  magnitude: number;
  location: string;
  lat: number;
  lng: number;
  depth: number;
  time: string; // ISO 8601
  place: string;
  type: string;
}

export interface OsirisWeather {
  id: string;
  event: string;
  description: string;
  lat: number;
  lng: number;
  time: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface OsirisAirQuality {
  location: string;
  aqi: number; // Air Quality Index
  pm25: number;
  pm10: number;
  timestamp: string;
}

export interface OsirisIncident {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  severity: string;
  time: string;
}

// Nuevos tipos para endpoints adicionales de OSIRIS

export interface OsirisFire {
  id: string;
  title: string;
  lat: number;
  lng: number;
  brightness: number;
  confidence: number;
  satellite: string;
  datetime: string;
  type: 'wildfire' | 'volcano';
}

export interface OsirisNews {
  id: string;
  title: string;
  source: string;
  url: string;
  published: string;
  category: string;
  risk_score: number;
  lat?: number;
  lng?: number;
}

export interface OsirisRegionDossier {
  location: string;
  lat: number;
  lng: number;
  earthquakes: number;
  fires: number;
  conflicts: number;
  news_items: number;
  summary: string;
  timestamp: string;
}

export interface OsirisStats {
  flights: number;
  sats: number;
  cctv: number;
  weather: number;
  nuclear: number;
  incidents: number;
  timestamp: string;
}

export interface OsirisData {
  earthquakes: OsirisEarthquake[];
  weather: OsirisWeather[];
  airQuality: OsirisAirQuality | null;
  conflicts: OsirisIncident[];
  fires: OsirisFire[];
  news: OsirisNews[];
  lastUpdate: string;
  isOnline: boolean;
}

// ==============================
// Tipos Turísticos (Fase 2)
// ==============================

export interface TourismImpact {
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  impact: string;
  recommendation: string;
  affectedAreas: string[];
  alternativeRoutes: string[];
}

export interface ActivityRecommendation {
  activity: string;
  status: 'recommended' | 'cautious' | 'not_recommended';
  reason: string;
  alternatives: string[];
}

export interface GroupRecommendation {
  general: 'safe' | 'caution' | 'avoid';
  elderly: 'safe' | 'limit_exercise' | 'avoid';
  children: 'safe' | 'limit_exposure' | 'avoid';
  asthma: 'safe' | 'limit' | 'avoid';
}

export interface TourismAlert {
  type: 'earthquake' | 'weather' | 'fire' | 'air_quality';
  severity: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  affectedActivities: string[];
  recommendation: string;
  validUntil: Date;
}

export interface SafeWindowPrediction {
  safeWindows: {from: Date, to: Date}[];
  riskWindows: {from: Date, to: Date, reason: string}[];
  confidence: number;
  factors: string[];
}

export interface AdaptiveItinerary {
  day: Array<{
    time: string;
    activity: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  alternatives: string[];
  totalRiskScore: number;
}

// Tipos predictivos (Fase 3)
export interface TimeRecommendation {
  bestMonths: string[];
  bestHours: string[];
  avoidPeriods: string[];
  reason: string;
}
