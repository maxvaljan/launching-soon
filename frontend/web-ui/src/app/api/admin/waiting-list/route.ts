import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = createServerComponentClient({ cookies });
    
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin (in production, always verify admin role)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // Get waiting list data
    const { data, error } = await supabase
      .from('waiting_list_emails')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching waiting list:', error);
      return NextResponse.json(
        { message: 'Failed to fetch waiting list', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in waiting list admin API:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'Failed to process request' },
      { status: 500 }
    );
  }
}