'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-maxmove-600">Oops, something went wrong</h1>
          <p className="mt-4 text-gray-600 max-w-md">
            The application encountered a critical error. We've been notified and are working to fix it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={reset}
              className="bg-maxmove-600 text-white px-4 py-2 rounded-lg hover:bg-maxmove-700 transition-colors"
            >
              Try again
            </button>
            <a 
              href="/"
              className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go back home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}