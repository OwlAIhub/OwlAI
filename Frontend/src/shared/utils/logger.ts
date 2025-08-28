/**
 * Logger Utility
 * Centralized logging with proper error handling and best practices
 */

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Log entry interface
interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxEntries: number;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  level: import.meta.env.DEV ? LogLevel.WARN : LogLevel.INFO, // Reduced logging in dev
  enableConsole: true,
  enableRemote: false,
  maxEntries: 1000,
};

class Logger {
  private config: LoggerConfig;
  private entries: LogEntry[] = [];
  private isInitialized = false;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Initialize logger
   */
  private initialize(): void {
    if (this.isInitialized) return;

    // Set up global error handler
    if (typeof window !== "undefined") {
      window.addEventListener("error", event => {
        this.error("Unhandled error", "Global", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      });

      window.addEventListener("unhandledrejection", event => {
        this.error("Unhandled promise rejection", "Global", {
          reason: event.reason,
        });
      });
    }

    this.isInitialized = true;
    this.info("Logger initialized", "Logger");
  }

  /**
   * Create log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };

    // Add user context if available
    try {
      const user = localStorage.getItem("owl_ai_user");
      if (user) {
        const userData = JSON.parse(user);
        entry.userId = userData.uid;
      }
    } catch {
      // Ignore localStorage errors
    }

    // Add session context if available
    try {
      const sessionId = localStorage.getItem("owl_ai_session_id");
      if (sessionId) {
        entry.sessionId = sessionId;
      }
    } catch {
      // Ignore localStorage errors
    }

    return entry;
  }

  /**
   * Add entry to log
   */
  private addEntry(entry: LogEntry): void {
    this.entries.push(entry);

    // Maintain max entries limit
    if (this.entries.length > this.config.maxEntries) {
      this.entries = this.entries.slice(-this.config.maxEntries);
    }

    // Console logging
    if (this.config.enableConsole && entry.level <= this.config.level) {
      this.logToConsole(entry);
    }

    // Remote logging
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(entry).catch(() => {
        // Silently fail remote logging
      });
    }
  }

  /**
   * Log to console with proper formatting
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.context || "App"}]`;

    const logData = {
      message: entry.message,
      data: entry.data,
      userId: entry.userId,
      sessionId: entry.sessionId,
    };

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(prefix, logData);
        break;
      case LogLevel.WARN:
        console.warn(prefix, logData);
        break;
      case LogLevel.INFO:
        console.info(prefix, logData);
        break;
      case LogLevel.DEBUG:
        console.debug(prefix, logData);
        break;
    }
  }

  /**
   * Log to remote endpoint
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail remote logging
    }
  }

  /**
   * Error logging
   */
  error(message: string, context?: string, data?: any): void {
    const entry = this.createEntry(LogLevel.ERROR, message, context, data);
    this.addEntry(entry);
  }

  /**
   * Warning logging
   */
  warn(message: string, context?: string, data?: any): void {
    const entry = this.createEntry(LogLevel.WARN, message, context, data);
    this.addEntry(entry);
  }

  /**
   * Info logging
   */
  info(message: string, context?: string, data?: any): void {
    const entry = this.createEntry(LogLevel.INFO, message, context, data);
    this.addEntry(entry);
  }

  /**
   * Debug logging
   */
  debug(message: string, context?: string, data?: any): void {
    const entry = this.createEntry(LogLevel.DEBUG, message, context, data);
    this.addEntry(entry);
  }

  /**
   * Get log entries
   */
  getEntries(level?: LogLevel, limit?: number): LogEntry[] {
    let entries = this.entries;

    if (level !== undefined) {
      entries = entries.filter(entry => entry.level <= level);
    }

    if (limit) {
      entries = entries.slice(-limit);
    }

    return entries;
  }

  /**
   * Clear log entries
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * Export logs
   */
  export(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create singleton instance
export const logger = new Logger();

// Export logger class for testing
export { Logger };
export type { LogEntry, LoggerConfig };
