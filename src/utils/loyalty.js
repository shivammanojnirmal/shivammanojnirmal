/**
 * Business logic for loyalty points and referrals
 */
export const loyalty = {
    POINTS_PER_SERVICE: 150,
    POINTS_PER_REFERRAL: 250,
    REDEMPTION_RATIO: 1, // 1 point = ₹1 (example)

    /**
     * Calculate potential points for an order
     */
    calculatePoints: (amount) => {
        return Math.floor(amount / 100); // 1 point per ₹100 spent
    },

    /**
     * Validate a referral code format
     */
    validateCode: (code) => {
        return /^JMD-[A-Z0-9]{4}-[0-9]{4}$/.test(code);
    }
};