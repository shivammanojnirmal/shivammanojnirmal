import { whatsappBuilder } from '../utils/whatsappBuilder';

/**
 * Hook to easily access WhatsApp message builders
 */
export const useWhatsApp = () => {
    return {
        openChat: (msg) => window.open(whatsappBuilder.buildUrl(msg), '_blank'),
        sendOrder: (items, total, coupon) => window.open(whatsappBuilder.buildOrderMessage(items, total, coupon), '_blank'),
        inquireVehicle: (name) => window.open(whatsappBuilder.buildVehicleInquiry(name), '_blank')
    };
};