'use client';

import { useState, useEffect } from 'react';
import TestimonialForm from '../../components/TestimonialForm';
import TestimonialCard from '../../components/TestimonialCard';
import ClientsSection from '../../components/ClientsSection';

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

    const handleFormSuccess = () => {
        // Optionally refresh testimonials after submission
        // Note: New submissions won't appear until approved
        fetchTestimonials();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        What Our Clients Say
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        Real reviews from teams, clubs, and organizations who trust Believe India
                    </p>
                </div>
            </section>

            {/* Testimonials Grid Section - FIRST */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Customer Reviews
                    </h2>
                    <p className="text-gray-600 text-lg">
                        See what our happy customers have to say about their experience
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-xl p-6 h-80 shadow-md">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, idx) => (
                                        <div key={idx} className="w-5 h-5 bg-gray-200 rounded mr-1"></div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md">
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
                        <p className="text-gray-500 text-lg mb-2">No testimonials yet</p>
                        <p className="text-gray-400 text-sm">Be the first to share your feedback below!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial._id || index}
                                testimonial={testimonial}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Clients Section - SECOND */}
            <ClientsSection />

            {/* Feedback Form Section - THIRD */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Share Your Experience
                            </h2>
                            <p className="text-gray-600 text-lg">
                                We value your feedback! Tell us about your experience with Believe India Sportswear
                            </p>
                        </div>
                        <TestimonialForm onSuccess={handleFormSuccess} />
                    </div>
                </div>
            </section>
        </div>
    );
}
