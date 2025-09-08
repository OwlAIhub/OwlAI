/**
 * Message Database Operations
 */

import type { ChatMessage } from '@/lib/types/database';
import { Timestamp, serverTimestamp, where } from 'firebase/firestore';
import { DatabaseService } from './baseDatabase';
import { conversationDatabaseService } from './conversationDatabase';

export class MessageDatabaseService extends DatabaseService {
  async createMessage(
    conversationId: string,
    userId: string,
    type: 'user' | 'bot',
    content: string,
    aiMetadata?: ChatMessage['aiMetadata']
  ): Promise<ChatMessage> {
    const result = await this.create<Record<string, unknown>>('messages', {
      conversationId,
      userId,
      type,
      content,
      aiMetadata,
      isEdited: false,
      isDeleted: false,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    });

    // Update conversation message count
    await conversationDatabaseService.incrementMessageCount(conversationId);

    const created = await this.getById<ChatMessage>('messages', result.id);
    if (!created) throw new Error('Failed to read created message');
    return created;
  }

  async getConversationMessages(
    conversationId: string,
    options: { limit?: number; startAfter?: unknown } = { limit: 50 }
  ): Promise<import('@/lib/types/database').QueryResult<ChatMessage>> {
    return this.query<ChatMessage>(
      'messages',
      [
        where('conversationId', '==', conversationId),
        where('isDeleted', '==', false),
      ],
      {
        orderBy: 'createdAt',
        orderDirection: 'asc',
        limit: options.limit ?? 50,
        startAfter: options.startAfter,
      }
    );
  }

  async updateMessage(
    messageId: string,
    updates: Partial<ChatMessage>
  ): Promise<ChatMessage> {
    return (await this.update<Record<string, unknown>>('messages', messageId, {
      ...updates,
      isEdited: true,
      updatedAt: serverTimestamp(),
    })) as unknown as ChatMessage;
  }

  async addUserFeedback(
    messageId: string,
    feedback: ChatMessage['userFeedback']
  ): Promise<void> {
    await this.update('messages', messageId, {
      userFeedback: feedback,
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.update('messages', messageId, {
      isDeleted: true,
    });
  }

  async restoreMessage(messageId: string): Promise<void> {
    await this.update('messages', messageId, {
      isDeleted: false,
    });
  }
}

export const messageDatabaseService = new MessageDatabaseService();
