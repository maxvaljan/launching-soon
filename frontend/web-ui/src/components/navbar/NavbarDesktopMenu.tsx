'use client';

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarDesktopMenuProps {
  getTextColor: () => string;
}

const NavbarDesktopMenu = ({ getTextColor }: NavbarDesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={`transition-colors inline-flex items-center w-[140px] justify-center ${getTextColor()}`}
        >
          How it Works <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem>
            <Link href="/personal-delivery" className="w-full text-maxmove-navy">
              Personal Delivery
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/business" className="w-full text-maxmove-navy">
              Business Solutions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/drivers" className="w-full text-maxmove-navy">
              Drivers
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={`transition-colors inline-flex items-center w-[120px] justify-center ${getTextColor()}`}
        >
          Company <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem>
            <Link href="/about" className="w-full text-maxmove-navy">
              About Us
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/career" className="w-full text-maxmove-navy">
              Careers
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/investment" className="w-full text-maxmove-navy">
              Investment
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/roadmap" className="w-full text-maxmove-navy">
              Roadmap
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarDesktopMenu;