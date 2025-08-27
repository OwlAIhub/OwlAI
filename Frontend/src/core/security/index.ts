/**
 * Security & Privacy Module
 * Provides unified interface for security and privacy management
 */

import { encryptionService } from "./encryption.service";
import { gdprService } from "./gdpr.service";
import { inputSanitizationService } from "./input-sanitization.service";
import { auditLoggingService } from "./audit-logging.service";

export { encryptionService } from "./encryption.service";
export { gdprService } from "./gdpr.service";
export { inputSanitizationService } from "./input-sanitization.service";
export { auditLoggingService } from "./audit-logging.service";

// Re-export Firestore security rules
export {
  FIRESTORE_SECURITY_RULES,
  SECURITY_RULE_TEMPLATES,
  COMPLETE_FIRESTORE_RULES,
  SECURITY_VALIDATORS,
} from "./firestore-rules";

// Re-export audit logging constants
export { AUDIT_EVENT_TYPES, AUDIT_LOG_LEVELS } from "./audit-logging.service";

// Re-export types
export type {
  EncryptionResult,
  DecryptionResult,
  EncryptionStats,
} from "./encryption.service";

export type {
  GDPRRequest,
  DataExport,
  DeletionConfirmation,
  GDPRStats,
} from "./gdpr.service";

export type {
  SanitizationResult,
  SanitizationStats,
} from "./input-sanitization.service";

export type { AuditLogEntry, AuditLogStats } from "./audit-logging.service";

export type { SecurityRuleTemplate, PermissionLevel } from "./firestore-rules";

/**
 * Security & Privacy Manager
 * Centralized management of all security and privacy services
 */
class SecurityPrivacyManager {
  private static instance: SecurityPrivacyManager;

  private constructor() {}

  public static getInstance(): SecurityPrivacyManager {
    if (!SecurityPrivacyManager.instance) {
      SecurityPrivacyManager.instance = new SecurityPrivacyManager();
    }
    return SecurityPrivacyManager.instance;
  }

  /**
   * Get all security statistics
   */
  public getAllSecurityStats() {
    return {
      encryption: encryptionService.getEncryptionStats(),
      gdpr: gdprService.getGDPRStats(),
      sanitization: inputSanitizationService.getSanitizationStats(),
      audit: auditLoggingService.getAuditLogStats(),
    };
  }

  /**
   * Security health check
   */
  public async securityHealthCheck(): Promise<{
    encryption: boolean;
    gdpr: boolean;
    sanitization: boolean;
    audit: boolean;
    overall: boolean;
  }> {
    try {
      const encryptionHealthy = encryptionService.isReady();
      const gdprHealthy = gdprService.getGDPRStats().totalRequests >= 0;
      const sanitizationHealthy =
        inputSanitizationService.getSanitizationStats().totalInputs >= 0;
      const auditHealthy =
        auditLoggingService.getAuditLogStats().totalLogs >= 0;

      const overall =
        encryptionHealthy && gdprHealthy && sanitizationHealthy && auditHealthy;

      return {
        encryption: encryptionHealthy,
        gdpr: gdprHealthy,
        sanitization: sanitizationHealthy,
        audit: auditHealthy,
        overall,
      };
    } catch (error) {
      return {
        encryption: false,
        gdpr: false,
        sanitization: false,
        audit: false,
        overall: false,
      };
    }
  }

  /**
   * Initialize all security services
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize encryption service
      if (!encryptionService.isReady()) {
        await encryptionService.reinitializeMasterKey();
      }

      console.log("Security & Privacy services initialized");
    } catch (error) {
      console.error("Failed to initialize Security & Privacy services:", error);
      throw error;
    }
  }

  /**
   * Cleanup all security services
   */
  public async cleanup(): Promise<void> {
    try {
      // Clear audit logs
      auditLoggingService.clearOldLogs();

      // Clear old GDPR requests
      gdprService.clearOldRequests();

      console.log("Security & Privacy services cleaned up");
    } catch (error) {
      console.error("Failed to cleanup Security & Privacy services:", error);
      throw error;
    }
  }

  /**
   * Reset all security statistics
   */
  public resetAllStats(): void {
    encryptionService.resetStats();
    gdprService.resetStats();
    inputSanitizationService.resetStats();
    auditLoggingService.resetStats();
  }

  /**
   * Get security summary
   */
  public getSecuritySummary() {
    const encryptionStats = encryptionService.getEncryptionStats();
    const gdprStats = gdprService.getGDPRStats();
    const sanitizationStats = inputSanitizationService.getSanitizationStats();
    const auditStats = auditLoggingService.getAuditLogStats();

    return {
      encryptionReady: encryptionService.isReady(),
      totalEncryptions: encryptionStats.totalEncryptions,
      totalDecryptions: encryptionStats.totalDecryptions,
      gdprRequests: gdprStats.totalRequests,
      gdprSuccessRate: gdprStats.successRate,
      sanitizedInputs: sanitizationStats.sanitizedInputs,
      rejectedInputs: sanitizationStats.rejectedInputs,
      totalAuditLogs: auditStats.totalLogs,
      recentViolations: auditStats.recentViolations,
      averageSeverity: auditStats.averageSeverity,
    };
  }

  /**
   * Validate security configuration
   */
  public validateSecurityConfig(): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check encryption service
    if (!encryptionService.isReady()) {
      issues.push("Encryption service is not ready");
    }

    // Check sanitization configuration
    const sanitizationConfig = inputSanitizationService.getConfig();
    if (!sanitizationConfig.MAX_LENGTHS.MESSAGE_CONTENT) {
      issues.push("Message content max length is not configured");
    }

    // Check audit logging
    const auditStats = auditLoggingService.getAuditLogStats();
    if (auditStats.recentViolations > 100) {
      issues.push("High number of recent security violations detected");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Perform security audit
   */
  public async performSecurityAudit(): Promise<{
    score: number;
    findings: string[];
    recommendations: string[];
  }> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check encryption
    if (!encryptionService.isReady()) {
      findings.push("Encryption service is not properly initialized");
      recommendations.push(
        "Ensure encryption master key is properly configured"
      );
      score -= 20;
    }

    // Check sanitization
    const sanitizationStats = inputSanitizationService.getSanitizationStats();
    if (sanitizationStats.errorRate > 5) {
      findings.push("High input sanitization error rate detected");
      recommendations.push("Review input validation rules and user feedback");
      score -= 15;
    }

    // Check audit logging
    const auditStats = auditLoggingService.getAuditLogStats();
    if (auditStats.recentViolations > 50) {
      findings.push("High number of security violations detected");
      recommendations.push(
        "Investigate security violations and implement additional protections"
      );
      score -= 25;
    }

    // Check GDPR compliance
    const gdprStats = gdprService.getGDPRStats();
    if (gdprStats.successRate < 95) {
      findings.push("GDPR request success rate is below threshold");
      recommendations.push("Review GDPR request processing and error handling");
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      findings,
      recommendations,
    };
  }
}

// Export security manager
export const securityPrivacyManager = SecurityPrivacyManager.getInstance();
