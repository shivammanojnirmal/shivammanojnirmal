import React, { useState, useEffect } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { fetchSheetData, submitToSheet } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Search, Package, Save, AlertTriangle, ArrowUpDown, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingId, setSavingId] = useState(null);

    const [q, setQ] = useURLState('q', '');
    const [filter, setFilter] = useURLState('filter', 'all'); // all, low, out

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('inventory');
                setInventory(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredInventory = inventory.filter(item => {
        const matchesQ = !q || 
            item.part_name?.toLowerCase().includes(q.toLowerCase()) || 
            item.part_code?.toLowerCase().includes(q.toLowerCase()) ||
            item.model?.toLowerCase().includes(q.toLowerCase());
        
        const qty = Number(item.stock_qty) || 0;
        const reorder = Number(item.reorder_level) || 0;
        
        if (filter === 'out') return matchesQ && qty === 0;
        if (filter === 'low') return matchesQ && qty > 0 && qty <= reorder;
        return matchesQ;
    });

    const handleUpdateStock = async (id, newQty) => {
        setSavingId(id);
        try {
            // In a real env, we find the rowIndex and send to Apps Script
            // rowIndex is usually id - 1 if id is serial, or we look it up
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API
            
            setInventory(prev => prev.map(item => 
                item.id === id ? { ...item, stock_qty: newQty, last_updated: new Date().toISOString() } : item
            ));
            toast.success('Stock updated');
        } catch (err) {
            toast.error('Failed to update');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search code, name..." 
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        />
                    </div>
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3"
                    >
                        <option value="all">All Items</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(import.meta.env.VITE_SHEETS_BASE_URL, '_blank')} leftIcon={<ExternalLink className="w-4 h-4" />}>
                    Open Master Sheet
                </Button>
            </div>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={10} cols={6} />}>
                {error ? (
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                ) : filteredInventory.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                        <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500">No inventory items found.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                    <tr>
                                        <th className="p-4">Part Code</th>
                                        <th className="p-4">Name & Model</th>
                                        <th className="p-4">Stock Qty</th>
                                        <th className="p-4">Reorder</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredInventory.map(item => {
                                        const qty = Number(item.stock_qty);
                                        const reorder = Number(item.reorder_level);
                                        const isLow = qty > 0 && qty <= reorder;
                                        const isOut = qty === 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                                                <td className="p-4 font-mono font-medium">{item.part_code}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{item.part_name}</div>
                                                    <div className="text-xs text-slate-500">{item.model}</div>
                                                </td>
                                                <td className="p-4">
                                                    <input 
                                                        type="number"
                                                        defaultValue={item.stock_qty}
                                                        onBlur={(e) => {
                                                            const val = Number(e.target.value);
                                                            if (val !== qty) handleUpdateStock(item.id, val);
                                                        }}
                                                        className={`w-20 px-2 py-1 rounded border ${isOut ? 'border-red-300 bg-red-50 text-red-700' : isLow ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900'} focus:ring-2 focus:ring-primary-500 outline-none font-bold`}
                                                    />
                                                </td>
                                                <td className="p-4 text-slate-500">{item.reorder_level}</td>
                                                <td className="p-4">
                                                    {isOut ? <Badge variant="danger">Out</Badge> : 
                                                     isLow ? <Badge variant="warning">Low</Badge> : 
                                                     <Badge variant="success">OK</Badge>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {savingId === item.id ? (
                                                        <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full ml-auto" />
                                                    ) : (
                                                        <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </SkeletonTransition>
        </div>
    );
};