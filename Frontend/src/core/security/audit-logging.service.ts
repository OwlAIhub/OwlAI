/**
 * Audit Logging Service
 * Logs important security events and data access patterns for compliance and monitoring
 */

import { logger } from "../../shared/utils/logger";

// Node.js process object for environment checks
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

// Audit event types
export const AUDIT_EVENT_TYPES = {
  // Authentication events
  AUTH_LOGIN: "auth_login",
  AUTH_LOGOUT: "auth_logout",
  AUTH_FAILED: "auth_failed",
  AUTH_PASSWORD_CHANGE: "auth_password_change",
  AUTH_PASSWORD_RESET: "auth_password_reset",

  // Data access events
  DATA_READ: "data_read",
  DATA_WRITE: "data_write",
  DATA_DELETE: "data_delete",
  DATA_EXPORT: "data_export",
  DATA_IMPORT: "data_import",

  // Security events
  SECURITY_VIOLATION: "security_violation",
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  PERMISSION_DENIED: "permission_denied",

  // GDPR events
  GDPR_EXPORT_REQUEST: "gdpr_export_request",
  GDPR_DELETION_REQUEST: "gdpr_deletion_request",
  GDPR_ANONYMIZATION: "gdpr_anonymization",

  // System events
  SYSTEM_ERROR: "system_error",
  SYSTEM_WARNING: "system_warning",
  SYSTEM_MAINTENANCE: "system_maintenance",
} as const;

// Audit log levels
export const AUDIT_LOG_LEVELS = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
} as const;

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  eventType: string;
  level: string;
  description: string;
  details: {
    resource?: string;
    action?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    metadata?: any;
  };
  severity: number; // 1-10 scale
  tags: string[];
}

interface AuditLogStats {
  totalLogs: number;
  logsByLevel: Record<string, number>;
  logsByEventType: Record<string, number>;
  averageSeverity: number;
  recentViolations: number;
}

class AuditLoggingService {
  private static instance: AuditLoggingService;
  private logs: AuditLogEntry[] = [];
  private maxLogs: number = 10000; // Keep last 10k logs in memory
  private stats: AuditLogStats = {
    totalLogs: 0,
    logsByLevel: {},
    logsByEventType: {},
    averageSeverity: 0,
    recentViolations: 0,
  };

  private constructor() {}

  public static getInstance(): AuditLoggingService {
    if (!AuditLoggingService.instance) {
      AuditLoggingService.instance = new AuditLoggingService();
    }
    return AuditLoggingService.instance;
  }

  /**
   * Log authentication event
   */
  public logAuthEvent(
    eventType: string,
    userId: string,
    sessionId: string,
    details: {
      ipAddress?: string;
      userAgent?: string;
      location?: string;
      success?: boolean;
      reason?: string;
    }
  ): void {
    const level = details.success
      ? AUDIT_LOG_LEVELS.INFO
      : AUDIT_LOG_LEVELS.WARNING;
    const severity = details.success ? 3 : 6;

    this.logEvent({
      eventType,
      level,
      severity,
      userId,
      sessionId,
      description: `Authentication ${details.success ? "successful" : "failed"} for user ${userId}`,
      details: {
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        location: details.location,
        metadata: {
          success: details.success,
          reason: details.reason,
        },
      },
      tags: ["authentication", details.success ? "success" : "failure"],
    });
  }

  /**
   * Log data access event
   */
  public logDataAccess(
    eventType: string,
    userId: string,
    resource: string,
    action: string,
    details: {
      resourceId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      reason?: string;
    }
  ): void {
    const level = details.success
      ? AUDIT_LOG_LEVELS.INFO
      : AUDIT_LOG_LEVELS.WARNING;
    const severity = details.success ? 2 : 5;

    this.logEvent({
      eventType,
      level,
      severity,
      userId,
      description: `Data ${action} on ${resource} by user ${userId}`,
      details: {
        resource,
        action,
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        metadata: {
          resourceId: details.resourceId,
          success: details.success,
          reason: details.reason,
        },
      },
      tags: [
        "data-access",
        action,
        resource,
        details.success ? "success" : "failure",
      ],
    });
  }

  /**
   * Log security violation
   */
  public logSecurityViolation(
    eventType: string,
    userId: string,
    description: string,
    details: {
      ipAddress?: string;
      userAgent?: string;
      violationType?: string;
      severity?: number;
      metadata?: any;
    }
  ): void {
    const severity = details.severity || 8;

    this.logEvent({
      eventType,
      level: AUDIT_LOG_LEVELS.ERROR,
      severity,
      userId,
      description,
      details: {
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        metadata: {
          violationType: details.violationType,
          ...details.metadata,
        },
      },
      tags: ["security-violation", details.violationType || "unknown"],
    });

    // Update violation counter
    this.stats.recentViolations++;
  }

  /**
   * Log GDPR event
   */
  public logGDPREvent(
    eventType: string,
    userId: string,
    description: string,
    details: {
      requestId?: string;
      dataTypes?: string[];
      reason?: string;
      metadata?: any;
    }
  ): void {
    this.logEvent({
      eventType,
      level: AUDIT_LOG_LEVELS.INFO,
      severity: 4,
      userId,
      description,
      details: {
        metadata: {
          requestId: details.requestId,
          dataTypes: details.dataTypes,
          reason: details.reason,
          ...details.metadata,
        },
      },
      tags: ["gdpr", eventType],
    });
  }

  /**
   * Log system event
   */
  public logSystemEvent(
    eventType: string,
    level: string,
    description: string,
    details: {
      component?: string;
      error?: any;
      metadata?: any;
    }
  ): void {
    const severity = this.getSeverityFromLevel(level);

    this.logEvent({
      eventType,
      level,
      severity,
      description,
      details: {
        metadata: {
          component: details.component,
          error: details.error,
          ...details.metadata,
        },
      },
      tags: ["system", details.component || "unknown"],
    });
  }

