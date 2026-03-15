const CACHE_NAME = 'siakad-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  'https://unpkg.com/@tailwindcss/browser@4',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install Service Worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return response from cache if it exists
        if (response) {
          return response;
        }

        // Fetch from network if not in cache
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Ignore dynamic requests from being cached to prevent dynamic data staleness
                if (event.request.method === 'GET' && !event.request.url.includes('/edit/') && !event.request.url.includes('/delete/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      }).catch(() => {
        // Fallback or offline page logic could go here
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
