// API services

export * from "./client";
export * from "./auth";
export * from "./chat";
export * from "./user";

// API object with all services
import { authApi } from "./auth";
import { chatApi } from "./chat";
import { userApi } from "./user";

export const api = {
  auth: authApi,
  chat: chatApi,
  user: userApi,
  session: {
    createUserSession: async (_userId: string) => {
      return { success: true, data: { session_id: `session_${Date.now()}` } };
    },
    initAnonymousSession: async () => {
      return {
        success: true,
        data: {
          session_id: `anon_session_${Date.now()}`,
          user_id: `anon_user_${Date.now()}`,
        },
      };
    },
  },
  feedback: {
    submitFeedback: async (_data: any) => {
      // Mock implementation
      return { success: true, data: { id: `feedback_${Date.now()}` } };
    },
  },
};
