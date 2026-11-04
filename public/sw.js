const CACHE_NAME = 'salento-a-la-mano-v18'
const CACHE_STRATEGIES = {
  static: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'svg', 'webp', 'ico', 'gif'],
  shell: ['html', 'js', 'css']
}
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo_salento2026.webp',
  '/avatar-don-chucho.webp',
  '/don-chucho-boton.webp',
  '/sw.js',
  '/data/places.json',
  '/data/hotels.json',
  '/data/mapMarkers.json',
  '/data/products.json',
  '/data/safety-data.json',
  '/imagenes-salento/1326163558.webp',
  '/imagenes-salento/1326163759.webp',
  '/imagenes-salento/631026720.webp',
  '/imagenes-salento/631032744.webp',
  '/imagenes-salento/653410779.webp',
  // Ruta GPS de Cascadas de Santa Rita para navegación offline
  '/pautas/reserva-natural-cascadas-de-santa-rita/cascadas-santa-rita-salento-colombia-.gpx',
  // Imágenes principales de Cascadas de Santa Rita para offline
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/logo_cascadas_de_santa_rita-512.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-3.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cascada2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cascada3.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cueva1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cueva2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/puente-cpolgante1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/rio2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/casa1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/monte1.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/f2.webp',
  '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/foto1.webp'
]

// Tiles de Cascadas de Santa Rita para cachear offline.
// Solo el bounding box del GPX + 1 tile de margen, zooms 14-16, un subdominio.
// Evita descargar cientos de miles de tiles en la primera visita.
const TILE_CACHE_NAME = 'salento-tiles-v18'
const TILE_URL_TEMPLATE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_SUBDOMAINS = ['a']
const TILE_BOUNDS = { north: 4.664209, south: 4.646949, west: -75.580899, east: -75.568804 }

function lonToTileX(lon, z) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, z))
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      Math.pow(2, z)
  )
}

function getTileUrls() {
  const urls = []
  const margin = 1

  for (let z = 14; z <= 16; z++) {
    const minX = lonToTileX(TILE_BOUNDS.west, z) - margin
    const maxX = lonToTileX(TILE_BOUNDS.east, z) + margin
    const minY = latToTileY(TILE_BOUNDS.north, z) - margin
    const maxY = latToTileY(TILE_BOUNDS.south, z) + margin

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (const s of TILE_SUBDOMAINS) {
          urls.push(
            TILE_URL_TEMPLATE
              .replace('{s}', s)
              .replace('{z}', String(z))
              .replace('{x}', String(x))
              .replace('{y}', String(y))
          )
        }
      }
    }
  }
  return urls
}

self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker v18 - Cascadas de Santa Rita offline tiles')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell')
      // Use individual puts instead of addAll to avoid atomic failure
      return Promise.allSettled(
        APP_SHELL.map(url =>
          fetch(url)
            .then(r => r.ok ? cache.put(url, r) : null)
            .catch(() => null)
        )
      )
    }).then(() => {
      // Cachear tiles del mapa en segundo plano (toma tiempo)
      return caches.open(TILE_CACHE_NAME).then((tileCache) => {
        const tileUrls = getTileUrls()
        console.log(`[SW] Caching ${tileUrls.length} map tiles for offline`)
        // Cachear en lot atómicos para completar más rápido en primera carga
        return cacheTilesInBatches(tileCache, tileUrls, 10).then(() => {
          // Post-caching: intentar cachear tiles adicionales en segundo plano
          // sin bloquear el waiting del SW
          tryTilesRuntimeCache(tileCache).catch(err =>
            console.log('[SW] Runtime tile caching skipped or failed:', err)
          )
        })
      })
    })
  )
  self.skipWaiting()
})

