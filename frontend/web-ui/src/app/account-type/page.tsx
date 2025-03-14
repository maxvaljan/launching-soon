'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Car } from "lucide-react";

export default function AccountTypeSelectionPage() {
  const router = useRouter();

  const handleSelection = (type: "personal" | "business" | "driver") => {
    window.location.href = `/signup?type=${type}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maxmove-100 to-maxmove-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-maxmove-900">
            Select an account type
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Individual Account */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
                onClick={() => handleSelection("personal")}>
            <CardHeader className="text-center">
              <User className="w-12 h-12 mx-auto text-maxmove-800 mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-900">Individual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-600 text-center">
                For personal use and small businesses
              </p>
              <ul className="space-y-2 text-sm text-maxmove-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Fast and simple sign up
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Track deliveries in real-time
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Save favorite locations
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Wide range of vehicles
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Business Account */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleSelection("business")}>
            <CardHeader className="text-center">
              <Building2 className="w-12 h-12 mx-auto text-maxmove-800 mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-900">Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-600 text-center">
                For companies and enterprises
              </p>
              <ul className="space-y-2 text-sm text-maxmove-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Bulk delivery management
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Business analytics dashboard
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Centralized business wallet for multiple users
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Monthly corporate statements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Driver Account */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleSelection("driver")}>
            <CardHeader className="text-center">
              <Car className="w-12 h-12 mx-auto text-maxmove-800 mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-900">Driver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-600 text-center">
                Join our delivery fleet
              </p>
              <ul className="space-y-2 text-sm text-maxmove-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Great Earnings
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Be your own boss
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Flexible working hours
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Choose your vehicle type
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-maxmove-600">
          <p>Your account type can be upgraded or modified at any time.</p>
        </div>

        <div className="text-center mt-8">
          <p className="text-maxmove-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-maxmove-800 hover:text-maxmove-900"
              onClick={() => window.location.href = "/signin"}
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}