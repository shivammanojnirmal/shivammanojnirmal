import React, { useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StoreFilters = ({ filters, setFilters, availableModels, availableCategories, totalResults }) => {

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayFilter = (key, value) => {
        setFilters(prev => {
            const arr = prev[key] || [];
            return {
                ...prev,
                [key]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
            };
        });
    };

    const hasActiveFilters = useMemo(() => {
        return filters.model.length > 0 || 
               filters.category.length > 0 || 
               filters.inStock || 
               filters.featured ||
               filters.min > 0 ||
               filters.max < Infinity;
    }, [filters]);

    const clearFilters = () => {
        setFilters({
            q: filters.q, // Keep search query
            model: [],
            category: [],
            min: 0,
            max: Infinity,
            inStock: false,
            featured: false,
            sort: 'relevance'
        });
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 sm:bg-transparent sm:dark:bg-transparent">
            <div className="p-4 sm:p-0 border-b border-slate-100 dark:border-slate-700/50 sm:border-none flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-2 text-primary-500" />
                    Filters
                </h3>
                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="p-4 sm:p-0 space-y-6 flex-1 overflow-y-auto">
                {/* Search */}
                <div className="sm:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search parts..."
                            value={filters.q}
                            onChange={(e) => updateFilter('q', e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {/* Sort (Mobile mainly, desktop has it above grid) */}
                <div className="sm:hidden">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                    <select 
                        value={filters.sort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A to Z</option>
                    </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                checked={filters.inStock} 
                                onChange={(e) => updateFilter('inStock', e.target.checked)}
                                className="peer sr-only" 
                            />
                            <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer-checked:bg-primary-500 transition-colors"></div>
                            <div className="absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">In Stock Only</span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                checked={filters.featured} 
                                onChange={(e) => updateFilter('featured', e.target.checked)}
                                className="peer sr-only" 
                            />
                            <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer-checked:bg-primary-500 transition-colors"></div>
                            <div className="absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Featured Items</span>
                    </label>
                </div>

                {/* Categories */}
                {availableCategories.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Categories</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {availableCategories.map(cat => (
                                <label key={cat} className="flex items-center cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.category.includes(cat)}
                                        onChange={() => toggleArrayFilter('category', cat)}
                                        className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-600"
                                    />
                                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Models */}
                {availableModels.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Compatible Models</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {availableModels.map(model => (
                                <label key={model} className="flex items-center cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.model.includes(model)}
                                        onChange={() => toggleArrayFilter('model', model)}
                                        className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-600"
                                    />
                                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{model}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Price Range (Simple inputs for now) */}
                <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.min || ''} 
                                onChange={(e) => updateFilter('min', e.target.value ? Number(e.target.value) : 0)}
                                className="w-full pl-7 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <span className="text-slate-400">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={filters.max === Infinity ? '' : filters.max} 
                                onChange={(e) => updateFilter('max', e.target.value ? Number(e.target.value) : Infinity)}
                                className="w-full pl-7 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 sm:hidden">
                <Button className="w-full" onClick={() => document.getElementById('mobile-filter-drawer-close')?.click()}>
                    Show {totalResults} Results
                </Button>
            </div>
        </div>
    );
};