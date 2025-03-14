import { apiClient, ApiResponse } from '../api';
import { OrderLocation, VehicleType } from './orders';

// Types
export interface BookingTimeSlot {
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  available: boolean;
}

export interface PricingDetails {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  vehicleSurcharge: number;
  priorityFee: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;
}

export interface BookingCreateRequest {
  pickupLocation: OrderLocation;
  deliveryLocation: OrderLocation;
  packageDetails: {
    description: string;
    items: Array<{
      name: string;
      quantity: number;
      weight?: number; // in kg
      fragile: boolean;
    }>;
    totalWeight?: number; // in kg
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'in';
    };
  };
  timeSlot: {
    date: string; // ISO date string (YYYY-MM-DD)
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
  vehicleType: VehicleType;
  priority: boolean; // true for express delivery
  specialInstructions?: string;
  contactDetails: {
    senderName: string;
    senderPhone: string;
    senderEmail?: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail?: string;
  };
  paymentMethod: string;
  promoCode?: string;
}

export interface Booking extends Omit<BookingCreateRequest, 'promoCode'> {
  id: string;
  userId: string;
  status: 'draft' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  orderId?: string; // Reference to order once booking is confirmed
  createdAt: string;
  updatedAt: string;
  pricing: PricingDetails;
  appliedPromoCode?: {
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  };
}

// Booking API Service
export const bookingsService = {
  // Get available time slots for booking
  async getAvailableTimeSlots(
    date: string,
    pickupLocation: OrderLocation,
    deliveryLocation: OrderLocation
  ): Promise<ApiResponse<BookingTimeSlot[]>> {
    return apiClient.post<BookingTimeSlot[]>('/api/bookings/time-slots', {
      date,
      pickupLocation,
      deliveryLocation,
    });
  },
  
  // Get pricing estimate for a booking
  async getPricingEstimate(
    pickupLocation: OrderLocation,
    deliveryLocation: OrderLocation,
    vehicleType: VehicleType,
    priority: boolean = false,
    promoCode?: string
  ): Promise<ApiResponse<PricingDetails>> {
    return apiClient.post<PricingDetails>('/api/bookings/pricing', {
      pickupLocation,
      deliveryLocation,
      vehicleType,
      priority,
      promoCode,
    });
  },
  
  // Create a booking (draft)
  async createBooking(bookingData: BookingCreateRequest): Promise<ApiResponse<Booking>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.post<Booking>('/api/bookings', bookingData, authToken);
  },
  
  // Get a booking by ID
  async getBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.get<Booking>(`/api/bookings/${bookingId}`, authToken);
  },
  
  // Update a booking
  async updateBooking(bookingId: string, bookingData: Partial<BookingCreateRequest>): Promise<ApiResponse<Booking>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.put<Booking>(`/api/bookings/${bookingId}`, bookingData, authToken);
  },
  
  // Confirm a booking (converts it to an order)
  async confirmBooking(bookingId: string): Promise<ApiResponse<{ bookingId: string; orderId: string }>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.post<{ bookingId: string; orderId: string }>(`/api/bookings/${bookingId}/confirm`, {}, authToken);
  },
  
  // Cancel a booking
  async cancelBooking(bookingId: string, reason: string): Promise<ApiResponse<Booking>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.put<Booking>(`/api/bookings/${bookingId}/cancel`, { reason }, authToken);
  },
  
  // Get all bookings for the current user
  async getUserBookings(page: number = 1, limit: number = 10): Promise<ApiResponse<{ bookings: Booking[]; total: number }>> {
    const authToken = apiClient.getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        error: 'Not authenticated. Please sign in.',
      };
    }
    
    return apiClient.get<{ bookings: Booking[]; total: number }>(`/api/bookings?page=${page}&limit=${limit}`, authToken);
  },
  
  // Validate a promo code
  async validatePromoCode(
    promoCode: string,
    totalAmount: number
  ): Promise<ApiResponse<{
    valid: boolean;
    code?: string;
    discountAmount?: number;
    discountType?: 'percentage' | 'fixed';
    message?: string;
  }>> {
    const authToken = apiClient.getAuthToken();
    
    // If no authToken, make request without it
    return apiClient.post<{
      valid: boolean;
      code?: string;
      discountAmount?: number;
      discountType?: 'percentage' | 'fixed';
      message?: string;
    }>('/api/bookings/validate-promo', {
      promoCode,
      totalAmount,
    }, authToken || undefined);
  },
};