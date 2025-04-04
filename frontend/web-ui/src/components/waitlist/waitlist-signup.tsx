'use client';

import { useState, useEffect } from 'react';
import { getWaitlistCount } from '@/app/actions/waitlist';
import { XIcon, InstagramIcon, LinkedInIcon } from './icons';
import { Avatar } from './avatar';
import { SocialIcon } from './social-icon';
import { WaitlistForm } from './waitlist-form';

export default function WaitlistSignup() {
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    getWaitlistCount().then(count => setWaitlistCount(count + 100));
  }, []);

  const handleSuccess = (count: number) => {
    setWaitlistCount(count + 100);
  };

  return (
    <section className="w-full py-8 md:py-16 mt-0 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[url('https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//waitlist%20background.png')] bg-cover bg-[95%_30%] md:bg-[center_30%]">
        <div className="absolute inset-0 bg-maxmove-navy/60" />
      </div>

      <div className="w-full max-w-xl mx-auto p-8 flex flex-col justify-between relative z-10 h-full">
        <div className="pt-20 md:pt-28 flex-1 flex flex-col justify-center items-center text-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-maxmove-creme">
              We are launching soon!
            </h2>
          </div>
          <div>
            <p className="text-lg sm:text-xl mb-8 text-maxmove-creme">
              Join our Waitlist to get exclusive benefits and early access.
            </p>
          </div>
          <div className="w-full">
            <WaitlistForm onSuccess={handleSuccess} />
          </div>
          <div>
            <div className="flex items-center justify-center mt-6">
              <div className="flex -space-x-2 mr-4">
                <Avatar initials="JD" index={0} />
                <Avatar initials="AS" index={1} />
                <Avatar initials="MK" index={2} />
              </div>
              <p className="text-white font-semibold">{waitlistCount}+ people on the waitlist</p>
            </div>
          </div>
        </div>
        <div className="pt-6 flex justify-center space-x-6">
          <SocialIcon
            href="https://x.com/maxmoveapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter)"
            icon={<XIcon className="w-6 h-6" />}
          />
          <SocialIcon
            href="https://www.instagram.com/maxmoveapp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            icon={<InstagramIcon className="w-6 h-6" />}
          />
          <SocialIcon
            href="https://www.linkedin.com/company/maxmove"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            icon={<LinkedInIcon className="w-6 h-6" />}
          />
        </div>
      </div>
    </section>
  );
}
