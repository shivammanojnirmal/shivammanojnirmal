import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import { Star, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('reviews');
                setReviews((data || []).sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted)));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleApprove = async (id, currentApproved) => {
        const newStatus = String(currentApproved).toLowerCase() === 'true' ? 'false' : 'true';
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'Updating review...',
                success: 'Review visibility toggled',
                error: 'Update failed'
            }
        );
        setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: newStatus } : r));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-amber-500" />
                Customer Reviews
            </h1>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={10} cols={5} />}>
                {error ? (
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500">No reviews found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map(item => {
                            const isApproved = String(item.approved).toLowerCase() === 'true';
                            
                            return (
                                <Card key={item.id} className={`overflow-hidden transition-all ${!isApproved ? 'opacity-70 grayscale' : ''}`}>
                                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex text-amber-400">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < Number(item.rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400">{formatDate(item.date_submitted)}</span>
                                            </div>
                                            <h3 className="font-bold flex items-center">
                                                <User className="w-4 h-4 mr-2 text-slate-400" /> {item.name} 
                                                <span className="ml-2 text-xs font-normal text-slate-500">on {item.vehicle}</span>
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">"{item.message}"</p>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Visibility</span>
                                                <button 
                                                    onClick={() => handleApprove(item.id, item.approved)}
                                                    className={`p-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${isApproved ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {isApproved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    {isApproved ? 'Approved' : 'Pending'}
                                                </button>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </SkeletonTransition>
        </div>
    );
};