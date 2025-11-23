'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/#about', label: 'About' },
        { href: '/products', label: 'Products' },
        { href: '/services', label: 'Services' },
        { href: '/#gallery', label: 'Gallery' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact' }
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-md' : 'glass-effect shadow-sm'}`}>
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
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
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        {/* Admin Login Button */}
                        <Link
                            href="/admin/login"
                            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Admin Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen
                            ? 'max-h-screen opacity-100 mt-4'
                            : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-all duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Admin Login in Mobile Menu */}
                        <Link
                            href="/admin/login"
                            onClick={closeMenu}
                            className="block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
