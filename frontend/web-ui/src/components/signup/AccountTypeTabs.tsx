'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccountTypeTabsProps {
  accountType: string;
  onAccountTypeChange: (type: string) => void;
}

export const AccountTypeTabs = ({ accountType, onAccountTypeChange }: AccountTypeTabsProps) => {
  return (
    <TabsList className="w-full grid grid-cols-3 gap-2 bg-transparent mb-6">
      <TabsTrigger
        value="personal"
        onClick={() => onAccountTypeChange('personal')}
        className={`rounded-md data-[state=active]:bg-maxmove-navy data-[state=active]:text-white data-[state=active]:shadow-md py-2 ${
          accountType === 'personal'
            ? 'bg-maxmove-navy text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Personal
      </TabsTrigger>
      <TabsTrigger
        value="business"
        onClick={() => onAccountTypeChange('business')}
        className={`rounded-md data-[state=active]:bg-maxmove-navy data-[state=active]:text-white data-[state=active]:shadow-md py-2 ${
          accountType === 'business'
            ? 'bg-maxmove-navy text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Business
      </TabsTrigger>
      <TabsTrigger
        value="driver"
        onClick={() => onAccountTypeChange('driver')}
        className={`rounded-md data-[state=active]:bg-maxmove-navy data-[state=active]:text-white data-[state=active]:shadow-md py-2 ${
          accountType === 'driver'
            ? 'bg-maxmove-navy text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Driver
      </TabsTrigger>
    </TabsList>
  );
};
