'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavbarDesktopMenu from "./navbar/NavbarDesktopMenu";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";
import { apiClient } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // The conditional rendering is now handled by the NavWrapper component

  // Define dark background routes
  const darkBackgroundRoutes = ["/", "/investment", "/roadmap", "/business"];
  const isDarkBackground = darkBackgroundRoutes.includes(pathname || '');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

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
              accessToken: localStorage.getItem('auth_token'),
              refreshToken: localStorage.getItem('auth_refresh_token')
            });
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
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
      } = supabase.auth.onAuthStateChange((_event, session) => {
        // When auth state changes, re-check our status
        checkAuthStatus();
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error("Error initializing auth:", error);
      return () => {
        window.removeEventListener("scroll", handleScroll);
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
      console.log("Signing out...");
      
      // 1. First clear client storage immediately (don't wait for server)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_expires_at');
        localStorage.removeItem('auth_expires_in');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        
        // Also clear any Supabase-related items
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('supabase.') || key.includes('auth') || key.includes('token'))) {
            localStorage.removeItem(key);
          }
        }
        
        // Also clear sessionStorage
        sessionStorage.clear();
      }
      
      // 2. Also sign out of Supabase Auth directly
      await supabase.auth.signOut();
      
      // 3. Finally, call our backend API to clear server-side session
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies
        });
      } catch (apiError) {
        console.error("API logout error:", apiError);
        // Continue with local logout even if API fails
      }
      
      // 4. Set session state to null
      setSession(null);
      
      // 5. Force a hard redirect to clear any React state
      console.log("Redirecting to signin page...");
      window.location.href = "/signin?ts=" + new Date().getTime();
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Fallback - force redirect even if errors occur
      if (typeof window !== 'undefined') {
        window.location.href = "/signin";
      }
    }
  };

  const getTextColor = () => {
    if (isDarkBackground) {
      return isScrolled ? "text-maxmove-700 hover:text-maxmove-900" : "text-maxmove-secondary hover:text-maxmove-secondary/80";
    }
    return "text-maxmove-700 hover:text-maxmove-900";
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className={`text-2xl font-bold transition-colors ${
                isDarkBackground 
                  ? isScrolled ? "text-maxmove-900" : "text-maxmove-secondary"
                  : "text-maxmove-900"
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
              className={isDarkBackground ? (isScrolled ? "text-maxmove-900" : "text-maxmove-secondary") : "text-maxmove-900"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <NavbarMobileMenu
            session={session}
            handleSignOut={handleSignOut}
            navigate={router}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;