'use client';

import { Suspense } from 'react';
import { SignUpCard } from '@/components/signup/SignUpCard';

function SignUpContent() {
  return <SignUpCard />;
}

export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-maxmove-navy"></div>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
