'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const SignInCard = () => {
  const router = useRouter();
  
  return (
    <Card className="backdrop-blur-sm bg-white/50 border border-maxmove-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-maxmove-900">
          Welcome back
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/50 px-2 text-maxmove-600">Or continue with</span>
          </div>
        </div>
        <GoogleSignInButton />
        <div className="text-center text-sm">
          <Button
            type="button"
            variant="link"
            className="text-maxmove-800 hover:text-maxmove-900 p-0"
            onClick={() => window.location.href = "/reset-password"}
          >
            Forgot your password?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};