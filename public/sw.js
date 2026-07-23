const CACHE_NAME = 'witrquran-cache-v1';

self.addEventListener('install', (event) => {
  // Skip waiting to ensure the new service worker takes over immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim clients so the service worker controls all open pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, keep it lightweight and pass through everything to network.
  // This satisfies the PWA installability requirements without risking
  // stale audio/api caches or bloating device storage.
  event.respondWith(fetch(event.request));
});
