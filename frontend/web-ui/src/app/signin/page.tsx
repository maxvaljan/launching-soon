'use client';

import { SignInCard } from '@/components/signin/SignInCard';

// This page component now only renders the card.
// The layout (background, centering) is handled within SignInCard to match SignUpCard.
export default function SignIn() {
  return <SignInCard />;
}
