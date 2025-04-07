'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface NavbarUserMenuProps {
  session: any;
  handleSignOut: () => Promise<void>;
  getTextColor: () => string;
  isHomePage: boolean;
  isScrolled: boolean;
}

const NavbarUserMenu = ({
  session,
  handleSignOut,
  getTextColor,
  isHomePage,
  isScrolled,
}: NavbarUserMenuProps) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name, first_name, last_name')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
      setUserName(
        profile?.name ||
          (profile?.first_name && profile?.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : session.user.email || 'User')
      );
    };

    checkUserProfile();
  }, [session]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      {session ? (
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Button
              variant="ghost"
              className={`transition-all duration-300 font-medium px-4 py-2 rounded-xl ${getTextColor()}`}
              onClick={() => handleNavigate('/admin')}
            >
              Admin
            </Button>
          )}
          <Button
            variant="ghost"
            className={`transition-all duration-300 font-medium px-4 py-2 rounded-xl ${getTextColor()}`}
            onClick={() => handleNavigate('/dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full bg-gradient-to-br from-[#192338] via-[#294374] to-[#294374] hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="font-medium text-maxmove-creme">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64">
              <DropdownMenuLabel className="px-4 py-2.5">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="px-4 py-2.5">
                <User className="h-4 w-4 mr-2.5 text-maxmove-navy/70" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigate('/dashboard')}
                className="px-4 py-2.5"
              >
                <LayoutDashboard className="h-4 w-4 mr-2.5 text-maxmove-navy/70" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigate('/dashboard/settings')}
                className="px-4 py-2.5"
              >
                <Settings className="h-4 w-4 mr-2.5 text-maxmove-navy/70" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          variant="default"
          className={`transition-all duration-300 font-medium px-6 py-2 rounded-xl ${
            isHomePage
              ? isScrolled
                ? 'bg-maxmove-navy hover:bg-maxmove-blue text-white shadow-md'
                : 'bg-white/90 backdrop-blur-sm hover:bg-white text-maxmove-navy shadow-lg'
              : 'bg-maxmove-navy hover:bg-maxmove-blue text-white shadow-md'
          }`}
          onClick={() => handleNavigate('/signin')}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

export default NavbarUserMenu;
