/**
 * Rate Limiting Service
 * Handles SMS rate limiting and verification attempt tracking
 */

import { STORAGE_UTILS } from "../../../shared/constants";
import { logger } from "../../../shared/utils/logger";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  SMS_COOLDOWN: 60 * 1000, // 1 minute between SMS requests
  MAX_SMS_PER_HOUR: 5,
  MAX_SMS_PER_DAY: 10,
  VERIFICATION_TIMEOUT: 5 * 60 * 1000, // 5 minutes for OTP verification
  MAX_VERIFICATION_ATTEMPTS: 3,
} as const;

// Storage keys for rate limiting
const RATE_LIMIT_KEYS = {
  SMS_COUNT: "phone_auth_sms_count",
  LAST_SMS_TIME: "phone_auth_last_sms_time",
  VERIFICATION_ATTEMPTS: "phone_auth_verification_attempts",
  VERIFICATION_START_TIME: "phone_auth_verification_start_time",
} as const;

interface RateLimitCheck {
  allowed: boolean;
  message?: string;
}

interface RateLimitInfo {
  smsCount: number;
  lastSmsTime: number;
  verificationAttempts: number;
  verificationStartTime: number;
}

class RateLimitService {
  private static instance: RateLimitService;

  private constructor() {}

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  /**
   * Check SMS rate limiting
   */
  public checkSMSLimit(phoneNumber: string): RateLimitCheck {
    const now = Date.now();
    const rateLimitKey = `${RATE_LIMIT_KEYS.SMS_COUNT}_${phoneNumber}`;
    const lastSmsKey = `${RATE_LIMIT_KEYS.LAST_SMS_TIME}_${phoneNumber}`;

    // Get current rate limit info
    const smsCount = STORAGE_UTILS.get<number>(rateLimitKey, 0) || 0;
    const lastSmsTime = STORAGE_UTILS.get<number>(lastSmsKey, 0) || 0;

    // Check cooldown period
    if (now - lastSmsTime < RATE_LIMIT_CONFIG.SMS_COOLDOWN) {
      const remainingTime = Math.ceil(
        (RATE_LIMIT_CONFIG.SMS_COOLDOWN - (now - lastSmsTime)) / 1000
      );
      return {
        allowed: false,
        message: `Please wait ${remainingTime} seconds before requesting another code`,
      };
    }

    // Check hourly limit
    const oneHourAgo = now - 60 * 60 * 1000;
    if (
      lastSmsTime > oneHourAgo &&
      smsCount >= RATE_LIMIT_CONFIG.MAX_SMS_PER_HOUR
    ) {
      return {
        allowed: false,
        message: "Too many SMS requests. Please try again in an hour",
      };
    }

    // Check daily limit
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    if (
      lastSmsTime > oneDayAgo &&
      smsCount >= RATE_LIMIT_CONFIG.MAX_SMS_PER_DAY
    ) {
      return {
        allowed: false,
        message: "Daily SMS limit reached. Please try again tomorrow",
      };
    }

    return { allowed: true };
  }

  /**
   * Update SMS rate limit counters
   */
  public updateSMSLimit(phoneNumber: string): void {
    const now = Date.now();
    const rateLimitKey = `${RATE_LIMIT_KEYS.SMS_COUNT}_${phoneNumber}`;
    const lastSmsKey = `${RATE_LIMIT_KEYS.LAST_SMS_TIME}_${phoneNumber}`;

    const currentCount = STORAGE_UTILS.get<number>(rateLimitKey, 0) || 0;
    const lastSmsTime = STORAGE_UTILS.get<number>(lastSmsKey, 0) || 0;

    // Reset count if more than an hour has passed
    const oneHourAgo = now - 60 * 60 * 1000;
    const newCount = lastSmsTime > oneHourAgo ? currentCount + 1 : 1;

    STORAGE_UTILS.set(rateLimitKey, newCount);
    STORAGE_UTILS.set(lastSmsKey, now);

    logger.info("SMS rate limit updated", "RateLimitService", {
      phoneNumber,
      newCount,
      lastSmsTime: now,
    });
  }

  /**
   * Set verification start time
   */
  public setVerificationStartTime(phoneNumber: string): void {
    const startTimeKey = `${RATE_LIMIT_KEYS.VERIFICATION_START_TIME}_${phoneNumber}`;
    STORAGE_UTILS.set(startTimeKey, Date.now());
  }

  /**
   * Get verification attempts count
   */
  public getVerificationAttempts(phoneNumber: string): number {
    const attemptsKey = `${RATE_LIMIT_KEYS.VERIFICATION_ATTEMPTS}_${phoneNumber}`;
    return STORAGE_UTILS.get<number>(attemptsKey, 0) || 0;
  }

  /**
   * Increment verification attempts
   */
  public incrementVerificationAttempts(phoneNumber: string): void {
    const attemptsKey = `${RATE_LIMIT_KEYS.VERIFICATION_ATTEMPTS}_${phoneNumber}`;
    const currentAttempts = this.getVerificationAttempts(phoneNumber);
    STORAGE_UTILS.set(attemptsKey, currentAttempts + 1);
  }

  /**
   * Check if verification has expired
   */
  public isVerificationExpired(phoneNumber: string): boolean {
    const startTimeKey = `${RATE_LIMIT_KEYS.VERIFICATION_START_TIME}_${phoneNumber}`;
    const startTime = STORAGE_UTILS.get<number>(startTimeKey, 0) || 0;
    const now = Date.now();

    return now - startTime > RATE_LIMIT_CONFIG.VERIFICATION_TIMEOUT;
  }

  /**
   * Clear rate limit data for a phone number
   */
  public clearRateLimitData(phoneNumber: string): void {
    const keys = [
      `${RATE_LIMIT_KEYS.SMS_COUNT}_${phoneNumber}`,
      `${RATE_LIMIT_KEYS.LAST_SMS_TIME}_${phoneNumber}`,
      `${RATE_LIMIT_KEYS.VERIFICATION_ATTEMPTS}_${phoneNumber}`,
      `${RATE_LIMIT_KEYS.VERIFICATION_START_TIME}_${phoneNumber}`,
    ];

    keys.forEach(key => STORAGE_UTILS.remove(key));

    logger.info("Rate limit data cleared", "RateLimitService", { phoneNumber });
  }

  /**
   * Get rate limit info for debugging
   */
  public getRateLimitInfo(phoneNumber: string): RateLimitInfo {
    return {
      smsCount:
        STORAGE_UTILS.get<number>(
          `${RATE_LIMIT_KEYS.SMS_COUNT}_${phoneNumber}`,
          0
        ) || 0,
      lastSmsTime:
        STORAGE_UTILS.get<number>(
          `${RATE_LIMIT_KEYS.LAST_SMS_TIME}_${phoneNumber}`,
          0
        ) || 0,
      verificationAttempts:
        STORAGE_UTILS.get<number>(
          `${RATE_LIMIT_KEYS.VERIFICATION_ATTEMPTS}_${phoneNumber}`,
          0
        ) || 0,
      verificationStartTime:
        STORAGE_UTILS.get<number>(
          `${RATE_LIMIT_KEYS.VERIFICATION_START_TIME}_${phoneNumber}`,
          0
        ) || 0,
    };
  }

  /**
   * Get rate limit configuration
   */
  public getConfig() {
    return { ...RATE_LIMIT_CONFIG };
  }
}

// Export singleton instance
export const rateLimitService = RateLimitService.getInstance();

// Export types
export type { RateLimitCheck, RateLimitInfo };
