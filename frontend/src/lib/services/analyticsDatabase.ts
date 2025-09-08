/**
 * Analytics Database Operations
 */

import type { UserAnalytics } from '@/lib/types/database';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';

export class AnalyticsDatabaseService extends DatabaseService {
  async updateDailyStats(
    userId: string,
    date: string,
    stats: {
      studyTime?: number;
      questionsAnswered?: number;
      conversationsStarted?: number;
      materialsCreated?: number;
    }
  ): Promise<void> {
    const analytics = await this.getById<UserAnalytics>('analytics', userId);

    if (!analytics) {
      // Create new analytics record
      await this.create<UserAnalytics>('analytics', {
        userId,
        dailyStats: [
          {
            date,
            studyTime: stats.studyTime || 0,
            questionsAnswered: stats.questionsAnswered || 0,
            conversationsStarted: stats.conversationsStarted || 0,
            materialsCreated: stats.materialsCreated || 0,
          },
        ],
        weeklyStats: [],
        monthlyStats: [],
        learningPatterns: {
          preferredStudyTime: '09:00',
          averageSessionLength: 0,
          mostProductiveDays: [],
          favoriteSubjects: [],
        },
        lastUpdated: serverTimestamp() as Timestamp,
      });
    } else {
      // Update existing analytics
      const dailyStats = analytics.dailyStats || [];
      const existingDayIndex = dailyStats.findIndex(day => day.date === date);

      if (existingDayIndex >= 0) {
        // Update existing day
        dailyStats[existingDayIndex] = {
          ...dailyStats[existingDayIndex],
          studyTime:
            (dailyStats[existingDayIndex].studyTime || 0) +
            (stats.studyTime || 0),
          questionsAnswered:
            (dailyStats[existingDayIndex].questionsAnswered || 0) +
            (stats.questionsAnswered || 0),
          conversationsStarted:
            (dailyStats[existingDayIndex].conversationsStarted || 0) +
            (stats.conversationsStarted || 0),
          materialsCreated:
            (dailyStats[existingDayIndex].materialsCreated || 0) +
            (stats.materialsCreated || 0),
        };
      } else {
        // Add new day
        dailyStats.push({
          date,
          studyTime: stats.studyTime || 0,
          questionsAnswered: stats.questionsAnswered || 0,
          conversationsStarted: stats.conversationsStarted || 0,
          materialsCreated: stats.materialsCreated || 0,
        });
      }

      await this.update('analytics', userId, {
        dailyStats,
        lastUpdated: serverTimestamp(),
      });
    }
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    return this.getById<UserAnalytics>('analytics', userId);
  }
}

export const analyticsDatabaseService = new AnalyticsDatabaseService();
