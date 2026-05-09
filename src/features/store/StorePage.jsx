import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useURLState } from '../../hooks/useURLState';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { PartGridSkeleton } from '../../components/ui/skeletons/PartCardSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { SectionErrorBoundary } from '../../errors/SectionErrorBoundary';
import { PartCard } from './PartCard';
import { StoreFilters } from './StoreFilters';
import { CartDrawer } from './CartDrawer';
import { SEOHead } from '../../components/shared/SEOHead';
import { SlidersHorizontal, Search, PackageX } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StorePage = () => {
    const location = useLocation();
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // URL State Filters
    const [q, setQ] = useURLState('q', '');
    const [models, setModels] = useURLState('model', []);
    const [categories, setCategories] = useURLState('category', []);
    const [min, setMin] = useURLState('min', 0);
    const [max, setMax] = useURLState('max', Infinity);
    const [inStock, setInStock] = useURLState('inStock', false);
    const [featured, setFeatured] = useURLState('featured', false);
    const [sort, setSort] = useURLState('sort', 'relevance');

    const debouncedQ = useDebounce(q, 300);

    // Bundle filters for the child component
    const filters = {
        q, model: models, category: categories, min, max, inStock, featured, sort
    };

    const setFilters = (newFilters) => {
        if (typeof newFilters === 'function') newFilters = newFilters(filters);
        if (newFilters.q !== undefined) setQ(newFilters.q);
        if (newFilters.model !== undefined) setModels(newFilters.model);
        if (newFilters.category !== undefined) setCategories(newFilters.category);
        if (newFilters.min !== undefined) setMin(newFilters.min);
        if (newFilters.max !== undefined) setMax(newFilters.max);
        if (newFilters.inStock !== undefined) setInStock(newFilters.inStock);
        if (newFilters.featured !== undefined) setFeatured(newFilters.featured);
        if (newFilters.sort !== undefined) setSort(newFilters.sort);
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('parts');
                if (!cancelled) setParts(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('cart') === 'open') {
            setIsCartOpen(true);
            // remove cart=open from url without triggering navigation
            searchParams.delete('cart');
            const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
            window.history.replaceState({}, '', newUrl);
        }
    }, [location]);

    // Derived metadata for filters
    const { availableModels, availableCategories } = useMemo(() => {
        const mods = new Set();
        const cats = new Set();
        parts.forEach(p => {
            if (p.model) p.model.split(',').forEach(m => mods.add(m.trim()));
            if (p.category) cats.add(p.category.trim());
        });
        return {
            availableModels: Array.from(mods).sort(),
            availableCategories: Array.from(cats).sort()
        };
    }, [parts]);

    // Filtering Pipeline
    const filteredParts = useMemo(() => {
        let result = [...parts];

        // 1. Search
        if (debouncedQ) {
            const query = debouncedQ.toLowerCase();
            result = result.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.code && p.code.toLowerCase().includes(query)) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        // 2. Models
        if (models.length > 0) {
            result = result.filter(p => {
                if (!p.model) return false;
                const pModels = p.model.split(',').map(m => m.trim());
                return models.some(m => pModels.includes(m));
            });
        }

        // 3. Categories
        if (categories.length > 0) {
            result = result.filter(p => categories.includes(p.category?.trim()));
        }

        // 4. Price
        if (min > 0 || max < Infinity) {
            result = result.filter(p => {
                const price = Number(p.price);
                return price >= min && price <= max;
            });
        }

        // 5. Flags
        if (inStock) {
            result = result.filter(p => Number(p.stock) > 0);
        }
        if (featured) {
            result = result.filter(p => String(p.featured).toLowerCase() === 'true');
        }

        // 6. Sorting
        switch (sort) {
            case 'price_asc': result.sort((a, b) => Number(a.price) - Number(b.price)); break;
            case 'price_desc': result.sort((a, b) => Number(b.price) - Number(a.price)); break;
            case 'name_asc': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
            default: break; // relevance / default order
        }

        return result;
    }, [parts, debouncedQ, models, categories, min, max, inStock, featured, sort]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row gap-8">
            <SEOHead title="Genuine Parts Store" description="Shop genuine Ampere EV spare parts and accessories." />
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 sticky top-24 self-start h-[calc(100vh-8rem)]">
                <StoreFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    availableModels={availableModels} 
                    availableCategories={availableCategories}
                    totalResults={filteredParts.length}
                />
            </aside>

            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 transition-transform duration-300 transform ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                    <StoreFilters 
                        filters={filters} 
                        setFilters={setFilters} 
                        availableModels={availableModels} 
                        availableCategories={availableCategories}
                        totalResults={filteredParts.length}
                    />
                    {/* Hidden close button referenced by ID in StoreFilters */}
                    <button id="mobile-filter-drawer-close" className="hidden" onClick={() => setIsMobileFilterOpen(false)}></button>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/5" onClick={() => setIsMobileFilterOpen(false)}></div>
            </div>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Parts Store</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Showing {filteredParts.length} genuine items</p>
                    </div>

                    <div className="flex gap-2">
                        {/* Mobile Search/Filter triggers */}
                        <div className="relative flex-1 md:hidden">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Button 
                            variant="secondary" 
                            className="md:hidden shrink-0 px-3"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </Button>

                        {/* Desktop Search & Sort */}
                        <div className="hidden md:flex gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search parts by name or code..."
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
                                />
                            </div>
                            <select 
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-shadow"
                            >
                                <option value="relevance">Sort: Relevance</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                <SectionErrorBoundary>
                    <SkeletonTransition 
                        loading={loading} 
                        skeleton={<PartGridSkeleton count={8} />}
                    >
                        {error ? (
                            <ErrorState message="Failed to load store inventory. Please refresh." onRetry={() => window.location.reload()} />
                        ) : filteredParts.length === 0 ? (
                            <EmptyState 
                                icon={<PackageX className="w-12 h-12" />}
                                title="No parts found"
                                description="Try adjusting your filters or search query."
                                actionLabel="Clear Filters"
                                onAction={() => setFilters({ q: '', model: [], category: [], min: 0, max: Infinity, inStock: false, featured: false, sort: 'relevance' })}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20">
                                {filteredParts.map(part => (
                                    <PartCard key={part.id} part={part} />
                                ))}
                            </div>
                        )}
                    </SkeletonTransition>
                </SectionErrorBoundary>
            </main>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};