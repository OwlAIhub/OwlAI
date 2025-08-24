import React from 'react';
import { FiUser, FiChevronRight } from "react-icons/fi";
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileSectionProps {
  user: User | null;
  currentUser: Partial<User>;
  onProfileClick: () => void;
  darkMode: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  currentUser,
  onProfileClick,
  darkMode,
}) => {
  const theme = {
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    userPlan: darkMode ? 'text-teal-400' : 'text-teal-600',
    icon: darkMode ? 'text-gray-400' : 'text-gray-500',
    primary: darkMode ? 'bg-teal-700' : 'bg-teal-600',
  };

  const getUserDisplayName = () => {
    return user?.firstName || "Guest User";
  };

  const getUserPlan = () => {
    if (!user) return "Login Required";
    return currentUser?.plan ? `${currentUser.plan} Plan` : "Free Plan";
  };

  const getUserInitial = () => {
    return user?.firstName?.[0]?.toUpperCase() || "G";
  };

  return (
    <div className={`p-4 border-t ${theme.border}`}>
      <div className="w-full">
        <Button
          onClick={onProfileClick}
          variant="ghost"
          className="w-full flex items-center justify-between hover:opacity-80 transition-opacity focus:outline-none p-0 h-auto"
          aria-label="Open user profile"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="w-9 h-9">
              {user && currentUser?.avatar ? (
                <AvatarImage 
                  src={currentUser.avatar} 
                  alt="User Avatar"
                />
              ) : (
                <AvatarFallback className={`${theme.primary} text-white`}>
                  {getUserInitial()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="text-left min-w-0">
              <div className={`text-sm font-medium truncate max-w-[120px] ${theme.text}`}>
                {getUserDisplayName()}
              </div>
              <div className={`text-xs truncate max-w-[120px] ${theme.userPlan}`}>
                {getUserPlan()}
              </div>
            </div>
          </div>
          
          <FiChevronRight className={theme.icon} />
        </Button>
      </div>
    </div>
  );
};
