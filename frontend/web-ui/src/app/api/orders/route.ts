import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get all orders for current user
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

    // Get user role to determine which orders to fetch
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

    let query = supabase.from('orders').select('*');

    // Filter orders based on user role
    if (profile.role === 'driver') {
      query = query.eq('driver_id', session.user.id);
    } else if (profile.role === 'admin') {
      // Admins can see all orders, no filter needed
    } else {
      // Regular users and businesses see only their own orders
      query = query.eq('customer_id', session.user.id);
    }

    // Add status filter if provided in query params
    const status = request.nextUrl.searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    // Add sorting by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      return NextResponse.json(
        { error: 'Error fetching orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    // Create new order
    const newOrder = {
      customer_id: session.user.id,
      pickup_address: body.pickupAddress,
      delivery_address: body.deliveryAddress,
      package_size: body.packageSize,
      package_weight: body.packageWeight,
      delivery_instructions: body.deliveryInstructions,
      status: 'pending', // Initial status
      created_at: new Date().toISOString(),
      estimated_delivery: body.estimatedDelivery,
      price: body.price,
      distance: body.distance,
      payment_method: body.paymentMethod,
      payment_status: 'pending', // Initial payment status
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: 'Error creating order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}