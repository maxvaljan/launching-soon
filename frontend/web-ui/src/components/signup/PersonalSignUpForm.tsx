'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PhoneInput } from "./PhoneInput";
import { MarketingConsent } from "./MarketingConsent";
import { useState } from "react";

const personalFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  marketing: z.boolean().default(false),
});

interface PersonalSignUpFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const PersonalSignUpForm = ({ onSubmit, isLoading }: PersonalSignUpFormProps) => {
  const [countryCode, setCountryCode] = useState("+49");
  
  const form = useForm({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      marketing: false,
    },
  });

  const handleSubmit = async (data: z.infer<typeof personalFormSchema>) => {
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First name" {...field} className="bg-white/80 border-0" />
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
                  <Input placeholder="Last name" {...field} className="bg-white/80 border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} className="bg-white/80 border-0" />
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
                <Input type="password" placeholder="Password" {...field} className="bg-white/80 border-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <MarketingConsent form={form} />
        <Button 
          type="submit" 
          className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
};