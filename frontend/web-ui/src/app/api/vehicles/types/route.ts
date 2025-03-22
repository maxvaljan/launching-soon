import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/auth';

// GET /api/vehicles/types - Get all vehicle types
export async function GET(request: NextRequest) {
  try {
    // Create a server-side Supabase client
    const supabaseClient = await createServerSupabaseClient();
    
    // Parse query params for active filter
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    // Build query
    let query = supabaseClient
      .from('vehicle_types')
      .select('*')
      .order('created_at', { ascending: false }); // No display_order in DB, use created_at
      
    // Apply active filter if specified
    if (activeOnly) {
      query = query.eq('active', true);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching vehicle types:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch vehicle types' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error in GET /api/vehicles/types:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/vehicles/types - Create a new vehicle type
export async function POST(request: NextRequest) {
  try {
    // Check user authentication and admin role
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' }, 
        { status: 403 }
      );
    }
    
    // Create a server-side Supabase client
    const supabaseClient = await createServerSupabaseClient();
    
    // Parse request body
    const vehicleData = await request.json();
    
    // Log the received data for debugging
    console.log('Creating vehicle with data:', vehicleData);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'max_dimensions', 'max_weight'];
    for (const field of requiredFields) {
      if (!vehicleData[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` }, 
          { status: 400 }
        );
      }
    }
    
    // Ensure numeric fields are properly formatted
    const numericFields = ['base_price', 'price_per_km', 'minimum_distance'];
    for (const field of numericFields) {
      if (vehicleData[field] !== undefined) {
        vehicleData[field] = Number(vehicleData[field]);
      }
    }
    
    // Set defaults for optional fields
    vehicleData.active = vehicleData.active !== undefined ? vehicleData.active : true;
    
    // Insert new vehicle type
    const { data, error } = await supabaseClient
      .from('vehicle_types')
      .insert([vehicleData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating vehicle type:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to create vehicle type' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/vehicles/types:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 