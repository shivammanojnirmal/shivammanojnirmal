import React from 'react';
import { motion } from 'framer-motion';

export const StepIndicator = ({ current, total, className = '' }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {Array.from({ length: total }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === current;
                const isCompleted = stepNumber < current;

                return (
                    <div key={stepNumber} className="flex items-center">
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: isCompleted || isActive 
                                    ? 'var(--tw-colors-primary-600)' 
                                    : 'var(--tw-colors-slate-200)',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                                !isActive && !isCompleted ? 'dark:bg-slate-700' : ''
                            }`}
                            aria-label={`Step ${stepNumber} of ${total}`}
                            aria-current={isActive ? 'step' : undefined}
                        />
                        {index < total - 1 && (
                            <div className="w-4 sm:w-8 h-[2px] mx-1 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                <motion.div 
                                    initial={false}
                                    animate={{ x: isCompleted ? '0%' : '-100%' }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-primary-600 origin-left"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};