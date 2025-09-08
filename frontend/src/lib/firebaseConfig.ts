// Firebase configuration with error handling for API permissions
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeFirebaseWithErrorHandling } from './firebaseCheck';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app (avoid duplicate initialization)
let app: FirebaseApp;
try {
  // Only initialize error handling in production
  if (process.env.NODE_ENV === 'production') {
    initializeFirebaseWithErrorHandling();
  }
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create a minimal app for development
  app = getApps().length === 0 ? initializeApp({
    apiKey: 'demo-key',
    authDomain: 'demo.firebaseapp.com',
    projectId: 'demo-project',
    storageBucket: 'demo-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:demo'
  }) : getApps()[0];
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics with proper error handling
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && process.env.NODE_ENV === 'production') {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  }).catch((error) => {
    console.warn('Analytics support check failed:', error);
  });
}

export { db, analytics };
export default app;