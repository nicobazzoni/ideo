import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


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