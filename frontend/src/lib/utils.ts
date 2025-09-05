import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logger utility for consistent logging across the app
export const logger = {
  info: (message: string, context?: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ [${context || 'App'}] ${message}`, data || '');
    }
  },
  error: (message: string, context?: string, data?: unknown) => {
    console.error(`❌ [${context || 'App'}] ${message}`, data || '');
  },
  warn: (message: string, context?: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [${context || 'App'}] ${message}`, data || '');
    }
  },
  debug: (message: string, context?: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🔍 [${context || 'App'}] ${message}`, data || '');
    }
  },
};
