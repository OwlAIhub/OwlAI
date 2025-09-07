/**
 * Environment validation utilities for production safety
 */

export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates Firebase environment variables
 */
export const validateFirebaseEnvironment = (): EnvironmentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check optional but recommended variables
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    warnings.push(
      'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is missing - analytics will be disabled'
    );
  }

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    // Validate API key format
    if (
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')
    ) {
      errors.push('Firebase API key format appears invalid');
    }

    // Validate project ID format
    if (
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('-')
    ) {
      errors.push('Firebase project ID format appears invalid');
    }

    // Validate auth domain format
    if (
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('.firebaseapp.com') // cspell:ignore firebaseapp
    ) {
      errors.push('Firebase auth domain format appears invalid');
    }

    // Check for development values in production
    const devValues = ['localhost', '127.0.0.1', 'test', 'dev', 'development'];
    const envValues = Object.values(process.env).join(' ').toLowerCase();

    if (devValues.some(devValue => envValues.includes(devValue))) {
      warnings.push('Development values detected in production environment');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates general application environment
 */
export const validateAppEnvironment = (): EnvironmentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required app environment variables
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push(
      'NEXT_PUBLIC_APP_URL is not set - some features may not work correctly'
    );
  }

  // Validate URL format if provided
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_APP_URL);
    } catch {
      errors.push('NEXT_PUBLIC_APP_URL format is invalid');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Comprehensive environment validation
 */
export const validateAllEnvironments = (): EnvironmentValidationResult => {
  const firebaseResult = validateFirebaseEnvironment();
  const appResult = validateAppEnvironment();

  return {
    isValid: firebaseResult.isValid && appResult.isValid,
    errors: [...firebaseResult.errors, ...appResult.errors],
    warnings: [...firebaseResult.warnings, ...appResult.warnings],
  };
};

/**
 * Logs environment validation results
 */
export const logEnvironmentValidation = (
  result: EnvironmentValidationResult
): void => {
  if (result.errors.length > 0) {
    console.error('Environment Validation Errors:', result.errors);
  }

  if (result.warnings.length > 0) {
    console.warn('Environment Validation Warnings:', result.warnings);
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed');
  }
};

/**
 * Gets environment info for debugging (development only)
 */
export const getEnvironmentInfo = (): Record<
  string,
  string | boolean | undefined
> => {
  if (process.env.NODE_ENV !== 'development') {
    return { message: 'Environment info only available in development' };
  }

  return {
    nodeEnv: process.env.NODE_ENV,
    hasFirebaseConfig: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    timestamp: new Date().toISOString(),
  };
};
