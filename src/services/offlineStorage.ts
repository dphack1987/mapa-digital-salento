// Servicio de almacenamiento offline usando IndexedDB
// Permite persistir datos críticos para funcionamiento sin conexión

interface StorageConfig {
  dbName: string
  version: number
  stores: {
    places: string
    hotels: string
    orders: string
    userPreferences: string
    mapData: string
  }
}

const CONFIG: StorageConfig = {
  dbName: 'salento-offline-db',
  version: 1,
  stores: {
    places: 'places',
    hotels: 'hotels',
    orders: 'orders',
    userPreferences: 'userPreferences',
    mapData: 'mapData'
  }
}

interface OfflineOrder {
  id: string
  timestamp: number
  status: 'pending' | 'synced' | 'failed'
  orderData: any
  retryCount: number
}

interface UserPreferences {
  language: string
  currency: string
  lastLocation?: {
    lat: number
    lng: number
    timestamp: number
  }
  favoritePlaces: number[]
}

class OfflineStorageService {
  private db: IDBDatabase | null = null
  private initialized = false

  /**
   * Inicializar la base de datos IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CONFIG.dbName, CONFIG.version)

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        this.initialized = true
        console.log('IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Crear stores si no existen
        if (!db.objectStoreNames.contains(CONFIG.stores.places)) {
          const placesStore = db.createObjectStore(CONFIG.stores.places, { keyPath: 'id' })
          placesStore.createIndex('type', 'type', { unique: false })
          placesStore.createIndex('verified', 'verified', { unique: false })
        }

        if (!db.objectStoreNames.contains(CONFIG.stores.hotels)) {
          const hotelsStore = db.createObjectStore(CONFIG.stores.hotels, { keyPath: 'id' })
          hotelsStore.createIndex('isPartner', 'isPartner', { unique: false })
        }

        if (!db.objectStoreNames.contains(CONFIG.stores.orders)) {
          const ordersStore = db.createObjectStore(CONFIG.stores.orders, { keyPath: 'id' })
          ordersStore.createIndex('status', 'status', { unique: false })
          ordersStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains(CONFIG.stores.userPreferences)) {
          db.createObjectStore(CONFIG.stores.userPreferences, { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains(CONFIG.stores.mapData)) {
          const mapStore = db.createObjectStore(CONFIG.stores.mapData, { keyPath: 'key' })
          mapStore.createIndex('lastUpdated', 'lastUpdated', { unique: false })
        }
      }
    })
  }

  /**
   * Guardar múltiples lugares
   */
  async savePlaces(places: any[]): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.places], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.places)

      places.forEach(place => {
        store.put(place)
      })

      transaction.oncomplete = () => {
        console.log(`Saved ${places.length} places to IndexedDB`)
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error saving places:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Obtener todos los lugares
   */
  async getPlaces(): Promise<any[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.places], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.places)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error getting places:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Obtener lugares por categoría
   */
  async getPlacesByType(type: string): Promise<any[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.places], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.places)
      const index = store.index('type')
      const request = index.getAll(type)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error getting places by type:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Obtener solo lugares verificados
   */
  async getVerifiedPlaces(): Promise<any[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.places], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.places)
      const index = store.index('verified')
      const request = index.getAll(true)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error getting verified places:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Guardar hoteles
   */
  async saveHotels(hotels: any[]): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.hotels], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.hotels)

      hotels.forEach(hotel => {
        store.put(hotel)
      })

      transaction.oncomplete = () => {
        console.log(`Saved ${hotels.length} hotels to IndexedDB`)
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error saving hotels:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Obtener hoteles
   */
  async getHotels(): Promise<any[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.hotels], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.hotels)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error getting hotels:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Guardar pedido offline
   */
  async saveOrder(order: OfflineOrder): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.orders], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.orders)
      store.put(order)

      transaction.oncomplete = () => {
        console.log('Saved order to IndexedDB:', order.id)
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error saving order:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Obtener pedidos pendientes
   */
  async getPendingOrders(): Promise<OfflineOrder[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.orders], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.orders)
      const index = store.index('status')
      const request = index.getAll('pending')

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error getting pending orders:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Actualizar estado de pedido
   */
  async updateOrderStatus(orderId: string, status: 'pending' | 'synced' | 'failed'): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.orders], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.orders)
      const request = store.get(orderId)

      request.onsuccess = () => {
        const order = request.result
        if (order) {
          order.status = status
          store.put(order)
        }
        resolve()
      }

      request.onerror = () => {
        console.error('Error updating order status:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Guardar preferencias de usuario
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.userPreferences], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.userPreferences)
      store.put({ key: 'preferences', ...preferences })

      transaction.oncomplete = () => {
        console.log('Saved user preferences to IndexedDB')
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error saving user preferences:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Obtener preferencias de usuario
   */
  async getUserPreferences(): Promise<UserPreferences | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.userPreferences], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.userPreferences)
      const request = store.get('preferences')

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        console.error('Error getting user preferences:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Agregar lugar a favoritos
   */
  async addToFavorites(placeId: number): Promise<void> {
    const prefs = await this.getUserPreferences()
    if (prefs) {
      if (!prefs.favoritePlaces.includes(placeId)) {
        prefs.favoritePlaces.push(placeId)
        await this.saveUserPreferences(prefs)
      }
    }
  }

  /**
   * Remover lugar de favoritos
   */
  async removeFromFavorites(placeId: number): Promise<void> {
    const prefs = await this.getUserPreferences()
    if (prefs) {
      prefs.favoritePlaces = prefs.favoritePlaces.filter(id => id !== placeId)
      await this.saveUserPreferences(prefs)
    }
  }

  /**
   * Guardar datos del mapa offline
   */
  async saveMapData(key: string, data: any): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.mapData], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.mapData)
      store.put({ key, data, lastUpdated: Date.now() })

      transaction.oncomplete = () => {
        console.log('Saved map data to IndexedDB:', key)
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error saving map data:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Obtener datos del mapa offline
   */
  async getMapData(key: string): Promise<any | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.mapData], 'readonly')
      const store = transaction.objectStore(CONFIG.stores.mapData)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result?.data || null)
      }

      request.onerror = () => {
        console.error('Error getting map data:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Limpiar datos antiguos (más de 7 días)
   */
  async cleanOldData(): Promise<void> {
    if (!this.db) await this.initialize()

    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.stores.orders], 'readwrite')
      const store = transaction.objectStore(CONFIG.stores.orders)
      const index = store.index('timestamp')
      const request = index.openCursor(IDBKeyRange.upperBound(sevenDaysAgo))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }

      transaction.oncomplete = () => {
        console.log('Cleaned old data from IndexedDB')
        resolve()
      }

      transaction.onerror = () => {
        console.error('Error cleaning old data:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  /**
   * Verificar si hay conexión a internet
   */
  isOnline(): boolean {
    return navigator.onLine
  }

  /**
   * Escuchar cambios de conexión
   */
  onConnectionChange(callback: (online: boolean) => void): () => void {
    const handler = () => callback(navigator.onLine)
    window.addEventListener('online', handler)
    window.addEventListener('offline', handler)

    return () => {
      window.removeEventListener('online', handler)
      window.removeEventListener('offline', handler)
    }
  }

  /**
   * Obtener tamaño de almacenamiento usado
   */
  async getStorageSize(): Promise<number> {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate()
        return estimate.usage || 0
      } catch (error) {
        console.error('Error getting storage size:', error)
      }
    }
    return 0
  }
}

// Exportar instancia singleton
export const offlineStorage = new OfflineStorageService()
export default offlineStorage