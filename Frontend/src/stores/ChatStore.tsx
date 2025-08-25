import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { ChatMessage, ChatSession, LoadingState } from "@/types";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

// State interface
interface ChatState {
  // Messages
  messages: ChatMessage[];
  displayedText: string;
  isTyping: boolean;

  // Sessions
  sessions: ChatSession[];
  currentSession: ChatSession | null;

  // UI State
  loading: LoadingState;
  error: string | null;

  // Feedback
  selectedFeedbackIndex: number | null;
  customRemark: string;
}

// Action types
type ChatAction =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | {
      type: "UPDATE_MESSAGE";
      payload: { index: number; message: Partial<ChatMessage> };
    }
  | { type: "SET_DISPLAYED_TEXT"; payload: string }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_SESSIONS"; payload: ChatSession[] }
  | { type: "SET_CURRENT_SESSION"; payload: ChatSession | null }
  | {
      type: "UPDATE_SESSION";
      payload: { id: string; updates: Partial<ChatSession> };
    }
  | { type: "SET_LOADING"; payload: LoadingState }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FEEDBACK_INDEX"; payload: number | null }
  | { type: "SET_CUSTOM_REMARK"; payload: string }
  | { type: "CLEAR_CHAT" }
  | { type: "RESET_STORE" };

// Initial state
const initialState: ChatState = {
  messages: [],
  displayedText: "",
  isTyping: false,
  sessions: [],
  currentSession: null,
  loading: "idle",
  error: null,
  selectedFeedbackIndex: null,
  customRemark: "",
};

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === action.payload.index
            ? { ...msg, ...action.payload.message }
            : msg
        ),
      };

    case "SET_DISPLAYED_TEXT":
      return { ...state, displayedText: action.payload };

    case "SET_TYPING":
      return { ...state, isTyping: action.payload };

    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };

    case "SET_CURRENT_SESSION":
      return { ...state, currentSession: action.payload };

    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session
        ),
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_FEEDBACK_INDEX":
      return { ...state, selectedFeedbackIndex: action.payload };

    case "SET_CUSTOM_REMARK":
      return { ...state, customRemark: action.payload };

    case "CLEAR_CHAT":
      return {
        ...state,
        messages: [],
        displayedText: "",
        isTyping: false,
        currentSession: null,
        error: null,
      };

    case "RESET_STORE":
      return initialState;

    default:
      return state;
  }
};

// Context
interface ChatContextType {
  state: ChatState;

  // Message actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (index: number, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;

  // Typing actions
  setDisplayedText: (text: string) => void;
  setTyping: (isTyping: boolean) => void;

  // Session actions
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;

  // State actions
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;

  // Feedback actions
  setFeedbackIndex: (index: number | null) => void;
  setCustomRemark: (remark: string) => void;

  // Utility actions
  clearChat: () => void;
  resetStore: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Message actions
  const setMessages = useCallback((messages: ChatMessage[]) => {
    dispatch({ type: "SET_MESSAGES", payload: messages });
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: "ADD_MESSAGE", payload: message });
  }, []);

  const updateMessage = useCallback(
    (index: number, updates: Partial<ChatMessage>) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { index, message: updates },
      });
    },
    []
  );

  const clearMessages = useCallback(() => {
    dispatch({ type: "SET_MESSAGES", payload: [] });
  }, []);

  // Typing actions
  const setDisplayedText = useCallback((text: string) => {
    dispatch({ type: "SET_DISPLAYED_TEXT", payload: text });
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    dispatch({ type: "SET_TYPING", payload: isTyping });
  }, []);

  // Session actions
  const setSessions = useCallback((sessions: ChatSession[]) => {
    dispatch({ type: "SET_SESSIONS", payload: sessions });
  }, []);

  const setCurrentSession = useCallback((session: ChatSession | null) => {
    dispatch({ type: "SET_CURRENT_SESSION", payload: session });

    // Persist current session
    if (session) {
      storage.set(STORAGE_KEYS.SELECTED_CHAT, session);
    } else {
      storage.remove(STORAGE_KEYS.SELECTED_CHAT);
    }
  }, []);

  const updateSession = useCallback(
    (id: string, updates: Partial<ChatSession>) => {
      dispatch({ type: "UPDATE_SESSION", payload: { id, updates } });
    },
    []
  );

  // State actions
  const setLoading = useCallback((loading: LoadingState) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  // Feedback actions
  const setFeedbackIndex = useCallback((index: number | null) => {
    dispatch({ type: "SET_FEEDBACK_INDEX", payload: index });
  }, []);

  const setCustomRemark = useCallback((remark: string) => {
    dispatch({ type: "SET_CUSTOM_REMARK", payload: remark });
  }, []);

  // Utility actions
  const clearChat = useCallback(() => {
    dispatch({ type: "CLEAR_CHAT" });
  }, []);

  const resetStore = useCallback(() => {
    dispatch({ type: "RESET_STORE" });
  }, []);

  const contextValue: ChatContextType = {
    state,
    setMessages,
    addMessage,
    updateMessage,
    clearMessages,
    setDisplayedText,
    setTyping,
    setSessions,
    setCurrentSession,
    updateSession,
    setLoading,
    setError,
    setFeedbackIndex,
    setCustomRemark,
    clearChat,
    resetStore,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChatStore = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatStore must be used within a ChatProvider");
  }
  return context;
};
