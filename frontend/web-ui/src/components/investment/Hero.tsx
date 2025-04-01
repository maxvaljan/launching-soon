'use client';

import { Button } from '@/components/ui/button';
import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

const Hero = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'invest-in-maxmove' });
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-[#0d0f1a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in text-white">
            Invest in the Future of Logistics
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto animate-slide-up">
            Join Maxmove in becoming Europe&apos;s largest last mile delivery platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#eeeeee] hover:bg-[#e0e0e0] text-[#0d0f1a] animate-slide-up backdrop-blur-sm"
              data-cal-namespace="invest-in-maxmove"
              data-cal-link="maxvaljan/invest-in-maxmove"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
            >
              Book a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
