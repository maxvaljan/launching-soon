import { supabase } from '../supabase';
import { apiClient } from '../api';
import { UserRole } from '../../../../../shared/types/user';
import { OrderStatus, PaymentMethod } from '../../../../../shared/types/order';

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
  }
};