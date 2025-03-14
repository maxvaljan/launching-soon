/**
 * Order status enum
 */
export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  WALLET = 'wallet',
  OTHER = 'other'
}

/**
 * Order item interface
 */
export interface OrderItem {
  name: string;
  quantity: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  weight?: number;
  requiresRefrigeration?: boolean;
  requiresSpecialHandling?: boolean;
  notes?: string;
}

/**
 * Order interface for API communication
 */
export interface Order {
  id: string;
  customer_id: string;
  driver_id?: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  contact_name?: string;
  contact_phone?: string;
  distance?: number;
  estimated_duration?: number;
  price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  items: OrderItem[];
  vehicle_type_id?: string;
  special_instructions?: string;
  insurance_required?: boolean;
  scheduled_pickup?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Order creation request interface
 */
export interface CreateOrderRequest {
  pickup_address: string;
  dropoff_address: string;
  contact_name?: string;
  contact_phone?: string;
  scheduled_pickup?: string;
  vehicle_type_id?: string;
  items?: OrderItem[];
  special_instructions?: string;
  payment_method?: PaymentMethod;
  insurance_required?: boolean;
}

/**
 * Order status update interface
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

/**
 * Driver assignment interface
 */
export interface AssignDriverRequest {
  driverId: string;
}

/**
 * Order response interface
 */
export interface OrderResponse {
  success: boolean;
  data: Order;
  payment?: {
    paymentIntentId: string;
    clientSecret: string;
    status: string;
    amount: number;
    currency: string;
  };
}

/**
 * Orders list response interface
 */
export interface OrdersListResponse {
  success: boolean;
  count: number;
  data: Order[];
}