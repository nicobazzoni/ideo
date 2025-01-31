import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiTxlv6GGAQ0of_yBvn8t-jd1hqPNet-w",
  authDomain: "ideo-91634.firebaseapp.com",
  projectId: "ideo-91634",
  storageBucket: "ideo-91634.firebasestorage.app",
  messagingSenderId: "544332422773",
  appId: "1:544332422773:web:3b6e8a85c26cfd3d8d623c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// 🔔 Request Notification Permission and Retrieve FCM Token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");

      // Generate and return FCM token
      const fcmToken = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
      console.log("📲 FCM Token:", fcmToken);
      
      return fcmToken;
    } else {
      console.log("❌ Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("🚨 Error requesting notification permission:", error);
    return null;
  }
};

// 🔄 Handle Incoming Messages (Foreground)
onMessage(messaging, (payload) => {
  console.log("📩 New foreground notification:", payload);
  alert(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
});