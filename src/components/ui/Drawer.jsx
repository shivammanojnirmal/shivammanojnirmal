import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    position = 'right', // 'right', 'left', 'bottom'
    size = 'md', // 'sm', 'md', 'lg', 'full'
    className = ''
}) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    }

    const getPositionStyles = () => {
        switch (position) {
            case 'left': return 'inset-y-0 left-0';
            case 'bottom': return 'inset-x-0 bottom-0 rounded-t-2xl';
            case 'right': default: return 'inset-y-0 right-0';
        }
    };

    const getSizeStyles = () => {
        if (position === 'bottom') {
            switch (size) {
                case 'sm': return 'h-[30vh]';
                case 'lg': return 'h-[80vh]';
                case 'full': return 'h-[95vh]';
                case 'md': default: return 'h-[50vh]';
            }
        } else {
            switch (size) {
                case 'sm': return 'w-full sm:w-80';
                case 'lg': return 'w-full sm:w-[32rem]';
                case 'full': return 'w-full';
                case 'md': default: return 'w-full sm:w-96';
            }
        }
    };

    const getInitialAnimation = () => {
        switch (position) {
            case 'left': return { x: '-100%' };
            case 'bottom': return { y: '100%' };
            case 'right': default: return { x: '100%' };
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div 
                    ref={overlayRef}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={getInitialAnimation()}
                        animate={{ x: 0, y: 0 }}
                        exit={getInitialAnimation()}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`absolute bg-white dark:bg-slate-800 shadow-2xl flex flex-col ${getPositionStyles()} ${getSizeStyles()} ${className}`}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 shrink-0 bg-white dark:bg-slate-800 z-10">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 relative">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        modalRoot
    );
};