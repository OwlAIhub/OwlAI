// Firebase Firestore service for chat operations

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  ChatSession,
  Message,
  User,
  UserActivity,
  ClientChatSession,
  ClientMessage,
  ClientUser,
  CreateSessionRequest,
  SendMessageRequest,
  UpdateSessionRequest,
  PaginationOptions,
  PaginatedResponse,
  SessionListener,
  MessageListener,
  UserListener,
  ChatError,
} from "../types/chat";

// Utility function to convert Firestore Timestamp to Date
const convertTimestamp = (timestamp: Timestamp | null | undefined): Date => {
  if (!timestamp) {
    return new Date(); // Return current date as fallback
  }
  return timestamp.toDate();
};

// Convert Firestore ChatSession to Client ChatSession
const convertChatSession = (session: ChatSession): ClientChatSession => ({
  ...session,
  createdAt: convertTimestamp(session.createdAt),
  updatedAt: convertTimestamp(session.updatedAt),
  lastMessage: {
    ...session.lastMessage,
    timestamp: convertTimestamp(session.lastMessage?.timestamp),
  },
});

// Convert Firestore Message to Client Message
const convertMessage = (message: Message): ClientMessage => ({
  ...message,
  createdAt: convertTimestamp(message.createdAt),
  updatedAt: convertTimestamp(message.updatedAt),
});

// Convert Firestore User to Client User
const convertUser = (user: User): ClientUser => ({
  ...user,
  createdAt: convertTimestamp(user.createdAt),
  updatedAt: convertTimestamp(user.updatedAt),
  lastActiveAt: convertTimestamp(user.lastActiveAt),
  subscription: {
    ...user.subscription,
    expiresAt: user.subscription?.expiresAt
      ? convertTimestamp(user.subscription.expiresAt)
      : undefined,
  },
});

class ChatService {
  // User Management
  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const now = serverTimestamp();

