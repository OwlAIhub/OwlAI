// API services

export * from "./client";
export * from "./auth";
export * from "./chat";
export * from "./user";

// API object with all services
import { authApi } from "./auth";
import { chatApi } from "./chat";
import { userApi } from "./user";
import { mockApiService } from "../../core/api/mock-api";

export const api = {
  auth: authApi,
  chat: chatApi,
  user: userApi,
  session: {
    createUserSession: async (userId: string) => {
      try {
        // Try to use mock API first
        return await mockApiService.createSession(userId);
      } catch (error) {
        // Fallback to simple mock
        return { success: true, data: { session_id: `session_${Date.now()}` } };
      }
    },
    initAnonymousSession: async () => {
      try {
        return await mockApiService.initAnonymousSession();
      } catch (error) {
        return {
          success: true,
          data: {
            session_id: `anon_session_${Date.now()}`,
            user_id: `anon_user_${Date.now()}`,
          },
        };
      }
    },
  },
  feedback: {
    submitFeedback: async (_data: any) => {
      // Mock implementation
      return { success: true, data: { id: `feedback_${Date.now()}` } };
    },
  },
};
