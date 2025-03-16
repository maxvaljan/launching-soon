'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Users, Truck, Package, Mail, Building2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalOrders: 0,
    waitingListSignups: 0,
    totalReferrals: 0
  });
  const [recentWaitingList, setRecentWaitingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get waiting list count
        const { count: waitingListCount } = await supabase
          .from('waiting_list_emails')
          .select('*', { count: 'exact', head: true });
        
        // Get recent waiting list entries
        const { data: recentSignups } = await supabase
          .from('waiting_list_emails')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Get total referrals
        const { data: referrals } = await supabase
          .from('waiting_list_emails')
          .select('referral_count');
        
        const totalReferrals = referrals?.reduce((sum, item) => sum + (item.referral_count || 0), 0) || 0;
        
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
          totalOrders: orderCount || 0,
          waitingListSignups: waitingListCount || 0,
          totalReferrals
        });
        
        setRecentWaitingList(recentSignups || []);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        
        <Card className="p-6 bg-purple-50 border-purple-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-600 text-sm font-medium">Waiting List Signups</p>
              <h3 className="text-2xl font-bold mt-1">{stats.waitingListSignups}</h3>
            </div>
            <Mail className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-indigo-50 border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Total Referrals</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalReferrals}</h3>
            </div>
            <Users className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-teal-50 border-teal-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-teal-600 text-sm font-medium">Conversion Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.waitingListSignups > 0 
                  ? `${Math.round((stats.totalReferrals / stats.waitingListSignups) * 100)}%` 
                  : '0%'}
              </h3>
            </div>
            <BarChart3 className="h-8 w-8 text-teal-500" />
          </div>
        </Card>
      </div>
      
      {/* Recent Waiting List Signups */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Waiting List Signups</h2>
        
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : recentWaitingList.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No recent signups</p>
        ) : (
          <div className="space-y-4">
            {recentWaitingList.map(entry => (
              <div key={entry.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{entry.email}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-700">
                      Source: <span className="font-medium">{entry.source}</span>
                    </span>
                    {entry.referral_count > 0 && (
                      <span className="text-sm text-purple-600">
                        {entry.referral_count} referrals
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}