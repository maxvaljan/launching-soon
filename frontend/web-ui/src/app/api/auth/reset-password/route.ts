import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use Supabase's password reset functionality
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.nextUrl.origin}/auth/callback?next=/reset-password-confirm`,
    });
    
    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { message: 'Password reset email sent' },
    });
  } catch (error: any) {
    console.error('Unexpected error in reset password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}