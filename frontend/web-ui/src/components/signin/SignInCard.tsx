'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import Image from "next/image";

export const SignInCard = () => {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-maxmove-creme overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png"
          alt="MaxMove Background"
          layout="fill"
          objectFit="cover"
          className="blur-md"
          priority
        />
      </div>

      {/* Centered login card */}
      <div className="z-10 bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col gap-6 text-center">
          <div>
            <h1 className="text-2xl font-bold text-maxmove-navy">Welcome back</h1>
            <p className="text-sm text-maxmove-navy/70">Sign in to your MaxMove account</p>
          </div>

          <SignInForm />

          {/* Forgot password link */}
          <a
            href="/forgot-password"
            className="text-sm text-maxmove-navy hover:underline text-center"
          >
            Forgot your password?
          </a>

          {/* Divider */}
          <div className="relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-gray-300 z-0"></div>
            <span className="relative z-10 bg-white px-2 text-gray-500">Or</span>
          </div>

          <GoogleSignInButton />

          {/* Create account section */}
          <div className="text-sm mt-4">
            <p className="mb-2 text-maxmove-navy/70">Don&apos;t have an account?</p>
            <Button
              onClick={() => router.push('/account-type')}
              className="w-full bg-maxmove-navy hover:bg-maxmove-navy/90 text-white font-semibold"
            >
              Create an Account
            </Button>
          </div>
        </div>

        {/* Terms and privacy */}
        <p className="text-xs text-center text-gray-400 mt-6">
          By clicking continue, you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};
