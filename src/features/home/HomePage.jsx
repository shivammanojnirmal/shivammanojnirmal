import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturedParts } from './FeaturedParts';
import { VehiclePreview } from './VehiclePreview';
import { TestimonialsSection } from './TestimonialsSection';
import { SEOHead } from '../../components/shared/SEOHead';
import { QuickActions } from '../../components/shared/QuickActions';

export const HomePage = () => {
    return (
        <div className="w-full">
            <SEOHead />
            
            <HeroSection />
            
            {/* Action Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 pb-12">
                <QuickActions className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50" />
            </div>

            <VehiclePreview />
            
            <FeaturedParts />
            
            <TestimonialsSection />

            {/* Final CTA */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.1),transparent_70%)]" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
                        Ready to Join the Revolution?
                    </h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Visit our showroom in Loni Kh. today for a test drive and experience the Ampere difference yourself.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => window.location.href = '/booking'}
                            className="px-10 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl hover:bg-primary-700 transition-all scale-105 hover:scale-110 active:scale-100"
                        >
                            Book a Test Drive
                        </button>
                        <button 
                            onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}`, '_blank')}
                            className="px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-slate-50 transition-all"
                        >
                            Talk to an Expert
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};