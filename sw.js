const CACHE_NAME = 'presupuesto-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/output.css',
  '/css/input.css',
  '/js/app.js',
  '/js/Dato.js',
  '/js/Ingreso.js',
  '/js/Egreso.js',
  '/img/favicon.svg',
  '/css/fondo.png',
  '/manifest.json',
  'https://unpkg.com/ionicons@5.4.0/dist/ionicons/ionicons.esm.js'
];

// Evento de instalación - Cachea los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cache abierto');
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('[ServiceWorker] Error al cachear recursos:', err);
            // Continuar incluso si algún recurso falla
            return Promise.resolve();
          });
      })
  );
  // Activar el service worker inmediatamente
  self.skipWaiting();
});

// Evento de activación - Limpia caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediatamente
  self.clients.claim();
});

// Evento de fetch - Estrategia Cache First con Network Fallback
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encuentra el recurso en cache, lo devuelve
        if (response) {
          console.log('[ServiceWorker] Respuesta desde cache:', event.request.url);
          return response;
        }

        // Si no está en cache, intenta descargarlo
        console.log('[ServiceWorker] Descargando:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Verificar si la respuesta es válida
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            // Solo cachear recursos de nuestro dominio y CDNs confiables
            const url = new URL(event.request.url);
            if (url.origin === location.origin || 
                url.href.includes('unpkg.com') || 
                url.href.includes('cdnjs.cloudflare.com')) {
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(err => {
            console.error('[ServiceWorker] Error al descargar:', err);
            // Si falla la descarga y no hay cache, mostrar página offline si existe
            if (event.request.destination === 'document') {
              return caches.match('/offline.html')
                .catch(() => {
                  return new Response('Aplicación offline. Por favor, verifica tu conexión a internet.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                      'Content-Type': 'text/plain; charset=utf-8'
                    })
                  });
                });
            }
          });
      })
  );
});

// Evento de mensaje para actualización manual
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[ServiceWorker] Limpiando cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Evento de sincronización en background (si el navegador lo soporta)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('[ServiceWorker] Sincronizando datos...');
    event.waitUntil(syncData());
  }
});

// Función de sincronización de datos (placeholder)
async function syncData() {
  try {
    // Aquí podrías sincronizar datos locales con el servidor
    console.log('[ServiceWorker] Datos sincronizados exitosamente');
    return Promise.resolve();
  } catch (error) {
    console.error('[ServiceWorker] Error al sincronizar datos:', error);
    return Promise.reject(error);
  }
}

// Notificaciones push (si se implementan en el futuro)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/img/icon-192x192.png',
    badge: '/img/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/img/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/img/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Presupuesto Personal', options)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
