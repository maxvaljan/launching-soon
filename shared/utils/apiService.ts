import { 
  Order, 
  CreateOrderRequest, 
  OrderResponse, 
  OrdersListResponse,
  UpdateOrderStatusRequest,
  AssignDriverRequest
} from '../types/order';

import {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  AuthResponse
} from '../types/user';

import {
  VehicleType,
  CreateVehicleTypeRequest,
  UpdateVehicleTypeRequest,
  VehicleTypeResponse,
  VehicleTypesListResponse
} from '../types/vehicle';

/**
 * Base API service class
 * Used to communicate with the backend API
 */
export class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the authentication token
   * @param token - JWT token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Get authentication headers
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Generic request method
   * @param method - HTTP method
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
      credentials: 'include'
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  }

  /**
   * GET request
   * @param endpoint - API endpoint
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, data);
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // Auth endpoints

  /**
   * Login user
   * @param data - Login credentials
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  /**
   * Register user
   * @param data - Registration data
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.post<void>('/auth/logout');
    this.clearToken();
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{success: boolean; data: User}> {
    return this.get<{success: boolean; data: User}>('/users/me');
  }

  // Order endpoints

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(): Promise<OrdersListResponse> {
    return this.get<OrdersListResponse>('/orders');
  }

  /**
   * Get order by ID
   * @param id - Order ID
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    return this.get<OrderResponse>(`/orders/${id}`);
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(): Promise<OrdersListResponse> {
    return this.get<OrdersListResponse>('/orders/customer/me');
  }

  /**
   * Get driver orders
   */
  async getDriverOrders(): Promise<OrdersListResponse> {
    return this.get<OrdersListResponse>('/orders/driver/me');
  }

  /**
   * Create order
   * @param data - Order data
   */
  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    return this.post<OrderResponse>('/orders', data);
  }

  /**
   * Update order status
   * @param id - Order ID
   * @param data - Status update data
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<OrderResponse> {
    return this.patch<OrderResponse>(`/orders/${id}/status`, data);
  }

  /**
   * Assign driver to order
   * @param orderId - Order ID
   * @param data - Driver assignment data
   */
  async assignDriverToOrder(
    orderId: string,
    data: AssignDriverRequest
  ): Promise<OrderResponse> {
    return this.post<OrderResponse>(`/orders/${orderId}/assign`, data);
  }

  /**
   * Cancel order
   * @param id - Order ID
   */
  async cancelOrder(id: string): Promise<OrderResponse> {
    return this.delete<OrderResponse>(`/orders/${id}`);
  }

  // Vehicle endpoints

  /**
   * Get all vehicle types
   */
  async getVehicleTypes(): Promise<VehicleTypesListResponse> {
    return this.get<VehicleTypesListResponse>('/vehicles/types');
  }

  /**
   * Get vehicle type by ID
   * @param id - Vehicle type ID
   */
  async getVehicleTypeById(id: string): Promise<VehicleTypeResponse> {
    return this.get<VehicleTypeResponse>(`/vehicles/types/${id}`);
  }

  /**
   * Create vehicle type
   * @param data - Vehicle type data
   */
  async createVehicleType(
    data: CreateVehicleTypeRequest
  ): Promise<VehicleTypeResponse> {
    return this.post<VehicleTypeResponse>('/vehicles/types', data);
  }

  /**
   * Update vehicle type
   * @param id - Vehicle type ID
   * @param data - Vehicle type update data
   */
  async updateVehicleType(
    id: string,
    data: UpdateVehicleTypeRequest
  ): Promise<VehicleTypeResponse> {
    return this.put<VehicleTypeResponse>(`/vehicles/types/${id}`, data);
  }

  /**
   * Delete vehicle type
   * @param id - Vehicle type ID
   */
  async deleteVehicleType(id: string): Promise<{success: boolean}> {
    return this.delete<{success: boolean}>(`/vehicles/types/${id}`);
  }
}

// Create a singleton instance
// In development mode, point to localhost
// In production mode, use the production URL
export const apiService = new ApiService(
  process.env.NODE_ENV === 'production'
    ? 'https://api.maxmove.com/api'
    : 'http://localhost:3000/api'
);