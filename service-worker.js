const CACHE_NAME = 'letters-game-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './game.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    
    // Background images
    './background/bg1.jpg',
    './background/bg2.jpg',
    './background/bg3.jpg',
    './background/bg4.jpg',
    './background/bg5.jpg',
    './background/bg6.jpg',
    './background/bg7.jpg',
    './background/bg8.jpg',
    './background/bg9.jpg',
    
    // Reward images
    './rewards/reward1.jpg',
    './rewards/reward2.jpg',
    './rewards/reward3.jpg',
    './rewards/reward4.jpeg',
    './rewards/reward5.jpg',
    './rewards/reward6.png',
    './rewards/reward7.jpeg',
    './rewards/reward8.jpg',
    './rewards/reward9.jpg',
    './rewards/reward10.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});