// Empty cache and bypass all caching for now
self.addEventListener('install', event => {
  self.skipWaiting(); // Force new service worker to activate immediately
});

// Pass all requests to network directly without caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// Update a service worker and clear any existing cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Clear out any old versions of our PWA caches
      return Promise.all(
        cacheNames.filter(name => name.includes('siakad-pwa-cache')).map(cacheName => {
          console.log('Clearing old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});
