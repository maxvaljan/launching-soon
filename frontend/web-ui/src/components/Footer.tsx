'use client';

import { Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-maxmove-primary text-maxmove-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-maxmove-secondary">Maxmove</h3>
            <p className="text-maxmove-secondary opacity-90">
              Move anything, anytime, anywhere
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/maxmove" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity"
              >
                <Linkedin className="h-8 w-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-maxmove-secondary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/personal-delivery" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Personal Delivery
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-maxmove-secondary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-maxmove-secondary opacity-80 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-maxmove-secondary">Contact</h4>
            <ul className="space-y-2">
              <li className="text-maxmove-secondary opacity-90">
                contact@maxmove.com
              </li>
              <li className="text-maxmove-secondary opacity-90">+49 173 4224371</li>
              <li className="text-maxmove-secondary opacity-90">
                Eulenbergstr.37
                <br />
                51065 Köln, Deutschland
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-opacity-20 border-maxmove-secondary">
          <p className="text-center text-maxmove-secondary opacity-80">
            © {new Date().getFullYear()} Maxmove. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;