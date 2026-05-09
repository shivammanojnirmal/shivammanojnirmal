export const printStyles = `
@media print {
    /* Hide UI Elements */
    nav, footer, .print-hide, #whatsapp-button, 
    .fixed, .sticky, [role="dialog"], #notification-center {
        display: none !important;
    }

    /* Force Backgrounds and Text Colors */
    body, main, .print-show {
        background: white !important;
        color: black !important;
    }

    /* Remove Shadows and Borders for clean print */
    * {
        box-shadow: none !important;
    }

    /* Layout adjustments */
    main {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
    }

    /* Page Breaks */
    .print-break-inside-avoid {
        page-break-inside: avoid;
    }
    .print-break-after-always {
        page-break-after: always;
    }
    
    /* Reveal Print Wrappers */
    .print-wrapper-header {
        display: block !important;
        text-align: center;
        margin-bottom: 2rem;
        border-bottom: 2px solid #000;
        padding-bottom: 1rem;
    }
    
    .print-wrapper-header h1 {
        font-size: 24pt;
        font-weight: bold;
        margin: 0;
    }
    
    .print-wrapper-header p {
        margin: 4px 0 0 0;
        font-size: 12pt;
    }
}
`;

export const injectPrintStyles = () => {
    let styleEl = document.getElementById('jmd-print-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'jmd-print-styles';
        styleEl.innerHTML = printStyles;
        document.head.appendChild(styleEl);
    }
};

export const removePrintStyles = () => {
    const styleEl = document.getElementById('jmd-print-styles');
    if (styleEl) {
        document.head.removeChild(styleEl);
    }
};