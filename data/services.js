/**
 * Services Data Configuration
 * 
 * This file contains all service offerings for Believe India Sportswear.
 * Each service object supports the following properties:
 * 
 * @property {string} id - Unique identifier for the service
 * @property {string} title - Service name/title
 * @property {string} description - Brief description of the service
 * @property {string} icon - Emoji or icon identifier (can be replaced with icon component)
 * @property {string[]} features - List of key features/benefits
 * @property {string} [image] - Optional: Image URL or path for the service
 * @property {boolean} [featured] - Optional: Whether to highlight this service
 * @property {string} [category] - Optional: Service category for filtering
 * 
 * To add a new service:
 * 1. Add a new object to the array below
 * 2. Ensure all required fields are filled
 * 3. The UI will automatically update
 * 
 * Future enhancements:
 * - Replace this file with API endpoint: GET /api/services
 * - Add service images in /public/images/services/
 * - Implement service categories for filtering
 * - Add animation configurations per service
 */

export const servicesData = [
    {
        id: 'custom-design',
        icon: '🎨',
        title: 'Custom Design',
        description: 'Create unique sportswear with your team colors, logos, and designs. Our expert designers bring your vision to life.',
        features: [
            'Logo placement',
            'Color customization',
            'Name & number printing',
            'Sublimation printing'
        ],
        category: 'design',
        featured: true,
        // image: '/images/services/custom-design.jpg', // Uncomment when image is available
    },
    {
        id: 'bulk-orders',
        icon: '📦',
        title: 'Bulk Orders',
        description: 'Special pricing for team orders, clubs, schools, and corporate events. Minimum order quantities apply.',
        features: [
            'Competitive pricing',
            'Fast turnaround',
            'Quality assurance',
            'Dedicated support'
        ],
        category: 'ordering',
        featured: true,
        // image: '/images/services/bulk-orders.jpg',
    },
    {
        id: 'custom-sizing',
        icon: '✂️',
        title: 'Custom Sizing',
        description: 'Perfect fit for every athlete. We offer custom sizing options to ensure maximum comfort and performance.',
        features: [
            'Wide size range',
            'Custom measurements',
            'Youth to adult sizes',
            'Plus size options'
        ],
        category: 'customization',
        featured: false,
        // image: '/images/services/custom-sizing.jpg',
    },
    {
        id: 'quality-assurance',
        icon: '🏆',
        title: 'Quality Assurance',
        description: 'Every product undergoes rigorous quality checks. We use premium fabrics and advanced manufacturing techniques.',
        features: [
            'Premium materials',
            'Durability testing',
            'Color fastness',
            'Quality certifications'
        ],
        category: 'quality',
        featured: true,
        // image: '/images/services/quality-assurance.jpg',
    },
    {
        id: 'fast-delivery',
        icon: '🚚',
        title: 'Fast Delivery',
        description: 'Quick production and reliable shipping across India. Track your order from factory to doorstep.',
        features: [
            'Pan-India shipping',
            'Order tracking',
            'Secure packaging',
            'Express options available'
        ],
        category: 'delivery',
        featured: false,
        // image: '/images/services/fast-delivery.jpg',
    },
    {
        id: 'consultation',
        icon: '💬',
        title: 'Consultation',
        description: 'Free consultation for design, fabric selection, and order planning. Our team helps you make informed decisions.',
        features: [
            'Design assistance',
            'Fabric samples',
            'Price quotes',
            'Expert guidance'
        ],
        category: 'support',
        featured: false,
        // image: '/images/services/consultation.jpg',
    }
];

/**
 * Helper function to get all services
 * This can be replaced with an API call in the future
 */
export const getAllServices = () => {
    return servicesData;
};

/**
 * Helper function to get a single service by ID
 */
export const getServiceById = (id) => {
    return servicesData.find(service => service.id === id);
};

/**
 * Helper function to get featured services
 */
export const getFeaturedServices = () => {
    return servicesData.filter(service => service.featured);
};

/**
 * Helper function to get services by category
 */
export const getServicesByCategory = (category) => {
    return servicesData.filter(service => service.category === category);
};

/**
 * Placeholder for future API integration
 * Replace getAllServices() with this when backend is ready
 */
/*
export const fetchServicesFromAPI = async () => {
    try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return servicesData; // Fallback to static data
    }
};
*/
