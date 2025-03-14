'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInCard } from "@/components/signin/SignInCard";
import { SignUpHeader } from "@/components/signup/SignUpHeader";

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-maxmove-100 to-maxmove-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/"}
        className="absolute top-4 left-4 text-maxmove-800 hover:text-maxmove-900 hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
      <div className="w-full max-w-md space-y-8">
        <SignUpHeader />
        <SignInCard />
        
        <div className="mt-6 text-center">
          <p className="mb-4 text-maxmove-700 font-medium">New to Maxmove?</p>
          <Button
            onClick={() => window.location.href = "/account-type"}
            className="w-full py-6 bg-maxmove-primary text-maxmove-secondary hover:bg-maxmove-primary/90 font-semibold text-lg"
          >
            Create an Account
          </Button>
        </div>
      </div>
    </div>
  );
}