'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  Package, 
  Building2, 
  User,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  BarChart3,
  CreditCard,
  Settings,
  Calendar,
  AlertCircle,
  Check,
  X,
  FileText,
  Filter,
  LogOut,
  Clock,
  ChevronDown,
  ChevronsUpDown,
  Trash2,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loading, PageLoading } from '@/components/ui/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Database types
// Simplified types to match what Supabase returns for this specific query
type SupabaseOrderData = {
  id: string;
  customer_id?: string;
  driver_id?: string;
  status?: string;
  created_at?: string;
  price?: number;
  customer?: {
    first_name?: string;
    last_name?: string;
  };
  driver?: {
    first_name?: string;
    last_name?: string;
  };
};

// UI types
type User = {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  created: string;
  first_name?: string;
  last_name?: string;
};

type Driver = {
  id: string;
  name: string;
  email: string;
  vehicle: string;
  status: string;
  completedOrders: number;
  rating: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

type Order = {
  id: string;
  customer: string;
  driver: string;
  status: string;
  date: string;
  amount: number;
  customer_id?: string;
  driver_id?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDrivers: 0,
    deliveriesToday: 0,
    businessAccounts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    canceledOrders: 0
  });

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        setLoading(true);
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.replace('/signin');
          return;
        }
        
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (profile?.role !== 'admin') {
          toast.error('Access denied. You need admin permissions to view this page.');
          router.replace('/dashboard');
          return;
        }
        
        // Fetch all data
        await Promise.all([
          fetchUsers(),
          fetchDrivers(),
          fetchOrders(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('Error checking user role:', error);
        toast.error('Could not verify your admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAndFetchData();
    
    // Set up real-time subscriptions
    const setupSubscriptions = async () => {
      const userSubscription = supabase
        .channel('public:profiles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          fetchUsers();
          fetchDrivers();
          fetchStats();
        })
        .subscribe();
        
      const orderSubscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          fetchOrders();
          fetchStats();
        })
        .subscribe();
        
      return () => {
        userSubscription.unsubscribe();
        orderSubscription.unsubscribe();
      };
    };
    
    const unsubscribe = setupSubscriptions();
    
    return () => {
      unsubscribe.then(fn => fn());
    };
  }, [router]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, account_type, role, status, created_at')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        type: user.account_type || 'personal',
        status: user.status || 'active',
        created: user.created_at ? format(new Date(user.created_at), 'yyyy-MM-dd') : '',
        first_name: user.first_name,
        last_name: user.last_name
      }));
      
      setUsers(formattedUsers.filter(user => user.type !== 'driver'));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      setDriversLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone_number, vehicle_type, status, average_rating, total_deliveries')
        .eq('role', 'driver')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedDrivers = data.map(driver => ({
        id: driver.id,
        name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim(),
        email: driver.email || '',
        phone_number: driver.phone_number || '',
        vehicle: driver.vehicle_type || 'car',
        status: driver.status || 'active',
        completedOrders: driver.total_deliveries || 0,
        rating: driver.average_rating || 0,
        first_name: driver.first_name,
        last_name: driver.last_name
      }));
      
      setDrivers(formattedDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      setDriversLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          customer_id, 
          driver_id, 
          status, 
          created_at, 
          price,
          customer:profiles!customer_id(first_name, last_name),
          driver:profiles!driver_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedOrders = (data as SupabaseOrderData[]).map(order => ({
        id: order.id,
        customer: order.customer 
          ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() 
          : 'Unknown',
        driver: order.driver
          ? `${order.driver.first_name || ''} ${order.driver.last_name || ''}`.trim() 
          : 'Pending assignment',
        status: order.status || 'pending',
        date: order.created_at ? format(new Date(order.created_at), 'yyyy-MM-dd') : '',
        amount: order.price || 0,
        customer_id: order.customer_id,
        driver_id: order.driver_id
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, this would be a server-side API that calculates all these metrics
      // For now, we'll calculate from the client-side data
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('role, account_type, status');
        
      const { data: ordersData } = await supabase
        .from('orders')
        .select('status, price, created_at');
      
      // Calculate stats
      const totalUsers = profilesData?.filter(p => p.role !== 'driver').length || 0;
      const activeDrivers = profilesData?.filter(p => p.role === 'driver' && p.status === 'active').length || 0;
      const businessAccounts = profilesData?.filter(p => p.account_type === 'business').length || 0;
      
      const today = new Date().toISOString().split('T')[0];
      const deliveriesToday = ordersData?.filter(o => o.created_at?.startsWith(today)).length || 0;
      
      const pendingOrders = ordersData?.filter(o => ['pending', 'assigned'].includes(o.status)).length || 0;
      const completedOrders = ordersData?.filter(o => o.status === 'delivered').length || 0;
      const canceledOrders = ordersData?.filter(o => o.status === 'cancelled').length || 0;
      
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
      
      setStats({
        totalUsers,
        activeDrivers,
        deliveriesToday,
        businessAccounts,
        totalRevenue,
        pendingOrders,
        completedOrders,
        canceledOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`User status updated to ${newStatus}`);
      
      // Optimistically update UI
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDriverStatusChange = async (driverId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', driverId);
        
      if (error) throw error;
      
      toast.success(`Driver status updated to ${newStatus}`);
      
      // Optimistically update UI
      setDrivers(drivers.map(driver => 
        driver.id === driverId ? { ...driver, status: newStatus } : driver
      ));
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Failed to update driver status');
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast.success(`Order status updated to ${newStatus}`);
      
      // Optimistically update UI
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const assignDriverToOrder = async (orderId: string, driverId: string) => {
    try {
      const driver = drivers.find(d => d.id === driverId);
      
      if (!driver) {
        toast.error('Driver not found');
        return;
      }
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          driver_id: driverId,
          status: 'assigned'
        })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast.success(`Order assigned to ${driver.name}`);
      
      // Optimistically update UI
      setOrders(orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          driver: driver.name,
          driver_id: driverId,
          status: 'assigned'
        } : order
      ));
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Filter functions
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredDrivers = () => {
    return drivers.filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.driver.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  if (loading) {
    return <PageLoading message="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <ShieldCheck className="h-10 w-10 text-maxmove-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your platform</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-blue-600 text-xs mt-2">↑ 12% from last month</p>
          </Card>
          
          <Card className="p-4 bg-green-50 border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-600 text-sm font-medium">Active Drivers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.activeDrivers}</h3>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-green-600 text-xs mt-2">↑ 8% from last month</p>
          </Card>
          
          <Card className="p-4 bg-amber-50 border-amber-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-600 text-sm font-medium">Deliveries Today</p>
                <h3 className="text-2xl font-bold mt-1">{stats.deliveriesToday}</h3>
              </div>
              <Package className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-amber-600 text-xs mt-2">↑ 15% from yesterday</p>
          </Card>
          
          <Card className="p-4 bg-purple-50 border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-600 text-sm font-medium">Business Accounts</p>
                <h3 className="text-2xl font-bold mt-1">{stats.businessAccounts}</h3>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-purple-600 text-xs mt-2">↑ 5% from last month</p>
          </Card>
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <Package className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-lg font-semibold">{stats.pendingOrders}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded">
                <Check className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-lg font-semibold">{stats.completedOrders}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded">
                <X className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Canceled Orders</p>
                <p className="text-lg font-semibold">{stats.canceledOrders}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
            <TabsTrigger value="drivers" className="flex-1">Drivers</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-start border-b border-gray-100 pb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Package className="h-4 w-4 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-sm">{order.customer}</p>
                            <p className="text-xs text-gray-500">Order {order.id.substring(0,8)}</p>
                          </div>
                          <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <Badge variant={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'in_transit' ? 'default' :
                            order.status === 'pending' ? 'warning' :
                            order.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                          <span className="font-medium text-sm">€{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Recent Users */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">New Users</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center border-b border-gray-100 pb-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{user.name}</p>
                          <span className="text-xs text-gray-500">{user.created}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <Badge variant={user.type === 'business' ? 'secondary' : 'outline'}>
                            {user.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Revenue Overview */}
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Revenue Overview</h3>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h4 className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</h4>
                  <p className="text-xs text-green-600">↑ 12% from previous period</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <h4 className="text-2xl font-bold">
                    €{orders.length ? (stats.totalRevenue / orders.length).toFixed(2) : '0.00'}
                  </h4>
                  <p className="text-xs text-green-600">↑ 5% from previous period</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h4 className="text-2xl font-bold">{orders.length}</h4>
                  <p className="text-xs text-green-600">↑ 8% from previous period</p>
                </div>
              </div>
              
              <div className="h-60 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold">Users</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10 w-full sm:w-64" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {usersLoading ? (
                <div className="py-8 flex justify-center">
                  <Loading variant="spinner" size="md" text="Loading users..." />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredUsers().slice(0, 10).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.type === 'business' ? 'secondary' : 'outline'}>
                              {user.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'active' ? 'success' :
                              user.status === 'pending' ? 'warning' :
                              'destructive'
                            }>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.created}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit user</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                
                                {user.status === 'active' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserStatusChange(user.id, 'inactive')}
                                    className="text-amber-600"
                                  >
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : user.status === 'inactive' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserStatusChange(user.id, 'active')}
                                    className="text-green-600"
                                  >
                                    Activate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserStatusChange(user.id, 'active')}
                                    className="text-green-600"
                                  >
                                    Approve
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 text-center text-sm text-gray-500 flex justify-between items-center">
                    <div>
                      Showing {Math.min(10, getFilteredUsers().length)} of {getFilteredUsers().length} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm" disabled={getFilteredUsers().length <= 10}>Next</Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>
          
          {/* Drivers Tab */}
          <TabsContent value="drivers" className="mt-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold">Drivers</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search drivers..." 
                      className="pl-10 w-full sm:w-64" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {driversLoading ? (
                <div className="py-8 flex justify-center">
                  <Loading variant="spinner" size="md" text="Loading drivers..." />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredDrivers().slice(0, 10).map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">{driver.name}</TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>{driver.vehicle}</TableCell>
                          <TableCell>
                            <Badge variant={
                              driver.status === 'active' ? 'success' :
                              driver.status === 'pending' ? 'warning' :
                              'destructive'
                            }>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{driver.completedOrders}</TableCell>
                          <TableCell>
                            {driver.rating > 0 ? (
                              <div className="flex items-center">
                                {driver.rating.toFixed(1)}
                                <span className="text-yellow-500 ml-1">★</span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem>View documents</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                
                                {driver.status === 'pending' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleDriverStatusChange(driver.id, 'active')}
                                    className="text-green-600"
                                  >
                                    Approve
                                  </DropdownMenuItem>
                                ) : driver.status === 'active' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleDriverStatusChange(driver.id, 'inactive')}
                                    className="text-amber-600"
                                  >
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleDriverStatusChange(driver.id, 'active')}
                                    className="text-green-600"
                                  >
                                    Reactivate
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 text-center text-sm text-gray-500 flex justify-between items-center">
                    <div>
                      Showing {Math.min(10, getFilteredDrivers().length)} of {getFilteredDrivers().length} drivers
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm" disabled={getFilteredDrivers().length <= 10}>Next</Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold">Orders</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search orders..." 
                      className="pl-10 w-full sm:w-64" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {ordersLoading ? (
                <div className="py-8 flex justify-center">
                  <Loading variant="spinner" size="md" text="Loading orders..." />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredOrders().slice(0, 10).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.driver}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'delivered' ? 'success' :
                              order.status === 'cancelled' ? 'destructive' :
                              order.status === 'pending' ? 'warning' :
                              'default'
                            }>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>€{order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Edit order</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                
                                {order.status === 'pending' && (
                                  <>
                                    <DropdownMenuLabel className="text-xs text-gray-500">Assign Driver</DropdownMenuLabel>
                                    {getFilteredDrivers()
                                      .filter(driver => driver.status === 'active')
                                      .slice(0, 5)
                                      .map(driver => (
                                        <DropdownMenuItem 
                                          key={driver.id}
                                          onClick={() => assignDriverToOrder(order.id, driver.id)}
                                        >
                                          {driver.name}
                                        </DropdownMenuItem>
                                      ))
                                    }
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleOrderStatusChange(order.id, 'cancelled')}
                                    className="text-red-600"
                                  >
                                    Cancel order
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 text-center text-sm text-gray-500 flex justify-between items-center">
                    <div>
                      Showing {Math.min(10, getFilteredOrders().length)} of {getFilteredOrders().length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm" disabled={getFilteredOrders().length <= 10}>Next</Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Statistics</h3>
                <div className="h-60 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Order trend chart will be displayed here</p>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <div className="h-60 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">User growth chart will be displayed here</p>
                </div>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Geographical Distribution</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 bg-blue-50 border-blue-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Most Active City</p>
                      <h3 className="text-xl font-bold mt-1">Berlin</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>
                  <p className="text-blue-600 text-xs mt-2">35% of all orders</p>
                </Card>
                
                <Card className="p-4 bg-green-50 border-green-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Fastest Growing</p>
                      <h3 className="text-xl font-bold mt-1">Munich</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-700" />
                    </div>
                  </div>
                  <p className="text-green-600 text-xs mt-2">↑ 28% month-over-month</p>
                </Card>
                
                <Card className="p-4 bg-amber-50 border-amber-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-amber-600 text-sm font-medium">Driver Coverage</p>
                      <h3 className="text-xl font-bold mt-1">Hamburg</h3>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                  <p className="text-amber-600 text-xs mt-2">Needs 5 more drivers</p>
                </Card>
              </div>
              
              <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Map visualization will be displayed here</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}