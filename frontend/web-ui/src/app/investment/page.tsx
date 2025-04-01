'use client';

import { useEffect } from 'react';
import Hero from '@/components/investment/Hero';
import BackedByScience from '@/components/investment/BackedByScience';
import { checkAdminStatus } from '@/lib/services/reports';

export default function InvestmentPage() {
  useEffect(() => {
    const checkAdmin = async () => {
      await checkAdminStatus();
    };

    checkAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      <Hero />
      <BackedByScience />
    </div>
  );
}
