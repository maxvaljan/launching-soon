import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get environment variables from app.config.js
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://xuehdmslktlsgpoexilo.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZWhkbXNsa3Rsc2dwb2V4aWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MjA4ODIsImV4cCI6MjAyMDI5Njg4Mn0.jEBkLbuU9bv4g__Jl5O5e_8rASNKJM5FNz-aceRvP1I'; // Public anon key

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Get all active vehicle types directly from Supabase
 * @returns Array of active vehicle types
 */
export const getActiveVehicleTypesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_types')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching vehicle types:', error);
      throw error;
    }

    return {
      success: true,
      count: data.length,
      data,
    };
  } catch (err) {
    console.error('Failed to fetch vehicle types from Supabase:', err);
    throw err;
  }
};

export default supabase;