import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Set base URL based on environment
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'mobile-customer',
  },
});

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
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
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
export const login = async (identifier: string, password: string, isEmail: boolean = true) => {
  // Prepare login payload based on identifier type
  const payload = isEmail 
    ? { email: identifier, password, platform: 'mobile' }
    : { phone: identifier, password, platform: 'mobile' };
    
  const response = await api.post('/auth/login', payload);
  
  if (response.data.token) {
    await SecureStore.setItemAsync('authToken', response.data.token);
    await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
    await SecureStore.setItemAsync('userId', response.data.user.id);
  }
  return response.data;
};

export const register = async (userData: any) => {
  return api.post('/auth/register', { ...userData, role: 'customer', platform: 'mobile' });
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('authToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('userId');
  return { success: true };
};

export const refreshToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await api.post('/auth/refresh-token', { refreshToken, platform: 'mobile' });
  
  if (response.data.token) {
    await SecureStore.setItemAsync('authToken', response.data.token);
    if (response.data.refreshToken) {
      await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
    }
  }
  
  return response.data;
};

export const getProfile = async () => {
  return api.get('/users/profile');
};

export const updateProfile = async (profileData: any) => {
  return api.put('/users/profile', profileData);
};

// Order API methods
export const createOrder = async (orderData: any) => {
  return api.post('/orders', orderData);
};

export const getOrders = async () => {
  return api.get('/orders');
};

export const getOrder = async (orderId: string) => {
  return api.get(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId: string) => {
  return api.post(`/orders/${orderId}/cancel`);
};

// Vehicle API methods
export const getVehicleTypes = async () => {
  return api.get('/vehicles/types');
};

export const getActiveVehicles = async () => {
  // Directly return the promise from the API call.
  // Let the calling component handle success/error and data structure.
  return api.get('/vehicles/types/active');
};

/**
 * Helper function to generate vehicle image URL from a path
 * @param iconPath - Path to the vehicle image in Supabase storage
 * @returns Full URL to the vehicle image
 */
export const getVehicleImageUrl = (iconPath: string | null | undefined): string | null => {
  if (!iconPath) return null;
  
  // Get Supabase URL from environment or use default
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://xuehdmslktlsgpoexilo.supabase.co';
  
  // Remove leading slash if present
  const cleanPath = iconPath.startsWith('/') ? iconPath.substring(1) : iconPath;
  
  // Use the proper storage bucket name from config or default to 'vehicles'
  // Check available buckets: 'vehicles', 'pics', 'images'
  let storageBucket = 'vehicles';
  
  // If path already contains bucket info, extract it
  if (cleanPath.includes('/')) {
    const parts = cleanPath.split('/');
    if (parts.length > 1) {
      // If the path has format like "bucket_name/file.png", extract the bucket name
      const possibleBucket = parts[0];
      if (['vehicles', 'pics', 'images'].includes(possibleBucket)) {
        storageBucket = possibleBucket;
        // If bucket is in the path, remove it from cleanPath
        parts.shift();
        return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${parts.join('/')}`;
      }
    }
  }
  
  // Check if the path looks like a full URL already
  if (cleanPath.startsWith('http')) {
    return cleanPath;
  }
  
  // Map vehicle names to image files (similar to web UI)
  const vehicleImageMap: { [key: string]: string } = {
    'Courier': 'courier1.png',
    'Car': 'car1.png',
    'Compact Van': 'kangoo1.png',
    '2,7m Van': 'minivan1.png',
    '3,3m Van': 'van1.png',
    '4,3m Lorry': 'lorry1.png',
    '7,5m Lorry': 'lorry1.png',
    'Towing': 'towing1.png',
  };
  
  // If cleanPath matches a known image name, use it directly
  if (Object.values(vehicleImageMap).includes(cleanPath)) {
    return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${cleanPath}`;
  }
  
  // Otherwise, assume cleanPath is the complete path after the bucket
  return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${cleanPath}`;
};

// Payment API methods
export const addPaymentMethod = async (paymentMethodId: string) => {
  return api.post('/payment/methods', { paymentMethodId });
};

export const getPaymentMethods = async () => {
  return api.get('/payment/methods');
};

export const removePaymentMethod = async (paymentMethodId: string) => {
  return api.delete(`/payment/methods/${paymentMethodId}`);
};

export const createPaymentIntent = async (orderId: string, paymentMethodId: string, tipAmount = 0) => {
  return api.post('/payment/intents', { orderId, paymentMethodId, tipAmount });
};

export const recordCashPayment = async (orderId: string, tipAmount = 0) => {
  return api.post('/payment/cash-payments', { orderId, tipAmount });
};

export const addTip = async (orderId: string, paymentIntentId: string, tipAmount: number) => {
  return api.post(`/payment/intents/${paymentIntentId}/tip`, { 
    orderId, 
    tipAmount 
  });
};

// Export the API instance as default
export default api;