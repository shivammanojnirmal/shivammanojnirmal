import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { LazyImage } from '../../components/ui/LazyImage';

export const PartCard = ({ part }) => {
    const { items, addItem, updateQuantity } = useCartStore();
    const cartItem = items.find(i => i.id === part.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    const stockQty = Number(part.stock) || 0;
    const isOutOfStock = stockQty === 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col h-full hover:shadow-md transition-shadow group relative">
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {String(part.featured).toLowerCase() === 'true' && (
                    <Badge variant="warning" className="shadow-sm">Featured</Badge>
                )}
                {isOutOfStock ? (
                    <Badge variant="danger" className="shadow-sm">Out of Stock</Badge>
                ) : stockQty <= 5 ? (
                    <Badge variant="warning" className="shadow-sm">Low Stock</Badge>
                ) : null}
            </div>

            {/* Image */}
            <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {part.image ? (
                    <LazyImage 
                        src={part.image} 
                        alt={part.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <ShoppingCart className="w-12 h-12" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400 px-1.5 py-0.5 rounded">
                        {part.code}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {part.category}
                    </span>
                </div>
                
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {part.name}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
                    {part.description || `Compatible with ${part.model}`}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(part.price)}
                    </span>

                    {quantity > 0 ? (
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                            <button 
                                onClick={() => updateQuantity(part.id, quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-primary-600 shadow-sm"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">
                                {quantity}
                            </span>
                            <button 
                                onClick={() => updateQuantity(part.id, quantity + 1)}
                                disabled={quantity >= stockQty}
                                className={`w-7 h-7 flex items-center justify-center rounded-md text-slate-600 dark:text-slate-300 hover:text-primary-600 shadow-sm ${quantity >= stockQty ? 'opacity-50 cursor-not-allowed bg-transparent shadow-none' : 'bg-white dark:bg-slate-600'}`}
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <Button 
                            size="sm" 
                            disabled={isOutOfStock}
                            onClick={() => addItem(part)}
                            className="shrink-0"
                            leftIcon={<ShoppingCart className="w-4 h-4" />}
                        >
                            Add
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};