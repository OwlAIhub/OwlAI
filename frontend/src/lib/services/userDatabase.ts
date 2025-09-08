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
    // Ensure document is created at users/{uid} to satisfy security rules
    const id = (userData as unknown as { id?: string }).id;
    if (!id) {
      throw new Error('User ID is required to create profile');
    }

    await this.createWithId<Record<string, unknown>>('users', id, {
      ...(userData as unknown as Record<string, unknown>),
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

    const created = await this.getById<UserProfile>('users', id);
    if (!created) {
      throw new Error('Failed to read created user profile');
    }
    return created;
  }

  async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    return this.update<Record<string, unknown>>(
      'users',
      uid,
      updates as unknown as Record<string, unknown>
    ) as unknown as UserProfile;
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
