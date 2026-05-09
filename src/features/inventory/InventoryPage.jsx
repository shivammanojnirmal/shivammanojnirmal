import React, { useState, useEffect, useMemo } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { InventorySkeleton } from '../../components/ui/skeletons/InventorySkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { SectionErrorBoundary } from '../../errors/SectionErrorBoundary';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Search, MapPin, Package, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // URL State Filters
    const [q, setQ] = useURLState('q', '');
    const [statusFilter, setStatusFilter] = useURLState('status', 'all');

    const debouncedQ = useDebounce(q, 300);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('inventory');
                if (!cancelled) setInventory(data || []);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const enrichedInventory = useMemo(() => {
        return inventory.map(item => {
            const qty = Number(item.stock_qty) || 0;
            const reorder = Number(item.reorder_level) || 0;
            let status = 'in';
            if (qty === 0) status = 'out';
            else if (qty <= reorder) status = 'low';
            
            return { ...item, _status: status, qty };
        });
    }, [inventory]);

    const filteredInventory = useMemo(() => {
        let result = enrichedInventory;

        if (debouncedQ) {
            const query = debouncedQ.toLowerCase();
            result = result.filter(item => 
                (item.part_name && item.part_name.toLowerCase().includes(query)) ||
                (item.part_code && item.part_code.toLowerCase().includes(query)) ||
                (item.model && item.model.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(item => item._status === statusFilter);
        }

        return result;
    }, [enrichedInventory, debouncedQ, statusFilter]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'in': return <Badge variant="success">In Stock</Badge>;
            case 'low': return <Badge variant="warning">Low Stock</Badge>;
            case 'out': return <Badge variant="danger">Out of Stock</Badge>;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SEOHead title="Inventory Tracker" description="Live availability of genuine Ampere EV spare parts." />
            
            <SectionHeader 
                title="Live Inventory Tracker" 
                subtitle="Check the availability of specific parts at our dealership before visiting."
            />

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by part name, code, or model..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'in', 'low', 'out'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                                statusFilter === status 
                                    ? 'bg-primary-600 text-white border-primary-600' 
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {status === 'all' ? 'All Items' : 
                             status === 'in' ? 'In Stock' : 
                             status === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </button>
                    ))}
                </div>
            </div>

            <SectionErrorBoundary>
                <SkeletonTransition loading={loading} skeleton={<InventorySkeleton />}>
                    {error ? (
                        <ErrorState message="Failed to load inventory data." onRetry={() => window.location.reload()} />
                    ) : filteredInventory.length === 0 ? (
                        <EmptyState 
                            icon={<Package className="w-12 h-12" />}
                            title="No parts found"
                            description="Try adjusting your search query or filters."
                        />
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                        <tr>
                                            <th className="p-4 font-medium tracking-wide">Code</th>
                                            <th className="p-4 font-medium tracking-wide">Part Name</th>
                                            <th className="p-4 font-medium tracking-wide">Model</th>
                                            <th className="p-4 font-medium tracking-wide hidden sm:table-cell">Updated</th>
                                            <th className="p-4 font-medium tracking-wide">Status</th>
                                            <th className="p-4 font-medium tracking-wide text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {filteredInventory.map(item => (
                                            <tr key={item.id || item.part_code} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 align-middle">
                                                    {item.part_code}
                                                </td>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white align-middle">
                                                    {item.part_name}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant="outline">{item.model}</Badge>
                                                </td>
                                                <td className="p-4 text-xs text-slate-500 hidden sm:table-cell align-middle">
                                                    {formatRelativeTime(item.last_updated) || 'Unknown'}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {getStatusBadge(item._status)}
                                                </td>
                                                <td className="p-4 text-right align-middle">
                                                    {item._status === 'out' ? (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                                            onClick={() => {
                                                                const msg = `I'm looking for part *${item.part_code}* — ${item.part_name} for ${item.model}.\nIs it available or when will it be restocked?`;
                                                                window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                                                            }}
                                                        >
                                                            Inquire
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => navigate(`/store?q=${encodeURIComponent(item.part_code)}`)}
                                                        >
                                                            Order
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </SkeletonTransition>
            </SectionErrorBoundary>
        </div>
    );
};