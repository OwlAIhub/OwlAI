/**
 * User Service - Handles user profile operations
 */

import type { UserProfile } from '@/lib/types/database';
import { userService as dbUserService } from './database';

export class UserService {
  async createUserProfile(userData: {
    id: string;
    phoneNumber: string;
    displayName?: string;
  }): Promise<UserProfile> {
    return dbUserService.createUserProfile({
      ...userData,
      preferences: {
        language: 'en',
        examType: 'ugc-net',
        studyLevel: 'beginner',
        notifications: {
          email: false,
          push: true,
          studyReminders: true,
        },
      },
      studyStats: {
        totalStudyTime: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        streakDays: 0,
        lastStudyDate:
          new Date() as unknown as import('firebase/firestore').Timestamp,
        favoriteTopics: [],
      },
      isActive: true,
    });
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return dbUserService.getUserProfile(uid);
  }

  async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    return dbUserService.updateUserProfile(uid, updates);
  }

  async updateLastLogin(uid: string): Promise<void> {
    return dbUserService.updateLastLogin(uid);
  }
}

export const userService = new UserService();

export class RateLimiter {
  private userMessageWindowMs = Number(
    process.env.NEXT_PUBLIC_RATE_WINDOW_MS || 60_000
  );
  private userMessageLimit = Number(
    process.env.NEXT_PUBLIC_RATE_LIMIT_MESSAGES || 30
  );
  private sessionCap = Number(process.env.NEXT_PUBLIC_SESSION_CAP || 50);

  private messageTimestamps: Map<string, number[]> = new Map();

  canSendMessage(userId: string): { ok: boolean; retryAfterMs: number } {
    const now = Date.now();
    const windowStart = now - this.userMessageWindowMs;
    const arr = this.messageTimestamps.get(userId) || [];
    const pruned = arr.filter(ts => ts > windowStart);
    if (pruned.length >= this.userMessageLimit) {
      const oldest = Math.min(...pruned);
      const retryAfterMs = Math.max(
        0,
        this.userMessageWindowMs - (now - oldest)
      );
      return { ok: false, retryAfterMs };
    }
    pruned.push(now);
    this.messageTimestamps.set(userId, pruned);
    return { ok: true, retryAfterMs: 0 };
  }

  async canCreateConversation(
    getCount: () => Promise<number>
  ): Promise<boolean> {
    try {
      const count = await getCount();
      return count < this.sessionCap;
    } catch {
      return true; // fail-open
    }
  }
}

export const rateLimiter = new RateLimiter();
