import React from "react";

interface FooterProps {
  className?: string;
  darkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className = "",
  darkMode = false,
}) => {
  return (
    <footer
      className={`py-4 px-6 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${className}`}
    >
      <p
        className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        © 2024 OwlAI. All rights reserved.
      </p>
    </footer>
  );
};
