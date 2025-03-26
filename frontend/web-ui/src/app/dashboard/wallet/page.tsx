'use client';

import { Suspense } from "react";
import WalletSection from "@/components/wallet/WalletSection";
import { Skeleton } from "@/components/ui/skeleton";

// Simple loading state
const WalletSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-[300px] w-full rounded-lg" />
  </div>
);

export default function WalletPage() {
  return (
    <Suspense fallback={<WalletSkeleton />}>
      <WalletSection />
    </Suspense>
  );
}