'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export function ResponsiveCheck() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Don't show initially for non-developers
    const storedVisibility = localStorage.getItem('responsiveCheckVisible');
    setIsVisible(storedVisibility === 'true');

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Determine current breakpoint (matches Tailwind's default breakpoints)
      let breakpoint = 'xs';
      if (width >= 1536) breakpoint = '2xl';
      else if (width >= 1280) breakpoint = 'xl';
      else if (width >= 1024) breakpoint = 'lg';
      else if (width >= 768) breakpoint = 'md';
      else if (width >= 640) breakpoint = 'sm';
      
      setCurrentBreakpoint(breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('responsiveCheckVisible', newVisibility.toString());
  };

  // Press Ctrl+Alt+R to toggle visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'r') {
        toggleVisibility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // If not visible or not in development, don't render anything
  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const breakpointColors = {
    'xs': 'bg-red-500',
    'sm': 'bg-orange-500',
    'md': 'bg-yellow-500',
    'lg': 'bg-green-500',
    'xl': 'bg-blue-500',
    '2xl': 'bg-purple-500',
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-3 flex flex-col items-start text-xs">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="font-bold text-sm">Responsive Checker</span>
          <button onClick={toggleVisibility} className="text-gray-500 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block w-3 h-3 rounded-full ${breakpointColors[currentBreakpoint as keyof typeof breakpointColors]}`}></span>
          <span className="font-medium">{currentBreakpoint}</span>
          <span className="text-gray-500">{`(${windowSize.width}×${windowSize.height}px)`}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1 w-full mt-1">
          {Object.entries(breakpointColors).map(([bp, color]) => (
            <div key={bp} className="flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
              <span className={`text-[10px] ${bp === currentBreakpoint ? 'font-bold' : ''}`}>
                {bp}: {bp === 'xs' ? '<640px' : 
                        bp === 'sm' ? '≥640px' : 
                        bp === 'md' ? '≥768px' : 
                        bp === 'lg' ? '≥1024px' : 
                        bp === 'xl' ? '≥1280px' : '≥1536px'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for responsive testing
export function ResponsiveDebug({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 p-2 bg-black/80 text-white text-xs rounded ${className}`}>
      <div className="block sm:hidden">xs: &lt;640px</div>
      <div className="hidden sm:block md:hidden">sm: ≥640px</div>
      <div className="hidden md:block lg:hidden">md: ≥768px</div>
      <div className="hidden lg:block xl:hidden">lg: ≥1024px</div>
      <div className="hidden xl:block 2xl:hidden">xl: ≥1280px</div>
      <div className="hidden 2xl:block">2xl: ≥1536px</div>
    </div>
  );
}