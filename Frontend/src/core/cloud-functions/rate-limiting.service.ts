/**
 * Rate Limiting Service
 * Handles centralized rate limiting on server-side to prevent API abuse and manage costs
 */

import { logger } from "../../shared/utils/logger";
import {
  CLOUD_FUNCTIONS_CONFIG,
  FUNCTION_ENDPOINTS,
  ERROR_CODES,
  type CloudFunctionRequest,
  type CloudFunctionResponse,
  type RateLimitInfo,
} from "./config";

interface RateLimitRule {
  userId: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  burstLimit: number;
  lastResetTime: number;
  currentRequests: number;
}

interface RateLimitStats {
  totalRequests: number;
  limitedRequests: number;
  averageResponseTime: number;
  activeUsers: number;
}

class RateLimitingService {
  private static instance: RateLimitingService;
  private rateLimits: Map<string, RateLimitRule> = new Map();
  private stats: RateLimitStats = {
    totalRequests: 0,
    limitedRequests: 0,
    averageResponseTime: 0,
    activeUsers: 0,
  };

  private constructor() {
    this.startCleanupInterval();
  }

  public static getInstance(): RateLimitingService {
    if (!RateLimitingService.instance) {
      RateLimitingService.instance = new RateLimitingService();
    }
    return RateLimitingService.instance;
  }

  /**
   * Check rate limit for user
   */
  public async checkRateLimit(userId: string): Promise<{
    allowed: boolean;
    limitInfo: RateLimitInfo;
    retryAfter?: number;
  }> {
    const now = Date.now();
    const rule = this.getOrCreateRateLimitRule(userId);

    // Reset counters if needed
    this.resetCountersIfNeeded(rule, now);

    // Check burst limit
    if (rule.currentRequests >= rule.burstLimit) {
      this.stats.limitedRequests++;
      logger.warn("Rate limit exceeded (burst)", "RateLimitingService", {
        userId,
        currentRequests: rule.currentRequests,
        burstLimit: rule.burstLimit,
      });

      return {
        allowed: false,
        limitInfo: this.createRateLimitInfo(rule, now),
        retryAfter: this.calculateRetryAfter(rule, now),
      };
    }

    // Check hourly limit
    const hourlyRequests = await this.getHourlyRequestCount(userId, now);
    if (hourlyRequests >= rule.requestsPerHour) {
      this.stats.limitedRequests++;
      logger.warn("Rate limit exceeded (hourly)", "RateLimitingService", {
        userId,
        hourlyRequests,
        requestsPerHour: rule.requestsPerHour,
      });

      return {
        allowed: false,
        limitInfo: this.createRateLimitInfo(rule, now),
        retryAfter: this.calculateRetryAfter(rule, now),
      };
    }

    // Allow request
    rule.currentRequests++;
    this.stats.totalRequests++;
    this.updateAverageResponseTime(now);

    logger.debug("Rate limit check passed", "RateLimitingService", {
      userId,
      currentRequests: rule.currentRequests,
      burstLimit: rule.burstLimit,
    });

    return {
      allowed: true,
      limitInfo: this.createRateLimitInfo(rule, now),
    };
  }

  /**
   * Record successful request
   */
  public recordRequest(userId: string, processingTime: number): void {
    const rule = this.rateLimits.get(userId);
    if (rule) {
      // Decrement current requests after successful processing
      rule.currentRequests = Math.max(0, rule.currentRequests - 1);

      // Update average response time
      this.updateAverageResponseTime(processingTime);
    }
  }

  /**
   * Get rate limit information for user
   */
  public async getRateLimitInfo(userId: string): Promise<RateLimitInfo> {
    const rule = this.getOrCreateRateLimitRule(userId);
    const now = Date.now();

    return this.createRateLimitInfo(rule, now);
  }

  /**
   * Update rate limit rules for user
   */
  public updateRateLimitRules(
    userId: string,
    rules: Partial<
      Pick<
        RateLimitRule,
        "requestsPerMinute" | "requestsPerHour" | "burstLimit"
      >
    >
  ): void {
    const rule = this.getOrCreateRateLimitRule(userId);

    if (rules.requestsPerMinute !== undefined) {
      rule.requestsPerMinute = rules.requestsPerMinute;
    }
    if (rules.requestsPerHour !== undefined) {
      rule.requestsPerHour = rules.requestsPerHour;
    }
    if (rules.burstLimit !== undefined) {
      rule.burstLimit = rules.burstLimit;
    }

    logger.info("Rate limit rules updated", "RateLimitingService", {
      userId,
      rules,
    });
  }

  /**
   * Reset rate limit for user
   */
  public resetRateLimit(userId: string): void {
    this.rateLimits.delete(userId);
    logger.info("Rate limit reset for user", "RateLimitingService", { userId });
  }

  /**
   * Get rate limiting statistics
   */
  public getRateLimitStats(): RateLimitStats {
    return { ...this.stats };
  }

