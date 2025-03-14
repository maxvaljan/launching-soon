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
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="border-maxmove-300 data-[state=checked]:bg-maxmove-600 data-[state=checked]:border-maxmove-600"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <div className="text-sm text-maxmove-600">
              Keep me updated with offers and news from Maxmove
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};