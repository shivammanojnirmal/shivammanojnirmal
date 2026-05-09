import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { ClipboardCheck, Phone, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('claims');
                setClaims((data || []).sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted)));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'Updating claim...',
                success: 'Claim status updated',
                error: 'Failed to update'
            }
        );
        setClaims(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : b));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2 text-primary-500" />
                Warranty Claims
            </h1>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={8} cols={5} />}>
                {error ? (
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                ) : claims.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500">No warranty claims found.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                    <tr>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Vehicle & Issue</th>
                                        <th className="p-4">Submitted</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {claims.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                                            <td className="p-4">
                                                <div className="font-bold">{item.name}</div>
                                                <a href={`tel:${item.phone}`} className="text-xs text-primary-600 flex items-center mt-0.5">
                                                    <Phone className="w-3 h-3 mr-1" /> {item.phone}
                                                </a>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{item.vehicle}</div>
                                                <p className="text-xs text-slate-500 line-clamp-1">{item.issue}</p>
                                            </td>
                                            <td className="p-4 text-xs text-slate-500">
                                                <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" /> {formatRelativeTime(item.date_submitted)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <select 
                                                    value={item.status || 'pending'}
                                                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                                    className={`text-[10px] font-bold uppercase rounded-full px-2 py-1 border-none ${
                                                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => window.open(`https://wa.me/${item.phone}`, '_blank')} className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">Update &rarr;</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </SkeletonTransition>
        </div>
    );
};