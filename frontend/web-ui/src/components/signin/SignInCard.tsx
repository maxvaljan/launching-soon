'use client';

import { useRouter } from 'next/navigation';
import { SignInForm } from './SignInForm';
import { GoogleSignInButton } from './GoogleSignInButton';
import Image from 'next/image';

export const SignInCard = () => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 sm:p-10 w-full">
      {/* Card content starts here */}
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

        {/* Create account section */}
        <div className="text-sm text-center mt-4">
          <span className="text-maxmove-navy text-base">New to Maxmove? </span>
          <a
            href="/account-type"
            onClick={e => {
              e.preventDefault();
              router.push('/account-type');
            }}
            className="font-bold text-base text-[#294374] hover:underline"
          >
            Create a free account
          </a>
        </div>
      </div>

      {/* Removed Terms and Privacy links from here - they should be outside the card */}
    </div>
  );
};
