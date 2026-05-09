import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';

export const OfferBanner = ({ offer, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
    }, [offer]);

    if (!offer || !isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-primary-600 text-white overflow-hidden print-hide"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
                        <div className="flex items-center flex-1 justify-center min-w-0">
                            <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                            <p className="text-xs sm:text-sm font-medium truncate">
                                <span className="hidden sm:inline">Limited Time Offer: </span>
                                {offer.title} - Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{offer.code}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="ml-4 flex-shrink-0 p-1 hover:bg-primary-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Dismiss offer"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};