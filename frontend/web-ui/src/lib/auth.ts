import { supabase } from './supabase';

/**
 * Gets the currently authenticated user with their role
 */
export async function getCurrentUser() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user) {
      return null;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    // Special handling for max.valjan@icloud.com - always admin
    if (sessionData.session.user.email === 'max.valjan@icloud.com') {
      return {
        ...profile,
        role: 'admin'
      };
    }
    
    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 