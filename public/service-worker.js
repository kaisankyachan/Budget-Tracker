// sets up the files we will cache
const FILES_TO_CACHE = [
    "/",
    "/index.js",
    "/index.html",
    "/styles.css",
    "/icons/icon-512x512.png",
    "/icons/icon-192x192.png",
  ];
// sets up the data cache name
const DATA_CACHE_NAME = "budget-tracker-data-cache";
// sets up the cache name
const STATIC_CACHE_NAME = "budget-tracker-static-cache";
// sets up the event listener
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
// sets up an event listener for cache activation
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing the old cache data", key);
            return caches.delete(key); // removes the old cache data
          }
        })
      );
    })
  );
  self.clients.claim();
});

// sets up an event listener for fetching data
self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // if we got a successful response, duplicate it and store it
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response; // return the response
          })
          .catch(err => { // catches any errors
            // if the request failed, we can try to get it from the cache
            return cache.match(event.request);
          });
      }).catch(err => console.log(err)) // catches any errors
    );
    return;
  }
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response; // return the response
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return cached page
          return caches.match("/");
        }
      });
    })
  );
});