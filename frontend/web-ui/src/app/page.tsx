'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

// Static import for critical above-the-fold content
import ServiceBanners from "@/components/ServiceBanners";

// Lazy load non-critical components
const DeliveryFeatures = dynamic(() => import('@/components/DeliveryFeatures'), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loading variant="spinner" /></div>
});

const AppDownload = dynamic(() => import('@/components/AppDownload'), {
  loading: () => <div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Critical path rendered immediately */}
      <ServiceBanners />
      
      {/* Non-critical components lazy loaded */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading variant="spinner" /></div>}>
        <DeliveryFeatures />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>}>
        <AppDownload />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loading variant="spinner" /></div>}>
        <FAQ />
      </Suspense>
    </div>
  );
}