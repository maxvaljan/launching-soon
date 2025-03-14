import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

// Error class for API errors
export class ApiError extends Error {
  status: number;
  data?: any;
  isOffline: boolean;
  isTimeout: boolean;

  constructor(message: string, status: number = 0, data?: any, isOffline = false, isTimeout = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isOffline = isOffline;
    this.isTimeout = isTimeout;
  }
}

// Set base URL based on environment
// Use a production URL by default or from configuration
// For development on physical devices, use your computer's local network IP
// For development on emulators, you can use localhost (10.0.2.2 for Android emulator)
const API_URL = Constants.expoConfig?.extra?.apiUrl || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.maxmove.app/api' 
    : 'http://localhost:3000/api');

// Create axios instance with more robust configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'mobile-driver',
  },
  timeout: 15000, // 15 second timeout
});

// Helper function to check network connectivity before making requests
const checkConnectivity = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true && netInfo.isInternetReachable !== false;
};

// Wrapper for API requests with better error handling
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    // Check connectivity before making request
    const isConnected = await checkConnectivity();
    if (!isConnected) {
      throw new ApiError(
        'No internet connection. Please check your network settings and try again.',
        0,
        null,
        true,
        false
      );
    }

    const response = await api.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle timeout errors
      if (axiosError.code === 'ECONNABORTED') {
        throw new ApiError(
          'Request timed out. Please try again.',
          0, 
          null,
          false,
          true
        );
      }
      
      // Handle network errors
      if (axiosError.message.includes('Network Error')) {
        throw new ApiError(
          'Network error. Please check your connection and try again.',
          0,
          null,
          true,
          false
        );
      }
      
      // Handle HTTP errors with response
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;
        
        let message = 'An error occurred';
        if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
          message = data.message;
        }

        throw new ApiError(message, status, data);
      }
    }
    
    // Generic error fallback
    throw error instanceof Error 
      ? error 
      : new ApiError('An unexpected error occurred');
  }
};

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await SecureStore.getItemAsync('authToken');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is unauthorized and we haven't tried to refresh the token yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
          platform: 'mobile'
        });
        
        if (response.data.token) {
          // Update stored tokens
          await SecureStore.setItemAsync('authToken', response.data.token);
          if (response.data.refreshToken) {
            await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
          }
          
          // Update auth header for this request
          api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
          originalRequest.headers['Authorization'] = 'Bearer ' + response.data.token;
          
          // Process queued requests
          processQueue(null, response.data.token);
          
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and reject all queued requests
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const login = async (identifier: string, password: string, isPhone: boolean = true) => {
  try {
    // Prepare login payload based on identifier type
    const payload = isPhone 
      ? { phone: identifier, password, platform: 'mobile' }
      : { email: identifier, password, platform: 'mobile' };
      
    const data = await apiRequest<any>({
      method: 'POST',
      url: '/auth/login',
      data: payload
    });
    
    if (data.token) {
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      await SecureStore.setItemAsync('userId', data.user.id);
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // Customize error messages for login-specific errors
      if (error.status === 401) {
        throw new ApiError('Invalid credentials. Please check your email/phone and password.', 401);
      }
    }
    throw error;
  }
};

export const register = async (userData: any) => {
  return apiRequest<any>({
    method: 'POST',
    url: '/auth/register',
    data: { ...userData, role: 'driver', platform: 'mobile' }
  });
};

export const logout = async () => {
  // Clear tokens from secure storage
  await SecureStore.deleteItemAsync('authToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('userId');
  
  // Remove Authorization header from axios defaults
  delete api.defaults.headers.common['Authorization'];
  
  return { success: true };
};

export const refreshToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }
  
  const data = await apiRequest<any>({
    method: 'POST',
    url: '/auth/refresh-token',
    data: { refreshToken, platform: 'mobile' }
  });
  
  if (data.token) {
    await SecureStore.setItemAsync('authToken', data.token);
    if (data.refreshToken) {
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    }
  }
  
  return data;
};

export const getProfile = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/users/profile'
  });
};

export const updateProfile = async (profileData: any) => {
  return apiRequest<any>({
    method: 'PUT',
    url: '/users/profile',
    data: profileData
  });
};

// Driver API methods
export const getDriverStatus = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/drivers/status'
  });
};

export const updateDriverStatus = async (status: string) => {
  return apiRequest<any>({
    method: 'PUT',
    url: '/drivers/status',
    data: { status }
  });
};

export const getAvailableOrders = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/drivers/orders/available'
  });
};

export const getActiveOrder = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/drivers/orders/active'
  });
};

export const acceptOrder = async (orderId: string) => {
  return apiRequest<any>({
    method: 'POST',
    url: `/drivers/orders/${orderId}/accept`
  });
};

export const completeOrder = async (orderId: string) => {
  return apiRequest<any>({
    method: 'POST',
    url: `/drivers/orders/${orderId}/complete`
  });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return apiRequest<any>({
    method: 'PUT',
    url: `/drivers/orders/${orderId}/status`,
    data: { status }
  });
};

// Payment API methods
export const getConnectAccount = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/payment/connect/accounts/me'
  });
};

export const createConnectAccount = async () => {
  return apiRequest<any>({
    method: 'POST',
    url: '/payment/connect/accounts'
  });
};

export const getOnboardingLink = async (returnUrl: string) => {
  return apiRequest<any>({
    method: 'POST',
    url: '/payment/connect/onboarding',
    data: { returnUrl }
  });
};

export const getDashboardLink = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/payment/connect/dashboard-link'
  });
};

export const getDriverSubscription = async () => {
  return apiRequest<any>({
    method: 'GET',
    url: '/payment/subscriptions/current'
  });
};

export const createDriverSubscription = async (paymentMethodId: string) => {
  return apiRequest<any>({
    method: 'POST',
    url: '/payment/subscriptions',
    data: { paymentMethodId }
  });
};

export const cancelDriverSubscription = async () => {
  return apiRequest<any>({
    method: 'DELETE',
    url: '/payment/subscriptions/current'
  });
};

export const getDriverEarnings = async (period?: string) => {
  return apiRequest<any>({
    method: 'GET',
    url: '/drivers/earnings',
    params: { period }
  });
};

export const getCashFeePaymentLink = async (transactionId: string) => {
  return apiRequest<any>({
    method: 'POST',
    url: '/payment/cash-payments/fee',
    data: { transactionId }
  });
};

// Export the API instance as default
export default api;