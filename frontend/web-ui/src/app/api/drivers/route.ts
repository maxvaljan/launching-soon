import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get all drivers (admin only)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      );
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only administrators can access driver list' },
        { status: 403 }
      );
    }

    // Get all drivers
    const { data: drivers, error: driversError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone_number, vehicle_type, status, created_at, average_rating')
      .eq('role', 'driver')
      .order('created_at', { ascending: false });

    if (driversError) {
      return NextResponse.json(
        { error: 'Error fetching drivers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error('Drivers fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Get available drivers for assignment (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageSize, location } = body;
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      );
    }

    // Allow both admins and regular users to search for available drivers
    if (profile.role !== 'admin' && profile.role !== 'user' && profile.role !== 'business') {
      return NextResponse.json(
        { error: 'You do not have permission to search for drivers' },
        { status: 403 }
      );
    }

    // Get all active drivers
    let query = supabase
      .from('profiles')
      .select('id, first_name, last_name, vehicle_type, status, average_rating')
      .eq('role', 'driver')
      .eq('status', 'active');

    // Filter by vehicle type based on package size if provided
    if (packageSize) {
      if (packageSize === 'large') {
        query = query.in('vehicle_type', ['van', 'truck']);
      } else if (packageSize === 'medium') {
        query = query.in('vehicle_type', ['car', 'van', 'truck']);
      }
      // Small packages can be delivered by any vehicle type
    }

    // In a real system, we would filter by proximity to location here
    
    const { data: availableDrivers, error: driversError } = await query;

    if (driversError) {
      return NextResponse.json(
        { error: 'Error fetching available drivers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ drivers: availableDrivers });
  } catch (error) {
    console.error('Available drivers fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}