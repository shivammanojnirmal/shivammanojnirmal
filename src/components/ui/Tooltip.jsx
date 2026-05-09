import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ children, content, position = 'top', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const getPositionStyles = () => {
        switch (position) {
            case 'bottom': return 'top-full mt-2 left-1/2 -translate-x-1/2';
            case 'left': return 'right-full mr-2 top-1/2 -translate-y-1/2';
            case 'right': return 'left-full ml-2 top-1/2 -translate-y-1/2';
            case 'top': default: return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
        }
    };

    return (
        <div 
            className="relative inline-flex"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded shadow-sm whitespace-nowrap pointer-events-none ${getPositionStyles()} ${className}`}
                        role="tooltip"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};