/**
 * Study Session Database Operations
 */

import type { QueryResult, StudySession } from '@/lib/types/database';
import { Timestamp, serverTimestamp, where } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';

export class StudySessionDatabaseService extends DatabaseService {
  async createStudySession(
    userId: string,
    type: StudySession['type'],
    subject?: string,
    topic?: string
  ): Promise<StudySession> {
    const result = await this.create<StudySession>('studySessions', {
      userId,
      type,
      subject,
      topic,
      startTime: serverTimestamp() as Timestamp,
      duration: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      accuracy: 0,
      materialsUsed: [],
      conversationsUsed: [],
    });

    return result.data;
  }

  async endStudySession(
    sessionId: string,
    endTime: Timestamp,
    performance: {
      questionsAnswered: number;
      correctAnswers: number;
      materialsUsed?: string[];
      conversationsUsed?: string[];
    }
  ): Promise<StudySession> {
    const session = await this.getById<StudySession>(
      'studySessions',
      sessionId
    );
    if (!session) throw new Error('Study session not found');

    const duration = Math.round(
      (endTime.toMillis() - session.startTime.toMillis()) / (1000 * 60)
    );
    const accuracy =
      performance.questionsAnswered > 0
        ? (performance.correctAnswers / performance.questionsAnswered) * 100
        : 0;

    return this.update<StudySession>('studySessions', sessionId, {
      endTime,
      duration,
      questionsAnswered: performance.questionsAnswered,
      correctAnswers: performance.correctAnswers,
      accuracy,
      materialsUsed: performance.materialsUsed || [],
      conversationsUsed: performance.conversationsUsed || [],
    });
  }

  async getUserStudySessions(
    userId: string,
    options: { limit: number; startAfter?: unknown } = { limit: 20 }
  ): Promise<QueryResult<StudySession>> {
    return this.query<StudySession>(
      'studySessions',
      [where('userId', '==', userId)],
      {
        ...options,
        orderBy: 'startTime',
        orderDirection: 'desc',
      }
    );
  }
}

export const studySessionDatabaseService = new StudySessionDatabaseService();
