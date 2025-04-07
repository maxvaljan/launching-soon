'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Car } from 'lucide-react';
import Image from 'next/image';

export default function AccountTypeSelectionPage() {
  const router = useRouter();

  const handleSelection = (type: 'personal' | 'business' | 'driver') => {
    router.push(`/signup?type=${type}`);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      {/* Centered card - using the same shadow styling and width constraints as sign in page */}
      <div className="z-10 bg-white shadow-2xl rounded-lg p-8 sm:p-10 w-full max-w-4xl mb-4">
        <div className="flex justify-center mb-8">
          <div className="cursor-pointer" onClick={() => router.push('/')}>
            <Image
              src="https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//Maxmove%20Logo%20White.png"
              alt="MaxMove Logo"
              width={150}
              height={40}
              priority
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-maxmove-navy">Select an account type</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Individual Account */}
          <Card
            className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleSelection('personal')}
          >
            <CardHeader className="text-center">
              <User className="w-10 h-10 mx-auto text-maxmove-navy mb-2" />
              <CardTitle className="text-lg font-semibold text-maxmove-navy">Individual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                For personal use and small businesses
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Fast and simple sign up
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Track deliveries in real-time
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Save favorite locations
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Wide range of vehicles
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Business Account */}
          <Card
            className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleSelection('business')}
          >
            <CardHeader className="text-center">
              <Building2 className="w-10 h-10 mx-auto text-maxmove-navy mb-2" />
              <CardTitle className="text-lg font-semibold text-maxmove-navy">Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 text-center">For companies and enterprises</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Bulk delivery management
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Business analytics dashboard
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Centralized business wallet for multiple users
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Monthly corporate statements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Driver Account */}
          <Card
            className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleSelection('driver')}
          >
            <CardHeader className="text-center">
              <Car className="w-10 h-10 mx-auto text-maxmove-navy mb-2" />
              <CardTitle className="text-lg font-semibold text-maxmove-navy">Driver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 text-center">Join our delivery fleet</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Great Earnings
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Be your own boss
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Flexible working hours
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-navy">•</span>
                  Choose your vehicle type
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-sm text-center text-gray-600 mt-6">
          <p>You can modify, upgrade or add multiple profiles to your account after signing up.</p>
        </div>

        {/* Sign in section - matching the exact styling of "create account" on sign in page */}
        <div className="text-sm text-center mt-8">
          <span className="text-maxmove-navy text-base">Already have an account? </span>
          <a
            href="/signin"
            onClick={e => {
              e.preventDefault();
              router.push('/signin');
            }}
            className="font-bold text-base text-[#294374]"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
