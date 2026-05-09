import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(14,165,233,0.15),transparent_50%)]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]" />
                
                {/* Abstract Line Art Pattern */}
                <svg className="absolute right-0 top-0 h-full w-1/2 text-slate-800/50" fill="none" viewBox="0 0 400 800">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="400" height="800" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center lg:text-left space-y-8"
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-[0.2em]">
                            <Zap className="w-3 h-3 mr-2" />
                            Authorized Ampere Dealership
                        </div>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                            The Future is <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-500">Electric.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
                            Experience the silent revolution. From powerful daily commutes to eco-friendly campus rides, we bring you the complete Ampere lineup with authorized service and genuine parts support.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary-600/20" onClick={() => navigate('/vehicles')}>
                                Explore Fleet
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-slate-700 text-white hover:bg-slate-800" onClick={() => navigate('/booking')}>
                                Book Service
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-800">
                            {[
                                { label: 'Range', val: '120km+' },
                                { label: 'Warranty', val: '3 Yrs' },
                                { label: 'Charging', val: '4 Hrs' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold text-white">{stat.val}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Area with Decorative Glow */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="relative bg-gradient-to-tr from-slate-800 to-slate-900 rounded-[2rem] p-4 shadow-2xl border border-slate-700/50">
                             {/* Mock Hero Image Placeholder */}
                            <div className="aspect-[4/3] rounded-[1.5rem] bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-700">
                                <img src="/images/hero/hero_main.jpg" alt="Ampere Magnus" className="w-full h-full object-cover opacity-80" onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }} />
                                <div className="hidden flex-col items-center text-slate-600">
                                    <Zap className="w-20 h-20 mb-4" />
                                    <span className="font-black text-2xl uppercase tracking-widest">Ampere EV</span>
                                </div>
                            </div>
                            
                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 max-w-xs">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Certified Support</p>
                                    <p className="text-xs text-slate-500">100% Authorized Service Center</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};