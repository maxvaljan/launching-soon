'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { OrderStatus, PaymentMethod } from '../../../../../shared/types/order';
import { MoreHorizontal, Search, Filter, FileText, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  customer_id: string;
  driver_id?: string;
  pickup_address: string;
  dropoff_address: string;
  price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
  customer_email?: string;
  customer_name?: string;
  driver_name?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // This query joins the orders table with profiles to get customer names
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

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (action: string, orderId: string) => {
    try {
      switch (action) {
        case 'view':
          toast.info(`Viewing details for order ${orderId}`);
          // Future implementation: open modal with order details
          break;
        case 'complete':
          // Update order status to completed
          const { error } = await supabase
            .from('orders')
            .update({ status: OrderStatus.COMPLETED })
            .match({ id: orderId });
            
          if (error) throw error;
          
          toast.success('Order marked as completed');
          fetchOrders(); // Refresh the data
          break;
        case 'cancel':
          if (confirm('Are you sure you want to cancel this order?')) {
            const { error } = await supabase
              .from('orders')
              .update({ status: OrderStatus.CANCELLED })
              .match({ id: orderId });
              
            if (error) throw error;
            
            toast.success('Order cancelled successfully');
            fetchOrders(); // Refresh the data
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            // In a real application, you might want to archive instead of delete
            toast.info(`Deleted order ${orderId}`);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      toast.error('Operation failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.ACCEPTED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_TRANSIT:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <PageLoading message="Loading orders..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="border border-gray-300 rounded-md p-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableCaption>A list of all orders in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No orders match your search or filter criteria.'
                    : 'No orders found in the system.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{order.customer_email || 'No email'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <div className="mb-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="truncate max-w-[180px]">{order.pickup_address}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-red-500" />
                        <span className="truncate max-w-[180px]">{order.dropoff_address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(order.price)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOrderAction('view', order.id)}>
                          View Details
                        </DropdownMenuItem>
                        {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                          <DropdownMenuItem onClick={() => handleOrderAction('complete', order.id)}>
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {order.status !== OrderStatus.CANCELLED && (
                          <DropdownMenuItem onClick={() => handleOrderAction('cancel', order.id)}>
                            Cancel Order
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleOrderAction('delete', order.id)}
                          className="text-red-600"
                        >
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}