import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IconType } from "react-icons";

interface ProfileSectionProps {
  title: string;
  icon: IconType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  darkMode: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  darkMode,
}) => {
  const colors = {
    cardBg: darkMode ? "bg-gray-800" : "bg-gray-50",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    shadow: darkMode ? "shadow-lg" : "shadow-md",
    primary: darkMode
      ? "bg-[#009688] bg-opacity-20"
      : "bg-[#009688] bg-opacity-10",
    accentText: darkMode ? "text-white" : "text-gray-900",
    iconColor: darkMode ? "text-gray-400" : "text-gray-600",
    subtleText: darkMode ? "text-gray-400" : "text-gray-600",
    statText: darkMode ? "text-gray-200" : "text-gray-800",
  };

  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${colors.cardBg} ${colors.border} border ${colors.shadow}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`p-4 flex justify-between items-center cursor-pointer ${
          isExpanded ? colors.primary : ""
        }`}
        onClick={onToggle}
      >
        <h3
          className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}
        >
          <Icon className={colors.iconColor} />
          {title}
        </h3>
        {isExpanded ? (
          <FiChevronUp className={colors.iconColor} />
        ) : (
          <FiChevronDown className={colors.iconColor} />
        )}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
