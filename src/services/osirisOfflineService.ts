/**
 * Servicio offline con caché para datos de OSIRIS
 * Usa IndexedDB (offlineStorage existente) para persistencia
 * Permite acceso a datos de seguridad cuando no hay conexión
 */
import { OsirisEarthquake, OsirisWeather, OsirisAirQuality, OsirisIncident, OsirisFire, OsirisNews, OsirisData } from './osirisTypes';
import offlineStorage from './offlineStorage';
import osirisDataService from './osirisDataService';

const CACHE_KEYS = {
  EARTHQUAKES: 'osiris_earthquakes',
  WEATHER: 'osiris_weather',
  AIR_QUALITY: 'osiris_air_quality',
  CONFLICTS: 'osiris_conflicts',
  FIRES: 'osiris_fires',
  NEWS: 'osiris_news',
  LAST_UPDATE: 'osiris_last_update'
};

const CACHE_DURATION = {
  EARTHQUAKES: 24 * 60 * 60 * 1000, // 24 horas
  WEATHER: 6 * 60 * 60 * 1000,      // 6 horas
  AIR_QUALITY: 12 * 60 * 60 * 1000, // 12 horas
  CONFLICTS: 24 * 60 * 60 * 1000,   // 24 horas
  FIRES: 3 * 60 * 60 * 1000,        // 3 horas (los incendios cambian rápido)
  NEWS: 1 * 60 * 60 * 1000          // 1 hora (noticias cambian muy rápido)
};

class OsirisOfflineService {
  /**
   * Actualizar todos los datos (solo cuando hay conexión)
   */
  async refreshAllData(): Promise<void> {
    if (!navigator.onLine) {
      console.log('OSIRIS: Offline mode - skipping refresh');
      return;
    }

    try {
      console.log('OSIRIS: Refreshing data...');

      const data = await osirisDataService.getExpandedSalentoData();

      // Guardar en IndexedDB usando el sistema existente
      await offlineStorage.saveMapData(CACHE_KEYS.EARTHQUAKES, data.earthquakes);
      await offlineStorage.saveMapData(CACHE_KEYS.WEATHER, data.weather);
      await offlineStorage.saveMapData(CACHE_KEYS.AIR_QUALITY, data.airQuality);
      await offlineStorage.saveMapData(CACHE_KEYS.CONFLICTS, data.conflicts);
      await offlineStorage.saveMapData(CACHE_KEYS.FIRES, data.fires);
      await offlineStorage.saveMapData(CACHE_KEYS.NEWS, data.news);

      // Guardar timestamp en localStorage
      localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());

      console.log('OSIRIS: Data refreshed successfully');
    } catch (error) {
      console.error('OSIRIS: Error refreshing data:', error);
    }
  }

  /**
   * Obtener datos cacheados (funciona offline)
   */
  async getCachedData(): Promise<OsirisData> {
    const [earthquakes, weather, airQuality, conflicts, fires, news] = await Promise.all([
      offlineStorage.getMapData(CACHE_KEYS.EARTHQUAKES),
      offlineStorage.getMapData(CACHE_KEYS.WEATHER),
      offlineStorage.getMapData(CACHE_KEYS.AIR_QUALITY),
      offlineStorage.getMapData(CACHE_KEYS.CONFLICTS),
      offlineStorage.getMapData(CACHE_KEYS.FIRES),
      offlineStorage.getMapData(CACHE_KEYS.NEWS)
    ]);

    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);

    return {
      earthquakes: earthquakes || [],
      weather: weather || [],
      airQuality: airQuality || null,
      conflicts: conflicts || [],
      fires: fires || [],
      news: news || [],
      lastUpdate: lastUpdate || new Date().toISOString(),
      isOnline: navigator.onLine
    };
  }

  /**
   * Obtener solo terremotos cacheados
   */
  async getCachedEarthquakes(): Promise<OsirisEarthquake[]> {
    const data = await offlineStorage.getMapData(CACHE_KEYS.EARTHQUAKES);
    return data || [];
  }

  /**
   * Obtener solo clima cacheado
   */
  async getCachedWeather(): Promise<OsirisWeather[]> {
    const data = await offlineStorage.getMapData(CACHE_KEYS.WEATHER);
    return data || [];
  }

  /**
   * Obtener solo calidad del aire cacheada
   */
  async getCachedAirQuality(): Promise<OsirisAirQuality | null> {
    const data = await offlineStorage.getMapData(CACHE_KEYS.AIR_QUALITY);
    return data || null;
  }

  /**
   * Verificar si el caché está expirado
   */
  isCacheExpired(key: string): boolean {
    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return true;

    const age = Date.now() - parseInt(lastUpdate);
    const duration = CACHE_DURATION[key as keyof typeof CACHE_DURATION] || CACHE_DURATION.EARTHQUAKES;

    return age > duration;
  }

  /**
   * Obtener tiempo desde última actualización (en formato legible)
   */
  getLastUpdateFormatted(): string {
    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return 'Nunca';

    const diff = Date.now() - parseInt(lastUpdate);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }

    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }

  /**
   * Limpiar caché (para debugging o actualización forzada)
   */
  async clearCache(): Promise<void> {
    try {
      await offlineStorage.deleteMapData(CACHE_KEYS.EARTHQUAKES);
      await offlineStorage.deleteMapData(CACHE_KEYS.WEATHER);
      await offlineStorage.deleteMapData(CACHE_KEYS.AIR_QUALITY);
      await offlineStorage.deleteMapData(CACHE_KEYS.CONFLICTS);
      await offlineStorage.deleteMapData(CACHE_KEYS.FIRES);
      await offlineStorage.deleteMapData(CACHE_KEYS.NEWS);
      localStorage.removeItem(CACHE_KEYS.LAST_UPDATE);
      console.log('OSIRIS: Cache cleared');
    } catch (error) {
      console.error('OSIRIS: Error clearing cache:', error);
    }
  }

  /**
   * Inicializar caché con datos frescos si está vacío
   */
  async initializeIfNeeded(): Promise<void> {
    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    if (!lastUpdate && navigator.onLine) {
      console.log('OSIRIS: First time - initializing cache');
      await this.refreshAllData();
    }
  }
}

export const osirisOfflineService = new OsirisOfflineService();
export default osirisOfflineService;
