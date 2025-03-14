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
            <div className="flex gap-2">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
              />
              <Input 
                className="flex-1 bg-white/80 border-0" 
                placeholder="Phone number" 
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};