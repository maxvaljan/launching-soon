'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { 
  BarChart, 
  LineChart, 
  Bar, 
  Line,
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
import { 
  Download, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  CreditCard,
  Clock,
  Users,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  FinancialSummary, 
  TransactionType, 
  TransactionStatus, 
  FinancialTransaction,
  adminService 
} from '@/lib/services/admin';

export default function AdminFinancePage() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    fetchFinancialData();
  }, [timeframe]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const [summary, transactions] = await Promise.all([
        adminService.getFinancialSummary(timeframe),
        adminService.getTransactions(timeframe)
      ]);
      
      setFinancialSummary(summary);
      setRecentTransactions(transactions.slice(0, 10)); // Get 10 most recent transactions
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getPercentageChange = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return 100;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TransactionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TransactionStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeDisplay = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYMENT:
        return 'Payment';
      case TransactionType.REFUND:
        return 'Refund';
      case TransactionType.PAYOUT:
        return 'Payout';
      case TransactionType.FEE:
        return 'Fee';
      case TransactionType.ADJUSTMENT:
        return 'Adjustment';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return <PageLoading message="Loading financial data..." />;
  }

  if (!financialSummary) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading financial data</div>
          <Button onClick={fetchFinancialData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        
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
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(financialSummary.totalRevenue)}</p>
          {/* Show increase from previous period - this would be calculated in a real app */}
          <div className="flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">8.2%</span>
            <span className="text-gray-500 ml-1">vs previous {timeframe}</span>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-500">Net Revenue</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(financialSummary.netRevenue)}</p>
          <div className="flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">6.8%</span>
            <span className="text-gray-500 ml-1">vs previous {timeframe}</span>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-500">Avg. Order Value</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(financialSummary.averageOrderValue)}</p>
          <div className="flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">3.1%</span>
            <span className="text-gray-500 ml-1">vs previous {timeframe}</span>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-500">Pending Amount</h3>
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(financialSummary.pendingAmount)}</p>
          <div className="flex items-center text-sm">
            <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">2.4%</span>
            <span className="text-gray-500 ml-1">vs previous {timeframe}</span>
          </div>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Revenue Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={financialSummary.revenueByPeriod}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#0088FE"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="net_revenue"
                  name="Net Revenue"
                  stroke="#00C49F"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium mb-4">Payment Method Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialSummary.paymentMethodBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {financialSummary.paymentMethodBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Orders Chart and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium mb-4">Orders by Period</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialSummary.revenueByPeriod}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => value} />
                <Legend />
                <Bar dataKey="orders" name="Orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top Customers</h3>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          {financialSummary.topCustomers.length > 0 ? (
            <div className="space-y-4">
              {financialSummary.topCustomers.map((customer, index) => (
                <div key={customer.customer_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-800 h-8 w-8 rounded-full flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.customer_name}</p>
                      <p className="text-xs text-gray-500">{customer.order_count} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(customer.total_spent)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No customer data available</p>
          )}
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card className="p-6 bg-white mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
          <Link href="/admin/finance/transactions">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/admin/finance/transactions/${transaction.id}`} className="hover:text-blue-600">
                        {transaction.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTransactionTypeDisplay(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={transaction.type === TransactionType.PAYMENT ? 'text-green-600' : 
                             transaction.type === TransactionType.REFUND ? 'text-red-600' : ''}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.customer_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No recent transactions</p>
        )}
      </Card>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Total Fees</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(financialSummary.totalFees)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {(financialSummary.totalFees / financialSummary.totalRevenue * 100).toFixed(1)}% of total revenue
          </p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Total Refunds</h3>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(financialSummary.totalRefunds)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {(financialSummary.totalRefunds / financialSummary.totalRevenue * 100).toFixed(1)}% of total revenue
          </p>
        </Card>
        
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Profit Margin</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(financialSummary.netRevenue / financialSummary.totalRevenue * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Net revenue as percentage of total
          </p>
        </Card>
      </div>
    </div>
  );
}