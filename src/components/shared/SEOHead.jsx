import React, { useEffect } from 'react';

export const SEOHead = ({ 
    title, 
    description = "Authorized Ampere EV partner in Loni Kh., Maharashtra. Shop electric vehicles, genuine spare parts, and book authorized service online.", 
    image = "/og-image.jpg",
    path = "" 
}) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://jmdautocare.in';
    const fullUrl = `${siteUrl}${path}`;
    const fullTitle = title ? `${title} | Jai Mata Di Auto Care` : 'Jai Mata Di Auto Care - Ampere EV Dealership';

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Tags
        const updateMeta = (name, content) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const updateProperty = (property, content) => {
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard Meta
        updateMeta('description', description);

        // Open Graph
        updateProperty('og:title', fullTitle);
        updateProperty('og:description', description);
        updateProperty('og:url', fullUrl);
        updateProperty('og:image', `${siteUrl}${image}`);
        updateProperty('og:type', 'website');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', `${siteUrl}${image}`);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

    }, [fullTitle, description, fullUrl, image, siteUrl]);

    return null; // Component does not render anything
};