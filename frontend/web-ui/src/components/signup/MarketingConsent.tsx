'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface MarketingConsentProps {
  form: UseFormReturn<any>;
}

export const MarketingConsent = ({ form }: MarketingConsentProps) => {
  return (
    <FormField
      control={form.control}
      name="marketing"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="h-5 w-5 rounded-md border-[#294374] bg-[#192338] data-[state=checked]:bg-[#294374] data-[state=checked]:text-[#eeeeee]"
            />
          </FormControl>
          <div className="leading-none">
            <div className="text-sm text-[#eeeeee]">
              Keep me updated with offers and news from Maxmove
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};