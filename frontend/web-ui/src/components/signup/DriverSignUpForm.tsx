'use client';

import { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CountryCodeSelect } from '@/components/CountryCodeSelect';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const driverFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(8, 'Invalid phone number'),
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

export const DriverSignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof driverFormSchema>>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  });

  const handleSignUp = async (data: z.infer<typeof driverFormSchema>) => {
    try {
      setIsLoading(true);

      // Format the phone number with country code
      const formattedData = {
        ...data,
        phoneNumber: `${countryCode}${data.phoneNumber}`,
      };

      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: formattedData.email,
        password: formattedData.password,
        phone: formattedData.phoneNumber,
        options: {
          data: {
            first_name: formattedData.firstName,
            last_name: formattedData.lastName,
            role: 'driver',
          },
        },
      });

      if (signUpError) throw signUpError;

      // Update profile with phone number and name
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone_number: formattedData.phoneNumber,
            name: `${formattedData.firstName} ${formattedData.lastName}`,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/driver-dashboard');
    } catch (error: any) {
      console.error('Error in sign up:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput id="firstName" label="First Name" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput id="lastName" label="Last Name" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
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
                <FloatingLabelInput id="email" label="Email" type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-stretch gap-2">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    className="border border-gray-300 rounded-md focus:border-[#294374] bg-transparent h-[50px] px-3 py-2.5 w-auto text-sm focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex-1 relative">
                    <FloatingLabelInput id="phoneNumber" label="Phone Number" {...field} />
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
            <FormItem>
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
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
    </Form>
  );
};
