'use client';

import { Rocket, ChartLine } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Future = () => {
  return (
    <section className="py-20 relative bg-[#0d0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Future</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#1a1c2e] backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/80 transition-all duration-300">
              <CardHeader>
                <Rocket className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle className="text-white">Underground Hyperlogistics</CardTitle>
                <CardDescription className="text-gray-400">
                  Building the future of urban logistics with underground pipeline networks. 
                  Leveraging existing infrastructure to deploy autonomous robots that can deliver 
                  anything in less than 15 minutes from central warehouses to stations distributed 
                  throughout the city.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-[#1a1c2e] backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/80 transition-all duration-300">
              <CardHeader>
                <ChartLine className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle className="text-white">Autonomous Delivery</CardTitle>
                <CardDescription className="text-gray-400">
                  Pioneering the future of delivery with a dual approach: launching Europe's first 
                  comprehensive drone delivery network and introducing autonomous vehicle delivery 
                  systems to revolutionize urban logistics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Future;