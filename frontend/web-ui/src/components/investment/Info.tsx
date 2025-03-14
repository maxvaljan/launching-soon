'use client';

import { TrendingUp, Globe2, Shield } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Info = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c2e]/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#1a1c2e]/40 backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/60 transition-all duration-300">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Market Growth</CardTitle>
              <CardDescription className="text-gray-400">Capitalizing on the explosive 35% year-over-year growth in the last-mile logistics market, driven by increasing e-commerce adoption and changing consumer preferences.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-[#1a1c2e]/40 backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/60 transition-all duration-300">
            <CardHeader>
              <Globe2 className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Strategic Expansion</CardTitle>
              <CardDescription className="text-gray-400">Launching in the Rhein-Ruhr metropolitan region, Germany's economic powerhouse with 10+ million inhabitants, before strategic expansion across key European markets.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-[#1a1c2e]/40 backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/60 transition-all duration-300">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Advanced Technology</CardTitle>
              <CardDescription className="text-gray-400">Proprietary AI-powered platform featuring real-time route optimization, intelligent driver matching, and predictive demand forecasting for maximum operational efficiency.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Info;