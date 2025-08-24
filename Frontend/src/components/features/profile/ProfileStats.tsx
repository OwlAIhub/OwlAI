import React from "react";
import { motion } from "framer-motion";
import { RiMedalLine, RiBookLine, RiCalendarLine } from "react-icons/ri";

interface ProfileStatsProps {
  stats: {
    totalSessions: number;
    totalQuestions: number;
    joinDate: string;
  };
  darkMode: boolean;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  darkMode,
}) => {
  const colors = {
    cardBg: darkMode ? "bg-gray-800" : "bg-gray-50",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    shadow: darkMode ? "shadow-lg" : "shadow-md",
    text: darkMode ? "text-white" : "text-gray-900",
    subtleText: darkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#009688]",
  };

  const statItems = [
    {
      icon: RiMedalLine,
      label: "Total Sessions",
      value: stats.totalSessions,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: RiBookLine,
      label: "Questions Asked",
      value: stats.totalQuestions,
      color: "from-green-500 to-green-600",
    },
    {
      icon: RiCalendarLine,
      label: "Member Since",
      value: stats.joinDate,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${colors.cardBg} ${colors.border} border rounded-lg p-4 ${colors.shadow}`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-sm ${colors.subtleText}`}>{item.label}</p>
              <p className={`text-lg font-semibold ${colors.text}`}>
                {item.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
