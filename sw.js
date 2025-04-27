const CACHE_NAME = 'novix-docs-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request).then(fetchResponse => {
                if (fetchResponse.ok && event.request.method === 'GET') {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                }
                return fetchResponse;
            }))
            .catch(() => {
                if (event.request.url.endsWith('.md')) {
                    return new Response('# Offline\n\nSorry, this page is not available offline.', {
                        headers: { 'Content-Type': 'text/markdown' }
                    });
                }
            })
    );
});

self.addEventListener('message', event => {
    if (event.data.type === 'CACHE_MDS') {
        caches.open(CACHE_NAME).then(cache => {
            event.data.urls.forEach(url => {
                fetch(url).then(response => {
                    if (response.ok) cache.put(url, response);
                });
            });
        });
    }
});
