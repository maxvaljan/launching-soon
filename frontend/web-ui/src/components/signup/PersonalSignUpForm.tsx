'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { PasswordInput } from '@/components/ui/password-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/services/user-service';

const personalFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(8, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const PersonalSignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');
  const router = useRouter();

  const form = useForm<z.infer<typeof personalFormSchema>>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  });

  const handleSignUp = async (formData: z.infer<typeof personalFormSchema>) => {
    try {
      setIsLoading(true);

      // Format the phone number with country code
      const userData = {
        ...formData,
        phoneNumber: `${countryCode}${formData.phoneNumber}`,
      };

      const success = await signUpUser(userData, 'personal');

      if (success) {
        router.push('/signin');
      }
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
                <PhoneInput
                  label="Phone Number"
                  countryCode={countryCode}
                  onCountryCodeChange={setCountryCode}
                  {...field}
                />
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
                <PasswordInput label="Password" {...field} />
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
