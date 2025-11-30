'use client';

import { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';

/**
 * Services Page - Believe India Sportswear
 * 
 * This page displays all services fetched dynamically from the API.
 * Services are managed through the admin panel and automatically
 * reflect on this page.
 * 
 * To add/remove/edit services:
 * - Go to /admin (requires login)
 * - Navigate to the Services tab
 * - Create, update, or delete services
 * - Changes will automatically appear here
 */

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch services from API on component mount
    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();

                if (data.success) {
                    setServices(data.data);
                } else {
                    setError('Failed to load services');
                }
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-display font-bold mb-4">
                        Our Services
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Comprehensive sportswear solutions tailored to your needs
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 py-16">
                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading services...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-600 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Services Content */}
                {!loading && !error && (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                What We Offer
                            </h2>
                            <p className="text-gray-600">
                                {services.length} specialized services to meet all your sportswear needs
                            </p>
                        </div>

                        {/* Responsive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service._id || service.id}
                                    service={service}
                                    variant={service.featured ? 'featured' : 'default'}
                                />
                            ))}
                        </div>

                        {/* Empty state */}
                        {services.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg">
                                    No services available at the moment.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Contact us today for a free consultation and quote
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block"
                        >
                            Contact Us
                        </a>
                        <a
                            href="tel:+918291552929"
                            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300 inline-block"
                        >
                            Call Now
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
