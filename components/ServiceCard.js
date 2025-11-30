'use client';

import Image from 'next/image';

/**
 * ServiceCard Component
 * 
 * A reusable card component for displaying individual services
 * 
 * @param {Object} service - Service data object
 * @param {boolean} animate - Enable animation on scroll (future feature)
 * @param {string} variant - Card style variant ('default' | 'featured' | 'compact')
 */
export default function ServiceCard({
    service,
    animate = false,
    variant = 'default'
}) {
    const { id, icon, title, description, features, image } = service;

    // Base card styles
    const baseStyles = "bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

    // Variant-specific styles
    const variantStyles = {
        default: "",
        featured: "border-2 border-primary-500 relative overflow-hidden",
        compact: "p-6"
    };

    // Animation placeholder - can be replaced with libraries like Framer Motion or AOS
    const animationClass = animate ? "fade-in-up" : "";

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${animationClass}`}
            data-service-id={id}
        // Uncomment below for animation library integration
        // data-aos="fade-up"
        // data-aos-delay={index * 100}
        >
            {/* Featured Badge */}
            {variant === 'featured' && (
                <div className="absolute top-0 right-0 bg-accent-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                    POPULAR
                </div>
            )}

            {/* Service Image (Optional) */}
            {image && (
                <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}

            {/* Service Icon */}
            <div className="text-5xl mb-4">
                {/* 
                    Current: Using emoji
                    Future: Replace with icon library like react-icons or custom SVG
                    Example: <Icon name={icon} size={48} />
                */}
                {icon}
            </div>

            {/* Service Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {title}
            </h3>

            {/* Service Description */}
            <p className="text-gray-600 mb-6">
                {description}
            </p>

            {/* Service Features */}
            {features && features.length > 0 && (
                <ul className="space-y-2">
                    {features.map((feature, idx) => (
                        <li
                            key={idx}
                            className="flex items-center text-sm text-gray-700"
                        >
                            {/* Checkmark Icon */}
                            <svg
                                className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
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
            )}

            {/* Optional: Action Button (uncomment if needed) */}
            {/*
            <button 
                className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => handleServiceClick(id)}
            >
                Learn More
            </button>
            */}
        </div>
    );
}

// Optional: Skeleton loading component for better UX
export function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
