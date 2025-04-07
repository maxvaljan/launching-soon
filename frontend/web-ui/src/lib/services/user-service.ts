import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Base user data interface
export interface BaseUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Business specific data
export interface BusinessUserData extends BaseUserData {
  companyName: string;
}

// Driver specific data
export interface DriverUserData extends BaseUserData {
  driverLicenseNumber: string;
  vehicleType: string;
}

// Type guard functions
export const isBusinessUser = (data: BaseUserData): data is BusinessUserData => {
  return 'companyName' in data;
};

export const isDriverUser = (data: BaseUserData): data is DriverUserData => {
  return 'driverLicenseNumber' in data && 'vehicleType' in data;
};

/**
 * Handles user signup for all account types (personal, business, driver)
 */
export const signUpUser = async (
  userData: BaseUserData,
  accountType: 'personal' | 'business' | 'driver'
): Promise<boolean> => {
  try {
    // Format data for auth
    const authData = {
      email:
        accountType === 'business' && isBusinessUser(userData) ? userData.email : userData.email,
      password: userData.password,
      phone: userData.phoneNumber,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: accountType,
          ...(isBusinessUser(userData) && { company_name: userData.companyName }),
        },
      },
    };

    // Signup with Supabase Auth
    const { error: signUpError, data: authResult } = await supabase.auth.signUp(authData);

    if (signUpError) throw signUpError;

    // Update profile if user was created
    if (authResult.user) {
      const profileData = {
        phone_number: userData.phoneNumber,
        name: `${userData.firstName} ${userData.lastName}`,
        ...(isBusinessUser(userData) && { company_name: userData.companyName }),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', authResult.user.id);

      if (profileError) throw profileError;

      // Additional role-specific data updates
      if (accountType === 'business' && isBusinessUser(userData)) {
        // Insert into business_profiles if it exists
        try {
          await supabase.from('business_profiles').upsert({
            id: authResult.user.id,
            company_name: userData.companyName,
          });
        } catch (e) {
          // If table doesn't exist yet, just log it
          console.warn('Could not update business_profiles table:', e);
        }
      } else if (accountType === 'driver') {
        // Insert into driver_profiles if it exists
        try {
          await supabase.from('driver_profiles').upsert({
            id: authResult.user.id,
          });
        } catch (e) {
          // If table doesn't exist yet, just log it
          console.warn('Could not update driver_profiles table:', e);
        }
      }
    }

    toast.success('Registration successful! Please check your email to verify your account.');
    return true;
  } catch (error: unknown) {
    console.error('Error in sign up:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred during sign up';
    toast.error(errorMessage);
    return false;
  }
};
