import { config } from '../utils/config';

// Simple deduplication to prevent spamming the telemetry endpoint
const seenErrors = new Set();
const ERROR_LOG_LIMIT = 50;

export const reportError = async (error, context = {}) => {
  const errorKey = `${error.message || String(error)}-${JSON.stringify(context)}`;

  if (seenErrors.has(errorKey)) return;

  if (process.env.NODE_ENV !== 'production') {
    console.group('Captured by Boundary');
    console.error('Error:', error);
    console.log('Context:', context);
    console.groupEnd();
    return;
  }

  try {
    const payload = {
      event: 'js_error',
      route: window.location.pathname,
      meta: JSON.stringify({
        message: error.message || String(error),
        stack: error.stack,
        context,
        userAgent: navigator.userAgent
      }),
      timestamp: new Date().toISOString()
    };

    if (config.appsScriptUrl) {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({ sheet: 'analytics', row: payload }),
        headers: { 'Content-Type': 'application/json' }
      });

      seenErrors.add(errorKey);
      // Prevent Set memory leak
      if (seenErrors.size > ERROR_LOG_LIMIT) {
        const first = seenErrors.values().next().value;
        seenErrors.delete(first);
      }
    }
  } catch (e) {
    // Fail silently to avoid recursion/infinite loops
  }
};