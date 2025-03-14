import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      accountType,
      companyName,
      companySize,
      vehicleType,
      driverLicense
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Determine role based on account type
    let role = 'user';
    if (accountType === 'business') {
      role = 'business';
    } else if (accountType === 'driver') {
      role = 'driver';
    }

    // Create profile in profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role: role,
          company_name: companyName || null,
          company_size: companySize || null,
          vehicle_type: vehicleType || null,
          driver_license: driverLicense || null,
          account_type: accountType,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        // If profile creation fails, we should ideally delete the auth user
        // but Supabase doesn't provide a direct API for this
        console.error('Profile creation error:', profileError);
        return NextResponse.json(
          { error: 'Error creating user profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      user: authData.user,
      message: 'Registration successful. Please check your email for verification.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}