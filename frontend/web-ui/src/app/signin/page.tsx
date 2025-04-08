'use client';

import { SignInCard } from '@/components/signin/SignInCard';

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-maxmove-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-maxmove-900">Welcome Back</h1>
        <SignInCard />
      </div>
    </div>
  );
}
