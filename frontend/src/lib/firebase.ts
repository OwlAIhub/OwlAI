// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment and in production)
let analytics;
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Connect to Firestore emulator in development if needed
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  // Only connect to emulator if not already connected
  try {
    // This will only work if you have the emulator running
    // Remove this if you want to use production Firestore in development
    // connectFirestoreEmulator(db, 'localhost', 8080);
  } catch {
    // Emulator connection failed, continue with production Firestore
    console.log("Using production Firestore");
  }
}

export { db, analytics };
export default app;
