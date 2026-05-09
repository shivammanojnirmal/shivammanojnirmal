import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from '../shared/WhatsAppButton';
import { OfflineBanner } from '../ui/OfflineBanner';

export const PageWrapper = ({ children }) => {
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    // Admin routes don't use standard layout
    if (pathname.startsWith('/admin')) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                <OfflineBanner />
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-x-hidden selection:bg-primary-200 dark:selection:bg-primary-900/50">
            <OfflineBanner />
            <Navbar />
            
            <main className="flex-1 w-full pt-16">
                {/* 
                  pt-16 compensates for fixed navbar height.
                  The content is allowed to span full width, max-width constraints 
                  are handled by individual pages/sections 
                */}
                {children}
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
};