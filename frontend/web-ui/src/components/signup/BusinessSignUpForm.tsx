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
import type { BusinessUserData } from '@/lib/services/user-service';

const businessFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  workEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(8, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const BusinessSignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');
  const router = useRouter();

  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      companyName: '',
      firstName: '',
      lastName: '',
      workEmail: '',
      phoneNumber: '',
      password: '',
    },
  });

  const handleSignUp = async (formData: z.infer<typeof businessFormSchema>) => {
    try {
      setIsLoading(true);

      // Format the phone number with country code
      const userData: BusinessUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.workEmail,
        phoneNumber: `${countryCode}${formData.phoneNumber}`,
        password: formData.password,
        companyName: formData.companyName,
      };

      const success = await signUpUser(userData, 'business');

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
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput id="companyName" label="Company Name" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
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
          name="workEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput id="workEmail" label="Work Email" type="email" {...field} />
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
