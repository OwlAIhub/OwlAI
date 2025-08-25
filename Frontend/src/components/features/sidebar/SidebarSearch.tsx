import React from "react";
import { FiSearch } from "react-icons/fi";

interface SidebarSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  searchQuery,
  setSearchQuery,
  darkMode,
}) => {
  return (
    <div className="p-4">
      <div className="relative">
        <FiSearch
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>
    </div>
  );
};
