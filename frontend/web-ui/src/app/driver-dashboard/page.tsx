'use client';

import dynamic from 'next/dynamic';

// Lazy load the heavy DriverDashboard component
const DriverDashboard = dynamic(() => import('@/components/driver/DriverDashboard'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading driver dashboard...</div>,
  ssr: false // Use false because this component uses browser-specific features
});
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DriverDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data?.session?.user) {
          router.replace('/signin');
          return;
        }
        
        // Check if user is a driver
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (profile?.role !== 'driver') {
          toast.error('Access denied. You need a driver account to view this page.');
          router.replace('/dashboard');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking user session:', error);
        router.replace('/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-maxmove-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return <DriverDashboard />;
}