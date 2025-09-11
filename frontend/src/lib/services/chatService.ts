import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  limit, 
  startAfter,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ChatMessage, ChatSession, ChatHistory } from "../types/chat";

export class ChatService {
  private static instance: ChatService;
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Session Management
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    try {
      const sessionId = `session_${Date.now()}`;
      const sessionData = {
        id: sessionId,
        userId,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
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
          isStarred: false,
          tags: []
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, "users", userId, "chatSessions", sessionId);
      await updateDoc(docRef, sessionData).catch(async () => {
        // If document doesn't exist, create it
        await setDoc(docRef, sessionData);
      });
      
      return {
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: {
          content: "",
          timestamp: new Date()
        }
      } as ChatSession;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw new Error("Failed to create chat session");
    }
  }

  async getUserSessions(userId: string, limitCount: number = 20): Promise<ChatSession[]> {
    try {
      const q = query(
        collection(db, "users", userId, "chatSessions"),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
          lastMessage: data.lastMessage ? {
            content: data.lastMessage.content || "",
            timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate() || new Date()
          } : undefined
        };
      }) as ChatSession[];
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw new Error("Failed to fetch chat sessions");
    }
  }

  async updateSession(userId: string, sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    try {
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating session:", error);
      throw new Error("Failed to update session");
    }
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete session
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.delete(sessionRef);

      // Delete all messages in this session
      const messagesQuery = query(
        collection(db, "users", userId, "chatSessions", sessionId, "messages")
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  }

  // Message Management
  async addMessage(userId: string, sessionId: string, message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    try {
      const batch = writeBatch(db);

      // Add message
      const messageId = `msg_${Date.now()}`;
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

      // Update session
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      const messageCount = await this.getMessageCount(userId, sessionId);
      batch.update(sessionRef, {
        updatedAt: serverTimestamp(),
        messageCount: messageCount + 1,
        lastMessage: {
          content: message.content.slice(0, 100) + (message.content.length > 100 ? "..." : ""),
          timestamp: serverTimestamp()
        }
      });

      await batch.commit();

      return {
        id: messageId,
        ...message,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error adding message:", error);
      throw new Error("Failed to add message");
    }
  }

  async getSessionMessages(
    userId: string,
    sessionId: string, 
    limitCount: number = 50,
    lastMessageId?: string
  ): Promise<ChatHistory> {
    try {
      let q = query(
        collection(db, "users", userId, "chatSessions", sessionId, "messages"),
        orderBy("createdAt", "desc"),
        limit(limitCount + 1) // Get one extra to check if there are more
      );

      if (lastMessageId) {
        const lastDoc = await getDoc(doc(db, "users", userId, "chatSessions", sessionId, "messages", lastMessageId));
        if (lastDoc.exists()) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      
      const hasMore = docs.length > limitCount;
      const messages = docs
        .slice(0, limitCount)
        .reverse() // Reverse to get chronological order
        .map(doc => ({
          id: doc.id,
          content: doc.data().content,
          sender: doc.data().sender,
          timestamp: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
          status: doc.data().status
        })) as ChatMessage[];

      return {
        sessionId,
        messages,
        totalMessages: await this.getMessageCount(userId, sessionId),
        hasMore
      };
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw new Error("Failed to fetch messages");
    }
  }

  async updateMessage(userId: string, sessionId: string, messageId: string, updates: Partial<ChatMessage>): Promise<void> {
    try {
      const messageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", messageId);
      await updateDoc(messageRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating message:", error);
      throw new Error("Failed to update message");
    }
  }

  private async getMessageCount(userId: string, sessionId: string): Promise<number> {
    try {
      const messagesQuery = query(
        collection(db, "users", userId, "chatSessions", sessionId, "messages")
      );
      const snapshot = await getDocs(messagesQuery);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting message count:", error);
      return 0;
    }
  }

  // Utility methods
  async generateSessionTitle(messages: ChatMessage[]): Promise<string> {
    if (messages.length === 0) return `Chat ${new Date().toLocaleDateString()}`;
    
    const firstUserMessage = messages.find(m => m.sender === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50);
      return title + (firstUserMessage.content.length > 50 ? "..." : "");
    }
    
    return `Chat ${new Date().toLocaleDateString()}`;
  }

  async searchSessions(userId: string, searchTerm: string, limitCount: number = 10): Promise<ChatSession[]> {
    try {
      // Note: This is a basic search. For production, consider using Algolia or similar
      const sessions = await this.getUserSessions(userId, 100);
      return sessions.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, limitCount);
    } catch (error) {
      console.error("Error searching sessions:", error);
      throw new Error("Failed to search sessions");
    }
  }
}

export const chatService = ChatService.getInstance();