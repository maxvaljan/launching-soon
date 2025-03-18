'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountTypeTabsProps {
  accountType: string;
  onAccountTypeChange: (value: string) => void;
}

export const AccountTypeTabs = ({ accountType, onAccountTypeChange }: AccountTypeTabsProps) => {
  return (
    <div className="mb-8">
      <TabsList className="flex w-full rounded-xl overflow-hidden border-0 p-1 bg-maxmove-navy">
        <TabsTrigger 
          value="personal"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    bg-maxmove-navy text-maxmove-creme
                    hover:text-white focus:text-white
                    data-[state=active]:bg-maxmove-navy data-[state=active]:text-maxmove-creme
                    data-[state=active]:hover:text-white data-[state=active]:focus:text-white"
          onClick={() => onAccountTypeChange("personal")}
        >
          Personal
        </TabsTrigger>
        <TabsTrigger 
          value="business"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    bg-maxmove-navy text-maxmove-creme
                    hover:text-white focus:text-white
                    data-[state=active]:bg-maxmove-navy data-[state=active]:text-maxmove-creme
                    data-[state=active]:hover:text-white data-[state=active]:focus:text-white"
          onClick={() => onAccountTypeChange("business")}
        >
          Business
        </TabsTrigger>
        <TabsTrigger 
          value="driver"
          className="flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    bg-maxmove-navy text-maxmove-creme
                    hover:text-white focus:text-white
                    data-[state=active]:bg-maxmove-navy data-[state=active]:text-maxmove-creme
                    data-[state=active]:hover:text-white data-[state=active]:focus:text-white"
          onClick={() => onAccountTypeChange("driver")}
        >
          Driver
        </TabsTrigger>
      </TabsList>
    </div>
  );
};