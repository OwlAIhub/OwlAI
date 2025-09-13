import { useState, useCallback } from "react";
import { appConfig } from "@/lib/firebase/config";

export function useRateLimit() {
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const startCooldownTimer = useCallback((seconds: number) => {
    setCooldownRemaining(seconds);

    const countdown = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return countdown;
  }, []);

  const checkRateLimit = useCallback((): {
    allowed: boolean;
    remainingTime?: number;
  } => {
    const now = Date.now();
    const cooldownPeriod = appConfig.security.otpCooldownSeconds * 1000;
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < cooldownPeriod) {
      const remainingTime = Math.ceil(
        (cooldownPeriod - timeSinceLastRequest) / 1000,
      );
      return { allowed: false, remainingTime };
    }

    if (attemptCount >= appConfig.security.maxOtpAttempts) {
      return { allowed: false };
    }

    return { allowed: true };
  }, [lastRequestTime, attemptCount]);

  const updateRequestTime = useCallback(() => {
    const now = Date.now();
    setLastRequestTime(now);
    setAttemptCount((prev) => prev + 1);
  }, []);

  const resetAttempts = useCallback(() => {
    setAttemptCount(0);
    setLastRequestTime(0);
    setCooldownRemaining(0);
  }, []);

  return {
    cooldownRemaining,
    checkRateLimit,
    startCooldownTimer,
    updateRequestTime,
    resetAttempts
  };
}