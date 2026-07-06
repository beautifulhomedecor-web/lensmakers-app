// Lens Makers PWA Service Worker (Stale-While-Revalidate Strategy for Lightning Fast Loading)
const CACHE_NAME = 'lensmakers-v5-nocart-20260706';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './src/utils/spring.js',
  './src/data/products.js',
  './src/components/Logo.js',
  './src/components/UIPrimitives.js',
  './src/components/Splash.js',
  './src/components/Onboarding.js',
  './src/components/AuthModal.js',
  './src/components/BottomNav.js',
  './src/components/Header.js',
  './src/components/PromoCard.js',
  './src/components/LocationCard.js',
  './src/components/TrendingSunglasses.js',
  './src/components/EyeglassesSection.js',
  './src/components/PremiumPicks.js',
  './src/components/TryOnBanner.js',
  './src/components/Navbar.js',
  './src/screens/HomeScreen.js',
  './src/screens/ShopScreen.js',
  './src/screens/TryOnScreen.js',
  './src/screens/EyeCheckupScreen.js',
  './src/screens/MembershipScreen.js',
  './src/screens/PrescriptionScreen.js',
  './src/screens/CartScreen.js',
  './src/screens/StoreLocatorScreen.js',
  './src/screens/ProfileScreen.js',
  './src/App.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('SW cache install partial:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Stale-While-Revalidate Strategy: Serve instantly from cache, update silently in background
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request, { cache: 'default' }).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise.then((res) => {
        if (res) return res;
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
