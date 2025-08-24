import React from "react";
import { FiUser } from "react-icons/fi";

interface User {
  uid: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  plan?: string;
  avatar?: string;
}

interface SidebarUserProfileProps {
  user: User | null;
  onUserProfileClick: () => void;
  darkMode: boolean;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  onUserProfileClick,
  darkMode,
}) => {
  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email;
    }
    return "User";
  };

  return (
    <div
      className={`p-4 border-t ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <button
        onClick={onUserProfileClick}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-opacity-80 transition-colors ${
          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
        }`}
      >
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getUserInitials(user!)}</span>
          )}
        </div>
        <div className="flex-1 text-left">
          <div
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {getUserDisplayName(user!)}
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {user?.plan || "Free"} Plan
          </div>
        </div>
        <FiUser
          className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </button>
    </div>
  );
};
