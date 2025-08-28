/**
 * Phone Authentication Session Hook
 * Handles session management for phone authentication
 */

import { useCallback } from "react";
import { sessionService } from "../services/session.service";

interface UsePhoneAuthSessionReturn {
  sessionDuration: number;
  timeSinceLastActivity: number;
}

export const usePhoneAuthSession = (): UsePhoneAuthSessionReturn => {
  // Get session duration
  const sessionDuration = useCallback(() => {
    return sessionService.getSessionDuration();
  }, []);

  // Get time since last activity
  const timeSinceLastActivity = useCallback(() => {
    return sessionService.getTimeSinceLastActivity();
  }, []);

  return {
    sessionDuration: sessionDuration(),
    timeSinceLastActivity: timeSinceLastActivity(),
  };
};
