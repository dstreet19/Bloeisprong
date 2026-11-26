// Bloeisprong service worker: maakt het spel offline speelbaar.
// Verhoog VERSIE bij elke nieuwe uitgave, dan halen de toestellen de nieuwe bestanden op.
const VERSIE = 'bloeisprong-v2';
const LETTERS = 'bloeisprong-letters';
const KERN = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/favicon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIE).then(c => c.addAll(KERN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSIE && k !== LETTERS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Grapjes van JokeAPI nooit bewaren: altijd rechtstreeks van het netwerk.
  if (url.hostname === 'v2.jokeapi.dev') return;

  // De pagina zelf: eerst online (zo komen updates binnen), offline uit de cache.
  if (req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('/index.html'))) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const kopie = res.clone();
          caches.open(VERSIE).then(c => c.put('index.html', kopie));
          return res;
        })
        .catch(() => caches.match('index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Lettertypes van Google: uit de cache, op de achtergrond vernieuwd.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(LETTERS).then(c =>
        c.match(req).then(hit => {
          const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  // Andere bestanden van de app: eerst uit de cache.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const kopie = res.clone(); caches.open(VERSIE).then(c => c.put(req, kopie)); }
        return res;
      }))
    );
  }
});
