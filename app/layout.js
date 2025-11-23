import './globals.css';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Believe India Sportswear - Premium Sports Apparel',
    description: 'Crafting excellence in every stitch. Your trusted partner for high-quality custom sportswear and athletic apparel.',
    keywords: 'sportswear, athletic apparel, custom sportswear, sports clothing, India sportswear manufacturer',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    openGraph: {
        title: 'Believe India Sportswear',
        description: 'Crafting excellence in every stitch. Your trusted partner for high-quality custom sportswear and athletic apparel.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gradient-to-br from-gray-50 to-gray-100">
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
