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
    const result = await this.create<Record<string, unknown>>('studySessions', {
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

    const created = await this.getById<StudySession>(
      'studySessions',
      result.id
    );
    if (!created) throw new Error('Failed to read created study session');
    return created;
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

    return (await this.update<Record<string, unknown>>(
      'studySessions',
      sessionId,
      {
        endTime,
        duration,
        questionsAnswered: performance.questionsAnswered,
        correctAnswers: performance.correctAnswers,
        accuracy,
        materialsUsed: performance.materialsUsed || [],
        conversationsUsed: performance.conversationsUsed || [],
      }
    )) as unknown as StudySession;
  }

  async getUserStudySessions(
    userId: string,
    options: { limit: number; startAfter?: unknown } = { limit: 20 }
  ): Promise<QueryResult<StudySession>> {
    return this.query<StudySession>(
      'studySessions',
      [where('userId', '==', userId)],
      {
        orderBy: 'startTime',
        orderDirection: 'desc',
        limit: options.limit,
        startAfter: options.startAfter,
      }
    );
  }
}

export const studySessionDatabaseService = new StudySessionDatabaseService();
