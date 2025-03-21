'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  User, 
  FileText, 
  DollarSign, 
  Truck, 
  Package, 
  ExternalLink, 
  Download,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  FinancialTransaction, 
  TransactionType, 
  TransactionStatus,
  adminService 
} from '@/lib/services/admin';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const transactionId = params.id;
  const [transaction, setTransaction] = useState<FinancialTransaction | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTransactionById(transactionId);
      setTransaction(data);
      
      // If there's an associated order, fetch its details too
      if (data?.order_id) {
        const orderData = await adminService.getOrderFinancials(data.order_id);
        setOrderDetails(orderData);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction details');
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  if (loading) {
    return <PageLoading message="Loading transaction details..." />;
  }

  if (!transaction) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
          <p className="text-gray-600 mb-4">The transaction you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/admin/finance/transactions')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button variant="outline" onClick={() => router.push('/admin/finance/transactions')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{getTransactionTypeDisplay(transaction.type)} Transaction</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">ID: {transaction.id}</span>
            <span className="text-sm text-gray-500">•</span>
            <Badge className={getStatusBadgeClass(transaction.status)}>{transaction.status}</Badge>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Transaction details */}
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction Type</h3>
                <p className="font-medium">{getTransactionTypeDisplay(transaction.type)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <Badge className={getStatusBadgeClass(transaction.status)}>{transaction.status}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
                <p className="text-xl font-semibold">{formatCurrency(transaction.amount)}</p>
              </div>
              
              {transaction.fee_amount && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fee Amount</h3>
                  <p className="text-amber-600">{formatCurrency(transaction.fee_amount)}</p>
                </div>
              )}
              
              {transaction.net_amount && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Net Amount</h3>
                  <p>{formatCurrency(transaction.net_amount)}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Currency</h3>
                <p>{transaction.currency}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
                <p>{formatDateTime(transaction.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p>{formatDateTime(transaction.updated_at)}</p>
              </div>
              
              {transaction.payment_method && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                  <p className="capitalize">{transaction.payment_method}</p>
                </div>
              )}
              
              {transaction.external_id && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">External ID</h3>
                  <p className="flex items-center">
                    {transaction.external_id}
                    <ExternalLink className="h-3 w-3 ml-1 text-gray-400" />
                  </p>
                </div>
              )}
            </div>
            
            {transaction.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-700">{transaction.description}</p>
                </div>
              </>
            )}
          </Card>
          
          {/* Order details if available */}
          {orderDetails && (
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order Information</h2>
                <Link href={`/admin/orders/${orderDetails.order?.id}`}>
                  <Button variant="outline" size="sm">
                    View Order Details
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                  <p>{orderDetails.order?.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <Badge>{orderDetails.order?.status}</Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Total</h3>
                  <p>{formatCurrency(orderDetails.order?.price || 0)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                  <p>{orderDetails.order?.created_at ? formatDateTime(orderDetails.order.created_at) : '—'}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Paid</h3>
                  <p className="text-green-600 font-medium">{formatCurrency(orderDetails.totalPaid)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Refunded</h3>
                  <p className="text-red-600 font-medium">{formatCurrency(orderDetails.totalRefunded)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Net Amount</h3>
                  <p className="font-medium">{formatCurrency(orderDetails.netAmount)}</p>
                </div>
              </div>
            </Card>
          )}
          
          {/* Metadata if available */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Metadata</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            </Card>
          )}
        </div>
        
        {/* Right column - Customer and related info */}
        <div>
          {/* Customer Information */}
          {transaction.customer_id && (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{transaction.customer_name || 'Unknown'}</span>
                </div>
                <Link href={`/admin/users/${transaction.customer_id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Customer
                  </Button>
                </Link>
              </div>
            </Card>
          )}
          
          {/* Driver Information if available */}
          {transaction.driver_id && (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-3">Driver Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{transaction.driver_name || 'Unknown'}</span>
                </div>
                <Link href={`/admin/users/${transaction.driver_id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Driver
                  </Button>
                </Link>
              </div>
            </Card>
          )}
          
          {/* Related Transactions */}
          {orderDetails && orderDetails.transactions.length > 1 && (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-3">Related Transactions</h3>
              <div className="space-y-2">
                {orderDetails.transactions
                  .filter((tx: FinancialTransaction) => tx.id !== transaction.id)
                  .map((tx: FinancialTransaction) => (
                    <Link key={tx.id} href={`/admin/finance/transactions/${tx.id}`}>
                      <div className="p-3 border rounded-md hover:bg-gray-50">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {getTransactionTypeDisplay(tx.type)}
                          </span>
                          <Badge className={getStatusBadgeClass(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDateTime(tx.created_at).split(',')[0]}
                          </span>
                          <span className={`text-sm ${
                            tx.type === TransactionType.PAYMENT ? 'text-green-600' : 
                            tx.type === TransactionType.REFUND ? 'text-red-600' : ''
                          }`}>
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}