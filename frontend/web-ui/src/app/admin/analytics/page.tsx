'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalCustomers: number;
  totalDrivers: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
}

interface OrderCountsByDay {
  date: string;
  count: number;
}

interface OrderStatusDistribution {
  name: string;
  value: number;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0
  });
  const [ordersByDay, setOrdersByDay] = useState<OrderCountsByDay[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<OrderStatusDistribution[]>([]);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll just mimic data fetching
      // In a real app, you would make actual queries to your database
      
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
      
      // Fetch basic analytics data
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
      
      setAnalytics({
        totalOrders: ordersResponse.count || 0,
        totalRevenue,
        avgOrderValue,
        totalCustomers: customersResponse.count || 0,
        totalDrivers: driversResponse.count || 0,
        completedOrders: completedResponse.count || 0,
        cancelledOrders: cancelledResponse.count || 0,
        pendingOrders: pendingResponse.count || 0
      });
      
      // Generate sample data for charts
      generateSampleOrdersByDay(startDate, endDate);
      generateStatusDistribution();
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data for orders by day chart
  const generateSampleOrdersByDay = (startDate: Date, endDate: Date) => {
    const data: OrderCountsByDay[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      data.push({
        date: formattedDate,
        count: Math.floor(Math.random() * 10) + 1 // Random value between 1-10
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setOrdersByDay(data);
  };

  // Generate sample data for status distribution chart
  const generateStatusDistribution = () => {
    const { completedOrders, cancelledOrders, pendingOrders } = analytics;
    
    setStatusDistribution([
      { name: 'Completed', value: completedOrders },
      { name: 'Cancelled', value: cancelledOrders },
      { name: 'Pending', value: pendingOrders }
    ]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <PageLoading message="Loading analytics data..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md">
            <Button 
              variant={timeframe === 'week' ? "default" : "ghost"} 
              className={timeframe === 'week' ? "bg-blue-600" : ""}
              onClick={() => setTimeframe('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeframe === 'month' ? "default" : "ghost"} 
              className={timeframe === 'month' ? "bg-blue-600" : ""}
              onClick={() => setTimeframe('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeframe === 'year' ? "default" : "ghost"} 
              className={timeframe === 'year' ? "bg-blue-600" : ""}
              onClick={() => setTimeframe('year')}
            >
              Year
            </Button>
          </div>
          
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{analytics.totalOrders}</p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(analytics.totalRevenue)}</p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Avg. Order Value</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(analytics.avgOrderValue)}</p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">{analytics.totalCustomers}</p>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Day */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium mb-4">Orders by Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordersByDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                <Legend />
                <Bar dataKey="count" name="Orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Status Distribution */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Orders']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Completed Orders</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{analytics.completedOrders}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.totalOrders > 0 ? 
              `${((analytics.completedOrders / analytics.totalOrders) * 100).toFixed(1)}% of total` : 
              '0% of total'}
          </p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Cancelled Orders</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{analytics.cancelledOrders}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.totalOrders > 0 ? 
              `${((analytics.cancelledOrders / analytics.totalOrders) * 100).toFixed(1)}% of total` : 
              '0% of total'}
          </p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500">Active Drivers</h3>
          <p className="text-3xl font-bold mt-2">{analytics.totalDrivers}</p>
          <p className="text-sm text-gray-500 mt-2">Available for deliveries</p>
        </Card>
      </div>
    </div>
  );
}