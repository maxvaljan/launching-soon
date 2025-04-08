'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarDesktopMenu from './navbar/NavbarDesktopMenu';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import NavbarUserMenu from './navbar/NavbarUserMenu';
import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface CustomSession {
  user?: {
    email?: string;
    role?: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<CustomSession | null>(null);
  const pathname = usePathname();

  // Define dark background routes
  const darkBackgroundRoutes = ['/', '/investment', '/business'];
  const isDarkBackground = darkBackgroundRoutes.includes(pathname || '');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Use our API client to check authentication
    const checkAuthStatus = async () => {
      try {
        // Verify if the user is authenticated
        if (apiClient.auth.isAuthenticated()) {
          // If we have a valid token, get user session info
          const { success, isAuthenticated, user } = await apiClient.auth.verifySession();

          if (success && isAuthenticated && user) {
            // Create a session-like object for compatibility
            setSession({
              user: user,
              accessToken: localStorage.getItem('auth_token') || undefined,
              refreshToken: localStorage.getItem('auth_refresh_token') || undefined,
            });
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setSession(null);
      }
    };

    // Check auth status immediately
    checkAuthStatus();

    // Also set up a Supabase listener as a backup
    // This helps in case the user authenticates in another tab
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        // When auth state changes, re-check our status
        checkAuthStatus();
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  /**
   * Sign-out function that directly works with both our API and Supabase
   * This fixes sign-out issues by doing both client and server logout
   */
  const handleSignOut = async () => {
    try {
      setIsMobileMenuOpen(false); // Close mobile menu if open
      console.log('Signing out...');

      // 1. First clear all client storage immediately
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.clear();

        // Clear sessionStorage
        sessionStorage.clear();

        // Also specifically clear any Supabase or auth related items
        for (const storage of [localStorage, sessionStorage]) {
          for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (
              key &&
              (key.startsWith('supabase.') || key.includes('auth') || key.includes('token'))
            ) {
              storage.removeItem(key);
            }
          }
        }
      }

      // 2. Sign out of Supabase Auth
      await supabase.auth.signOut();

      // 3. Call our backend API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
      });

      // 4. Force a hard redirect to sign in page with cache buster
      const signInUrl = new URL('/signin', window.location.origin);
      signInUrl.searchParams.set('ts', Date.now().toString()); // Add cache buster
      window.location.href = signInUrl.toString();
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, force redirect to ensure user is logged out
      window.location.href = '/signin';
    }
  };

  const getTextColor = () => {
    if (isDarkBackground) {
      return isScrolled
        ? 'text-maxmove-navy hover:text-maxmove-blue'
        : 'text-maxmove-creme hover:text-white';
    }
    return 'text-maxmove-navy hover:text-maxmove-blue';
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      style={{
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className={`text-2xl font-bold ${
                isDarkBackground
                  ? isScrolled
                    ? 'text-maxmove-navy hover:text-maxmove-blue'
                    : 'text-maxmove-creme hover:text-white'
                  : 'text-maxmove-navy hover:text-maxmove-blue'
              }`}
            >
              Maxmove
            </Link>
          </div>

          <NavbarDesktopMenu getTextColor={getTextColor} />

          <NavbarUserMenu
            session={session}
            handleSignOut={handleSignOut}
            getTextColor={getTextColor}
            isHomePage={isDarkBackground}
            isScrolled={isScrolled}
          />

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-full p-2 ${
                isDarkBackground
                  ? isScrolled
                    ? 'text-maxmove-navy hover:bg-maxmove-navy/10'
                    : 'text-maxmove-creme hover:bg-white/10'
                  : 'text-maxmove-navy hover:bg-maxmove-navy/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <NavbarMobileMenu
            session={session}
            handleSignOut={handleSignOut}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
