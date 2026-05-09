/**
 * Basic input sanitization to prevent XSS and injection
 */
export const sanitize = {
    /**
     * Strip HTML tags from strings
     */
    text: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.replace(/<[^>]*>?/gm, '').trim();
    },

    /**
     * Escape special characters for safe storage
     */
    escape: (str) => {
        if (!str || typeof str !== 'string') return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        return str.replace(/[&<>"'/]/g, (m) => map[m]);
    }
};