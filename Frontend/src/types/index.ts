/**
 * Global Type Definitions for OwlAI
 */

// User Types
export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  plan?: "free" | "premium";
  joinDate?: string;
}

// Chat Types
export interface ChatMessage {
  role: "user" | "bot";
  content: string;
  isMarkdown?: boolean;
  feedback?: "like" | "dislike" | null;
  timestamp?: string;
  chatId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string;
  numChats: number;
  startTime: string;
  starred: boolean;
}

// UI State Types
export interface UIState {
  isSidebarOpen: boolean;
  darkMode: boolean;
  isLoggedIn: boolean;
  showProfileModal: boolean;
  loading: boolean;
}

// API Types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
  error?: string;
}

export interface ChatApiResponse {
  response: string;
  chat_id: string;
}

export interface SessionCreateResponse {
  session_id: string;
  user_id: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ThemeProps {
  darkMode: boolean;
}

export interface SidebarProps extends ThemeProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string | null) => void;
  currentUser: Partial<User>;
  activeChatId?: string | null;
  chats: ChatSession[];
  setChats: (
    chats: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])
  ) => void;
  onUserProfileClick: () => void;
  setSesssionId: (id: string) => void;
}

export interface HeaderProps extends ThemeProps {
  currentChatTitle: string;
  onToggleSidebar: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
}

export interface MainContentProps extends ThemeProps {
  currentChatTitle: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  sessionId: string | null;
  onUserProfileClick: () => void;
  setSesssionId: (id: string) => void;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface FeedbackData {
  chat_id: string;
  user_id: string;
  usefulness_score: number;
  content_quality_score: number;
  msg: string;
  flagged_reason?: string | null;
}

// Config Types
export interface AppConfig {
  apiUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

// Utility Types
export type LoadingState = "idle" | "loading" | "success" | "error";

export type Theme = "light" | "dark";

export type ChatRole = "user" | "bot";

export type FeedbackType = "like" | "dislike";

export type PlanType = "free" | "premium";
