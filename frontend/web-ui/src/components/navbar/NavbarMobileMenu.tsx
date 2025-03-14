'use client';

import Link from "next/link";
import { Truck, Briefcase, User, Building2, GraduationCap, DollarSign, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NavbarMobileMenuProps {
  session: any;
  handleSignOut: () => Promise<void>;
  navigate: any;
}

const NavbarMobileMenu = ({ session, handleSignOut, navigate }: NavbarMobileMenuProps) => {
  const router = useRouter();
  
  return (
    <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <div className="space-y-2">
          {session && (
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
            >
              <LayoutDashboard className="inline-block mr-2 h-4 w-4" />
              Dashboard
            </Link>
          )}
          <Link
            href="/personal-delivery"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <Truck className="inline-block mr-2 h-4 w-4" />
            Personal Delivery
          </Link>
          <Link
            href="/business"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <Briefcase className="inline-block mr-2 h-4 w-4" />
            Business Solutions
          </Link>
          <Link
            href="/drivers"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <User className="inline-block mr-2 h-4 w-4" />
            Drivers
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <Building2 className="inline-block mr-2 h-4 w-4" />
            About Us
          </Link>
          <Link
            href="/career"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <GraduationCap className="inline-block mr-2 h-4 w-4" />
            Career
          </Link>
          <Link
            href="/investment"
            className="block px-3 py-2 text-maxmove-700 hover:text-maxmove-900 transition-colors"
          >
            <DollarSign className="inline-block mr-2 h-4 w-4" />
            Investment
          </Link>
        </div>
        <div className="px-3 py-2">
          {session ? (
            <Button
              className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white transition-colors"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white transition-colors"
              onClick={() => window.location.href = "/signin"}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;