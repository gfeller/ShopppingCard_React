 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

 firebase.initializeApp({
    apiKey: "AIzaSyBRyPji8CFbS5FGbOfjbC0xqiqeAQjnplY",
    authDomain: "shoppinglist-react-4eead.firebaseapp.com",
    projectId: "shoppinglist-react-4eead",
    storageBucket: "shoppinglist-react-4eead.firebasestorage.app",
    messagingSenderId: "760205957849",
    appId: "1:760205957849:web:9addb5c6baf68002267cc8"
 });

 const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  const title = payload.notification?.title || 'Neue Nachricht';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192x192.png',
    tag: payload.data?.containerId,
    data: { url: payload.fcmOptions?.link },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
