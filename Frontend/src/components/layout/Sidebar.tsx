import React from "react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = "",
  darkMode = false,
}) => {
  return (
    <aside
      className={`w-64 border-r ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${className}`}
    >
      {children}
    </aside>
  );
};
