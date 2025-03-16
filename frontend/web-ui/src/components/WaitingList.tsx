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

  useEffect(() => {
    // Check if there's a stored email in localStorage for compatibility
    const storedEmail = localStorage.getItem('waitingListEmail');
    if (storedEmail) {
      // Verify if this email exists in our database
      const verifyEmail = async () => {
        try {
          const response = await checkEmailExists(storedEmail);
          if (response.exists) {
            setIsSubmitted(true);
          }
        } catch (err) {
          console.error('Error checking email in waiting list:', err);
        }
      };
      
      verifyEmail();
    }
    
    // Check for referral code in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
        setReferralCode(ref);
      }
    }
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
      
      // Send email to waiting list API
      const response = await addToWaitingList(
        email, 
        'waiting_list_section', 
        utmSource || undefined,
        referralCode || undefined
      );
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      // Also store in localStorage for compatibility
      localStorage.setItem('waitingListEmail', email);
      
      setIsSubmitted(true);
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
            <p className="text-gray-600">We'll notify you as soon as we launch. Keep an eye on your inbox!</p>
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