'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient } from './supabase-server';

/**
 * Gets the currently authenticated user with their role
 * Uses server-side authentication for API routes
 */
export async function getCurrentUser() {
  try {
    // Create a server-side Supabase client using cookies
    const serverSupabase = await createServerSupabaseClient();
    
    // Get session data from server-side client
    const { data: sessionData } = await serverSupabase.auth.getSession();
    
    // Debug logging for session state
    console.log('Auth Debug:', {
      hasSession: !!sessionData.session,
      userEmail: sessionData.session?.user?.email,
      userId: sessionData.session?.user?.id,
      timestamp: new Date().toISOString()
    });

    if (!sessionData.session?.user) {
      console.log('No session found');
      return null;
    }
    
    // Get user profile data
    const { data: profile, error: profileError } = await serverSupabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
    
    // Debug logging for profile data
    console.log('Profile Debug:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      profileError: profileError?.message,
      userId: sessionData.session.user.id
    });

    // Check for admin status through multiple sources for robustness
    const isAdmin = 
      // Email-based override for specific admin (ensure email is correct)
      sessionData.session.user.email === 'max.valjan@icloud.com' || 
      // Database role check
      profile?.role === 'admin' ||
      // User metadata check (if using Supabase claims)
      sessionData.session.user.app_metadata?.admin === true;
    
    // Debug logging for admin status
    console.log('Admin Check Debug:', {
      isAdmin,
      emailMatch: sessionData.session.user.email === 'max.valjan@icloud.com',
      roleMatch: profile?.role === 'admin',
      metadataMatch: sessionData.session.user.app_metadata?.admin === true
    });

    // Return user with correct role
    return {
      ...profile,
      role: isAdmin ? 'admin' : (profile?.role || 'user')
    };
  } catch (error) {
    console.error('Error getting current user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    return null;
  }
} 