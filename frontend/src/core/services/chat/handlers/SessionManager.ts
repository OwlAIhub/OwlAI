/**
 * Session Management Module
 * Handles all chat session operations
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
  startAfter
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import { legendaryCache } from "@/lib/cache/LegendaryCacheManager";
import { legendaryErrorHandler } from "@/lib/monitoring/LegendaryErrorHandler";
import { ChatSession } from "../types";

export class SessionManager {
  private static instance: SessionManager;

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async createSession(userId: string, title?: string): Promise<ChatSession> {
    try {
      legendaryErrorHandler.captureError = legendaryErrorHandler.captureError.bind(legendaryErrorHandler);

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const now = new Date();
      const sessionData = {
        id: sessionId,
        userId,
        title: title || `Chat ${now.toLocaleDateString()}`,
        category: "study" as const,
        isPinned: false,
        isArchived: false,
        messageCount: 0,
        lastMessage: {
          content: "",
          timestamp: serverTimestamp()
        },
        metadata: {
          model: "OwlAI",
          version: "1.0.0",
          features: ["text", "analysis"]
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      const batch = writeBatch(db);
      batch.set(sessionRef, sessionData);
      await batch.commit();

      // Create a properly typed session for return
      const typedSession: ChatSession = {
        ...sessionData,
        createdAt: now,
        updatedAt: now,
        lastMessage: {
          content: "",
          timestamp: now
        }
      };

      const cacheKey = `session:${sessionId}`;
      legendaryCache.set(cacheKey, typedSession, {
        ttl: 5 * 60 * 1000,
        layers: ['memory', 'localStorage']
      });

      return typedSession;

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'SessionManager', action: 'createSession', userId },
        'high'
      );
      throw new Error("Failed to create session");
    }
  }

  async getSession(userId: string, sessionId: string): Promise<ChatSession | null> {

    try {
      const cacheKey = `session:${sessionId}`;
      let session = await legendaryCache.get<ChatSession>(cacheKey);

      if (!session) {
        const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          session = { id: sessionSnap.id, ...sessionSnap.data() } as ChatSession;
          legendaryCache.set(cacheKey, session, {
            ttl: 5 * 60 * 1000,
            layers: ['memory', 'localStorage']
          });
        }
      }

      return session || null;

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'SessionManager', action: 'getSession', userId, sessionId },
        'medium'
      );
      throw new Error("Failed to fetch session");
    }
  }

  async getUserSessions(
    userId: string, 
    limitCount: number = 20, 
    lastSessionId?: string
  ): Promise<ChatSession[]> {

    try {
      const cacheKey = `user_sessions:${userId}:${limitCount}:${lastSessionId || 'first'}`;
      let sessions = await legendaryCache.get<ChatSession[]>(cacheKey);

      if (!sessions) {
        let sessionsQuery = query(
          collection(db, "users", userId, "chatSessions"),
          orderBy("updatedAt", "desc"),
          limit(limitCount)
        );

        if (lastSessionId) {
          const lastSessionRef = doc(db, "users", userId, "chatSessions", lastSessionId);
          const lastSessionSnap = await getDoc(lastSessionRef);
          if (lastSessionSnap.exists()) {
            sessionsQuery = query(
              collection(db, "users", userId, "chatSessions"),
              orderBy("updatedAt", "desc"),
              startAfter(lastSessionSnap),
              limit(limitCount)
            );
          }
        }

        const querySnapshot = await getDocs(sessionsQuery);
        sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatSession[];

        legendaryCache.set(cacheKey, sessions, {
          ttl: 2 * 60 * 1000,
          layers: ['memory', 'localStorage']
        });
      }

      return sessions;

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'SessionManager', action: 'getUserSessions', userId },
        'medium'
      );
      throw new Error("Failed to fetch chat sessions");
    }
  }

  async updateSession(userId: string, sessionId: string, updates: Partial<ChatSession>): Promise<void> {

    try {
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      const batch = writeBatch(db);
      
      batch.update(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      await batch.commit();

      await this.updateSessionCaches(sessionId, updates);
      this.invalidateUserSessionsCache(userId);

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'SessionManager', action: 'updateSession', userId, sessionId },
        'medium'
      );
      throw new Error("Failed to update session");
    }
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {

    try {
      const batch = writeBatch(db);

      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.delete(sessionRef);

      const messagesQuery = query(
        collection(db, "users", userId, "chatSessions", sessionId, "messages")
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      await this.clearSessionCaches(sessionId);
      this.invalidateUserSessionsCache(userId);

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'SessionManager', action: 'deleteSession', userId, sessionId },
        'high'
      );
      throw new Error("Failed to delete session");
    }
  }

  private async updateSessionCaches(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    const cacheKey = `session:${sessionId}`;
    const existingSession = await legendaryCache.get<ChatSession>(cacheKey);
    
    if (existingSession) {
      const updatedSession = { ...existingSession, ...updates };
      legendaryCache.set(cacheKey, updatedSession, { ttl: 5 * 60 * 1000 });
    }
  }

  private async clearSessionCaches(sessionId: string): Promise<void> {
    const cacheKey = `session:${sessionId}`;
    legendaryCache.invalidate(cacheKey);
  }

  private invalidateUserSessionsCache(userId: string): void {
    legendaryCache.invalidate(new RegExp(`user_sessions:${userId}:.*`));
  }
}