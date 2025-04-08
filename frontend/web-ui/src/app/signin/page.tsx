'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SignInCard } from '@/components/signin/SignInCard';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const handleInitialLoad = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const isForced = searchParams.get('force') === 'true';

        if (isForced) {
          // Clear any remaining auth state
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // If we have a session and this was a forced sign out, sign out again
          if (isForced) {
            await supabase.auth.signOut();
            return;
          }

          // Otherwise handle normal session redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'driver') {
            router.replace('/driver-dashboard');
          } else if (profile?.role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/dashboard/place-order');
          }
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      }
    };

    handleInitialLoad();
  }, [router]);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => (window.location.href = '/')}
        className="absolute top-4 left-4 z-10 text-maxmove-800 hover:text-maxmove-900 hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>

      <div className="flex-1 flex w-full h-full">
        <SignInCard />
      </div>
    </div>
  );
}
