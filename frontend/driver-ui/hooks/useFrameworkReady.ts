import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    try {
      // Check if we're in a web environment
      if (typeof window !== 'undefined' && window.frameworkReady) {
        window.frameworkReady();
      } else {
        console.log('Framework ready function not available in this environment');
      }
    } catch (error) {
      console.error('Error in framework ready call:', error);
    }
  }, []);
}