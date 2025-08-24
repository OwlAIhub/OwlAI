import React from 'react';
import { FiX } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import Logo from '@/assets/owl_AI_logo.png';

interface SidebarHeaderProps {
  onLogoClick: () => void;
  onClose: () => void;
  darkMode: boolean;
  showCloseButton?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onLogoClick,
  onClose,
  darkMode,
  showCloseButton = true,
}) => {
  const theme = {
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    hoverBg: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    primary: 'bg-owl-primary',
  };

  return (
    <div className={`p-4 flex items-center justify-between border-b ${theme.border} h-17`}>
      <Button
        onClick={onLogoClick}
        variant="ghost"
        className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity p-0 h-auto"
        aria-label="Go to home page"
      >
        <div className={`${theme.primary} rounded-full w-10 overflow-hidden`}>
          <img src={Logo} alt="OwlAI Logo" className="w-full h-full object-cover" />
        </div>
        <span className={`font-bold text-lg ${theme.text}`}>Owl AI</span>
      </Button>
      
      {showCloseButton && (
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className={`p-1 rounded-full ${theme.hoverBg} transition-colors lg:hidden`}
          aria-label="Close sidebar"
        >
          <FiX className={`text-xl ${theme.text}`} />
        </Button>
      )}
    </div>
  );
};
