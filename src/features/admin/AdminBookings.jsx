import React, { useState, useEffect } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRelativeTime, formatDate } from '../../utils/formatters';
import { Search, Filter, Download, Phone, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL Filters
    const [q, setQ] = useURLState('q', '');
    const [status, setStatus] = useURLState('status', 'all');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('bookings');
                // Sort by date submitted descending
                setBookings((data || []).sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted)));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredBookings = bookings.filter(b => {
        const matchesQ = !q || 
            (b.name && b.name.toLowerCase().includes(q.toLowerCase())) ||
            (b.phone && b.phone.includes(q)) ||
            (b.vehicle && b.vehicle.toLowerCase().includes(q.toLowerCase()));
        
        const matchesStatus = status === 'all' || b.status?.toLowerCase() === status.toLowerCase();

        return matchesQ && matchesStatus;
    });

    const handleUpdateStatus = async (id, newStatus) => {
        toast.promise(
            // We'd call an Apps Script update here in a real env
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Updating status...',
                success: 'Status updated successfully',
                error: 'Failed to update status'
            }
        );
        // Optimistic UI update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search customer, phone..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>}>
                    Export CSV
                </Button>
            </div>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={8} cols={5} />}>
                {error ? (
                    <ErrorState message="Failed to load bookings" onRetry={() => window.location.reload()} />
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-700">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No bookings match your criteria.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Customer Details</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Vehicle & Service</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Date & Time</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredBookings.map(b => (
                                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                                                    <a href={`tel:${b.phone}`} className="text-xs text-primary-600 flex items-center mt-1">
                                                        <Phone className="w-3 h-3 mr-1" /> {b.phone}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{b.vehicle}</span>
                                                    <span className="text-xs text-slate-500">{b.service_type}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{formatDate(b.preferred_date)}</span>
                                                    <span className="text-slate-500 italic mt-0.5">Submitted {formatRelativeTime(b.date_submitted)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <select 
                                                    value={b.status || 'pending'}
                                                    onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                                                    className={`text-[10px] font-bold uppercase rounded-full px-2 py-1 border-none focus:ring-2 focus:ring-primary-500 ${
                                                        b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                        b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <a 
                                                    href={`https://wa.me/${b.phone}?text=${encodeURIComponent(`Hi ${b.name}, this is Jai Mata Di Auto Care regarding your booking for ${b.vehicle}...`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-colors"
                                                    title="Contact via WhatsApp"
                                                >
                                                    <MessageSquareIcon className="w-4 h-4" />
                                                </a>
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

const MessageSquareIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);