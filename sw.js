const CACHE_NAME = 'vk-apps-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './components/Dashboard.tsx',
  './components/Flashlight.tsx',
  './components/Calculator.tsx',
  './components/WorkApp.tsx',
  './components/Button.tsx',
  './components/InstallPrompt.tsx',
  './services/geminiService.ts'
];

// Install event: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network first for HTML, Stale-while-revalidate for assets/CDNs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle external CDNs (esm.sh, tailwind, fonts, images)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Check if valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }
            // Clone and cache
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
             // If offline and not in cache, nothing we can do for external resources unless cached
             return response; 
          });

          // Return cached response immediately if available, otherwise wait for network
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle local files
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});