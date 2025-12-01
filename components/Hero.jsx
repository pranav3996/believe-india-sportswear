'use client';

import Image from 'next/image';

export default function Hero() {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
                        <div className="inline-block">
                            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-2 rounded-full">
                                Premium Sports Apparel
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                            <span className="gradient-text">Believe India</span>
                            <br />
                            <span className="text-gray-800">Sportswear</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                            Crafting excellence in every stitch. Your trusted partner for
                            high-quality custom sportswear and athletic apparel.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <a
                                href="#gallery"
                                className="btn-primary text-center"
                            >
                                View Our Work
                            </a>
                            <a
                                href="#about"
                                className="btn-secondary text-center"
                            >
                                Learn More
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
                            <div className="text-center lg:text-left">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">6+</div>
                                <div className="text-sm text-gray-600">Years Experience</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
                                <div className="text-sm text-gray-600">Happy Clients</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
                                <div className="text-sm text-gray-600">Quality</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Images Grid */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none animate-float">
                        <div className="relative">
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>

                            {/* Main Image Container - 4 Image Grid */}
                            <div className="relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Jacket - Top Left */}
                                    <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group hover-lift">
                                        <Image
                                            src="/hero-image.png"
                                            alt="Sports Jacket"
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* T-Shirt - Top Right */}
                                    <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group hover-lift">
                                        <Image
                                            src="/tshirt.png"
                                            alt="Sports T-Shirt"
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Shorts - Bottom Left */}
                                    <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group hover-lift">
                                        <Image
                                            src="/short.png"
                                            alt="Sports Shorts"
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Tracks - Bottom Right */}
                                    <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group hover-lift">
                                        <Image
                                            src="/tracks.png"
                                            alt="Track Pants"
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl shadow-lg transform rotate-12"></div>
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg transform -rotate-12"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <a href="#about" className="flex flex-col items-center text-gray-400 hover:text-primary-500 transition-colors duration-300">
                        <span className="text-xs mb-2">Scroll Down</span>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
