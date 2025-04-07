'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CountryCodeSelect } from '@/components/CountryCodeSelect';
import { apiClient } from '@/lib/api';

const signInSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
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
            password: values.password,
          }
        : {
            phone: `${countryCode}${values.identifier}`,
            password: values.password,
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
      toast.success('Successfully signed in!');

      // Add a small delay before redirecting to ensure toast is seen
      setTimeout(() => {
        // Redirect based on role
        if (data.user.role === 'admin' || data.user.email === 'max.valjan@icloud.com') {
          window.location.href = '/admin';
        } else if (data.user.role === 'driver') {
          window.location.href = '/driver-dashboard';
        } else {
          window.location.href = '/dashboard/place-order';
        }
      }, 300);
    } catch (error: unknown) {
      console.error('Sign in error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email/phone or password');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Please confirm your email address before signing in');
      } else {
        toast.error(errorMessage);
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
                    className="bg-transparent border border-maxmove-grey"
                  />
                  <Input
                    id="identifier"
                    placeholder="Email or phone number"
                    {...field}
                    className="flex-1 bg-transparent border border-maxmove-grey placeholder:text-maxmove-grey focus:bg-transparent focus:border-maxmove-creme focus:ring-maxmove-creme focus:ring-offset-maxmove-creme"
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
                  className="bg-transparent border border-maxmove-grey placeholder:text-maxmove-grey focus:bg-transparent focus:border-maxmove-creme focus:ring-maxmove-creme focus:ring-offset-maxmove-creme"
                />
              </FormControl>
              <div className="flex justify-end">
                <a
                  href="/reset-password"
                  className="text-sm text-maxmove-navy/70 hover:text-maxmove-navy underline-offset-2 hover:underline transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-maxmove-creme hover:bg-white text-maxmove-navy mt-2 py-6 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
};
