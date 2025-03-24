"use client"

import * as React from "react"
import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Clock, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface AnnouncementBannerProps {
  month?: string
  waitlistLink?: string
}

const AnnouncementBanner = React.forwardRef<HTMLDivElement, AnnouncementBannerProps>(
  ({ month = "October", waitlistLink = "/waitlist" }, ref) => {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
      <Banner 
        ref={ref}
        variant="primary" 
        className="bg-indigo-900 text-white"
      >
        <div className="flex w-full gap-2 md:items-center">
          <div className="flex grow gap-3 md:items-center">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 max-md:mt-0.5"
              aria-hidden="true"
            >
              <Clock className="text-white" size={16} strokeWidth={2} />
            </div>
            <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
              <p className="text-sm font-medium">
                Coming Soon! We're launching in {month}
              </p>
              <div className="flex gap-2 max-md:flex-wrap">
                <Button 
                  size="sm" 
                  className="bg-white text-indigo-900 hover:bg-white/90 text-sm transition-all"
                  asChild
                >
                  <Link href={waitlistLink}>Join waitlist</Link>
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent hover:text-white/80"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
          >
            <X
              size={16}
              strokeWidth={2}
              className="text-white/80 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </Banner>
    )
  }
)

AnnouncementBanner.displayName = "AnnouncementBanner"

export { AnnouncementBanner } 