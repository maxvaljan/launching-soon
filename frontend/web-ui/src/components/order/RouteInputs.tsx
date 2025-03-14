'use client';

import { Input } from "@/components/ui/input";

const RouteInputs = () => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input placeholder="Pickup location" className="pl-10" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
        </div>
      </div>
      <div className="relative">
        <Input placeholder="Drop-off location" className="pl-10" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RouteInputs;