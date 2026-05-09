import React, { useState } from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from './CartItem';
import { Button } from '../../components/ui/Button';
import { ShoppingCart, ArrowRight, Tag, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { couponEngine } from '../../utils/couponEngine';
import { fetchSheetData } from '../../services/sheets';
import { whatsappBuilder } from '../../utils/whatsappBuilder';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = ({ isOpen, onClose }) => {
    const { items, clearCart, getSubtotal, getTotal, getItemCount, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const subtotal = getSubtotal();
    const total = getTotal();
    const count = getItemCount();

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplying(true);
        try {
            const offers = await fetchSheetData('offers');
            const result = couponEngine.validateCoupon(couponCode, subtotal, items, offers);
            
            if (result.valid) {
                applyCoupon({
                    code: result.offer.code,
                    discount: result.discount,
                    offer: result.offer
                });
                toast.success(result.message);
                setCouponCode('');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Couldn't validate coupon. Try again.");
        } finally {
            setIsApplying(false);
        }
    };

    const handleCheckout = () => {
        const url = whatsappBuilder.buildOrderMessage(items, subtotal, appliedCoupon);
        window.open(url, '_blank');
        clearCart();
        onClose();
        toast.success('Order sent to WhatsApp!');
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary-500" />
                    Your Cart
                    {count > 0 && (
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-primary-900/30 dark:text-primary-400">
                            {count}
                        </span>
                    )}
                </div>
            }
            position="right"
        >
            <div className="flex flex-col h-full absolute inset-0 pt-[68px]">
                {/* Scrollable Items Area */}
                <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <ShoppingCart className="w-16 h-16 text-slate-200 dark:text-slate-700" />
                            <p>Your cart is empty</p>
                            <Button variant="outline" onClick={onClose}>Continue Shopping</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {items.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout Area */}
                {items.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10 shrink-0">
                        
                        {/* Coupon Section */}
                        <div className="mb-4">
                            {appliedCoupon ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-2.5 rounded-lg"
                                >
                                    <div className="flex items-center text-green-700 dark:text-green-400 text-sm font-medium">
                                        <Tag className="w-4 h-4 mr-2" />
                                        Code '{appliedCoupon.code}' applied
                                    </div>
                                    <button onClick={removeCoupon} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Promo code" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm uppercase placeholder:normal-case focus:ring-2 focus:ring-primary-500"
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    />
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={handleApplyCoupon}
                                        isLoading={isApplying}
                                        disabled={!couponCode.trim()}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <AnimatePresence>
                                {appliedCoupon && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium"
                                    >
                                        <span>Discount</span>
                                        <span>-{formatCurrency(appliedCoupon.discount)}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Button 
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white" 
                            size="lg"
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                            onClick={handleCheckout}
                        >
                            Order via WhatsApp
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-3">
                            Payment is collected at the dealership.
                        </p>
                    </div>
                )}
            </div>
        </Drawer>
    );
};