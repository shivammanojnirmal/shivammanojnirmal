import React from 'react';

export const SectionHeader = ({ title, subtitle, className = '', centered = false }) => {
    return (
        <div className={`mb-8 ${centered ? 'text-center flex flex-col items-center' : ''} ${className}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                    {subtitle}
                </p>
            )}
        </div>
    );
};