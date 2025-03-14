'use client';

import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface NavbarUserMenuProps {
  session: any;
  handleSignOut: () => Promise<void>;
  getTextColor: () => string;
  isHomePage: boolean;
  isScrolled: boolean;
}

const NavbarUserMenu = ({ session, handleSignOut, getTextColor, isHomePage, isScrolled }: NavbarUserMenuProps) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    };

    checkAdminStatus();
  }, [session]);

  return (
    <div className="hidden md:flex items-center space-x-4">
      {session ? (
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Button
              variant="ghost"
              className={`transition-all duration-300 font-medium px-4 py-2 rounded-full ${getTextColor()}`}
              onClick={() => window.location.href = "/admin"}
            >
              Admin
            </Button>
          )}
          <Button
            variant="ghost"
            className={`transition-all duration-300 font-medium px-4 py-2 rounded-full ${getTextColor()}`}
            onClick={() => window.location.href = "/dashboard"}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-11 w-11 rounded-full bg-gradient-to-br from-[#9b87f5] via-[#8B5CF6] to-[#7E69AB] hover:scale-105 transition-all duration-300 ease-out"
              >
                <User className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-full bg-white/10 hover:bg-transparent transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              sideOffset={8}
              className="w-64 rounded-xl backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200"
            >
              <div className="px-3 pt-3 pb-2">
                <h3 className="text-sm font-medium text-gray-400">Account</h3>
              </div>
              <DropdownMenuItem 
                onClick={() => window.location.href = "/profile"}
                className="flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 transition-colors"
              >
                <User className="h-5 w-5 text-[#8B5CF6]" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.location.href = "/dashboard"}
                className="flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 text-[#8B5CF6]" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-200/50 dark:bg-white/20" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          variant="default"
          className={`transition-all duration-300 font-medium px-6 py-2 rounded-full ${
            isHomePage 
              ? isScrolled 
                ? "bg-maxmove-800 hover:bg-maxmove-900 text-white shadow-md" 
                : "bg-white/90 backdrop-blur-sm hover:bg-white text-maxmove-900 shadow-lg"
              : "bg-maxmove-800 hover:bg-maxmove-900 text-white shadow-md"
          }`}
          onClick={() => window.location.href = "/signin"}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

export default NavbarUserMenu;