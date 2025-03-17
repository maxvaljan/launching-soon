'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInCard } from "@/components/signin/SignInCard";

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/"}
        className="absolute top-4 left-4 z-10 text-maxmove-800 hover:text-maxmove-900 hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
      
      <div className="flex-1 flex w-full h-full">
        <SignInCard />
      </div>
      
      <div className="absolute bottom-4 right-4 md:right-8 max-w-md text-balance text-center text-xs text-maxmove-grey [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white z-10">
        By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.
      </div>
    </div>
  );
}