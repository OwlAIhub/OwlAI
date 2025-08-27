/**
 * Utility Functions
 */

import { STORAGE_KEYS, BREAKPOINTS } from "@/constants";

/**
 * Local Storage Utilities
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Failed to save to localStorage
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Failed to remove from localStorage
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Failed to clear localStorage
    }
  },
};

/**
 * Date/Time Utilities
 */
export const dateUtils = {
  /**
   * Format relative time (e.g., "2h ago", "3d ago")
   */
  formatRelativeTime: (dateString: string): string => {
    if (!dateString) return "";

    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  },

  /**
   * Get greeting based on time of day
   */
  getGreeting: (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  },
};

/**
 * Device/Screen Utilities
 */
export const deviceUtils = {
  /**
   * Check if device is mobile
   */
  isMobile: (): boolean => {
    return window.innerWidth < BREAKPOINTS.MOBILE;
  },

  /**
   * Check if device is tablet
   */
  isTablet: (): boolean => {
    const width = window.innerWidth;
    return width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.DESKTOP;
  },

  /**
   * Check if device is desktop
   */
  isDesktop: (): boolean => {
    return window.innerWidth >= BREAKPOINTS.DESKTOP;
  },

  /**
   * Check if device is in mid-range (750-1000px)
   */
  isMidRange: (): boolean => {
    const width = window.innerWidth;
    return width >= 750 && width <= 1000;
  },
};

/**
 * String Utilities
 */
export const stringUtils = {
  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Generate random ID
   */
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9);
  },
};

/**
 * Async Utilities
 */
export const asyncUtils = {
  /**
   * Create a delay/sleep function
   */
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Debounce function calls
   */
  debounce: <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },
};

/**
 * DOM Utilities
 */
export const domUtils = {
  /**
   * Copy text to clipboard
   */
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  },

  /**
   * Scroll element into view smoothly
   */
  scrollToElement: (element: HTMLElement | null): void => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  },

  /**
   * Scroll to bottom of container
   */
  scrollToBottom: (container: HTMLElement | null): void => {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },
};

/**
 * Validation Utilities
 */
export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if string is empty or only whitespace
   */
  isEmpty: (str: string): boolean => {
    return !str || str.trim().length === 0;
  },
};

/**
 * Format Utilities
 */
export const formatUtils = {
  /**
   * Format markdown response
   */
  formatMarkdown: (response: string): string => {
    if (typeof response !== "string") return "";

    return response
      .replace(/undefined/g, "")
      .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
      .trim();
  },

  /**
   * Format user display name
   */
  formatUserName: (firstName?: string, lastName?: string): string => {
    if (!firstName) return "Guest User";
    return lastName ? `${firstName} ${lastName}` : firstName;
  },
};

// Export new utilities
export * from "./persistence";
export { deviceUtils as deviceUtilsAdvanced } from "./device";

/**
 * Re-export all utilities
 */
export const utils = {
  storage,
  date: dateUtils,
  device: deviceUtils,
  string: stringUtils,
  async: asyncUtils,
  dom: domUtils,
  validation: validationUtils,
  format: formatUtils,
};
