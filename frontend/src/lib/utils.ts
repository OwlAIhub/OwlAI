import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logger utility for consistent logging across the app
export const logger = {
  info: (_message: string, _context?: string, _data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      // Info log: ${message}
    }
  },
  error: (_message: string, _context?: string, _data?: unknown) => {
    // Error log: ${message}
  },
  warn: (_message: string, _context?: string, _data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      // Warn log: ${message}
    }
  },
  debug: (_message: string, _context?: string, _data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      // Debug log: ${message}
    }
  },
};
