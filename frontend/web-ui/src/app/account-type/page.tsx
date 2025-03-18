'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Car, ArrowLeft } from "lucide-react";

export default function AccountTypeSelectionPage() {
  const router = useRouter();

  const handleSelection = (type: "personal" | "business" | "driver") => {
    window.location.href = `/signup?type=${type}`;
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/"}
        className="absolute top-4 left-4 z-10 text-maxmove-800 hover:text-maxmove-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
      
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-maxmove-900">
            Select an account type
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Individual Account */}
          <Card className="group bg-maxmove-navy border-0 hover:shadow-lg transition-all duration-300 cursor-pointer" 
                onClick={() => handleSelection("personal")}>
            <CardHeader className="text-center">
              <User className="w-12 h-12 mx-auto text-maxmove-creme mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-creme group-hover:text-white transition-colors duration-200">Individual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-creme text-center group-hover:text-white transition-colors duration-200">
                For personal use and small businesses
              </p>
              <ul className="space-y-2 text-sm text-maxmove-creme group-hover:text-white transition-colors duration-200">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Fast and simple sign up
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Track deliveries in real-time
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Save favorite locations
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Wide range of vehicles
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Business Account */}
          <Card className="group bg-maxmove-navy border-0 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleSelection("business")}>
            <CardHeader className="text-center">
              <Building2 className="w-12 h-12 mx-auto text-maxmove-creme mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-creme group-hover:text-white transition-colors duration-200">Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-creme text-center group-hover:text-white transition-colors duration-200">
                For companies and enterprises
              </p>
              <ul className="space-y-2 text-sm text-maxmove-creme group-hover:text-white transition-colors duration-200">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Bulk delivery management
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Business analytics dashboard
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Centralized business wallet for multiple users
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Monthly corporate statements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Driver Account */}
          <Card className="group bg-maxmove-navy border-0 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleSelection("driver")}>
            <CardHeader className="text-center">
              <Car className="w-12 h-12 mx-auto text-maxmove-creme mb-4" />
              <CardTitle className="text-xl font-semibold text-maxmove-creme group-hover:text-white transition-colors duration-200">Driver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-maxmove-creme text-center group-hover:text-white transition-colors duration-200">
                Join our delivery fleet
              </p>
              <ul className="space-y-2 text-sm text-maxmove-creme group-hover:text-white transition-colors duration-200">
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Great Earnings
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Be your own boss
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
                  Flexible working hours
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-maxmove-creme group-hover:text-white transition-colors duration-200">•</span>
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
          <p className="text-maxmove-600 mb-3">
            Already have an account?
          </p>
          <Button
            className="bg-maxmove-navy hover:bg-maxmove-navy text-maxmove-creme py-6 px-8 font-semibold"
            onClick={() => window.location.href = "/signin"}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}