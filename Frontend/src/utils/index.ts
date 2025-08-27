// Utility functions

export * from "./format";
export * from "./validation";
export * from "./storage";
export * from "./date";

// Re-export device utils as domUtils
export { deviceUtils as domUtils } from "../shared/utils/device";

// Date utilities
export const dateUtils = {
  formatDate: (date: Date): string => {
    return date.toLocaleDateString();
  },
  formatTime: (date: Date): string => {
    return date.toLocaleTimeString();
  },
  formatDateTime: (date: Date): string => {
    return date.toLocaleString();
  },
  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },
  isYesterday: (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  },
  getGreeting: (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  },
};
