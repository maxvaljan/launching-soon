'use client';

import Link from 'next/link';
import {
  Truck,
  Briefcase,
  User,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronRight,
  Home,
  UserCircle,
  Info,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CustomSession {
  email?: string;
  user?: {
    email?: string;
    role?: string;
  };
  role?: string;
}

interface NavbarMobileMenuProps {
  session: CustomSession | null;
  handleSignOut: () => Promise<void>;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const NavbarMobileMenu = ({
  session,
  handleSignOut,
  setIsMobileMenuOpen,
}: NavbarMobileMenuProps) => {
  const router = useRouter();

  const MenuItem = ({
    href,
    icon: Icon,
    label,
    onClick,
  }: {
    href?: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }) => {
    const content = (
      <>
        <div className="flex items-center flex-1">
          <Icon className="h-5 w-5 text-maxmove-navy" />
          <span className="ml-3 font-medium text-maxmove-navy">{label}</span>
        </div>
        {href && <ChevronRight className="h-4 w-4 text-maxmove-grey" />}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-maxmove-navy/5 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={() => {
          if (onClick) onClick();
          setIsMobileMenuOpen(false);
        }}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-maxmove-navy/5 transition-colors"
      >
        {content}
      </button>
    );
  };

  const CategoryLabel = ({ label }: { label: string }) => (
    <div className="px-4 py-2 mt-6 mb-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-maxmove-grey">{label}</h3>
    </div>
  );

  const Divider = () => <div className="h-px bg-maxmove-navy/10 my-2 mx-4" />;

  return (
    <div className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden">
      <div className="py-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {session && (
          <>
            <div className="flex items-center px-4 py-4 bg-maxmove-navy/5 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-maxmove-navy via-maxmove-blue to-maxmove-blue flex items-center justify-center">
                <span className="text-lg font-semibold text-maxmove-creme">
                  {(typeof session.email === 'string'
                    ? session.email.charAt(0)
                    : session.user?.email?.charAt(0) || 'U'
                  ).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-maxmove-navy">
                  {session.email || session.user?.email || 'User'}
                </p>
                <p className="text-sm text-maxmove-grey">
                  {session.role || session.user?.role || 'Customer'}
                </p>
              </div>
            </div>

            <CategoryLabel label="Account" />
            <MenuItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <MenuItem href="/profile" icon={UserCircle} label="Profile" />
            <MenuItem href="/dashboard/settings" icon={Settings} label="Settings" />
          </>
        )}

        <CategoryLabel label="Navigation" />
        <MenuItem href="/" icon={Home} label="Home" />
        <MenuItem href="/personal-delivery" icon={Truck} label="Personal Delivery" />
        <MenuItem href="/business" icon={Briefcase} label="Business Solutions" />
        <MenuItem href="/drivers" icon={User} label="Drivers" />

        <CategoryLabel label="Company" />
        <MenuItem href="/about" icon={Info} label="About" />
        <MenuItem href="/contact" icon={Mail} label="Contact" />
        <MenuItem href="/investment" icon={Building2} label="Investment" />

        <Divider />
        <div className="px-4 py-3">
          {session ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 flex items-center justify-center gap-2 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              className="w-full bg-maxmove-navy hover:bg-maxmove-blue text-white font-medium py-2.5 rounded-xl"
              onClick={() => router.push('/signin')}
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
