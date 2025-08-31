/**
 * Phone Authentication Service
 * Core phone authentication functionality with Firebase
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "../../firebase";
import { logger } from "../../../shared/utils/logger";
import { phoneNumberValidator } from "../utils/phone-validator";
import { rateLimitService } from "./rate-limit.service";
import { userProfileService } from "./user-profile.service";
import type { PhoneAuthState } from "../types/phone-auth.types";

class PhoneAuthService {
  private static instance: PhoneAuthService;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private state: PhoneAuthState = {
    phoneNumber: "",
    confirmationResult: null,
    isCodeSent: false,
    isVerifying: false,
    error: null,
    verificationId: null,
  };

  private constructor() {}

  public static getInstance(): PhoneAuthService {
    if (!PhoneAuthService.instance) {
      PhoneAuthService.instance = new PhoneAuthService();
    }
    return PhoneAuthService.instance;
  }

  /**
   * Initialize reCAPTCHA verifier with retry mechanism
   */
  public async initializeRecaptcha(
    containerId: string,
    retryCount = 0
  ): Promise<void> {
    // If already initialized, return immediately
    if (this.recaptchaVerifier) {
      return;
    }

    // If currently initializing, wait for the existing promise
    if (this.isInitializing && this.initializationPromise) {
      return this.initializationPromise;
    }

    // Set initialization flag and create promise
    this.isInitializing = true;
    this.initializationPromise = this._initializeRecaptcha(
      containerId,
      retryCount
    );

    try {
      await this.initializationPromise;
    } finally {
      this.isInitializing = false;
      this.initializationPromise = null;
    }
  }

  /**
   * Internal reCAPTCHA initialization method
   */
  private async _initializeRecaptcha(
    containerId: string,
    retryCount = 0
  ): Promise<void> {
    const maxRetries = 2;

    try {
      // Clear any existing reCAPTCHA instances first
      this.clearRecaptcha();

      // Check if reCAPTCHA script is loaded
      if (typeof (window as any).grecaptcha === "undefined") {
        // Wait for reCAPTCHA script to load
        await this.waitForRecaptchaScript();
      }

      // Wait for DOM element to be available with improved timing
      const waitForElement = (
        id: string,
        timeout = 10000
      ): Promise<HTMLElement> => {
        return new Promise((resolve, reject) => {
          const element = document.getElementById(id);
          if (element) {
            resolve(element);
            return;
          }

          // Use a more robust observer that checks for element visibility
          const observer = new MutationObserver(() => {
            const element = document.getElementById(id);
            if (element && element.offsetParent !== null) {
              observer.disconnect();
              resolve(element);
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"],
          });

          // Also check periodically as a fallback
          const interval = setInterval(() => {
            const element = document.getElementById(id);
            if (element && element.offsetParent !== null) {
              clearInterval(interval);
              observer.disconnect();
              resolve(element);
            }
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            reject(
              new Error(
                `reCAPTCHA container element with id '${id}' not found or not visible within ${timeout}ms. Please refresh the page and try again.`
              )
            );
          }, timeout);
        });
      };

      // Wait for the container element
      const container = await waitForElement(containerId);

      // Ensure the container is properly positioned and visible
      if (container.offsetParent === null) {
        throw new Error(
          `reCAPTCHA container is not visible. Please ensure the page is fully loaded and try again.`
        );
      }

      // Clear any existing reCAPTCHA instances in the container
      if ((window as any).grecaptcha && (window as any).grecaptcha.reset) {
        try {
          (window as any).grecaptcha.reset();
        } catch (e) {
          // Ignore reset errors
        }
      }

      // Clear the container content to prevent multiple renders
      container.innerHTML = "";

      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          logger.info("reCAPTCHA verification successful", "PhoneAuthService");
        },
        "expired-callback": () => {
          logger.warn("reCAPTCHA verification expired", "PhoneAuthService");
          this.clearRecaptcha();
        },
        "error-callback": (error: any) => {
          logger.error(
            "reCAPTCHA verification failed",
            "PhoneAuthService",
            error
          );
          this.clearRecaptcha();
        },
      });

      await this.recaptchaVerifier.render();
      logger.info(
        "reCAPTCHA verifier initialized successfully",
        "PhoneAuthService"
      );
    } catch (error) {
      logger.error("Failed to initialize reCAPTCHA", "PhoneAuthService", error);

      // Retry logic for initialization failures
      if (retryCount < maxRetries) {
        // Clear and retry
        this.clearRecaptcha();
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return this._initializeRecaptcha(containerId, retryCount + 1);
      }

      // Provide detailed error message after max retries
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `Failed to initialize security verification system after ${
          maxRetries + 1
        } attempts: ${errorMessage}. Please refresh the page and try again. If the problem persists, contact support.`
      );
    }
  }

  /**
   * Wait for reCAPTCHA script to load
   */
  private async waitForRecaptchaScript(timeout = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).grecaptcha !== "undefined") {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (typeof (window as any).grecaptcha !== "undefined") {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("reCAPTCHA script failed to load within timeout"));
      }, timeout);
    });
  }

  /**
   * Send verification code
   */
  public async sendVerificationCode(
    phoneNumber: string
  ): Promise<ConfirmationResult> {
    try {
      this.state.error = null;
      this.state.phoneNumber = phoneNumber;

      // Validate phone number
      if (!phoneNumberValidator.isValid(phoneNumber)) {
        throw new Error(
          "Please enter a valid phone number with country code (e.g., +91 9999999999)"
        );
      }

      // Check rate limiting
      const rateLimitCheck = rateLimitService.checkSMSLimit(phoneNumber);
      if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.message);
      }

      // Ensure reCAPTCHA is initialized
      if (!this.recaptchaVerifier) {
        try {
          await this.initializeRecaptcha("recaptcha-container");
        } catch (initError) {
          const errorMessage =
            initError instanceof Error
              ? initError.message
              : "Unknown initialization error";

          // Check if it's a domain authorization issue
          if (
            errorMessage.includes("invalid-app-credential") ||
            errorMessage.includes("Invalid app credentials")
          ) {
            throw new Error(
              `Domain authorization issue: ${errorMessage}. Please add your domain (${window.location.hostname}) to the authorized domains list in Firebase Console > Authentication > Settings > Authorized domains.`
            );
          }

          throw new Error(
            `Security verification system failed to initialize: ${errorMessage}. Please refresh the page and try again.`
          );
        }
      }

      // Send verification code
      this.state.isCodeSent = false;

      // Ensure we have a valid reCAPTCHA verifier
      if (!this.recaptchaVerifier) {
        throw new Error(
          "Security verification system not ready. Please refresh the page and try again."
        );
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      // Update state
      this.state.confirmationResult = confirmationResult;
      this.state.isCodeSent = true;
      this.state.verificationId = confirmationResult.verificationId;

      // Update rate limit
      rateLimitService.updateSMSLimit(phoneNumber);

      // Store verification start time
      rateLimitService.setVerificationStartTime(phoneNumber);

      logger.info("Verification code sent successfully", "PhoneAuthService", {
        phoneNumber,
        verificationId: confirmationResult.verificationId,
        timestamp: new Date().toISOString(),
      });
      return confirmationResult;
    } catch (error) {
      this.state.error = this.handleAuthError(error as AuthError);
      this.state.isCodeSent = false;

      // Enhanced error logging for debugging
      logger.error("Failed to send verification code", "PhoneAuthService", {
        error: error,
        errorCode: (error as AuthError).code,
        errorMessage: (error as AuthError).message,
        phoneNumber: phoneNumber,
        recaptchaReady: this.isRecaptchaReady(),
        timestamp: new Date().toISOString(),
      });

      throw new Error(this.state.error);
    }
  }

  /**
   * Verify OTP code
   */
  public async verifyCode(code: string): Promise<User> {
    try {
      if (!this.state.confirmationResult) {
        throw new Error(
          "No verification session found. Please request a new code."
        );
      }

      // Validate OTP format
      if (!/^\d{6}$/.test(code)) {
        throw new Error("Please enter a valid 6-digit verification code");
      }

      // Check verification attempts
      const attempts = rateLimitService.getVerificationAttempts(
        this.state.phoneNumber
      );
      if (attempts >= 3) {
        throw new Error(
          "Too many verification attempts. Please request a new code."
        );
      }

      // Check verification timeout
      if (rateLimitService.isVerificationExpired(this.state.phoneNumber)) {
        throw new Error(
          "Verification code has expired. Please request a new code."
        );
      }

      this.state.isVerifying = true;
      this.state.error = null;

      // Verify the code
      const result = await this.state.confirmationResult.confirm(code);
      const user = result.user;

      // Update verification attempts
      rateLimitService.incrementVerificationAttempts(this.state.phoneNumber);

      // Create or update user profile
      await userProfileService.createOrUpdateProfile(
        user,
        this.state.phoneNumber
      );

      // Clear rate limit data
      rateLimitService.clearRateLimitData(this.state.phoneNumber);

      // Reset state
      this.resetState();

      logger.info("Phone number verified successfully", "PhoneAuthService", {
        phoneNumber: this.state.phoneNumber,
        uid: user.uid,
        timestamp: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      this.state.isVerifying = false;
      this.state.error = this.handleAuthError(error as AuthError);

      // Enhanced error logging for debugging
      logger.error("Failed to verify code", "PhoneAuthService", {
        error: error,
        errorCode: (error as AuthError).code,
        errorMessage: (error as AuthError).message,
        phoneNumber: this.state.phoneNumber,
        verificationId: this.state.verificationId,
        timestamp: new Date().toISOString(),
      });

      throw new Error(this.state.error);
    }
  }

  /**
   * Clear reCAPTCHA verifier
   */
  public clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore clear errors
      }
      this.recaptchaVerifier = null;
    }

    // Reset initialization state
    this.isInitializing = false;
    this.initializationPromise = null;

    // Also clear any existing reCAPTCHA instances in the container
    const container = document.getElementById("recaptcha-container");
    if (container) {
      container.innerHTML = "";
    }

    // Reset global reCAPTCHA if available
    if ((window as any).grecaptcha && (window as any).grecaptcha.reset) {
      try {
        (window as any).grecaptcha.reset();
      } catch (e) {
        // Ignore reset errors
      }
    }
  }

  /**
   * Check if reCAPTCHA is ready
   */
  public isRecaptchaReady(): boolean {
    return this.recaptchaVerifier !== null;
  }

  /**
   * Get reCAPTCHA status for debugging
   */
  public getRecaptchaStatus(): {
    isReady: boolean;
    isInitialized: boolean;
    hasContainer: boolean;
  } {
    const container = document.getElementById("recaptcha-container");
    return {
      isReady: this.isRecaptchaReady(),
      isInitialized: this.recaptchaVerifier !== null,
      hasContainer: container !== null,
    };
  }

  /**
   * Get current state
   */
  public getState(): PhoneAuthState {
    return { ...this.state };
  }

  /**
   * Reset authentication state
   */
  private resetState(): void {
    this.state = {
      phoneNumber: "",
      confirmationResult: null,
      isCodeSent: false,
      isVerifying: false,
      error: null,
      verificationId: null,
    };
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: AuthError): string {
    switch (error.code) {
      case AuthErrorCodes.INVALID_PHONE_NUMBER:
        return "Invalid phone number format. Please enter a valid phone number with country code (e.g., +91 9876543210).";
      case AuthErrorCodes.QUOTA_EXCEEDED:
        return "SMS quota exceeded. Too many verification attempts. Please try again later or contact support.";
      case AuthErrorCodes.INVALID_RECAPTCHA_TOKEN:
        return "Security verification failed. Please refresh the page and try again. If the problem persists, try clearing your browser cache.";
      case AuthErrorCodes.USER_DISABLED:
        return "This account has been disabled. Please contact support for assistance.";
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        return "Phone authentication is not enabled for this app. Please contact support.";
      case "auth/invalid-verification-code":
        return "Invalid verification code. Please check the 6-digit code sent to your phone and try again.";
      case "auth/too-many-requests":
        return "Too many requests. Please wait a few minutes before trying again to avoid rate limiting.";
      case AuthErrorCodes.APP_NOT_AUTHORIZED:
        return "App not authorized. Please contact support to resolve this issue.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      case "auth/operation-not-supported-in-this-environment":
        return "Phone authentication is not supported in this environment. Please try a different browser or device.";
      case "auth/captcha-check-failed":
        return "Security verification failed. Please refresh the page and try again. If the problem persists, try disabling ad blockers.";
      case "auth/invalid-app-credential":
        return "Invalid app credentials. This usually means your Firebase configuration is incorrect or the domain is not authorized. Please check your Firebase console settings and ensure your domain is added to the authorized domains list.";
      case "auth/missing-app-credential":
        return "Missing app credentials. Please refresh the page and try again.";
      case "auth/session-expired":
        return "Session expired. Please refresh the page and try again.";
      case "auth/recaptcha-already-rendered":
        return "Security verification system error. Please refresh the page and try again.";
      default:
        return `Authentication failed: ${
          error.message || "Unknown error"
        }. Please try again or contact support if the problem persists.`;
    }
  }
}

// Export singleton instance
export const phoneAuthService = PhoneAuthService.getInstance();
