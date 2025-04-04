import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import NavWrapper from '@/components/layouts/NavWrapper';
import FooterWrapper from '@/components/layouts/FooterWrapper';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { ResponsiveCheck } from '@/components/ui/responsive-check';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'MaxMove | Smart Logistics',
    template: '%s | MaxMove',
  },
  description:
    'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
  keywords: [
    'logistics',
    'delivery',
    'package delivery',
    'same-day delivery',
    'Germany',
    'shipping',
  ],
  authors: [{ name: 'MaxMove Team' }],
  creator: 'MaxMove',
  publisher: 'MaxMove GmbH',
  openGraph: {
    type: 'website',
    locale: 'en_DE',
    url: 'https://maxmove.com',
    siteName: 'MaxMove',
    title: 'MaxMove | Smart Logistics',
    description:
      'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
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
    title: 'MaxMove | Smart Logistics',
    description:
      'MaxMove is a modern logistics platform connecting customers with reliable drivers for efficient delivery services across Germany.',
    images: ['/images/twitter-image.jpg'],
    creator: '@maxmove',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000F33',
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
    <html lang="en" className="scroll-smooth no-horizontal-scroll">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased text-foreground bg-background no-horizontal-scroll`}
      >
        <Providers>
          {process.env.NODE_ENV === 'development' && <ResponsiveCheck />}
          <NavWrapper>
            <FooterWrapper>
              <div className="flex flex-col min-h-screen no-horizontal-scroll">
                <div className="flex-grow">{children}</div>
              </div>
            </FooterWrapper>
          </NavWrapper>
          <SonnerToaster
            position="top-right"
            closeButton
            richColors
            toastOptions={{
              className: 'rounded-md shadow-blue-md border border-solid',
              duration: 4000,
              style: {
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
