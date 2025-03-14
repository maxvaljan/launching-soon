'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const accountType = searchParams.get('type') || 'personal';
  
  return (
    <Card className="w-full max-w-md p-8 text-center bg-maxmove-100/50 backdrop-blur-sm border-0 shadow-md">
      <div className="h-20 w-20 mx-auto mb-6 bg-green-100 flex items-center justify-center rounded-full">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-green-600" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-maxmove-900 mb-2">
        Registration Complete!
      </h2>
      
      <p className="text-maxmove-700 mb-6">
        {email ? (
          <>We've sent a confirmation link to <span className="font-medium">{email}</span>.</>
        ) : (
          <>Your account has been created successfully.</>
        )}
      </p>
      
      {accountType === 'driver' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 text-left">
          <h3 className="text-amber-800 font-medium mb-2">Next steps:</h3>
          <ol className="list-decimal list-inside text-amber-700 space-y-1">
            <li>Verify your email by clicking the link we sent you</li>
            <li>Complete your driver profile with vehicle details</li>
            <li>Upload necessary documents (driver's license, insurance, etc.)</li>
            <li>Our team will review your application and approve your account</li>
          </ol>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <p className="text-maxmove-600">
            Please verify your email to complete your registration. After verification, you can sign in to your account.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <Button asChild className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white">
          <Link href="/signin">
            Continue to Sign In
          </Link>
        </Button>
        
        <div className="text-sm text-maxmove-600">
          Need help? <Link href="/contact" className="text-maxmove-700 hover:text-maxmove-900 underline">Contact support</Link>
        </div>
      </div>
    </Card>
  );
}

export default function SignUpSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-maxmove-50 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md p-8 text-center bg-maxmove-100/50 backdrop-blur-sm border-0 shadow-md">
          <div className="h-20 w-20 mx-auto mb-6 bg-green-100 flex items-center justify-center rounded-full">
            <svg className="h-10 w-10 text-green-600 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-maxmove-900 mb-2">
            Loading...
          </h2>
        </Card>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}