// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClCH7fIIiOx6YA89vIlQfWTVjfpte-1mE",
  authDomain: "layo-henna-touch.firebaseapp.com",
  databaseURL: "https://layo-henna-touch-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "layo-henna-touch",
  storageBucket: "layo-henna-touch.firebasestorage.app",
  messagingSenderId: "849243710907",
  appId: "1:849243710907:web:92f392dcd3008a58efd09e",
  measurementId: "G-TBFYX5418L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore (for storing bookings, testimonials, etc.)
export const db = getFirestore(app);

// Initialize Realtime Database
export const realtimeDb = getDatabase(app);

// Initialize Storage (for storing henna design images)
export const storage = getStorage(app);

export { analytics };
export default app;
