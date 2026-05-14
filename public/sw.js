const CACHE_NAME = 'ormonov-school-pwa-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo.png',
  '/pwa-192.png',
  '/pwa-512.png'
];

const cacheAppShell = async () => {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));

  try {
    const response = await fetch('/', { cache: 'reload' });
    if (!response.ok) return;

    const html = await response.clone().text();
    await cache.put('/', response.clone());
    await cache.put('/index.html', response);

    const assetUrls = Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g))
      .map((match) => match[1])
      .filter((url) =>
        url.startsWith('/assets/') ||
        url === '/manifest.webmanifest' ||
        url.startsWith('/pwa-') ||
        url === '/logo.png'
      );

    await Promise.allSettled(assetUrls.map((url) => cache.add(url)));
  } catch {
    // Эгер install маалында тармак үзүлсө, буга чейин сакталган shell колдонулат.
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/index.html', copy.clone());
            cache.put(request, copy);
          });
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
            }
          })
          .catch(() => {});

        return cached;
      }

      return fetch(request)
        .then((response) => {
          const isCacheable =
            response &&
            response.status === 200 &&
            ['style', 'script', 'image', 'font'].includes(request.destination);

          if (isCacheable) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }

          return response;
        })
        .catch(() => new Response('', { status: 504, statusText: 'Offline' }));
    })
  );
});
