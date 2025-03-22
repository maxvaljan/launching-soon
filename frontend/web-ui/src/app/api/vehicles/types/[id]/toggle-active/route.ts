import { NextRequest, NextResponse } from 'next/server';
import { supabase, createSupabaseClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

// PATCH /api/vehicles/types/[id]/toggle-active - Toggle vehicle active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check user authentication and admin role
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
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
    
    // Get current vehicle status
    const { data: vehicle, error: fetchError } = await supabaseClient
      .from('vehicle_types')
      .select('active')
      .eq('id', id)
      .single();
    
    if (fetchError || !vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle type not found' },
        { status: 404 }
      );
    }
    
    // Toggle the active status
    const newStatus = !vehicle.active;
    
    // Update the vehicle status
    const { data, error } = await supabaseClient
      .from('vehicle_types')
      .update({ active: newStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error toggling active status for vehicle ${id}:`, error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to toggle vehicle status' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(`Error in PATCH /api/vehicles/types/[id]/toggle-active:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 