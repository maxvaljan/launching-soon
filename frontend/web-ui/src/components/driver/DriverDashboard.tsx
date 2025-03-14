'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Package, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  X, 
  User,
  MapPin,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Car,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

type Order = {
  id: string;
  customer_id: string;
  pickup_address: string;
  delivery_address: string;
  package_size: string;
  package_weight: string;
  delivery_instructions: string;
  status: 'pending' | 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  estimated_delivery: string;
  price: number;
  distance: number;
  customer_name?: string;
  customer_phone?: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  vehicle_type: string;
  average_rating: number;
  total_deliveries: number;
  earnings_total: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
};

export default function DriverDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active-orders');
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace('/signin');
          return;
        }
        
        // Get driver profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData);
        setIsOnline(profileData.status === 'active');
        
        // Get orders assigned to this driver
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, profiles!customer_id(*)')
          .eq('driver_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) {
          throw ordersError;
        }
        
        // Format orders and add customer info
        const formattedOrders = ordersData.map((order: any) => ({
          ...order,
          customer_name: order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : 'Unknown',
          customer_phone: order.profiles ? order.profiles.phone_number : ''
        }));
        
        // Separate orders by status
        setActiveOrders(formattedOrders.filter((order: Order) => 
          ['assigned', 'pickup', 'in_transit'].includes(order.status)));
        
        setCompletedOrders(formattedOrders.filter((order: Order) => 
          order.status === 'delivered'));
          
        setPendingOrders(formattedOrders.filter((order: Order) => 
          order.status === 'pending'));
      } catch (error) {
        console.error('Error fetching driver data:', error);
        toast.error('Failed to load driver data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription for order updates
    const ordersSubscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: 'driver_id=eq.' + supabase.auth.getSession().then(({ data }) => data.session?.user.id)
        }, 
        () => {
          // Refresh orders when changes occur
          fetchData();
        })
      .subscribe();
      
    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [router]);

  // Toggle driver online status
  const toggleOnlineStatus = async () => {
    try {
      const newStatus = isOnline ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', profile?.id);
        
      if (error) {
        throw error;
      }
      
      setIsOnline(!isOnline);
      toast.success(`You are now ${isOnline ? 'offline' : 'online'}`);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) {
        throw error;
      }
      
      // Optimistically update the UI
      const updateOrderList = (list: Order[]) => 
        list.map(order => order.id === orderId ? { ...order, status: newStatus } : order);
      
      setActiveOrders(updateOrderList(activeOrders));
      setPendingOrders(updateOrderList(pendingOrders));
      
      // If order is delivered, move it to completed orders
      if (newStatus === 'delivered') {
        const deliveredOrder = activeOrders.find(order => order.id === orderId);
        if (deliveredOrder) {
          setCompletedOrders([{ ...deliveredOrder, status: 'delivered' }, ...completedOrders]);
          setActiveOrders(activeOrders.filter(order => order.id !== orderId));
        }
      }
      
      toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-maxmove-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Car className="h-10 w-10 text-maxmove-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.first_name}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant={isOnline ? "default" : "outline"} 
              className={isOnline ? "bg-green-600 hover:bg-green-700" : "text-red-600 border-red-300 hover:bg-red-50"}
              onClick={toggleOnlineStatus}
            >
              {isOnline ? "Online" : "Offline"}
            </Button>
            
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Deliveries</p>
                <p className="text-2xl font-bold">{completedOrders.length || profile?.total_deliveries || 0}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Earnings</p>
                <p className="text-2xl font-bold">€{profile?.earnings_total?.toFixed(2) || '0.00'}</p>
              </div>
              <Wallet className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>
        
        {/* Tabs for different order categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="active-orders" className="flex-1">
              Active Orders
              {activeOrders.length > 0 && (
                <span className="ml-2 bg-maxmove-100 text-maxmove-800 px-2 py-0.5 rounded-full text-xs">
                  {activeOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed-orders" className="flex-1">
              Completed Orders
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1">
              Stats & Earnings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active-orders">
            {activeOrders.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <Package className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Active Orders</h3>
                  <p className="text-gray-500 mt-2 mb-4">You don't have any active orders right now.</p>
                  {!isOnline && (
                    <Button onClick={toggleOnlineStatus}>Go Online</Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-gray-900">Order #{order.id.substring(0, 8)}</span>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pickup' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="flex items-start mb-2">
                              <MapPin className="h-4 w-4 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Pickup</p>
                                <p className="text-gray-700">{order.pickup_address}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Delivery</p>
                                <p className="text-gray-700">{order.delivery_address}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-start mb-2">
                              <User className="h-4 w-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Customer</p>
                                <p className="text-gray-700">{order.customer_name}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Package className="h-4 w-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Package</p>
                                <p className="text-gray-700">{order.package_size}, {order.package_weight}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Estimated delivery by</p>
                          <p className="text-gray-700">{format(new Date(order.estimated_delivery), 'PPp')}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          {order.status === 'assigned' && (
                            <Button onClick={() => updateOrderStatus(order.id, 'pickup')}>
                              Picked Up
                            </Button>
                          )}
                          
                          {order.status === 'pickup' && (
                            <Button onClick={() => updateOrderStatus(order.id, 'in_transit')}>
                              In Transit
                            </Button>
                          )}
                          
                          {order.status === 'in_transit' && (
                            <Button onClick={() => updateOrderStatus(order.id, 'delivered')}>
                              Mark Delivered
                            </Button>
                          )}
                          
                          <Button variant="outline" size="icon">
                            <Navigation className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="outline" size="icon">
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {order.delivery_instructions && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-100 p-3 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-yellow-700">Delivery Instructions</p>
                            <p className="text-sm text-yellow-700">{order.delivery_instructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed-orders">
            {completedOrders.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Completed Orders</h3>
                  <p className="text-gray-500 mt-2">You haven't completed any orders yet.</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedOrders.slice(0, 5).map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-gray-900">Order #{order.id.substring(0, 8)}</span>
                          <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Delivered on {format(new Date(order.estimated_delivery), 'PPp')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">€{order.price.toFixed(2)}</p>
                        <Button variant="link" size="sm" className="px-0 h-7">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Earnings Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Today</span>
                    <span className="font-medium">€{(profile?.earnings_total || 0) * 0.1}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-medium">€{(profile?.earnings_total || 0) * 0.4}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium">€{profile?.earnings_total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">All Time</span>
                    <span className="font-semibold">€{profile?.earnings_total || 0}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium flex items-center">
                      {profile?.average_rating || '0.0'}
                      <span className="text-yellow-500 ml-1">★</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Completed Orders</span>
                    <span className="font-medium">{profile?.total_deliveries || completedOrders.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Acceptance Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">On-Time Delivery</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}