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
        lastStudyDate: new Date() as any,
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
