// कॅशेचे नवीन व्हर्जन (Item 1 - True Offline)
const CACHE_NAME = 'brahmavidya-cache-v2';
const CORE_ASSETS = [
  'index.html',
  'projects.json',
  'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js'
  // इमेजेस आणि iframe कंटेंट आता आपोआप कॅशे होतील (dynamically)
];

// Install: कोअर ॲसेट्स कॅशे करणे
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting()) // नवीन व्हर्जन लगेच ऍक्टिव्हेट करणे
  );
});

// Activate: जुने कॅशे साफ करणे
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // नवीन सर्व्हिस वर्कर लगेच कंट्रोल घेईल
  );
});

// Fetch: 'Cache-First, fallback to Network, then Cache' स्ट्रॅटेजी
self.addEventListener('fetch', event => {
  // projects.json साठी 'Network-First' वापरू, जेणेकरून अपडेट्स मिळतील
  if (event.request.url.includes('projects.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(networkResponse => {
            // नेटवर्कवरून मिळाली, तर कॅशे अपडेट करा
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            // नेटवर्क फेल झाले, तर कॅशेमधून द्या
            return cache.match(event.request);
          });
      })
    );
    return; // इथेच थांबा
  }

  // इतर सर्व रिक्वेस्टसाठी (Images, iFrames, etc.) 'Cache-First'
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. कॅशेमध्ये असेल, तर लगेच द्या
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. कॅशेमध्ये नसेल, तर नेटवर्कवरून आणा
        return fetch(event.request)
          .then(networkResponse => {
            // 3. आणि पुढच्या वेळेसाठी कॅशेमध्ये सेव्ह करा
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      })
      .catch(error => {
        // ऑफलाइन असताना एरर येऊ शकतो
        console.log('Service Worker: Fetch failed:', error);
        // तुम्ही इथे एक 'ऑफलाइन' पेज पण दाखवू शकता
      })
  );
});
