'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Image from 'next/image';

export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Failed to initiate Google sign in');
      }

      // This will redirect the user to Google sign in
      // When successful, it will redirect back to our redirectTo URL
      // which should handle the authentication
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-2.5 h-11 text-sm font-medium text-gray-700 rounded-md"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Image
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="object-contain"
      />
      <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
    </Button>
  );
};
