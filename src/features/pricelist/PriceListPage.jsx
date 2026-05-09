import React, { useState, useMemo, useEffect } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/shared/SEOHead';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { usePrint } from '../../hooks/usePrint';
import { PrintWrapper } from '../../components/ui/PrintWrapper';
import { Search, Printer, Download, ArrowUpDown, Tag } from 'lucide-react';
import { pdfExport } from '../../utils/pdfExport';
import toast from 'react-hot-toast';

export const PriceListPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { print } = usePrint();

    const [q, setQ] = useURLState('q', '');
    const [sort, setSort] = useURLState('sort', 'price_asc');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('vehicles');
                setVehicles(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredVehicles = useMemo(() => {
        let result = vehicles.filter(v => 
            !q || v.name?.toLowerCase().includes(q.toLowerCase()) || v.tier?.toLowerCase().includes(q.toLowerCase())
        );

        if (sort === 'price_asc') result.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sort === 'price_desc') result.sort((a, b) => Number(b.price) - Number(a.price));
        else if (sort === 'name_asc') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        return result;
    }, [vehicles, q, sort]);

    const handleDownloadPDF = async () => {
        try {
            await pdfExport.exportPriceList(filteredVehicles);
            toast.success('Price list downloaded!');
        } catch (e) {
            toast.error('Failed to generate PDF. Try printing instead.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <SEOHead title="Vehicle Price List" description="Latest prices for all Ampere electric vehicles at Jai Mata Di Auto Care." />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print-hide">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Vehicle Price List</h1>
                    <p className="text-slate-500 mt-1">Updated as of {formatDate(new Date().toISOString())}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadPDF} leftIcon={<Download className="w-4 h-4"/>}>Download PDF</Button>
                    <Button variant="secondary" size="sm" onClick={print} leftIcon={<Printer className="w-4 h-4"/>}>Print List</Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 print-hide">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search model..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                </div>
                <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 outline-none"
                >
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                </select>
            </div>

            <PrintWrapper>
                <SkeletonTransition loading={loading} skeleton={<div className="space-y-4">{Array.from({length: 8}).map((_, i) => <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />)}</div>}>
                    {error ? (
                        <ErrorState message="Failed to load price list" onRetry={() => window.location.reload()} />
                    ) : filteredVehicles.length === 0 ? (
                        <EmptyState title="No models found" />
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                        <tr>
                                            <th className="p-5">Model Name</th>
                                            <th className="p-5">Tier</th>
                                            <th className="p-5">Range (KM)</th>
                                            <th className="p-5 text-right font-black text-slate-900 dark:text-white">Showroom Price*</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                        {filteredVehicles.map((v, i) => (
                                            <tr key={v.slug || i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors group">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden print-hide">
                                                            {v.image && <img src={v.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white text-base">{v.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${v.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        {v.tier || 'Standard'}
                                                    </span>
                                                </td>
                                                <td className="p-5 font-medium text-slate-600 dark:text-slate-400">
                                                    {v.range_km ? `${v.range_km} km` : 'TBA'}
                                                </td>
                                                <td className="p-5 text-right">
                                                    <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(v.price)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400 font-medium italic border-t border-slate-100 dark:border-slate-800">
                                * Prices are Ex-Showroom Loni Kh. RTO, Insurance, and other charges are extra. Prices subject to change without prior notice.
                            </div>
                        </div>
                    )}
                </SkeletonTransition>
            </PrintWrapper>
        </div>
    );
};