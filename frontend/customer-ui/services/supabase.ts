import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get environment variables from app.config.js
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  'https://xuehdmslktlsgpoexilo.supabase.co';
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZWhkbXNsa3Rsc2dwb2V4aWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MjA4ODIsImV4cCI6MjAyMDI5Njg4Mn0.jEBkLbuU9bv4g__Jl5O5e_8rASNKJM5FNz-aceRvP1I';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Standard mapping of vehicle names to image files
export const vehicleImageMap: Record<string, string> = {
  Courier: 'courier1.png',
  Car: 'car1.png',
  'Compact Van': 'kangoo1.png',
  '2,7m Van': 'minivan1.png',
  '3,3m Van': 'van1.png',
  '4,3m Lorry': 'lorry1.png',
  '7,5m Lorry': 'lorry1.png',
  Towing: 'towing1.png',
};

/**
 * Get all active vehicle types directly from Supabase
 * @returns Array of active vehicle types
 */
export const getActiveVehicleTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_types')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

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

/**
 * Generate a public URL for a vehicle image with enhanced error handling
 * @param imagePath Path to the image in Supabase storage
 * @param vehicleName Optional vehicle name for fallback
 * @returns Full URL to the image
 */
export const getVehicleImageUrl = (
  imagePath?: string | null,
  vehicleName?: string,
): string | null => {
  try {
    // Handle null/undefined paths
    if (!imagePath && !vehicleName) return null;

    // If this is a full URL already, return it
    if (imagePath?.startsWith('http')) return imagePath;

    // Check if we have a standard image for this vehicle name
    if (vehicleName && vehicleImageMap[vehicleName]) {
      return `${supabaseUrl}/storage/v1/object/public/vehicles/${vehicleImageMap[vehicleName]}`;
    }

    // Clean up the path if it exists
    if (imagePath) {
      // Safety check for null or undefined path
      if (typeof imagePath !== 'string') return null;

      const cleanPath = imagePath.startsWith('/')
        ? imagePath.substring(1)
        : imagePath;

      // Use bucket name from config if available
      const storageBucket =
        Constants.expoConfig?.extra?.storageVehiclesBucket || 'vehicles';

      // Return the complete URL
      return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${cleanPath}`;
    }

    return null;
  } catch (error) {
    console.error('Error generating vehicle image URL:', error);
    return null;
  }
};

/**
 * Check if Supabase connection is working properly
 * @returns Boolean indicating if connection is working
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test query to check connection
    const { error } = await supabase
      .from('vehicle_types')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};

export default supabase;
