import React from 'react';
import { reportError } from './errorReporter';

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    reportError(error, { type: 'global_boundary', errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark p-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
            We encountered an unexpected error. Please reload the app or contact support if the problem persists.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Reload App
            </button>
            <a 
              href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#20bd5a] transition-colors"
            >
              Contact Support
            </a>
          </div>
          {process.env.NODE_ENV !== 'production' && (
            <details className="mt-8 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg w-full max-w-2xl overflow-auto">
              <summary className="text-red-600 dark:text-red-400 font-medium cursor-pointer">Error Details</summary>
              <pre className="mt-4 text-sm text-red-800 dark:text-red-300">{this.state.error?.stack}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}