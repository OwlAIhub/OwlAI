// Common types used across the application

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  conversationId: string;
  feedback?: "like" | "dislike";
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface MainContentProps {
  currentChatTitle?: string;
  darkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  sessionId: string;
  setSesssionId: (id: string) => void;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
