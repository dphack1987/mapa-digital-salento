const CACHE_NAME = 'salento-a-la-mano-v3'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo_salento2026.png',
  '/salento/653410779.webp',
  '/salento/631032744.webp',
  '/salento/631026720.webp',
  '/salento/1326163558.webp',
  '/salento/1326163759.webp',
  '/data/places.json',
  '/data/hotels.json',
  '/data/mapMarkers.json',
  '/data/products.json'
]

// Estrategia de caché: Network First para API, Cache First para assets
const CACHE_STRATEGIES = {
  // Para datos dinámicos: intentar red primero, fallback a caché
  dynamic: ['json'],
  // Para assets estáticos: caché primero, fallback a red
  static: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'css', 'js'],
  // Para la app shell: siempre caché primero
  shell: ['html', 'manifest']
}

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell')
      return cache.addAll(APP_SHELL)
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          })
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo procesar requests del mismo origen
  if (url.origin !== location.origin) {
    return
  }

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
          })
          return cached
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
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
})