/**
 * Service for interacting with the waiting list API
 */

interface WaitingListResponse {
  message: string;
  data?: {
    id: string;
    email: string;
    referral_code?: string;
  };
  error?: string;
}

interface CheckEmailResponse {
  exists: boolean;
  data: {
    id: string;
    email: string;
    referral_code?: string;
  } | null;
}

/**
 * Add an email to the waiting list
 * @param email - Email address to add
 * @param source - Source of the signup (e.g., 'popup', 'footer')
 * @param utmSource - Optional UTM source for tracking
 * @param referralCode - Optional referral code
 * @returns Promise with the response data
 */
export async function addToWaitingList(
  email: string,
  source: string,
  utmSource?: string,
  referralCode?: string
): Promise<WaitingListResponse> {
  try {
    // Basic email validation before sending request
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        message: 'Failed to add email',
        error: 'Please provide a valid email address',
      };
    }

    // Add timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          utm_source: utmSource,
          referral_code: referralCode,
        }),
        signal: controller.signal,
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'An error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Failed to add email';
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
  
        return {
          message: 'Failed to add email',
          error: errorMessage,
        };
      }
  
      return await response.json();
    } catch (fetchError: any) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Check if the error is due to abort/timeout
      if (fetchError.name === 'AbortError') {
        return {
          message: 'Failed to add email',
          error: 'Request timed out. Please try again.',
        };
      }
      
      throw fetchError; // Re-throw to be caught by outer try/catch
    }
  } catch (error: any) {
    console.error('Error adding to waiting list:', error);
    return {
      message: 'Failed to add email',
      error: error.message || 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Check if an email is already on the waiting list
 * @param email - Email address to check
 * @returns Promise with boolean indicating if email exists
 */
export async function checkEmailExists(email: string): Promise<CheckEmailResponse> {
  try {
    const response = await fetch(`/api/waiting-list/check/${encodeURIComponent(email)}`);

    if (!response.ok) {
      console.error('Error checking email:', response.statusText);
      return { exists: false, data: null };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking email:', error);
    return { exists: false, data: null };
  }
}

/**
 * Get referrals by referral code
 * @param referralCode - Referral code to check
 * @returns Promise with referral data
 */
export async function getReferrals(referralCode: string): Promise<any> {
  try {
    const response = await fetch(`/api/waiting-list/referrals/${referralCode}`);

    if (!response.ok) {
      console.error('Error getting referrals:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting referrals:', error);
    return null;
  }
}