'use client';

import Link from "next/link";
import Image from "next/image";

export const SignUpHeader = () => {
  return (
    <div className="text-center space-y-4">
      <Link href="/" className="inline-block">
        <h2 className="text-3xl font-semibold tracking-tight text-[#192338] hover:opacity-80 transition-opacity">
          Maxmove
        </h2>
      </Link>
      <h1 className="text-2xl font-medium text-[#192338]">Create Your Account</h1>

    </div>
  );
};