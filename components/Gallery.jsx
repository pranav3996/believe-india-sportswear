'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchGallery();
        // Poll every 10 seconds for new images
        const interval = setInterval(fetchGallery, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await fetch('/api/gallery');
            const result = await response.json();

            if (result.success) {
                setImages(result.data);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    if (loading) {
        return (
            <section id="gallery" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-pulse">
                        <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="gallery" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="section-title">Our Gallery</h2>
                    <p className="section-subtitle">
                        Explore our collection of premium sportswear and athletic apparel
                    </p>
                </div>

                {/* Gallery Grid */}
                {images.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No images yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {images.map((image, index) => (
                            <div
                                key={image._id || index}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover-lift cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => openLightbox(image)}
                            >
                                <div className="relative w-full h-80">
                                    <Image
                                        src={image.url}
                                        alt={image.title || 'Gallery image'}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-lg font-semibold mb-1">
                                                {image.title || 'Untitled'}
                                            </h3>
                                            <p className="text-sm text-gray-200">
                                                {new Date(image.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Zoom Icon */}
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg
                                            className="w-5 h-5 text-gray-800"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
                        onClick={closeLightbox}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.title || 'Gallery image'}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="text-center mt-6 text-white">
                            <h3 className="text-2xl font-semibold mb-2">
                                {selectedImage.title || 'Untitled'}
                            </h3>
                            <p className="text-gray-300">
                                {new Date(selectedImage.timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
