importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);
// Load environment variables from generated file
importScripts("/firebase-sw-env.js");

// FIREBASE_CONFIG is defined in firebase-sw-env.js (generated from template)
firebase.initializeApp(FIREBASE_CONFIG);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[SW] Background notification received:", payload);
  const notificationTitle = payload.notification?.title || "Thông báo mới";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/firebase_icon.png",
    badge: "/firebase_icon.png",
    data: payload.data,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click received:", event);
  event.notification.close();
  // Open app or specific URL on click
  event.waitUntil(clients.openWindow("/"));
});