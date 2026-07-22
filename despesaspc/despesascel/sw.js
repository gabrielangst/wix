const CACHE_NAME = 'app-despesas-v200'; // Mudamos a versão!

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Força o celular a atualizar o app na mesma hora
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html', './manifest.json', './icon.png']);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        // Se encontrar um cache antigo, ele joga fora e mantém só o novo
        if (key !== CACHE_NAME) {
          return caches.delete(key); 
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Estratégia "Network First": Tenta pegar a versão mais nova da internet.
  // Se você estiver sem internet, ele entrega a versão salva no cache.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
