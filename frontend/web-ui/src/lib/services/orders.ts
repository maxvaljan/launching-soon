import { apiClient, ApiResponse } from '../api';

// Types
export interface OrderLocation {
  address: string;
  latitude: number;
  longitude: number;
  additionalInfo?: string;
}

export interface OrderItem {
  description: string;
  quantity: number;
  weight?: number; // in kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum VehicleType {
  BICYCLE = 'bicycle',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  VAN = 'van',
  TRUCK = 'truck',
}

export interface OrderCreateRequest {
  pickupLocation: OrderLocation;
  deliveryLocation: OrderLocation;
  items: OrderItem[];
  scheduledTime?: string; // ISO string for scheduled delivery
  notes?: string;
  vehicleType?: VehicleType;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  paymentMethod: string;
  promoCode?: string;
}

export interface Order extends OrderCreateRequest {
  id: string;
  userId: string;
  driverId?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  price: {
    basePrice: number;
    tax: number;
    discount?: number;
    total: number;
    currency: string;
  };
  distance: number; // in km
  estimatedDuration: number; // in minutes
  tracking: {
    trackingId: string;
    trackingUrl: string;
  };
}

// Orders API Service
export const ordersService = {
  // Get all orders for the current user
  async getUserOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; total: number; }>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.get<{ orders: Order[]; total: number; }>(`/api/orders?page=${page}&limit=${limit}`, authToken);
  },
  
  // Get a specific order by ID
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.get<Order>(`/api/orders/${orderId}`, authToken);
  },
  
  // Create a new order
  async createOrder(orderData: OrderCreateRequest): Promise<ApiResponse<Order>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.post<Order>('/api/orders', orderData, authToken);
  },
  
  // Cancel an order
  async cancelOrder(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.put<Order>(`/api/orders/${orderId}/cancel`, { reason }, authToken);
  },
  
  // Get order price estimate
  async getOrderEstimate(
    pickupLocation: OrderLocation,
    deliveryLocation: OrderLocation,
    vehicleType: VehicleType = VehicleType.CAR
  ): Promise<ApiResponse<{
    estimatedPrice: number;
    currency: string;
    distance: number;
    duration: number;
  }>> {
    return apiClient.post<{
      estimatedPrice: number;
      currency: string;
      distance: number;
      duration: number;
    }>('/api/orders/estimate', {
      pickupLocation,
      deliveryLocation,
      vehicleType,
    });
  },
  
  // Get order status updates
  async getOrderStatus(orderId: string): Promise<ApiResponse<{
    status: OrderStatus;
    driverLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: string;
    };
    estimatedArrival?: string;
  }>> {
    return apiClient.get<{
      status: OrderStatus;
      driverLocation?: {
        latitude: number;
        longitude: number;
        updatedAt: string;
      };
      estimatedArrival?: string;
    }>(`/api/orders/${orderId}/status`);
  },
  
  // Driver-specific APIs
  
  // Get available orders (for drivers)
  async getAvailableOrders(
    latitude: number,
    longitude: number,
    radius: number = 10 // km
  ): Promise<ApiResponse<Order[]>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.get<Order[]>(
      `/api/driver/orders/available?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      authToken
    );
  },
  
  // Accept an order (for drivers)
  async acceptOrder(orderId: string): Promise<ApiResponse<Order>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.post<Order>(`/api/driver/orders/${orderId}/accept`, {}, authToken);
  },
  
  // Update order status (for drivers)
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    location?: { latitude: number; longitude: number }
  ): Promise<ApiResponse<Order>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.put<Order>(
      `/api/driver/orders/${orderId}/status`,
      { status, location },
      authToken
    );
  },
  
  // Report issue with order (for both customers and drivers)
  async reportIssue(
    orderId: string,
    issueType: string,
    description: string,
    attachmentUrls?: string[]
  ): Promise<ApiResponse<{ issueId: string }>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.post<{ issueId: string }>(
      `/api/orders/${orderId}/issues`,
      { issueType, description, attachmentUrls },
      authToken
    );
  },
};