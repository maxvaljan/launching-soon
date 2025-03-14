'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Settings as SettingsIcon, User, Home, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

interface DashboardHeaderProps {
  session: any;
  isAdmin: boolean;
}

export default function DashboardHeader({ session, isAdmin }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("place-order");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Extract the current tab from the pathname
    const path = pathname.split('/')[2] || 'place-order';
    setActiveTab(path);
    setShowSettings(path === 'settings');
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const tabs = [
    { id: "place-order", label: "Place Order" },
    { id: "records", label: "Records" },
    { id: "wallet", label: "Wallet" },
  ];

  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className={`py-4 px-2 -mb-px font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "text-maxmove-primary font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-maxmove-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Navigation and Settings Buttons */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => router.push("/")}
            >
              <Home className="h-5 w-5" />
            </button>

            {isAdmin && (
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => router.push("/admin-dashboard")}
              >
                <UserCog className="h-5 w-5" />
              </button>
            )}

            <button
              className={`p-2 rounded-md transition-colors relative ${
                showSettings
                  ? "text-maxmove-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleSettingsClick}
            >
              <SettingsIcon className="h-5 w-5" />
              {showSettings && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-maxmove-primary" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => router.push("/profile")}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/account-switch")}>
                  Switch Account Type
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/preferences")}>
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}