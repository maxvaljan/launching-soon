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
      

    </div>
  );
}