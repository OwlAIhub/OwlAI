import React from 'react';
import { FiSearch, FiX } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  darkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  darkMode,
}) => {
  const theme = {
    inputBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-400' : 'text-gray-600',
    icon: darkMode ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <div className="p-3">
      <div className={`flex items-center ${theme.inputBg} focus-within:ring-2 focus-within:ring-owl-primary rounded-lg px-3 py-2 transition-colors`}>
        <FiSearch className={theme.icon} />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`ml-2 bg-transparent border-none outline-none w-full text-sm ${theme.text} placeholder:${theme.secondaryText} focus:ring-0 h-auto p-0`}
          placeholder="Search chats..."
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className={`${theme.icon} p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700`}
            aria-label="Clear search"
          >
            <FiX size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
