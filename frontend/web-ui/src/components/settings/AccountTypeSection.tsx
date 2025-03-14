'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, User, Building2, Truck } from "lucide-react";

interface AccountTypeSectionProps {
  userRole: string;
}

export const AccountTypeSection = ({ userRole }: AccountTypeSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Account Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Account */}
        <Card className={userRole === 'customer' ? "border-2 border-maxmove-600" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal
              {userRole === 'customer' && (
                <Badge className="ml-2 bg-maxmove-600">Current</Badge>
              )}
            </CardTitle>
            <CardDescription>For individual use</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Place personal delivery orders</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Order history and tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Free account</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {userRole === 'customer' ? (
              <Button className="w-full" disabled>Current Plan</Button>
            ) : (
              <Button className="w-full">Switch to Personal</Button>
            )}
          </CardFooter>
        </Card>

        {/* Business Account */}
        <Card className={userRole === 'business' ? "border-2 border-maxmove-600" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Business
              {userRole === 'business' && (
                <Badge className="ml-2 bg-maxmove-600">Current</Badge>
              )}
            </CardTitle>
            <CardDescription>For companies and organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Multiple users under one account</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>API integration available</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Invoicing and detailed reporting</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Dedicated account manager</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {userRole === 'business' ? (
              <Button className="w-full" disabled>Current Plan</Button>
            ) : (
              <Button className="w-full">Switch to Business</Button>
            )}
          </CardFooter>
        </Card>

        {/* Driver Account */}
        <Card className={userRole === 'driver' ? "border-2 border-maxmove-600" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Driver
              {userRole === 'driver' && (
                <Badge className="ml-2 bg-maxmove-600">Current</Badge>
              )}
            </CardTitle>
            <CardDescription>For delivery partners</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Accept delivery jobs</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Track earnings and payments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Set your own schedule</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Driver app access</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {userRole === 'driver' ? (
              <Button className="w-full" disabled>Current Plan</Button>
            ) : (
              <Button className="w-full">Apply as Driver</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};