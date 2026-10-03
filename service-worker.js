// Service Worker für MoneyApp
//
// RELEASE: CACHE_VERSION bei JEDEM Release hochzählen (zusammen mit APP_VERSION in js/core.js).
// Die geänderte Datei löst beim Browser das Update aus. Ohne neue Version kommt kein Update an.
const CACHE_VERSION = '1.27.0';
const CACHE_NAME = 'moneyapp-' + CACHE_VERSION;
const ASSETS = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './css/bootstrap.min.css', './css/style.css',
  './js/theme.js', './js/i18n.js', './js/core.js', './js/store.js', './js/render.js', './js/app.js'
];

self.addEventListener('install', e => {
  // cache:'reload' umgeht den HTTP-Cache (GitHub Pages: max-age=600), damit nie alte Dateien im neuen Paket landen.
  e.waitUntil(caches.open(CACHE_NAME)
    .then(c => Promise.allSettled(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' })))))
    // Kein skipWaiting() hier: Der neue Worker wartet, bis die App ihn aktiviert (kein Dialog offen)
    // oder der Nutzer „Neu laden“ tippt (siehe upd() in js/app.js und das 'message'-Event unten).
    );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('moneyapp-') && k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Die App aktiviert einen wartenden Worker erst, wenn kein Dialog offen ist (oder der Nutzer „Neu laden“ tippt).
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

// Alles (auch HTML) kommt zuerst aus dem Cache der eigenen Version: eine Version = ein geschlossenes Paket.
// Nur der eigene Cache wird gefragt, nicht die Pakete anderer Versionen.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith('http')) return;
  const nav = r.mode === 'navigate';
  const store = res => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE_NAME).then(ch => ch.put(r, c)); } return res; };
  e.respondWith(caches.open(CACHE_NAME)
    .then(ch => ch.match(r, { ignoreSearch: nav }))
    .then(c => c || fetch(r).then(store).catch(() => nav ? caches.open(CACHE_NAME).then(ch => ch.match('./index.html')) : Response.error())));
});
