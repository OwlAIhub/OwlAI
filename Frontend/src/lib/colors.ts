/**
 * OwlAI Color System
 *
 * This file provides easy access to our brand colors using CSS variables.
 * These colors are defined in index.css and work with both light and dark modes.
 */

export const owlColors = {
  // Primary brand color (Teal)
  primary: "hsl(var(--owl-primary))", // #009688
  primaryDark: "hsl(var(--owl-primary-dark))", // #00796B
  primaryLight: "hsl(var(--owl-primary-light))", // #4DB6AC

  // Accent color (Amber/Yellow)
  accent: "hsl(var(--owl-accent))", // #FFC107
  accentDark: "hsl(var(--owl-accent-dark))", // #FFA000

  // Dark theme backgrounds
  baseDark: "hsl(var(--owl-base-dark))", // #0D1B2A
  cardDark: "hsl(var(--owl-card-dark))", // #1B263B
  cardBorder: "hsl(var(--owl-card-border))", // #415A77

  // Additional consistent colors
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Message colors
  userMessage: "hsl(var(--owl-primary))", // #009688
  assistantMessage: "hsl(var(--owl-card-dark))", // #1B263B
  assistantMessageLight: "#37474F",
} as const;

/**
 * Helper function to get OwlAI color classes for Tailwind
 */
export const owlClasses = {
  // Background classes
  bg: {
    primary: "bg-owl-primary",
    primaryDark: "bg-owl-primary-dark",
    primaryLight: "bg-owl-primary-light",
    accent: "bg-owl-accent",
    accentDark: "bg-owl-accent-dark",
    baseDark: "bg-owl-base-dark",
    cardDark: "bg-owl-card-dark",
    userMessage: "bg-owl-primary",
    assistantMessage: "bg-owl-card-dark",
  },

  // Text classes
  text: {
    primary: "text-owl-primary",
    primaryDark: "text-owl-primary-dark",
    primaryLight: "text-owl-primary-light",
    accent: "text-owl-accent",
    accentDark: "text-owl-accent-dark",
  },

  // Border classes
  border: {
    primary: "border-owl-primary",
    primaryDark: "border-owl-primary-dark",
    cardBorder: "border-owl-card-border",
  },

  // Hover classes
  hover: {
    bgPrimary: "hover:bg-owl-primary",
    bgPrimaryDark: "hover:bg-owl-primary-dark",
    bgAccent: "hover:bg-owl-accent",
    bgAccentDark: "hover:bg-owl-accent-dark",
    textPrimary: "hover:text-owl-primary",
    textPrimaryDark: "hover:text-owl-primary-dark",
  },

  // Focus classes
  focus: {
    ringPrimary: "focus:ring-owl-primary",
    borderPrimary: "focus:border-owl-primary",
  },
} as const;

/**
 * Get consistent color object for components
 */
export const getColors = (darkMode: boolean) => ({
  // Backgrounds
  bg: {
    primary: darkMode ? "bg-owl-primary" : "bg-owl-primary",
    primaryDark: darkMode ? "bg-owl-primary-dark" : "bg-owl-primary-dark",
    card: darkMode ? "bg-owl-card-dark" : "bg-gray-50",
    base: darkMode ? "bg-owl-base-dark" : "bg-white",
    userMessage: "bg-owl-primary",
    assistantMessage: darkMode ? "bg-owl-card-dark" : "bg-gray-100",
  },

  // Text
  text: {
    primary: "text-owl-primary",
    primaryDark: "text-owl-primary-dark",
    accent: "text-owl-accent",
    main: darkMode ? "text-white" : "text-gray-900",
    secondary: darkMode ? "text-gray-400" : "text-gray-600",
    muted: darkMode ? "text-gray-500" : "text-gray-500",
  },

  // Borders
  border: {
    primary: "border-owl-primary",
    primaryDark: "border-owl-primary-dark",
    card: darkMode ? "border-owl-card-border" : "border-gray-200",
    input: darkMode ? "border-gray-700" : "border-gray-300",
  },

  // Interactive states
  hover: {
    bgPrimary: "hover:bg-owl-primary-dark",
    textPrimary: "hover:text-owl-primary-dark",
  },

  focus: {
    ring: "focus:ring-owl-primary",
    border: "focus:border-owl-primary",
  },
});
