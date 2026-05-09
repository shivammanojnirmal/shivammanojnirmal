import React from 'react';

const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 border border-transparent',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-transparent dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
    outline: 'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-400 dark:border-primary-500 dark:hover:bg-primary-900/30',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border border-transparent'
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-base font-medium',
    lg: 'px-6 py-3 text-lg font-semibold',
    icon: 'p-2'
};

export const Button = React.forwardRef(({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    isLoading = false, 
    disabled = false, 
    leftIcon, 
    rightIcon,
    ...props 
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed';
    
    return (
        <button
            ref={ref}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
});

Button.displayName = 'Button';