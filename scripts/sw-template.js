/* Generated during build; cache identity follows source and dependency changes. */
const CACHE_PREFIX = "scamshield-";
const CACHE_NAME = `${CACHE_PREFIX}__BUILD_VERSION__`;
const MAX_ENTRIES = 80;
const OFFLINE_URL = "/offline.html";
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
async function store(request, response) {
  if (!response.ok || response.type === "opaque" || response.headers.get("cache-control")?.includes("no-store")) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  const keys = await cache.keys();
  const removable = keys.filter(key => new URL(key.url).pathname !== OFFLINE_URL);
  while (removable.length > MAX_ENTRIES - 1) await cache.delete(removable.shift());
}
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    // HTML always follows the server release. Never substitute stale application HTML.
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
  } else if (url.pathname.startsWith("/_next/static/") && ["script", "style", "font", "image"].includes(request.destination)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type !== "opaque") await store(request, response);
      return response;
    })());
  }
});
