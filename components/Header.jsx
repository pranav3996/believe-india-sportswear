'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-sm">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 overflow-hidden shadow-sm">
                            <Image
                                src="/icon-96x96.png"
                                alt="Believe India Logo"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-bold text-xl text-gray-800 leading-none">
                                Believe India
                            </span>
                            <span className="text-xs text-gray-600">Sportswear</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#home"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
                        >
                            About
                        </a>
                        <a
                            href="#gallery"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
                        >
                            Gallery
                        </a>
                        <Link
                            href="/admin/login"
                            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-slide-down">
                        <div className="flex flex-col space-y-4">
                            <a
                                href="#home"
                                onClick={toggleMenu}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 py-2"
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                onClick={toggleMenu}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 py-2"
                            >
                                About
                            </a>
                            <a
                                href="#gallery"
                                onClick={toggleMenu}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 py-2"
                            >
                                Gallery
                            </a>
                            <Link
                                href="/admin/login"
                                onClick={toggleMenu}
                                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg transition-all duration-300"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
