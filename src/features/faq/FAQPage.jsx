import React, { useState, useMemo } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ faq, isOpen, onToggle }) => {
    return (
        <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            <button 
                onClick={onToggle}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary-600' : 'text-slate-900 dark:text-white group-hover:text-primary-500'}`}>
                    {faq.question}
                </span>
                <div className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);

    const [q, setQ] = useURLState('q', '');
    const [activeCategory, setActiveCategory] = useURLState('category', 'all');
    
    const debouncedQ = useDebounce(q, 300);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('faq');
                setFaqs(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(faqs.map(f => f.category).filter(Boolean));
        return ['all', ...Array.from(cats).sort()];
    }, [faqs]);

    const filteredFaqs = useMemo(() => {
        return faqs.filter(f => {
            const matchesQ = !debouncedQ || 
                f.question?.toLowerCase().includes(debouncedQ.toLowerCase()) || 
                f.answer?.toLowerCase().includes(debouncedQ.toLowerCase());
            
            const matchesCat = activeCategory === 'all' || f.category === activeCategory;

            return matchesQ && matchesCat && String(f.visible).toLowerCase() === 'true';
        });
    }, [faqs, debouncedQ, activeCategory]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <SEOHead title="FAQ" description="Frequently asked questions about Ampere electric vehicles, service, and charging." />
            
            <SectionHeader 
                title="Common Questions" 
                subtitle="Everything you need to know about EV ownership, maintenance, and charging."
                centered
            />

            <div className="space-y-8 mb-12">
                {/* Search & Category Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search keywords..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-sm outline-none transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                activeCategory === cat 
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <SkeletonTransition loading={loading} skeleton={<div className="space-y-4">{Array.from({length: 6}).map((_, i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}</div>}>
                {error ? (
                    <ErrorState message="Failed to load FAQs" onRetry={() => window.location.reload()} />
                ) : filteredFaqs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No questions found matching your search.</p>
                        <button onClick={() => setQ('')} className="mt-4 text-primary-600 font-bold">Clear Search</button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                        {filteredFaqs.map((faq, index) => (
                            <FAQItem 
                                key={faq.id || index} 
                                faq={faq} 
                                isOpen={openIndex === index} 
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                )}
            </SkeletonTransition>

            <div className="mt-16 bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-8 text-center border border-primary-100 dark:border-primary-900/30">
                <MessageSquare className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Our experts are happy to help you with anything else you need.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}`, '_blank')}
                        className="px-8 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Chat with us
                    </button>
                </div>
            </div>
        </div>
    );
};