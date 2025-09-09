// Firebase configuration and initialization

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "Missing required Firebase environment variables:",
    missingEnvVars.join(", "),
  );
  console.error(
    "Please check your .env.local file and ensure all Firebase configuration variables are set.",
  );
}

// Initialize Firebase app
let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Development environment setup
if (process.env.NODE_ENV === "development") {
  const useEmulators =
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

  if (useEmulators) {
    // Connect to Firebase emulators for local development
    try {
      // Only connect to emulators if not already connected
      if (
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.includes("demo-") ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo-project"
      ) {
        connectFirestoreEmulator(db, "localhost", 8080);
        connectAuthEmulator(auth, "http://localhost:9099", {
          disableWarnings: true,
        });
        connectStorageEmulator(storage, "localhost", 9199);
        console.log("🔥 Connected to Firebase emulators");
      }
    } catch (error) {
      console.warn("Firebase emulators connection failed:", error);
    }
  }
}

// Export the Firebase app instance
export default app;

// Utility functions for Firebase operations
export const isFirebaseConfigured = (): boolean => {
  return missingEnvVars.length === 0;
};

export const getFirebaseConfig = () => {
  return {
    ...firebaseConfig,
    isConfigured: isFirebaseConfigured(),
    missingVars: missingEnvVars,
  };
};

// Firebase error handling utilities
export const getFirebaseErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const firebaseError = error as { code: string; message: string };

    switch (firebaseError.code) {
      case "auth/user-not-found":
        return "No user found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "permission-denied":
        return "You do not have permission to perform this action.";
      case "unavailable":
        return "Service is currently unavailable. Please try again later.";
      case "not-found":
        return "The requested resource was not found.";
      default:
        return firebaseError.message || "An unexpected error occurred.";
    }
  }

  return "An unexpected error occurred.";
};

// Connection status utilities
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test to check if Firebase is accessible
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error("Firebase connection check failed:", error);
    return false;
  }
};
