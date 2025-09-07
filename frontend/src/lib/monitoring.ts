/**
 * Production Monitoring and Analytics
 * This file handles error tracking, performance monitoring, and analytics
 */

import { appConfig } from './config';

// Error tracking interface
interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
}

// Performance monitoring interface
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  userId?: string;
}

// Analytics event interface
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp: Date;
}

class MonitoringService {
  private isEnabled: boolean;
  private userId?: string;

  constructor() {
    this.isEnabled = appConfig.isProduction;
    this.setupErrorHandling();
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Setup global error handling
  private setupErrorHandling() {
    if (!this.isEnabled) return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', event => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
      });
    });
  }

  // Track errors
  trackError(errorInfo: Omit<ErrorInfo, 'timestamp' | 'userAgent' | 'url'>) {
    if (!this.isEnabled) return;

    const fullErrorInfo: ErrorInfo = {
      ...errorInfo,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.userId,
    };

    // Log to console in development
    if (appConfig.isDevelopment) {
      console.error('Error tracked:', fullErrorInfo);
    }

    // Send to error tracking service (e.g., Sentry, LogRocket)
    this.sendToErrorService(fullErrorInfo);
  }

  // Track performance metrics
  trackPerformance(metric: Omit<PerformanceMetric, 'timestamp'>) {
    if (!this.isEnabled) return;

    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date(),
      userId: this.userId,
    };

    // Log to console in development
    if (appConfig.isDevelopment) {
      console.log('Performance metric:', fullMetric);
    }

    // Send to performance monitoring service
    this.sendToPerformanceService(fullMetric);
  }

  // Track analytics events
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    if (!this.isEnabled) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      userId: this.userId,
    };

    // Log to console in development
    if (appConfig.isDevelopment) {
      console.log('Analytics event:', fullEvent);
    }

    // Send to analytics service (e.g., Google Analytics, Mixpanel)
    this.sendToAnalyticsService(fullEvent);
  }

  // Track page views
  trackPageView(page: string) {
    this.trackEvent({
      event: 'page_view',
      properties: {
        page,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track user actions
  trackUserAction(action: string, properties?: Record<string, unknown>) {
    this.trackEvent({
      event: 'user_action',
      properties: {
        action,
        ...properties,
      },
    });
  }

  // Track authentication events
  trackAuthEvent(
    event: 'login' | 'logout' | 'signup',
    properties?: Record<string, unknown>
  ) {
    this.trackEvent({
      event: 'auth_event',
      properties: {
        auth_event: event,
        ...properties,
      },
    });
  }

  // Private methods for sending data to services
  private async sendToErrorService(errorInfo: ErrorInfo) {
    try {
      // Example: Send to error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo),
      // });

      // For now, just log to console
      console.error('Error service:', errorInfo);
    } catch (error) {
      console.error('Failed to send error to service:', error);
    }
  }

  private async sendToPerformanceService(metric: PerformanceMetric) {
    try {
      // Example: Send to performance monitoring service
      // await fetch('/api/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric),
      // });

      // For now, just log to console
      console.log('Performance service:', metric);
    } catch (error) {
      console.error('Failed to send performance metric to service:', error);
    }
  }

  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      // Example: Send to analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });

      // For now, just log to console
      console.log('Analytics service:', event);
    } catch (error) {
      console.error('Failed to send analytics event to service:', error);
    }
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

// Export types for use in other files
export type { AnalyticsEvent, ErrorInfo, PerformanceMetric };
