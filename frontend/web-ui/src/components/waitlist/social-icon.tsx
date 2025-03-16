"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface SocialIconProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode
}

export function SocialIcon({
  icon,
  className,
  ...props
}: SocialIconProps) {
  return (
    <a
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-maxmove-navy text-white transition-colors hover:bg-maxmove-light-blue",
        className
      )}
      {...props}
    >
      {icon}
    </a>
  )
}