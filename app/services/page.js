'use client';

export default function ServicesPage() {
    const services = [
        {
            icon: '🎨',
            title: 'Custom Design',
            description: 'Create unique sportswear with your team colors, logos, and designs. Our expert designers bring your vision to life.',
            features: ['Logo placement', 'Color customization', 'Name & number printing', 'Sublimation printing']
        },
        {
            icon: '📦',
            title: 'Bulk Orders',
            description: 'Special pricing for team orders, clubs, schools, and corporate events. Minimum order quantities apply.',
            features: ['Competitive pricing', 'Fast turnaround', 'Quality assurance', 'Dedicated support']
        },
        {
            icon: '✂️',
            title: 'Custom Sizing',
            description: 'Perfect fit for every athlete. We offer custom sizing options to ensure maximum comfort and performance.',
            features: ['Wide size range', 'Custom measurements', 'Youth to adult sizes', 'Plus size options']
        },
        {
            icon: '🏆',
            title: 'Quality Assurance',
            description: 'Every product undergoes rigorous quality checks. We use premium fabrics and advanced manufacturing techniques.',
            features: ['Premium materials', 'Durability testing', 'Color fastness', 'Quality certifications']
        },
        {
            icon: '🚚',
            title: 'Fast Delivery',
            description: 'Quick production and reliable shipping across India. Track your order from factory to doorstep.',
            features: ['Pan-India shipping', 'Order tracking', 'Secure packaging', 'Express options available']
        },
        {
            icon: '💬',
            title: 'Consultation',
            description: 'Free consultation for design, fabric selection, and order planning. Our team helps you make informed decisions.',
            features: ['Design assistance', 'Fabric samples', 'Price quotes', 'Expert guidance']
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-display font-bold mb-4">Our Services</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Comprehensive sportswear solutions tailored to your needs
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {service.description}
                            </p>
                            <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-700">
                                        <svg
                                            className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
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
