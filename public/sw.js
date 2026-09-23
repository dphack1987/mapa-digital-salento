const CACHE_NAME = 'salento-a-la-mano-v16'
const CACHE_STRATEGIES = {
  static: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'svg', 'webp', 'ico', 'gif'],
  shell: ['html', 'js', 'css']
}
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo_salento2026.webp',
  '/avatar-don-chucho.png',
  '/don-chucho-boton.webp',
  '/sw.js',
  '/data/places.json',
  '/data/hotels.json',
  '/data/mapMarkers.json',
  '/data/products.json',
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

// Rangos de tiles de Cascadas de Santa Rita para cachear offline
// Zoom 12-16 cubre Cascadas de Santa Rita + ruta GPS completa + Boquía (~4km radio)
const TILE_CACHE_NAME = 'salento-tiles-v16'
const TILE_URL_TEMPLATE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_SUBDOMAINS = ['a', 'b', 'c']

function getTileUrls() {
  const urls = []
  // Centro exacto basado en análisis GPX: lat 4.65746762702703, lng -75.5727757405405
  // Tile coords at zoom 12: x=1133, y=795 (aproximado para centro GPS)
  // Rango GPS real: Lat 4.646949 a 4.664209, Lon -75.580899 a -75.568804
  // Rango extendido para cubrir ruta completa GPX con margen
  const centerTileX = 1133
  const centerTileY = 795
  const range = 6 // 6 tiles en cada dirección = 13x13 = 169 tiles por zoom (cobertura completa ruta GPS + margen)
  
  for (let z = 12; z <= 16; z++) {
    const scale = Math.pow(2, z - 12)
    const cx = centerTileX * scale
    const cy = centerTileY * scale
    const r = range * scale
    
    for (let x = cx - r; x <= cx + r; x++) {
      for (let y = cy - r; y <= cy + r; y++) {
        for (const s of TILE_SUBDOMAINS) {
          const url = TILE_URL_TEMPLATE
            .replace('{s}', s)
            .replace('{z}', String(z))
            .replace('{x}', String(x))
            .replace('{y}', String(y))
          urls.push(url)
        }
      }
    }
  }
  return urls
}

self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker v16 - Cascadas de Santa Rita offline tiles')
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
  console.log('[SW] Activating service worker v16 - Cascadas de Santa Rita')
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
  
  let strategy = 'cache-first'
  
  if (isAPI) {
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
        .catch(() => caches.match(request))
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
