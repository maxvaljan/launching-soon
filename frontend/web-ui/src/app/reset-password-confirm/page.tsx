'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPasswordConfirm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const supabase = createClientComponentClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw new Error(error.message);
      
      setIsComplete(true);
      toast.success("Your password has been reset successfully");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to reset password");
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
            <h1 className="text-2xl font-bold text-maxmove-900">
              {isComplete ? "Password Reset Complete" : "Create New Password"}
            </h1>
          </div>
          
          {!isComplete ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white py-6 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-maxmove-700">
                Your password has been reset successfully.
              </p>
              <Button
                onClick={() => window.location.href = "/signin"}
                className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white py-6 font-semibold"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}