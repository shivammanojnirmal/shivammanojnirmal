import { config } from './config';
import { formatCurrency } from './formatters';

export const whatsappBuilder = {
    /**
     * Generic message builder
     */
    buildUrl: (message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${config.waNumber}?text=${encodedMessage}`;
    },

    /**
     * Store Order message
     */
    buildOrderMessage: (cartItems, total, appliedCoupon = null) => {
        let msg = `*New Order - Jai Mata Di Auto Care*\n\n`;
        
        cartItems.forEach(item => {
            msg += `- ${item.name} (x${item.quantity})\n`;
            if (item.code) msg += `  Code: ${item.code}\n`;
        });
        
        msg += `\n`;
        
        if (appliedCoupon) {
            msg += `Subtotal: ${formatCurrency(total + appliedCoupon.discount)}\n`;
            msg += `Coupon (${appliedCoupon.code}): -${formatCurrency(appliedCoupon.discount)}\n`;
        }
        
        msg += `*Total: ${formatCurrency(total)}*\n\n`;
        msg += `Please confirm my order and share payment details.`;
        
        return whatsappBuilder.buildUrl(msg);
    },

    /**
     * Vehicle Booking / Inquiry
     */
    buildVehicleInquiry: (vehicleName, context = 'inquiry') => {
        const url = `${config.siteUrl}/vehicles/${vehicleName.toLowerCase().replace(/\\s+/g, '-')}`;
        let msg = `Hi, I'm interested in the *${vehicleName}*.\n\n`;
        
        if (context === 'test_drive') {
            msg = `Hi, I would like to book a test drive for the *${vehicleName}*.\n\n`;
        } else if (context === 'emi') {
            msg = `Hi, I want to know about EMI options for the *${vehicleName}*.\n\n`;
        }
        
        msg += `Reference: ${url}`;
        return whatsappBuilder.buildUrl(msg);
    },

    /**
     * Inventory Out-of-Stock Inquiry
     */
    buildInventoryInquiry: (partCode, partName, model) => {
        const msg = `I'm looking for part *${partCode}* — ${partName} for ${model}.\nIs it available or when will it be restocked?`;
        return whatsappBuilder.buildUrl(msg);
    },

    /**
     * Service Reminder Booking
     */
    buildServiceReminderBooking: (vehicle, lastServiceDate) => {
        const msg = `Hi, I'd like to book a service for my *${vehicle}*.\nMy last service was on ${lastServiceDate}. Please confirm availability.`;
        return whatsappBuilder.buildUrl(msg);
    },

    /**
     * Offer Share
     */
    buildOfferShare: (offer) => {
        const msg = `Check out this offer at Jai Mata Di Auto Care:\n*${offer.title}* — ${offer.description}\nUse code: *${offer.code}*\nValid until: ${offer.valid_until}\n${config.siteUrl}/offers`;
        return whatsappBuilder.buildUrl(msg);
    }
};