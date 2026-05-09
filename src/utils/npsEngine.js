/**
 * Net Promoter Score logic and categorization
 */
export const npsEngine = {
    /**
     * Categorize a single score
     * @param {number} score 0-10
     * @returns {'promoter'|'passive'|'detractor'}
     */
    categorize: (score) => {
        const numScore = Number(score);
        if (isNaN(numScore) || numScore < 0 || numScore > 10) return 'detractor';
        if (numScore >= 9) return 'promoter';
        if (numScore >= 7) return 'passive';
        return 'detractor';
    },

    /**
     * Calculate overall NPS from an array of score objects
     * @param {Array<{nps_score: number|string}>} scores 
     * @returns {number} -100 to 100
     */
    calculateNPS: (scores) => {
        if (!scores || scores.length === 0) return 0;
        
        const summary = npsEngine.scoreSummary(scores);
        if (summary.total === 0) return 0;

        const percentPromoters = (summary.promoters / summary.total) * 100;
        const percentDetractors = (summary.detractors / summary.total) * 100;

        return Math.round(percentPromoters - percentDetractors);
    },

    /**
     * Get detailed breakdown of scores
     * @param {Array<{nps_score: number|string}>} scores 
     * @returns {Object}
     */
    scoreSummary: (scores) => {
        let promoters = 0;
        let passives = 0;
        let detractors = 0;

        scores.forEach(s => {
            const category = npsEngine.categorize(s.nps_score);
            if (category === 'promoter') promoters++;
            else if (category === 'passive') passives++;
            else if (category === 'detractor') detractors++;
        });

        const total = promoters + passives + detractors;

        return {
            promoters,
            passives,
            detractors,
            total,
            nps: total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0
        };
    }
};