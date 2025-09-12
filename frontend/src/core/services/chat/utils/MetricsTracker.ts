/**
 * Metrics Tracking Utility
 * Handles performance monitoring and analytics
 */

import { ServiceMetrics } from "../types";
import { legendaryErrorHandler } from "@/lib/monitoring/LegendaryErrorHandler";

export class MetricsTracker {
  private static instance: MetricsTracker;
  private metrics: ServiceMetrics = {
    totalOperations: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    batchedOperations: 0,
    errorRate: 0
  };

  static getInstance(): MetricsTracker {
    if (!MetricsTracker.instance) {
      MetricsTracker.instance = new MetricsTracker();
    }
    return MetricsTracker.instance;
  }

  updateMetrics(
    operation: string,
    responseTime: number,
    success: boolean,
    cacheHit: boolean = false
  ): void {
    this.metrics.totalOperations++;

    if (cacheHit) {
      this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2; // Rolling average
    }

    if (success) {
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + responseTime) / 2; // Rolling average
    } else {
      this.metrics.errorRate = (this.metrics.errorRate + 1) / 2; // Rolling average
    }

    if (operation.includes('batch')) {
      this.metrics.batchedOperations++;
    }
  }

  getMetrics(): ServiceMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalOperations: 0,
      cacheHitRate: 0,
      averageResponseTime: 0,
      batchedOperations: 0,
      errorRate: 0
    };
  }

  logMetricsSummary(): void {
    console.log('🚀 Chat Service Metrics:', {
      'Total Operations': this.metrics.totalOperations,
      'Cache Hit Rate': `${(this.metrics.cacheHitRate * 100).toFixed(1)}%`,
      'Average Response Time': `${this.metrics.averageResponseTime.toFixed(1)}ms`,
      'Batched Operations': this.metrics.batchedOperations,
      'Error Rate': `${(this.metrics.errorRate * 100).toFixed(1)}%`
    });
  }

  registerErrorRecoveryStrategies(): void {
    legendaryErrorHandler.registerRecoveryStrategy('NetworkError', async () => {
      return false;
    });

    legendaryErrorHandler.registerRecoveryStrategy('QuotaExceededError', async () => {
      return true;
    });
  }
}