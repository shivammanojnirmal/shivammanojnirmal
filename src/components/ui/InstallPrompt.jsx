import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';
import { Button } from '../ui/Button';

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Wait 5 seconds before showing
            setTimeout(() => setIsVisible(true), 5000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-6 left-6 sm:left-auto sm:w-80 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 print-hide"
                >
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-primary-600/20">
                            JM
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Install Our App</h4>
                            <p className="text-xs text-slate-500 leading-tight">Get a faster experience and offline access to inventory.</p>
                        </div>
                    </div>

                    <Button className="w-full" size="sm" onClick={handleInstall} leftIcon={<Download className="w-4 h-4"/>}>
                        Add to Home Screen
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};