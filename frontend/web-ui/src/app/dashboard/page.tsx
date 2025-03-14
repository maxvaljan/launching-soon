'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the place-order tab by default
    router.push('/dashboard/place-order');
  }, [router]);

  return null;
}