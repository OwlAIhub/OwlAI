/**
 * Essential UI Utilities
 * Simple utility functions for UI components
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple logger for development
 */
export const logger = {
  info: (message: string, context?: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[${context || "App"}] ${message}`, data || "");
    }
  },
  error: (message: string, context?: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[${context || "App"}] ${message}`, error || "");
    }
  },
  warn: (message: string, context?: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[${context || "App"}] ${message}`, data || "");
    }
  },
};

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
