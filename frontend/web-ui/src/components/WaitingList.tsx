'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { addToWaitingList, checkEmailExists } from '@/lib/services/waiting-list';

const WaitingList = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const checkWaitingListStatus = async () => {
      // Check if there's a stored email in localStorage for compatibility
      const storedEmail = localStorage.getItem('waitingListEmail');
      if (storedEmail) {
        // Verify if this email exists in our database
        try {
          const response = await checkEmailExists(storedEmail);
          if (response.exists && response.data) {
            setIsSubmitted(true);
            setSubmittedEmail(storedEmail);
            // Store the user's own referral code for display
            if (response.data.referral_code) {
              setUserReferralCode(response.data.referral_code);
            }
          }
        } catch (err) {
          console.error('Error checking email in waiting list:', err);
        }
      }
    };
    
    // Check for referral code in URL
    const checkReferralCode = () => {
      if (typeof window !== 'undefined') {
        // First check URL path for /referral/[code]
        const pathname = window.location.pathname;
        const referralMatch = pathname.match(/\/referral\/([a-f0-9-]+)/i);
        
        if (referralMatch && referralMatch[1]) {
          setReferralCode(referralMatch[1]);
          return;
        }
        
        // Then check query params for ?ref=code
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref) {
          setReferralCode(ref);
        }
      }
    };
    
    checkWaitingListStatus();
    checkReferralCode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get UTM source from URL if available
      let utmSource = null;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        utmSource = urlParams.get('utm_source');
      }
      
      // Send email to waiting list API with improved error handling
      console.log('Submitting email to waiting list:', email);
      
      // Add retry logic for reliability
      let retries = 2;
      let response;
      
      while (retries >= 0) {
        response = await addToWaitingList(
          email, 
          'waiting_list_section', 
          utmSource || undefined,
          referralCode || undefined
        );
        
        // If successful or has a specific error (not a network error), don't retry
        if (!response.error || (response.error && !response.error.includes('Network error'))) {
          break;
        }
        
        // Only log retries
        if (retries > 0) {
          console.log(`Retrying waiting list submission... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
        
        retries--;
      }
      
      console.log('Waiting list API response:', response);
      
      if (response?.error) {
        console.error('Error from waiting list API:', response.error);
        // Provide a more user-friendly error message based on the error
        if (response.error.includes('Connection error') || response.error.includes('Network error')) {
          setError('Unable to connect to our service. Please check your internet connection and try again.');
        } else if (response.error.includes('already registered') || response.error.includes('already exists')) {
          // If email already exists, treat as success
          localStorage.setItem('waitingListEmail', email);
          setIsSubmitted(true);
          setSubmittedEmail(email);
          
          // If response includes referral code, store it
          if (response.data?.referral_code) {
            setUserReferralCode(response.data.referral_code);
          }
          
          setEmail('');
          return;
        } else {
          setError(response.error);
        }
        return;
      }
      
      // Store in localStorage for compatibility
      localStorage.setItem('waitingListEmail', email);
      
      // Update state with user's data
      setIsSubmitted(true);
      setSubmittedEmail(email);
      
      // If response includes referral code, store it
      if (response?.data?.referral_code) {
        setUserReferralCode(response.data.referral_code);
      }
      
      setEmail('');
    } catch (err) {
      console.error('Error submitting to waiting list:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-theme-creme">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Bell className="h-12 w-12 mx-auto mb-4 text-theme-blue" />
          <h2 className="text-3xl font-bold mb-3 text-theme-dark">Be the first to know when we launch!</h2>
          <p className="text-lg mb-6 text-theme-blue">
            Sign up for updates and get early access to our delivery service.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2 text-theme-blue">Thank you for joining our waiting list!</h3>
            <p className="text-gray-600 mb-4">We'll notify you as soon as we launch. Keep an eye on your inbox!</p>
            
            {userReferralCode && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-theme-dark mb-2">Share with friends & get 10% off</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Share your referral link with friends. When they sign up, you'll both get 10% off your first order!
                </p>
                
                <div className="bg-gray-100 p-3 rounded text-sm break-all mb-3">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/referral/${userReferralCode}`}
                </div>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/referral/${userReferralCode}`
                      );
                      alert('Referral link copied to clipboard!');
                    }
                  }}
                  className="w-full bg-theme-blue hover:bg-theme-dark text-white py-2 rounded text-sm"
                >
                  Copy Referral Link
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-grow">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 border-2 border-theme-blue focus:border-theme-blue"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 px-6 bg-theme-blue hover:bg-theme-dark text-white font-medium"
            >
              {isSubmitting ? 'Signing up...' : 'Get Early Access'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WaitingList;