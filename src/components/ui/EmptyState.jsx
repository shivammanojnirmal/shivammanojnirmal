import React from 'react';
import { Button } from './Button';

export const EmptyState = ({ 
    title = 'No data found', 
    description = 'We couldn\'t find any records matching your criteria.',
    icon,
    actionLabel,
    onAction,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {icon && (
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};