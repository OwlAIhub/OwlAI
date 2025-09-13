/**
 * Message Management Module
 * Handles all chat message operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  startAfter,
  increment,
  Timestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import { legendaryCache } from "@/lib/cache/LegendaryCacheManager";
import { legendaryErrorHandler } from "@/lib/monitoring/LegendaryErrorHandler";
import { ChatMessage, ChatHistory } from "../types";

export class MessageManager {
  private static instance: MessageManager;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }
    return MessageManager.instance;
  }

  async addMessage(userId: string, sessionId: string, message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    try {
      const batch = writeBatch(db);
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      const messageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", messageId);
      const messageData = {
        id: messageId,
        sessionId,
        userId,
        content: message.content,
        sender: message.sender,
        type: "text" as const,
        status: message.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      batch.set(messageRef, messageData);

      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.update(sessionRef, {
        updatedAt: serverTimestamp(),
        messageCount: increment(1),
        lastMessage: {
          content: message.content.slice(0, 100) + (message.content.length > 100 ? "..." : ""),
          timestamp: serverTimestamp()
        }
      });

      await batch.commit();

      const newMessage: ChatMessage = {
        id: messageId,
        ...message,
        timestamp: new Date()
      };

      await this.cacheMessage(sessionId, newMessage);
      this.invalidateSessionMessagesCache(sessionId);

      return newMessage;

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'MessageManager', action: 'addMessage', userId, sessionId },
        'high'
      );
      throw new Error("Failed to add message");
    }
  }

  async getSessionMessages(
    userId: string,
    sessionId: string,
    limitCount: number = 50,
    lastMessageId?: string
  ): Promise<ChatHistory> {
    const cacheKey = `session_messages_${sessionId}_${limitCount}_${lastMessageId || 'initial'}`;

    try {
      const cached = await legendaryCache.get<ChatHistory>(cacheKey);
      if (cached && !lastMessageId) {
        return cached;
      }

      const [sessionDoc, messagesQuery] = await Promise.all([
        getDoc(doc(db, "users", userId, "chatSessions", sessionId)),
        this.buildMessagesQuery(userId, sessionId, limitCount, lastMessageId)
      ]);

      const querySnapshot = await getDocs(messagesQuery);
      const docs = querySnapshot.docs;

      const hasMore = docs.length > limitCount;
      const messages = docs
        .slice(0, limitCount)
        .reverse()
        .map(doc => ({
          id: doc.id,
          content: doc.data().content,
          sender: doc.data().sender,
          timestamp: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
          status: doc.data().status
        })) as ChatMessage[];

      const result: ChatHistory = {
        sessionId,
        messages,
        totalMessages: sessionDoc.exists() ? (sessionDoc.data()?.messageCount || 0) : 0,
        hasMore
      };

      if (!lastMessageId) {
        legendaryCache.set(cacheKey, result, {
          ttl: this.CACHE_TTL / 2,
          layers: ['memory']
        });
      }

      return result;

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'MessageManager', action: 'getSessionMessages', userId, sessionId },
        'medium'
      );
      throw new Error("Failed to fetch messages");
    }
  }

  async updateMessage(userId: string, sessionId: string, messageId: string, updates: Partial<ChatMessage>): Promise<void> {
    try {
      const messageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", messageId);
      const batch = writeBatch(db);
      
      batch.update(messageRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      await batch.commit();
      
      this.invalidateSessionMessagesCache(sessionId);

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'MessageManager', action: 'updateMessage', userId, sessionId, additionalData: { messageId } },
        'medium'
      );
      throw new Error("Failed to update message");
    }
  }

  async deleteMessage(userId: string, sessionId: string, messageId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      const messageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", messageId);
      batch.delete(messageRef);
      
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.update(sessionRef, {
        updatedAt: serverTimestamp(),
        messageCount: increment(-1)
      });
      
      await batch.commit();
      
      this.invalidateSessionMessagesCache(sessionId);

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'MessageManager', action: 'deleteMessage', userId, sessionId, additionalData: { messageId } },
        'medium'
      );
      throw new Error("Failed to delete message");
    }
  }

  async generateSessionTitle(messages: ChatMessage[]): Promise<string> {
    try {
      if (messages.length === 0) return `Chat ${new Date().toLocaleDateString()}`;

      const firstUserMessage = messages.find(m => m.sender === "user");
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 50);
        return title + (firstUserMessage.content.length > 50 ? "..." : "");
      }

      return `Chat ${new Date().toLocaleDateString()}`;
    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'MessageManager', action: 'generateSessionTitle' },
        'low'
      );
      return `Chat ${new Date().toLocaleDateString()}`;
    }
  }

  private async buildMessagesQuery(
    userId: string, 
    sessionId: string, 
    limitCount: number, 
    lastMessageId?: string
  ) {
    const messagesCollection = collection(db, "users", userId, "chatSessions", sessionId, "messages");
    let messagesQuery = query(
      messagesCollection,
      orderBy("createdAt", "desc"),
      limit(limitCount + 1)
    );

    if (lastMessageId) {
      const lastMessageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", lastMessageId);
      const lastMessageSnap = await getDoc(lastMessageRef);
      if (lastMessageSnap.exists()) {
        messagesQuery = query(
          messagesCollection,
          orderBy("createdAt", "desc"),
          startAfter(lastMessageSnap),
          limit(limitCount + 1)
        );
      }
    }

    return messagesQuery;
  }

  private async cacheMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const cacheKey = `message:${sessionId}:${message.id}`;
    legendaryCache.set(cacheKey, message, { ttl: this.CACHE_TTL });
  }

  private invalidateSessionMessagesCache(sessionId: string): void {
    legendaryCache.invalidate(new RegExp(`session_messages_${sessionId}_.*`));
  }
}