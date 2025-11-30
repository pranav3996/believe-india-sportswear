import './globals.css';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';


export const metadata = {
    title: 'Believe India Sportswear - Premium Sports Apparel',
    description: 'Crafting excellence in every stitch. Your trusted partner for high-quality custom sportswear and athletic apparel.',
    keywords: 'sportswear, athletic apparel, custom sportswear, sports clothing, India sportswear manufacturer',
    icons: {
        icon: [
            { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icon-96x96.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-96x96.png', sizes: '16x16', type: 'image/png' },
        ],
        shortcut: '/icon-96x96.png',
        apple: '/icon-96x96.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/icon-96x96.png',
        },
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
                    <WhatsAppButton />
                </Providers>
            </body>
        </html>
    );
}
