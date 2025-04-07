'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { CountryCodeSelect } from '@/components/CountryCodeSelect';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Basic schema for phone number validation (can be enhanced)
const resetSchema = z.object({
  phoneNumber: z.string().min(5, 'Phone number seems too short'), // Basic validation
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49'); // Default country code

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const handleResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    setIsLoading(true);
    const fullPhoneNumber = `${countryCode}${values.phoneNumber}`;

    try {
      // Attempt to call the existing API, sending phone instead of email
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sending phone, though API might expect email
        body: JSON.stringify({ phone: fullPhoneNumber }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.error?.message || result.message || 'Failed to send reset instructions'
        );
      }

      toast.success('Password reset instructions sent if the phone number is registered.');
      form.reset(); // Clear form on success
      // Optionally redirect or show a success message state here
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      // Provide a generic message as the API might reject phone numbers currently
      toast.error(
        `Failed to send reset instructions. ${message.includes('failed') ? '' : message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-white">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-10 text-maxmove-800 hover:text-maxmove-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Login
      </Button>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-maxmove-900">Reset Your Password</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-0 border border-gray-300 rounded-md focus-within:border-maxmove-navy focus-within:ring-1 focus-within:ring-maxmove-navy">
                        {/* Country Code Selector - styled like SignInForm */}
                        <CountryCodeSelect
                          value={countryCode}
                          onChange={setCountryCode}
                          className="bg-transparent border-none focus:ring-0 pl-3 pr-1 w-auto" // Auto width
                        />
                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-300 mx-1"></div>
                        {/* Phone Number Input - styled like SignInForm */}
                        <Input
                          id="phoneNumber"
                          placeholder="Phone number"
                          type="tel" // Use tel type for phone numbers
                          {...field}
                          className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 h-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-maxmove-navy hover:bg-maxmove-navy/90 text-white py-6 font-semibold" // Navy button
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
