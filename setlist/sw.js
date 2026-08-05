const CACHE_NAME = 'setlist-cache-v120';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

// Instalação: Baixa os arquivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
  // Ignora requisições cross-origin (como Firebase e Google Fonts)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Estratégia Cache First (busca no cache, se não achar vai na rede)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Limpeza de caches antigos caso você atualize a versão
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
