'use client';

import { useRouter } from 'next/navigation';
import { SignInForm } from './SignInForm';
import { GoogleSignInButton } from './GoogleSignInButton';
import Image from 'next/image';

export const SignInCard = () => {
  const router = useRouter();

  return (
    // Apply the same page layout structure and background as SignUpCard
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden px-4 py-12">
      {/* Card - Match SignUpCard styles: max-w-lg, shadow-2xl, padding */}
      <div className="z-10 bg-white shadow-2xl rounded-lg p-8 sm:p-10 w-full max-w-lg mb-4">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="cursor-pointer" onClick={() => router.push('/')}>
            <Image
              src="https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//Maxmove%20Logo%20White.png"
              alt="MaxMove Logo"
              width={150}
              height={40}
              priority
            />
          </div>
        </div>

        {/* Form and Buttons Section */}
        <div className="flex flex-col gap-5">
          <SignInForm />

          {/* Divider */}
          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <GoogleSignInButton />

          {/* Create account link section */}
          <div className="text-sm text-center mt-4">
            <span className="text-maxmove-navy text-base">New to Maxmove? </span>
            <a
              href="/account-type"
              onClick={e => {
                e.preventDefault();
                router.push('/account-type'); // Navigate to account type selection which defaults to signup
              }}
              className="font-bold text-base text-[#294374] hover:underline"
            >
              Create a free account
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links - Match SignUpCard */}
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