      await updateDoc(userRef, {
        ...userData,
        id: userId,
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now,
      });
    } catch (error) {
      throw this.handleError(error, "Failed to create user");
    }
  }

  async getUser(userId: string): Promise<ClientUser | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return convertUser(userSnap.data() as User);
    } catch (error) {
      throw this.handleError(error, "Failed to get user");
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });
    } catch (error) {
      throw this.handleError(error, "Failed to update user");
    }
  }

  // Chat Session Management
  async createChatSession(
    userId: string,
    sessionData: CreateSessionRequest,
  ): Promise<string> {
    try {
      const sessionsRef = collection(db, "users", userId, "chatSessions");
      const now = serverTimestamp();

      const newSession: Omit<ChatSession, "id"> = {
        userId,
        title: sessionData.title || "New Chat",
        description: "",
        category: sessionData.category || "general",
        subject: sessionData.subject || "",
        isPinned: false,
        isArchived: false,
        messageCount: 0,
        lastMessage: {
          content: "",
          sender: "ai",
          timestamp: now as Timestamp,
        },
        metadata: {
          examContext: sessionData.examContext || "",
          studyTopic: sessionData.studyTopic || "",
        },
        createdAt: now as Timestamp,
        updatedAt: now as Timestamp,
      };

      const docRef = await addDoc(sessionsRef, newSession);

      // Update the document with its own ID
      await updateDoc(docRef, { id: docRef.id });

      // Log activity
      await this.logActivity(userId, "session_created", {
        sessionId: docRef.id,
      });

      return docRef.id;
    } catch (error) {
      throw this.handleError(error, "Failed to create chat session");
    }
  }

  async getChatSessions(
    userId: string,
    options: PaginationOptions = {},
  ): Promise<PaginatedResponse<ClientChatSession>> {
    try {
      const sessionsRef = collection(db, "users", userId, "chatSessions");

      let q = query(
        sessionsRef,
        where("isArchived", "==", false),
        orderBy("updatedAt", "desc"),
      );

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map((doc) =>
        convertChatSession(doc.data() as ChatSession),
      );

      return {
        data: sessions,
        hasMore: querySnapshot.docs.length === (options.limit || 50),
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      };
    } catch (error) {
      throw this.handleError(error, "Failed to get chat sessions");
    }
  }

  async updateChatSession(
    userId: string,
    sessionId: string,
    updates: UpdateSessionRequest,
  ): Promise<void> {
    try {
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw this.handleError(error, "Failed to update chat session");
    }
  }

  async deleteChatSession(userId: string, sessionId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete the session
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.delete(sessionRef);

      // Delete all messages in the session
      const messagesRef = collection(
        db,
        "users",
        userId,
        "chatSessions",
        sessionId,
        "messages",
      );
      const messagesSnapshot = await getDocs(messagesRef);

      messagesSnapshot.docs.forEach((messageDoc) => {
        batch.delete(messageDoc.ref);
      });

      await batch.commit();
    } catch (error) {
      throw this.handleError(error, "Failed to delete chat session");
    }
  }

  // Message Management
  async sendMessage(
    userId: string,
    messageData: SendMessageRequest,
  ): Promise<string> {
    try {
      const messagesRef = collection(
        db,
        "users",
        userId,
        "chatSessions",
        messageData.sessionId,
        "messages",
      );

      const now = serverTimestamp();

      const newMessage: Omit<Message, "id"> = {
        sessionId: messageData.sessionId,
        userId,
        content: messageData.content,
        sender: "user",
        type: messageData.type || "text",
        status: "sent",
        createdAt: now as Timestamp,
        updatedAt: now as Timestamp,
      };

      const docRef = await addDoc(messagesRef, newMessage);

      // Update the message with its own ID
      await updateDoc(docRef, { id: docRef.id });

      // Update session's last message and message count
      const sessionRef = doc(
        db,
        "users",
        userId,
        "chatSessions",
        messageData.sessionId,
      );
      await updateDoc(sessionRef, {
        lastMessage: {
          content: messageData.content,
          sender: "user",
          timestamp: now,
        },
        messageCount: increment(1),
        updatedAt: now,
      });

      // Log activity
      await this.logActivity(userId, "message_sent", {
        sessionId: messageData.sessionId,
        messageId: docRef.id,
      });

      return docRef.id;
    } catch (error) {
      throw this.handleError(error, "Failed to send message");
    }
  }

  async addAIMessage(
    userId: string,
    sessionId: string,
    content: string,
    aiMetadata?: Message["aiMetadata"],
  ): Promise<string> {
    try {
      const messagesRef = collection(
        db,
        "users",
        userId,
        "chatSessions",
        sessionId,
        "messages",
      );

      const now = serverTimestamp();

      const aiMessage: Omit<Message, "id"> = {
        sessionId,
        userId,
        content,
        sender: "ai",
        type: "text",
        status: "delivered",
        aiMetadata,
        createdAt: now as Timestamp,
        updatedAt: now as Timestamp,
      };

      const docRef = await addDoc(messagesRef, aiMessage);

      // Update the message with its own ID
      await updateDoc(docRef, { id: docRef.id });

      // Update session's last message and message count
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      await updateDoc(sessionRef, {
        lastMessage: {
          content,
          sender: "ai",
          timestamp: now,
        },
        messageCount: increment(1),
        updatedAt: now,
      });

      // Log activity
      await this.logActivity(userId, "ai_response", {
        sessionId,
        messageId: docRef.id,
        processingTime: aiMetadata?.processingTime,
      });

      return docRef.id;
    } catch (error) {
      throw this.handleError(error, "Failed to add AI message");
    }
  }

  async getMessages(
    userId: string,
    sessionId: string,
    options: PaginationOptions = {},
  ): Promise<PaginatedResponse<ClientMessage>> {
    try {
      const messagesRef = collection(
        db,
        "users",
        userId,
        "chatSessions",
        sessionId,
        "messages",
      );

      let q = query(messagesRef, orderBy("createdAt", "asc"));

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map((doc) =>
        convertMessage(doc.data() as Message),
      );

      return {
        data: messages,
        hasMore: querySnapshot.docs.length === (options.limit || 50),
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      };
    } catch (error) {
      throw this.handleError(error, "Failed to get messages");
    }
  }

  async updateMessageStatus(
    userId: string,
    sessionId: string,
    messageId: string,
    status: Message["status"],
  ): Promise<void> {
    try {
      const messageRef = doc(
        db,
        "users",
        userId,
        "chatSessions",
        sessionId,
        "messages",
        messageId,
      );

      await updateDoc(messageRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw this.handleError(error, "Failed to update message status");
    }
  }

  // Mark messages as read when they come into view
  async markMessagesAsRead(
    userId: string,
    sessionId: string,
    messageIds: string[],
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      messageIds.forEach((messageId) => {
        const messageRef = doc(
          db,
          "users",
          userId,
          "chatSessions",
          sessionId,
          "messages",
          messageId,
        );

        batch.update(messageRef, {
          status: "read",
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      throw this.handleError(error, "Failed to mark messages as read");
    }
  }

  // Get unread message count for a session
  async getUnreadMessageCount(
    userId: string,
    sessionId: string,
  ): Promise<number> {
    try {
      const messagesRef = collection(
        db,
        "users",
        userId,
        "chatSessions",
        sessionId,
        "messages",
      );

      const q = query(
        messagesRef,
        where("sender", "==", "ai"),
        where("status", "in", ["sent", "delivered"]),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      throw this.handleError(error, "Failed to get unread message count");
    }
  }

  // Real-time Listeners
  subscribeToSessions(userId: string, callback: SessionListener): Unsubscribe {
    const sessionsRef = collection(db, "users", userId, "chatSessions");
    const q = query(
      sessionsRef,
      where("isArchived", "==", false),
      orderBy("updatedAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((doc) =>
        convertChatSession(doc.data() as ChatSession),
      );
      callback(sessions);
    });
  }

  subscribeToMessages(
    userId: string,
    sessionId: string,
    callback: MessageListener,
  ): Unsubscribe {
    const messagesRef = collection(
      db,
      "users",
      userId,
      "chatSessions",
      sessionId,
      "messages",
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) =>
        convertMessage(doc.data() as Message),
      );
      callback(messages);
    });
  }

  subscribeToUser(userId: string, callback: UserListener): Unsubscribe {
    const userRef = doc(db, "users", userId);

    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(convertUser(snapshot.data() as User));
      } else {
        callback(null);
      }
    });
  }

  // Activity Logging
  private async logActivity(
    userId: string,
    type: UserActivity["type"],
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    try {
      const activityRef = collection(db, "users", userId, "activity");

      const activity: Omit<UserActivity, "id"> = {
        userId,
        type,
        metadata,
        timestamp: serverTimestamp() as Timestamp,
      };

      await addDoc(activityRef, activity);
    } catch (error) {
      // Log activity errors silently to avoid disrupting main operations
      console.error("Failed to log activity:", error);
    }
  }

  // Error Handling
  private handleError(error: unknown, message: string): never {
    console.error(message, error);

    let chatError: ChatError;
    
    if (error instanceof Error) {
      chatError = {
        code: "FIRESTORE_ERROR",
        message: `${message}: ${error.message}`,
        details: { originalError: error.message },
      };
    } else {
      chatError = {
        code: "UNKNOWN_ERROR",
        message,
        details: { error },
      };
    }
    
    throw chatError;
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
