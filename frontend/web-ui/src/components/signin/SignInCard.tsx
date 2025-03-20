'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import Image from "next/image";

export const SignInCard = () => {
  const router = useRouter();
  
  return (
    <div className="w-full h-full overflow-hidden grid md:grid-cols-2">
      <div className="relative hidden md:block h-screen bg-maxmove-800">
        <Image
          src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png"
          alt="MaxMove Delivery"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      <div className="flex items-center justify-center bg-maxmove-navy">
        <div className="w-full max-w-md p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-maxmove-creme">Welcome back</h1>
              <p className="text-balance text-maxmove-creme">Sign in to your MaxMove account</p>
            </div>
            
            <SignInForm />

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-maxmove-creme/30">
              <span className="relative z-10 bg-maxmove-navy px-2 text-maxmove-creme">Or</span>
            </div>

            <GoogleSignInButton />

            <div className="mt-4 text-center">
              <p className="mb-3 text-sm text-maxmove-creme">Don&apos;t have an account?</p>
              <Button
                onClick={() => router.push('/account-type')}
                className="w-full bg-maxmove-creme hover:bg-white text-maxmove-navy py-6 font-semibold"
              >
                Create an Account
              </Button>

            </div>
          </div>
          <p className="text-xs text-maxmove-creme/60 text-center px-2 mt-16 mb-2">
            By clicking continue, you agree to our {" "}
            <a href="/terms" className="text-maxmove-creme/80 hover:text-white">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-maxmove-creme/80 hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};