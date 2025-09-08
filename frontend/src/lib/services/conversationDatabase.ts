/**
 * Conversation Database Operations
 */

import type { Conversation } from '@/lib/types/database';
import { serverTimestamp, where } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';

export class ConversationDatabaseService extends DatabaseService {
  async createConversation(
    userId: string,
    title: string,
    subject?: string,
    examType?: string
  ): Promise<Conversation> {
    const result = await this.create<Conversation>('conversations', {
      userId,
      title,
      subject,
      examType,
      messageCount: 0,
      lastMessageAt: serverTimestamp() as any,
      isArchived: false,
      isFavorite: false,
      tags: [],
    });

    return result.data;
  }

  async getUserConversations(
    userId: string,
    options: any = { limit: 20 }
  ): Promise<any> {
    return this.query<Conversation>(
      'conversations',
      [where('userId', '==', userId), where('isArchived', '==', false)],
      {
        ...options,
        orderBy: 'lastMessageAt',
        orderDirection: 'desc',
      }
    );
  }

  async updateConversation(
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    return this.update<Conversation>('conversations', conversationId, updates);
  }

  async archiveConversation(conversationId: string): Promise<void> {
    await this.update('conversations', conversationId, {
      isArchived: true,
    });
  }

  async incrementMessageCount(conversationId: string): Promise<void> {
    const conversation = await this.getById<Conversation>(
      'conversations',
      conversationId
    );
    if (!conversation) throw new Error('Conversation not found');

    await this.update('conversations', conversationId, {
      messageCount: conversation.messageCount + 1,
      lastMessageAt: serverTimestamp(),
    });
  }
}

export const conversationDatabaseService = new ConversationDatabaseService();
