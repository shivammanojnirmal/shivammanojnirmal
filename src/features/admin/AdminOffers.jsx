import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('offers');
                setOffers(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleToggleActive = async (id, currentStatus) => {
        const newStatus = String(currentStatus).toLowerCase() === 'true' ? 'false' : 'true';
        toast.promise(
            // Apps Script Update logic
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'Updating offer...',
                success: 'Status updated',
                error: 'Update failed'
            }
        );
        setOffers(prev => prev.map(o => o.id === id ? { ...o, active: newStatus } : o));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-primary-500" />
                    Offer Management
                </h1>
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Create New Offer</Button>
            </div>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={5} cols={5} />}>
                {error ? (
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {offers.map(offer => {
                            const isActive = String(offer.active).toLowerCase() === 'true';
                            const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();

                            return (
                                <div key={offer.id} className={`bg-white dark:bg-slate-800 rounded-xl p-5 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${!isActive ? 'opacity-60 grayscale' : 'hover:border-primary-200 dark:hover:border-primary-900/50'}`}>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-lg text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded uppercase">{offer.code}</span>
                                            {isExpired && <Badge variant="danger">Expired</Badge>}
                                            {!isActive && <Badge>Disabled</Badge>}
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{offer.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{offer.description}</p>
                                    </div>

                                    <div className="flex items-center gap-8 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Discount</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `₹${offer.discount_value}`}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Usage</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {offer.times_used} / {offer.usage_limit || '∞'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Valid Until</span>
                                            <span className="font-medium text-slate-600 dark:text-slate-300 flex items-center">
                                                <Calendar className="w-3.5 h-3.5 mr-1" />
                                                {offer.valid_until ? formatDate(offer.valid_until) : 'No Expiry'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                                        <button 
                                            onClick={() => handleToggleActive(offer.id, offer.active)}
                                            className={`p-2 rounded-lg transition-colors ${isActive ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                                            title={isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </SkeletonTransition>
        </div>
    );
};