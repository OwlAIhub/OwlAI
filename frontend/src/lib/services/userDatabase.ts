/**
 * User Database Operations
 */

import type { UserProfile } from '@/lib/types/database';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';

export class UserDatabaseService extends DatabaseService {
  async createUserProfile(
    userData: Omit<
      UserProfile,
      'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
    >
  ): Promise<UserProfile> {
    const result = await this.create<UserProfile>('users', {
      ...userData,
      studyStats: {
        totalStudyTime: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        streakDays: 0,
        lastStudyDate: serverTimestamp() as Timestamp,
        favoriteTopics: [],
      },
      lastLoginAt: serverTimestamp() as Timestamp,
      isActive: true,
    });

    return result.data;
  }

  async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    return this.update<UserProfile>('users', uid, updates);
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return this.getById<UserProfile>('users', uid);
  }

  async updateLastLogin(uid: string): Promise<void> {
    await this.update('users', uid, {
      lastLoginAt: serverTimestamp(),
    });
  }

  async updateStudyStats(
    uid: string,
    stats: Partial<UserProfile['studyStats']>
  ): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');

    await this.update('users', uid, {
      studyStats: {
        ...user.studyStats,
        ...stats,
      },
    });
  }
}

export const userDatabaseService = new UserDatabaseService();
