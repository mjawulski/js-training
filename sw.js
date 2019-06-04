self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll(['images/thanks_javascript.png']);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log(`Fetching: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        console.log(`Served ${event.request.url} from cache!`);
        return response;
      } else {
        return fetch(event.request)
          .then(function(response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone();

            console.log(`${event.request.url} is not in cache. Will add it!`);
            caches.open('v1').then(function(cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function() {
            console.log('Not found!');
          });
      }
    })
  );
});
