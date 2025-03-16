'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getReferrals } from '@/lib/services/waiting-list';
import { WaitingList } from '@/components';

interface ReferralPageProps {
  params: {
    code: string;
  };
}

export default function ReferralPage({ params }: ReferralPageProps) {
  const { code } = params;
  const [referrerEmail, setReferrerEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrer = async () => {
      try {
        const response = await getReferrals(code);
        if (response?.user?.email) {
          setReferrerEmail(response.user.email);
        } else {
          setError('Invalid referral code');
        }
      } catch (err) {
        console.error('Error fetching referrer:', err);
        setError('Failed to load referral information');
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchReferrer();
    } else {
      setError('No referral code provided');
      setIsLoading(false);
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-theme-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-blue text-lg">Loading referral information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-theme-dark mb-4">Referral Not Found</h1>
          <p className="text-theme-blue mb-6">{error}</p>
          <Button asChild className="bg-theme-blue hover:bg-theme-dark text-white">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-theme-dark text-theme-creme py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">You've Been Invited!</h1>
          <p className="text-xl mb-8">
            {referrerEmail ? (
              <>
                <span className="opacity-80">Join </span>
                <span className="font-semibold">{referrerEmail.split('@')[0]}</span>
                <span className="opacity-80"> on MaxMove's waiting list and you'll both get 10% off your first order!</span>
              </>
            ) : (
              <>Join MaxMove's waiting list and get 10% off your first order!</>
            )}
          </p>
          <Button
            asChild
            className="bg-theme-creme text-theme-dark hover:bg-white text-lg px-8 py-6 rounded-full"
          >
            <a href="#sign-up">Sign Up Now</a>
          </Button>
        </div>
      </div>

      <div id="sign-up">
        <WaitingList />
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-theme-dark">
            Why Join MaxMove?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-theme-creme p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-theme-dark">Fast Delivery</h3>
              <p className="text-theme-blue">Get anything delivered quickly across Germany. From documents to furniture.</p>
            </div>
            <div className="bg-theme-creme p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-theme-dark">Reliable Service</h3>
              <p className="text-theme-blue">Track your delivery in real-time and get updates every step of the way.</p>
            </div>
            <div className="bg-theme-creme p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-theme-dark">Great Prices</h3>
              <p className="text-theme-blue">Competitive pricing with no hidden fees. Pay only for what you need.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}