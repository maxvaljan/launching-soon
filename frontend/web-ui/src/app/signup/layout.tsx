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
    <div className="relative bg-[#192338] min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-transparent hover:bg-transparent border-0 shadow-none">
            <ChevronLeft className="h-5 w-5 text-[#F5F5DC]" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
