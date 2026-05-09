import React from 'react';

/**
 * Primitive Skeleton component with Tailwind pulse animation
 */
export const Skeleton = ({ className = '', ...props }) => {
    return (
        <div 
            className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-md ${className}`} 
            {...props} 
        />
    );
};