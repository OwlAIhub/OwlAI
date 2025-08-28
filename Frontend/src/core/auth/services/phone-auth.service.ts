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
   * Initialize reCAPTCHA verifier
   */
  public async initializeRecaptcha(containerId: string): Promise<void> {
    try {
      this.clearRecaptcha();

      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible", // Invisible - no user interaction needed
        callback: () => {
          logger.info("reCAPTCHA verification successful", "PhoneAuthService");
        },
        "expired-callback": () => {
          logger.warn("reCAPTCHA verification expired", "PhoneAuthService");
          this.clearRecaptcha();
        },
        "error-callback": () => {
          logger.error("reCAPTCHA verification failed", "PhoneAuthService");
          this.clearRecaptcha();
        },
        // Use reCAPTCHA v2 instead of Enterprise
        version: "v2",
        // Additional options for better UX
        theme: "light",
        badge: "bottomright", // Position the reCAPTCHA badge
      });

      await this.recaptchaVerifier.render();
      logger.info("reCAPTCHA verifier initialized", "PhoneAuthService");
    } catch (error) {
      logger.error("Failed to initialize reCAPTCHA", "PhoneAuthService", error);

      // In development, we can continue without reCAPTCHA
      if (import.meta.env.DEV) {
        console.warn(
          "reCAPTCHA initialization failed in dev mode, continuing:",
          error
        );
        return;
      }

      // In production, we need reCAPTCHA to work
      throw new Error(
        "Failed to initialize verification system. Please refresh the page and try again."
      );
    }
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
        if (import.meta.env.DEV) {
          throw new Error(
            "Verification system not initialized. Please refresh the page."
          );
        } else {
          throw new Error(
            "Security verification failed. Please refresh the page and try again."
          );
        }
      }

      // Send verification code
      this.state.isCodeSent = false;
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
      });
      return confirmationResult;
    } catch (error) {
      this.state.error = this.handleAuthError(error as AuthError);
      this.state.isCodeSent = false;
      logger.error(
        "Failed to send verification code",
        "PhoneAuthService",
        error
      );
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
      });

      return user;
    } catch (error) {
      this.state.isVerifying = false;
      this.state.error = this.handleAuthError(error as AuthError);
      logger.error("Failed to verify code", "PhoneAuthService", error);
      throw new Error(this.state.error);
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
    isDevelopment: boolean;
    isDisabled: boolean;
  } {
    return {
      isReady: this.isRecaptchaReady(),
      isDevelopment: import.meta.env.DEV,
      isDisabled: import.meta.env.DEV,
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
        return "Invalid phone number format. Please check and try again.";
      case AuthErrorCodes.QUOTA_EXCEEDED:
        return "SMS quota exceeded. Please try again later.";
      case AuthErrorCodes.INVALID_RECAPTCHA_TOKEN:
        return "Verification failed. Please refresh and try again.";
      case AuthErrorCodes.USER_DISABLED:
        return "This account has been disabled. Please contact support.";
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        return "Phone authentication is not enabled. Please contact support.";
      case "auth/invalid-verification-code":
        return "Invalid verification code. Please check and try again.";
      case "auth/too-many-requests":
        return "Too many requests. Please wait before trying again.";
      case AuthErrorCodes.APP_NOT_AUTHORIZED:
        return "App not authorized. Please contact support.";
      default:
        return error.message || "Authentication failed. Please try again.";
    }
  }
}

// Export singleton instance
export const phoneAuthService = PhoneAuthService.getInstance();
