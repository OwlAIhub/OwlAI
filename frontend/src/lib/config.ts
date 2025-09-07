/**
 * Application configuration
 * This file centralizes all environment variables and configuration
 */

// Environment validation
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

// Validate environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMessage);
  } else {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('Please create a .env.local file with the required variables');
  }
}

// Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

// App Configuration
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Owl AI',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Development Configuration
export const devConfig = {
  enableLogging: appConfig.isDevelopment,
  enableDebugMode: appConfig.isDevelopment,
  enableHotReload: appConfig.isDevelopment,
};

// Production Configuration
export const prodConfig = {
  enableAnalytics: appConfig.isProduction,
  enableErrorReporting: appConfig.isProduction,
  enablePerformanceMonitoring: appConfig.isProduction,
};

// Export all configuration
export const config = {
  firebase: firebaseConfig,
  app: appConfig,
  dev: devConfig,
  prod: prodConfig,
};

export default config;
