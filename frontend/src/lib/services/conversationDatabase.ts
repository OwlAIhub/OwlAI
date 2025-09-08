/**
 * Conversation Database Operations
 */

import type { Conversation } from '@/lib/types/database';
import { Timestamp, serverTimestamp, where } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';

export class ConversationDatabaseService extends DatabaseService {
  async createConversation(
    userId: string,
    title: string,
    subject?: string,
    examType?: string
  ): Promise<Conversation> {
    const result = await this.create<Record<string, unknown>>('conversations', {
      userId,
      title,
      subject,
      examType,
      messageCount: 0,
      lastMessageAt: serverTimestamp() as Timestamp,
      isArchived: false,
      isFavorite: false,
      tags: [],
    });

    const created = await this.getById<Conversation>(
      'conversations',
      result.id
    );
    if (!created) throw new Error('Failed to read created conversation');
    return created;
  }

  async getUserConversations(
    userId: string,
    options: { limit?: number; startAfter?: unknown } = { limit: 20 }
  ): Promise<import('@/lib/types/database').QueryResult<Conversation>> {
    return this.query<Conversation>(
      'conversations',
      [where('userId', '==', userId), where('isArchived', '==', false)],
      {
        orderBy: 'lastMessageAt',
        orderDirection: 'desc',
        limit: options.limit ?? 20,
        startAfter: options.startAfter,
      }
    );
  }

  async getUserConversationCount(userId: string): Promise<number> {
    const result = await this.query<Conversation>(
      'conversations',
      [where('userId', '==', userId), where('isArchived', '==', false)],
      { limit: 1 }
    );
    return result.total ?? result.data.length;
  }

  async updateConversation(
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    return (await this.update<Record<string, unknown>>(
      'conversations',
      conversationId,
      updates as unknown as Record<string, unknown>
    )) as unknown as Conversation;
  }

  async renameConversation(
    conversationId: string,
    title: string
  ): Promise<Conversation> {
    return this.updateConversation(conversationId, { title });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.delete('conversations', conversationId);
  }

  async markOpened(conversationId: string): Promise<Conversation> {
    return this.updateConversation(conversationId, {
      lastOpenedAt: serverTimestamp() as Timestamp,
    });
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
