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
import { Eye, EyeOff } from 'lucide-react';

const signInSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');
  const [showPassword, setShowPassword] = useState(false);

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
                <div className="flex items-stretch gap-2">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    className="border border-gray-300 rounded-md focus:border-maxmove-navy bg-transparent h-11 px-3 py-2.5 w-auto text-sm focus:ring-0 focus:ring-offset-0"
                  />
                  <Input
                    id="identifier"
                    placeholder="Email or phone number"
                    {...field}
                    className="flex-1 border border-gray-300 rounded-md focus:border-maxmove-navy bg-transparent h-11 px-3 py-2.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormControl>
                <div className="relative flex items-center border border-gray-300 rounded-md focus-within:border-maxmove-navy focus-within:ring-0 focus-within:ring-offset-0">
                  <Input
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 h-11 pr-10 pl-3 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormControl>
              <div className="flex justify-end mt-1">
                <a
                  href="/reset-password"
                  className="text-sm text-maxmove-navy hover:text-maxmove-navy/80 underline-offset-2 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-maxmove-navy hover:bg-maxmove-navy/90 text-white mt-4 py-3 font-semibold rounded-md h-11"
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Log In'}
        </Button>
      </form>
    </Form>
  );
};
