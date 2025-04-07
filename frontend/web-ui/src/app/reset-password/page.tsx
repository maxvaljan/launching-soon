'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Use the supabase client directly for password reset
      const { error } = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(res => res.json());

      if (error) throw new Error(error.message || 'Reset password failed');

      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-maxmove-creme">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-10 text-maxmove-navy hover:text-maxmove-navy"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Login
      </Button>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6 p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-maxmove-navy">Reset Your Password</h1>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-maxmove-navy">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-transparent border border-maxmove-grey placeholder:text-maxmove-grey focus:bg-transparent focus:border-maxmove-creme focus:ring-maxmove-creme focus:ring-offset-maxmove-creme"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-maxmove-navy hover:bg-maxmove-navy/90 text-white py-6 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-maxmove-navy">
                We&apos;ve sent password reset instructions to your email.
              </p>
              <p className="text-maxmove-navy/70">
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <Button
                onClick={() => window.location.replace('/signin')}
                className="bg-maxmove-navy hover:bg-maxmove-navy/90 text-white py-6 font-semibold"
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
