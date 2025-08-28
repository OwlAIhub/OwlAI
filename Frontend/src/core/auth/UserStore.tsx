import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { User } from "@/types";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

/**
 * User state interface
 * Contains only the properties that are actually used in the application
 */
interface UserState {
  user: User | null;
  error: string | null;
  sessionId: string | null;
  darkMode: boolean;
  currentChatTitle: string;
}

/**
 * Action types for user state management
 * Only includes actions that are actually dispatched
 */
type UserAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SESSION_ID"; payload: string | null }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_CURRENT_CHAT_TITLE"; payload: string }
  | { type: "CLEAR_USER_DATA" };

/**
 * Initial state for user store
 * Loads persisted data from storage where available
 */
const initialState: UserState = {
  user: storage.get<User>(STORAGE_KEYS.USER),
  error: null,
  sessionId: storage.get<string>(STORAGE_KEYS.SESSION_ID),
  darkMode: storage.get<boolean>(STORAGE_KEYS.DARK_MODE) ?? true,
  currentChatTitle: "Learning Theories",
};

/**
 * User state reducer
 * Handles state updates based on dispatched actions
 */
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };

    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };

    case "SET_CURRENT_CHAT_TITLE":
      return { ...state, currentChatTitle: action.payload };

    case "CLEAR_USER_DATA":
      return {
        ...state,
        user: null,
        sessionId: null,
        error: null,
      };

    default:
      return state;
  }
};

/**
 * User context interface
 * Defines the shape of the context value with only used methods
 */
interface UserContextType {
  state: UserState;

  // User actions
  setUser: (user: User | null) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Session management
  setSessionId: (sessionId: string | null) => void;

  // UI preferences
  toggleDarkMode: () => void;
  setCurrentChatTitle: (title: string) => void;

  // Utility actions
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User provider component
 * Provides user state and actions to the component tree
 */
interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  /**
   * Set user data and persist to storage
   */
  const setUser = useCallback((user: User | null) => {
    dispatch({ type: "SET_USER", payload: user });

    // Persist user data
    if (user) {
      storage.set(STORAGE_KEYS.USER, user);
    } else {
      storage.remove(STORAGE_KEYS.USER);
    }
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  /**
   * Set session ID and persist to storage
   */
  const setSessionId = useCallback((sessionId: string | null) => {
    dispatch({ type: "SET_SESSION_ID", payload: sessionId });

    // Persist session ID
    if (sessionId) {
      storage.set(STORAGE_KEYS.SESSION_ID, sessionId);
    } else {
      storage.remove(STORAGE_KEYS.SESSION_ID);
    }
  }, []);

  /**
   * Toggle dark mode and apply to DOM
   */
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !state.darkMode;
    dispatch({ type: "SET_DARK_MODE", payload: newDarkMode });

    // Apply to DOM
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Persist preference
    storage.set(STORAGE_KEYS.DARK_MODE, newDarkMode);
  }, [state.darkMode]);

  /**
   * Set current chat title
   */
  const setCurrentChatTitle = useCallback((title: string) => {
    dispatch({ type: "SET_CURRENT_CHAT_TITLE", payload: title });
  }, []);

  /**
   * Clear user data and remove from storage
   */
  const clearUserData = useCallback(() => {
    dispatch({ type: "CLEAR_USER_DATA" });

    // Clear persistent storage
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.SESSION_ID);
  }, []);

  const contextValue: UserContextType = {
    state,
    setUser,
    setError,
    clearError,
    setSessionId,
    toggleDarkMode,
    setCurrentChatTitle,
    clearUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

/**
 * Custom hook to use user context
 * Provides type-safe access to user state and actions
 */
export const useUserStore = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserStore must be used within a UserProvider");
  }
  return context;
};
