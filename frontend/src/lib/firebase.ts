import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

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
