import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define PROTECTED routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/driver-dashboard',
  '/admin',
  '/profile',
  '/account-switch',
  '/wallet',
  // Add any other routes that strictly require login
];

// Define AUTH routes (login, signup, etc.)
const authRoutes = ['/signin', '/signup', '/reset-password'];

// Define which routes require specific roles (subsets of protectedRoutes)
const roleBasedRoutes = {
  '/driver-dashboard': ['driver'], // Includes /driver-dashboard/*
  '/admin': ['admin'], // Includes /admin/*
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

    // Allow all requests for static assets, API routes, etc. (already excluded by config.matcher)
    // Handle auth callback explicitly
    if (path === '/auth/callback') {
      return NextResponse.next();
    }

    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      // Allow request to proceed but log error
    }
    const isValidSession = !!session;

    // Determine if the current route IS a protected route
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // Determine if the current route is an authentication route
    const isAuthRoute = authRoutes.includes(path);

    // --- Main Logic ---

    // 1. Unauthenticated user trying to access a PROTECTED route
    if (isProtectedRoute && !isValidSession) {
      console.log(`Redirecting unauthenticated user from protected route: ${path}`);
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      redirectUrl.searchParams.set('ts', Date.now().toString());

      const redirectResponse = NextResponse.redirect(redirectUrl);
      // Clear potential stale cookies
      redirectResponse.cookies.set('supabase-auth-token', '', { maxAge: -1 });
      redirectResponse.cookies.set('supabase-refresh-token', '', { maxAge: -1 });
      redirectResponse.headers.set('X-Auth-Required', 'true');
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache');
      return redirectResponse;
    }

    // 2. Authenticated user trying to access an AUTH route (signin/signup)
    if (isValidSession && isAuthRoute) {
      console.log(`Redirecting authenticated user from auth route: ${path}`);
      // Redirect to their appropriate dashboard
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', session.user.id)
        .single();

      let redirectUrl: string;
      if (profile?.email === 'max.valjan@icloud.com' || profile?.role === 'admin') {
        redirectUrl = '/admin';
      } else if (profile?.role === 'driver') {
        redirectUrl = '/driver-dashboard';
      } else {
        redirectUrl = '/dashboard/place-order';
      }
      const fullRedirectUrl = new URL(redirectUrl, request.url);
      fullRedirectUrl.searchParams.set('ts', Date.now().toString());
      return NextResponse.redirect(fullRedirectUrl);
    }

    // 3. Role-Based Access Control for authenticated users on specific protected routes
    if (isValidSession && isProtectedRoute) {
      let userRole: string | null = null;
      let userEmail: string | null = null;

      // Check if the route requires specific role checks
      const requiresRoleCheck = Object.keys(roleBasedRoutes).some(route => path.startsWith(route));

      if (requiresRoleCheck) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', session.user.id)
          .single();
        userRole = profile?.role;
        userEmail = profile?.email;

        // Admin override
        if (userEmail === 'max.valjan@icloud.com') {
          console.log('Admin override access granted.');
          // Allow access, skip further role checks for admin
        } else {
          // Perform standard role check
          let authorized = false;
          for (const [routePath, allowedRoles] of Object.entries(roleBasedRoutes)) {
            if (path.startsWith(routePath)) {
              if (userRole && allowedRoles.includes(userRole)) {
                authorized = true;
                break;
              }
            }
          }

          if (!authorized) {
            console.log(
              `Redirecting user with role '${userRole}' from unauthorized route: ${path}`
            );
            // Redirect to appropriate dashboard if role doesn't match
            const redirectUrl: string =
              userRole === 'driver' ? '/driver-dashboard' : '/dashboard/place-order';
            const fullRedirectUrl = new URL(redirectUrl, request.url);
            fullRedirectUrl.searchParams.set('ts', Date.now().toString());
            const redirectResponse = NextResponse.redirect(fullRedirectUrl);
            redirectResponse.headers.set('X-Access-Denied', 'true');
            return redirectResponse;
          }
        }
      }
    }

    // If none of the above conditions caused a redirect, allow the request
    console.log(`Allowing request for path: ${path}, Auth status: ${isValidSession}`);
    const res = NextResponse.next();
    res.headers.set('X-Auth-Status', isValidSession ? 'authenticated' : 'unauthenticated');
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next(); // Fallback: allow request on error
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
    '/dashboard/:path*',
    '/driver-dashboard/:path*',
  ],
};
