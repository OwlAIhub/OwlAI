/**
 * Color utilities for the application
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export const getColors = (darkMode: boolean = false): ColorScheme => {
  if (darkMode) {
    return {
      primary: "#009688",
      secondary: "#00796B",
      accent: "#4DB6AC",
      background: "#0D1B2A",
      surface: "#1B263B",
      text: "#E0E1DD",
      textSecondary: "#B0BEC5",
      border: "#415A77",
      error: "#EF4444",
      success: "#10B981",
      warning: "#F59E0B",
    };
  }

  return {
    primary: "#009688",
    secondary: "#00796B",
    accent: "#4DB6AC",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  };
};
