const CACHE_NAME = 'vk-apps-cache-v15';
const URLS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'geminiService.ts',
  'components/Dashboard.tsx',
  'components/Flashlight.tsx',
  'components/Calculator.tsx',
  'components/WorkApp.tsx',
  'components/Button.tsx',
  'components/InstallPrompt.tsx',
  'components/Icons.tsx',
  'components/SplashScreen.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use standard relative paths for caching. 
      // allSettled ensures one failed file doesn't break the whole PWA install.
      return Promise.allSettled(
        URLS_TO_CACHE.map(url => 
          cache.add(url).catch(err => console.warn(`Cache failed for: ${url}`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // External resources (CDNs, Google Fonts, esm.sh)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);
        });
      })
    );
    return;
  }

  // Same-origin resources (App logic, icons, manifest)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});