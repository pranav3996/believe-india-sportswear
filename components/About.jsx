'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const response = await fetch('/api/about');
            const result = await response.json();

            if (result.success) {
                setAboutData(result.data);
            }
        } catch (error) {
            console.error('Error fetching about data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="about" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center animate-pulse">
                        <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    const {
        companyName = 'Believe India Sportswear',
        description = 'We are a leading manufacturer of premium sportswear and athletic apparel.',
        ownerImage,
        instagram,
        instagramLink,
        location,
        contactPerson,
        phone,
    } = aboutData || {};

    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="section-title">About Us</h2>
                    <p className="section-subtitle">
                        Learn more about our journey and commitment to excellence
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Image Section */}
                    {ownerImage && (
                        <div className="relative group animate-slide-right">
                            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={ownerImage}
                                    alt={companyName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl -z-10 blur-3xl opacity-30"></div>
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="space-y-6 animate-slide-left">
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                            {companyName}
                        </h3>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            {description}
                        </p>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {location && (
                                <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Location</p>
                                            <p className="text-sm font-semibold text-gray-900">{location}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contactPerson && (
                                <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Contact Person</p>
                                            <p className="text-sm font-semibold text-gray-900">{contactPerson}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {phone && (
                                <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Phone</p>
                                            <p className="text-sm font-semibold text-gray-900">{phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {instagram && instagramLink && (
                                <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Instagram</p>
                                            <a
                                                href={instagramLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                            >
                                                {instagram}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
