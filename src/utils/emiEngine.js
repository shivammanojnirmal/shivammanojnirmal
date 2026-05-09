/**
 * Amortization and EMI calculation logic
 */
export const emiEngine = {
    /**
     * @param {number} p - Principal amount
     * @param {number} r - Annual interest rate (%)
     * @param {number} n - Tenure (months)
     * @returns {number} Monthly installment
     */
    calculateEMI: (p, r, n) => {
        if (!p || p <= 0) return 0;
        const monthlyRate = r / (12 * 100);
        const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        return Math.round(emi);
    },

    /**
     * Get total interest and total amount payable
     */
    getSummary: (p, r, n) => {
        const emi = emiEngine.calculateEMI(p, r, n);
        const totalPayable = emi * n;
        const totalInterest = totalPayable - p;
        return { emi, totalPayable, totalInterest };
    }
};