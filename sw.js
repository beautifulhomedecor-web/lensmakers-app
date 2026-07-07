// Lens Makers PWA Service Worker — v6 Warm Palette (Network-First for JS/CSS)
const CACHE_NAME = 'lensmakers-v6-warmpalette-20260707';

// On install: skip waiting immediately so new SW activates without delay
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// On activate: delete ALL old caches and claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          // Delete every old cache — force fresh load
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Immediately take control of all open tabs
      return self.clients.claim();
    })
  );
});

// Fetch: Network-First for JS/CSS/HTML (always get fresh code), Cache-First for images
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isCodeFile = /\.(js|css|html)(\?.*)?$/.test(url.pathname);
  const isImage = /\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/.test(url.pathname);

  if (isCodeFile) {
    // Network-First: always fetch fresh JS/CSS/HTML, fall back to cache only if offline
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else if (isImage) {
    // Cache-First for images: fast load, update in background
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => null);
        return cached || fetchPromise;
      })
    );
  } else {
    // Default: network with cache fallback
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
