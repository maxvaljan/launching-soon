'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

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

export default function ClientSections() {
  return (
    <>
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
    </>
  );
}