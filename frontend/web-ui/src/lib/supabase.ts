'use client';

import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// These environment variables must be set in .env.local
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('ERROR: Missing Supabase environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Enhanced Supabase client for Next.js applications
 * This version uses auth-helpers-nextjs to handle cookies properly
 * For browser environments, which improves auth reliability
 */
export const supabase = typeof window !== 'undefined' 
  ? createClientComponentClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'x-client-info': 'nextjs'
          }
        }
      }
    })
  : createClient(supabaseUrl, supabaseAnonKey);

/**
 * Checks if the current user session is valid
 * @returns {Promise<boolean>} True if user has a valid session
 */
export async function isUserAuthenticated() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
    
    const session = data.session;
    
    // Check if session exists and is not expired
    if (session && session.expires_at) {
      const expiresAt = session.expires_at * 1000; // Convert to milliseconds
      const now = Date.now();
      
      return expiresAt > now;
    }
    
    return false;
  } catch (err) {
    console.error('Unexpected error checking auth status:', err);
    return false;
  }
}

/**
 * Gets the current user's role from the profiles table
 * @returns {Promise<string|null>} User's role or null if not found/authenticated
 */
export async function getUserRole() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error('Error getting user role:', err);
    return null;
  }
}