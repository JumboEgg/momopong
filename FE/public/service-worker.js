// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/', 
          '/index.html', 
          '/images/favicon.ico', 
          '/images/apple-touch-icon-180x180.png', 
          // 필요한 리소스 추가
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  });
  