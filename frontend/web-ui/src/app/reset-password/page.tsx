'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-muted">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/signin"}
        className="absolute top-4 left-4 text-maxmove-800 hover:text-maxmove-900 hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Login
      </Button>
      
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/70 border border-maxmove-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-maxmove-900">
              Reset Your Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                  className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-maxmove-700">
                  We've sent password reset instructions to your email.
                </p>
                <p className="text-maxmove-600 text-sm">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <Button
                  onClick={() => window.location.href = "/signin"}
                  className="mt-4"
                  variant="outline"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}