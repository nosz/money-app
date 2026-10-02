// Service Worker für MoneyApp
// CACHE_VERSION bei jeder neuen Version hochzählen.
const CACHE_VERSION = '1.12.2';
const CACHE_NAME = 'moneyapp-' + CACHE_VERSION;
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./img/house.svg','./img/settings.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME)
    .then(c => Promise.allSettled(ASSETS.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('moneyapp-') && k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// HTML: Netz zuerst (neueste Version), offline aus dem Cache.
// Sonstiges: Cache zuerst mit Aktualisierung im Hintergrund.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith('http')) return;
  const html = r.mode === 'navigate' || (r.headers.get('accept') || '').includes('text/html');
  const store = res => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE_NAME).then(ch => ch.put(r, c)); } return res; };
  if (html) {
    e.respondWith(fetch(r).then(store).catch(() => caches.match(r).then(c => c || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(c => c || fetch(r).then(store)));
});
