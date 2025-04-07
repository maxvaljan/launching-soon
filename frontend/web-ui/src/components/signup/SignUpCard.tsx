'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AccountTypeTabs } from './AccountTypeTabs';
import { PersonalSignUpForm } from './PersonalSignUpForm';
import { BusinessSignUpForm } from './BusinessSignUpForm';
import { DriverSignUpForm } from './DriverSignUpForm';

export const SignUpCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultAccountType = searchParams.get('type') || 'personal';

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      {/* Centered signup card - Same style as signin card */}
      <div className="z-10 bg-white shadow-2xl rounded-lg p-8 sm:p-10 w-full max-w-lg mb-4">
        <div className="flex justify-center mb-8">
          <Image
            src="https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//Maxmove%20Logo%20White.png"
            alt="MaxMove Logo"
            width={150}
            height={40}
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <Tabs value={defaultAccountType} className="w-full">
            <AccountTypeTabs
              accountType={defaultAccountType}
              onAccountTypeChange={type => router.push(`/signup?type=${type}`)}
            />

            <TabsContent value="personal">
              <PersonalSignUpForm />
            </TabsContent>

            <TabsContent value="business">
              <BusinessSignUpForm />
            </TabsContent>

            <TabsContent value="driver">
              <DriverSignUpForm />
            </TabsContent>
          </Tabs>

          {/* Sign in section - matching style to sign-in card */}
          <div className="text-sm text-center mt-4">
            <span className="text-maxmove-navy text-base">Already have an account? </span>
            <a
              href="/signin"
              onClick={e => {
                e.preventDefault();
                router.push('/signin');
              }}
              className="font-bold text-base text-[#294374]"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>

      {/* Terms and privacy links - same style as signin */}
      <div className="text-sm text-center mt-4">
        <a href="/terms" className="text-gray-500 hover:text-gray-600">
          Terms & Conditions
        </a>
        <span className="text-gray-500 mx-1">•</span>
        <a href="/privacy" className="text-gray-500 hover:text-gray-600">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
