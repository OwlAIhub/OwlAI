/**
 * Mock API Service
 * Handles API requests when backend server is not available
 */

import { logger } from "../../shared/utils/logger";

interface MockApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

class MockApiService {
  private static instance: MockApiService;

  private constructor() {}

  public static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // Mock session creation
  async createSession(
    userId: string
  ): Promise<MockApiResponse<{ session_id: string }>> {
    logger.info("Mock API: Creating session", "MockApiService", { userId });

    return {
      success: true,
      data: {
        session_id: `mock_session_${Date.now()}_${userId}`,
      },
      message: "Session created successfully",
    };
  }

  // Mock anonymous session initialization
  async initAnonymousSession(): Promise<
    MockApiResponse<{ session_id: string; user_id: string }>
  > {
    logger.info("Mock API: Initializing anonymous session", "MockApiService");

    return {
      success: true,
      data: {
        session_id: `anon_session_${Date.now()}`,
        user_id: `anon_user_${Date.now()}`,
      },
      message: "Anonymous session initialized",
    };
  }

  // Mock chat session management
  async getChatSessions(userId: string): Promise<MockApiResponse<any[]>> {
    logger.info("Mock API: Getting chat sessions", "MockApiService", {
      userId,
    });

    return {
      success: true,
      data: [
        {
          session_id: "mock_session_1",
          title: "Learning Theories Discussion",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          message_count: 5,
        },
        {
          session_id: "mock_session_2",
          title: "Classroom Management Tips",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          message_count: 3,
        },
      ],
      message: "Chat sessions retrieved successfully",
    };
  }

  // Mock message sending
  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<MockApiResponse<any>> {
    logger.info("Mock API: Sending message", "MockApiService", {
      sessionId,
      message,
    });

    return {
      success: true,
      data: {
        id: `msg_${Date.now()}`,
        session_id: sessionId,
        content: message,
        role: "user",
        created_at: new Date().toISOString(),
      },
      message: "Message sent successfully",
    };
  }

  // Mock chat history
  async getChatHistory(sessionId: string): Promise<MockApiResponse<any[]>> {
    logger.info("Mock API: Getting chat history", "MockApiService", {
      sessionId,
    });

    return {
      success: true,
      data: [
        {
          id: "msg_1",
          session_id: sessionId,
          content: "Hello! How can I help you with your studies today?",
          role: "assistant",
          created_at: new Date().toISOString(),
        },
        {
          id: "msg_2",
          session_id: sessionId,
          content: "I need help understanding learning theories",
          role: "user",
          created_at: new Date().toISOString(),
        },
      ],
      message: "Chat history retrieved successfully",
    };
  }
}

export const mockApiService = MockApiService.getInstance();
