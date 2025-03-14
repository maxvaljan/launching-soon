'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReportUrl } from "@/lib/services/reports";

const BackedByScience = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Backed by Science</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['BMVI Report', 'Deloitte Analysis', 'McKinsey Report'].map((reportName) => (
            <Card key={reportName} className="bg-white/5 backdrop-blur-sm border-gray-800">
              <CardHeader className="flex flex-col flex-1">
                <div className="flex-1">
                  <CardTitle className="text-white">{reportName}</CardTitle>
                  <CardDescription className="text-gray-400 min-h-[3rem]">
                    {reportName === 'BMVI Report' && 'Innovationsprogramm Logistik 2023: Government Report on the Future of Logistics in Germany'}
                    {reportName === 'Deloitte Analysis' && 'Global Smart Last-Mile Logistics Outlook'}
                    {reportName === 'McKinsey Report' && 'Digitizing mid- and last-mile logistics handovers to reduce waste'}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full border-gray-700 text-[#1A1F2C] hover:bg-white/5 hover:text-white hover:border-transparent transition-all duration-300"
                  onClick={() => window.open(getReportUrl(reportName), '_blank')}
                >
                  View
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BackedByScience;