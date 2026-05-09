import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSheetData('testimonials');
                setTestimonials(data.filter(t => String(t.visible).toLowerCase() === 'true'));
            } catch (e) { /* silent fail */ }
        };
        load();
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    if (testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader centered title="What Our Community Says" subtitle="Join thousands of happy Ampere owners who have switched to sustainable mobility with JMD Auto Care." />
                
                <div className="relative mt-16 max-w-4xl mx-auto">
                    <Quote className="absolute -top-10 -left-10 w-24 h-24 text-slate-100 dark:text-slate-900 -z-0" />
                    
                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="border-none shadow-none bg-transparent">
                                    <CardBody className="p-0 text-center">
                                        <div className="flex justify-center text-amber-400 mb-6 gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-6 h-6 ${i < Number(current.rating) ? 'fill-current' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white leading-tight mb-8">
                                            "{current.message}"
                                        </p>
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl mb-4 uppercase">
                                                {current.name.charAt(0)}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{current.name}</h4>
                                            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{current.vehicle} Owner</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button onClick={prev} className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={next} className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-primary-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};