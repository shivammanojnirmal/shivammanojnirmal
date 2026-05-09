/**
 * High-performance CSV parser for Google Sheets published CSV data
 */
export const csvParser = {
    /**
     * Converts CSV text to Array of Objects
     */
    parse: (csvText) => {
        if (!csvText) return [];
        
        const lines = csvText.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) return [];

        const headers = csvParser.parseLine(lines[0]);

        return lines.slice(1).map(line => {
            const values = csvParser.parseLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                if (!header) return;
                const key = header.toLowerCase().trim().replace(/\s+/g, '_');
                obj[key] = values[index] ?? '';
            });
            return obj;
        });
    },

    /**
     * Handles quoted values and commas within quotes
     */
    parseLine: (line) => {
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
};