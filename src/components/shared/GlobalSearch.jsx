import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Car, FileText, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSheetData } from '../../services/sheets';
import { useDebounce } from '../../hooks/useDebounce';

export const GlobalSearch = ({ isExpanded, setIsExpanded }) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 200);
    const [results, setResults] = useState({ vehicles: [], parts: [], faqs: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Data cache
    const [cache, setCache] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [vehicles, parts, faqs] = await Promise.all([
                    fetchSheetData('vehicles'),
                    fetchSheetData('parts'),
                    fetchSheetData('faq')
                ]);
                setCache({ vehicles, parts, faqs });
            } catch (e) {
                console.error("Global search prefetch failed", e);
            }
        };
        // Load data in background when search expands
        if (isExpanded && !cache) {
            loadData();
        }
    }, [isExpanded, cache]);

    useEffect(() => {
        if (!debouncedQuery.trim() || !cache) {
            setResults({ vehicles: [], parts: [], faqs: [] });
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const q = debouncedQuery.toLowerCase();

        // Very basic fuzzy match
        const searchWords = q.split(/\s+/).filter(w => w.length > 0);
        
        const matchItem = (item, fields) => {
            return searchWords.every(word => 
                fields.some(f => item[f] && String(item[f]).toLowerCase().includes(word))
            );
        };

        const matchedVehicles = cache.vehicles.filter(v => matchItem(v, ['name', 'tier', 'slug'])).slice(0, 3);
        const matchedParts = cache.parts.filter(p => matchItem(p, ['name', 'code', 'category', 'description'])).slice(0, 3);
        const matchedFaqs = cache.faqs.filter(f => matchItem(f, ['question', 'answer'])).slice(0, 3);

        setResults({ vehicles: matchedVehicles, parts: matchedParts, faqs: matchedFaqs });
        setIsSearching(false);
        setSelectedIndex(-1);
    }, [debouncedQuery, cache]);

    // Keyboard shortcut Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsExpanded(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsExpanded]);

    // Focus management
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        } else {
            setQuery('');
        }
    }, [isExpanded]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsExpanded(false);
            }
        };
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, setIsExpanded]);

    const getTotalResults = () => results.vehicles.length + results.parts.length + results.faqs.length;
    const flatResults = [
        ...results.vehicles.map(v => ({ ...v, _type: 'vehicle' })),
        ...results.parts.map(p => ({ ...p, _type: 'part' })),
        ...results.faqs.map(f => ({ ...f, _type: 'faq' }))
    ];

    const handleNavigate = (item) => {
        setIsExpanded(false);
        if (item._type === 'vehicle') navigate(`/vehicles/${item.slug}`);
        if (item._type === 'part') navigate(`/store?q=${encodeURIComponent(item.code || item.name)}`);
        if (item._type === 'faq') navigate(`/faq?q=${encodeURIComponent(item.question)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsExpanded(false);
            return;
        }

        const total = getTotalResults();
        if (total === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < total - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : total - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < total) {
                handleNavigate(flatResults[selectedIndex]);
            } else if (query.trim()) {
                // Default action on enter: go to store search
                setIsExpanded(false);
                navigate(`/store?q=${encodeURIComponent(query.trim())}`);
            }
        }
    };

    return (
        <div ref={containerRef} className={`relative flex items-center ${isExpanded ? 'w-full' : 'w-auto'}`}>
            <AnimatePresence initial={false}>
                {isExpanded ? (
                    <motion.div
                        initial={{ width: 40, opacity: 0 }}
                        animate={{ width: '100%', opacity: 1 }}
                        exit={{ width: 40, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full"
                        role="combobox"
                        aria-expanded={isExpanded}
                        aria-controls="search-results"
                        aria-haspopup="listbox"
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search vehicles, parts, FAQs..."
                            className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {/* Results Dropdown */}
                        {query.trim().length > 0 && (
                            <div 
                                id="search-results"
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                                role="listbox"
                            >
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                                ) : getTotalResults() === 0 ? (
                                    <div className="p-8 text-center">
                                        <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">No results found for "{query}"</p>
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {results.vehicles.length > 0 && (
                                            <div className="mb-4">
                                                <div className="px-4 py-1 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                                                    <Car className="w-3 h-3 mr-2" /> Vehicles
                                                </div>
                                                {results.vehicles.map((item) => {
                                                    const idx = flatResults.findIndex(r => r === item);
                                                    return (
                                                        <div 
                                                            key={item.slug} 
                                                            role="option"
                                                            aria-selected={selectedIndex === idx}
                                                            onClick={() => handleNavigate(item)}
                                                            className={`px-4 py-3 flex items-center cursor-pointer border-l-2 ${selectedIndex === idx ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                        >
                                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded object-cover overflow-hidden mr-3 shrink-0">
                                                                {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</div>
                                                                <div className="text-xs text-slate-500">{item.tier}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <button onClick={() => { setIsExpanded(false); navigate('/vehicles'); }} className="w-full px-4 py-2 text-left text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">See all vehicles &rarr;</button>
                                            </div>
                                        )}

                                        {results.parts.length > 0 && (
                                            <div className="mb-4">
                                                <div className="px-4 py-1 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                                                    <Package className="w-3 h-3 mr-2" /> Parts & Accessories
                                                </div>
                                                {results.parts.map((item) => {
                                                    const idx = flatResults.findIndex(r => r === item);
                                                    return (
                                                        <div 
                                                            key={item.id || item.code} 
                                                            role="option"
                                                            aria-selected={selectedIndex === idx}
                                                            onClick={() => handleNavigate(item)}
                                                            className={`px-4 py-3 flex items-center cursor-pointer border-l-2 ${selectedIndex === idx ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</div>
                                                                <div className="text-xs text-slate-500 flex gap-2"><span className="font-mono">{item.code}</span> <span>{item.category}</span></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <button onClick={() => { setIsExpanded(false); navigate(`/store?q=${encodeURIComponent(query)}`); }} className="w-full px-4 py-2 text-left text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">See all parts results &rarr;</button>
                                            </div>
                                        )}

                                        {results.faqs.length > 0 && (
                                            <div>
                                                <div className="px-4 py-1 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                                                    <FileQuestion className="w-3 h-3 mr-2" /> FAQs
                                                </div>
                                                {results.faqs.map((item) => {
                                                    const idx = flatResults.findIndex(r => r === item);
                                                    return (
                                                        <div 
                                                            key={item.question} 
                                                            role="option"
                                                            aria-selected={selectedIndex === idx}
                                                            onClick={() => handleNavigate(item)}
                                                            className={`px-4 py-3 cursor-pointer border-l-2 ${selectedIndex === idx ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                        >
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.question}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}
            </AnimatePresence>
        </div>
    );
};