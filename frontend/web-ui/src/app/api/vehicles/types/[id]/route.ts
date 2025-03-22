import { NextRequest, NextResponse } from 'next/server';
import { supabase, createSupabaseClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

// GET /api/vehicles/types/[id] - Get a vehicle type by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Create a consistent Supabase client
    const supabaseClient = createSupabaseClient();

    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseClient
      .from('vehicle_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Vehicle type not found' },
          { status: 404 }
        );
      }
      
      console.error(`Error fetching vehicle type ${id}:`, error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch vehicle type' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(`Error in GET /api/vehicles/types/[id]:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/vehicles/types/[id] - Update a vehicle type
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check user authentication and admin role
    const user = await getCurrentUser();
    
    // Log auth status for debugging
    console.log(`Vehicle update attempt for ID ${id}`, { 
      authenticated: !!user,
      userRole: user?.role,
      userId: user?.id
    });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin role required' },
        { status: 403 }
      );
    }
    
    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Create a consistent Supabase client
    const supabaseClient = createSupabaseClient();
    
    // Parse request body
    const vehicleData = await request.json();
    
    // Ensure numeric fields are properly formatted
    const numericFields = ['base_price', 'price_per_km', 'minimum_distance', 'display_order'];
    for (const field of numericFields) {
      if (vehicleData[field] !== undefined) {
        vehicleData[field] = Number(vehicleData[field]);
      }
    }
    
    // Update vehicle type
    const { data, error } = await supabaseClient
      .from('vehicle_types')
      .update(vehicleData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating vehicle: ${error.message}`);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to update vehicle' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in PUT /api/vehicles/types/[id]:', error);
    
    // Provide more detailed error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Internal server error';
      
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles/types/[id] - Delete a vehicle type by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check user authentication and admin role
    const user = await getCurrentUser();
    
    // Log auth status for debugging
    console.log(`Vehicle delete attempt for ID ${id}`, { 
      authenticated: !!user,
      userRole: user?.role,
      userId: user?.id
    });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin role required' },
        { status: 403 }
      );
    }
    
    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Create a consistent Supabase client
    const supabaseClient = createSupabaseClient();
    
    // Check if vehicle exists
    const { data: existingVehicle, error: checkError } = await supabaseClient
      .from('vehicle_types')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existingVehicle) {
      const errorMessage = checkError ? checkError.message : 'Vehicle not found';
      console.error(`Error checking vehicle existence: ${errorMessage}`);
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: checkError?.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    // Check if vehicle is referenced in orders
    const { count: orderCount, error: orderError } = await supabaseClient
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('vehicle_type_id', id);
    
    if (orderError) {
      console.error(`Error checking vehicle references in orders: ${orderError.message}`);
      return NextResponse.json(
        { success: false, message: 'Error checking if vehicle is in use' },
        { status: 500 }
      );
    }
    
    // Prevent deletion if vehicle is used in orders
    if (orderCount && orderCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete vehicle that is used in orders' },
        { status: 400 }
      );
    }
    
    // Delete the vehicle
    const { error: deleteError } = await supabaseClient
      .from('vehicle_types')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error(`Error deleting vehicle: ${deleteError.message}`);
      return NextResponse.json(
        { success: false, message: deleteError.message || 'Failed to delete vehicle' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/vehicles/types/[id]:', error);
    
    // Provide more detailed error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Internal server error';
      
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 