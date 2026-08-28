import { Place, MapMarker, Hotel, ProductCatalog, SystemData } from '../types'
import offlineStorage from './offlineStorage'

// Configuración del servicio de datos
const DATA_CONFIG = {
  useLocalStorage: true, // Cachear datos en localStorage
  useIndexedDB: true, // Usar IndexedDB para datos offline
  apiEndpoint: null, // Futuro: URL del backend
  defaultDataSources: {
    places: '/data/places.json',
    hotels: '/data/hotels.json',
    mapMarkers: '/data/mapMarkers.json',
    products: '/data/products.json'
  }
}

// Claves para localStorage
const CACHE_KEYS = {
  PLACES: 'salento_places_cache',
  HOTELS: 'salento_hotels_cache',
  MAP_MARKERS: 'salento_map_markers_cache',
  PRODUCTS: 'salento_products_cache',
  LAST_UPDATE: 'salento_data_last_update'
}

// Tiempo de caché en milisegundos (1 hora)
const CACHE_DURATION = 60 * 60 * 1000

/**
 * Servicio de datos para cargar y gestionar la información del sistema
 * Soporta carga desde archivos JSON locales o API externa
 */
class DataService {
  private dataCache: SystemData | null = null
  private cacheTimestamp: number = 0

  /**
   * Cargar datos desde archivos JSON locales
   */
  private async loadFromJSON<T>(filePath: string): Promise<T> {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Error loading ${filePath}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error loading JSON from ${filePath}:`, error)
      throw error
    }
  }

  /**
   * Cargar datos desde localStorage si están disponibles y vigentes
   */
  private loadFromCache<T>(key: string): T | null {
    if (!DATA_CONFIG.useLocalStorage) return null

    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const data = JSON.parse(cached)
      const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE)
      
      if (lastUpdate && Date.now() - parseInt(lastUpdate) < CACHE_DURATION) {
        return data
      }
      
      // Caché expirado, limpiar
      localStorage.removeItem(key)
      return null
    } catch (error) {
      console.error('Error loading from cache:', error)
      return null
    }
  }

  /**
   * Guardar datos en localStorage
   */
  private saveToCache<T>(key: string, data: T): void {
    if (!DATA_CONFIG.useLocalStorage) return

    try {
      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString())
    } catch (error) {
      console.error('Error saving to cache:', error)
    }
  }

  /**
   * Cargar todos los datos del sistema
   */
  async loadSystemData(): Promise<SystemData> {
    // Verificar si tenemos caché vigente
    if (this.dataCache && Date.now() - this.cacheTimestamp < CACHE_DURATION) {
      return this.dataCache
    }

    try {
      // Inicializar IndexedDB si está habilitado
      if (DATA_CONFIG.useIndexedDB) {
        await offlineStorage.initialize()
      }

      // Intentar cargar desde IndexedDB primero (modo offline优先)
      if (DATA_CONFIG.useIndexedDB && !navigator.onLine) {
        try {
          const offlinePlaces = await offlineStorage.getPlaces()
          const offlineHotels = await offlineStorage.getHotels()
          
          if (offlinePlaces.length > 0 && offlineHotels.length > 0) {
            console.log('Loading data from IndexedDB (offline mode)')
            this.dataCache = {
              places: offlinePlaces,
              mapMarkers: [], // Los marcadores se cargarían de otra fuente
              hotels: offlineHotels,
              productCatalogs: [],
              lastUpdated: new Date().toISOString(),
              version: '1.0.0'
            }
            this.cacheTimestamp = Date.now()
            return this.dataCache
          }
        } catch (error) {
          console.error('Error loading from IndexedDB, falling back to network:', error)
        }
      }

      // Intentar cargar desde caché local
      const cachedPlaces = this.loadFromCache<{ places: Place[] }>(CACHE_KEYS.PLACES)
      const cachedHotels = this.loadFromCache<{ hotels: Hotel[] }>(CACHE_KEYS.HOTELS)
      const cachedMarkers = this.loadFromCache<{ mapMarkers: MapMarker[] }>(CACHE_KEYS.MAP_MARKERS)
      const cachedProducts = this.loadFromCache<{ productCatalogs: ProductCatalog[] }>(CACHE_KEYS.PRODUCTS)

      if (cachedPlaces && cachedHotels && cachedMarkers && cachedProducts) {
        this.dataCache = {
          places: cachedPlaces.places,
          mapMarkers: cachedMarkers.mapMarkers,
          hotels: cachedHotels.hotels,
          productCatalogs: cachedProducts.productCatalogs,
          lastUpdated: localStorage.getItem(CACHE_KEYS.LAST_UPDATE) || new Date().toISOString(),
          version: '1.0.0'
        }
        this.cacheTimestamp = Date.now()
        return this.dataCache
      }

      // Cargar desde archivos JSON
      const [placesData, hotelsData, markersData, productsData] = await Promise.all([
        this.loadFromJSON<{ places: Place[] }>(DATA_CONFIG.defaultDataSources.places),
        this.loadFromJSON<{ hotels: Hotel[] }>(DATA_CONFIG.defaultDataSources.hotels),
        this.loadFromJSON<{ mapMarkers: MapMarker[] }>(DATA_CONFIG.defaultDataSources.mapMarkers),
        this.loadFromJSON<{ productCatalogs: ProductCatalog[] }>(DATA_CONFIG.defaultDataSources.products)
      ])

      this.dataCache = {
        places: placesData.places,
        mapMarkers: markersData.mapMarkers,
        hotels: hotelsData.hotels,
        productCatalogs: productsData.productCatalogs,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      }
      this.cacheTimestamp = Date.now()

      // Guardar en caché localStorage
      this.saveToCache(CACHE_KEYS.PLACES, placesData)
      this.saveToCache(CACHE_KEYS.HOTELS, hotelsData)
      this.saveToCache(CACHE_KEYS.MAP_MARKERS, markersData)
      this.saveToCache(CACHE_KEYS.PRODUCTS, productsData)

      // Guardar en IndexedDB para offline
      if (DATA_CONFIG.useIndexedDB) {
        try {
          await offlineStorage.savePlaces(placesData.places)
          await offlineStorage.saveHotels(hotelsData.hotels)
          console.log('Data saved to IndexedDB for offline use')
        } catch (error) {
          console.error('Error saving to IndexedDB:', error)
        }
      }

      return this.dataCache

    } catch (error) {
      console.error('Error loading system data:', error)
      throw new Error('No se pudieron cargar los datos del sistema')
    }
  }

  /**
   * Obtener todos los lugares
   */
  async getPlaces(): Promise<Place[]> {
    const data = await this.loadSystemData()
    return data.places.filter(place => place.active)
  }

  /**
   * Obtener un lugar por ID
   */
  async getPlaceById(id: number): Promise<Place | undefined> {
    const places = await this.getPlaces()
    return places.find(place => place.id === id)
  }

  /**
   * Obtener lugares por categoría
   */
  async getPlacesByCategory(category: string): Promise<Place[]> {
    const places = await this.getPlaces()
    if (category === 'Todo') return places
    return places.filter(place => place.type === category)
  }

  /**
   * Buscar lugares por texto
   */
  async searchPlaces(query: string): Promise<Place[]> {
    const places = await this.getPlaces()
    const normalizedQuery = query.toLowerCase().trim()
    
    if (!normalizedQuery) return places

    return places.filter(place => {
      const searchableText = `${place.name} ${place.description} ${place.tags?.join(' ') || ''}`.toLowerCase()
      return searchableText.includes(normalizedQuery)
    })
  }

  /**
   * Obtener solo lugares verificados comercialmente
   */
  async getVerifiedPlaces(): Promise<Place[]> {
    const places = await this.getPlaces()
    return places.filter(place => place.verified)
  }

  /**
   * Obtener marcadores del mapa
   */
  async getMapMarkers(): Promise<MapMarker[]> {
    const data = await this.loadSystemData()
    return data.mapMarkers
  }

  /**
   * Obtener marcadores filtrados por tipo
   */
  async getMapMarkersByType(type: string): Promise<MapMarker[]> {
    const markers = await this.getMapMarkers()
    if (type === 'Todo') return markers
    return markers.filter(marker => marker.type === type)
  }

  /**
   * Obtener hoteles para formulario de pedidos
   */
  async getHotels(): Promise<Hotel[]> {
    const data = await this.loadSystemData()
    return data.hotels
  }

  /**
   * Obtener catálogo de productos de un comercio
   */
  async getProductCatalog(commerceId: number): Promise<ProductCatalog | undefined> {
    const data = await this.loadSystemData()
    return data.productCatalogs.find(catalog => catalog.commerceId === commerceId)
  }

  /**
   * Obtener todos los catálogos de productos
   */
  async getAllProductCatalogs(): Promise<ProductCatalog[]> {
    const data = await this.loadSystemData()
    return data.productCatalogs
  }

  /**
   * Invalidar caché (forzar recarga de datos)
   */
  invalidateCache(): void {
    this.dataCache = null
    this.cacheTimestamp = 0
    
    if (DATA_CONFIG.useLocalStorage) {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  }

  /**
   * Método futuro para actualizar datos desde API
   */
  async updateFromAPI(): Promise<SystemData> {
    // Este método se implementará cuando tengamos backend
    // Por ahora solo invalida caché y recarga desde JSON
    this.invalidateCache()
    return this.loadSystemData()
  }
}

// Exportar instancia singleton
export const dataService = new DataService()
export default dataService