  /**
   * Log rate limit exceeded
   */
  public logRateLimitExceeded(
    userId: string,
    details: {
      limitType: string;
      currentCount: number;
      limit: number;
      ipAddress?: string;
      userAgent?: string;
    }
  ): void {
    this.logEvent({
      eventType: AUDIT_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
      level: AUDIT_LOG_LEVELS.WARNING,
      severity: 5,
      userId,
      description: `Rate limit exceeded for user ${userId} (${details.limitType})`,
      details: {
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        metadata: {
          limitType: details.limitType,
          currentCount: details.currentCount,
          limit: details.limit,
        },
      },
      tags: ["rate-limit", details.limitType],
    });
  }

  /**
   * Log suspicious activity
   */
  public logSuspiciousActivity(
    userId: string,
    description: string,
    details: {
      activityType: string;
      riskScore: number;
      ipAddress?: string;
      userAgent?: string;
      metadata?: any;
    }
  ): void {
    const severity = Math.min(
      10,
      Math.max(1, Math.floor(details.riskScore / 10))
    );

    this.logEvent({
      eventType: AUDIT_EVENT_TYPES.SUSPICIOUS_ACTIVITY,
      level: AUDIT_LOG_LEVELS.WARNING,
      severity,
      userId,
      description,
      details: {
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        metadata: {
          activityType: details.activityType,
          riskScore: details.riskScore,
          ...details.metadata,
        },
      },
      tags: ["suspicious-activity", details.activityType],
    });
  }

  /**
   * Get audit logs for user
   */
  public getUserLogs(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get audit logs by event type
   */
  public getLogsByEventType(
    eventType: string,
    limit: number = 100
  ): AuditLogEntry[] {
    return this.logs
      .filter(log => log.eventType === eventType)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get audit logs by severity level
   */
  public getLogsBySeverity(
    minSeverity: number,
    limit: number = 100
  ): AuditLogEntry[] {
    return this.logs
      .filter(log => log.severity >= minSeverity)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get recent audit logs
   */
  public getRecentLogs(
    hours: number = 24,
    limit: number = 100
  ): AuditLogEntry[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.logs
      .filter(log => new Date(log.timestamp) >= cutoffTime)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get audit log statistics
   */
  public getAuditLogStats(): AuditLogStats {
    return { ...this.stats };
  }

  /**
   * Export audit logs
   */
  public exportAuditLogs(
    filters: {
      userId?: string;
      eventType?: string;
      level?: string;
      minSeverity?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters.eventType) {
      filteredLogs = filteredLogs.filter(
        log => log.eventType === filters.eventType
      );
    }

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.minSeverity) {
      filteredLogs = filteredLogs.filter(
        log => log.severity >= filters.minSeverity!
      );
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= filters.endDate!
      );
    }

    return filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Clear old audit logs
   */
  public clearOldLogs(maxAge: number = 90 * 24 * 60 * 60 * 1000): number {
    const cutoffTime = new Date(Date.now() - maxAge);
    const initialCount = this.logs.length;

    this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoffTime);

    const clearedCount = initialCount - this.logs.length;

    if (clearedCount > 0) {
      logger.info(
        `Cleared ${clearedCount} old audit logs`,
        "AuditLoggingService"
      );
    }

    return clearedCount;
  }

  /**
   * Log event internally
   */
  private logEvent(logEntry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    const entry: AuditLogEntry = {
      ...logEntry,
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
    };

    // Add to logs array
    this.logs.push(entry);

    // Maintain max log size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Update statistics
    this.updateStats(entry);

    // Log to console for development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[AUDIT] ${entry.level.toUpperCase()}: ${entry.description}`,
        entry
      );
    }

    // Log to external system in production
    if (process.env.NODE_ENV === "production") {
      logger.info(
        `Audit log: ${entry.description}`,
        "AuditLoggingService",
        entry
      );
    }
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get severity from log level
   */
  private getSeverityFromLevel(level: string): number {
    switch (level) {
      case AUDIT_LOG_LEVELS.INFO:
        return 3;
      case AUDIT_LOG_LEVELS.WARNING:
        return 6;
      case AUDIT_LOG_LEVELS.ERROR:
        return 8;
      case AUDIT_LOG_LEVELS.CRITICAL:
        return 10;
      default:
        return 5;
    }
  }

  /**
   * Update audit log statistics
   */
  private updateStats(entry: AuditLogEntry): void {
    this.stats.totalLogs++;

    // Update level statistics
    this.stats.logsByLevel[entry.level] =
      (this.stats.logsByLevel[entry.level] || 0) + 1;

    // Update event type statistics
    this.stats.logsByEventType[entry.eventType] =
      (this.stats.logsByEventType[entry.eventType] || 0) + 1;

    // Update average severity
    this.stats.averageSeverity =
      (this.stats.averageSeverity * (this.stats.totalLogs - 1) +
        entry.severity) /
      this.stats.totalLogs;
  }

  /**
   * Reset audit log statistics
   */
  public resetStats(): void {
    this.stats = {
      totalLogs: 0,
      logsByLevel: {},
      logsByEventType: {},
      averageSeverity: 0,
      recentViolations: 0,
    };
  }

  /**
   * Clear all audit logs
   */
  public clearAllLogs(): void {
    this.logs = [];
    this.resetStats();
    logger.info("All audit logs cleared", "AuditLoggingService");
  }
}

// Export singleton instance
export const auditLoggingService = AuditLoggingService.getInstance();

// Export types
export type { AuditLogEntry, AuditLogStats };
