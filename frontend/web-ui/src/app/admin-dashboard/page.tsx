'use client';

import dynamic from 'next/dynamic';

// Lazy load the heavy AdminDashboard component
const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>,
  ssr: false // Use false because this component uses browser-specific features like localStorage
});
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageLoading } from '@/components/ui/loading';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

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
        
        // Check if user is an admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (profile?.role !== 'admin') {
          toast.error('Access denied. You need admin permissions to view this page.');
          router.replace('/dashboard');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking user session:', error);
        toast.error('Could not verify your admin privileges.');
        router.replace('/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  if (loading) {
    return <PageLoading message="Verifying admin access..." />;
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return <AdminDashboard />;
}