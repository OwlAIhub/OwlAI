import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Firebase configuration - replace with your actual config
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = (config: FirebaseConfig): void => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required Firebase configuration fields: ${missingFields.join(", ")}. Please check your .env.local file.`
    );
  }
};

// Initialize Firebase with validation
let app: FirebaseApp;
let auth: Auth;

try {
  validateFirebaseConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Configure auth settings for production
  auth.useDeviceLanguage();

  // Enable reCAPTCHA for security in all environments
  auth.settings.appVerificationDisabledForTesting = false;
} catch (error) {
  console.error("Firebase initialization failed:", error);
  throw new Error(
    "Firebase configuration is invalid. Please check your environment variables."
  );
}

// Export Firebase services
export { app, auth };
