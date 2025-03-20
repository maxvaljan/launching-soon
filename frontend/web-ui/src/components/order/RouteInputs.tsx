'use client';

import { Input } from "@/components/ui/input";
import { memo, useCallback } from "react";

interface RouteInputsProps {
  pickupValue?: string;
  dropoffValue?: string;
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const RouteInputs = memo(({ 
  pickupValue = '', 
  dropoffValue = '',
  onPickupChange,
  onDropoffChange
}: RouteInputsProps) => {
  
  const handlePickupChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPickupChange?.(e.target.value);
  }, [onPickupChange]);
  
  const handleDropoffChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDropoffChange?.(e.target.value);
  }, [onDropoffChange]);
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input 
          placeholder="Pickup location" 
          className="pl-10" 
          value={pickupValue}
          onChange={handlePickupChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
        </div>
      </div>
      <div className="relative">
        <Input 
          placeholder="Drop-off location" 
          className="pl-10" 
          value={dropoffValue}
          onChange={handleDropoffChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
});

RouteInputs.displayName = 'RouteInputs';

export default RouteInputs;