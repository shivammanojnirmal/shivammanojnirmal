import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wrapper component that handles smooth transitions from Skeleton to real content
 */
export const SkeletonTransition = ({ 
    loading, 
    skeleton, 
    children, 
    minDisplayMs = 400,
    className = ''
}) => {
    const [shouldShowSkeleton, setShouldShowSkeleton] = useState(loading);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        if (loading) {
            setShouldShowSkeleton(true);
        } else {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayMs - elapsed);

            if (remainingTime > 0) {
                const timer = setTimeout(() => {
                    setShouldShowSkeleton(false);
                }, remainingTime);
                return () => clearTimeout(timer);
            } else {
                setShouldShowSkeleton(false);
            }
        }
    }, [loading, startTime, minDisplayMs]);

    return (
        <div className={`relative ${className}`}>
            <AnimatePresence mode="wait">
                {shouldShowSkeleton ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {skeleton}
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};