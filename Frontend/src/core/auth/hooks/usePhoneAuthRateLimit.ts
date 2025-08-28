/**
 * Phone Authentication Rate Limit Hook
 * Handles rate limiting for phone authentication
 */

import { useCallback } from "react";
import { rateLimitService } from "../services/rate-limit.service";

interface UsePhoneAuthRateLimitReturn {
  getRateLimitInfo: (phoneNumber: string) => any;
  isRateLimited: (phoneNumber: string) => boolean;
}

export const usePhoneAuthRateLimit = (): UsePhoneAuthRateLimitReturn => {
  // Get rate limit info
  const getRateLimitInfo = useCallback((phoneNumber: string) => {
    return rateLimitService.getRateLimitInfo(phoneNumber);
  }, []);

  // Check if rate limited
  const isRateLimited = useCallback((phoneNumber: string) => {
    const check = rateLimitService.checkSMSLimit(phoneNumber);
    return !check.allowed;
  }, []);

  return {
    getRateLimitInfo,
    isRateLimited,
  };
};
