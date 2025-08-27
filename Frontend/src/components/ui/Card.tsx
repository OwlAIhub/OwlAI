import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  darkMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  darkMode = false,
}) => {
  const baseClasses = "rounded-lg border transition-shadow";

  const variantClasses = {
    default: darkMode
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-900",
    elevated: darkMode
      ? "bg-gray-800 border-gray-700 text-white shadow-lg"
      : "bg-white border-gray-200 text-gray-900 shadow-lg",
    outlined: darkMode
      ? "bg-transparent border-gray-600 text-white"
      : "bg-transparent border-gray-300 text-gray-900",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
};
