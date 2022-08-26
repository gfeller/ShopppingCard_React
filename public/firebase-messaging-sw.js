/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBYzkfzpJ4t1AvyNWZKSwr2vF4laPa9v-8",
  authDomain: "ikaufzetteli.firebaseapp.com",
  databaseURL: "https://ikaufzetteli.firebaseio.com",
  projectId: "ikaufzetteli",
  storageBucket: "ikaufzetteli.appspot.com",
  messagingSenderId: "477279744354",
  appId: "1:477279744354:web:2fff0adf68cbc535bdbc3b",
}; // firebaseConfig is required

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
