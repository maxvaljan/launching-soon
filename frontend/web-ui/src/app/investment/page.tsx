'use client';

import { useEffect } from 'react';
import Hero from "@/components/investment/Hero";
import BackedByScience from "@/components/investment/BackedByScience";
import Info from "@/components/investment/Info";
import Future from "@/components/investment/Future";
import CTASection from "@/components/investment/CTASection";
import FundingSection from "@/components/investment/FundingSection";
import HyperlogisticsSection from "@/components/investment/HyperlogisticsSection";
import { checkAdminStatus } from "@/lib/services/reports";

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
      <Info />
      <Future />
      <FundingSection />
      <HyperlogisticsSection />
      <CTASection />
    </div>
  );
}