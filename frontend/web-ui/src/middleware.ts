import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define which routes require authentication
const protectedRoutes = [
  '/dashboard',
  '/driver-dashboard',
  '/admin-dashboard',
  '/profile',
  '/account-switch',
  '/wallet',
];

// Public routes that should always be accessible
const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/reset-password',
  '/about',
  '/contact',
  '/terms',
  '/privacy-policy',
  '/cookie-policy',
  '/auth/callback',
];

// Define which routes require specific roles
const roleBasedRoutes = {
  '/driver-dashboard': ['driver'],
  '/admin-dashboard': ['admin'],
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
    // Create a Supabase client configured to use cookies
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle auth callback route - this must be allowed to proceed
    if (path === '/auth/callback') {
      return res;
    }

    // Session validation - check if session exists and is not expired
    const isValidSession = !!session && 
                           !!session.user && 
                           !!session.expires_at && 
                           session.expires_at * 1000 > Date.now();

    // Check if the path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAuthRoute = path === '/signin' || path === '/signup' || path === '/reset-password';

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
      
      // Add response headers to instruct client to clear local storage
      redirectResponse.headers.set('X-Auth-Required', 'true');
      return redirectResponse;
    }

    // Authenticated user with valid session trying to access auth routes
    if (isValidSession && isAuthRoute) {
      // Determine where to redirect based on user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // Create redirect response with cache-busting
      let redirectUrl: string;
      
      if (profile?.role === 'driver') {
        redirectUrl = '/driver-dashboard';
      } else if (profile?.role === 'admin') {
        redirectUrl = '/admin-dashboard';
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
            .select('role')
            .eq('id', session.user.id)
            .single();

          // If user doesn't have the required role, redirect them
          if (!profile || !allowedRoles.includes(profile.role)) {
            // Redirect to appropriate dashboard based on role
            let redirectUrl: string;
            
            if (profile?.role === 'driver') {
              redirectUrl = '/driver-dashboard';
            } else {
              redirectUrl = '/dashboard/place-order'; // More specific than just /dashboard
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
    res.headers.set('X-Auth-Status', isValidSession ? 'authenticated' : 'unauthenticated');
    
    return res;
  } catch (e) {
    // If there's an error, log it and proceed without blocking the request
    console.error('Middleware authentication error:', e);
    
    // Build a safe response that doesn't expose error details to client
    const errorResponse = NextResponse.next();
    errorResponse.headers.set('X-Auth-Error', 'true');
    
    return errorResponse;
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
  ],
};