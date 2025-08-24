import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { User, LoadingState } from "@/types";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

// State interface
interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  authReady: boolean;
  loading: LoadingState;
  error: string | null;
  sessionId: string | null;

  // Anonymous session data
  anonymousUserId: string | null;
  anonymousSessionId: string | null;

  // UI preferences
  darkMode: boolean;
  currentChatTitle: string;
}

// Action types
type UserAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOGGED_IN"; payload: boolean }
  | { type: "SET_AUTH_READY"; payload: boolean }
  | { type: "SET_LOADING"; payload: LoadingState }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SESSION_ID"; payload: string | null }
  | { type: "SET_ANONYMOUS_USER_ID"; payload: string | null }
  | { type: "SET_ANONYMOUS_SESSION_ID"; payload: string | null }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_CURRENT_CHAT_TITLE"; payload: string }
  | { type: "CLEAR_USER_DATA" }
  | { type: "RESET_STORE" };

// Initial state
const initialState: UserState = {
  user: storage.get<User>(STORAGE_KEYS.USER),
  isLoggedIn: false,
  authReady: false,
  loading: "idle",
  error: null,
  sessionId: storage.get<string>(STORAGE_KEYS.SESSION_ID),
  anonymousUserId: storage.get<string>(STORAGE_KEYS.ANONYMOUS_USER_ID),
  anonymousSessionId: storage.get<string>(STORAGE_KEYS.ANONYMOUS_SESSION_ID),
  darkMode: storage.get<boolean>(STORAGE_KEYS.DARK_MODE) ?? true,
  currentChatTitle: "Learning Theories",
};

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload };

    case "SET_AUTH_READY":
      return { ...state, authReady: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };

    case "SET_ANONYMOUS_USER_ID":
      return { ...state, anonymousUserId: action.payload };

    case "SET_ANONYMOUS_SESSION_ID":
      return { ...state, anonymousSessionId: action.payload };

    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };

    case "SET_CURRENT_CHAT_TITLE":
      return { ...state, currentChatTitle: action.payload };

    case "CLEAR_USER_DATA":
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        sessionId: null,
        error: null,
      };

    case "RESET_STORE":
      return {
        ...initialState,
        authReady: true, // Keep auth ready state
      };

    default:
      return state;
  }
};

// Context
interface UserContextType {
  state: UserState;

  // User actions
  setUser: (user: User | null) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setAuthReady: (authReady: boolean) => void;

  // State actions
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Session actions
  setSessionId: (sessionId: string | null) => void;
  setAnonymousUserId: (userId: string | null) => void;
  setAnonymousSessionId: (sessionId: string | null) => void;

  // UI actions
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setCurrentChatTitle: (title: string) => void;

  // Utility actions
  clearUserData: () => void;
  resetStore: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // User actions
  const setUser = useCallback((user: User | null) => {
    dispatch({ type: "SET_USER", payload: user });

    // Persist user data
    if (user) {
      storage.set(STORAGE_KEYS.USER, user);
    } else {
      storage.remove(STORAGE_KEYS.USER);
    }
  }, []);

  const setLoggedIn = useCallback((isLoggedIn: boolean) => {
    dispatch({ type: "SET_LOGGED_IN", payload: isLoggedIn });
  }, []);

  const setAuthReady = useCallback((authReady: boolean) => {
    dispatch({ type: "SET_AUTH_READY", payload: authReady });
  }, []);

  // State actions
  const setLoading = useCallback((loading: LoadingState) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // Session actions
  const setSessionId = useCallback((sessionId: string | null) => {
    dispatch({ type: "SET_SESSION_ID", payload: sessionId });

    // Persist session ID
    if (sessionId) {
      storage.set(STORAGE_KEYS.SESSION_ID, sessionId);
    } else {
      storage.remove(STORAGE_KEYS.SESSION_ID);
    }
  }, []);

  const setAnonymousUserId = useCallback((userId: string | null) => {
    dispatch({ type: "SET_ANONYMOUS_USER_ID", payload: userId });

    if (userId) {
      storage.set(STORAGE_KEYS.ANONYMOUS_USER_ID, userId);
    } else {
      storage.remove(STORAGE_KEYS.ANONYMOUS_USER_ID);
    }
  }, []);

  const setAnonymousSessionId = useCallback((sessionId: string | null) => {
    dispatch({ type: "SET_ANONYMOUS_SESSION_ID", payload: sessionId });

    if (sessionId) {
      storage.set(STORAGE_KEYS.ANONYMOUS_SESSION_ID, sessionId);
    } else {
      storage.remove(STORAGE_KEYS.ANONYMOUS_SESSION_ID);
    }
  }, []);

  // UI actions
  const setDarkMode = useCallback((darkMode: boolean) => {
    dispatch({ type: "SET_DARK_MODE", payload: darkMode });

    // Apply to DOM
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Persist preference
    storage.set(STORAGE_KEYS.DARK_MODE, darkMode);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!state.darkMode);
  }, [state.darkMode, setDarkMode]);

  const setCurrentChatTitle = useCallback((title: string) => {
    dispatch({ type: "SET_CURRENT_CHAT_TITLE", payload: title });
  }, []);

  // Utility actions
  const clearUserData = useCallback(() => {
    dispatch({ type: "CLEAR_USER_DATA" });

    // Clear persistent storage
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.SESSION_ID);
  }, []);

  const resetStore = useCallback(() => {
    dispatch({ type: "RESET_STORE" });
  }, []);

  const contextValue: UserContextType = {
    state,
    setUser,
    setLoggedIn,
    setAuthReady,
    setLoading,
    setError,
    clearError,
    setSessionId,
    setAnonymousUserId,
    setAnonymousSessionId,
    setDarkMode,
    toggleDarkMode,
    setCurrentChatTitle,
    clearUserData,
    resetStore,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUserStore = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserStore must be used within a UserProvider");
  }
  return context;
};
