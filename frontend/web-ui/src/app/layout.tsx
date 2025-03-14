import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import NavWrapper from '@/components/layouts/NavWrapper';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { ResponsiveCheck } from '@/components/ui/responsive-check';

// Load fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: {
    default: 'MaxMove | Your Logistics Partner',
    template: '%s | MaxMove',
  },
  description: 'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
  keywords: ['logistics', 'delivery', 'package delivery', 'same-day delivery', 'Germany', 'shipping'],
  authors: [{ name: 'MaxMove Team' }],
  creator: 'MaxMove',
  publisher: 'MaxMove GmbH',
  openGraph: {
    type: 'website',
    locale: 'en_DE',
    url: 'https://maxmove.com',
    siteName: 'MaxMove',
    title: 'MaxMove | Your Logistics Partner',
    description: 'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MaxMove - Your Logistics Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaxMove | Your Logistics Partner',
    description: 'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
    images: ['/images/twitter-image.jpg'],
    creator: '@maxmove',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification=your-google-verification-code',
  },
  alternates: {
    canonical: 'https://maxmove.com',
    languages: {
      'en-US': 'https://maxmove.com/en',
      'de-DE': 'https://maxmove.com/de',
    },
  },
  metadataBase: new URL('https://maxmove.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased text-foreground bg-background`}>
        <Providers>
          {process.env.NODE_ENV === 'development' && <ResponsiveCheck />}
          <NavWrapper>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </NavWrapper>
          <Toaster 
            position="top-right" 
            closeButton
            richColors
            toastOptions={{
              className: "rounded-md shadow-blue-md border border-solid",
              duration: 4000,
              style: {
                fontFamily: 'var(--font-inter)',
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}