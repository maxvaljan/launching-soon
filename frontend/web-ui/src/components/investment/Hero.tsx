'use client';

import { Button } from "@/components/ui/button";

const Hero = () => {
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
            Join Maxmove in becoming Europe's largest last mile delivery platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white animate-slide-up backdrop-blur-sm"
              onClick={() => window.location.href = "mailto:max@maxmove.com"}
            >
              Contact Founders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;