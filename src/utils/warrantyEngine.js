/**
 * Business logic for warranty eligibility
 */
export const warrantyEngine = {
    STANDARD_WARRANTY_YEARS: 3,

    /**
     * @param {string|Date} purchaseDate 
     * @returns {Object} { isEligible: boolean, expiryDate: Date, yearsLeft: number }
     */
    checkStatus: (purchaseDate) => {
        const purchase = new Date(purchaseDate);
        const today = new Date();
        const expiry = new Date(purchase);
        expiry.setFullYear(purchase.getFullYear() + warrantyEngine.STANDARD_WARRANTY_YEARS);
        
        const diffMs = expiry - today;
        const yearsLeft = Math.max(0, (diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
        
        return {
            isEligible: today <= expiry,
            expiryDate: expiry,
            yearsLeft: Number(yearsLeft)
        };
    }
};