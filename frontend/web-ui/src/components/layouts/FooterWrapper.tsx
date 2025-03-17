'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

interface FooterWrapperProps {
  children: React.ReactNode;
}

export default function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Exclude footer from sign in, account type, sign up, and password reset pages
  const showFooter = !(
    pathname === '/signin' ||
    pathname === '/account-type' ||
    pathname === '/signup' ||
    pathname?.startsWith('/signup/') ||
    pathname === '/reset-password' ||
    pathname?.startsWith('/reset-password/') ||
    pathname === '/reset-password-confirm' ||
    pathname?.startsWith('/reset-password-confirm/')
  );
  
  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
}
