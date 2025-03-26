'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRightLeft, PiggyBank, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getWalletData, 
  getPaymentMethods, 
  getRecentTransactions,
  type WalletData,
  type PaymentMethod,
  type Transaction
} from "@/lib/services/wallet";
import { ErrorBoundary } from "react-error-boundary";

// Simple fallback component in case of errors
const ErrorFallback = () => {
  return (
    <div className="p-6 text-center">
      <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-4">
        We're having trouble loading your wallet information.
      </p>
      <Button onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  );
};

// Separate loading component to reduce rerenders
const LoadingState = () => (
  <div className="p-6 space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Transaction item as a pure component
const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium">{transaction.type}</p>
      <p className="text-sm text-muted-foreground">
        {new Date(transaction.created_at).toLocaleDateString()}
      </p>
      {transaction.order_id && (
        <p className="text-sm text-muted-foreground">
          Order: {transaction.order_id}
        </p>
      )}
    </div>
    <div className={`font-bold ${
      ['deposit', 'refund'].includes(transaction.type)
        ? 'text-green-600'
        : 'text-red-600'
    }`}>
      {['deposit', 'refund'].includes(transaction.type) ? '+' : '-'}
      €{Number(transaction.amount).toFixed(2)}
    </div>
  </div>
);

const WalletSection = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Use a useCallback to avoid recreating function on every render
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Promise.allSettled to prevent one request failure from stopping others
      const results = await Promise.allSettled([
        getWalletData(),
        getPaymentMethods(),
        getRecentTransactions()
      ]);
      
      // Handle each promise result individually
      if (results[0].status === 'fulfilled') {
        setWalletData(results[0].value);
      }
      
      if (results[1].status === 'fulfilled') {
        setPaymentMethods(results[1].value || []);
      }
      
      if (results[2].status === 'fulfilled') {
        setRecentTransactions(results[2].value || []);
      }
      
      // Check if any requests failed
      const failedRequests = results.filter(r => r.status === 'rejected');
      if (failedRequests.length > 0) {
        console.warn(`${failedRequests.length} wallet requests failed`);
        // Only show error toast if all requests failed
        if (failedRequests.length === results.length) {
          throw new Error('Failed to load wallet data');
        }
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Only fetch data once on mount
  useEffect(() => {
    fetchData();
    
    // Set up refresh interval (every 2 minutes) 
    const intervalId = setInterval(fetchData, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleAddPaymentMethod = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  const handleAddMoney = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  // Memoize the formatted balance to prevent recalculation
  const formattedBalance = useMemo(() => {
    return walletData?.balance?.toFixed(2) || '0.00';
  }, [walletData?.balance]);

  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorFallback />;
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData?.currency || '€'} {formattedBalance}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total available balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentMethods.length}
            </div>
            <Button 
              variant="link" 
              className="text-xs px-0 h-auto"
              onClick={handleAddPaymentMethod}
            >
              Add new method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={handleAddMoney}
            >
              Add Money
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No transactions found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the component with error boundary 
const WalletSectionWithErrorBoundary = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <WalletSection />
  </ErrorBoundary>
);

export default WalletSectionWithErrorBoundary;