/* Install-only worker for /holidaythink/.
   Does not cache pages, so client-side routes keep working. */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET') return
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith('/holidaythink/')) return
  event.respondWith(fetch(event.request))
})
