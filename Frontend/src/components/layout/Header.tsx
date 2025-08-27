import React from "react";

interface HeaderProps {
  title?: string;
  className?: string;
  darkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = "OwlAI",
  className = "",
  darkMode = false,
}) => {
  return (
    <header
      className={`py-4 px-6 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${className}`}
    >
      <h1
        className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h1>
    </header>
  );
};
