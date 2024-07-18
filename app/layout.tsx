import type { Metadata } from 'next';
import { Arima } from 'next/font/google';
import './globals.css';
import ScrollToTop from './_components/shared/ScrollToTop';

const arima = Arima({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Book Finder',
    description: 'Find your favorite book/books and buy it.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={arima.className}>
                {children}
                <ScrollToTop />
            </body>
        </html>
    );
}
