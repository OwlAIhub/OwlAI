/**
 * Application Configuration
 * Centralized config management with environment-based settings
 */

interface AppConfig {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    maxMessageLength: number;
    rateLimitRequests: number;
  };
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  environment:
    (import.meta.env.MODE as "development" | "staging" | "production") ||
    "production",
  features: {
    enableAnalytics: import.meta.env.MODE === "production",
    enableDebugMode: import.meta.env.MODE === "development",
    maxMessageLength: 4000,
    rateLimitRequests: 100,
  },
};

export default config;
export type { AppConfig };
