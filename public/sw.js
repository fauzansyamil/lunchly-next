/* Lunchly app service worker: offline shell for /app. Bump VERSION to refresh caches. */
const VERSION = "lunchly-v1";
const PRECACHE = [
  "/app", "/app/temperature", "/app/timer", "/app/battery", "/app/power-bank", "/app/profile",
  "/media/asset-1.jpg", "/media/asset-2.jpg", "/media/asset-6.jpg", "/media/asset-7.jpg", "/media/asset-8.jpg",
  "/icons/icon-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(u)))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.endsWith(".mp4")) return;

  // Pages: network first, fall back to cache (then to the app home) when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && url.pathname.startsWith("/app")) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/app")))
    );
    return;
  }

  // Static assets: cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/media/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
