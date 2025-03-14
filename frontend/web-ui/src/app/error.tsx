'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-maxmove-600">Something went wrong</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        We're sorry, but something went wrong on our end. Our team has been notified and is working to fix the issue.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}