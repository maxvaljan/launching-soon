'use client';

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Image from "next/image";

export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Failed to initiate Google sign in");
      }

      // This will redirect the user to Google sign in
      // When successful, it will redirect back to our redirectTo URL
      // which should handle the authentication

    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full bg-white hover:bg-gray-50" 
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <div className="relative h-5 w-5 mr-2">
        <Image 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          fill
          className="object-contain"
        />
      </div>
      {isLoading ? "Connecting..." : "Sign in with Google"}
    </Button>
  );
};