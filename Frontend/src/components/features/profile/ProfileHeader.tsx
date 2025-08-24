import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiCamera, FiX, FiCheck } from "react-icons/fi";

interface ProfileHeaderProps {
  userData: {
    name: string;
    email: string;
    subscription: string;
  };
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  darkMode: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  darkMode,
}) => {
  const [editedName, setEditedName] = useState(userData.name);

  const colors = {
    bg: darkMode ? "bg-gray-900" : "bg-white",
    text: darkMode ? "text-white" : "text-gray-900",
    accent: "text-[#009688]",
    subtle: darkMode ? "text-gray-400" : "text-gray-600",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    cardBg: darkMode ? "bg-gray-800" : "bg-gray-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${colors.bg} ${colors.border} border-b pb-6`}
    >
      {/* Edit Button */}
      <div className="absolute top-4 right-4">
        {!isEditing ? (
          <button
            onClick={onEditToggle}
            className={`p-2 rounded-full ${colors.cardBg} hover:bg-opacity-80 transition-colors`}
          >
            <FiEdit className={`w-4 h-4 ${colors.accent}`} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className={`p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors`}
            >
              <FiCheck className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onCancel}
              className={`p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors`}
            >
              <FiX className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#009688] to-[#00796B] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#009688] hover:bg-[#00796B] transition-colors">
              <FiCamera className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Name */}
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className={`text-2xl font-bold ${colors.text} bg-transparent border-b-2 border-[#009688] focus:outline-none text-center`}
              placeholder="Enter your name"
            />
          ) : (
            <h1 className={`text-2xl font-bold ${colors.text}`}>
              {userData.name}
            </h1>
          )}
          <p className={`text-sm ${colors.subtle} mt-1`}>
            {userData.subscription} Member
          </p>
        </div>
      </div>
    </motion.div>
  );
};
