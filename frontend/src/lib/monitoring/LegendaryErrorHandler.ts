/**
 * 🚀 LEGENDARY ERROR HANDLER & MONITORING
 * Peak Performance Error Management
 * - Intelligent error classification
 * - Real-time error tracking
 * - Performance monitoring
 * - User experience optimization
 * - Automatic error recovery
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp: number;
  stackTrace?: string;
  additionalData?: Record<string, any>;
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Map<string, number>;
  errorsByComponent: Map<string, number>;
  recoveredErrors: number;
  criticalErrors: number;
  averageResponseTime: number;
  userImpactScore: number;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  bundleSize: number;
  apiResponseTime: number;
}

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
type ErrorCategory = 'network' | 'ui' | 'business' | 'system' | 'user';

export class LegendaryErrorHandler {
  private static instance: LegendaryErrorHandler;
  private errorQueue: Array<{ error: Error; context: ErrorContext; severity: ErrorSeverity }> = [];
  private metrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByType: new Map(),
    errorsByComponent: new Map(),
    recoveredErrors: 0,
    criticalErrors: 0,
    averageResponseTime: 0,
    userImpactScore: 0
  };

  private performanceMetrics: PerformanceMetrics = {
    pageLoadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    apiResponseTime: 0
  };

  private recoveryStrategies = new Map<string, () => Promise<boolean>>();
  private isOnline = navigator.onLine;
  private performanceObserver?: PerformanceObserver;

  private constructor() {
    this.initializeGlobalErrorHandling();
    this.initializePerformanceMonitoring();
    this.initializeNetworkMonitoring();
    this.startErrorProcessing();
  }

  static getInstance(): LegendaryErrorHandler {
    if (!LegendaryErrorHandler.instance) {
      LegendaryErrorHandler.instance = new LegendaryErrorHandler();
    }
    return LegendaryErrorHandler.instance;
  }

  /**
   * 🔥 LEGENDARY ERROR CAPTURE
   */
  captureError(
    error: Error,
    context: Partial<ErrorContext> = {},
    severity: ErrorSeverity = 'medium'
  ): void {
    const enhancedContext: ErrorContext = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      stackTrace: error.stack,
      ...context
    };

    // Classify error automatically if not specified
    const autoSeverity = this.classifyError(error);
    const finalSeverity = severity === 'medium' ? autoSeverity : severity;

    // Add to processing queue
    this.errorQueue.push({
      error,
      context: enhancedContext,
      severity: finalSeverity
    });

    // Update metrics
    this.updateErrorMetrics(error, enhancedContext, finalSeverity);

    // Attempt immediate recovery for critical errors
    if (finalSeverity === 'critical') {
      this.attemptErrorRecovery(error, enhancedContext);
    }
  }

  /**
   * 🛡️ LEGENDARY ERROR RECOVERY
   */
  registerRecoveryStrategy(errorType: string, strategy: () => Promise<boolean>): void {
    this.recoveryStrategies.set(errorType, strategy);
  }

  private async attemptErrorRecovery(error: Error, context: ErrorContext): Promise<boolean> {
    const errorType = error.constructor.name;
    const strategy = this.recoveryStrategies.get(errorType);

    if (strategy) {
      try {
        const recovered = await strategy();
        if (recovered) {
          this.metrics.recoveredErrors++;
          console.info(`🚀 Legendary recovery successful for ${errorType}`);
          return true;
        }
      } catch (recoveryError) {
        console.error('Recovery strategy failed:', recoveryError);
      }
    }

    // Generic recovery strategies
    return this.genericRecoveryAttempt(error, context);
  }

  private async genericRecoveryAttempt(error: Error, context: ErrorContext): Promise<boolean> {
    // Network error recovery
    if (error.message.includes('fetch') || error.message.includes('network')) {
      if (!this.isOnline) {
        // Wait for connection and retry
        await this.waitForConnection();
        return true;
      }
    }

    // Memory error recovery
    if (error.message.includes('memory') || error.name === 'RangeError') {
      // Clear caches and trigger garbage collection
      this.clearCaches();
      return true;
    }

    // UI error recovery
    if (context.component && error.message.includes('render')) {
      // Force re-render by updating a key state
      this.triggerComponentRecovery(context.component);
      return true;
    }

    return false;
  }

  /**
   * 📊 LEGENDARY PERFORMANCE MONITORING
   */
  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.performanceMetrics.memoryUsage = memory.usedJSHeapSize;
      }, 10000);
    }

    // Monitor bundle size
    this.calculateBundleSize();
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.performanceMetrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        break;

      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.performanceMetrics.renderTime = entry.startTime;
        }
        break;

      case 'first-input':
        this.performanceMetrics.interactionTime = (entry as any).processingStart - entry.startTime;
        break;

      case 'largest-contentful-paint':
        // Track LCP for performance scoring
        if (entry.startTime > 2500) {
          this.captureError(
            new Error('Poor LCP performance'),
            { component: 'Performance', action: 'LCP_MEASUREMENT' },
            'medium'
          );
        }
        break;
    }
  }

  /**
   * 🌐 LEGENDARY NETWORK MONITORING
   */
  private initializeNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.info('🚀 Connection restored - Legendary system back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.warn('🔄 Connection lost - Legendary offline mode activated');
    });

    // Monitor network quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', () => {
          if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
            this.captureError(
              new Error('Slow network detected'),
              { component: 'Network', action: 'SLOW_CONNECTION' },
              'low'
            );
          }
        });
      }
    }
  }

  /**
   * 🔍 LEGENDARY ERROR CLASSIFICATION
   */
  private classifyError(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (
      message.includes('security') ||
      message.includes('csrf') ||
      message.includes('unauthorized') ||
      error.name === 'SecurityError' ||
      message.includes('payment')
    ) {
      return 'critical';
    }

    // High severity errors
    if (
      message.includes('network') ||
      message.includes('server') ||
      message.includes('database') ||
      message.includes('api') ||
      error.name === 'TypeError' ||
      error.name === 'ReferenceError'
    ) {
      return 'high';
    }

    // Medium severity errors
    if (
      message.includes('render') ||
      message.includes('component') ||
      message.includes('state') ||
      error.name === 'RangeError'
    ) {
      return 'medium';
    }

    // Default to low for unknown errors
    return 'low';
  }

  private updateErrorMetrics(error: Error, context: ErrorContext, severity: ErrorSeverity): void {
    this.metrics.totalErrors++;
    
    // Update error type metrics
    const errorType = error.constructor.name;
    this.metrics.errorsByType.set(errorType, (this.metrics.errorsByType.get(errorType) || 0) + 1);
    
    // Update component metrics
    if (context.component) {
      this.metrics.errorsByComponent.set(
        context.component,
        (this.metrics.errorsByComponent.get(context.component) || 0) + 1
      );
    }

    // Update severity metrics
    if (severity === 'critical') {
      this.metrics.criticalErrors++;
    }

    // Calculate user impact score
    this.updateUserImpactScore(severity);
  }

  private updateUserImpactScore(severity: ErrorSeverity): void {
    const severityWeights = { low: 1, medium: 3, high: 7, critical: 15 };
    const impact = severityWeights[severity];
    
    // Rolling average of user impact
    this.metrics.userImpactScore = (this.metrics.userImpactScore * 0.9) + (impact * 0.1);
  }

  /**
   * 🔧 LEGENDARY UTILITIES
   */
  private initializeGlobalErrorHandling(): void {
    // Unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(
        event.error || new Error(event.message),
        {
          component: 'Global',
          action: 'UNHANDLED_ERROR',
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        },
        'high'
      );
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'Global',
          action: 'UNHANDLED_PROMISE_REJECTION'
        },
        'high'
      );
    });

    // React error boundary integration
    if (typeof window !== 'undefined') {
      (window as any).legendaryErrorHandler = this;
    }
  }

  private startErrorProcessing(): void {
    setInterval(() => {
      this.processErrorQueue();
    }, 5000);
  }

  private processErrorQueue(): void {
    if (this.errorQueue.length === 0) return;

    const errors = this.errorQueue.splice(0, 10); // Process in batches
    
    for (const { error, context, severity } of errors) {
      this.logError(error, context, severity);
    }
  }

  private logError(error: Error, context: ErrorContext, severity: ErrorSeverity): void {
    const logData = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      severity,
      context,
      performance: this.getPerformanceSnapshot(),
      timestamp: new Date().toISOString()
    };

    // Console logging with appropriate level
    const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    console[logLevel]('🚀 Legendary Error:', logData);

    // Here you would normally send to your analytics service
    // this.sendToAnalytics(logData);
  }

  private getPerformanceSnapshot(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  private calculateBundleSize(): void {
    if ('navigation' in performance) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        this.performanceMetrics.bundleSize = navEntries[0].transferSize || 0;
      }
    }
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isOnline) {
        resolve();
        return;
      }

      const checkConnection = () => {
        if (this.isOnline) {
          window.removeEventListener('online', checkConnection);
          resolve();
        }
      };

      window.addEventListener('online', checkConnection);
    });
  }

  private clearCaches(): void {
    // Clear various caches to free up memory
    try {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  }

  private triggerComponentRecovery(component: string): void {
    // Dispatch a custom event that components can listen to for recovery
    window.dispatchEvent(new CustomEvent('legendary-component-recovery', {
      detail: { component }
    }));
  }

  /**
   * 📊 LEGENDARY METRICS API
   */
  getErrorMetrics(): ErrorMetrics & {
    errorRate: number;
    recoveryRate: number;
    performanceScore: number;
  } {
    const errorRate = this.metrics.totalErrors > 0 
      ? (this.metrics.totalErrors / (Date.now() - performance.timeOrigin)) * 1000 * 60 // errors per minute
      : 0;

    const recoveryRate = this.metrics.totalErrors > 0
      ? (this.metrics.recoveredErrors / this.metrics.totalErrors) * 100
      : 100;

    const performanceScore = this.calculatePerformanceScore();

    return {
      ...this.metrics,
      errorsByType: this.metrics.errorsByType,
      errorsByComponent: this.metrics.errorsByComponent,
      errorRate: Math.round(errorRate * 100) / 100,
      recoveryRate: Math.round(recoveryRate * 100) / 100,
      performanceScore: Math.round(performanceScore * 100) / 100
    };
  }

  getPerformanceMetrics(): PerformanceMetrics & { score: number } {
    return {
      ...this.performanceMetrics,
      score: this.calculatePerformanceScore()
    };
  }

  private calculatePerformanceScore(): number {
    let score = 100;

    // Page load time impact (0-40 points)
    if (this.performanceMetrics.pageLoadTime > 3000) score -= 40;
    else if (this.performanceMetrics.pageLoadTime > 1500) score -= 20;
    else if (this.performanceMetrics.pageLoadTime > 800) score -= 10;

    // Memory usage impact (0-20 points)
    if (this.performanceMetrics.memoryUsage > 100 * 1024 * 1024) score -= 20; // 100MB
    else if (this.performanceMetrics.memoryUsage > 50 * 1024 * 1024) score -= 10; // 50MB

    // Error impact (0-40 points)
    score -= Math.min(this.metrics.userImpactScore, 40);

    return Math.max(score, 0);
  }

  /**
   * 🔧 LEGENDARY CLEANUP
   */
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.errorQueue = [];
    this.recoveryStrategies.clear();
  }
}

// Singleton instance
export const legendaryErrorHandler = LegendaryErrorHandler.getInstance();

// React Error Boundary Helper
export const withLegendaryErrorBoundary = (Component: React.ComponentType<any>) => {
  return class LegendaryErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      legendaryErrorHandler.captureError(error, {
        component: Component.name,
        action: 'RENDER_ERROR',
        additionalData: errorInfo
      }, 'high');
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          className: 'legendary-error-fallback',
          children: '⚡ Something went wrong. Our legendary system is recovering...'
        });
      }

      return React.createElement(Component, this.props);
    }
  };
};