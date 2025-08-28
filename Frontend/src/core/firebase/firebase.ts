import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  // PhoneAuthProvider, // Removed unused import
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

// Phone authentication utilities
export class PhoneAuthService {
  private static instance: PhoneAuthService;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  private constructor() {}

  public static getInstance(): PhoneAuthService {
    if (!PhoneAuthService.instance) {
      PhoneAuthService.instance = new PhoneAuthService();
    }
    return PhoneAuthService.instance;
  }

  /**
   * Initialize reCAPTCHA verifier
   */
  public initializeRecaptcha(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
          callback: () => {
            resolve();
          },
          "expired-callback": () => {
            reject(new Error("reCAPTCHA expired"));
          },
          // Use reCAPTCHA v2 instead of Enterprise
          version: "v2",
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send phone number verification code
   */
  public async sendVerificationCode(
    phoneNumber: string
  ): Promise<ConfirmationResult> {
    if (!this.recaptchaVerifier) {
      throw new Error("reCAPTCHA verifier not initialized");
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return confirmationResult;
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Verify phone number with OTP code
   */
  public async verifyCode(
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<User> {
    try {
      const result = await confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Sign out user
   */
  public async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Get current user
   */
  public getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: AuthError): Error {
    switch (error.code) {
      case AuthErrorCodes.INVALID_PHONE_NUMBER:
        return new Error("Invalid phone number format");
      case "auth/invalid-verification-code":
        return new Error("Invalid verification code");
      case AuthErrorCodes.QUOTA_EXCEEDED:
        return new Error(
          "Too many verification attempts. Please try again later"
        );
      case AuthErrorCodes.INVALID_RECAPTCHA_TOKEN:
        return new Error("reCAPTCHA verification failed");
      case AuthErrorCodes.USER_DISABLED:
        return new Error("This account has been disabled");
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        return new Error(
          "Phone authentication is not enabled for this project"
        );
      default:
        return new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Clear reCAPTCHA verifier
   */
  public clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
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

// Export singleton instance
export const phoneAuthService = PhoneAuthService.getInstance();
