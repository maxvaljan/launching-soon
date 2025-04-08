'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings as SettingsIcon, User, Home, UserCog, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';

interface DashboardHeaderProps {
  isAdmin: boolean;
}

export default function DashboardHeader({ isAdmin }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('place-order');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Extract the current tab from the pathname
    const path = pathname.split('/')[2] || 'place-order';
    setActiveTab(path);
    setShowSettings(path === 'settings');
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // 1. Sign out of Supabase Auth first
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 2. Clear all client storage
      if (typeof window !== 'undefined') {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Double check for any remaining Supabase or auth related items
        [localStorage, sessionStorage].forEach(storage => {
          for (let i = storage.length - 1; i >= 0; i--) {
            const key = storage.key(i);
            if (
              key &&
              (key.startsWith('supabase.') || key.includes('auth') || key.includes('token'))
            ) {
              storage.removeItem(key);
            }
          }
        });
      }

      // 3. Call backend API to clear server-side session
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } catch (apiError) {
        console.error('API logout error:', apiError);
        // Continue with logout even if API call fails
      }

      // 4. Force a complete page reload and redirect
      // This ensures all React state is cleared
      if (typeof window !== 'undefined') {
        // Add cache buster and force flag
        const signInUrl = new URL('/signin', window.location.origin);
        signInUrl.searchParams.set('ts', Date.now().toString());
        signInUrl.searchParams.set('force', 'true');

        // Use replace instead of href to prevent back navigation
        window.location.replace(signInUrl.toString());
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Force a hard reload to signin even if there's an error
      if (typeof window !== 'undefined') {
        window.location.replace('/signin');
      }
    }
  };

  const tabs = [
    { id: 'place-order', label: 'Place Order' },
    { id: 'records', label: 'Records' },
    { id: 'wallet', label: 'Wallet' },
  ];

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className={`py-4 px-2 -mb-px font-medium text-base transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#1c2d4f] font-semibold hover:text-[#1c2d4f]'
                    : 'text-[#798390] hover:text-[#1c2d4f]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1c2d4f]" />
                )}
              </Link>
            ))}
          </div>

          {/* Navigation and Settings Buttons */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => router.push('/')}
              aria-label="Go to Home page"
            >
              <Home className="h-5 w-5" />
            </button>

            {isAdmin && (
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => router.push('/admin-dashboard')}
                aria-label="Go to Admin Dashboard"
              >
                <UserCog className="h-5 w-5" />
              </button>
            )}

            <button
              className={`p-2 rounded-md transition-colors relative ${
                showSettings
                  ? 'text-maxmove-primary hover:text-maxmove-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={handleSettingsClick}
              aria-label="Open Settings"
            >
              <SettingsIcon className="h-5 w-5" />
              {showSettings && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-maxmove-primary" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-maxmove-navy/10 hover:bg-maxmove-navy/15 text-maxmove-navy hover:text-maxmove-navy transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={() => router.push('/profile')}
                  className="py-2.5 flex items-center gap-2.5"
                >
                  <User className="h-4 w-4 text-maxmove-navy/70" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push('/account-switch')}
                  className="py-2.5 flex items-center gap-2.5"
                >
                  <svg
                    className="h-4 w-4 text-maxmove-navy/70"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 3 L8 21" />
                    <path d="M21 3h-6l2 4" />
                    <path d="M3 21h6l-2-4" />
                  </svg>
                  <span>Switch Account Type</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push('/dashboard/settings')}
                  className="py-2.5 flex items-center gap-2.5"
                >
                  <Settings className="h-4 w-4 text-maxmove-navy/70" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="py-2.5 flex items-center gap-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
