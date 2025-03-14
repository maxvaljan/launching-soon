import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get a specific order by ID
export async function GET(request: NextRequest) {
  // Extract the id from the URL
  const id = request.url.split('/').pop();
  try {
    const orderId = id;
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

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: 'Error fetching order' },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get user role to determine access rights
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

    // Check if user has access to this order
    const isAdmin = profile.role === 'admin';
    const isDriver = profile.role === 'driver' && order.driver_id === session.user.id;
    const isCustomer = order.customer_id === session.user.id;

    if (!isAdmin && !isDriver && !isCustomer) {
      return NextResponse.json(
        { error: 'You do not have permission to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Update an order by ID
export async function PATCH(request: NextRequest) {
  // Extract the id from the URL
  const id = request.url.split('/').pop();
  try {
    const orderId = id;
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

    // Get the existing order
    const { data: existingOrder, error: getOrderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (getOrderError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get user role to determine access rights
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

    // Define what can be updated based on role
    const isAdmin = profile.role === 'admin';
    const isDriver = profile.role === 'driver' && existingOrder.driver_id === session.user.id;
    const isCustomer = existingOrder.customer_id === session.user.id;

    if (!isAdmin && !isDriver && !isCustomer) {
      return NextResponse.json(
        { error: 'You do not have permission to update this order' },
        { status: 403 }
      );
    }

    // Determine which fields can be updated based on role
    let updateFields: any = {};

    if (isAdmin) {
      // Admins can update any field
      const { id, created_at, ...updatableFields } = body;
      updateFields = updatableFields;
    } else if (isDriver) {
      // Drivers can only update status and their notes
      if (body.status) updateFields.status = body.status;
      if (body.driver_notes) updateFields.driver_notes = body.driver_notes;
      if (body.current_location) updateFields.current_location = body.current_location;
    } else if (isCustomer) {
      // Customers can only update certain fields if order is still pending
      if (existingOrder.status === 'pending') {
        if (body.delivery_instructions) updateFields.delivery_instructions = body.delivery_instructions;
        // Add other fields customers can update when order is pending
      } else {
        return NextResponse.json(
          { error: 'Cannot update order that is already in progress' },
          { status: 400 }
        );
      }
    }

    // Update the order with allowed fields
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateFields)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Error updating order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order: updatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}