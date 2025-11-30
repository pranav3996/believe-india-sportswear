'use client';

import ServiceCard from '../../components/ServiceCard';
/**
 * Services Page - Believe India Sportswear
 * 
 * This page displays all services in a dynamic, data-driven manner.
 * Services are loaded from the centralized data file and rendered using
 * the reusable ServiceCard component.
 * 
 * To add/remove/edit services:
 * - Go to /data/services.js
 * - Add, remove, or modify the service objects
 * - The UI will automatically update
 * 
 * Future enhancements:
 * - Uncomment the Suspense wrapper for better loading UX
 * - Add service filtering by category
 * - Integrate with backend API (see fetchServicesFromAPI in data/services.js)
 * - Add animations on scroll (AOS library or Framer Motion)
 */


import { getAllServices } from '../../data/services';

// import { Suspense } from 'react'; // Uncomment for async data fetching

export default function ServicesPage() {
    // Load services from centralized data file
    // This can be replaced with: const services = await fetchServicesFromAPI();
    const services = getAllServices();

    // Optional: Get only featured services for special highlighting
    // const featuredServices = getFeaturedServices();

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
                {/* 
                    Optional: Add section header with count
                */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        What We Offer
                    </h2>
                    <p className="text-gray-600">
                        {services.length} specialized services to meet all your sportswear needs
                    </p>
                </div>

                {/* 
                    Responsive Grid Layout:
                    - 1 column on mobile
                    - 2 columns on tablet (md breakpoint)
                    - 3 columns on desktop (lg breakpoint)
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 
                        Suspense wrapper for future async data loading
                        Uncomment when integrating with backend API
                    */}
                    {/* <Suspense fallback={<ServiceCardSkeleton />}> */}

                    {services.map((service) => (
                        <ServiceCard
                            key={service.id} // Using unique ID instead of index for better React performance
                            service={service}
                            variant={service.featured ? 'featured' : 'default'}
                        // animate={true} // Uncomment to enable animations
                        />
                    ))}

                    {/* </Suspense> */}
                </div>

                {/* Empty state (shown when no services available) */}
                {services.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">
                            No services available at the moment.
                        </p>
                    </div>
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

/**
 * Static metadata for SEO (Next.js 13+ App Router)
 * 
 * Uncomment this section if you want to add page-specific metadata
 */
/*
export const metadata = {
    title: 'Our Services | Believe India Sportswear',
    description: 'Custom sportswear design, bulk orders, quality assurance, fast delivery, and consultation services for teams, clubs, and organizations across India.',
    keywords: ['sportswear services', 'custom design', 'bulk orders', 'team jerseys', 'India'],
};
*/