  /**
   * Check rate limit via Cloud Functions
   */
  public async checkRateLimitOnServer(userId: string): Promise<RateLimitInfo> {
    try {
      const request: CloudFunctionRequest<{ userId: string }> = {
        data: { userId },
        userId,
        timestamp: new Date().toISOString(),
        requestId: `rate-limit-${Date.now()}`,
        metadata: {
          source: "client",
          priority: "normal",
          retryCount: 0,
        },
      };

      const response = await fetch(
        `${CLOUD_FUNCTIONS_CONFIG.BASE_URL}${FUNCTION_ENDPOINTS.RATE_LIMIT_CHECK}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await this.getAuthToken()}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: CloudFunctionResponse<RateLimitInfo> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Rate limit check failed");
      }

      return result.data!;
    } catch (error) {
      logger.error(
        "Failed to check rate limit on server",
        "RateLimitingService",
        error
      );

      // Fallback to local rate limiting
      const localCheck = await this.checkRateLimit(userId);
      return localCheck.limitInfo;
    }
  }

  /**
   * Get or create rate limit rule for user
   */
  private getOrCreateRateLimitRule(userId: string): RateLimitRule {
    let rule = this.rateLimits.get(userId);

    if (!rule) {
      rule = {
        userId,
        requestsPerMinute:
          CLOUD_FUNCTIONS_CONFIG.RATE_LIMIT.REQUESTS_PER_MINUTE,
        requestsPerHour: CLOUD_FUNCTIONS_CONFIG.RATE_LIMIT.REQUESTS_PER_HOUR,
        burstLimit: CLOUD_FUNCTIONS_CONFIG.RATE_LIMIT.BURST_LIMIT,
        lastResetTime: Date.now(),
        currentRequests: 0,
      };

      this.rateLimits.set(userId, rule);
      this.stats.activeUsers = this.rateLimits.size;
    }

    return rule;
  }

  /**
   * Reset counters if needed
   */
  private resetCountersIfNeeded(rule: RateLimitRule, now: number): void {
    const oneMinute = 60 * 1000;

    if (now - rule.lastResetTime >= oneMinute) {
      rule.currentRequests = 0;
      rule.lastResetTime = now;
    }
  }

  /**
   * Get hourly request count (simplified implementation)
   */
  private async getHourlyRequestCount(
    userId: string,
    now: number
  ): Promise<number> {
    // In a real implementation, this would query a database
    // For now, return a simplified count
    const rule = this.rateLimits.get(userId);
    return rule ? Math.floor(rule.currentRequests * 0.1) : 0; // Simplified calculation
  }

  /**
   * Create rate limit info
   */
  private createRateLimitInfo(rule: RateLimitRule, now: number): RateLimitInfo {
    const isLimited = rule.currentRequests >= rule.burstLimit;
    const resetTime = new Date(rule.lastResetTime + 60 * 1000).toISOString();

    return {
      userId: rule.userId,
      requestsPerMinute: rule.requestsPerMinute,
      requestsPerHour: rule.requestsPerHour,
      lastRequestTime: new Date(now).toISOString(),
      isLimited,
      resetTime,
    };
  }

  /**
   * Calculate retry after time
   */
  private calculateRetryAfter(rule: RateLimitRule, now: number): number {
    const timeSinceReset = now - rule.lastResetTime;
    const oneMinute = 60 * 1000;
    return Math.max(0, oneMinute - timeSinceReset);
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(processingTime: number): void {
    this.stats.averageResponseTime =
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) +
        processingTime) /
      this.stats.totalRequests;
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(
      () => {
        this.cleanupInactiveUsers();
      },
      5 * 60 * 1000
    ); // Clean up every 5 minutes
  }

  /**
   * Clean up inactive users
   */
  private cleanupInactiveUsers(): void {
    const now = Date.now();
    const inactiveThreshold = 30 * 60 * 1000; // 30 minutes
    let cleanedCount = 0;

    for (const [userId, rule] of this.rateLimits.entries()) {
      if (
        now - rule.lastResetTime > inactiveThreshold &&
        rule.currentRequests === 0
      ) {
        this.rateLimits.delete(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.stats.activeUsers = this.rateLimits.size;
      logger.info(
        `Cleaned up ${cleanedCount} inactive users`,
        "RateLimitingService"
      );
    }
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    // This should be implemented based on your auth system
    return "placeholder-token";
  }

  /**
   * Reset all statistics
   */
  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      limitedRequests: 0,
      averageResponseTime: 0,
      activeUsers: this.rateLimits.size,
    };
  }

  /**
   * Clear all rate limits
   */
  public clearAllRateLimits(): void {
    this.rateLimits.clear();
    this.stats.activeUsers = 0;
  }
}

// Export singleton instance
export const rateLimitingService = RateLimitingService.getInstance();

// Export types
export type { RateLimitRule, RateLimitStats };
