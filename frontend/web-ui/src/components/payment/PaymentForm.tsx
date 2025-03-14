'use client';

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  createPaymentIntent, 
  getPaymentMethods, 
  recordCashPayment 
} from '@/lib/services/payment';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Tip options in cents
const tipOptions = [0, 100, 200, 500];

interface SavedPaymentMethod {
  id: string;
  stripe_payment_method_id: string;
  type: string;
  last_four: string;
  is_default: boolean;
}

interface PaymentFormProps {
  orderId: string;
  amount: number; // in cents
  onPaymentComplete: (result: { 
    success: boolean; 
    paymentMethod: 'card' | 'cash';
    paymentIntentId?: string;
    error?: string;
  }) => void;
}

function CheckoutForm({ 
  orderId, 
  amount, 
  clientSecret, 
  tipAmount, 
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onPaymentComplete,
  isProcessing,
  setIsProcessing
}: {
  orderId: string;
  amount: number;
  clientSecret: string;
  tipAmount: number; 
  paymentMethods: SavedPaymentMethod[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (id: string) => void;
  onPaymentComplete: PaymentFormProps['onPaymentComplete'];
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation?order_id=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'An error occurred during payment');
      setIsProcessing(false);
      onPaymentComplete({ 
        success: false, 
        paymentMethod: 'card',
        error: submitError.message 
      });
    } else if (paymentIntent) {
      onPaymentComplete({ 
        success: true, 
        paymentMethod: 'card',
        paymentIntentId: paymentIntent.id 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentMethods.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Saved Payment Methods</h3>
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            className="space-y-2"
          >
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={method.stripe_payment_method_id} id={method.id} />
                <Label htmlFor={method.id} className="flex-1">
                  •••• {method.last_four}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="new" id="new-card" />
              <Label htmlFor="new-card" className="flex-1">
                Use a new card
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {(!paymentMethods.length || selectedPaymentMethod === 'new') && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Enter Card Details</h3>
          <PaymentElement />
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Pay €${((amount + 100 + tipAmount) / 100).toFixed(2)}`}
      </Button>
    </form>
  );
}

function CashPaymentForm({ 
  orderId, 
  amount, 
  tipAmount, 
  onPaymentComplete,
  isProcessing,
  setIsProcessing
}: {
  orderId: string;
  amount: number;
  tipAmount: number;
  onPaymentComplete: PaymentFormProps['onPaymentComplete'];
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}) {
  const [error, setError] = useState<string>('');

  const handleCashPayment = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      await recordCashPayment(orderId, tipAmount);
      
      onPaymentComplete({ 
        success: true, 
        paymentMethod: 'cash' 
      });
    } catch (err: any) {
      console.error('Cash payment error:', err);
      setError(err.message || 'An error occurred with the cash payment');
      onPaymentComplete({ 
        success: false, 
        paymentMethod: 'cash',
        error: err.message 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">
        By confirming a cash payment, you agree to pay the driver the total amount in cash upon delivery.
      </p>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <Button 
        onClick={handleCashPayment} 
        disabled={isProcessing} 
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Confirm Cash Payment (€${((amount + 100 + tipAmount) / 100).toFixed(2)})`}
      </Button>
    </div>
  );
}

export function PaymentForm({ orderId, amount, onPaymentComplete }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('new');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch saved payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const response = await getPaymentMethods();
        if (response.data && response.data.length > 0) {
          setPaymentMethods(response.data);
          setSelectedPaymentMethod(response.data[0].stripe_payment_method_id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Create payment intent for card payments
  useEffect(() => {
    if (paymentMethod === 'card') {
      const getClientSecret = async () => {
        try {
          // Only create clientSecret if we don't have one yet
          if (!clientSecret) {
            setIsLoading(true);
            const response = await createPaymentIntent(orderId, selectedPaymentMethod, tipAmount);
            setClientSecret(response.data.client_secret);
          }
        } catch (error) {
          console.error('Error creating payment intent:', error);
        } finally {
          setIsLoading(false);
        }
      };

      getClientSecret();
    }
  }, [paymentMethod, orderId, selectedPaymentMethod, tipAmount, clientSecret]);

  // Calculate total
  const getTotal = () => {
    return amount + 100 + tipAmount; // Order amount + €1 platform fee + tip
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          
          <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as 'card' | 'cash')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="card">Card Payment</TabsTrigger>
              <TabsTrigger value="cash">Cash Payment</TabsTrigger>
            </TabsList>
            
            {/* Tip selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Add a tip for your driver</h3>
              <div className="grid grid-cols-4 gap-2">
                {tipOptions.map((tip) => (
                  <Button
                    key={tip}
                    type="button"
                    variant={tipAmount === tip ? "default" : "outline"}
                    onClick={() => setTipAmount(tip)}
                    className="h-12"
                  >
                    {tip === 0 ? 'No Tip' : `€${(tip / 100).toFixed(2)}`}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Order summary */}
            <div className="mb-6 space-y-2">
              <h3 className="text-sm font-medium">Order Summary</h3>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Delivery Fee:</span>
                <span className="text-sm font-medium">€{(amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Platform Fee:</span>
                <span className="text-sm font-medium">€1.00</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Driver Tip:</span>
                  <span className="text-sm font-medium">€{(tipAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">€{(getTotal() / 100).toFixed(2)}</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="card">
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                      <CheckoutForm 
                        orderId={orderId}
                        amount={amount}
                        clientSecret={clientSecret}
                        tipAmount={tipAmount}
                        paymentMethods={paymentMethods}
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                        onPaymentComplete={onPaymentComplete}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </Elements>
                  )}
                </TabsContent>
                
                <TabsContent value="cash">
                  <CashPaymentForm 
                    orderId={orderId}
                    amount={amount}
                    tipAmount={tipAmount}
                    onPaymentComplete={onPaymentComplete}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentForm;