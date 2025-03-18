'use client';

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CountryCodeSelect } from "@/components/CountryCodeSelect";
import { UseFormReturn } from "react-hook-form";

interface PhoneInputProps {
  form: UseFormReturn<any>;
  countryCode: string;
  setCountryCode: (value: string) => void;
}

export const PhoneInput = ({ form, countryCode, setCountryCode }: PhoneInputProps) => {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-2 relative">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
                className="w-24 rounded-lg transition-all duration-200"
              />
              <Input 
                className="flex-1 h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee] transition-all duration-200 pl-3" 
                placeholder="Phone number" 
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs mt-1 text-red-400" />
        </FormItem>
      )}
    />
  );
};