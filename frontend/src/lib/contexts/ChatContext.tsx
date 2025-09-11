"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { ChatMessage, ChatSession, ChatHistory } from "../types/chat";
import { chatService } from "../services/chatService";
import { flowiseApi } from "../services/flowiseApi";
import { useAuth } from "./AuthContext";

interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  isLoadingSessions: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  totalMessages: number;
}

type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOADING_MESSAGES"; payload: boolean }
  | { type: "SET_LOADING_SESSIONS"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_SESSION"; payload: ChatSession | null }
  | { type: "SET_SESSIONS"; payload: ChatSession[] }
  | { type: "ADD_SESSION"; payload: ChatSession }
  | {
      type: "UPDATE_SESSION";
      payload: { sessionId: string; updates: Partial<ChatSession> };
    }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "SET_MESSAGES"; payload: ChatHistory }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | {
      type: "UPDATE_MESSAGE";
      payload: { messageId: string; updates: Partial<ChatMessage> };
    }
  | { type: "CLEAR_CHAT" };

const initialState: ChatState = {
  currentSession: null,
  sessions: [],
  messages: [],
  isLoading: false,
  isLoadingMessages: false,
  isLoadingSessions: false,
  error: null,
  hasMoreMessages: false,
  totalMessages: 0,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_LOADING_MESSAGES":
      return { ...state, isLoadingMessages: action.payload };
    case "SET_LOADING_SESSIONS":
      return { ...state, isLoadingSessions: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CURRENT_SESSION":
      return { ...state, currentSession: action.payload };
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "ADD_SESSION":
      return { ...state, sessions: [action.payload, ...state.sessions] };
    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.sessionId
            ? { ...session, ...action.payload.updates }
            : session,
        ),
        currentSession:
          state.currentSession?.id === action.payload.sessionId
            ? { ...state.currentSession, ...action.payload.updates }
            : state.currentSession,
      };
    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.id !== action.payload,
        ),
        currentSession:
          state.currentSession?.id === action.payload
            ? null
            : state.currentSession,
        messages:
          state.currentSession?.id === action.payload ? [] : state.messages,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload.messages,
        hasMoreMessages: action.payload.hasMore,
        totalMessages: action.payload.totalMessages,
      };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload.messageId
            ? { ...message, ...action.payload.updates }
            : message,
        ),
      };
    case "CLEAR_CHAT":
      return {
        ...state,
        currentSession: null,
        messages: [],
        hasMoreMessages: false,
        totalMessages: 0,
      };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;

  // Session Management
  createNewSession: () => Promise<ChatSession>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  loadUserSessions: () => Promise<void>;

  // Message Management
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  regenerateLastMessage: () => Promise<void>;

  // Utility
  clearError: () => void;
  clearCurrentChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const clearCurrentChat = useCallback(() => {
    dispatch({ type: "CLEAR_CHAT" });
  }, []);

  const loadUserSessions = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: "SET_LOADING_SESSIONS", payload: true });
      const sessions = await chatService.getUserSessions(user.uid);
      dispatch({ type: "SET_SESSIONS", payload: sessions });
    } catch (error) {
      console.error("Error loading sessions:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load chat history" });
    } finally {
      dispatch({ type: "SET_LOADING_SESSIONS", payload: false });
    }
  }, [user]);

  // Load user sessions on mount - FIXED: function defined before use
  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user, loadUserSessions]); // ✅ Fixed: Added loadUserSessions to dependencies

  const createNewSession = useCallback(async (): Promise<ChatSession> => {
    if (!user) throw new Error("User not authenticated");

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const session = await chatService.createSession(user.uid);
      dispatch({ type: "ADD_SESSION", payload: session });
      dispatch({ type: "SET_CURRENT_SESSION", payload: session });
      dispatch({ type: "CLEAR_CHAT" });
      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create new chat" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [user]);

  const loadSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        dispatch({ type: "SET_LOADING_MESSAGES", payload: true });

        // Find session in current sessions
        let session = state.sessions.find((s) => s.id === sessionId);

        if (!session) {
          // If session not found locally, try to get fresh sessions from database
          console.log("Session not found locally, fetching fresh sessions...");
          const freshSessions = await chatService.getUserSessions(user.uid);
          dispatch({ type: "SET_SESSIONS", payload: freshSessions });
          session = freshSessions.find((s) => s.id === sessionId);

          if (!session) {
            console.error("Session not found even after refresh:", sessionId);
            dispatch({ type: "SET_ERROR", payload: "Chat session not found" });
            return;
          }
        }

        dispatch({ type: "SET_CURRENT_SESSION", payload: session });

        const chatHistory = await chatService.getSessionMessages(
          user.uid,
          sessionId,
        );
        dispatch({ type: "SET_MESSAGES", payload: chatHistory });
      } catch (error) {
        console.error("Error loading session:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load chat session" });
      } finally {
        dispatch({ type: "SET_LOADING_MESSAGES", payload: false });
      }
    },
    [state.sessions, user],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await chatService.deleteSession(user.uid, sessionId);
        dispatch({ type: "DELETE_SESSION", payload: sessionId });
      } catch (error) {
        console.error("Error deleting session:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to delete chat" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [user],
  );

  const updateSessionTitle = useCallback(
    async (sessionId: string, title: string) => {
      if (!user) return;

      try {
        await chatService.updateSession(user.uid, sessionId, { title });
        dispatch({
          type: "UPDATE_SESSION",
          payload: { sessionId, updates: { title } },
        });
      } catch (error) {
        console.error("Error updating session title:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to update chat title" });
      }
    },
    [user],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.currentSession || !user) return;

      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
        status: "sending",
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Update user message status immediately
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            messageId: userMessage.id,
            updates: { status: "sent" },
          },
        });

        // Start AI response and database save in parallel
        const [aiResponse] = await Promise.all([
          flowiseApi.query(content),
          // Save user message in background (don't wait)
          chatService
            .addMessage(user.uid, state.currentSession.id, {
              content: userMessage.content,
              sender: "user",
              timestamp: userMessage.timestamp,
              status: "sent",
            })
            .catch(console.error),
        ]);

        const aiMessage: ChatMessage = {
          id: `temp-ai-${Date.now()}`,
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
          status: "sent",
        };

        dispatch({ type: "ADD_MESSAGE", payload: aiMessage });

        // Save AI message in background and update session title if needed
        Promise.all([
          chatService.addMessage(user.uid, state.currentSession.id, {
            content: aiMessage.content,
            sender: "ai",
            timestamp: aiMessage.timestamp,
            status: "sent",
          }),
          // Update session title if this is the first message
          state.messages.length === 0 && state.currentSession
            ? chatService
                .generateSessionTitle([userMessage])
                .then((title) =>
                  updateSessionTitle(state.currentSession!.id, title),
                )
            : Promise.resolve(),
        ]).catch(console.error);
      } catch (error) {
        console.error("Error sending message:", error);
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            messageId: userMessage.id,
            updates: { status: "error" },
          },
        });
        dispatch({ type: "SET_ERROR", payload: "Failed to send message" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.currentSession, state.messages.length, user, updateSessionTitle],
  );

  const loadMoreMessages = useCallback(async () => {
    if (
      !state.currentSession ||
      !state.hasMoreMessages ||
      state.isLoadingMessages ||
      !user
    )
      return;

    try {
      dispatch({ type: "SET_LOADING_MESSAGES", payload: true });
      const lastMessageId = state.messages[0]?.id;
      const chatHistory = await chatService.getSessionMessages(
        user.uid,
        state.currentSession.id,
        20,
        lastMessageId,
      );

      dispatch({
        type: "SET_MESSAGES",
        payload: {
          ...chatHistory,
          messages: [...chatHistory.messages, ...state.messages],
        },
      });
    } catch (error) {
      console.error("Error loading more messages:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load more messages" });
    } finally {
      dispatch({ type: "SET_LOADING_MESSAGES", payload: false });
    }
  }, [
    state.currentSession,
    state.hasMoreMessages,
    state.isLoadingMessages,
    state.messages,
    user,
  ]);

  const regenerateLastMessage = useCallback(async () => {
    if (!state.currentSession || state.messages.length < 2 || !user) return;

    const lastAiMessage = state.messages[state.messages.length - 1];
    const lastUserMessage = state.messages[state.messages.length - 2];

    if (lastAiMessage.sender !== "ai" || lastUserMessage.sender !== "user")
      return;

    try {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          messageId: lastAiMessage.id,
          updates: { status: "sending" },
        },
      });

      const newResponse = await flowiseApi.query(lastUserMessage.content);

      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          messageId: lastAiMessage.id,
          updates: { content: newResponse, status: "sent" },
        },
      });

      // Update in database
      await chatService.updateMessage(
        user.uid,
        state.currentSession.id,
        lastAiMessage.id,
        { content: newResponse },
      );
    } catch (error) {
      console.error("Error regenerating message:", error);
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          messageId: lastAiMessage.id,
          updates: { status: "error" },
        },
      });
      dispatch({ type: "SET_ERROR", payload: "Failed to regenerate message" });
    }
  }, [state.currentSession, state.messages, user]);

  const value: ChatContextType = {
    state,
    createNewSession,
    loadSession,
    deleteSession,
    updateSessionTitle,
    loadUserSessions,
    sendMessage,
    loadMoreMessages,
    regenerateLastMessage,
    clearError,
    clearCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
