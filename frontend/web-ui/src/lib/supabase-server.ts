'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// These environment variables must be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a Supabase client for use in server components and API routes
 */
export async function createServerSupabaseClient() {
  try {
    const cookieStore = cookies();
    return createServerComponentClient({ cookies: () => cookieStore });
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    // Fallback to a basic client if cookies aren't available (rare case)
    return createClient(supabaseUrl, supabaseAnonKey);
  }
}

/**
 * Direct server client for cases where cookies aren't needed
 */
export const serverSupabase = createClient(supabaseUrl, supabaseAnonKey); 