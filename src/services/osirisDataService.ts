/**
 * Servicio que CONSUME datos de OSIRIS API
 * NO redirige a OSIRIS, solo obtiene datos JSON para enriquecer nuestro mapa
 * Fuente: https://osirisai.live/api
 * 57 endpoints disponibles - usando los más relevantes para turismo
 */
import { OsirisEarthquake, OsirisWeather, OsirisAirQuality, OsirisIncident, OsirisFire, OsirisNews, OsirisRegionDossier, OsirisData } from './osirisTypes';

const OSIRIS_API_BASE = 'https://osirisai.live/api';

class OsirisDataService {
  private baseUrl: string = OSIRIS_API_BASE;

  /**
   * Coordenadas de Salento, Quindío
   */
  private SALENTO_COORDS = { lat: 4.636, lng: -75.567 };

  /**
   * Fetch genérico con manejo de errores
   */
  private async fetchEndpoint<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        console.warn(`OSIRIS API error: ${response.status} for ${endpoint}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching OSIRIS ${endpoint}:`, error);
      return null;
    }
  }

  /**
   * Obtener terremotos recientes filtrados por cercanía a Salento
   */
  async getEarthquakesNearSalento(radiusKm: number = 100): Promise<OsirisEarthquake[]> {
    try {
      const data = await this.fetchEndpoint<OsirisEarthquake[]>('/earthquakes');
      if (!data) return [];

      return this.filterByDistance(data, this.SALENTO_COORDS.lat, this.SALENTO_COORDS.lng, radiusKm)
        .sort((a, b) => b.magnitude - a.magnitude); // Ordenar por magnitud descendente
    } catch (error) {
      console.error('Error fetching earthquakes from OSIRIS:', error);
      return [];
    }
  }

  /**
   * Obtener clima y eventos naturales para la región
   */
  async getWeatherForRegion(radiusKm: number = 200): Promise<OsirisWeather[]> {
    try {
      const data = await this.fetchEndpoint<OsirisWeather[]>('/weather');
      if (!data) return [];

      return this.filterByDistance(data, this.SALENTO_COORDS.lat, this.SALENTO_COORDS.lng, radiusKm);
    } catch (error) {
      console.error('Error fetching weather from OSIRIS:', error);
      return [];
    }
  }

  /**
   * Obtener calidad del aire
   */
  async getAirQuality(): Promise<OsirisAirQuality | null> {
    try {
      return await this.fetchEndpoint<OsirisAirQuality>('/air-quality');
    } catch (error) {
      console.error('Error fetching air quality from OSIRIS:', error);
      return null;
    }
  }

  /**
   * Obtener conflictos globales filtrados por Colombia
   * Endpoint corregido: /conflicts (no /incidents que no existe)
   */
  async getConflictsInColombia(): Promise<OsirisIncident[]> {
    try {
      const data = await this.fetchEndpoint<OsirisIncident[]>('/conflicts');
      if (!data) return [];

      // Colombia bounds aprox: lat 4°S - 12°N, lng 79°W - 66°W
      return data.filter(inc =>
        inc.lat >= -4 && inc.lat <= 12 &&
        inc.lng >= -79 && inc.lng <= -66
      );
    } catch (error) {
      console.error('Error fetching conflicts from OSIRIS:', error);
      return [];
    }
  }

  /**
   * Obtener todos los datos relevantes para Salento en una sola llamada
   */
  async getSalentoData(): Promise<{
    earthquakes: OsirisEarthquake[];
    weather: OsirisWeather[];
    airQuality: OsirisAirQuality | null;
    conflicts: OsirisIncident[];
  }> {
    const [earthquakes, weather, airQuality, conflicts] = await Promise.all([
      this.getEarthquakesNearSalento(),
      this.getWeatherForRegion(),
      this.getAirQuality(),
      this.getConflictsInColombia()
    ]);

    return {
      earthquakes,
      weather,
      airQuality,
      conflicts
    };
  }

  /**
   * Filtrar por distancia desde un punto (Haversine formula)
   */
  private filterByDistance(items: any[], lat: number, lng: number, radiusKm: number): any[] {
    return items.filter(item => {
      const distance = this.calculateDistance(lat, lng, item.lat, item.lng);
      return distance <= radiusKm;
    });
  }

  /**
   * Calcular distancia entre dos coordenadas (Haversine)
   * Retorna distancia en kilómetros
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Obtener estadísticas generales (liviano, para monitoreo)
   */
  async getStats(): Promise<any | null> {
    try {
      return await this.fetchEndpoint('/stats');
    } catch (error) {
      console.error('Error fetching stats from OSIRIS:', error);
      return null;
    }
  }

  /**
   * Obtener incendios forestales cerca de Salento (NASA FIRMS)
   */
  async getFiresNearSalento(radiusKm: number = 150): Promise<OsirisFire[]> {
    try {
      const data = await this.fetchEndpoint<OsirisFire[]>('/fires');
      if (!data) return [];

      return this.filterByDistance(data, this.SALENTO_COORDS.lat, this.SALENTO_COORDS.lng, radiusKm)
        .sort((a, b) => b.brightness - a.brightness); // Ordenar por brillo descendente
    } catch (error) {
      console.error('Error fetching fires from OSIRIS:', error);
      return [];
    }
  }

  /**
   * Obtener noticias geolocalizadas relevantes para Colombia/Salento
   */
  async getNewsForRegion(radiusKm: number = 200): Promise<OsirisNews[]> {
    try {
      const data = await this.fetchEndpoint<OsirisNews[]>('/news');
      if (!data) return [];

      // Filtrar por ubicación si tiene coordenadas, o por riesgo_score alto
      const newsWithLocation = data.filter(item =>
        item.lat && item.lng &&
        this.calculateDistance(this.SALENTO_COORDS.lat, this.SALENTO_COORDS.lng, item.lat, item.lng) <= radiusKm
      );

      // Si hay pocas noticias con ubicación, agregar noticias de alto riesgo global
      const highRiskNews = data.filter(item => item.risk_score >= 5);

      // Combinar y deduplicar
      const combined = [...newsWithLocation, ...highRiskNews];
      const unique = combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );

      return unique.slice(0, 10); // Máximo 10 noticias
    } catch (error) {
      console.error('Error fetching news from OSIRIS:', error);
      return [];
    }
  }

  /**
   * Obtener dossier de región para una ubicación específica
   * Útil para doble click en el mapa
   */
  async getRegionDossier(lat: number, lng: number): Promise<OsirisRegionDossier | null> {
    try {
      // OSIRIS no tiene endpoint directo para region-dossier con parámetros
      // Este endpoint es usado internamente por el dashboard de OSIRIS
      // Por ahora, retornamos null ya que requiere parámetros específicos del backend
      console.warn('Region dossier requires backend-specific parameters - not implemented yet');
      return null;
    } catch (error) {
      console.error('Error fetching region dossier from OSIRIS:', error);
      return null;
    }
  }

  /**
   * Obtener datos expandidos para Salento (incluyendo fires y news)
   */
  async getExpandedSalentoData(): Promise<OsirisData> {
    const [earthquakes, weather, airQuality, conflicts, fires, news] = await Promise.all([
      this.getEarthquakesNearSalento(),
      this.getWeatherForRegion(),
      this.getAirQuality(),
      this.getConflictsInColombia(),
      this.getFiresNearSalento(),
      this.getNewsForRegion()
    ]);

    return {
      earthquakes,
      weather,
      airQuality,
      conflicts,
      fires,
      news,
      lastUpdate: new Date().toISOString(),
      isOnline: navigator.onLine
    };
  }
}

export const osirisDataService = new OsirisDataService();
export default osirisDataService;
