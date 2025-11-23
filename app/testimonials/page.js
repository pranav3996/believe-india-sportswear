'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/testimonials');
            const result = await response.json();
            if (result.success) {
                setTestimonials(result.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-display font-bold mb-4">What Our Clients Say</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Trusted by teams, clubs, and organizations across India
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, idx) => (
                                        <div key={idx} className="w-5 h-5 bg-gray-200 rounded mr-1"></div>
                                    ))}
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-20">
                        <svg
                            className="w-20 h-20 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <p className="text-gray-500 text-lg">No testimonials yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial._id || index}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    {renderStars(testimonial.rating || 5)}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.text || testimonial.comment}"
                                </p>

                                {/* Author */}
                                <div className="border-t pt-4">
                                    <p className="font-semibold text-gray-900">
                                        {testimonial.customerName || testimonial.name}
                                    </p>
                                    {testimonial.company && (
                                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-white border-t py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Join Our Happy Clients
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Experience the quality and service that our clients love
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
                    >
                        Get Started
                    </a>
                </div>
            </section>
        </div>
    );
}
