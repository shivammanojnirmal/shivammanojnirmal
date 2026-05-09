import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProgressBar = ({ progress, className = '', colorClass = 'bg-primary-600' }) => {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${className}`}>
            <motion.div
                className={`h-full rounded-full ${colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin="0"
                aria-valuemax="100"
            />
        </div>
    );
};