export const services = [
    {
        id: 'general-service',
        name: 'General Service',
        price: 499,
        duration: '1-2 hours',
        description: 'Complete vehicle checkup and maintenance',
        includes: [
            'Battery health check',
            'Brake inspection',
            'Tyre pressure check',
            'Light & horn check',
            'General cleaning',
            'Software update'
        ],
        icon: 'wrench'
    },
    {
        id: 'battery-service',
        name: 'Battery Service',
        price: 799,
        duration: '2-3 hours',
        description: 'Comprehensive battery health and performance check',
        includes: [
            'Battery health diagnostics',
            'Cell balancing',
            'Charging system check',
            'Battery terminal cleaning',
            'Performance optimization',
            'Health report'
        ],
        icon: 'battery'
    },
    {
        id: 'brake-service',
        name: 'Brake Service',
        price: 599,
        duration: '1-2 hours',
        description: 'Complete brake system inspection and service',
        includes: [
            'Brake pad inspection',
            'Brake fluid check',
            'Brake cable adjustment',
            'Disc/drum cleaning',
            'Safety test',
            'Replacement if needed'
        ],
        icon: 'disc'
    },
    {
        id: 'tyre-service',
        name: 'Tyre Service',
        price: 399,
        duration: '30-60 minutes',
        description: 'Tyre inspection, rotation and maintenance',
        includes: [
            'Tyre pressure check',
            'Tread depth inspection',
            'Wheel alignment check',
            'Puncture repair',
            'Tyre rotation',
            'Balancing'
        ],
        icon: 'circle'
    },
    {
        id: 'electrical-service',
        name: 'Electrical Service',
        price: 899,
        duration: '2-3 hours',
        description: 'Complete electrical system diagnostics',
        includes: [
            'Wiring inspection',
            'Controller diagnostics',
            'Motor health check',
            'Display & sensors check',
            'Charging port inspection',
            'Error code diagnosis'
        ],
        icon: 'zap'
    },
    {
        id: 'deep-cleaning',
        name: 'Deep Cleaning',
        price: 699,
        duration: '2-3 hours',
        description: 'Professional deep cleaning and detailing',
        includes: [
            'Exterior wash & polish',
            'Interior cleaning',
            'Dashboard cleaning',
            'Seat cleaning',
            'Wheel cleaning',
            'Protective coating'
        ],
        icon: 'sparkles'
    },
    {
        id: 'annual-maintenance',
        name: 'Annual Maintenance',
        price: 2499,
        duration: '4-5 hours',
        description: 'Comprehensive annual maintenance package',
        includes: [
            'All general service items',
            'Battery deep service',
            'Complete brake service',
            'Tyre service',
            'Electrical diagnostics',
            'Deep cleaning',
            'Parts replacement (if needed)',
            '1 year service warranty'
        ],
        icon: 'calendar',
        popular: true
    },
    {
        id: 'emergency-service',
        name: 'Emergency Service',
        price: 1299,
        duration: 'On-demand',
        description: 'Emergency breakdown assistance',
        includes: [
            'On-site diagnosis',
            'Emergency repairs',
            'Battery jumpstart',
            'Towing (if needed)',
            '24/7 availability',
            'Priority service'
        ],
        icon: 'alert-circle'
    }
];

export const getServiceById = (id) => {
    return services.find(s => s.id === id);
};

export const getPopularServices = () => {
    return services.filter(s => s.popular);
};
