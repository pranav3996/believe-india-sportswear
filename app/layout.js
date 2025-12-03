'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');
    const isUserRoute = pathname?.startsWith('/user');

    return (
        <html lang="en">
            <head>
                <title>Believe India Sportswear - Premium Sports Apparel</title>
                <meta name="description" content="Crafting excellence in every stitch. Your trusted partner for high-quality custom sportswear and athletic apparel." />
                <meta name="keywords" content="sportswear, athletic apparel, custom sportswear, sports clothing, India sportswear manufacturer" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icon-96x96.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icon-96x96.png" />
                <link rel="shortcut icon" href="/icon-96x96.png" />
                <link rel="apple-touch-icon" href="/icon-96x96.png" />
                <link rel="apple-touch-icon-precomposed" href="/icon-96x96.png" />
                <meta property="og:title" content="Believe India Sportswear" />
                <meta property="og:description" content="Crafting excellence in every stitch. Your trusted partner for high-quality custom sportswear and athletic apparel." />
                <meta property="og:type" content="website" />
            </head>
            <body className="bg-gradient-to-br from-gray-50 to-gray-100">
                <Providers>
                    {!isAdminRoute && !isUserRoute && <Header />}
                    {children}
                    {!isAdminRoute && !isUserRoute && <Footer />}
                    {!isAdminRoute && !isUserRoute && <WhatsAppButton />}
                </Providers>
            </body>
        </html>
    );
}
