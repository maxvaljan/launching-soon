"use client"

import { useState, useEffect } from "react"
import { getWaitlistCount } from "@/app/actions/waitlist"
import { 
  XIcon, 
  InstagramIcon, 
  DiscordIcon, 
  FacebookIcon, 
  LinkedInIcon 
} from "./icons"
import { Avatar } from "./avatar"
import { SocialIcon } from "./social-icon"
import { WaitlistForm } from "./waitlist-form"

export default function WaitlistSignup() {
  const [waitlistCount, setWaitlistCount] = useState(0)

  useEffect(() => {
    getWaitlistCount().then((count) => setWaitlistCount(count + 100))
  }, [])

  const handleSuccess = (count: number) => {
    setWaitlistCount(count + 100)
  }

  return (
    <section className="bg-gradient-to-br from-maxmove-navy to-maxmove-dark-blue py-0 mt-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto p-8 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-400">
                Join Our Delivery Service Waitlist
              </h2>
            </div>
            <div>
              <p className="text-lg sm:text-xl mb-8 text-gray-300">
                Be part of something innovative. Join thousands of others already gaining early access to our
                revolutionary delivery service for the German market.
              </p>
            </div>
            <div className="w-full">
              <WaitlistForm onSuccess={handleSuccess} />
            </div>
            <div>
              <div className="flex items-center justify-center mt-8">
                <div className="flex -space-x-2 mr-4">
                  <Avatar initials="JD" index={0} />
                  <Avatar initials="AS" index={1} />
                  <Avatar initials="MK" index={2} />
                </div>
                <p className="text-white font-semibold">{waitlistCount}+ people on the waitlist</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex justify-center space-x-6">
            <SocialIcon
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              icon={<XIcon className="w-6 h-6" />}
            />
            <SocialIcon
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              icon={<InstagramIcon className="w-6 h-6" />}
            />
            <SocialIcon
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              icon={<DiscordIcon className="w-6 h-6" />}
            />
            <SocialIcon
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              icon={<FacebookIcon className="w-6 h-6" />}
            />
            <SocialIcon
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              icon={<LinkedInIcon className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}