// For Next.js we should use relative URLs in the browser since API routes are served from the same domain
// The environment variable will be used for server-side API calls to the backend if needed
const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || '') 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const apiClient = {
  async get<T>(endpoint: string, authToken?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        // Check for specific status codes
        if (response.status === 401) {
          return {
            success: false,
            error: 'Unauthorized. Please sign in again.',
          };
        }
        
        if (response.status === 403) {
          return {
            success: false,
            error: 'Access denied. You do not have permission to access this resource.',
          };
        }
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async post<T>(endpoint: string, body: any, authToken?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Check for specific status codes
        if (response.status === 401) {
          return {
            success: false,
            error: 'Unauthorized. Please sign in again.',
          };
        }
        
        if (response.status === 403) {
          return {
            success: false,
            error: 'Access denied. You do not have permission to access this resource.',
          };
        }
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
  
  async put<T>(endpoint: string, body: any, authToken?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: response.status === 401 ? 'Unauthorized. Please sign in again.' : 'Access denied.',
          };
        }
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
  
  async delete<T>(endpoint: string, authToken?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: response.status === 401 ? 'Unauthorized. Please sign in again.' : 'Access denied.',
          };
        }
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getApiKey(keyName: string): Promise<string | null> {
    try {
      const response = await this.get<{ key_name: string; key_value: string }>(`/api/api-keys/${keyName}`);
      
      if (response.success && response.data) {
        return response.data.key_value;
      }
      
      throw new Error(response.error || 'Failed to get API key');
    } catch (error) {
      console.error(`Error fetching ${keyName} API key:`, error);
      return null;
    }
  },
  
  // Helper method to get authenticated token
  getAuthToken(): string | null {
    // In Next.js, we should rely on httpOnly cookies for auth
    // This is just a fallback for components that need direct access
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token');
    }
    return null;
  },
  
  // Authentication-specific API methods
  auth: {
    async login(credentials: { email?: string; phone?: string; password: string }) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Platform': 'web'
          },
          body: JSON.stringify(credentials),
          credentials: 'include' // Important for cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.token) {
          // Store minimal data in sessionStorage for client-side access
          // Most auth will be handled by httpOnly cookies
          sessionStorage.setItem('auth_token', data.data.token);
          
          // Store basic user info for quick access
          if (data.data.user) {
            sessionStorage.setItem('user_id', data.data.user.id);
            sessionStorage.setItem('user_role', data.data.user.role);
          }
        }
        
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    async register(userData: { 
      email: string; 
      password: string; 
      name?: string; 
      phone_number?: string;
      role?: string;
    }) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Platform': 'web'
          },
          body: JSON.stringify(userData),
          credentials: 'include' // Important for cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        
        const data = await response.json();
        
        // If we got a token (email verification not required), store it
        if (data.success && data.data.token) {
          // Store minimal data in sessionStorage for client-side access
          sessionStorage.setItem('auth_token', data.data.token);
          
          if (data.data.user) {
            sessionStorage.setItem('user_id', data.data.user.id);
            sessionStorage.setItem('user_role', data.data.user.role);
          }
        }
        
        return data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    async logout() {
      try {
        // Use the cookies for authentication
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Platform': 'web'
          },
          body: JSON.stringify({}),
          credentials: 'include' // Important for cookies
        });
        
        // Clear local storage tokens regardless of server response
        this.clearAuthData();
        
        // Force a hard reload if we're dealing with cookies
        if (response.headers.get('X-Auth-Logout') === 'true') {
          if (typeof window !== 'undefined') {
            window.location.href = '/signin?ts=' + new Date().getTime();
            return { success: true };
          }
        }
        
        return response.ok 
          ? { success: true } 
          : { success: false, error: 'Logout failed on server' };
      } catch (error) {
        console.error('Logout error:', error);
        
        // Still clear local data even if server request fails
        this.clearAuthData();
        
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    
    async refreshToken() {
      try {
        // Use the cookie-based refresh flow
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Platform': 'web'
          },
          body: JSON.stringify({}),
          credentials: 'include' // Important for cookies
        });
        
        if (!response.ok) {
          // Clear auth data if refresh fails
          this.clearAuthData();
          throw new Error('Token refresh failed');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.token) {
          // Just store the token in sessionStorage as a backup
          sessionStorage.setItem('auth_token', data.data.token);
        }
        
        return data;
      } catch (error) {
        console.error('Token refresh error:', error);
        this.clearAuthData();
        throw error;
      }
    },
    
    async verifySession() {
      try {
        // Cookies will be automatically sent with the request
        const response = await fetch('/api/auth/verify', {
          headers: {
            'X-Platform': 'web'
          },
          credentials: 'include' // Important for cookies
        });
        
        // If the server says our token is invalid, clear it
        if (response.headers.get('X-Auth-Invalid') === 'true') {
          this.clearAuthData();
          return { success: false, isAuthenticated: false };
        }
        
        if (!response.ok) {
          this.clearAuthData();
          return { success: false, isAuthenticated: false };
        }
        
        const data = await response.json();
        return {
          success: true,
          isAuthenticated: true,
          user: data.data.user
        };
      } catch (error) {
        console.error('Session verification error:', error);
        return { success: false, isAuthenticated: false };
      }
    },
    
    clearAuthData() {
      if (typeof window !== 'undefined') {
        // Clear all auth-related data from sessionStorage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_role');
        
        // Also clear any items that might be related to Supabase
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.startsWith('supabase.') || 
            key.includes('auth') || 
            key.includes('token')
          )) {
            sessionStorage.removeItem(key);
          }
        }
      }
    },
    
    isAuthenticated(): boolean {
      if (typeof window === 'undefined') return false;
      
      // Check for token in sessionStorage as a quick client-side check
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        // If no token in sessionStorage, try to refresh from cookies
        this.refreshToken().catch(() => {});
        return false;
      }
      
      return true;
    },
    
    getUserRole(): string | null {
      if (typeof window === 'undefined') return null;
      return sessionStorage.getItem('user_role');
    }
  }
};