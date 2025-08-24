import React from "react";
import { FiX } from "react-icons/fi";
import Logo from "@/assets/owl_AI_logo.png";

interface SidebarHeaderProps {
  onClose: () => void;
  darkMode: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose, darkMode }) => {
  return (
    <div className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
          <img src={Logo} alt="Owl AI" className="w-6 h-6" />
        </div>
        <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Owl AI
        </span>
      </div>
      <button
        onClick={onClose}
        className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? "hover:bg-gray-700 text-white" : "text-gray-600"}`}
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
};
