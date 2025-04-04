'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarDesktopMenuProps {
  getTextColor: () => string;
}

const NavbarDesktopMenu = ({ getTextColor }: NavbarDesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`transition-colors inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-white/10 ${getTextColor()}`}
        >
          How it Works <ChevronDown className="ml-1.5 h-4 w-4 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              href="/personal-delivery"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              Personal Delivery
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/business"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              Business Solutions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/drivers"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              Drivers
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={`transition-colors inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-white/10 ${getTextColor()}`}
        >
          Company <ChevronDown className="ml-1.5 h-4 w-4 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              href="/about"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              About Us
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/career"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              Careers
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/investment"
              className="w-full flex items-center text-[#192338] hover:text-[#192338]"
            >
              Investment
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarDesktopMenu;
