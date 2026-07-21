/**
 * Minimal service worker — caches the static app shell so the site's core
 * loads instantly on repeat visits, and shows offline.html if a navigation
 * request fails with no cached page available.
 *
 * This is intentionally lightweight (no runtime API caching, no background
 * sync). For full offline support of live GitHub data, see README §3.
 */
const CACHE_NAME = "portfolio-os-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/github.js",
  "./js/effects.js",
  "./js/terminal.js",
  "./js/app.js",
  "./manifest.json",
  "./offline.html",
  "./assets/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigation requests: network-first, fall back to cache, then offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./offline.html")))
    );
    return;
  }

  // Everything else (css/js/assets): cache-first, fall back to network.
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => cached))
  );
});
