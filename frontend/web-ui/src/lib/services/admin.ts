import { supabase } from '../supabase';
import { apiClient } from '../api';

// User types
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  BUSINESS = 'business'
}

// Order types
export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  WALLET = 'wallet',
  OTHER = 'other'
}

// User types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone_number: string;
  created_at: string;
  last_login?: string;
  verified_phone?: boolean;
  avatar_url?: string;
}

// Order types
export interface AdminOrder {
  id: string;
  customer_id: string;
  driver_id?: string;
  pickup_address: string;
  dropoff_address: string;
  price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  driver_name?: string;
}

// Analytics types
export interface AdminAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalCustomers: number;
  totalDrivers: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
}

export interface OrderCountsByDay {
  date: string;
  count: number;
}

export interface OrderStatusDistribution {
  name: string;
  value: number;
}

// Financial types
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  PAYOUT = 'payout',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface FinancialTransaction {
  id: string;
  order_id?: string;
  customer_id?: string;
  driver_id?: string;
  amount: number;
  fee_amount?: number;
  net_amount?: number;
  currency: string;
  payment_method?: PaymentMethod;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  metadata?: Record<string, any>;
  external_id?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  driver_name?: string;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  orders: number;
  fees: number;
  refunds: number;
  net_revenue: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalFees: number;
  totalRefunds: number;
  netRevenue: number;
  pendingAmount: number;
  averageOrderValue: number;
  revenueByPeriod: RevenueByPeriod[];
  topCustomers: {
    customer_id: string;
    customer_name: string;
    total_spent: number;
    order_count: number;
  }[];
  paymentMethodBreakdown: {
    name: string;
    value: number;
    percentage: number;
  }[];
}

// Support ticket types
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketType {
  GENERAL_INQUIRY = 'general_inquiry',
  TECHNICAL_ISSUE = 'technical_issue',
  BILLING_ISSUE = 'billing_issue',
  FEATURE_REQUEST = 'feature_request',
  COMPLAINT = 'complaint',
  OTHER = 'other'
}

// System Monitoring types
export enum SystemStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down',
  MAINTENANCE = 'maintenance'
}

