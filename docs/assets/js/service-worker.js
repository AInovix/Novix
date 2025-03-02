const CACHE_NAME = 'novix-docs-v1';
const ASSETS = [
    '/',
    '/assets/css/styles.css',
    '/assets/js/main.js',
    // Add other critical assets
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
    );
});
