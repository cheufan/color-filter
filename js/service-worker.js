self.importScripts('files-to-cache.js');

const cacheName = 'colorfilter-v0.2.0'

self.addEventListener('install', (e) => {
  console.log("[Service Worker] Install")
  e.waitUntil(
    (async () => {
        const cache = await caches.open(cacheName)
        console.log('[Service Worker] Caching files')
        await cache.addAll(filesToCache)
        console.log('[Service Worker] Files cached')
    })()
  )
})

self.addEventListener('fetch', (e) => {
  console.log(`[Service Worker] Fetched resource ${e.request.url}`)
    e.respondWith(
    (async () => {
      const r = await caches.match(e.request)
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      const cache = await caches.open(cacheName)
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
      cache.put(e.request, response.clone())
      return response
    })(),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return
          }
          return caches.delete(key)
        }),
      )
    }),
  )
})
