'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the supabase client directly for password reset
      const { data, error } = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(res => res.json());
      
      if (error) throw new Error(error.message || 'Reset password failed');
      
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-white">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/signin"}
        className="absolute top-4 left-4 z-10 text-maxmove-800 hover:text-maxmove-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Login
      </Button>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-maxmove-900">Reset Your Password</h1>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white py-6 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-maxmove-700">
                We've sent password reset instructions to your email.
              </p>
              <p className="text-maxmove-600">
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <Button
                onClick={() => window.location.href = "/signin"}
                className="bg-maxmove-800 hover:bg-maxmove-900 text-white py-6 font-semibold"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}