/**
 * Firebase Functions Configuration Management
 * Handles environment variables and configuration for different environments
 */

import * as functions from 'firebase-functions';

// Environment types
type Environment = 'development' | 'staging' | 'production' | 'test';

// Environment configuration interface
interface EnvironmentConfig {
  environment: Environment;
  appUrl: string;
  firebase: {
    projectId: string;
    clientEmail: string;
  };
  features: {
    analytics: boolean;
    monitoring: boolean;
    debug: boolean;
  };
}

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // Check for custom environment variable first, then fall back to NODE_ENV
  const environment = (process.env.APP_ENV ||
    process.env.NODE_ENV ||
    'development') as Environment;

  // Base configuration
  const baseConfig: EnvironmentConfig = {
    environment,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'owl-ai-1ef31',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    },
    features: {
      analytics: environment === 'production',
      monitoring: environment === 'production',
      debug: environment === 'development',
    },
  };

  // Environment-specific overrides
  switch (environment) {
    case 'production':
      return {
        ...baseConfig,
        appUrl: 'https://owlai.bot',
        features: {
          analytics: true,
          monitoring: true,
          debug: false,
        },
      };

    case 'staging':
      return {
        ...baseConfig,
        appUrl: 'https://staging.owlai.bot',
        features: {
          analytics: false,
          monitoring: true,
          debug: true,
        },
      };

    case 'test':
      return {
        ...baseConfig,
        appUrl: 'http://localhost:3000',
        features: {
          analytics: false,
          monitoring: false,
          debug: true,
        },
      };

    case 'development':
    default:
      return {
        ...baseConfig,
        appUrl: 'http://localhost:3000',
        features: {
          analytics: false,
          monitoring: false,
          debug: true,
        },
      };
  }
};

// Validate configuration
export const validateConfiguration = (): boolean => {
  const config = getEnvironmentConfig();
  const errors: string[] = [];

  // Check required environment variables
  if (!process.env.FIREBASE_PROJECT_ID) {
    errors.push('FIREBASE_PROJECT_ID is required');
  }

  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    errors.push('FIREBASE_CLIENT_EMAIL is required');
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    errors.push('NEXT_PUBLIC_FIREBASE_API_KEY is required');
  }

  // Log errors
  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    return false;
  }

  // Log successful validation
  console.log('Configuration validated successfully:', {
    environment: config.environment,
    appUrl: config.appUrl,
    features: config.features,
  });

  return true;
};

// Get Firebase Functions config (legacy support)
export const getFirebaseConfig = () => {
  try {
    return functions.config();
  } catch {
    console.warn(
      'Firebase Functions config not available, using environment variables'
    );
    return {};
  }
};

// Environment-specific logging
export const log = {
  info: (message: string, data?: unknown) => {
    const config = getEnvironmentConfig();
    if (config.features.debug || config.environment === 'development') {
      console.log(
        `[${config.environment.toUpperCase()}] ${message}`,
        data || ''
      );
    }
  },

  error: (message: string, error?: unknown) => {
    const config = getEnvironmentConfig();
    console.error(
      `[${config.environment.toUpperCase()}] ${message}`,
      error || ''
    );
  },

  warn: (message: string, data?: unknown) => {
    const config = getEnvironmentConfig();
    if (config.features.debug || config.environment === 'development') {
      console.warn(
        `[${config.environment.toUpperCase()}] ${message}`,
        data || ''
      );
    }
  },
};

// Export configuration
export const config = getEnvironmentConfig();
