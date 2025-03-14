// Monitoring and error tracking configuration
import * as Sentry from '@sentry/nextjs';

// Initialize Sentry for error tracking and performance monitoring
export function initializeMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT || 'development',
    });
  }
}

// Simple logger for consistency
export const logger = {
  debug: (message: string, extra?: Record<string, any>) => {
    console.debug(message, extra);
  },
  
  info: (message: string, extra?: Record<string, any>) => {
    console.info(message, extra);
  },
  
  warn: (message: string, extra?: Record<string, any>) => {
    console.warn(message, extra);
  },
  
  error: (message: string, error?: Error, extra?: Record<string, any>) => {
    console.error(message, error, extra);
  },
  
  trackPerformance: (name: string, operation: () => any) => {
    const startTime = performance.now();
    const result = operation();
    const duration = performance.now() - startTime;
    console.log(`Performance: ${name} - ${duration.toFixed(2)}ms`);
    return result;
  },
};