import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { SectionErrorBoundary } from '../../errors/SectionErrorBoundary';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/shared/SEOHead';
import { WhatsAppButton } from '../../components/shared/WhatsAppButton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Copy, Check, Tag, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OfferCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-6"></div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-full mb-4"></div>
        <div className="flex gap-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1"></div>
        </div>
    </div>
);

const OfferCard = ({ offer, isExpired }) => {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(offer.code);
        setCopied(true);
        toast.success('Coupon code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUse = () => {
        handleCopy();
        if (offer.applicable_to === 'service') {
            navigate('/booking');
        } else {
            navigate('/store?cart=open');
        }
    };

    const isExpiringSoon = !isExpired && offer.valid_until && 
        (new Date(offer.valid_until) - new Date()) / (1000 * 60 * 60 * 24) <= 3;

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border relative overflow-hidden transition-all ${isExpired ? 'border-slate-200 dark:border-slate-700 opacity-60 grayscale' : 'border-primary-100 dark:border-primary-900/50 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700'}`}>
            {isExpired && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider dark:bg-slate-700 dark:text-slate-400">
                    Expired
                </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Tag className={`w-5 h-5 mr-2 ${isExpired ? 'text-slate-400' : 'text-primary-500'}`} />
                    {offer.title}
                </h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-4">{offer.description}</p>
            
            <div className="space-y-2 mb-6">
                {offer.min_order_value > 0 && (
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Min. Order: {formatCurrency(offer.min_order_value)}
                    </div>
                )}
                {offer.valid_until && (
                    <div className={`text-sm font-medium flex items-center ${isExpiringSoon ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        <Clock className="w-4 h-4 mr-1.5" />
                        Valid until: {formatDate(offer.valid_until)}
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-sm font-mono">Code:</span>
                    </div>
                    <input 
                        type="text" 
                        readOnly 
                        value={offer.code} 
                        className={`w-full pl-14 pr-12 py-3 rounded-lg border-2 border-dashed bg-slate-50 dark:bg-slate-900 font-mono font-bold text-lg text-slate-900 dark:text-white text-center ${isExpired ? 'border-slate-200 dark:border-slate-700' : 'border-primary-300 dark:border-primary-700 focus:border-primary-500 outline-none'}`}
                    />
                    <button 
                        onClick={handleCopy}
                        disabled={isExpired}
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isExpired ? 'cursor-not-allowed' : 'cursor-pointer hover:text-primary-600 dark:hover:text-primary-400'} text-slate-400 transition-colors`}
                        aria-label="Copy code"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
                {!isExpired && (
                    <Button onClick={handleUse} className="w-full sm:w-auto shrink-0">
                        Use Offer
                    </Button>
                )}
            </div>
        </div>
    );
};

export const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExpired, setShowExpired] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const loadOffers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchSheetData('offers');
                if (!cancelled) setOffers(data || []);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        loadOffers();
        return () => { cancelled = true; };
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeOffers = offers.filter(o => {
        if (String(o.active).toLowerCase() !== 'true') return false;
        if (o.valid_until && new Date(o.valid_until) < today) return false;
        if (o.valid_from && new Date(o.valid_from) > today) return false;
        if (Number(o.usage_limit) > 0 && Number(o.times_used) >= Number(o.usage_limit)) return false;
        return true;
    });

    const expiredOffers = offers.filter(o => {
        return (o.valid_until && new Date(o.valid_until) < today) || 
               (Number(o.usage_limit) > 0 && Number(o.times_used) >= Number(o.usage_limit)) ||
               String(o.active).toLowerCase() === 'false';
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SEOHead title="Offers & Coupons" description="Check out the latest offers, discounts, and coupon codes at Jai Mata Di Auto Care." />
            
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Special Offers
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Save on genuine spare parts, accessories, and expert service with our exclusive deals.
                </p>
            </div>

            <SectionErrorBoundary>
                <SkeletonTransition 
                    loading={loading} 
                    skeleton={
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OfferCardSkeleton /><OfferCardSkeleton />
                        </div>
                    }
                >
                    {error ? (
                        <ErrorState message="Failed to load offers. Please try again later." onRetry={() => window.location.reload()} />
                    ) : activeOffers.length === 0 ? (
                        <EmptyState 
                            icon={<Tag className="w-8 h-8" />}
                            title="No active offers right now"
                            description="We don't have any special deals at the moment. Follow us on WhatsApp for exclusive updates and future discounts."
                            actionLabel="Chat on WhatsApp"
                            onAction={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}`, '_blank')}
                        />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                            {activeOffers.map(offer => (
                                <OfferCard key={offer.id || offer.code} offer={offer} isExpired={false} />
                            ))}
                        </div>
                    )}
                </SkeletonTransition>
            </SectionErrorBoundary>

            {/* Expired Offers Section */}
            {!loading && !error && expiredOffers.length > 0 && (
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setShowExpired(!showExpired)}
                        className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center mx-auto mb-6"
                    >
                        {showExpired ? 'Hide Expired Offers' : 'Show Expired Offers'}
                    </button>

                    <AnimatePresence>
                        {showExpired && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                                    {expiredOffers.map(offer => (
                                        <OfferCard key={offer.id || offer.code} offer={offer} isExpired={true} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};