'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const SignInCard = () => {
  const router = useRouter();
  
  return (
    <div className="w-full h-full overflow-hidden grid md:grid-cols-2">
      <div className="relative hidden md:block h-screen bg-maxmove-800">
        <img
          src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png"
          alt="MaxMove Delivery"
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-maxmove-900">Welcome back</h1>
              <p className="text-balance text-muted-foreground">Sign in to your MaxMove account</p>
            </div>
            
            <SignInForm />

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>

            <GoogleSignInButton />

            <div className="mt-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">Don&apos;t have an account?</p>
              <Button
                onClick={() => window.location.href = "/account-type"}
                className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white py-6 font-semibold"
              >
                Create an Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};