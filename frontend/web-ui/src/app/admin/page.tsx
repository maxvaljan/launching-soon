'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Users, Truck, Package } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user count (excluding drivers)
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .neq('role', 'driver');
        
        // Get driver count
        const { count: driverCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'driver');
        
        // Get order count
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          totalUsers: userCount || 0,
          totalDrivers: driverCount || 0,
          totalOrders: orderCount || 0
        });
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50 border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Drivers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalDrivers}</h3>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-amber-50 border-amber-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-600 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
            </div>
            <Package className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}