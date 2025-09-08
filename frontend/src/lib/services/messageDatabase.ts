/**
 * Message Database Operations
 */

import type { ChatMessage } from '@/lib/types/database';
import { where } from 'firebase/firestore';
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
    const result = await this.create<ChatMessage>('messages', {
      conversationId,
      userId,
      type,
      content,
      aiMetadata,
      isEdited: false,
      isDeleted: false,
    });

    // Update conversation message count
    await conversationDatabaseService.incrementMessageCount(conversationId);

    return result.data;
  }

  async getConversationMessages(
    conversationId: string,
    options: any = { limit: 50 }
  ): Promise<any> {
    return this.query<ChatMessage>(
      'messages',
      [
        where('conversationId', '==', conversationId),
        where('isDeleted', '==', false),
      ],
      {
        ...options,
        orderBy: 'createdAt',
        orderDirection: 'asc',
      }
    );
  }

  async updateMessage(
    messageId: string,
    updates: Partial<ChatMessage>
  ): Promise<ChatMessage> {
    return this.update<ChatMessage>('messages', messageId, {
      ...updates,
      isEdited: true,
    });
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
}

export const messageDatabaseService = new MessageDatabaseService();
