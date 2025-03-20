import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

// Static import for critical above-the-fold content
import ServiceBanners from "@/components/ServiceBanners";

// Export static metadata for better SEO
export const metadata = {
  title: "MaxMove - Fast, Simple, Affordable Delivery",
  description: "MaxMove connects customers with reliable drivers for fast, efficient delivery services across Germany. Book your delivery today!",
  keywords: ["delivery", "logistics", "courier", "shipping", "MaxMove", "Germany"],
};

// Dynamic import with preloading for waitlist component
const WaitlistSignup = dynamic(() => import('@/components/waitlist/waitlist-signup'), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loading variant="spinner" /></div>,
  ssr: true, // Enable server-side rendering for SEO and initial load performance
});

// Dynamic imports with chunking for below-the-fold content
const DeliveryFeatures = dynamic(() => import('@/components/DeliveryFeatures'), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loading variant="spinner" /></div>,
  ssr: false, // Disable SSR for this component as it's below the fold
});

const AppDownload = dynamic(() => import('@/components/AppDownload'), {
  loading: () => <div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>,
  ssr: false,
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>,
  ssr: false,
});

// Make home page a server component for better performance
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Critical path rendered immediately */}
      <ServiceBanners />
      
      {/* Waitlist section - server rendered for better initial load */}
      <Suspense fallback={<div className="flex items-center justify-center"><Loading variant="spinner" /></div>}>
        <WaitlistSignup />
      </Suspense>
      
      {/* Non-critical components lazy loaded with client-side hydration */}
      <div className="w-full bg-maxmove-navy">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading variant="spinner" /></div>}>
          <div className="max-w-6xl mx-auto">
            <DeliveryFeatures />
          </div>
        </Suspense>
      </div>
      
      <div className="w-full bg-maxmove-creme">
        <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>}>
          <div className="max-w-7xl mx-auto">
            <AppDownload />
          </div>
        </Suspense>
      </div>
      
      <div className="w-full bg-maxmove-creme">
        <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>}>
          <FAQ />
        </Suspense>
      </div>
    </div>
  );
}