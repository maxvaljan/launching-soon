'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PhoneInput } from "./PhoneInput";

import { useState } from "react";

const businessFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Please select an industry"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  workEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),

});

interface BusinessSignUpFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const BusinessSignUpForm = ({ onSubmit, isLoading }: BusinessSignUpFormProps) => {
  const [countryCode, setCountryCode] = useState("+49");

  const form = useForm({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      firstName: "",
      lastName: "",
      workEmail: "",
      phoneNumber: "",
      password: "",

    },
  });
  
  const handleSubmit = async (data: z.infer<typeof businessFormSchema>) => {
    // Format the phone number with country code
    const formattedData = {
      ...data,
      phoneNumber: `${countryCode}${data.phoneNumber}`,
    };
    
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Company name" {...field} className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#192338] text-[#eeeeee] border border-[#798390]">
                  <SelectItem className="hover:bg-[#1c2d4f] focus:bg-[#1c2d4f]" value="retail">Retail</SelectItem>
                  <SelectItem className="hover:bg-[#1c2d4f] focus:bg-[#1c2d4f]" value="technology">Technology</SelectItem>
                  <SelectItem className="hover:bg-[#1c2d4f] focus:bg-[#1c2d4f]" value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem className="hover:bg-[#1c2d4f] focus:bg-[#1c2d4f]" value="services">Services</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First name" {...field} className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last name" {...field} className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="workEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Work email" {...field} className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PhoneInput form={form} countryCode={countryCode} setCountryCode={setCountryCode} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} className="h-11 rounded-lg border border-[#798390] bg-[#192338] text-[#eeeeee] placeholder:text-[#798390] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:border-[#eeeeee]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-[#eeeeee] hover:bg-[#eeeeee]/90 text-[#192338] font-medium border-0" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#192338] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#192338]">Creating account...</span>
            </div>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
};