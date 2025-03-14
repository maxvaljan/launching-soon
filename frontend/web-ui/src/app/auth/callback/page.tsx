'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No code provided');
        }

        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }

        if (!data.user) {
          throw new Error('Authentication failed');
        }

        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        toast.success('Successfully signed in!');

        // Redirect based on role
        if (profile?.role === 'driver') {
          router.push('/driver-dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Error during OAuth callback:', error);
        toast.error(error.message || 'Authentication failed');
        router.push('/signin');
      }
    };

    handleOAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maxmove-100 to-maxmove-200">
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin h-8 w-8 border-4 border-maxmove-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-maxmove-900 mb-2">Authenticating...</h2>
        <p className="text-maxmove-600">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maxmove-100 to-maxmove-200">
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin h-8 w-8 border-4 border-maxmove-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-maxmove-900 mb-2">Loading...</h2>
          <p className="text-maxmove-600">Please wait a moment.</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}