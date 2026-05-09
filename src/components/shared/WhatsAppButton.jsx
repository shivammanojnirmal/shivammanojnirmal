import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { config } from '../../utils/config';

export const WhatsAppButton = ({ 
    message = "Hi, I have an inquiry about Jai Mata Di Auto Care.", 
    className = '' 
}) => {
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${config.waNumber}?text=${encodedMessage}`;

    return (
        <motion.a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-button"
            className={`fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all print-hide group ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
            
            {/* Tooltip on hover */}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
                Chat with us
            </span>
        </motion.a>
    );
};