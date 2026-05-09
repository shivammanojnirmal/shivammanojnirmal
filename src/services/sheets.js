import { config } from '../utils/config';
import { reportError } from '../errors/errorReporter';

// Fallback data for initial setup/offline
import { vehicles as fallbackVehicles } from '../data/vehicles';
import { parts as fallbackParts } from '../data/parts';

// Simple in-memory cache to prevent redundant fetches within a session
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch data from Google Sheets via published CSV endpoint with caching
 * @param {string} sheetName - Name of the sheet tab
 * @param {boolean} forceRefresh - Whether to bypass cache
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export const fetchSheetData = async (sheetName, forceRefresh = false) => {
    try {
        const now = Date.now();
        const cached = cache.get(sheetName);

        if (!forceRefresh && cached && (now - cached.timestamp < CACHE_TTL)) {
            return cached.data;
        }

        // Fallback to local data if no URL configured
        if (!config.sheetsBaseUrl) {
            console.warn(`[SHEETS] No Base URL. Using fallback for ${sheetName}`);
            if (sheetName === 'vehicles') return fallbackVehicles;
            if (sheetName === 'parts') return fallbackParts;
            return [];
        }

        const url = `${config.sheetsBaseUrl}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        const response = await fetch(url);


        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status} while fetching ${sheetName}`);
        }

        const text = await response.text();
        const data = parseCSV(text);

        cache.set(sheetName, { data, timestamp: now });
        return data;
    } catch (error) {
        await reportError(error, { component: 'sheetsApi', action: 'fetchSheetData', sheetName });
        throw error;
    }
};

/**
 * Submit data to Google Apps Script endpoint
 * @param {string} sheetName - Target sheet name
 * @param {Object} data - Data to submit
 * @returns {Promise<Object>} Response from Apps Script
 */
export const submitToSheet = async (sheetName, data) => {
    try {
        if (!config.appsScriptUrl) {
            throw new Error('Apps Script URL not configured');
        }

        const response = await fetch(config.appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheet: sheetName,
                row: {
                    ...data,
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Submission failed with status ${response.status}`);
        }

        // Clear cache for this sheet as data has changed
        cache.delete(sheetName);

        return await response.json();
    } catch (error) {
        await reportError(error, { component: 'sheetsApi', action: 'submitToSheet', sheetName });
        throw error;
    }
};

/**
 * Validate coupon code
 * @param {string} code - Coupon code to validate
 * @returns {Promise<Object|null>} Coupon data if valid, null otherwise
 */
export const validateCoupon = async (code) => {
    try {
        const coupons = await fetchSheetData('coupons');
        const normalizedCode = code.trim().toUpperCase();

        const coupon = coupons.find(c =>
            c.code?.trim().toUpperCase() === normalizedCode &&
            String(c.active).toUpperCase() === 'TRUE'
        );

        if (!coupon) return null;

        // Check expiry
        if (coupon.expiry_date) {
            const expiry = new Date(coupon.expiry_date);
            if (!isNaN(expiry.getTime()) && expiry < new Date()) {
                return null;
            }
        }

        return {
            code: coupon.code,
            discount: parseFloat(coupon.discount) || 0,
            type: (coupon.type || 'fixed').toLowerCase(),
            description: coupon.description || ''
        };
    } catch (error) {
        // Validation failures should be reported but not necessarily crash the UI
        await reportError(error, { component: 'sheetsApi', action: 'validateCoupon', code });
        return null;
    }
};

/**
 * Fetch service history by phone number
 * @param {string} phone - Customer phone number
 * @returns {Promise<Array>} Service history records
 */
export const fetchServiceHistory = async (phone) => {
    try {
        const bookings = await fetchSheetData('bookings');
        const normalizedPhone = phone.trim();

        return bookings
            .filter(b => b.phone === normalizedPhone)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        await reportError(error, { component: 'sheetsApi', action: 'fetchServiceHistory', phone });
        return [];
    }
};

/**
 * Parse CSV text to array of objects
 * Optimized to handle common CSV edge cases
 */
function parseCSV(csv) {
    const lines = csv.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);

    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
            if (header) {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] ?? '';
            }
        });
        return obj;
    });
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

