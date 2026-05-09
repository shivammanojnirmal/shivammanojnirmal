import React from 'react';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ 
    title = 'Something went wrong', 
    message = 'An error occurred while loading this content.',
    onRetry,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-red-100 dark:border-red-900/30 rounded-xl bg-red-50/50 dark:bg-red-900/10 ${className}`}>
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md">
                {message}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                    Try Again
                </Button>
            )}
        </div>
    );
};