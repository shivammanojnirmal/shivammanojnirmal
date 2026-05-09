import React, { useMemo } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { LazyImage } from '../../components/ui/LazyImage';

export const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCartStore();
    
    return (
        <div className="flex gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                    <LazyImage src={item.image} alt={item.name} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                )}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0 justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{item.code}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.price)}
                    </span>
                    
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-slate-900 dark:text-white">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= Number(item.stock)}
                            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => removeItem(item.id)}
                className="p-1 self-start text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Remove item"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};