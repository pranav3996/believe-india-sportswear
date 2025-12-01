'use client';

export default function ClientsSection() {
    const clients = [
        { name: 'Sports Academy', logo: '🏆' },
        { name: 'Cricket Club', logo: '🏏' },
        { name: 'Football Team', logo: '⚽' },
        { name: 'Basketball League', logo: '🏀' },
        { name: 'Fitness Center', logo: '💪' },
        { name: 'Marathon Events', logo: '🏃' },
    ];

    const stats = [
        { value: '500+', label: 'Happy Clients' },
        { value: '98%', label: 'Satisfaction Rate' },
        { value: '6+', label: 'Years Experience' },
    ];

    return (
        <section className="bg-white border-y py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Join Our Happy Clients
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trusted by teams, clubs, and organizations across India for premium sportswear
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Client Logos Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                    {clients.map((client, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                        >
                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {client.logo}
                            </div>
                            <div className="text-sm font-medium text-gray-700 text-center">
                                {client.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <a
                        href="/contact"
                        className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        Start Your Project
                    </a>
                </div>
            </div>
        </section>
    );
}
