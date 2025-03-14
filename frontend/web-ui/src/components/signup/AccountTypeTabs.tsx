'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountTypeTabsProps {
  accountType: string;
  onAccountTypeChange: (value: string) => void;
}

export const AccountTypeTabs = ({ accountType, onAccountTypeChange }: AccountTypeTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 mb-8 bg-maxmove-50/50">
      <TabsTrigger 
        value="personal"
        className="data-[state=active]:bg-white data-[state=active]:text-maxmove-900 data-[state=active]:shadow-sm py-3"
        onClick={() => onAccountTypeChange("personal")}
      >
        Personal
      </TabsTrigger>
      <TabsTrigger 
        value="business"
        className="data-[state=active]:bg-white data-[state=active]:text-maxmove-900 data-[state=active]:shadow-sm py-3"
        onClick={() => onAccountTypeChange("business")}
      >
        Business
      </TabsTrigger>
      <TabsTrigger 
        value="driver"
        className="data-[state=active]:bg-white data-[state=active]:text-maxmove-900 data-[state=active]:shadow-sm py-3"
        onClick={() => onAccountTypeChange("driver")}
      >
        Driver
      </TabsTrigger>
    </TabsList>
  );
};