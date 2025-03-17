'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-muted">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/70 border border-maxmove-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-maxmove-900">
              {isComplete ? "Password Reset Complete" : "Create New Password"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isComplete ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                  className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-maxmove-700">
                  Your password has been reset successfully.
                </p>
                <Button
                  onClick={() => window.location.href = "/signin"}
                  className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white"
                >
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}