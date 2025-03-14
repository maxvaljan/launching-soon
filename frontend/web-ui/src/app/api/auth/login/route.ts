import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route handler for login
 * Works with the backend auth system to authenticate users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    // Validate required fields
    if ((!email && !phone) || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email/phone and password are required' 
        },
        { status: 400 }
      );
    }

    // Set up Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Prepare credentials based on what was provided
    const credentials = email 
      ? { email, password } 
      : { phone, password };

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message 
        },
        { status: 401 }
      );
    }

    if (!data || !data.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No user data returned' 
        },
        { status: 500 }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')  // Get all profile fields including name and phone
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Continue anyway since we have basic user data
    }

    // Calculate expiry time
    const expiresAt = data.session.expires_at;
    const expiresIn = expiresAt 
      ? Math.floor((expiresAt * 1000 - Date.now()) / 1000)
      : 3600; // Default 1 hour

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'customer',
          name: profile?.name,
          phone: profile?.phone_number
        },
        platform: 'web',
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        session: data.session,
        expires: {
          at: expiresAt,
          in: expiresIn
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred during login' 
      },
      { status: 500 }
    );
  }
}