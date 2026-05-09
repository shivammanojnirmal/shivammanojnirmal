import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            appliedCoupon: null, // { code, discount, offer }
            
            addItem: (item) => {
                const items = get().items;
                const existingIndex = items.findIndex(i => i.id === item.id);
                
                if (existingIndex >= 0) {
                    const updated = [...items];
                    updated[existingIndex].quantity += 1;
                    set({ items: updated });
                } else {
                    set({ items: [...items, { ...item, quantity: 1 }] });
                }
            },
            
            removeItem: (itemId) => {
                set({ items: get().items.filter(i => i.id !== itemId) });
            },
            
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                const items = get().items;
                const index = items.findIndex(i => i.id === itemId);
                if (index >= 0) {
                    const updated = [...items];
                    updated[index].quantity = quantity;
                    set({ items: updated });
                }
            },
            
            clearCart: () => {
                set({ items: [], appliedCoupon: null });
            },
            
            applyCoupon: (couponData) => {
                set({ appliedCoupon: couponData });
            },
            
            removeCoupon: () => {
                set({ appliedCoupon: null });
            },
            
            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            },
            
            getTotal: () => {
                const subtotal = get().getSubtotal();
                const discount = get().appliedCoupon?.discount || 0;
                return Math.max(0, subtotal - discount);
            },
            
            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            }
        }),
        {
            name: 'jmd-cart-storage',
            partialize: (state) => ({
                items: state.items,
                appliedCoupon: state.appliedCoupon
            })
        }
    )
);