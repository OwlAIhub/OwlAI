import React from "react";
import { motion } from "framer-motion";
import { colors, theme } from "./color-scheme";

// Landing Page Style Constants (matching your existing design)
export const landingPageStyles = {
  // Section styling (py-20 bg-white)
  section: "py-20 bg-white dark:bg-gray-900",

  // Container styling (container mx-auto px-6)
  container: "container mx-auto px-6",

  // Header styling (text-center mb-16)
  header: "text-center mb-16",

  // Heading styling (text-3xl/4xl font-bold text-gray-900 mb-4)
  heading: {
    h1: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4",
    h2: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4",
    h3: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4",
    h4: "text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3",
  },

  // Description styling (text-base text-gray-600 max-w-2xl mx-auto)
  description:
    "text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed",

  // Gradient underline emphasis
  gradientUnderline:
    "bg-gradient-to-r from-[#52B788] to-[#40916C] bg-clip-text text-transparent",

  // Button styling (your green theme)
  button: {
    primary:
      "bg-[#52B788] hover:bg-[#40916C] text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200",
    secondary:
      "bg-white hover:bg-gray-50 text-[#52B788] border border-[#52B788] font-medium px-6 py-3 rounded-lg transition-colors duration-200",
    outline:
      "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium px-6 py-3 rounded-lg transition-colors duration-200",
  },

  // Card styling (clean, thin, sleek)
  card: {
    base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    elevated:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200",
    minimal:
      "bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl shadow-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200",
  },

  // Input styling
  input: {
    base: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
    error:
      "w-full px-4 py-3 border border-red-300 dark:border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
  },

  // Badge styling
  badge: {
    primary:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#52B788] text-white",
    secondary:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    warning:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    error:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
  },
};

// Consistent Section Component
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  background?: "white" | "gray" | "primary";
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  darkMode = false,
  background = "white",
}) => {
  const getBackgroundStyles = () => {
    switch (background) {
      case "white":
        return "bg-white dark:bg-gray-900";
      case "gray":
        return "bg-gray-50 dark:bg-gray-800";
      case "primary":
        return "bg-gradient-to-br from-[#52B788]/5 to-[#40916C]/5 dark:from-[#52B788]/10 dark:to-[#40916C]/10";
      default:
        return "bg-white dark:bg-gray-900";
    }
  };

  return (
    <section className={`py-20 ${getBackgroundStyles()} ${className}`}>
      <div className="container mx-auto px-6">{children}</div>
    </section>
  );
};

// Consistent Header Component
interface HeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
  darkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  description,
  centered = true,
  className = "",
  darkMode = false,
}) => {
  return (
    <div className={`${centered ? "text-center" : ""} mb-16 ${className}`}>
      {subtitle && (
        <p className="text-sm font-medium text-[#52B788] mb-2 uppercase tracking-wide">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

// Consistent Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#52B788] hover:bg-[#40916C] text-white border-[#52B788]";
      case "secondary":
        return "bg-white hover:bg-gray-50 text-[#52B788] border border-[#52B788]";
      case "outline":
        return "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
      case "ghost":
        return "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent";
      default:
        return "bg-[#52B788] hover:bg-[#40916C] text-white border-[#52B788]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

// Consistent Input Component
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  error?: string;
  disabled?: boolean;
  className?: string;
  darkMode?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
  className = "",
  darkMode = false,
}) => {
  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${error ? landingPageStyles.input.error : landingPageStyles.input.base} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Consistent Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return landingPageStyles.badge.primary;
      case "secondary":
        return landingPageStyles.badge.secondary;
      case "success":
        return landingPageStyles.badge.success;
      case "warning":
        return landingPageStyles.badge.warning;
      case "error":
        return landingPageStyles.badge.error;
      default:
        return landingPageStyles.badge.primary;
    }
  };

  return (
    <span className={`${getVariantStyles()} ${className}`}>{children}</span>
  );
};

// Consistent Grid Component
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = "lg",
  className = "",
}) => {
  const getColsStyles = () => {
    switch (cols) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
      case 6:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getGapStyles = () => {
    switch (gap) {
      case "sm":
        return "gap-4";
      case "md":
        return "gap-6";
      case "lg":
        return "gap-8";
      case "xl":
        return "gap-12";
      default:
        return "gap-8";
    }
  };

  return (
    <div className={`grid ${getColsStyles()} ${getGapStyles()} ${className}`}>
      {children}
    </div>
  );
};

// Consistent Divider Component
interface DividerProps {
  className?: string;
  darkMode?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  darkMode = false,
}) => {
  return (
    <hr
      className={`border-t border-gray-200 dark:border-gray-700 my-8 ${className}`}
    />
  );
};

// Consistent Spacer Component
interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = "md",
  className = "",
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return "h-2";
      case "sm":
        return "h-4";
      case "md":
        return "h-8";
      case "lg":
        return "h-12";
      case "xl":
        return "h-16";
      case "2xl":
        return "h-24";
      default:
        return "h-8";
    }
  };

  return <div className={`${getSizeStyles()} ${className}`} />;
};

// Export all components
export {
  Section,
  Header,
  Button,
  Input,
  Badge,
  Grid,
  Divider,
  Spacer,
  landingPageStyles,
};
