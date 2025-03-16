"use client"

import { cn } from "@/lib/utils"

interface AvatarProps {
  initials: string
  index: number
}

const avatarColors = [
  "bg-maxmove-navy",
  "bg-maxmove-dark-blue",
  "bg-maxmove-light-blue",
]

export function Avatar({ initials, index }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full h-8 w-8 text-white text-xs font-semibold border-2 border-white",
        avatarColors[index % avatarColors.length]
      )}
    >
      {initials}
    </div>
  )
}