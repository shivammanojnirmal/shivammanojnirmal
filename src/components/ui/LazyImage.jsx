import React, { useState, useEffect } from 'react';

/**
 * High-performance lazy loading image component with a premium SVG placeholder
 */
export const LazyImage = ({ 
    src, 
    alt, 
    className = '', 
    placeholderClassName = 'bg-slate-100 dark:bg-slate-800',
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setError(false);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {(!isLoaded || error) && (
                <div className={`absolute inset-0 ${placeholderClassName} flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 animate-pulse`}>
                    <svg className="w-1/3 h-1/3 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">JMD Auto Care</span>
                </div>
            )}
            
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded && !error ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setIsLoaded(true);
                }}
                loading="lazy"
                {...props}
            />
        </div>
    );
};