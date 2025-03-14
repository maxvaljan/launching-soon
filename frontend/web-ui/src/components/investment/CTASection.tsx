'use client';

import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 relative bg-[#0d0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Join Our Growth Journey</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white backdrop-blur-sm"
            onClick={() => window.location.href = "mailto:max@maxmove.com"}
          >
            Contact Founders
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;