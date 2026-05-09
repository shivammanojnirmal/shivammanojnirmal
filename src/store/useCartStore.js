import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            appliedCoupon: null,
            discount: 0,

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
                set({ items: [], appliedCoupon: null, discount: 0 });
            },

            applyCoupon: (coupon, discountAmount) => {
                set({ appliedCoupon: coupon, discount: discountAmount });
            },

            removeCoupon: () => {
                set({ appliedCoupon: null, discount: 0 });
            },

            getTotal: () => {
                const items = get().items;
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return Math.max(0, subtotal - get().discount);
            },

            getSubtotal: () => {
                const items = get().items;
                return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
                appliedCoupon: state.appliedCoupon,
                discount: state.discount
            })
        }
    )
);
