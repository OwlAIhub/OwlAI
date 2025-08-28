import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  onAuthStateChanged,
  signOut,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";

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

  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      throw new Error(`Missing required Firebase configuration: ${field}`);
    }
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
  auth.settings.appVerificationDisabledForTesting = false; // Enable in production

  // Configure reCAPTCHA settings
  if (import.meta.env.DEV) {
    // In development, disable app verification for testing (no reCAPTCHA needed)
    auth.settings.appVerificationDisabledForTesting = true;
  } else {
    // In production, use invisible reCAPTCHA for security
    auth.settings.appVerificationDisabledForTesting = false;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  throw new Error(
    "Firebase configuration is invalid. Please check your environment variables."
  );
}

// Export Firebase services
export {
  app,
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
  type AuthError,
  type AuthErrorCodes,
};
