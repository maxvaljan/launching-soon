'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountTypeTabsProps {
  accountType: string;
  onAccountTypeChange: (value: string) => void;
}

export const AccountTypeTabs = ({ accountType, onAccountTypeChange }: AccountTypeTabsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-center text-xl font-medium mb-6 text-[#eeeeee]">Choose account type</h2>
      <TabsList className="flex w-full rounded-xl overflow-hidden border border-[#294374] p-1 bg-[#192338]">
        <TabsTrigger 
          value="personal"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    data-[state=active]:bg-[#1c2d4f] data-[state=active]:text-[#eeeeee] data-[state=active]:shadow-sm
                    data-[state=inactive]:text-[#798390] data-[state=inactive]:hover:text-[#eeeeee]"
          onClick={() => onAccountTypeChange("personal")}
        >
          Personal
        </TabsTrigger>
        <TabsTrigger 
          value="business"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    data-[state=active]:bg-[#1c2d4f] data-[state=active]:text-[#eeeeee] data-[state=active]:shadow-sm
                    data-[state=inactive]:text-[#798390] data-[state=inactive]:hover:text-[#eeeeee]"
          onClick={() => onAccountTypeChange("business")}
        >
          Business
        </TabsTrigger>
        <TabsTrigger 
          value="driver"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    data-[state=active]:bg-[#1c2d4f] data-[state=active]:text-[#eeeeee] data-[state=active]:shadow-sm
                    data-[state=inactive]:text-[#798390] data-[state=inactive]:hover:text-[#eeeeee]"
          onClick={() => onAccountTypeChange("driver")}
        >
          Driver
        </TabsTrigger>
      </TabsList>
    </div>
  );
};