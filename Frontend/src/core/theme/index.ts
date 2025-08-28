// Theme System Index
// Centralized exports for all theme components and utilities

import React, { createContext, useContext, useState, useEffect } from "react";

// Import color scheme first
import { colors, theme } from "./color-scheme";

// Color Scheme
export { colors, theme, getColor, getThemeColor } from "./color-scheme";

// Card Designs
export {
  BaseCard,
  MessageCard,
  FeatureCard,
  StatsCard,
  ActionCard,
  LoadingCard,
} from "./card-designs";

// Consistent Styling
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
} from "./consistent-styling";

// Theme Utilities
export const themeUtils = {
  // Get CSS custom properties for theme colors
  getCSSVariables: (mode: "light" | "dark" = "light") => {
    const vars: Record<string, string> = {};

    // Primary colors
    Object.entries(colors.primary).forEach(([key, value]) => {
      vars[`--color-primary-${key}`] = value as string;
    });

    // Mode-specific colors
    const modeColors = colors[mode];
    Object.entries(modeColors.bg).forEach(([key, value]) => {
      vars[`--color-bg-${key}`] = value as string;
    });
    Object.entries(modeColors.text).forEach(([key, value]) => {
      vars[`--color-text-${key}`] = value as string;
    });
    Object.entries(modeColors.border).forEach(([key, value]) => {
      vars[`--color-border-${key}`] = value as string;
    });

    return vars;
  },

  // Apply theme to document
  applyTheme: (mode: "light" | "dark" = "light") => {
    const vars = themeUtils.getCSSVariables(mode);
    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Update document class for dark mode
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  // Get responsive breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Get spacing scale
  spacing: theme.spacing,

  // Get border radius scale
  borderRadius: theme.borderRadius,

  // Get shadow scale
  shadows: theme.shadows,

  // Get transition durations
  transitions: theme.transitions,
};

// Theme Provider Component
interface ThemeContextType {
  mode: "light" | "dark";
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedMode =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setMode(savedMode);
    themeUtils.applyTheme(savedMode);
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    themeUtils.applyTheme(newMode);
  };

  const setThemeMode = (newMode: "light" | "dark") => {
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    themeUtils.applyTheme(newMode);
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: { mode, toggleMode, setMode: setThemeMode } },
    children
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Export theme types
export type ThemeMode = "light" | "dark";
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type CardVariant = "default" | "elevated" | "outlined" | "ghost";
