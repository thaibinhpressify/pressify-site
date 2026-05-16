export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const projectId = String(config.public.firebaseProjectId || "").trim();
  const apiKey = String(config.public.firebaseApiKey || "").trim();

  if (!projectId || !apiKey) {
    setResponseStatus(event, 404);
    return "// Firebase is not configured";
  }

  const firebaseConfig = {
    apiKey,
    authDomain: String(config.public.firebaseAuthDomain || "").trim(),
    projectId,
    storageBucket: String(config.public.firebaseStorageBucket || "").trim(),
    messagingSenderId: String(config.public.firebaseMessagingSenderId || "").trim(),
    appId: String(config.public.firebaseAppId || "").trim(),
  };

  const siteUrl = JSON.stringify(String(config.public.siteUrl || "").trim().replace(/\/+$/, ""));
  const siteName = JSON.stringify(String(config.public.siteName || "Pressify"));

  setHeader(event, "Content-Type", "application/javascript; charset=utf-8");
  setHeader(event, "Service-Worker-Allowed", "/");
  setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");

  const cfgJson = JSON.stringify(firebaseConfig);

  return `importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

var SITE_URL = ${siteUrl};
var SITE_NAME = ${siteName};
var DEFAULT_ICON = '/logo.png';

function asString(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function resolveClickUrl(clickUrl) {
  var raw = asString(clickUrl);
  var base = asString(SITE_URL).replace(/\\/+$/g, '');
  if (!raw) return base || '/';
  if (/^https?:\\/\\//i.test(raw)) return raw;
  if (raw.charAt(0) === '/') return base + raw;
  return base + '/' + raw;
}

function parseDisplay(payload) {
  var data = payload.data || {};
  var n = payload.notification || {};
  var title = asString(n.title) || asString(data.title) || SITE_NAME;
  var body = asString(n.body) || asString(data.body) || '';
  var icon = asString(n.icon) || asString(data.icon) || DEFAULT_ICON;
  var image = asString(n.image) || asString(data.image) || '';
  var clickRaw = asString(data.click_url) || asString(data.clickUrl) || '';
  var clickUrl = resolveClickUrl(clickRaw);
  var tag = asString(data.tag) || ('pressify-' + Date.now());
  var merged = {};
  for (var k in data) { if (Object.prototype.hasOwnProperty.call(data, k)) merged[k] = String(data[k]); }
  merged.click_url = clickUrl;
  merged.title = title;
  merged.body = body;
  merged.icon = icon;
  merged.tag = tag;
  if (image) merged.image = image;
  return { title: title, body: body, icon: icon, image: image, clickUrl: clickUrl, tag: tag, data: merged };
}

function openUrl(url) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
    var i;
    var target;
    try { target = new URL(url); } catch (e) { target = null; }
    if (target) {
      for (i = 0; i < clients.length; i++) {
        var c = clients[i];
        if (c.url && c.url.indexOf(target.pathname) !== -1 && 'focus' in c) {
          return c.focus();
        }
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  });
}

firebase.initializeApp(${cfgJson});
var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var d = parseDisplay(payload);
  var options = {
    body: d.body,
    icon: d.icon,
    tag: d.tag,
    data: d.data,
    requireInteraction: false,
  };
  if (d.image) options.image = d.image;
  return self.registration.showNotification(d.title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var data = event.notification.data || {};
  var url = resolveClickUrl(asString(data.click_url) || asString(data.clickUrl));
  if (!url) return;
  event.waitUntil(openUrl(url));
});
`;
});
