import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import dynamic from 'next/dynamic';

// Static import for critical above-the-fold content
import ServiceBanners from "@/components/ServiceBanners";
import ClientSections from './client-sections';

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
      
      {/* Non-critical components moved to client component */}
      <ClientSections />
    </div>
  );
}