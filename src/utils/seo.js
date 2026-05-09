/**
 * Centralized SEO and Meta data configurations
 */
export const seo = {
    default: {
        title: 'Jai Mata Di Auto Care | Authorized Ampere EV Dealership',
        description: 'Leading Ampere electric scooter dealership in Loni Kh. Shop genuine parts, book authorized service, and explore the future of electric mobility.',
        image: '/og-image.jpg',
        url: 'https://jmdautocare.in'
    },
    
    getPageMeta: (title, desc, path) => ({
        title: title ? `${title} | Jai Mata Di Auto Care` : seo.default.title,
        description: desc || seo.default.description,
        url: `${seo.default.url}${path || ''}`
    })
};