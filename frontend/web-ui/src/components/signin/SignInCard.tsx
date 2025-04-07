'use client';

import { useRouter } from 'next/navigation';
import { SignInForm } from './SignInForm';
import { GoogleSignInButton } from './GoogleSignInButton';
import Image from 'next/image';

export const SignInCard = () => {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      {/* Add MaxMove illustration if available, similar to Lalamove */}
      {/* <div className="absolute left-0 bottom-0 w-1/3"> */}
      {/*   <Image src="/path/to/maxmove-illustration.svg" alt="MaxMove Illustration" width={500} height={500} /> */}
      {/* </div> */}

      {/* Centered login card - Increased width, removed border, enhanced shadow */}
      <div className="z-10 bg-white shadow-2xl rounded-lg p-8 sm:p-10 w-full max-w-lg mb-4">
        <div className="flex justify-center mb-8">
          <Image
            src="https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//2.png"
            alt="MaxMove Logo"
            width={150}
            height={40}
            priority
          />
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

          {/* Create account section - updated colors and weight */}
          <div className="text-sm text-center mt-4">
            <span className="text-maxmove-navy">New to MaxMove? </span>
            <a
              href="/account-type"
              onClick={e => {
                e.preventDefault();
                router.push('/account-type');
              }}
              className="font-bold text-[#294374] hover:text-[#294374]/80"
            >
              Create a free account
            </a>
          </div>
        </div>
      </div>

      {/* Terms and privacy links - ensure maxmove blue color */}
      <div className="text-xs text-center mb-8">
        <a href="/terms" className="text-[#294374]">
          Terms & Conditions
        </a>
        <span className="mx-1 text-[#294374]">•</span>
        <a href="/privacy-policy" className="text-[#294374]">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
