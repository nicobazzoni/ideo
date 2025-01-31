// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase in the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyBiTxlv6GGAQ0of_yBvn8t-jd1hqPNet-w",
  authDomain: "ideo-91634.firebaseapp.com",
  projectId: "ideo-91634",
  storageBucket: "ideo-91634.firebasestorage.app",
  messagingSenderId: "544332422773",
  appId: "1:544332422773:web:3b6e8a85c26cfd3d8d623c",
});

// Initialize Messaging
const messaging = firebase.messaging();

// Handle Background Messages
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: '/ideo.png', // ✅ Your Custom Logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});