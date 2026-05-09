/**
 * Validates and applies coupon codes against the cart
 */
export const couponEngine = {
    /**
     * @param {string} code - The coupon code to check
     * @param {number} cartTotal - Current cart subtotal
     * @param {Array} cartItems - Current cart items
     * @param {Array} allOffers - Array of offer objects from the sheet
     * @returns {Object} { valid: boolean, discount: number, message: string, offer: Object|null }
     */
    validateCoupon: (code, cartTotal, cartItems, allOffers) => {
        if (!code || !allOffers || allOffers.length === 0) {
            return { valid: false, discount: 0, message: 'Invalid coupon code', offer: null };
        }

        const normalizedCode = code.trim().toUpperCase();
        const offer = allOffers.find(o => o.code?.trim().toUpperCase() === normalizedCode);

        if (!offer) {
            return { valid: false, discount: 0, message: 'Coupon code not found', offer: null };
        }

        if (String(offer.active).toLowerCase() !== 'true') {
            return { valid: false, discount: 0, message: 'This coupon is no longer active', offer: null };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (offer.valid_from) {
            const validFrom = new Date(offer.valid_from);
            if (!isNaN(validFrom) && today < validFrom) {
                return { valid: false, discount: 0, message: `Coupon is valid from ${validFrom.toLocaleDateString()}`, offer: null };
            }
        }

        if (offer.valid_until) {
            const validUntil = new Date(offer.valid_until);
            validUntil.setHours(23, 59, 59, 999);
            if (!isNaN(validUntil) && today > validUntil) {
                return { valid: false, discount: 0, message: 'This coupon has expired', offer: null };
            }
        }

        const minOrderValue = Number(offer.min_order_value) || 0;
        if (minOrderValue > 0 && cartTotal < minOrderValue) {
            return { valid: false, discount: 0, message: `Minimum order value of ₹${minOrderValue} required`, offer: null };
        }

        const applicableTo = (offer.applicable_to || 'all').toLowerCase();
        if (applicableTo !== 'all' && applicableTo !== 'parts') {
            return { valid: false, discount: 0, message: 'Coupon is not applicable to store orders', offer: null };
        }

        const usageLimit = Number(offer.usage_limit) || 0;
        const timesUsed = Number(offer.times_used) || 0;
        
        if (usageLimit > 0 && timesUsed >= usageLimit) {
            return { valid: false, discount: 0, message: 'Coupon usage limit reached', offer: null };
        }

        // Calculate discount
        const discountAmount = couponEngine.calculateDiscount(offer, cartTotal);

        return {
            valid: true,
            discount: discountAmount,
            message: 'Coupon applied successfully!',
            offer
        };
    },

    calculateDiscount: (offer, cartTotal) => {
        const discountValue = Number(offer.discount_value) || 0;
        const discountType = (offer.discount_type || 'percentage').toLowerCase();

        if (discountType === 'percentage') {
            return Math.floor((cartTotal * discountValue) / 100);
        } else if (discountType === 'flat') {
            return Math.min(discountValue, cartTotal); // Never discount more than total
        }
        return 0;
    }
};