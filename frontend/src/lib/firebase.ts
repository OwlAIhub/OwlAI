import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  logEnvironmentValidation,
  validateFirebaseEnvironment,
} from './env-validation';

// Validate environment variables before creating config
const validationResult = validateFirebaseEnvironment();
logEnvironmentValidation(validationResult);

if (!validationResult.isValid) {
  const errorMessage = `Firebase configuration validation failed: ${validationResult.errors.join(', ')}`;

  // In development, show detailed error
  if (process.env.NODE_ENV === 'development') {
    console.error('Firebase Configuration Error:', errorMessage);
    console.error(
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

// Initialize Firebase with error handling
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw new Error(
    'Failed to initialize Firebase. Please check your configuration.'
  );
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Additional production environment validation
if (process.env.NODE_ENV === 'production') {
  // Log environment info for production debugging (without sensitive data)
  console.log('Firebase initialized for production environment');
}

// Export the app instance for other Firebase services
export default app;
