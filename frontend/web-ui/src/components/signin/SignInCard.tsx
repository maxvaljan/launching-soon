'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const SignInCard = () => {
  const router = useRouter();
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="relative hidden md:block">
          <img
            src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png"
            alt="MaxMove Delivery"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-maxmove-900">Welcome back</h1>
              <p className="text-balance text-muted-foreground">Sign in to your MaxMove account</p>
            </div>
            
            <SignInForm />

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>

            <GoogleSignInButton />

            <div className="mt-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">Don&apos;t have an account?</p>
              <Button
                onClick={() => window.location.href = "/account-type"}
                className="w-full bg-maxmove-primary text-maxmove-secondary hover:bg-maxmove-primary/90"
              >
                Create an Account
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};