import React from 'react';

export const Spinner = ({ size = 'md', className = '', color = 'primary' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    const colors = {
        primary: 'border-primary-200 border-t-primary-600 dark:border-primary-900 dark:border-t-primary-500',
        white: 'border-white/30 border-t-white',
        slate: 'border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-400'
    };

    return (
        <div className={`inline-block animate-spin rounded-full ${sizes[size]} ${colors[color]} ${className}`} />
    );
};