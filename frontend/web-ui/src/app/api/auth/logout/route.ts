import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Handles user logout by:
 * 1. Invalidating the session on Supabase Auth server
 * 2. Clearing auth cookies on the server side
 * 3. Setting a special header to instruct client to clear localStorage
 */
export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Sign the user out of Supabase Auth
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error during Supabase sign out:', error);
      // Still attempt to clear cookies even if Supabase signout fails
    }

    // Create a response that both returns success and helps clear cookies
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    // Explicitly clear auth-related cookies
    response.cookies.set('supabase-auth-token', '', { maxAge: -1 });
    response.cookies.set('supabase-refresh-token', '', { maxAge: -1 });
    // Add any other relevant cookie names here if used
    cookieStore.getAll().forEach(cookie => {
      if (
        cookie.name.toLowerCase().includes('supabase') ||
        cookie.name.toLowerCase().includes('auth')
      ) {
        response.cookies.set(cookie.name, '', { maxAge: -1 });
      }
    });

    // Set special headers to instruct the client to clear localStorage items
    response.headers.set('X-Auth-Logout', 'true');

    // Add cache control headers to ensure this response isn't cached
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Attempt to clear cookies even in case of unexpected errors
    const errorResponse = NextResponse.json(
      { error: 'An unexpected error occurred during logout' },
      { status: 500 }
    );
    errorResponse.cookies.set('supabase-auth-token', '', { maxAge: -1 });
    errorResponse.cookies.set('supabase-refresh-token', '', { maxAge: -1 });
    return errorResponse;
  }
}
