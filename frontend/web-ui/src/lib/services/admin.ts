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
  }
};