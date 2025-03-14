'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (!session) {
          // Use window.location for a hard redirect to ensure complete state reset
          window.location.href = "/signin";
          return;
        }

        // Check user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');

        if (profile?.role === 'driver') {
          toast.error("Access Denied: Drivers should use the driver dashboard.");
          router.push("/driver-dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        toast.error("Authentication error. Please sign in again.");
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Use window.location for a hard redirect
        window.location.href = "/signin";
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maxmove-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="h-screen flex flex-col">
        {/* Custom Dashboard Header */}
        <DashboardHeader session={session} isAdmin={isAdmin} />

        {/* Content */}
        <div className="p-4 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}