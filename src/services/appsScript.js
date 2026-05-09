import { config } from '../utils/config';

/**
 * Service to handle writes to Google Sheets via Apps Script Web App
 */
export const appsScript = {
    /**
     * POST data to the Web App
     * @param {string} sheet - Target sheet name
     * @param {Object} row - Key-value pair data matching sheet columns
     */
    post: async (sheet, row) => {
        if (!config.appsScriptUrl) throw new Error('Apps Script URL is not configured');

        const response = await fetch(config.appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sheet,
                row: {
                    ...row,
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Apps Script Error: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * UPDATE data in the sheet
     * @param {string} sheet 
     * @param {number} rowIndex 
     * @param {Object} row 
     */
    update: async (sheet, rowIndex, row) => {
        if (!config.appsScriptUrl) throw new Error('Apps Script URL is not configured');

        const response = await fetch(config.appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update',
                sheet,
                rowIndex,
                row
            })
        });

        return await response.json();
    }
};