async function tryTilesRuntimeCache(tileCache) {
  // Intentar cachear tiles adicionales cuando el usuario navega
  // Esto cubre tiles que no fueron cacheados en install
  if (!navigator.onLine) return
  try {
    const urls = getTileUrls()
    const cachedCount = await tileCache.keys()
    const uncached = urls.filter(url => !cachedCount.some(cached => cached.url === url))
    if (uncached.length > 0) {
      const batch = uncached.slice(0, 5)
      await Promise.all(batch.map(url =>
        fetch(url).then(r => r.ok ? tileCache.put(url, r.clone()) : null)
      ))
    }
  } catch (e) {
    console.log('[SW] Runtime tile cache failed:', e)
  }
}

async function cacheTilesInBatches(cache, urls, batchSize) {
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const promises = batch.map(url => 
      fetch(url)
        .then(r => r.ok ? cache.put(url, r) : null)
        .catch(() => null) // Ignorar errores de red
    )
    await Promise.all(promises)
  }
  console.log('[SW] Tile caching complete')
}

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v18 - Cascadas de Santa Rita')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== TILE_CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar extensiones chrome
  if (url.protocol === 'chrome-extension:') return

  // Tiles de OpenStreetMap - cache first para offline (con fallback runtime)
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(cache => 
        cache.match(request).then(cached => {
          if (cached) {
            // Actualizar caché en segundo plano si la red está disponible
            fetch(request).then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((appCache) => appCache.put(request, response.clone()))
              }
            }).catch(() => {})
            return cached
          }
          // Fallback: intentar fetch con timeout para tiles no cacheados
          return fetch(request).then(response => {
            if (response.ok) {
              caches.open(TILE_CACHE_NAME).then((tileCache) => tileCache.put(request, response.clone()))
              caches.open(CACHE_NAME).then((appCache) => appCache.put(request, response.clone()))
            }
            return response
          }).catch(() => {
            // Si falla el fetch, servir tile vacío para mantener UI funcional
            return caches.match(request).then(cached => cached || new Response('', { status: 204 }))
          })
        }).catch(() => {
          // Si falla la apertura del cache, intentar fetch directo
          return fetch(request).then(response => {
            if (response.ok) {
              caches.open(TILE_CACHE_NAME).then((tileCache) => tileCache.put(request, response.clone()))
              caches.open(CACHE_NAME).then((appCache) => appCache.put(request, response.clone()))
            }
            return response
          }).catch(() => new Response('', { status: 204 }))
        })
      )
    )
    return
  }

  // Solo procesar requests del mismo origen para el resto
  if (url.origin !== location.origin) return

  // Determinar estrategia según tipo de recurso
  const extension = url.pathname.split('.').pop()?.toLowerCase() || ''
  const isAPI = url.pathname.includes('/data/')
  const isNavigation =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html')

  let strategy = 'cache-first'

  if (isNavigation) {
    strategy = 'network-first'
  } else if (isAPI) {
    strategy = 'network-first'
  } else if (CACHE_STRATEGIES.static.includes(extension)) {
    strategy = 'cache-first'
  } else if (CACHE_STRATEGIES.shell.includes(extension)) {
    strategy = 'cache-first'
  }

  if (strategy === 'network-first') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          if (cached) return cached
          if (isNavigation) {
            const fallback = await caches.match('/index.html')
            if (fallback) return fallback
          }
          return new Response('Offline', { status: 503 })
        })
    )
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Actualizar caché en segundo plano
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
            }
          }).catch(() => {})
          return cached
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        }).catch(() => {
          // SPA fallback: servir index.html para navegación offline
          // Pero NO interceptar páginas pautantes (son HTML estáticos separados)
          if (request.mode === 'navigate' && !url.pathname.startsWith('/paginas-pautantes/')) {
            return caches.match('/index.html')
          }
          return new Response('Offline', { status: 503 })
        })
      })
    )
  }
})

// Mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
  if (event.data === 'cacheTiles') {
    // Permitir que la app Solicite cachear tiles adicionales
    caches.open(TILE_CACHE_NAME).then(cache => {
      const tileUrls = getTileUrls()
      cacheTilesInBatches(cache, tileUrls, 20)
    })
  }
})
