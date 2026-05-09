import { formatCurrency, formatDate } from './formatters';

export const pdfExport = {
    /**
     * Helper to load jsPDF dynamically to keep initial bundle size small
     */
    getJSPDF: async () => {
        try {
            const { jsPDF } = await import('jspdf');
            // Check if autoTable is available, else import it (often needed for jsPDF)
            try {
                await import('jspdf-autotable');
            } catch (e) {
                console.warn('jspdf-autotable not found, tables might not format correctly if used via autoTable plugin.');
            }
            return jsPDF;
        } catch (error) {
            console.error('Failed to load jsPDF', error);
            throw new Error('PDF library failed to load');
        }
    },

    exportServiceHistory: async (records, phone) => {
        const jsPDF = await pdfExport.getJSPDF();
        const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
        
        // Header
        doc.setFontSize(20);
        doc.text('Jai Mata Di Auto Care', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Service History Report', 105, 28, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Customer Phone: ${phone.replace(/.(?=.{4})/g, 'x')}`, 14, 40);
        doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 46);

        // We use autoTable if available
        if (typeof doc.autoTable === 'function') {
            const tableData = records.map(r => [
                formatDate(r.service_date),
                r.vehicle || 'Unknown',
                r.service_type || '-',
                (r.status || 'Completed').toUpperCase(),
                r.notes || '-'
            ]);

            doc.autoTable({
                startY: 55,
                head: [['Date', 'Vehicle', 'Type', 'Status', 'Notes']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });
        } else {
            // Fallback basic text rendering if autoTable fails to load
            let y = 60;
            doc.text('Date | Vehicle | Type | Status | Notes', 14, y);
            y += 10;
            records.forEach(r => {
                const line = `${formatDate(r.service_date)} | ${r.vehicle} | ${r.service_type} | ${r.status}`;
                doc.text(line, 14, y);
                y += 8;
            });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`jmd_service_history_${dateStr}.pdf`);
    },

    exportPriceList: async (vehicles) => {
        const jsPDF = await pdfExport.getJSPDF();
        const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
        
        doc.setFontSize(20);
        doc.text('Jai Mata Di Auto Care', 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text('Vehicle Price List', 105, 28, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Date: ${formatDate(new Date().toISOString())}`, 105, 34, { align: 'center' });

        if (typeof doc.autoTable === 'function') {
            const tableData = vehicles.map(v => [
                v.name,
                v.tier ? v.tier.toUpperCase() : '-',
                `${v.range_km || '-'} km`,
                formatCurrency(v.price)
            ]);

            doc.autoTable({
                startY: 45,
                head: [['Model', 'Tier', 'Range', 'Price']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });
        }

        doc.setFontSize(9);
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 250;
        doc.text('* Prices are subject to change without prior notice.', 14, finalY);

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`jmd_pricelist_${dateStr}.pdf`);
    },

    exportInventoryReport: async (parts) => {
        const jsPDF = await pdfExport.getJSPDF();
        const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
        
        doc.setFontSize(18);
        doc.text('Inventory Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 26);

        if (typeof doc.autoTable === 'function') {
            const tableData = parts.map(p => {
                let status = 'IN STOCK';
                if (Number(p.stock_qty) === 0) status = 'OUT OF STOCK';
                else if (Number(p.stock_qty) <= Number(p.reorder_level)) status = 'LOW STOCK';

                return [
                    p.part_code,
                    p.part_name,
                    p.model,
                    p.category,
                    String(p.stock_qty),
                    status
                ];
            });

            doc.autoTable({
                startY: 35,
                head: [['Code', 'Name', 'Model', 'Category', 'Stock Qty', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42] },
                didParseCell: function(data) {
                    if (data.section === 'body' && data.column.index === 5) {
                        const val = data.cell.raw;
                        if (val === 'OUT OF STOCK') data.cell.styles.textColor = [220, 38, 38];
                        else if (val === 'LOW STOCK') data.cell.styles.textColor = [217, 119, 6];
                        else data.cell.styles.textColor = [22, 163, 74];
                    }
                }
            });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`jmd_inventory_${dateStr}.pdf`);
    }
};