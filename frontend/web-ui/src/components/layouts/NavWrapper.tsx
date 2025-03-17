'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface NavWrapperProps {
  children: React.ReactNode;
}

export default function NavWrapper({ children }: NavWrapperProps) {
  const pathname = usePathname();
  
  // Only render the navbar if we're not in the dashboard section, signin page, or account-type page
  const showNavbar = !pathname?.startsWith('/dashboard') && pathname !== '/signin' && pathname !== '/account-type';
  
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}