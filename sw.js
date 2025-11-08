const CACHE_NAME = 'brahmavidya-cache-v1';
// PWA ने ऑफलाइन काय सेव्ह करावे:
const urlsToCache = [
  'index.html',
  'projects.json',
  'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js'
  // तुम्ही तुमच्या बॅकग्राउंड इमेजेस पण इथे ऍड करू शकता
];

// Install: कॅशे तयार करणे
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: कॅशेमधून रिस्पॉन्स देणे
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // कॅशेमध्ये सापडले, तर तेथून द्या
        if (response) {
          return response;
        }
        // नाहीतर, नेटवर्कवरून आणा
        return fetch(event.request);
      })
  );
});

// Activate: जुने कॅशे साफ करणे
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
