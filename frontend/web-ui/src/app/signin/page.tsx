'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInCard } from "@/components/signin/SignInCard";
import { SignUpHeader } from "@/components/signup/SignUpHeader";

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-muted">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/"}
        className="absolute top-4 left-4 text-maxmove-800 hover:text-maxmove-900 hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignInCard />
        
        <div className="text-balance text-center text-xs text-muted-foreground mt-6 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}