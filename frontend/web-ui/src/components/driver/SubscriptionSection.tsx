'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDriverSubscription, createDriverSubscription, cancelDriverSubscription } from '@/lib/services/payment';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionFormProps {
  onSuccess: (data: any) => void;
}

function SubscriptionForm({ onSuccess }: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        elements
      });
      
      if (stripeError) {
        setError(stripeError.message || 'An error occurred with your payment');
        return;
      }
      
      // Create subscription
      const response = await createDriverSubscription(paymentMethod.id);
      
      onSuccess(response.data);
      toast({
        title: "Subscription created",
        description: "You are now a premium driver with a reduced platform fee of 5%",
      });
    } catch (error: any) {
      setError(error.message || 'Subscription failed. Please try again.');
      toast({
        title: "Subscription failed",
        description: error.message || "There was a problem creating your subscription",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 space-y-2">
        <label className="text-sm font-medium">
          Card Details
        </label>
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>
      
      {error && (
        <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">
          {error}
        </div>
      )}
      
      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Subscribe Now (€99/month)'
        )}
      </Button>
    </form>
  );
}

export default function SubscriptionSection() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await getDriverSubscription();
        setSubscription(response.data);
      } catch (error) {
        console.error('Failed to fetch subscription', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleSubscriptionSuccess = (data: any) => {
    setSubscription(data);
    setShowSubscribeForm(false);
    router.refresh();
  };
  
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your premium subscription?')) return;
    
    try {
      await cancelDriverSubscription();
      setSubscription({ ...subscription, status: 'canceled' });
      
      toast({
        title: "Subscription canceled",
        description: "Your premium subscription will remain active until the end of the current billing period",
      });
      
      router.refresh();
    } catch (error: any) {
      console.error('Failed to cancel subscription', error);
      toast({
        title: "Error canceling subscription",
        description: error.message || "There was a problem canceling your subscription",
        variant: "destructive"
      });
    }
  };
  
  const getFormattedDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Plan</CardTitle>
        <CardDescription>
          Premium drivers enjoy a reduced platform fee of 5% (vs. 15% standard)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription?.status === 'active' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Premium Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Your subscription renews on {getFormattedDate(subscription.current_period_end)}
                </p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                Active
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md">
              <h4 className="font-medium text-primary">Benefits</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Reduced platform fee (5% instead of 15%)</li>
                <li>• Priority order matching</li>
                <li>• Premium driver badge for customers</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
          </div>
        ) : subscription?.status === 'canceled' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Standard Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Your premium subscription will end on {getFormattedDate(subscription.current_period_end)}
                </p>
              </div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                Ending Soon
              </div>
            </div>
            
            {showSubscribeForm ? (
              <div className="mt-6">
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    appearance: { theme: 'stripe' },
                  }}
                >
                  <SubscriptionForm onSuccess={handleSubscriptionSuccess} />
                </Elements>
              </div>
            ) : (
              <Button onClick={() => setShowSubscribeForm(true)} className="w-full mt-4">
                Resubscribe
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Standard Plan</h3>
                <p className="text-sm text-muted-foreground">15% platform fee on all deliveries</p>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md mb-4">
              <h4 className="font-medium">Upgrade to Premium for €99/month</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Reduced platform fee (5% instead of 15%)</li>
                <li>• Priority order matching</li>
                <li>• Premium driver badge for customers</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
            
            {showSubscribeForm ? (
              <div className="mt-6">
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    appearance: { theme: 'stripe' },
                  }}
                >
                  <SubscriptionForm onSuccess={handleSubscriptionSuccess} />
                </Elements>
              </div>
            ) : (
              <Button onClick={() => setShowSubscribeForm(true)} className="w-full">
                Upgrade to Premium
              </Button>
            )}
          </div>
        )}
      </CardContent>
      {subscription?.status === 'active' && (
        <CardFooter>
          <Button variant="outline" onClick={handleCancelSubscription} className="w-full">
            Cancel Premium Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}