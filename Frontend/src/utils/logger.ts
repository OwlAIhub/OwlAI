/**
 * Production-Ready Logging Utility
 * Provides structured logging with environment-based controls
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === "development";
  private isProduction = import.meta.env.MODE === "production";
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : "";

    return `${timestamp} ${levelName}${context}: ${entry.message}`;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.ERROR:
        if (this.isProduction) {
          // In production, only log errors to avoid console pollution
          console.error(formattedMessage);
        } else {
          console.error(formattedMessage, data || "");
        }
        break;
      case LogLevel.WARN:
        if (this.isDevelopment) {
          console.warn(formattedMessage, data || "");
        }
        break;
      case LogLevel.INFO:
        if (this.isDevelopment) {
          console.info(formattedMessage, data || "");
        }
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage, data || "");
        }
        break;
    }
  }

  error(message: string, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }
}

export const logger = new Logger();
export default logger;
