'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { addToWaitingList, checkEmailExists } from '@/lib/services/waiting-list';

const EmailCollectionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First check localStorage for temporary compatibility
    const hasSignedUp = localStorage.getItem('waitingListEmail');
    const hasClosedPopup = localStorage.getItem('popupClosed');
    
    if (hasSignedUp || hasClosedPopup) {
      setIsLoading(false);
      return; // Don't show popup if user already interacted with it
    }

    // Set up scroll event listener for engagement-based trigger
    let scrollTriggered = false;
    let inactivityTimer: NodeJS.Timeout;
    let emailChecked = false;

    // Function to check if the user's email cookie exists in the database
    const checkEmailInWaitingList = async () => {
      // Get email from localStorage (temporary)
      const storedEmail = localStorage.getItem('waitingListEmail');

      if (storedEmail && !emailChecked) {
        emailChecked = true;
        try {
          const response = await checkEmailExists(storedEmail);
          if (response.exists) {
            setIsLoading(false);
            return true;
          }
        } catch (err) {
          console.error('Error checking email in waiting list:', err);
        }
      }
      setIsLoading(false);
      return false;
    };

    // Check email in waiting list first
    checkEmailInWaitingList().then((exists) => {
      if (exists) {
        return; // Email exists, don't show popup
      }

      const handleScroll = () => {
        if (scrollTriggered) return;
        
        // Calculate how far down the user has scrolled (50% of page height)
        const scrollPosition = window.scrollY;
        const pageHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollPercentage = (scrollPosition / (pageHeight - viewportHeight)) * 100;
        
        if (scrollPercentage > 30) { // Trigger when scrolled past 30% of page
          scrollTriggered = true;
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
          clearTimeout(inactivityTimer);
        }
      };
      
      // Handle inactivity detection
      const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          if (!scrollTriggered) {
            setIsVisible(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }, 10000); // 10 seconds of inactivity
      };

      // Set up event listeners
      window.addEventListener('scroll', handleScroll);
      
      // Track user activity
      ['mousemove', 'keydown', 'touchstart', 'click'].forEach(eventType => {
        window.addEventListener(eventType, resetInactivityTimer);
      });
      
      // Initial setup of the inactivity timer
      resetInactivityTimer();
    });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      ['mousemove', 'keydown', 'touchstart', 'click'].forEach(eventType => {
        window.removeEventListener(eventType, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer);
    };
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem('popupClosed', 'true');
  };

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
      // Send email to the waiting list API
      const response = await addToWaitingList(email, 'popup');
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      // Also store email in localStorage for temporary compatibility
      localStorage.setItem('waitingListEmail', email);
      
      closePopup();
    } catch (err) {
      console.error('Error submitting to waiting list:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2 text-theme-dark">Get Early Access</h3>
          <p className="text-theme-blue">
            Be the first to know when we launch! Sign up for updates.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-theme-blue focus:border-theme-blue"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-theme-blue hover:bg-theme-dark text-white font-medium h-11"
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmailCollectionPopup;