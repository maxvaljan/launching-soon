'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CountryCodeSelect } from "@/components/CountryCodeSelect";
import { apiClient } from "@/lib/api";

const signInSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+49");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const isEmail = values.identifier.includes('@');
      
      // Prepare credentials based on identifier type
      const credentials = isEmail 
        ? { 
            email: values.identifier, 
            password: values.password 
          }
        : { 
            phone: `${countryCode}${values.identifier}`,
            password: values.password 
          };
      
      // Use our enhanced API client for login
      const { success, data, error } = await apiClient.auth.login(credentials);
      
      if (!success || error) {
        throw new Error(error || 'Authentication failed');
      }
      
      if (!data.user) {
        throw new Error('No user data returned');
      }
      
      // Show success message
      toast.success("Successfully signed in!");
      
      // Add a small delay before redirecting to ensure toast is seen
      setTimeout(() => {
        // Redirect based on role
        if (data.user.role === 'driver') {
          window.location.href = '/driver-dashboard';
        } else {
          window.location.href = '/dashboard/place-order';
        }
      }, 300);
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email/phone or password");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please confirm your email address before signing in");
      } else {
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="grid gap-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className="grid gap-2">

              <FormControl>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                  />
                  <Input
                    id="identifier"
                    placeholder="Email or phone number"
                    {...field}
                    className="flex-1 bg-maxmove-creme border-0 placeholder:text-maxmove-creme/50"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormControl>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="bg-maxmove-creme border-0 placeholder:text-maxmove-creme/50"
                />
              </FormControl>

              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-maxmove-creme hover:bg-white text-maxmove-navy mt-2 py-6 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex justify-center mt-4">
          <a 
            href="/reset-password" 
            className="text-sm text-maxmove-creme/70 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </Form>
  );
};