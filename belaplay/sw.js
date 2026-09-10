const CACHE_NAME = 'belaplay-cache-v12';
const ASSETS_INICIAIS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala o Service Worker e faz o cache dos arquivos principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_INICIAIS);
    })
  );
});

// Intercepta as requisições para funcionar offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache se existir
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Se não estiver no cache (como os áudios na 1ª vez), busca na rede e salva no cache
      return fetch(event.request).then((networkResponse) => {
        // Não faz cache de requisições que não sejam válidas
        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
