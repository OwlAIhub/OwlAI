/**
 * Phone Authentication Types
 * Type definitions for phone authentication functionality
 */

import { ConfirmationResult } from "firebase/auth";

export interface PhoneAuthState {
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  isCodeSent: boolean;
  isVerifying: boolean;
  error: string | null;
  verificationId: string | null;
}

export interface PhoneAuthConfig {
  recaptchaContainerId: string;
  enableRateLimiting: boolean;
  maxSMSAttempts: number;
  verificationTimeout: number;
}

export interface PhoneAuthResult {
  success: boolean;
  user?: any;
  error?: string;
  verificationId?: string;
}

export interface SMSRateLimit {
  smsCount: number;
  lastSmsTime: number;
  cooldownRemaining: number;
  hourlyLimit: number;
  dailyLimit: number;
}

export interface VerificationAttempt {
  attempts: number;
  startTime: number;
  isExpired: boolean;
  maxAttempts: number;
}

export interface PhoneAuthError {
  code: string;
  message: string;
  details?: any;
}

export interface PhoneAuthSession {
  phoneNumber: string;
  verificationId: string;
  startTime: number;
  expiresAt: number;
  attempts: number;
}
