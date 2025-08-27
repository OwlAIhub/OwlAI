/**
 * Session Management Service
 * Handles user sessions, token refresh, and logout functionality
 */

import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";
import { logger } from "../../../shared/utils/logger";
import { STORAGE_UTILS, STORAGE_KEYS } from "../../../shared/constants";
import { userProfileService } from "./user-profile.service";
import { rateLimitService } from "./rate-limit.service";
import type { UserProfile, UserPreferences } from "../../../shared/types";

interface SessionData {
  userId: string;
  sessionId: string;
  startTime: number;
  lastActivity: number;
  userProfile?: UserProfile;
  userPreferences?: UserPreferences;
}

class SessionService {
  private static instance: SessionService;
  private currentSession: SessionData | null = null;
  private authStateUnsubscribe: (() => void) | null = null;

  private constructor() {
    this.initializeAuthStateListener();
  }

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * Initialize auth state listener
   */
  private initializeAuthStateListener(): void {
    this.authStateUnsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        await this.handleUserSignIn(user);
      } else {
        await this.handleUserSignOut();
      }
    });
  }

  /**
   * Handle user sign in
   */
  private async handleUserSignIn(user: User): Promise<void> {
    try {
      // Create session data
      const sessionId = this.generateSessionId();
      const sessionData: SessionData = {
        userId: user.uid,
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
      };

      // Store session data
      this.currentSession = sessionData;
      STORAGE_UTILS.set(STORAGE_KEYS.SESSION_ID, sessionId);
      STORAGE_UTILS.set(STORAGE_KEYS.USER, user);

      // Load user profile and preferences
      const [userProfile, userPreferences] = await Promise.all([
        userProfileService.getUserProfile(user.uid),
        userProfileService.getUserPreferences(user.uid),
      ]);

      if (userProfile) {
        this.currentSession.userProfile = userProfile;
        STORAGE_UTILS.set(STORAGE_KEYS.USER_PROFILE, userProfile);
      }

      if (userPreferences) {
        this.currentSession.userPreferences = userPreferences;
        STORAGE_UTILS.set(STORAGE_KEYS.USER_PREFERENCES, userPreferences);
      }

      logger.info("User session started", "SessionService", {
        userId: user.uid,
        sessionId,
        hasProfile: !!userProfile,
        hasPreferences: !!userPreferences,
      });
    } catch (error) {
      logger.error("Failed to handle user sign in", "SessionService", error);
    }
  }

  /**
   * Handle user sign out
   */
  private async handleUserSignOut(): Promise<void> {
    try {
      if (this.currentSession) {
        // Clear rate limit data
        const userProfile = this.currentSession.userProfile;
        if (userProfile?.phone) {
          rateLimitService.clearRateLimitData(userProfile.phone);
        }

        // Clear session data
        this.currentSession = null;
        STORAGE_UTILS.remove(STORAGE_KEYS.SESSION_ID);
        STORAGE_UTILS.remove(STORAGE_KEYS.USER);
        STORAGE_UTILS.remove(STORAGE_KEYS.USER_PROFILE);
        STORAGE_UTILS.remove(STORAGE_KEYS.USER_PREFERENCES);

        logger.info("User session ended", "SessionService");
      }
    } catch (error) {
      logger.error("Failed to handle user sign out", "SessionService", error);
    }
  }

  /**
   * Sign out user
   */
  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      logger.info("User signed out successfully", "SessionService");
    } catch (error) {
      logger.error("Failed to sign out", "SessionService", error);
      throw new Error("Failed to sign out. Please try again.");
    }
  }

  /**
   * Get current session data
   */
  public getCurrentSession(): SessionData | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * Update last activity
   */
  public updateLastActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = Date.now();
    }
  }

  /**
   * Check if session is active
   */
  public isSessionActive(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Get session duration in minutes
   */
  public getSessionDuration(): number {
    if (!this.currentSession) return 0;

    const duration = Date.now() - this.currentSession.startTime;
    return Math.floor(duration / (1000 * 60));
  }

  /**
   * Get time since last activity in minutes
   */
  public getTimeSinceLastActivity(): number {
    if (!this.currentSession) return 0;

    const timeSince = Date.now() - this.currentSession.lastActivity;
    return Math.floor(timeSince / (1000 * 60));
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup service
   */
  public cleanup(): void {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
      this.authStateUnsubscribe = null;
    }
  }
}

// Export singleton instance
export const sessionService = SessionService.getInstance();

// Export types
export type { SessionData };
