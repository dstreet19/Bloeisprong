// Bloeisprong service worker: maakt het spel offline speelbaar.
// Verhoog VERSIE bij elke nieuwe uitgave, dan halen de toestellen de nieuwe bestanden op.
const VERSIE = 'bloeisprong-v4';
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

  // De pagina zelf: meteen uit het geheugen (snelle start, ook bij traag internet).
  // Tegelijk wordt online de nieuwste versie opgehaald en bewaard; die zie je bij de volgende start.
  if (req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('/index.html'))) {
    const pad = url.pathname;
    const vers = fetch(req)
      .then(res => {
        // Alleen een geldige spelpagina bewaren, nooit een foutpagina (bv. 404 bij een tikfout in de link).
        if (res.ok && (pad.endsWith('/') || pad.endsWith('/index.html'))) {
          const kopie = res.clone();
          return caches.open(VERSIE).then(c => c.put('index.html', kopie)).then(() => res);
        }
        return res;
      })
      .catch(() => null);
    e.waitUntil(vers);
    e.respondWith(
      caches.match('index.html')
        .then(hit => hit || vers.then(res => res || caches.match('./')))
        .then(res => res || Response.error())
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
