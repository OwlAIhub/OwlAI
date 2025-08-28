import React from "react";

/**
 * Chat header component
 * Contains the header with sidebar toggle, title, and user actions
 */
interface ChatHeaderProps {
  currentChatTitle: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  onLogout: () => void;
  darkMode: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentChatTitle,
  isSidebarOpen,
  toggleSidebar,
  toggleDarkMode,
  onLogout,
  darkMode,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentChatTitle || "New Chat"}
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
