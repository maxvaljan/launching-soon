'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  ListChecks,
  BarChart,
  Settings,
  LogOut,
  Truck,
  MessageSquare,
  FileText,
  LineChart,
  HardDrive,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return <PageLoading message="Verifying admin access..." />;
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 bg-white border-r shadow-sm">
        <div className="flex flex-col h-full p-4">
          <div className="space-y-1 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
              <div className="space-y-1">
                <Link href="/admin" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="/admin/users" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>
                <Link href="/admin/orders" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Orders
                </Link>
                <Link href="/admin/analytics" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
                <Link href="/admin/vehicles" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <Truck className="mr-2 h-4 w-4" />
                  Vehicles
                </Link>
                <Link href="/admin/support" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Support
                </Link>
                <Link href="/admin/finance" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <LineChart className="mr-2 h-4 w-4" />
                  Finance
                </Link>
                <Link href="/admin/marketing" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Marketing
                </Link>
                <Link href="/admin/documents" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <HardDrive className="mr-2 h-4 w-4" />
                  Documents
                </Link>
                <Link href="/admin/monitoring" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Monitoring
                </Link>
                <Link href="/admin/settings" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100 text-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-64 flex-1">
        <main>{children}</main>
      </div>
    </div>
  );
}