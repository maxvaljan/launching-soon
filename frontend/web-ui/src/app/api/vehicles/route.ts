import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase.from('vehicle_types').select('*').eq('active', true);

    if (error) {
      console.error('Error fetching vehicle types:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch vehicle types' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedData = data.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      description: vehicle.description,
      image_url: vehicle.icon_path,
      weight_capacity_kg: parseFloat(vehicle.max_weight),
      volume_capacity_cbm: 0, // Add if needed
      dimensions_meter: vehicle.max_dimensions,
      base_price: parseFloat(vehicle.base_price),
      price_per_km: parseFloat(vehicle.price_per_km),
      minimum_distance: parseFloat(vehicle.minimum_distance),
    }));

    // Sort vehicles by weight capacity (lowest to highest)
    const sortedData = transformedData.sort((a, b) => {
      // Handle special case for Courier (always first)
      if (a.name === 'Courier') return -1;
      if (b.name === 'Courier') return 1;

      // Handle special case for Towing (always last)
      if (a.name === 'Towing') return 1;
      if (b.name === 'Towing') return -1;

      // Sort by weight capacity for all other vehicles
      return a.weight_capacity_kg - b.weight_capacity_kg;
    });

    return NextResponse.json({ success: true, data: sortedData });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
