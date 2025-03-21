'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  FinancialTransaction, 
  TransactionType, 
  TransactionStatus,
  adminService 
} from '@/lib/services/admin';

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchTransactions();
  }, [timeframe]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTransactions(timeframe);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTotalAmount = (txType?: TransactionType) => {
    if (!txType) {
      // Sum all transaction amounts
      return transactions.reduce((sum, tx) => sum + tx.amount, 0);
    }
    
    // Sum amounts for a specific transaction type
    return transactions
      .filter(tx => tx.type === txType && tx.status === TransactionStatus.COMPLETED)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  if (loading) {
    return <PageLoading message="Loading transactions..." />;
  }

  return (
    <div className="p-8">
      <Button variant="outline" onClick={() => router.push('/admin/finance')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Financial Overview
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Transactions</h1>
        
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
          
          <Button variant="outline" onClick={fetchTransactions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
          <p className="text-2xl font-bold">{formatCurrency(getTotalAmount())}</p>
        </Card>
        
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-500">Payments</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalAmount(TransactionType.PAYMENT))}</p>
        </Card>
        
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalAmount(TransactionType.REFUND))}</p>
        </Card>
        
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-500">Fees</h3>
          <p className="text-2xl font-bold text-gray-600">{formatCurrency(getTotalAmount(TransactionType.FEE))}</p>
        </Card>
        
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-500">Total Count</h3>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value={TransactionStatus.COMPLETED}>Completed</option>
              <option value={TransactionStatus.PENDING}>Pending</option>
              <option value={TransactionStatus.FAILED}>Failed</option>
              <option value={TransactionStatus.REFUNDED}>Refunded</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value={TransactionType.PAYMENT}>Payments</option>
              <option value={TransactionType.REFUND}>Refunds</option>
              <option value={TransactionType.PAYOUT}>Payouts</option>
              <option value={TransactionType.FEE}>Fees</option>
              <option value={TransactionType.ADJUSTMENT}>Adjustments</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableCaption>A list of all financial transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'No transactions match your search or filter criteria.'
                    : 'No transactions found for the selected period.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id.slice(0, 8)}...</TableCell>
                  <TableCell>{getTransactionTypeDisplay(transaction.type)}</TableCell>
                  <TableCell className={
                    transaction.type === TransactionType.PAYMENT ? 'text-green-600 font-medium' : 
                    transaction.type === TransactionType.REFUND ? 'text-red-600 font-medium' : 
                    transaction.type === TransactionType.FEE ? 'text-amber-600 font-medium' : ''
                  }>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.customer_name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(transaction.created_at)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.order_id ? (
                      <Link href={`/admin/orders/${transaction.order_id}`} className="text-blue-600 hover:underline">
                        {transaction.order_id.slice(0, 8)}...
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/finance/transactions/${transaction.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {transaction.order_id && (
                          <DropdownMenuItem onClick={() => router.push(`/admin/orders/${transaction.order_id}`)}>
                            View Order
                          </DropdownMenuItem>
                        )}
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