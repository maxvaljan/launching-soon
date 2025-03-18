'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-[#294374] hover:bg-[#1c2d4f] shadow-sm border border-[#eeeeee]/20">
            <ChevronLeft className="h-5 w-5 text-[#eeeeee]" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