export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface SystemComponent {
  id: string;
  name: string;
  type: string;
  status: SystemStatus;
  last_checked: string;
  uptime_percentage: number;
  metrics?: Record<string, any>;
  notes?: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  component_id?: string;
  component_name?: string;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  acknowledged_by?: string;
  acknowledger_name?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

// Document Management types
export enum DocumentType {
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  DRIVER_LICENSE = 'driver_license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  INSURANCE = 'insurance',
  TAX_DOCUMENT = 'tax_document',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  REJECTED = 'rejected'
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploader_name?: string;
  entity_id?: string;
  entity_type?: string;
  document_type: DocumentType;
  tags?: string[];
  status: DocumentStatus;
  verified_by?: string;
  verifier_name?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

// Marketing types
export enum PromoCodeType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_DELIVERY = 'free_delivery'
}

export enum PromoCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAUSED = 'paused',
  DEPLETED = 'depleted'
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoCodeType;
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  status: PromoCodeStatus;
  customer_id?: string;
  customer_type?: string;
  vehicle_type_id?: string;
  start_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  audience: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  spent?: number;
  conversion_count: number;
  click_count: number;
  impression_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  filter_criteria: Record<string, any>;
  customer_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  customer_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  assigned_to?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  customer_name?: string;
  customer_email?: string;
  assignee_name?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  attachments?: string[];
  is_internal: boolean;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

// Settings types
export interface AdminSettings {
  id: string;
  name: string;
  value: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Vehicle types
export interface VehicleType {
  id: string;
  name: string;
  capacity: string;
  max_weight: number;
  base_price: number;
  price_per_km: number;
  image_url?: string;
  active: boolean;
  created_at: string;
}

// Admin service with methods for fetching and managing admin data
export const adminService = {
  // User Management
  async getUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  async disableUser(userId: string): Promise<boolean> {
    try {
      // In a real app, you would have a 'disabled' field in your user table
      // This is a simplified version
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: false
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error disabling user ${userId}:`, error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Note: In production, you should use an RPC function or API endpoint
      // that handles both auth and profile deletion
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Order Management
  async getOrders(): Promise<AdminOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!customer_id(name, email),
          drivers:profiles!driver_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Format the data to make it easier to work with
      const formattedOrders = data?.map(order => ({
        ...order,
        customer_name: order.profiles?.name,
        customer_email: order.profiles?.email,
        driver_name: order.drivers?.name
      })) || [];

      return formattedOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<AdminOrder | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!customer_id(name, email),
          drivers:profiles!driver_id(name)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        throw error;
      }

      // Format the response
      const formattedOrder = {
        ...data,
        customer_name: data.profiles?.name,
        customer_email: data.profiles?.email,
        driver_name: data.drivers?.name
      };

      return formattedOrder;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      // In production, consider using an archive table instead of deleting
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  },

  // Analytics
  async getAnalytics(timeframe: 'week' | 'month' | 'year'): Promise<AdminAnalytics> {
    try {
      // Calculate date range based on timeframe
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const startDateStr = startDate.toISOString();
      
      // Fetch basic analytics data in parallel
      const [
        ordersResponse,
        customersResponse,
        driversResponse,
        revenueResponse,
        completedResponse,
        cancelledResponse,
        pendingResponse
      ] = await Promise.all([
        // Total orders count
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        
        // Total customers count
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .neq('role', 'driver')
          .neq('role', 'admin'),
        
        // Total drivers count
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .eq('role', 'driver'),
        
        // Total revenue (sum of all order prices)
        supabase.from('orders').select('price'),
        
        // Completed orders count
        supabase.from('orders').select('*', { count: 'exact', head: true })
          .eq('status', 'completed'),
        
        // Cancelled orders count
        supabase.from('orders').select('*', { count: 'exact', head: true })
          .eq('status', 'cancelled'),
        
        // Pending orders count
        supabase.from('orders').select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
      ]);
      
      // Calculate total revenue
      const totalRevenue = (revenueResponse.data || []).reduce(
        (sum, order) => sum + (order.price || 0), 
        0
      );
      
      // Calculate average order value
      const avgOrderValue = ordersResponse.count && ordersResponse.count > 0 
        ? totalRevenue / ordersResponse.count 
        : 0;
      
      return {
        totalOrders: ordersResponse.count || 0,
        totalRevenue,
        avgOrderValue,
        totalCustomers: customersResponse.count || 0,
        totalDrivers: driversResponse.count || 0,
        completedOrders: completedResponse.count || 0,
        cancelledOrders: cancelledResponse.count || 0,
        pendingOrders: pendingResponse.count || 0
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  async getOrdersByDay(timeframe: 'week' | 'month' | 'year'): Promise<OrderCountsByDay[]> {
    try {
      // Calculate date range based on timeframe
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const startDateStr = startDate.toISOString();
      
      // Get orders within date range
      const { data, error } = await supabase
        .from('orders')
        .select('created_at')
        .gte('created_at', startDateStr)
        .lte('created_at', endDate.toISOString());
      
      if (error) {
        throw error;
      }
      
      // In a real app, you would use a database function or query to aggregate by day
      // This is a client-side implementation for simplicity
      const ordersByDay: { [key: string]: number } = {};
      
      // Initialize all days in the range with 0 orders
      const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      for (let i = 0; i < daysBetween; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        ordersByDay[formattedDate] = 0;
      }
      
      // Count orders per day
      data?.forEach(order => {
        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        ordersByDay[formattedDate] = (ordersByDay[formattedDate] || 0) + 1;
      });
      
      // Convert to array for chart display
      return Object.entries(ordersByDay).map(([date, count]) => ({ 
        date, 
        count 
      })).sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error('Error fetching orders by day:', error);
      throw error;
    }
  },

  async getOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
    try {
      // Get counts for each status
      const [completedRes, cancelledRes, pendingRes, acceptedRes, inTransitRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.COMPLETED),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.CANCELLED),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.PENDING),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.ACCEPTED),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.IN_TRANSIT)
      ]);
      
      return [
        { name: 'Completed', value: completedRes.count || 0 },
        { name: 'Cancelled', value: cancelledRes.count || 0 },
        { name: 'Pending', value: pendingRes.count || 0 },
        { name: 'Accepted', value: acceptedRes.count || 0 },
        { name: 'In Transit', value: inTransitRes.count || 0 }
      ];
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      throw error;
    }
  },

  // Settings Management
  async getSystemSettings(): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) {
        throw error;
      }

      // Convert array of settings to key-value object
      const settings: Record<string, string> = {};
      data?.forEach(setting => {
        settings[setting.name] = setting.value;
      });

      return settings;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  async updateSystemSettings(category: string, settings: Record<string, string>): Promise<boolean> {
    try {
      // Convert settings object to array of upsert operations
      const upserts = Object.entries(settings).map(([name, value]) => ({
        name,
        value,
        category,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(upserts, { onConflict: 'name' });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error updating ${category} settings:`, error);
      throw error;
    }
  },

  // Vehicle Management
  async getVehicles(): Promise<VehicleType[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  async getVehicleById(vehicleId: string): Promise<VehicleType | null> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  async createVehicle(vehicleData: Omit<VehicleType, 'id' | 'created_at'>): Promise<VehicleType> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .insert([{ ...vehicleData, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  async updateVehicle(vehicleId: string, vehicleData: Partial<VehicleType>): Promise<VehicleType> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .update(vehicleData)
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  async deleteVehicle(vehicleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', vehicleId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  // Support Ticket Management
  async getTickets(): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          profiles!customer_id(name, email),
          assignee:profiles!assigned_to(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Format the data to include customer and assignee information
      const formattedTickets = data?.map(ticket => ({
        ...ticket,
        customer_name: ticket.profiles?.name,
        customer_email: ticket.profiles?.email,
        assignee_name: ticket.assignee?.name
      })) || [];

      return formattedTickets;
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }
  },

  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          profiles!customer_id(name, email),
          assignee:profiles!assigned_to(name)
        `)
        .eq('id', ticketId)
        .single();

      if (error) {
        throw error;
      }

      // Format the response
      const formattedTicket = {
        ...data,
        customer_name: data.profiles?.name,
        customer_email: data.profiles?.email,
        assignee_name: data.assignee?.name
      };

      return formattedTicket;
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error);
      throw error;
    }
  },

  async createTicket(ticketData: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>): Promise<SupportTicket> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          ...ticketData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  },

  async updateTicket(ticketId: string, ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
    try {
      const updateData = {
        ...ticketData,
        updated_at: new Date().toISOString()
      };
      
      // If status is being changed to resolved, set resolved_at
      if (ticketData.status === TicketStatus.RESOLVED && !ticketData.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating ticket ${ticketId}:`, error);
      throw error;
    }
  },
  
  async assignTicket(ticketId: string, assigneeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          assigned_to: assigneeId,
          status: TicketStatus.IN_PROGRESS,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error assigning ticket ${ticketId}:`, error);
      throw error;
    }
  },

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select(`
          *,
          profiles!sender_id(name, role)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Format the data to include sender information
      const formattedMessages = data?.map(message => ({
        ...message,
        sender_name: message.profiles?.name,
        sender_role: message.profiles?.role
      })) || [];

      return formattedMessages;
    } catch (error) {
      console.error(`Error fetching messages for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  async addTicketMessage(messageData: Omit<TicketMessage, 'id' | 'created_at'>): Promise<TicketMessage> {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([{
          ...messageData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the ticket's updated_at timestamp
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', messageData.ticket_id);

      return data;
    } catch (error) {
      console.error('Error adding ticket message:', error);
      throw error;
    }
  },

  async getTicketStats(): Promise<{
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    totalTickets: number;
    averageResolutionTime: number;
  }> {
    try {
      const [openRes, inProgressRes, resolvedRes, closedRes] = await Promise.all([
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', TicketStatus.OPEN),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', TicketStatus.IN_PROGRESS),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', TicketStatus.RESOLVED),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', TicketStatus.CLOSED)
      ]);
      
      // Get resolved tickets to calculate average resolution time
      const { data: resolvedTickets } = await supabase
        .from('support_tickets')
        .select('created_at, resolved_at')
        .not('resolved_at', 'is', null);
      
      let averageResolutionTime = 0;
      
      if (resolvedTickets && resolvedTickets.length > 0) {
        const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
          const createdDate = new Date(ticket.created_at);
          const resolvedDate = new Date(ticket.resolved_at);
          const resolutionTime = resolvedDate.getTime() - createdDate.getTime();
          return total + resolutionTime;
        }, 0);
        
        // Average resolution time in hours
        averageResolutionTime = totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60);
      }
      
      return {
        open: openRes.count || 0,
        inProgress: inProgressRes.count || 0,
        resolved: resolvedRes.count || 0,
        closed: closedRes.count || 0,
        totalTickets: (openRes.count || 0) + (inProgressRes.count || 0) + (resolvedRes.count || 0) + (closedRes.count || 0),
        averageResolutionTime
      };
    } catch (error) {
      console.error('Error fetching ticket statistics:', error);
      throw error;
    }
  },

  // Financial Management
  async getTransactions(timeframe: 'week' | 'month' | 'year' = 'month'): Promise<FinancialTransaction[]> {
    try {
      // Calculate date range based on timeframe
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const startDateStr = startDate.toISOString();
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          profiles!customer_id(name),
          drivers:profiles!driver_id(name)
        `)
        .gte('created_at', startDateStr)
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Format the data to include customer and driver information
      const formattedTransactions = data?.map(transaction => ({
        ...transaction,
        customer_name: transaction.profiles?.name,
        driver_name: transaction.drivers?.name
      })) || [];

      return formattedTransactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async getTransactionById(transactionId: string): Promise<FinancialTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          profiles!customer_id(name),
          drivers:profiles!driver_id(name)
        `)
        .eq('id', transactionId)
        .single();

      if (error) {
        throw error;
      }

      // Format the response
      const formattedTransaction = {
        ...data,
        customer_name: data.profiles?.name,
        driver_name: data.drivers?.name
      };

      return formattedTransaction;
    } catch (error) {
      console.error(`Error fetching transaction ${transactionId}:`, error);
      throw error;
    }
  },

  async getFinancialSummary(timeframe: 'week' | 'month' | 'year' = 'month'): Promise<FinancialSummary> {
    try {
      // Calculate date range based on timeframe
      const endDate = new Date();
      let startDate = new Date();
      let periodFormat: 'day' | 'week' | 'month' = 'day';
      
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
        periodFormat = 'day';
      } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
        periodFormat = 'day';
      } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
        periodFormat = 'month';
      }
      
      const startDateStr = startDate.toISOString();
      
      // Fetch transactions for the time period
      const { data: transactions, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('created_at', startDateStr)
        .lte('created_at', endDate.toISOString());

      if (error) {
        throw error;
      }

      // Calculate summary data
      const totalRevenue = transactions
        .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const totalFees = transactions
        .filter(t => t.type === TransactionType.FEE)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const totalRefunds = transactions
        .filter(t => t.type === TransactionType.REFUND)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const pendingAmount = transactions
        .filter(t => t.status === TransactionStatus.PENDING)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const netRevenue = totalRevenue - totalFees - totalRefunds;
      
      const paymentCount = transactions
        .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
        .length;
        
      const averageOrderValue = paymentCount > 0 ? totalRevenue / paymentCount : 0;

      // Generate revenue by period
      const revenueByPeriod: RevenueByPeriod[] = [];
      if (periodFormat === 'day') {
        // Generate a date range
        const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        for (let i = 0; i < daysBetween; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          // Filter transactions for this day
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);
          
          const dayTransactions = transactions.filter(t => {
            const txDate = new Date(t.created_at);
            return txDate >= dayStart && txDate <= dayEnd;
          });
          
          const dayRevenue = dayTransactions
            .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const dayFees = dayTransactions
            .filter(t => t.type === TransactionType.FEE)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const dayRefunds = dayTransactions
            .filter(t => t.type === TransactionType.REFUND)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const dayNetRevenue = dayRevenue - dayFees - dayRefunds;
          
          const dayOrders = dayTransactions
            .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
            .length;
          
          revenueByPeriod.push({
            period: formattedDate,
            revenue: dayRevenue,
            orders: dayOrders,
            fees: dayFees,
            refunds: dayRefunds,
            net_revenue: dayNetRevenue
          });
        }
      } else if (periodFormat === 'month') {
        // Handle monthly periods for annual view
        for (let i = 0; i < 12; i++) {
          const date = new Date(startDate);
          date.setMonth(startDate.getMonth() + i);
          const formattedMonth = date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric'
          });
          
          // Filter transactions for this month
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
          
          const monthTransactions = transactions.filter(t => {
            const txDate = new Date(t.created_at);
            return txDate >= monthStart && txDate <= monthEnd;
          });
          
          const monthRevenue = monthTransactions
            .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const monthFees = monthTransactions
            .filter(t => t.type === TransactionType.FEE)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const monthRefunds = monthTransactions
            .filter(t => t.type === TransactionType.REFUND)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const monthNetRevenue = monthRevenue - monthFees - monthRefunds;
          
          const monthOrders = monthTransactions
            .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
            .length;
          
          revenueByPeriod.push({
            period: formattedMonth,
            revenue: monthRevenue,
            orders: monthOrders,
            fees: monthFees,
            refunds: monthRefunds,
            net_revenue: monthNetRevenue
          });
        }
      }

      // Calculate top customers
      const customerMap = new Map<string, { 
        customer_id: string;
        customer_name: string;
        total_spent: number;
        order_count: number;
      }>();
      
      for (const tx of transactions) {
        if (tx.type === TransactionType.PAYMENT && 
            tx.status === TransactionStatus.COMPLETED && 
            tx.customer_id) {
          const customerId = tx.customer_id;
          
          if (!customerMap.has(customerId)) {
            customerMap.set(customerId, {
              customer_id: customerId,
              customer_name: tx.customer_name || 'Unknown',
              total_spent: 0,
              order_count: 0
            });
          }
          
          const customerData = customerMap.get(customerId)!;
          customerData.total_spent += tx.amount || 0;
          customerData.order_count += 1;
        }
      }
      
      const topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 5);

      // Calculate payment method breakdown
      const paymentMethods = new Map<string, { count: number; amount: number }>();
      
      for (const tx of transactions) {
        if (tx.type === TransactionType.PAYMENT && 
            tx.status === TransactionStatus.COMPLETED && 
            tx.payment_method) {
          const method = tx.payment_method;
          
          if (!paymentMethods.has(method)) {
            paymentMethods.set(method, {
              count: 0,
              amount: 0
            });
          }
          
          const methodData = paymentMethods.get(method)!;
          methodData.count += 1;
          methodData.amount += tx.amount || 0;
        }
      }
      
      const paymentMethodBreakdown = Array.from(paymentMethods.entries())
        .map(([name, { amount }]) => ({
          name,
          value: amount,
          percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value);

      return {
        totalRevenue,
        totalFees,
        totalRefunds,
        netRevenue,
        pendingAmount,
        averageOrderValue,
        revenueByPeriod,
        topCustomers,
        paymentMethodBreakdown
      };
    } catch (error) {
      console.error('Error calculating financial summary:', error);
      throw error;
    }
  },

  async getOrderFinancials(orderId: string): Promise<{
    order: AdminOrder | null;
    transactions: FinancialTransaction[];
    totalPaid: number;
    totalRefunded: number;
    netAmount: number;
  }> {
    try {
      // Get order details
      const order = await this.getOrderById(orderId);
      
      // Get all transactions for this order
      const { data: transactions, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Calculate totals
      const totalPaid = transactions
        .filter(t => t.type === TransactionType.PAYMENT && t.status === TransactionStatus.COMPLETED)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const totalRefunded = transactions
        .filter(t => t.type === TransactionType.REFUND)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const netAmount = totalPaid - totalRefunded;
      
      return {
        order,
        transactions: transactions || [],
        totalPaid,
        totalRefunded,
        netAmount
      };
    } catch (error) {
      console.error(`Error fetching financials for order ${orderId}:`, error);
      throw error;
    }
  },

  // Marketing Management
  async getPromoCodes(): Promise<PromoCode[]> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select(`
          *,
          profiles!customer_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Format the data to include customer name
      const formattedCodes = data?.map(code => ({
        ...code,
        customer_name: code.profiles?.name
      })) || [];

      return formattedCodes;
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      throw error;
    }
  },

  async getPromoCodeById(codeId: string): Promise<PromoCode | null> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select(`
          *,
          profiles!customer_id(name)
        `)
        .eq('id', codeId)
        .single();

      if (error) {
        throw error;
      }

      // Format the response
      const formattedCode = {
        ...data,
        customer_name: data.profiles?.name
      };

      return formattedCode;
    } catch (error) {
      console.error(`Error fetching promo code ${codeId}:`, error);
      throw error;
    }
  },

  async createPromoCode(codeData: Omit<PromoCode, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'customer_name'>): Promise<PromoCode> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('promo_codes')
        .insert([{
          ...codeData,
          usage_count: 0,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating promo code:', error);
      throw error;
    }
  },

  async updatePromoCode(codeId: string, codeData: Partial<PromoCode>): Promise<PromoCode> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .update({
          ...codeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', codeId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating promo code ${codeId}:`, error);
      throw error;
    }
  },

  async deletePromoCode(codeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', codeId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting promo code ${codeId}:`, error);
      throw error;
    }
  },

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching marketing campaigns:', error);
      throw error;
    }
  },

  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching campaign ${campaignId}:`, error);
      throw error;
    }
  },

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    try {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching customer segments:', error);
      throw error;
    }
  },

  async getCustomerSegmentById(segmentId: string): Promise<CustomerSegment | null> {
    try {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('id', segmentId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching customer segment ${segmentId}:`, error);
      throw error;
    }
  },

  async getMarketingStats(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalCustomers: number;
    activePromoCodes: number;
    totalSegments: number;
  }> {
    try {
      const [
        campaignsRes,
        activeCampaignsRes,
        customersRes,
        promoCodesRes,
        segmentsRes
      ] = await Promise.all([
        supabase.from('marketing_campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('marketing_campaigns').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['customer', 'business']),
        supabase.from('promo_codes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('customer_segments').select('id', { count: 'exact', head: true })
      ]);
      
      return {
        totalCampaigns: campaignsRes.count || 0,
        activeCampaigns: activeCampaignsRes.count || 0,
        totalCustomers: customersRes.count || 0,
        activePromoCodes: promoCodesRes.count || 0,
        totalSegments: segmentsRes.count || 0
      };
    } catch (error) {
      console.error('Error fetching marketing statistics:', error);
      throw error;
    }
  },

  // Document Management
  async getDocuments(filters?: {
    document_type?: DocumentType;
    status?: DocumentStatus;
    entity_type?: string;
    entity_id?: string;
  }): Promise<Document[]> {
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          uploaders:profiles!uploaded_by(name),
          verifiers:profiles!verified_by(name)
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters?.document_type) {
        query = query.eq('document_type', filters.document_type);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      
      if (filters?.entity_id) {
        query = query.eq('entity_id', filters.entity_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Format the data to include uploader and verifier information
      const formattedDocs = data?.map(doc => ({
        ...doc,
        uploader_name: doc.uploaders?.name,
        verifier_name: doc.verifiers?.name
      })) || [];
      
      return formattedDocs;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },
  
  async getDocumentById(documentId: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploaders:profiles!uploaded_by(name),
          verifiers:profiles!verified_by(name)
        `)
        .eq('id', documentId)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the response
      const formattedDoc = {
        ...data,
        uploader_name: data.uploaders?.name,
        verifier_name: data.verifiers?.name
      };
      
      return formattedDoc;
    } catch (error) {
      console.error(`Error fetching document ${documentId}:`, error);
      throw error;
    }
  },
  
  async uploadDocument(documentData: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'uploader_name' | 'verifier_name' | 'file_path' | 'file_size' | 'file_type'>, file: File): Promise<Document> {
    try {
      // 1. Upload the file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `documents/${documentData.document_type}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // 3. Create the document record
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          ...documentData,
          file_path: publicUrl,
          file_size: file.size,
          file_type: file.type,
          status: DocumentStatus.PENDING,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) {
        // If record insertion fails, delete the uploaded file
        await supabase.storage.from('documents').remove([filePath]);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
  
  async updateDocumentStatus(documentId: string, status: DocumentStatus, verifiedBy?: string): Promise<Document> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === DocumentStatus.VERIFIED && verifiedBy) {
        updateData.verified_by = verifiedBy;
      }
      
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating document status ${documentId}:`, error);
      throw error;
    }
  },
  
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      // First get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete the document record
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Extract the storage path from the URL
      const urlParts = document.file_path.split('/');
      const storagePath = urlParts.slice(urlParts.indexOf('documents')).join('/');
      
      // Delete the file from storage
      await supabase.storage
        .from('documents')
        .remove([storagePath]);
      
      return true;
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      throw error;
    }
  },
  
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    pendingVerification: number;
    verified: number;
    expired: number;
    rejected: number;
    documentTypeBreakdown: { type: string; count: number }[];
  }> {
    try {
      const [
        totalRes,
        pendingRes,
        verifiedRes,
        expiredRes,
        rejectedRes
      ] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', DocumentStatus.PENDING),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', DocumentStatus.VERIFIED),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', DocumentStatus.EXPIRED),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', DocumentStatus.REJECTED)
      ]);
      
      // Get document type breakdown
      const { data: typeData, error: typeError } = await supabase
        .from('documents')
        .select('document_type');
        
      if (typeError) {
        throw typeError;
      }
      
      // Count by document type
      const typeCounts = typeData?.reduce((acc, doc) => {
        acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      const documentTypeBreakdown = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count
      }));
      
      return {
        totalDocuments: totalRes.count || 0,
        pendingVerification: pendingRes.count || 0,
        verified: verifiedRes.count || 0,
        expired: expiredRes.count || 0,
        rejected: rejectedRes.count || 0,
        documentTypeBreakdown
      };
    } catch (error) {
      console.error('Error fetching document statistics:', error);
      throw error;
    }
  },

  // System Monitoring
  async getSystemComponents(): Promise<SystemComponent[]> {
    try {
      const { data, error } = await supabase
        .from('system_components')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching system components:', error);
      throw error;
    }
  },
  
  async getSystemAlerts(includeResolved: boolean = false): Promise<SystemAlert[]> {
    try {
      let query = supabase
        .from('system_alerts')
        .select(`
          *,
          components:component_id(name),
          acknowledgers:profiles!acknowledged_by(name)
        `)
        .order('created_at', { ascending: false });
      
      if (!includeResolved) {
        query = query.is('resolved_at', null);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Format the data to include component and acknowledger information
      const formattedAlerts = data?.map(alert => ({
        ...alert,
        component_name: alert.components?.name,
        acknowledger_name: alert.acknowledgers?.name
      })) || [];
      
      return formattedAlerts;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      throw error;
    }
  },
  
  async acknowledgeAlert(alertId: string, userId: string): Promise<SystemAlert> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: userId
        })
        .eq('id', alertId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error acknowledging alert ${alertId}:`, error);
      throw error;
    }
  },
  
  async resolveAlert(alertId: string): Promise<SystemAlert> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error resolving alert ${alertId}:`, error);
      throw error;
    }
  },
  
  async getSystemLogs(limit: number = 100, source?: string, level?: string): Promise<SystemLog[]> {
    try {
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (source) {
        query = query.eq('source', source);
      }
      
      if (level) {
        query = query.eq('level', level);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  },
  
  async getSystemOverview(): Promise<{
    components: { 
      total: number;
      healthy: number;
      degraded: number;
      down: number;
      maintenance: number;
    };
    alerts: {
      total: number;
      critical: number;
      error: number;
      warning: number;
      info: number;
    };
    logs: {
      total: number;
      error: number;
      warning: number;
      info: number;
      debug: number;
    };
    performance: {
      api_response_time: number;
      db_query_time: number;
      server_load: number;
      memory_usage: number;
    };
  }> {
    try {
      // Get component counts by status
      const [
        totalComponents,
        healthyComponents,
        degradedComponents,
        downComponents,
        maintenanceComponents
      ] = await Promise.all([
        supabase.from('system_components').select('id', { count: 'exact', head: true }),
        supabase.from('system_components').select('id', { count: 'exact', head: true }).eq('status', SystemStatus.HEALTHY),
        supabase.from('system_components').select('id', { count: 'exact', head: true }).eq('status', SystemStatus.DEGRADED),
        supabase.from('system_components').select('id', { count: 'exact', head: true }).eq('status', SystemStatus.DOWN),
        supabase.from('system_components').select('id', { count: 'exact', head: true }).eq('status', SystemStatus.MAINTENANCE)
      ]);
      
      // Get alert counts by level
      const [
        totalAlerts,
        criticalAlerts,
        errorAlerts,
        warningAlerts,
        infoAlerts
      ] = await Promise.all([
        supabase.from('system_alerts').select('id', { count: 'exact', head: true }).is('resolved_at', null),
        supabase.from('system_alerts').select('id', { count: 'exact', head: true }).eq('level', AlertLevel.CRITICAL).is('resolved_at', null),
        supabase.from('system_alerts').select('id', { count: 'exact', head: true }).eq('level', AlertLevel.ERROR).is('resolved_at', null),
        supabase.from('system_alerts').select('id', { count: 'exact', head: true }).eq('level', AlertLevel.WARNING).is('resolved_at', null),
        supabase.from('system_alerts').select('id', { count: 'exact', head: true }).eq('level', AlertLevel.INFO).is('resolved_at', null)
      ]);
      
      // Get log counts by level for the last day
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const oneDayAgoStr = oneDayAgo.toISOString();
      
      const [
        totalLogs,
        errorLogs,
        warningLogs,
        infoLogs,
        debugLogs
      ] = await Promise.all([
        supabase.from('system_logs').select('id', { count: 'exact', head: true }).gte('timestamp', oneDayAgoStr),
        supabase.from('system_logs').select('id', { count: 'exact', head: true }).eq('level', 'error').gte('timestamp', oneDayAgoStr),
        supabase.from('system_logs').select('id', { count: 'exact', head: true }).eq('level', 'warning').gte('timestamp', oneDayAgoStr),
        supabase.from('system_logs').select('id', { count: 'exact', head: true }).eq('level', 'info').gte('timestamp', oneDayAgoStr),
        supabase.from('system_logs').select('id', { count: 'exact', head: true }).eq('level', 'debug').gte('timestamp', oneDayAgoStr)
      ]);
      
      // Get latest performance metrics
      const { data: performanceData, error: performanceError } = await supabase
        .from('system_performance')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (performanceError && performanceError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw performanceError;
      }
      
      // Default values if no performance data found
      const performance = performanceData || {
        api_response_time: 150, // ms
        db_query_time: 50, // ms
        server_load: 0.5, // 0-1 scale
        memory_usage: 0.3 // 0-1 scale
      };
      
      return {
        components: {
          total: totalComponents.count || 0,
          healthy: healthyComponents.count || 0,
          degraded: degradedComponents.count || 0,
          down: downComponents.count || 0,
          maintenance: maintenanceComponents.count || 0
        },
        alerts: {
          total: totalAlerts.count || 0,
          critical: criticalAlerts.count || 0,
          error: errorAlerts.count || 0,
          warning: warningAlerts.count || 0,
          info: infoAlerts.count || 0
        },
        logs: {
          total: totalLogs.count || 0,
          error: errorLogs.count || 0,
          warning: warningLogs.count || 0,
          info: infoLogs.count || 0,
          debug: debugLogs.count || 0
        },
        performance
      };
    } catch (error) {
      console.error('Error fetching system overview:', error);
      throw error;
    }
  }
};