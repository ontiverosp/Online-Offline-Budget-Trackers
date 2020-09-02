const toCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener('install', function (e) {
  e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
          return cache.addAll(toCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
 
  if (event.request.url.includes("/api/")){
      event.respondWith(
          caches.open(DATA_CACHE_NAME).then(cache => {
              return fetch(event.request)
              .then(response => {
                  if (response.status === 200) {
                      cache.put(event.request.url, response.clone())
                  }

                  return response;
              }).catch(err => {
                  return cache.match(event.request);
              })
          })
      );
      return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
 });