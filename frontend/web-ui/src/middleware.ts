import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define which routes require specific roles
const roleBasedRoutes = {
  '/driver-dashboard': ['driver'],
  '/admin': ['admin'],
};

/**
 * Authentication and authorization middleware for Next.js
 * This middleware handles:
 * 1. Protection of routes that require authentication
 * 2. Role-based access control
 * 3. Redirection of authenticated users from auth pages
 * 4. Session validation and expiry handling
 */
export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    // Get Supabase instance
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    // Check if we have a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error fetching session:', sessionError);
    }

    const isValidSession = !!session;

    // Handle auth callback route - this must be allowed to proceed
    if (path === '/auth/callback') {
      return NextResponse.next();
    }

    // Check if the current path is a protected route
    const isProtectedRoute = ![
      '/signin',
      '/signup',
      '/auth/callback',
      '/',
      '/about',
      '/contact',
      '/terms',
      '/privacy-policy',
      '/cookie-policy',
    ].some(publicRoute => path === publicRoute || path.startsWith(`${publicRoute}/`));

    // Unauthenticated user trying to access protected route
    if (isProtectedRoute && !isValidSession) {
      // Store the intended destination to redirect after login
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      redirectUrl.searchParams.set('ts', Date.now().toString()); // Add cache buster

      // Clear auth cookies to ensure no stale data
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.cookies.delete('supabase-auth-token');
      redirectResponse.cookies.delete('supabase-refresh-token');

      // Clear all Supabase-related cookies
      const cookiesToClear = request.cookies
        .getAll()
        .filter(
          cookie =>
            cookie.name.toLowerCase().includes('supabase') ||
            cookie.name.toLowerCase().includes('auth')
        );

      cookiesToClear.forEach(cookie => {
        redirectResponse.cookies.delete(cookie.name);
      });

      // Add response headers to instruct client to clear local storage
      redirectResponse.headers.set('X-Auth-Required', 'true');
      redirectResponse.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      redirectResponse.headers.set('Pragma', 'no-cache');
      redirectResponse.headers.set('Expires', '0');

      return redirectResponse;
    }

    // Authenticated user with valid session trying to access auth routes
    if (
      isValidSession &&
      (path === '/signin' || path === '/signup' || path === '/reset-password')
    ) {
      // Determine where to redirect based on user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', session.user.id)
        .single();

      // Create redirect response with cache-busting
      let redirectUrl: string;

      // First check for the specific admin email account
      if (profile?.email === 'max.valjan@icloud.com' || profile?.role === 'admin') {
        redirectUrl = '/admin';
      } else if (profile?.role === 'driver') {
        redirectUrl = '/driver-dashboard';
      } else {
        redirectUrl = '/dashboard/place-order';
      }

      // Add cache busting parameter
      const fullRedirectUrl = new URL(redirectUrl, request.url);
      fullRedirectUrl.searchParams.set('ts', Date.now().toString());

      return NextResponse.redirect(fullRedirectUrl);
    }

    // Role-based access control
    if (isValidSession) {
      for (const [routePath, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (path.startsWith(routePath)) {
          // Get the user's role from the profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('id', session.user.id)
            .single();

          // Special handling for max.valjan@icloud.com - always allowed admin access
          if (profile?.email === 'max.valjan@icloud.com' && routePath === '/admin') {
            break; // Allow access
          }

          // If user doesn't have the required role, redirect them
          if (!profile || !allowedRoles.includes(profile.role)) {
            // Redirect to appropriate dashboard based on role
            let redirectUrl: string;

            if (profile?.role === 'driver') {
              redirectUrl = '/driver-dashboard';
            } else {
              redirectUrl = '/dashboard/place-order';
            }

            // Add cache busting parameter
            const fullRedirectUrl = new URL(redirectUrl, request.url);
            fullRedirectUrl.searchParams.set('ts', Date.now().toString());

            const redirectResponse = NextResponse.redirect(fullRedirectUrl);
            redirectResponse.headers.set('X-Access-Denied', 'true');
            return redirectResponse;
          }
        }
      }
    }

    // Add the user's session status to response headers for client-side awareness
    const res = NextResponse.next();
    res.headers.set('X-Auth-Status', isValidSession ? 'authenticated' : 'unauthenticated');

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    '/admin/:path*', // Explicitly match all admin routes
  ],
};
