'use client';

import { DollarSign } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FundingSection = () => {
  return (
    <section className="py-20 relative bg-[#0d0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Funding</h2>
        <div className="max-w-3xl mx-auto">
          <Card className="bg-[#1a1c2e] backdrop-blur-sm border-gray-800 hover:bg-[#1a1c2e]/80 transition-all duration-300">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Current Funding Round</CardTitle>
              <CardDescription className="text-gray-400">
                We are currently in the process for EXIST grant and looking to raise €15M next year 
                to build the first underground autonomous robots logistics pilot project. This funding will 
                enable us to revolutionize urban logistics with cutting-edge autonomous technology.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FundingSection;