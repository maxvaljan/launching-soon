'use client';

import { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
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

// Type definition for FloatingLabelInput props
interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Custom floating label input component
const FloatingLabelInput = ({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  id = '',
  ...props
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Update hasValue whenever the value prop changes
  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => {
          onChange(e);
          setHasValue(e.target.value.length > 0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setHasValue(value.length > 0);
        }}
        className={`peer w-full border border-gray-300 rounded-md focus:border-[#294374] bg-transparent h-[50px] px-3 py-2.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute text-gray-500 duration-300 transform transition-all ${
          hasValue || focused
            ? 'text-sm scale-75 -translate-y-3 bg-white px-1 z-10 left-2 top-0'
            : 'text-base left-3 top-1/2 -translate-y-1/2'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

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
                    className="border border-gray-300 rounded-md focus:border-[#294374] bg-transparent h-[50px] px-3 py-2.5 w-auto text-sm focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex-1 relative">
                    <FloatingLabelInput id="identifier" label="Phone Number or Email" {...field} />
                  </div>
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
                <div className="relative h-[50px] border border-gray-300 rounded-md focus-within:border-[#294374] focus-within:ring-0 focus-within:ring-offset-0">
                  <FloatingLabelInput
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    className="border-none pr-10"
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
                  className="text-sm text-[#294374] hover:text-[#294374] underline-offset-2"
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
          className="w-full bg-maxmove-navy hover:bg-[#294374] text-white mt-4 py-3 font-semibold rounded-md h-[50px]"
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
};
